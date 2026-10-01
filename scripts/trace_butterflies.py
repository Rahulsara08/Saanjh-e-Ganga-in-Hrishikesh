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

def simplify_segment(pts, eps=0.8):
    arr = np.array(pts, dtype=np.float32).reshape((-1, 1, 2))
    approx = cv2.approxPolyDP(arr, eps, False)
    return approx.reshape((-1, 2)).tolist()

def points_to_svg_path(pts, closed=False):
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
        
    if closed:
        d += ' Z'
    return d

def process_butterflies():
    full = cv2.imread('public/assets/butterflies-ref.png', cv2.IMREAD_UNCHANGED)
    h, w, _ = full.shape
    gray = cv2.cvtColor(full[:, :, :3], cv2.COLOR_BGR2GRAY)
    ink = (gray < 180)
    
    # ── BUTTERFLY 1 ──
    # Top butterfly: x in 60..340, y in 20..290
    b1_ink = ink & (np.arange(h)[:, None] < 300) & (np.arange(w)[None, :] < 360)
    skel1 = skeletonize(b1_ink)
    segs1 = get_segments(skel1, min_len=5)
    
    # Shift B1 to (0,0) based
    ys1, xs1 = np.where(skel1)
    min_x1, min_y1 = xs1.min(), ys1.min()
    max_x1, max_y1 = xs1.max(), ys1.max()
    w1 = max_x1 - min_x1 + 20
    h1 = max_y1 - min_y1 + 20
    
    # Classify B1 parts:
    # Body is near center of body joint (x~145, y~240 in full coords, so x - min_x1 ~ 80, y - min_y1 ~ 180)
    # Left wing is top-left large wing (points up and left)
    # Right wing is bottom-right wing (points down and right)
    b1_body = []
    b1_left = []
    b1_right = []
    
    for seg in segs1:
        s_rel = [(p[0] - min_x1 + 10, p[1] - min_y1 + 10) for p in seg]
        s_simp = simplify_segment(s_rel, eps=0.7)
        d = points_to_svg_path(s_simp)
        if not d: continue
        
        # Check coordinates in full image
        cx = np.mean([p[0] for p in seg])
        cy = np.mean([p[1] for p in seg])
        
        # Antennae or body
        # Antennae: x < 130, y > 215
        # Body abdomen: 130 <= x <= 200, y > 240
        if (cx < 135 and cy > 210) or (130 <= cx <= 200 and cy > 240):
            b1_body.append(d)
        elif cx < 200 and cy < 235:
            b1_left.append(d)
        else:
            b1_right.append(d)
            
    print(f'B1: viewBox="0 0 {w1} {h1}", body={len(b1_body)}, left={len(b1_left)}, right={len(b1_right)}')
    
    # ── BUTTERFLY 2 ──
    # Middle butterfly: x in 230..560, y in 250..560
    b2_ink = ink & (np.arange(h)[:, None] >= 280) & (np.arange(h)[:, None] < 600)
    skel2 = skeletonize(b2_ink)
    segs2 = get_segments(skel2, min_len=5)
    
    ys2, xs2 = np.where(skel2)
    min_x2, min_y2 = xs2.min(), ys2.min()
    max_x2, max_y2 = xs2.max(), ys2.max()
    w2 = max_x2 - min_x2 + 20
    h2 = max_y2 - min_y2 + 20
    
    b2_body = []
    b2_left = []
    b2_right = []
    
    for seg in segs2:
        s_rel = [(p[0] - min_x2 + 10, p[1] - min_y2 + 10) for p in seg]
        s_simp = simplify_segment(s_rel, eps=0.7)
        d = points_to_svg_path(s_simp)
        if not d: continue
        
        cx = np.mean([p[0] for p in seg])
        cy = np.mean([p[1] for p in seg])
        
        # Body in B2 is roughly diagonal line x: 420..460, y: 460..490, antennae down-right x: 450..490, y: 480..510
        if 420 <= cx <= 460 and 455 <= cy <= 495:
            b2_body.append(d)
        elif cx >= 450 and cy >= 485:
            b2_body.append(d)
        elif cx < 430:
            b2_left.append(d)
        else:
            b2_right.append(d)
            
    print(f'B2: viewBox="0 0 {w2} {h2}", body={len(b2_body)}, left={len(b2_left)}, right={len(b2_right)}')
    
    # ── BUTTERFLY 3 ──
    # Bottom right butterfly: x in 390..600, y >= 650
    b3_ink = ink & (np.arange(h)[:, None] >= 650)
    skel3 = skeletonize(b3_ink)
    segs3 = get_segments(skel3, min_len=5)
    
    ys3, xs3 = np.where(skel3)
    min_x3, min_y3 = xs3.min(), ys3.min()
    max_x3, max_y3 = xs3.max(), ys3.max()
    w3 = max_x3 - min_x3 + 20
    h3 = max_y3 - min_y3 + 20
    
    b3_body = []
    b3_left = []
    b3_right = []
    
    for seg in segs3:
        s_rel = [(p[0] - min_x3 + 10, p[1] - min_y3 + 10) for p in seg]
        s_simp = simplify_segment(s_rel, eps=0.7)
        d = points_to_svg_path(s_simp)
        if not d: continue
        
        cx = np.mean([p[0] for p in seg])
        cy = np.mean([p[1] for p in seg])
        
        # In B3, body is at x: 510..545, y: 840..890, antennae up-right x: 540..590, y: 780..840
        if 515 <= cx <= 545 and 840 <= cy <= 900:
            b3_body.append(d)
        elif cx >= 540 and 780 <= cy <= 840:
            b3_body.append(d)
        elif cx < 460: # Back wings (left)
            b3_left.append(d)
        else: # Front wings (right)
            b3_right.append(d)
            
    print(f'B3: viewBox="0 0 {w3} {h3}", body={len(b3_body)}, left={len(b3_left)}, right={len(b3_right)}')
    
    out = {
        'b1': {'viewBox': f'0 0 {w1} {h1}', 'width': int(w1), 'height': int(h1), 'body': b1_body, 'left': b1_left, 'right': b1_right},
        'b2': {'viewBox': f'0 0 {w2} {h2}', 'width': int(w2), 'height': int(h2), 'body': b2_body, 'left': b2_left, 'right': b2_right},
        'b3': {'viewBox': f'0 0 {w3} {h3}', 'width': int(w3), 'height': int(h3), 'body': b3_body, 'left': b3_left, 'right': b3_right},
    }
    with open('src/data/butterflies_paths.json', 'w') as f:
        json.dump(out, f, indent=2)
    print('Saved butterflies_paths.json')

process_butterflies()
