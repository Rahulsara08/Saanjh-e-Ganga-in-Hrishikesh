import json

with open('src/data/butterflies_paths.json') as f:
    bf = json.load(f)

html = ['<!DOCTYPE html><html><body style="background:#FAF2F0; padding:40px; display:flex; gap:30px; font-family:sans-serif;">']
for k in ['b1', 'b2', 'b3']:
    item = bf[k]
    left_paths = ''.join(f'<path d="{d}" stroke="#3b82f6" />' for d in item['left'])
    right_paths = ''.join(f'<path d="{d}" stroke="#ef4444" />' for d in item['right'])
    body_paths = ''.join(f'<path d="{d}" stroke="#10b981" stroke-width="2.5" />' for d in item['body'])
    svg = f'''
    <div style="border:1px solid #dcd4cc; border-radius:12px; background:#fff; padding:16px;">
      <h4 style="margin:0 0 10px 0;">{k.upper()} (Left=Blue, Right=Red, Body=Green)</h4>
      <svg viewBox="{item['viewBox']}" width="220" height="220" style="overflow:visible; stroke:#241913; stroke-width:1.6; fill:none; stroke-linecap:round; stroke-linejoin:round;">
        <g id="left">{left_paths}</g>
        <g id="right">{right_paths}</g>
        <g id="body">{body_paths}</g>
      </svg>
    </div>
    '''
    html.append(svg)

with open('src/data/plant_paths.json') as f:
    pl = json.load(f)

stems = ''.join(f'<path d="{d}" stroke="#15803d" />' for d in pl['mainStems'] + pl['leafStems'])
leaves = ''.join(f'<path d="{d}" stroke="#16a34a" />' for d in pl['leaves'])
flower_open = ''.join(f'<path d="{d}" stroke="#e11d48" />' for d in pl['flowerOpen'])
flower_bud = ''.join(f'<path d="{d}" stroke="#f43f5e" />' for d in pl['flowerBud'])

plant_svg = f'''
<div style="border:1px solid #dcd4cc; border-radius:12px; background:#fff; padding:16px;">
  <h4 style="margin:0 0 10px 0;">PLANT (Stems=Green, Leaves=LightGreen, Open=Crimson, Bud=Rose)</h4>
  <svg viewBox="{pl['viewBox']}" width="220" height="480" style="overflow:visible; stroke:#241913; stroke-width:1.6; fill:none; stroke-linecap:round; stroke-linejoin:round;">
    <g id="stem">{stems}</g>
    <g id="leaves">{leaves}</g>
    <g id="flower-open">{flower_open}</g>
    <g id="flower-bud">{flower_bud}</g>
  </svg>
</div>
'''
html.append(plant_svg)
html.append('</body></html>')

with open('public/assets/test_preview.html', 'w') as f:
    f.write(''.join(html))
print('Successfully generated public/assets/test_preview.html')
