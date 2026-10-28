# Generates the placeholder cake illustrations (cut-out style, transparent bg).
import math

def berry(x, y, r=14, rot=0):
    seeds = "".join(
        f'<ellipse cx="{x+math.cos(a)*r*0.5:.1f}" cy="{y+math.sin(a)*r*0.45+2:.1f}" rx="1.3" ry="2" fill="#FBE3A0" opacity=".9"/>'
        for a in [i*1.3 for i in range(6)])
    return (f'<g transform="rotate({rot} {x} {y})"><path d="M{x-r} {y-r*0.3} Q{x-r} {y+r*1.2} {x} {y+r*1.4} Q{x+r} {y+r*1.2} {x+r} {y-r*0.3} Q{x} {y-r*0.9} {x-r} {y-r*0.3}Z" fill="url(#berry)"/>'
            f'{seeds}<path d="M{x-r*0.7} {y-r*0.45} L{x} {y-r*0.15} L{x+r*0.7} {y-r*0.45} L{x+r*0.2} {y-r*0.8} L{x} {y-r*1.1} L{x-r*0.2} {y-r*0.8}Z" fill="#5E7B33"/></g>')

def blueberry(x, y, r=8):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#blue)"/><circle cx="{x-r*0.3}" cy="{y-r*0.35}" r="{r*0.25}" fill="#fff" opacity=".35"/>'

def swirl(x, y, w=26, c1="#FFF6E6", c2="#EAD6B6"):
    return (f'<g><ellipse cx="{x}" cy="{y+6}" rx="{w*0.55}" ry="{w*0.28}" fill="{c2}"/>'
            f'<ellipse cx="{x}" cy="{y}" rx="{w*0.45}" ry="{w*0.3}" fill="{c1}"/>'
            f'<ellipse cx="{x}" cy="{y-7}" rx="{w*0.28}" ry="{w*0.2}" fill="{c1}"/>'
            f'<path d="M{x-2} {y-14} Q{x} {y-20} {x+3} {y-13}" fill="{c1}"/></g>')

DEFS = '''<defs>
<linearGradient id="berry" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0566A"/><stop offset="1" stop-color="#B71E35"/></linearGradient>
<radialGradient id="blue" cx=".35" cy=".35"><stop offset="0" stop-color="#5C6BA8"/><stop offset="1" stop-color="#232A52"/></radialGradient>
<linearGradient id="stand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9DFD3"/><stop offset=".5" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D8CABB"/></linearGradient>
<linearGradient id="choc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3A1C14"/><stop offset=".45" stop-color="#6B3A28"/><stop offset="1" stop-color="#2A130D"/></linearGradient>
<linearGradient id="pist" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A6B873"/><stop offset=".45" stop-color="#D3DEA6"/><stop offset="1" stop-color="#93A563"/></linearGradient>
<linearGradient id="cream" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#EADCC6"/><stop offset=".45" stop-color="#FFF8EC"/><stop offset="1" stop-color="#DCCAB0"/></linearGradient>
<linearGradient id="pink" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E8A9B0"/><stop offset=".45" stop-color="#FAD6DA"/><stop offset="1" stop-color="#D98F99"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4DC9A"/><stop offset=".5" stop-color="#C99A45"/><stop offset="1" stop-color="#F1D287"/></linearGradient>
<radialGradient id="shadow"><stop offset="0" stop-color="#2B1611" stop-opacity=".28"/><stop offset="1" stop-color="#2B1611" stop-opacity="0"/></radialGradient>
</defs>'''

def drips(x0, x1, y, color, seed=1, depth=40):
    path = f'M{x0} {y-14} L{x1} {y-14} L{x1} {y}'
    n = 11; step = (x1-x0)/n
    for i in range(n, 0, -1):
        xa = x0 + i*step; xb = xa - step
        d = depth * (0.35 + 0.65*abs(math.sin(i*1.7+seed)))
        mid = (xa+xb)/2
        path += f' Q{xa} {y+4} {mid+step*0.22} {y+4} L{mid+step*0.22} {y+d-6} Q{mid} {y+d+4} {mid-step*0.22} {y+d-6} L{mid-step*0.22} {y+4} Q{xb} {y+4} {xb} {y}'
    return f'<path d="{path} Z" fill="{color}"/>'

