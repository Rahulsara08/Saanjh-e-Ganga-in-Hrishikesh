import cv2
import numpy as np
from skimage.morphology import skeletonize
import json

def get_segments(skel, min_len=4):
    ys, xs = np.where(skel)
    pts_set = set(zip(xs, ys))
    nbrs = [(-1,-1), (0,-1), (1,-1), (-1,0), (1,0), (-1,1), (0,1), (1,1)]
    deg = {p: sum((p[0]+dx, p[1]+dy) in pts_set for dx, dy in nbrs) for p in pts_set}
    visited_edges = set()
    segments = []
    
    start_nodes = [p for p in pts_set if deg[p] != 2]
    if not start_nodes and pts_set:
        start_nodes = [list(pts_set)[0]]
        
    for start in start_nodes:
        for dx, dy in nbrs:
            nxt = (start[0]+dx, start[1]+dy)
            if nxt in pts_set:
                edge = (min(start, nxt), max(start, nxt))
                if edge not in visited_edges:
                    visited_edges.add(edge)
                    seg = [start, nxt]
                    curr, prev = nxt, start
                    while deg.get(curr, 0) == 2:
                        found = False
                        for ddx, ddy in nbrs:
                            cand = (curr[0]+ddx, curr[1]+ddy)
                            if cand in pts_set and cand != prev:
                                c_edge = (min(curr, cand), max(curr, cand))
                                visited_edges.add(c_edge)
                                seg.append(cand)
                                prev, curr = curr, cand
                                found = True
                                break
                        if not found:
                            break
                    if len(seg) >= min_len:
                        segments.append(seg)
    return segments

def simplify_segment(pts, eps=0.7):
    arr = np.array(pts, dtype=np.float32).reshape((-1, 1, 2))
    approx = cv2.approxPolyDP(arr, eps, False)
    return approx.reshape((-1, 2)).tolist()

def points_to_svg_path(pts):
    if len(pts) < 2:
        return ''
    if len(pts) == 2:
        return f'M {pts[0][0]:.1f} {pts[0][1]:.1f} L {pts[1][0]:.1f} {pts[1][1]:.1f}'
    
    n = len(pts)
    d = f'M {pts[0][0]:.1f} {pts[0][1]:.1f}'
    
    for i in range(n - 1):
        p0 = pts[i - 1] if i > 0 else pts[i]
        p1 = pts[i]
        p2 = pts[i + 1]
        p3 = pts[i + 2] if i + 2 < n else pts[i + 1]
        
        c1x = p1[0] + (p2[0] - p0[0]) / 6.0
        c1y = p1[1] + (p2[1] - p0[1]) / 6.0
        c2x = p2[0] - (p3[0] - p1[0]) / 6.0
        c2y = p2[1] - (p3[1] - p1[1]) / 6.0
        
        d += f' C {c1x:.1f} {c1y:.1f}, {c2x:.1f} {c2y:.1f}, {p2[0]:.1f} {p2[1]:.1f}'
    return d

def process_plant():
    plant_img = cv2.imread('public/assets/plant-ref.png', cv2.IMREAD_UNCHANGED)
    h, w, _ = plant_img.shape
    gray = cv2.cvtColor(plant_img[:, :, :3], cv2.COLOR_BGR2GRAY)
    
    # Mask out watermark at bottom right
    watermark_mask = np.zeros((h, w), dtype=bool)
    watermark_mask[950:, 280:] = True
    plant_ink = (gray < 200) & (~watermark_mask)
    
    skel = skeletonize(plant_ink)
    segs = get_segments(skel, min_len=5)
    
    ys, xs = np.where(skel)
    min_x, min_y = xs.min(), ys.min()
    max_x, max_y = xs.max(), ys.max()
    pw = max_x - min_x + 30
    ph = max_y - min_y + 30
    
    # Categories:
    # 1. Main stem: y in 420..990, near center line x in 200..340
    # 2. Leaf stems: branching out to the left or right
    # 3. Leaves: slender leafy petals/blades
    # 4. Flower open (top): y < 240
    # 5. Flower bud (lower): y in 240..425, x in 180..340
    #    plus side bud: y in 310..430, x > 340
    
    main_stems = []
    leaf_stems = []
    leaves = []
    flower_open = []
    flower_bud = []
    
    for seg in segs:
        # Orient from bottom to top for stems
        if seg[0][1] < seg[-1][1]:
            seg = seg[::-1]
            
        s_rel = [(p[0] - min_x + 15, p[1] - min_y + 15) for p in seg]
        s_simp = simplify_segment(s_rel, eps=0.7)
        d = points_to_svg_path(s_simp)
        if not d: continue
        
        cy = np.mean([p[1] for p in seg])
        cx = np.mean([p[0] for p in seg])
        
        # Open flower (top)
        if cy < 235:
            flower_open.append(d)
        # Flower bud and side bud
        elif cy < 420 and (cx >= 180 or cy < 300):
            flower_bud.append(d)
        # Left leafy spray
        elif cx < 225:
            if len(seg) > 50 and cx > 150 and cy > 350:
                leaf_stems.append(d)
            else:
                leaves.append(d)
        # Main stem
        elif cy >= 420 and (210 <= cx <= 330):
            main_stems.append(d)
        elif cy >= 420 and (cx < 210 or cx > 330):
            leaves.append(d)
        else:
            leaf_stems.append(d)
            
    print(f'Plant viewBox="0 0 {pw} {ph}"')
    print(f'Main stems: {len(main_stems)}, Leaf stems: {len(leaf_stems)}, Leaves: {len(leaves)}')
    print(f'Flower Open: {len(flower_open)}, Flower Bud: {len(flower_bud)}')
    
    out = {
        'viewBox': f'0 0 {pw} {ph}',
        'width': int(pw),
        'height': int(ph),
        'mainStems': main_stems,
        'leafStems': leaf_stems,
        'leaves': leaves,
        'flowerOpen': flower_open,
        'flowerBud': flower_bud,
        # Base anchor points for flowers (relative to SVG viewBox)
        'openFlowerBase': {'x': int(275 - min_x + 15), 'y': int(225 - min_y + 15)},
        'budFlowerBase': {'x': int(305 - min_x + 15), 'y': int(400 - min_y + 15)}
    }
    with open('src/data/plant_paths.json', 'w') as f:
        json.dump(out, f, indent=2)
    print('Saved plant_paths.json')

process_plant()
