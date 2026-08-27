#!/usr/bin/env python3
"""
Emits the site's illustrations into public/img/.

Why illustrations rather than photographs: the identity is an enamel signboard,
and enamel signage is illustrated — flat fills, hard edges, a fixed palette, no
gradients and no shadows. Photography would fight the system rather than sit in
it, and each of these ships at 1-3 KB against the 90 KB the handoff budgets for
a hero, which is most of the LCP headroom back.

These are placeholders with intent, not filler: when the real shoot happens
(hard side light at 45 deg, cut faces, hands in frame) the <Photo> component
swaps a src and nothing else changes.

Deliberately no depictions of Ritu or Arjun. The site names them as real people
and invites you to their kitchen; inventing faces for them would undercut the
one claim the brand cannot afford to weaken. Their frames show the work — hands,
the press, the bag — and no face.

Run:  python3 scripts/build-illustrations.py
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'public' / 'img'

C = {
    'indigo': '#14224A',
    'raise': '#1B2C58',
    'ink': '#0E1526',
    'cream': '#F4EBDA',
    'paper': '#FBF7EE',
    'stone': '#DCD3C0',
    'grey': '#7E7768',
    'vermilion': '#E1442A',
    'marigold': '#F2A118',
    'chilli': '#B4202A',
    'green': '#1E7B34',
}


def svg(w, h, body, bg):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
        f'role="img" shape-rendering="geometricPrecision">'
        f'<rect width="{w}" height="{h}" fill="{bg}"/>{body}</svg>'
    )


def light_wedge(w, h, colour=None, opacity=0.08):
    """The 45-degree side light the photography direction asks for, as geometry.

    Cream, not marigold: a warm accent at low opacity over indigo goes muddy and
    reads as a shadow falling the wrong way. Light has to actually lighten.
    """
    return f'<path d="M0 0 L{w * 0.55:.0f} 0 L0 {h * 0.75:.0f} Z" fill="{colour or C["cream"]}" opacity="{opacity}"/>'


def tofu_cube(x, y, s, face=None, top=None, side=None):
    """An isometric block with a lighter cut face — the brand's recurring motif."""
    face = face or C['cream']
    top = top or C['paper']
    side = side or C['stone']
    d = s * 0.34
    return (
        f'<path d="M{x} {y} L{x + s} {y} L{x + s} {y + s} L{x} {y + s} Z" fill="{face}"/>'
        f'<path d="M{x} {y} L{x + d} {y - d} L{x + s + d} {y - d} L{x + s} {y} Z" fill="{top}"/>'
        f'<path d="M{x + s} {y} L{x + s + d} {y - d} L{x + s + d} {y + s - d} L{x + s} {y + s} Z" fill="{side}"/>'
    )


# --------------------------------------------------------------------- scenes

def hero():
    b = light_wedge(400, 300)
    # steel plate
    b += f'<ellipse cx="200" cy="215" rx="150" ry="42" fill="{C["raise"]}"/>'
    b += f'<ellipse cx="200" cy="209" rx="150" ry="42" fill="{C["stone"]}"/>'
    b += f'<ellipse cx="200" cy="209" rx="120" ry="31" fill="{C["cream"]}"/>'
    # the block, one slice cut away so the face is showing
    b += tofu_cube(128, 138, 96)
    b += f'<path d="M242 138 L262 118 L262 190 L242 210 Z" fill="{C["stone"]}"/>'
    b += tofu_cube(250, 152, 40, face=C['paper'])
    # the cut line — the "cut or torn face" the direction insists on
    b += f'<path d="M128 138 L224 138" stroke="{C["grey"]}" stroke-width="3"/>'
    # knife
    b += f'<path d="M262 96 L352 96 L352 108 L262 112 Z" fill="{C["stone"]}"/>'
    b += f'<rect x="348" y="92" width="40" height="18" fill="{C["ink"]}"/>'
    # a hand reaching in from the right
    b += (
        f'<path d="M400 172 L330 172 Q300 172 300 190 Q300 208 330 208 L400 208 Z" fill="{C["marigold"]}"/>'
        f'<path d="M330 172 L330 208" stroke="{C["indigo"]}" stroke-width="3" opacity="0.35"/>'
        f'<path d="M352 172 L352 208" stroke="{C["indigo"]}" stroke-width="3" opacity="0.35"/>'
    )
    return svg(400, 300, b, C['indigo'])