def stand(cx=200, top=300, w=150, color="url(#stand)"):
    return (f'<ellipse cx="{cx}" cy="388" rx="{w*0.75}" ry="10" fill="url(#shadow)"/>'
            f'<path d="M{cx-34} {top+10} L{cx-48} 380 Q{cx} 390 {cx+48} 380 L{cx+34} {top+10}Z" fill="{color}"/>'
            f'<ellipse cx="{cx}" cy="{top+6}" rx="{w}" ry="16" fill="#CFC1B0"/><ellipse cx="{cx}" cy="{top}" rx="{w}" ry="16" fill="{color}"/>')

def layer_cake(body, drip, top_items, label=None, h=120, w=120, y_top=170, stand_col="url(#stand)"):
    cx = 200
    s = stand(top=y_top+h+6, w=w+26, color=stand_col)
    s += f'<rect x="{cx-w}" y="{y_top}" width="{2*w}" height="{h}" fill="{body}"/>'
    s += f'<ellipse cx="{cx}" cy="{y_top+h}" rx="{w}" ry="18" fill="{body}"/>'
    s += f'<ellipse cx="{cx}" cy="{y_top}" rx="{w}" ry="18" fill="{drip}"/>'
    s += drips(cx-w, cx+w, y_top+8, drip)
    s += top_items
    return s

def svg(body, vb="0 0 400 400"):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{DEFS}{body}</svg>'

files = {}
# 1. Pistachio drip cake (hero / signature)
tops = swirl(140,170)+swirl(260,170)+swirl(200,160)+berry(170,150,16,-15)+berry(232,148,18,12)+blueberry(200,166,9)+blueberry(148,160,7)+blueberry(255,160,8)+berry(205,135,13,4)
tops += '<path d="M118 150 q10 -22 30 -18 q-14 6 -30 18z" fill="#6E8B3D"/><path d="M280 148 q-8 -20 -28 -18 q12 6 28 18z" fill="#6E8B3D"/>'
files["cake-pistachio.svg"] = svg(layer_cake("url(#pist)", "#F7F1DF", tops))
# 2. Chocolate ganache cake
tops = "".join(f'<rect x="{x}" y="{y}" width="26" height="34" rx="2" transform="rotate({r} {x} {y})" fill="#2A130D"/>' for x,y,r in [(150,125,-12),(178,118,-4),(212,120,8)])
tops += '<circle cx="250" cy="150" r="17" fill="url(#gold)"/><circle cx="138" cy="160" r="14" fill="#4A2418"/>' + berry(226,156,12,10)+blueberry(270,160,8)+blueberry(118,166,7)
tops += '<rect x="176" y="150" width="50" height="22" rx="2" fill="#FFF6E6"/><text x="201" y="165" font-family="Georgia" font-size="9" text-anchor="middle" fill="#6B3A28">VELVET</text>'
files["cake-chocolate.svg"] = svg(layer_cake("url(#choc)", "#2A130D", tops))
# 3. Strawberry cream cake
tops = "".join(berry(x, y, 14, r) for x, y, r in [(110,170,-20),(145,158,-8),(180,152,5),(220,152,-6),(255,158,10),(290,170,18),(200,170,0)])
files["cake-strawberry.svg"] = svg(layer_cake("url(#cream)", "#FFFFFF", tops))
# 4. Raspberry rose cake (pink)
tops = swirl(150,168,22,"#FFF1F2","#F2C4CA")+swirl(250,168,22,"#FFF1F2","#F2C4CA")+berry(200,150,16,0)+"".join(f'<circle cx="{x}" cy="{y}" r="2.4" fill="#C99A45"/>' for x,y in [(175,165),(225,165),(190,175),(212,176),(200,168)])
tops += '<path d="M170 150 q30 -40 60 0 q-30 -18 -60 0z" fill="#FFFFFF" opacity=".9"/>'
files["cake-raspberry.svg"] = svg(layer_cake("url(#pink)", "#FFF1F2", tops))

