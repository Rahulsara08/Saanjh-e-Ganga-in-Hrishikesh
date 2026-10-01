import cv2
import numpy as np
import os
import json

def process_watercolor():
    img = cv2.imread('public/assets/butterflies-watercolor.png', cv2.IMREAD_UNCHANGED)
    h, w, c = img.shape
    bgr = img[:, :, :3].astype(float)
    
    # White background removal with smooth anti-aliased edge
    diff_from_white = np.max(np.abs(bgr - 255.0), axis=2)
    # Background is pure white (255)
    # Threshold: diff > 4 starts having color, diff > 16 is fully opaque
    alpha = np.clip((diff_from_white - 4.0) / 14.0, 0.0, 1.0)
    
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[:, :, :3] = img[:, :, :3]
    rgba[:, :, 3] = (alpha * 255).astype(np.uint8)
    
    os.makedirs('public/assets/butterflies', exist_ok=True)
    os.makedirs('src/assets/images/butterflies', exist_ok=True)
    
    # ── 1. BUTTERFLY 1 (Warm Pink, top-right) ──
    # Bounding box: x in 260..460, y in 145..455
    b1_raw = rgba[145:455, 260:460].copy()
    b1_h, b1_w, _ = b1_raw.shape
    
    # In B1 local coords:
    # Body is at x in 35..65, y in 150..220 (global x: 295..325, y: 295..365)
    # Antennae extend up-left x in 0..50, y in 115..170 (global x: 260..310, y: 260..315)
    # Upper/forewing (left wing in flight): y in 0..195, x in 40..200
    # Lower/hindwing (right wing in flight): y in 180..290, x in 50..185
    
    # Let's separate Body, Left Wing (Forewing), Right Wing (Hindwing)
    b1_body = np.zeros_like(b1_raw)
    b1_left = np.zeros_like(b1_raw) # Upper wing
    b1_right = np.zeros_like(b1_raw) # Lower wing
    
    for y in range(b1_h):
        for x in range(b1_w):
            a = b1_raw[y, x, 3]
            if a == 0: continue
            # Dark body/antennae check: dark pixels (R < 150, G < 110, B < 90) or antenna region
            r, g, b = b1_raw[y, x, :3]
            is_dark = (r < 150 and g < 110 and b < 90)
            if (x < 65 and y >= 115 and is_dark) or (x < 50 and 115 <= y <= 170):
                b1_body[y, x] = b1_raw[y, x]
            elif y < 190:
                b1_left[y, x] = b1_raw[y, x]
            else:
                b1_right[y, x] = b1_raw[y, x]
                
    # ── 2. BUTTERFLY 2 (Pale Blue, middle-left) ──
    # Bounding box: x in 30..290, y in 355..590
    b2_raw = rgba[355:590, 30:290].copy()
    b2_h, b2_w, _ = b2_raw.shape
    
    # In B2 local coords:
    # Center of body is around x: 147, y: 125
    # Body is x in 135..160, y in 80..160
    # Left wing: x < 147
    # Right wing: x >= 147
    b2_body = np.zeros_like(b2_raw)
    b2_left = np.zeros_like(b2_raw)
    b2_right = np.zeros_like(b2_raw)
    
    for y in range(b2_h):
        for x in range(b2_w):
            a = b2_raw[y, x, 3]
            if a == 0: continue
            r, g, b = b2_raw[y, x, :3]
            is_dark = (r < 110 and g < 110 and b < 140)
            if 135 <= x <= 160 and 80 <= y <= 165 and is_dark:
                b2_body[y, x] = b2_raw[y, x]
            elif x < 147:
                b2_left[y, x] = b2_raw[y, x]
            else:
                b2_right[y, x] = b2_raw[y, x]
                
    # ── 3. BUTTERFLY 3 (Magenta / Pink, bottom) ──
    # Bounding box: x in 185..395, y in 565..895
    b3_raw = rgba[565:895, 185:395].copy()
    b3_h, b3_w, _ = b3_raw.shape
    
    # In B3 local coords:
    # Body is at x in 125..160, y in 140..220 with antennae extending up-right x in 140..165, y in 130..170
    # Back/inner wing (left): x in 30..115, y in 10..200
    # Front/outer wing (right): rest of the wing lobes
    b3_body = np.zeros_like(b3_raw)
    b3_left = np.zeros_like(b3_raw)
    b3_right = np.zeros_like(b3_raw)
    
    for y in range(b3_h):
        for x in range(b3_w):
            a = b3_raw[y, x, 3]
            if a == 0: continue
            r, g, b = b3_raw[y, x, :3]
            is_dark = (r < 130 and g < 90 and b < 100)
            if x >= 130 and 130 <= y <= 220 and is_dark:
                b3_body[y, x] = b3_raw[y, x]
            elif x < 105 and y < 200:
                b3_left[y, x] = b3_raw[y, x]
            else:
                b3_right[y, x] = b3_raw[y, x]

    # Save all png files
    cuts = [
        ('wb1_full', b1_raw), ('wb1_left', b1_left), ('wb1_right', b1_right), ('wb1_body', b1_body),
        ('wb2_full', b2_raw), ('wb2_left', b2_left), ('wb2_right', b2_right), ('wb2_body', b2_body),
        ('wb3_full', b3_raw), ('wb3_left', b3_left), ('wb3_right', b3_right), ('wb3_body', b3_body),
    ]
    for name, img_arr in cuts:
        cv2.imwrite(f'public/assets/butterflies/{name}.png', img_arr)
        cv2.imwrite(f'src/assets/images/butterflies/{name}.png', img_arr)
        print(f'Saved {name}.png: {img_arr.shape[1]}x{img_arr.shape[0]}')

    meta = {
        'wb1': {'width': b1_w, 'height': b1_h, 'pivot': {'x': 52, 'y': 185}},
        'wb2': {'width': b2_w, 'height': b2_h, 'pivot': {'x': 147, 'y': 130}},
        'wb3': {'width': b3_w, 'height': b3_h, 'pivot': {'x': 136, 'y': 175}},
    }
    with open('src/data/watercolor_butterflies_meta.json', 'w') as f:
        json.dump(meta, f, indent=2)
    print('Saved watercolor_butterflies_meta.json')

process_watercolor()