def ingredients():
    b = light_wedge(400, 300)
    # steel bowl of soybeans
    b += f'<path d="M60 150 L212 150 L192 232 L80 232 Z" fill="{C["stone"]}"/>'
    b += f'<ellipse cx="136" cy="150" rx="76" ry="18" fill="{C["cream"]}"/>'
    for cx, cy in [(106, 146), (132, 142), (158, 147), (118, 153), (146, 153), (170, 143), (94, 152)]:
        b += f'<circle cx="{cx}" cy="{cy}" r="8" fill="{C["marigold"]}"/>'
    # water jug
    b += f'<path d="M244 138 L306 138 L300 232 L250 232 Z" fill="{C["raise"]}"/>'
    b += f'<path d="M244 138 L306 138 L303 186 L247 186 Z" fill="{C["cream"]}" opacity="0.28"/>'
    b += f'<path d="M306 152 Q334 160 334 182 Q334 200 312 204" fill="none" stroke="{C["raise"]}" stroke-width="9"/>'
    # muslin over the press
    b += f'<path d="M236 244 L392 244 L392 268 L236 268 Z" fill="{C["cream"]}"/>'
    b += f'<path d="M236 244 Q272 232 308 244 Q344 256 392 244 L392 268 L236 268 Z" fill="{C["paper"]}"/>'
    # the press: a weighted box
    b += f'<rect x="248" y="60" width="120" height="20" fill="{C["vermilion"]}"/>'
    b += f'<rect x="292" y="24" width="32" height="36" fill="{C["ink"]}"/>'
    return svg(400, 300, b, C['indigo'])


def masala_tawa():
    b = light_wedge(400, 300)
    b += f'<ellipse cx="196" cy="176" rx="150" ry="88" fill="{C["ink"]}"/>'
    b += f'<ellipse cx="196" cy="170" rx="150" ry="88" fill="{C["raise"]}"/>'
    b += f'<ellipse cx="196" cy="170" rx="122" ry="70" fill="{C["ink"]}"/>'
    # handle
    b += f'<rect x="336" y="160" width="66" height="18" fill="{C["stone"]}"/>'
    # charred cubes
    spots = [(140, 132), (196, 122), (250, 138), (162, 178), (224, 178), (188, 210)]
    for i, (x, y) in enumerate(spots):
        b += tofu_cube(x, y, 34, face=C['marigold'] if i % 2 else C['chilli'], top=C['marigold'], side=C['chilli'])
    # char marks
    for x, y in spots[:4]:
        b += f'<path d="M{x + 6} {y + 26} L{x + 28} {y + 26}" stroke="{C["ink"]}" stroke-width="3" opacity="0.5"/>'
    # spatula, hand out of frame
    b += f'<path d="M300 60 L322 60 L316 130 L294 130 Z" fill="{C["stone"]}"/>'
    b += f'<rect x="298" y="14" width="18" height="48" fill="{C["ink"]}"/>'
    return svg(400, 300, b, C['indigo'])


def classic_tub():
    # a fridge interior, door light only
    b = f'<rect x="0" y="0" width="400" height="300" fill="{C["indigo"]}"/>'
    b += f'<path d="M0 0 L150 0 L0 240 Z" fill="{C["cream"]}" opacity="0.10"/>'
    b += f'<rect x="30" y="236" width="340" height="8" fill="{C["raise"]}"/>'
    # the tub
    b += f'<path d="M120 120 L288 120 L274 236 L134 236 Z" fill="{C["cream"]}"/>'
    b += f'<rect x="112" y="100" width="184" height="24" fill="{C["marigold"]}"/>'
    # label band with a mono-ish rule set
    b += f'<rect x="140" y="150" width="128" height="4" fill="{C["indigo"]}"/>'
    b += f'<rect x="140" y="166" width="96" height="4" fill="{C["indigo"]}" opacity="0.55"/>'
    b += f'<rect x="140" y="180" width="112" height="4" fill="{C["indigo"]}" opacity="0.35"/>'
    b += f'<rect x="140" y="202" width="52" height="14" fill="{C["vermilion"]}"/>'
    # water line
    b += f'<path d="M126 214 L282 214" stroke="{C["stone"]}" stroke-width="3" opacity="0.7"/>'
    return svg(400, 300, b, C['indigo'])


