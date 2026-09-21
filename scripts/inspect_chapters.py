import re

def inspect_chapters(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Find boundaries of main book content (after TOC and before Appendix A)
    app_a_pos = text.find('## Appendix A')
    if app_a_pos == -1: app_a_pos = text.find('Appendix A.')
    
    # We want to find chapter titles
    # In TOC we saw:
    # 2  Network devices
    # 3  Cables, connectors, and ports
    # Let's search for patterns like:
    # \n## (\d+)\s+([^\n]+)
    # or \n## Chapter (\d+):?\s*([^\n]+)
    matches = list(re.finditer(r'\n##\s+(?:Chapter\s+)?(\d+)\s+([^\n]+)', text[:app_a_pos]))
    print(f"\n{file_path} - Found {len(matches)} chapter-like headers:")
    for m in matches[:15]:
        print(f"  Line pos {m.start()}: Ch {m.group(1)} - {m.group(2)}")

inspect_chapters('extracted_content/vol1/markdown.md')
inspect_chapters('extracted_content/vol2/markdown.md')
