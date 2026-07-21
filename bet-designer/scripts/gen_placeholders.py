from PIL import Image, ImageDraw, ImageFont
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")

def font(size):
    try:
        return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size)
    except Exception:
        return ImageFont.load_default()

def make_template(path, w, h, c1, c2, label):
    img = Image.new("RGBA", (w, h), c1)
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / h
        r = int(c1[0] * (1 - t) + c2[0] * t)
        g = int(c1[1] * (1 - t) + c2[1] * t)
        b = int(c1[2] * (1 - t) + c2[2] * t)
        d.line([(0, y), (w, y)], fill=(r, g, b, 255))
    d.text((30, 30), label, font=font(46), fill=(255, 255, 255, 160))
    img.save(path)

def make_logo(path, text, color):
    img = Image.new("RGBA", (300, 300), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([10, 10, 290, 290], fill=color + (255,))
    d.text((150, 150), text[:3].upper(), font=font(70), fill=(255, 255, 255, 255), anchor="mm")
    img.save(path)

def make_player(path, name, color):
    img = Image.new("RGBA", (500, 700), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # simple silhouette placeholder
    d.ellipse([150, 40, 350, 240], fill=color + (255,))
    d.rounded_rectangle([100, 220, 400, 620], radius=60, fill=color + (255,))
    d.text((250, 660), name, font=font(34), fill=(255, 255, 255, 255), anchor="mm")
    img.save(path)

# Bank templates (1080x1350 portrait, common social post size)
banks = {
    "celeste": {"c1": (20, 43, 140), "c2": (10, 20, 60)},
    "verde": {"c1": (10, 110, 60), "c2": (5, 40, 25)},
    "vermelho": {"c1": (150, 20, 20), "c2": (50, 5, 5)},
}
for name, c in banks.items():
    d = os.path.join(PUB, "banks", name)
    os.makedirs(d, exist_ok=True)
    make_template(os.path.join(d, "combo.png"), 1080, 1350, c["c1"], c["c2"], "COMBO")
    make_template(os.path.join(d, "solo.png"), 1080, 1350, c["c1"], c["c2"], "SOLO")
    make_logo(os.path.join(d, "logo.png"), name, c["c1"])

# Team logos
teams = {
    "Flamengo": (200, 0, 0),
    "Palmeiras": (0, 90, 40),
    "Santos": (30, 30, 30),
    "Barcelona": (0, 60, 140),
}
for t, c in teams.items():
    make_logo(os.path.join(PUB, "logos", f"{t}.png"), t, c)

# Players
players = {
    "Flamengo": [("Pedro", (150, 0, 0)), ("Arrascaeta", (170, 20, 20)), ("Plata", (190, 40, 40))],
    "Santos": [("Neymar", (20, 20, 20)), ("Rollheiser", (40, 40, 40))],
    "Palmeiras": [("Endrick", (0, 70, 30)), ("Dudu", (0, 90, 40))],
}
for team, plist in players.items():
    d = os.path.join(PUB, "players", team)
    os.makedirs(d, exist_ok=True)
    for name, color in plist:
        make_player(os.path.join(d, f"{name}.png"), name, color)

print("placeholders generated")