def press():
    b = light_wedge(400, 300)
    # bench
    b += f'<rect x="0" y="246" width="400" height="54" fill="{C["raise"]}"/>'
    # the press box with muslin spilling out
    b += f'<rect x="112" y="150" width="180" height="96" fill="{C["stone"]}"/>'
    b += f'<path d="M112 150 L292 150 L292 176 L112 176 Z" fill="{C["cream"]}"/>'
    b += f'<rect x="100" y="120" width="204" height="30" fill="{C["vermilion"]}"/>'
    # the weight on top
    b += f'<rect x="168" y="66" width="68" height="54" fill="{C["ink"]}"/>'
    b += f'<rect x="186" y="46" width="32" height="20" fill="{C["ink"]}"/>'
    # whey dripping
    for x in [130, 152, 268]:
        b += f'<path d="M{x} 246 L{x} 262" stroke="{C["cream"]}" stroke-width="4" opacity="0.7"/>'
        b += f'<circle cx="{x}" cy="268" r="4" fill="{C["cream"]}" opacity="0.7"/>'
    # two hands at the weight — the work, not a face
    b += f'<path d="M60 246 L146 246 Q168 246 168 230 Q168 214 146 214 L60 214 Z" fill="{C["marigold"]}"/>'
    b += f'<path d="M340 246 L254 246 Q232 246 232 230 Q232 214 254 214 L340 214 Z" fill="{C["marigold"]}"/>'
    return svg(400, 300, b, C['indigo'])


def delivery_bag():
    b = light_wedge(400, 300)
    b += f'<rect x="0" y="250" width="400" height="50" fill="{C["raise"]}"/>'
    # insulated bag
    b += f'<path d="M96 122 L304 122 L292 250 L108 250 Z" fill="{C["indigo"]}" stroke="{C["cream"]}" stroke-width="4"/>'
    b += f'<path d="M96 122 L304 122 L300 158 L100 158 Z" fill="{C["vermilion"]}"/>'
    # handle
    b += f'<path d="M150 122 Q150 74 200 74 Q250 74 250 122" fill="none" stroke="{C["cream"]}" stroke-width="8"/>'
    # tubs peeking out
    b += f'<rect x="128" y="90" width="52" height="34" fill="{C["cream"]}"/>'
    b += f'<rect x="124" y="82" width="60" height="10" fill="{C["marigold"]}"/>'
    b += f'<rect x="220" y="90" width="52" height="34" fill="{C["cream"]}"/>'
    b += f'<rect x="216" y="82" width="60" height="10" fill="{C["chilli"]}"/>'
    # a hand on the handle
    b += f'<path d="M176 74 L224 74 Q244 74 244 58 Q244 42 224 42 L176 42 Z" fill="{C["marigold"]}"/>'
    return svg(400, 300, b, C['indigo'])


def block_1kg():
    b = light_wedge(400, 300, opacity=0.06)
    # commercial board
    b += f'<rect x="20" y="188" width="360" height="76" fill="{C["stone"]}"/>'
    b += f'<rect x="20" y="188" width="360" height="8" fill="{C["cream"]}"/>'
    # the kilo block, three slices cut off
    b += tofu_cube(70, 96, 150)
    b += f'<path d="M70 96 L220 96" stroke="{C["grey"]}" stroke-width="3"/>'
    for i in range(3):
        b += tofu_cube(242 + i * 26, 150 + i * 4, 34, face=C['paper'])
    # chef's knife mid-cut
    b += f'<path d="M180 40 L200 40 L200 150 L180 150 Z" fill="{C["stone"]}"/>'
    b += f'<rect x="176" y="12" width="28" height="30" fill="{C["ink"]}"/>'
    # hands: one steadying, one on the handle
    b += f'<path d="M20 150 L86 150 Q108 150 108 134 Q108 118 86 118 L20 118 Z" fill="{C["marigold"]}"/>'
    b += f'<path d="M226 30 L182 30 Q160 30 160 14 Q160 -2 182 -2 L226 -2 Z" fill="{C["marigold"]}"/>'
    return svg(400, 300, b, C['indigo'])


