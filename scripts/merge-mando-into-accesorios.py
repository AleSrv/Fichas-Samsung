"""Merge 'Mando a distancia' sections into 'Accesorios' in spec files."""

import re
from pathlib import Path

SPECS_DIR = Path(__file__).resolve().parent.parent / "src" / "data" / "specs"

# Files containing BOTH ## Accesorios and ## Mando a distancia
merge_files = [
    "m72h-2026.md", "m73h-2026.md", "m80h-2026.md", "m90h-2026.md",
    "qn1eh-2026.md", "qn70h-2026.md", "qn73h-2026.md", "qn80h-2026.md",
    "qn90f-2026.md",
    "r85h-2026.md", "r95h-2026.md",
    "s83h-2026.md", "s90h-2026.md", "s93h-2026.md", "s95h-2026.md",
    "s99h-2026.md",
]

# Files containing only ## Mando a distancia (no ## Accesorios)
rename_files = [
    "the-frame-2026.md", "the-frame-pro-2026.md", "moving-style-2025.md",
]


def get_section_boundaries(content, heading_prefix):
    """Find (start_line, end_line) for a given ## heading."""
    lines = content.split('\n')
    positions = []
    for i, line in enumerate(lines):
        if line.startswith('## ') and not line.startswith('### '):
            positions.append(i)
    positions.append(len(lines))

    result = {}
    for idx, start in enumerate(positions[:-1]):
        h = lines[start]
        key = h[3:].strip()
        end = positions[idx + 1]
        result[key] = (start, end)
    return result


for fname in merge_files:
    path = SPECS_DIR / fname
    if not path.exists():
        print(f"SKIP {fname} (not found)")
        continue

    content = path.read_text(encoding='utf-8')
    orig = content
    sections = get_section_boundaries(content, '## ')

    if 'Accesorios' not in sections or 'Mando a distancia' not in sections:
        print(f"SKIP {fname} (missing sections)")
        continue

    acc_start, acc_end = sections['Accesorios']
    mando_start, mando_end = sections['Mando a distancia']

    # Get Accesorios content (without the heading line)
    acc_lines = content.split('\n')[acc_start+1:acc_end]

    # Clean leading blanks from Accesorios content
    acc_text = '\n'.join(acc_lines)

    # Get Mando a distancia content (without the heading line and images)
    mando_lines = content.split('\n')[mando_start+1:mando_end]
    # Filter out <!-- image --> and empty leading lines
    filtered_mando = []
    for line in mando_lines:
        if '<!-- image -->' in line:
            continue
        filtered_mando.append(line)
    # Strip leading blank lines
    while filtered_mando and filtered_mando[0].strip() == '':
        filtered_mando.pop(0)
    mando_text = '\n'.join(filtered_mando)

    merged_acc = acc_text.rstrip() + '\n\n' + mando_text

    # Replace old Accesorios block
    old_acc_block = '\n'.join(content.split('\n')[acc_start:acc_end])
    new_acc_block = '## Accesorios\n' + merged_acc
    content = content.replace(old_acc_block, new_acc_block, 1)

    # Remove old Mando a distancia block (heading line + content)
    old_mando_block = '\n'.join(content.split('\n')[mando_start:mando_end])
    # After replacing Accesorios, the line numbers may have shifted, so find by text
    # Safer: just find and remove the mando section by regex
    if 'Mando a distancia' in content:
        content = re.sub(
            r'^## Mando a distancia\n(?:.*\n)*?(?=^## |\Z)',
            '',
            content,
            flags=re.MULTILINE
        )
        # Clean up extra blank lines left behind
        content = re.sub(r'\n{3,}', '\n\n', content)

    if content != orig:
        path.write_text(content, encoding='utf-8')
        print(f"FIXED {fname}")
    else:
        print(f"UNCHANGED {fname}")


for fname in rename_files:
    path = SPECS_DIR / fname
    if not path.exists():
        print(f"SKIP {fname} (not found)")
        continue

    content = path.read_text(encoding='utf-8')
    orig = content
    content = content.replace('## Mando a distancia', '## Accesorios')

    if content != orig:
        path.write_text(content, encoding='utf-8')
        print(f"RENAMED {fname}")
    else:
        print(f"UNCHANGED {fname}")

print("\nDone.")
