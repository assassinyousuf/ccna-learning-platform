import re
import json

def test_app_b(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()
    app_b_start = text.find('## Appendix B. CLI command reference table')
    app_c_start = text.find('## Appendix C. Chapter quiz questions')
    if app_b_start == -1 or app_c_start == -1:
        return {}
    b_html = text[app_b_start:app_c_start]
    rows = re.findall(r'<tr>(.*?)</tr>', b_html, re.DOTALL)
    curr_chap = None
    chap_cmds = {}
    for r in rows:
        m = re.search(r'Chapter\s+(\d+)', r, re.IGNORECASE)
        if m:
            curr_chap = int(m.group(1))
            chap_cmds.setdefault(curr_chap, [])
        cells = re.findall(r'<td[^>]*>(.*?)</td>', r, re.DOTALL)
        if len(cells) == 3 and 'colspan' not in r:
            mode = re.sub(r'<[^>]+>', '', cells[0]).strip().replace('&gt;', '>').replace('&lt;', '<')
            cmd = re.sub(r'<[^>]+>', '', cells[1]).strip()
            desc = re.sub(r'<[^>]+>', '', cells[2]).strip()
            if cmd and curr_chap and not cmd.lower().startswith('the cisco ios') and not cmd.lower().startswith('command'):
                chap_cmds.setdefault(curr_chap, []).append({'mode': mode, 'cmd': cmd, 'desc': desc})
    return chap_cmds

def test_app_c_and_d(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()
    app_c_start = text.find('## Appendix C. Chapter quiz questions')
    app_d_start = text.find('## Appendix D. Chapter quiz answers')
    app_end = text.find('## Appendix E', app_d_start)
    if app_end == -1: app_end = text.find('## Index', app_d_start)
    if app_end == -1: app_end = text.find('**Index**', app_d_start)
    if app_end == -1: app_end = len(text)

    c_text = text[app_c_start:app_d_start]
    d_text = text[app_d_start:app_end]

    # Let's inspect how chapters are separated in App C
    c_sections = re.split(r'\n##\s+(?:Chapter\s+)?(\d+[\s\w,:\-\+]+)', c_text)
    for i in range(1, min(5, len(c_sections)), 2):
        print(f"HEADER: '{c_sections[i]}'")
        print(f"CONTENT SNIPPET:\n{c_sections[i+1][:400]}\n---")
    
    d_sections = re.split(r'\n##\s+(?:Chapter\s+)?(\d+[\s\w,:\-\+]+)', d_text)
    for i in range(1, min(5, len(d_sections)), 2):
        print(f"D HEADER: '{d_sections[i]}'")
        print(f"D CONTENT SNIPPET:\n{d_sections[i+1][:400]}\n---")

test_app_c_and_d('extracted_content/vol1/markdown.md')


