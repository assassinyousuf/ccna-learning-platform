with open('extracted_content/vol1/markdown.md', 'r', encoding='utf-8') as f:
    text = f.read()

chapters_v1 = [
    (1, "Introduction to the CCNA"),
    (2, "Network devices"),
    (3, "Cables, connectors, and ports"),
    (4, "The TCP/IP networking model"),
    (5, "The Cisco IOS CLI"),
    (6, "Ethernet LAN switching"),
    (7, "IPv4 addressing"),
    (8, "Router and switch interfaces"),
    (9, "Routing fundamentals"),
    (10, "The life of a packet"),
    (11, "Subnetting IPv4 networks"),
    (12, "VLANs"),
    (13, "Dynamic Trunking Protocol and VLAN Trunking Protocol"),
    (14, "Spanning Tree Protocol"),
    (15, "Rapid Spanning Tree Protocol"),
    (16, "EtherChannel"),
    (17, "Dynamic routing"),
    (18, "Open Shortest Path First"),
    (19, "First hop redundancy protocols"),
    (20, "IPv6 addressing"),
    (21, "IPv6 routing"),
    (22, "Transmission Control Protocol and User Datagram Protocol"),
    (23, "Standard access control lists"),
    (24, "Extended access control lists"),
]

app_a_pos = text.find('## Appendix A')

for num, title in chapters_v1:
    # search after TOC (say after pos 30000 for ch 2+)
    start_search = 10000 if num == 1 else 35000
    pos = text.lower().find(title.lower(), start_search, app_a_pos)
    # also try searching for "This chapter covers" near it
    print(f"Vol 1 Ch {num}: '{title}' -> pos {pos}")
