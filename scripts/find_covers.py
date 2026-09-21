import re

with open('extracted_content/vol1/markdown.md', 'r', encoding='utf-8') as f:
    text = f.read()

matches = [m.start() for m in re.finditer(r'## This chapter covers', text)]
print(f'Found {len(matches)} "## This chapter covers" in Vol 1!')
for p in matches:
    pre = text[max(0, p-120):p].strip()
    print('--- CHAPTER START AT', p, '---')
    print(pre)

with open('extracted_content/vol2/markdown.md', 'r', encoding='utf-8') as f:
    text2 = f.read()

matches2 = [m.start() for m in re.finditer(r'## This chapter covers', text2)]
print(f'\nFound {len(matches2)} "## This chapter covers" in Vol 2!')
for p in matches2[:10]:
    pre = text2[max(0, p-120):p].strip()
    print('--- V2 CHAPTER START AT', p, '---')
    print(pre)