# 5. Red velvet slice
files["slice-redvelvet.svg"] = svg('''<ellipse cx="200" cy="350" rx="150" ry="16" fill="url(#shadow)"/>
<path d="M80 300 L310 300 L320 330 L90 330Z" fill="#F4EEE6"/>
<path d="M90 170 L300 120 L300 300 L90 300Z" fill="#8E1C26"/>
<path d="M90 210 L300 168 L300 182 L90 224Z" fill="#FFF3E2"/><path d="M90 260 L300 222 L300 236 L90 274Z" fill="#FFF3E2"/>
<path d="M300 120 L340 140 L340 310 L300 300Z" fill="#6E121B"/>
<path d="M90 170 L300 120 L340 140 L130 192Z" fill="#FFF6EA"/>
''' + swirl(150,170,30)+swirl(205,158,30)+swirl(262,146,30)+berry(206,140,13,8)+''.join(f'<circle cx="{120+i*23%190}" cy="{205+ (i*37)%85}" r="2" fill="#5A0E16" opacity=".6"/>' for i in range(24)))

# 6. Cupcake
files["cupcake.svg"] = svg('''<ellipse cx="200" cy="372" rx="110" ry="12" fill="url(#shadow)"/>
<path d="M120 230 L280 230 L258 365 L142 365Z" fill="#E9A8B1"/>''' + ''.join(f'<path d="M{128+i*18} 232 L{146+i*13} 365" stroke="#D88993" stroke-width="3"/>' for i in range(9)) + '''
<path d="M110 236 Q110 180 160 170 Q150 120 200 105 Q250 120 240 170 Q290 180 290 236 Q200 256 110 236Z" fill="#B9CB8C"/>
<path d="M130 220 Q150 196 200 200 Q250 196 270 220" stroke="#97AC66" stroke-width="6" fill="none"/>
<path d="M160 172 Q200 156 240 172" stroke="#97AC66" stroke-width="5" fill="none"/>''' + berry(200,98,16,0) + ''.join(f'<rect x="{x}" y="{y}" width="8" height="3" rx="1.5" fill="{c}" transform="rotate({r} {x} {y})"/>' for x,y,r,c in [(150,200,20,"#F5D589"),(240,190,-30,"#F0566A"),(180,150,60,"#FFF"),(225,210,10,"#F5D589"),(205,175,-50,"#F0566A")]))

# 7. Macarons stack
def mac(x,y,c,f="#FFF6EA",w=110):
    return (f'<ellipse cx="{x}" cy="{y+30}" rx="{w/2}" ry="18" fill="{c}" filter="brightness(.9)"/><rect x="{x-w/2}" y="{y+8}" width="{w}" height="22" fill="{c}"/>'
            f'<rect x="{x-w/2+4}" y="{y-6}" width="{w-8}" height="16" rx="6" fill="{f}"/>'
            f'<rect x="{x-w/2}" y="{y-34}" width="{w}" height="24" rx="4" fill="{c}"/><ellipse cx="{x}" cy="{y-34}" rx="{w/2}" ry="20" fill="{c}"/>'
            f'<ellipse cx="{x-14}" cy="{y-40}" rx="{w/5}" ry="6" fill="#fff" opacity=".25"/>')
files["macarons.svg"] = svg('<ellipse cx="200" cy="360" rx="140" ry="14" fill="url(#shadow)"/>' + mac(140,310,"#B9CB8C") + mac(262,316,"#F3B6BE") + mac(200,220,"#F5D589","#6B3A28") + mac(200,128,"#C9A9D8"))