# ------------------------------------------------------------------- recipes

def dish(bowl, gravy, garnish, cube_face, cube_top, skewer=False, roll=False):
    """One family of small recipe cards: a vessel, a colour, a garnish."""
    w, h = 240, 180
    b = f'<path d="M0 0 L96 0 L0 132 Z" fill="{C["cream"]}" opacity="0.07"/>'
    if roll:
        b += f'<path d="M52 44 L188 44 L176 150 L64 150 Z" fill="{C["cream"]}"/>'
        b += f'<path d="M52 44 L188 44 L184 78 L56 78 Z" fill="{C["paper"]}"/>'
        for i in range(3):
            b += tofu_cube(76 + i * 30, 92 + (i % 2) * 10, 24, face=cube_face, top=cube_top, side=gravy)
        b += f'<path d="M64 150 L176 150" stroke="{C["stone"]}" stroke-width="6"/>'
        return svg(w, h, b, C['indigo'])

    if skewer:
        b += f'<rect x="36" y="86" width="172" height="6" fill="{C["stone"]}"/>'
        for i in range(4):
            b += tofu_cube(52 + i * 38, 62, 28, face=cube_face, top=cube_top, side=gravy)
        b += f'<circle cx="120" cy="132" r="12" fill="{garnish}"/>'
        b += f'<circle cx="86" cy="136" r="9" fill="{gravy}"/>'
        b += f'<circle cx="156" cy="136" r="9" fill="{gravy}"/>'
        return svg(w, h, b, C['indigo'])

    # karahi / bowl
    b += f'<ellipse cx="120" cy="112" rx="86" ry="26" fill="{bowl}"/>'
    b += f'<path d="M34 112 Q34 158 120 158 Q206 158 206 112 Z" fill="{bowl}"/>'
    b += f'<ellipse cx="120" cy="110" rx="72" ry="20" fill="{gravy}"/>'
    for i, (x, y) in enumerate([(78, 92), (110, 86), (142, 94)]):
        b += tofu_cube(x, y, 26, face=cube_face, top=cube_top, side=gravy)
    b += f'<circle cx="98" cy="118" r="5" fill="{garnish}"/>'
    b += f'<circle cx="140" cy="120" r="5" fill="{garnish}"/>'
    return svg(w, h, b, C['indigo'])


RECIPES = {
    'tawa-masala-tofu': dict(bowl=C['ink'], gravy=C['chilli'], garnish=C['green'], cube_face=C['marigold'], cube_top=C['paper']),
    'tofu-bhurji': dict(bowl=C['ink'], gravy=C['marigold'], garnish=C['green'], cube_face=C['paper'], cube_top=C['cream']),
    'palak-tofu': dict(bowl=C['raise'], gravy=C['green'], garnish=C['cream'], cube_face=C['cream'], cube_top=C['paper']),
    'shahi-tofu': dict(bowl=C['raise'], gravy=C['cream'], garnish=C['marigold'], cube_face=C['paper'], cube_top=C['cream']),
    'achaari-tofu-roll': dict(bowl=C['ink'], gravy=C['chilli'], garnish=C['green'], cube_face=C['marigold'], cube_top=C['paper'], roll=True),
    'tofu-tikka': dict(bowl=C['ink'], gravy=C['chilli'], garnish=C['green'], cube_face=C['vermilion'], cube_top=C['marigold'], skewer=True),
}

SCENES = {
    'hero': hero,
    'ingredients': ingredients,
    'masala-tawa': masala_tawa,
    'classic-tub': classic_tub,
    'press': press,
    'delivery-bag': delivery_bag,
    'block-1kg': block_1kg,
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'recipes').mkdir(exist_ok=True)

    for name, fn in SCENES.items():
        path = OUT / f'{name}.svg'
        path.write_text(fn())
        print(f'{path.relative_to(OUT.parent.parent)}  {path.stat().st_size} B')

    for slug, kw in RECIPES.items():
        path = OUT / 'recipes' / f'{slug}.svg'
        path.write_text(dish(**kw))
        print(f'{path.relative_to(OUT.parent.parent)}  {path.stat().st_size} B')


if __name__ == '__main__':
    main()
