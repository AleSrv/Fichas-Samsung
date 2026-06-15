"""Extract specs from Samsung catalog PDFs using Docling."""

import os
import time
from pathlib import Path
from docling.document_converter import DocumentConverter

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "src" / "data" / "specs"

entries = [
    ("m72h-2026", "1YOdeFw1xDs2Q9Dhne2RVSRSmlasOCLWC"),
    ("m73h-2026", "1Gg1XnQmK1niDJtF4wJEJ70nx7WbDGqD9"),
    ("m80h-2026", "1MKeEbs_N9FrtmdZY59xOhMh_lBKjiIR3"),
    ("m90h-2026", "1PZKIHXLpIUtCmwZyuDTPI4PPFJqdCFwN"),
    ("f6005f-2026", "1FZltqkEU9pl9IPUz1yQ4GCshBExkbGUN"),
    ("h5005f-2026", "1Illjcemk4F8z70gSZzeEd5axvW8UWcqF"),
    ("microled-2024", "1GBqhloZBLD6dPcCmMUwF30qWcX9TKm3S"),
    ("moving-style-2025", "18pQZwwGYAi74_XXs0HuWxtXzImECfbpB"),
    ("one-connect-2026", "1OcEmo0pmf1nxVlY3wrVGXfDmo0u6TEiB"),
    ("q5f-2026", "1RFBoS8Lj3p1B0u0gxEg2mpfD7RbBTXoA"),
    ("qn1eh-2026", "1Hp7tj_EqajIBgMaOto_yQ4ZNd6eFH9fQ"),
    ("qn70h-2026", "1tXUNkhPRQk1PiOIYChbzRLjRgDz7R2kD"),
    ("qn73h-2026", "1d7e-oaFiP5M5Qi5fLse2IK8fDtqzwopt"),
    ("qn80h-2026", "1EDpTV0DBewUCFjxFni0cZIQq_JA_CV9a"),
    ("qn90f-2026", "15tN0Zcqc0GqvVp3tWIA-f7W0LkGGoCKz"),
    ("r85h-2026", "1crS-_hfbOVw5tyZ5rGpOcVzR4IBL--9X"),
    ("r95h-2026", "1yBrrrfWkZYttHjkkNWB07kQW1Mtwoaqi"),
    ("s83h-2026", "1xs3vZnfraea9a62Lwj0sMB5sE-r05Va9"),
    ("s90h-2026", "1ZoEJzWyP-dqiCBZ_IWhxR5MnT_RKtnDm"),
    ("s93h-2026", "1O7_-uZ6yopXVxzLyxXAaDMGqdAXkOjKU"),
    ("s95h-2026", "1tFiI2bmyop_YvYfehNTEgCi6N7FpfZn7"),
    ("s99h-2026", "1dr6A7ZTAJwMzX0fUi3ji--8Gj8Yo5Btb"),
    ("the-frame-2026", "1EwUBCHfQjosO2ilo6SXksD1ivdwyD05D"),
    ("marcos-the-frame", "1YwgT7jULp-tbsn4-7MA3EFKJXtf1coj7"),
    ("the-frame-pro-2026", "1D1wrSzsoZGPi36i32x_khfCWmJjHsJPI"),
    ("the-premiere-5-2025", "1MSSDGqcvBnqXGyUg26feAywdMHFVvTnJ"),
    ("u7005h-2026", "1x72aNaroTGZ0hXtPLzYCCCgd4G07HwsI"),
    ("u8075h-2026", "1xwTqq0o4miychijQ3YI6GSZ7xo8zjpSU"),
    ("u9005h-2026", "1T71Bp74IZQHWMmIivUYBXDCbZcqXCyfD"),
    ("hw-q600h-2026", "1VSj4zqyN4nCCrj7g3uErXHjd2rhGEob-"),
    ("hw-q800h-2026", "1ucMjraIIeMLrAX3YOr5d0AoSZqDnBCWJ"),
    ("hw-q930h-2026", "1d9SrhmgF8p1Tu6W8dsR3-a1TbW2mj1CJ"),
    ("hw-q990h-2026", "1K2GxFD4BTXnLBcbdOMzfxPeGBSepWYFx"),
    ("hw-qs90h-2026", "1-a6CgcJMm5FlA3w7eODPUUdYKfq48jty"),
    ("ls50-51h-2026", "1LlyIqU_7fso3iOYje_tWyTLxceEoZqEx"),
    ("ls70-71h-2026", "1zN_gDY_mYE3_GqFTJvPzHeDAO_gQzhjj"),
]

os.makedirs(OUTPUT_DIR, exist_ok=True)

converter = DocumentConverter()

ok = 0
fail = 0

for cid, file_id in entries:
    md_path = OUTPUT_DIR / f"{cid}.md"
    if md_path.exists():
        print(f"{cid} ... already exists, skipping")
        ok += 1
        continue

    url = f"https://drive.google.com/uc?export=download&id={file_id}&confirm=t"
    print(f"{cid} ... downloading & parsing", end="", flush=True)

    try:
        result = converter.convert(url)
        md = result.document.export_to_markdown()
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(md)
        ok += 1
        print(" OK")
    except Exception as e:
        fail += 1
        print(f" FAIL: {e}")

    time.sleep(0.5)

print(f"\nDone: {ok} OK, {fail} FAIL")