# 8. Fruit tart
files["tart.svg"] = svg('''<ellipse cx="200" cy="330" rx="170" ry="22" fill="url(#shadow)"/>
<path d="M50 250 L70 300 Q200 330 330 300 L350 250Z" fill="#D6A060"/>''' + ''.join(f'<path d="M{60+i*14} 255 l4 40" stroke="#B9803F" stroke-width="3"/>' for i in range(21)) + '''
<ellipse cx="200" cy="250" rx="150" ry="42" fill="#E3B272"/><ellipse cx="200" cy="246" rx="132" ry="34" fill="#FFF0C9"/>''' +
 "".join(berry(x,y,12,r) for x,y,r in [(120,240,-30),(160,228,0),(240,228,10),(280,240,30),(200,256,0)]) + "".join(blueberry(x,y,8) for x,y in [(140,256),(200,224),(260,256),(180,244),(222,244),(105,250),(295,252)]) +
 '<path d="M190 236 q10 -24 26 -14 q-12 4 -26 14z" fill="#6E8B3D"/>')

# 9. Tiered wedding cake
t = stand(top=352, w=120)
for (w, y, h) in [(100, 252, 100), (74, 172, 80), (50, 108, 64)]:
    t += f'<rect x="{200-w}" y="{y}" width="{2*w}" height="{h}" fill="url(#cream)"/><ellipse cx="200" cy="{y+h}" rx="{w}" ry="12" fill="url(#cream)"/><ellipse cx="200" cy="{y}" rx="{w}" ry="12" fill="#FFFDF8"/>'
    t += "".join(f'<circle cx="{200-w+8+i*(2*w-16)/9:.0f}" cy="{y+h+6}" r="4" fill="#F7EEDF"/>' for i in range(10))
t += "".join(f'<g transform="translate({x} {y})"><circle r="14" fill="#F7CFD3"/><circle r="9" fill="#F0B3BB"/><circle r="4" fill="#E28C99"/></g>' for x,y in [(150,180),(170,190),(260,272),(240,286),(220,118)])
t += '<path d="M140 190 q-14 6 -20 -6 q12 -2 20 6z M275 282 q16 0 18 -12 q-12 0 -18 12z" fill="#7E9A4E"/>'
files["cake-wedding.svg"] = svg(t)

# 10. Gift box
files["gift-box.svg"] = svg('''<ellipse cx="200" cy="360" rx="150" ry="14" fill="url(#shadow)"/>
<path d="M80 170 L320 170 L320 350 L80 350Z" fill="#3F5130"/><path d="M80 170 L320 170 L320 190 L80 190Z" fill="#2E3D22"/>''' +
 ''.join(f'<rect x="{80+i*20}" y="{310+(i%2)*20}" width="20" height="20" fill="#F6EFE4"/><rect x="{80+i*20}" y="{330-(i%2)*20}" width="20" height="20" fill="#2E3D22"/>' for i in range(12)) + '''
<rect x="70" y="140" width="260" height="40" rx="4" fill="#556B3E"/>
<rect x="186" y="140" width="28" height="210" fill="#E8576B"/><rect x="70" y="150" width="260" height="20" fill="#E8576B" opacity="0"/>
<path d="M200 140 Q150 80 140 120 Q140 145 200 140 Q250 145 260 120 Q250 80 200 140Z" fill="#E8576B"/>
<circle cx="200" cy="140" r="12" fill="#C9455A"/>
<text x="200" y="262" font-family="Georgia" font-style="italic" font-size="30" text-anchor="middle" fill="#F6EFE4">Velvet</text>
<text x="200" y="285" font-family="Arial" font-size="10" letter-spacing="4" text-anchor="middle" fill="#F6EFE4">CAKE STUDIO</text>''')

for n, c in files.items():
    open(n, "w").write(c)
print(list(files))
