import re
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
EXTRACTED_V1 = BASE_DIR / "extracted_content" / "vol1" / "markdown.md"
EXTRACTED_V2 = BASE_DIR / "extracted_content" / "vol2" / "markdown.md"
CHAPTERS_DIR = BASE_DIR / "src" / "data" / "chapters"
OUTPUT_CURRICULUM_JSON = BASE_DIR / "src" / "data" / "curriculum.json"

CHAPTERS_DIR.mkdir(parents=True, exist_ok=True)

V1_CHAPTERS = [
    (1, "Introduction to the CCNA", 0, "Introduction", "Overview of the Cisco Certified Network Associate exam, certification benefits, testing format, and optimal study methodology."),
    (2, "Network devices", 1, "Network fundamentals", "Identify network components: clients, servers, Layer 2/3 switches, routers, and firewalls."),
    (3, "Cables, connectors, and ports", 1, "Network fundamentals", "Compare physical cabling: copper UTP (Cat 5e/6/6a), straight-through vs crossover, Auto MDI-X, fiber-optic (single-mode vs multimode), and speed ratings."),
    (4, "The TCP/IP networking model", 1, "Network fundamentals", "Understand OSI 7-layer vs TCP/IP 4-layer models, data encapsulation, protocol data units (PDUs), and same-layer/adjacent-layer interaction."),
    (5, "The Cisco IOS CLI", 1, "Network fundamentals", "Master Cisco IOS CLI modes (User EXEC, Privileged EXEC, Global Config, Interface Config), navigation shortcuts, and configuration files (running-config, startup-config)."),
    (6, "Ethernet LAN switching", 1, "Network fundamentals", "Understand Ethernet frame format, MAC learning, frame forwarding, unknown unicast flooding, MAC address table management, ARP, and ICMP ping."),
    (7, "IPv4 addressing", 1, "Network fundamentals", "IPv4 packet header fields, binary conversions, 32-bit address architecture, network vs host bits, default subnet masks, and address classes (A, B, C, D, E)."),
    (8, "Router and switch interfaces", 1, "Network fundamentals", "Configure interface descriptions, speed, duplex, autonegotiation, and diagnose duplex mismatches, collisions, and interface error counters."),
    (9, "Routing fundamentals", 2, "Routing fundamentals and subnetting", "How end hosts determine default gateways, router forwarding decisions, longest prefix match, and static route configuration (recursive, directly connected, fully specified)."),
    (10, "The life of a packet", 2, "Routing fundamentals and subnetting", "Step-by-step tracing of packet encapsulation and frame rewrites across routers, switches, and ARP lookups from source host to remote destination."),
    (11, "Subnetting IPv4 networks", 2, "Routing fundamentals and subnetting", "Master FLSM and VLSM subnetting, calculate subnets, usable host ranges, broadcast addresses, and the magic number technique for /8 through /30 prefixes."),
    (12, "VLANs", 3, "Layer 2 concepts", "Configure VLANs, access ports, 802.1Q trunk ports, native VLANs, and Inter-VLAN routing using Router-on-a-Stick (ROAS) and Multilayer Switch SVIs."),
    (13, "Dynamic Trunking Protocol and VLAN Trunking Protocol", 3, "Layer 2 concepts", "Manage DTP dynamic trunk negotiation (auto, desirable, nonnegotiate) and VTP domain synchronization, modes (server, client, transparent, off), and version differences."),
    (14, "Spanning Tree Protocol", 3, "Layer 2 concepts", "Prevent Layer 2 switching loops with 802.1D STP: root bridge election, root port and designated port selection, port states, timers, PortFast, and BPDU Guard."),
    (15, "Rapid Spanning Tree Protocol", 3, "Layer 2 concepts", "Accelerate convergence with 802.1w RSTP: alternate and backup port roles, edge ports, link types, topology change notifications, Root Guard, and Loop Guard."),
    (16, "EtherChannel", 3, "Layer 2 concepts", "Aggregate multiple switch links into a single logical channel using Cisco PAgP, industry-standard IEEE 802.3ad LACP, and configure EtherChannel load balancing."),
    (17, "Dynamic routing", 4, "Dynamic routing and first hop redundancy protocols", "Dynamic routing concepts, Interior Gateway Protocols (IGPs) vs EGPs, Administrative Distance, metric comparison, ECMP, and floating static routes."),
    (18, "Open Shortest Path First", 4, "Dynamic routing and first hop redundancy protocols", "Configure single-area OSPFv2: Link-State Database (LSDB), router ID election, neighbor states (Down to Full), DR/BDR election on broadcast links, and passive interfaces."),
    (19, "First hop redundancy protocols", 4, "Dynamic routing and first hop redundancy protocols", "Implement default gateway redundancy with HSRP (Hot Standby Router Protocol), VRRP, and GLBP: virtual IP/MAC addresses, priority, and preemption."),
    (20, "IPv6 addressing", 5, "IPv6", "128-bit IPv6 address architecture, hexadecimal notation, address compression rules, Global Unicast (GUA), Unique Local (ULA), Link-Local (LLA), Modified EUI-64, and Anycast."),
    (21, "IPv6 routing", 5, "IPv6", "Neighbor Discovery Protocol (NDP), SLAAC autoconfiguration, Duplicate Address Detection (DAD), IPv6 static routing with next-hop addresses and link-local exit interfaces."),
    (22, "Transmission Control Protocol and User Datagram Protocol", 6, "Layer 4 and IP access control lists", "Layer 4 transport operations: TCP connection establishment (3-way handshake), reliable delivery, windowing, and UDP low-overhead transmission, with port multiplexing."),
    (23, "Standard access control lists", 6, "Layer 4 and IP access control lists", "Filter IPv4 traffic based on source IP address: numbered (1-99, 1300-1999) and named standard ACLs, wildcard masks, implicit deny, and inbound/outbound placement."),
    (24, "Extended access control lists", 6, "Layer 4 and IP access control lists", "Deep traffic filtering with extended ACLs (100-199, 2000-2699): match protocols (IP, TCP, UDP, ICMP), source/destination IPs, TCP/UDP port operators (eq, gt, lt, range), and ACE resequencing.")
]

V2_CHAPTERS = [
    (1, "Cisco Discovery Protocol and Link Layer Discovery Protocol", 1, "Network services", "Discover directly connected Cisco and non-Cisco network devices using CDP (Cisco proprietary) and LLDP (IEEE 802.1AB vendor-neutral) protocols."),
    (2, "Network Time Protocol", 1, "Network services", "Synchronize network device clocks across stratum tiers using NTP client and server modes, NTP authentication, and timezone configuration."),
    (3, "Domain Name System", 1, "Network services", "Understand DNS hostname-to-IP resolution hierarchy, record types (A, AAAA, CNAME, MX, PTR), and configure Cisco IOS as a DNS client and server."),
    (4, "Dynamic Host Configuration Protocol", 1, "Network services", "Automate IPv4 client addressing using DHCP (DORA process), configure Cisco IOS as a DHCP server, DHCP client, and DHCP relay agent (ip helper-address)."),
    (5, "Secure Shell", 1, "Network services", "Secure device management access by replacing unencrypted Telnet with SSH: generate RSA cryptographic keys, configure local usernames, and vty line transport."),
    (6, "Simple Network Management Protocol", 1, "Network services", "Network monitoring and management using SNMP: MIBs, OIDs, Manager vs Agent, SNMP operations (Get, Set, Traps, Informs), and compare SNMPv1, v2c, and v3 security."),
    (7, "Syslog", 1, "Network services", "Configure centralized logging: Syslog message structure, 8 severity levels (0 Emergencies to 7 Debugging), timestamping, and sending log buffers to external syslog servers."),
    (8, "Trivial File Transfer Protocol and File Transfer Protocol", 1, "Network services", "Backup and restore Cisco IOS software images and configuration files using TFTP and FTP client operations."),
    (9, "Network Address Translation", 1, "Network services", "Conserve IPv4 address space and connect private networks to the internet using Static NAT, Dynamic NAT, and Dynamic PAT (Port Address Translation / NAT Overload)."),
    (10, "Quality of service", 1, "Network services", "Prioritize real-time voice and video traffic: classification, marking (IP Precedence, DSCP, CoS), queuing (FIFO, PQ, CBWFQ, LLQ), policing, shaping, and congestion avoidance."),
    (11, "Security concepts", 2, "Security fundamentals", "Fundamental security principles: CIA triad, threat vectors, vulnerabilities, exploits, AAA framework (RADIUS/TACACS+), 802.1X, and next-generation firewalls vs IPS."),
    (12, "Port Security", 2, "Security fundamentals", "Mitigate Layer 2 MAC flooding and rogue device connections on switch access ports using static, dynamic, and sticky Port Security violation modes (protect, restrict, shutdown)."),
    (13, "DHCP Snooping", 2, "Security fundamentals", "Defend against rogue DHCP servers and DHCP starvation attacks: trusted vs untrusted ports, DHCP Snooping binding table, and Option 82 insertion."),
    (14, "Dynamic ARP Inspection", 2, "Security fundamentals", "Prevent ARP poisoning and man-in-the-middle attacks using DAI: validate ARP packets against the DHCP Snooping binding database and static ARP ACLs."),
    (15, "LAN architectures", 3, "Network architectures", "Campus network design best practices: two-tier collapsed core, three-tier hierarchical (Core, Distribution, Access), data center spine-leaf architecture, and SOHO topologies."),
    (16, "WAN architectures", 3, "Network architectures", "Wide Area Network connectivity: traditional leased lines, MPLS VPNs, broadband internet (DSL, Cable, Fiber Ethernet), 4G/5G wireless WAN, and IPsec site-to-site VPNs."),
    (17, "Virtualization and cloud", 3, "Network architectures", "Virtual machines (Type 1 and Type 2 hypervisors) vs containers, Virtual Routing and Forwarding (VRF-Lite), and cloud computing service models (IaaS, PaaS, SaaS) and deployments."),
    (18, "Wireless LAN fundamentals", 4, "Wireless LANs", "Radio frequency (RF) physics, 2.4 GHz vs 5 GHz vs 6 GHz frequency bands, non-overlapping channels, 802.11 standards (a/b/g/n/ac/ax), and wireless service sets (BSS, ESS, MBSS)."),
    (19, "Wireless LAN architectures", 4, "Wireless LANs", "Cisco wireless architectures: Autonomous APs vs Lightweight APs (LWAP), split-MAC architecture, CAPWAP tunnels, and Cloud-managed wireless (Cisco Meraki)."),
    (20, "Wireless LAN security", 4, "Wireless LANs", "Secure wireless communications: compare WPA, WPA2, and WPA3 protocols, Personal (PSK/SAE) vs Enterprise (802.1X/EAP/RADIUS), and TKIP vs CCMP vs GCMP encryption."),
    (21, "Wireless LAN configuration", 4, "Wireless LANs", "Configure Cisco Wireless LAN Controllers (WLC) via GUI and CLI: create dynamic interfaces, configure WLANs, apply WPA2/WPA3 security policies, and associate LWAPs."),
    (22, "Network automation", 5, "Network automation", "Impact of automation on enterprise network operations: management plane, control plane, data plane, controller-based networking (Cisco DNA / Catalyst Center, SD-Access, SD-WAN), and AI/ML in operations."),
    (23, "REST APIs", 5, "Network automation", "Communicate with network controllers via REST APIs: HTTP verbs (GET, POST, PUT, DELETE), status codes (200, 201, 400, 401, 404), authentication tokens, and API requests to Catalyst Center."),
    (24, "Data formats", 5, "Network automation", "Data serialization for network programmability: compare JSON, XML, and YAML syntax, and validate JSON data types (strings, numbers, booleans, arrays, objects)."),
    (25, "Ansible and Terraform", 5, "Network automation", "Configuration management and infrastructure as code: compare agentless vs agent-based tools, push vs pull models, Ansible playbooks (YAML), and Terraform declarative state management.")
]

def parse_appendix_b(text):
    """Extract CLI commands per chapter from Appendix B table."""
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

def parse_appendix_c_and_d(text):
    """Extract questions from Appendix C and answers & explanations from Appendix D."""
    app_c_start = text.find('## Appendix C. Chapter quiz questions')
    app_d_start = text.find('## Appendix D. Chapter quiz answers')
    app_end = text.find('## Index', app_d_start)
    if app_end == -1: app_end = text.find('**Index**', app_d_start)
    if app_end == -1: app_end = len(text)

    c_text = text[app_c_start:app_d_start]
    d_text = text[app_d_start:app_end]

    def parse_sections(raw_text):
        pattern = r'\n##\s+(?:Chapter\s+)?(\d+)[:\.\s]+([A-Za-z][^\n]+)'
        matches = list(re.finditer(pattern, raw_text))
        chaps = {}
        for idx, m in enumerate(matches):
            c_num = int(m.group(1))
            c_title = m.group(2).strip()
            if '?' in c_title or c_title.lower().startswith(('what', 'which', 'how', 'why', 'where', 'figure')):
                continue
            start_pos = m.end()
            next_start = len(raw_text)
            for next_m in matches[idx+1:]:
                next_title = next_m.group(2).strip()
                if '?' not in next_title and not next_title.lower().startswith(('what', 'which', 'how', 'why', 'where', 'figure')):
                    next_start = next_m.start()
                    break
            chaps[c_num] = raw_text[start_pos:next_start]
        return chaps

    c_chaps = parse_sections(c_text)
    d_chaps = parse_sections(d_text)

    quizzes = {}
    all_c_nums = sorted(set(list(c_chaps.keys()) + list(d_chaps.keys())))
    for c_num in all_c_nums:
        c_raw = c_chaps.get(c_num, "")
        d_raw = d_chaps.get(c_num, "")
        
        d_items = re.split(r'\n(?:\*\*)?(\d+)\.(?:\*\*)?\s+', '\n' + d_raw)
        d_dict = {}
        for k in range(1, len(d_items), 2):
            q_num = int(d_items[k])
            block = d_items[k+1].strip()
            lines = [l.strip() for l in block.split('\n') if l.strip()]
            if not lines: continue
            q_text = lines[0]
            ans_text = ""
            exp_text = ""
            for l in lines[1:]:
                clean_l = l.replace('```txt', '').replace('```', '').strip()
                if not clean_l: continue
                if not ans_text and re.match(r'^[A-F](?::|\.)', clean_l):
                    ans_text = clean_l
                else:
                    if exp_text: exp_text += " " + clean_l
                    else: exp_text = clean_l
            d_dict[q_num] = {'q_text': q_text, 'ans': ans_text, 'exp': exp_text}

        c_items = re.split(r'\n(\d+)\.\s+', '\n' + c_raw)
        c_dict = {}
        for k in range(1, len(c_items), 2):
            q_num = int(c_items[k])
            block = c_items[k+1].strip()
            c_dict[q_num] = block

        chapter_quiz = []
        all_q_nums = sorted(set(list(c_dict.keys()) + list(d_dict.keys())))
        for q_num in all_q_nums:
            c_block = c_dict.get(q_num, "")
            d_info = d_dict.get(q_num, {})
            
            q_prompt = ""
            options = []
            if c_block:
                opt_matches = list(re.finditer(r'\b([A-F])\.\s+', c_block))
                if opt_matches:
                    q_prompt = c_block[:opt_matches[0].start()].strip()
                    for idx, opt_m in enumerate(opt_matches):
                        letter = opt_m.group(1)
                        start_pos = opt_m.end()
                        end_pos = opt_matches[idx+1].start() if idx+1 < len(opt_matches) else len(c_block)
                        opt_content = c_block[start_pos:end_pos].strip()
                        options.append(f"{letter}. {opt_content}")
                else:
                    q_prompt = c_block
            
            if not q_prompt and d_info:
                q_prompt = d_info.get('q_text', f"Question {q_num}")

            corr_ans = d_info.get('ans', '')
            correct_index = 0
            m_letter = re.match(r'^([A-F])(?::|\.|\s)', corr_ans)
            if m_letter:
                letter = m_letter.group(1).upper()
                letter_idx = ord(letter) - ord('A')
                if 0 <= letter_idx < len(options):
                    correct_index = letter_idx
            
            explanation = d_info.get('exp', '')
            if not explanation:
                explanation = f"Official answer: {corr_ans}. Review the chapter concepts to master this exam topic."

            chapter_quiz.append({
                "id": f"q{c_num}-{q_num}",
                "number": q_num,
                "question": q_prompt.strip(),
                "options": options if options else [corr_ans, "Option B", "Option C", "Option D"],
                "correctAnswer": correct_index,
                "answerLetter": m_letter.group(1) if m_letter else "A",
                "officialAnswer": corr_ans.strip(),
                "explanation": explanation.strip()
            })
        quizzes[c_num] = chapter_quiz
    return quizzes

def find_v1_slices(full_text, chapters_meta):
    """Slice Vol 1 using the 24 '## This chapter covers' markers."""
    covers = list(re.finditer(r'## This chapter covers', full_text))
    app_a_pos = full_text.find('## Appendix A')
    if app_a_pos == -1: app_a_pos = len(full_text)

    slices = []
    for i in range(len(covers)):
        num = i + 1
        meta = next((m for m in chapters_meta if m[0] == num), None)
        title = meta[1] if meta else f"Chapter {num}"
        start = covers[i].start()
        end = covers[i+1].start() if i+1 < len(covers) else app_a_pos
        slices.append((num, start, end, title))
    return slices

def find_v2_slices(full_text, chapters_meta):
    """Slice Vol 2 using the 25 chapter headers."""
    app_a_pos = full_text.find('## Appendix A')
    if app_a_pos == -1: app_a_pos = len(full_text)

    ch_positions = []
    for num in range(1, 26):
        pattern = rf'\n(?:#|##)\s+(?:Chapter\s+)?{num}\s+([^\n]+)'
        matches = list(re.finditer(pattern, full_text[28000:app_a_pos]))
        if matches:
            ch_positions.append((num, 28000 + matches[0].start(), matches[0].group(1).strip()))

    slices = []
    for i in range(len(ch_positions)):
        num, start, title = ch_positions[i]
        end = ch_positions[i+1][1] if i+1 < len(ch_positions) else app_a_pos
        meta = next((m for m in chapters_meta if m[0] == num), None)
        clean_title = meta[1] if meta else title
        slices.append((num, start, end, clean_title))
    return slices

def process_volume(vol_num, file_path, chapters_meta):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()

    if vol_num == 1:
        slices = find_v1_slices(text, chapters_meta)
    else:
        slices = find_v2_slices(text, chapters_meta)

    cmds_map = parse_appendix_b(text)
    quizzes_map = parse_appendix_c_and_d(text)

    vol_modules = []

    for c_num, start, end, c_title in slices:
        raw_content = text[start:end].strip()

        # Rewrite image paths to web assets
        img_prefix = f"/extracted/vol{vol_num}/images/"
        processed_content = re.sub(r'!\[(.*?)\]\(images/([^)]+)\)', rf'![\1]({img_prefix}\2)', raw_content)

        # Extract sub-sections for table of contents
        headings = []
        for line in processed_content.split('\n'):
            line_s = line.strip()
            if line_s.startswith('## ') or line_s.startswith('### '):
                h_title = line_s.lstrip('#').strip()
                if h_title.lower() != 'this chapter covers' and not h_title.lower().startswith('figure') and not h_title.lower().startswith('part '):
                    # Check if it's another chapter header like "## 3 Cables..."
                    m_other_ch = re.match(r'^(?:Chapter\s+)?(\d+)\s+[A-Za-z]', h_title)
                    if m_other_ch and int(m_other_ch.group(1)) != c_num:
                        continue
                    anchor = re.sub(r'[^a-z0-9]+', '-', h_title.lower()).strip('-')
                    headings.append({
                        "title": h_title,
                        "anchor": anchor,
                        "level": 2 if line_s.startswith('## ') else 3
                    })


        # Extract diagrams
        img_matches = re.findall(r'!\[(.*?)\]\((/extracted/vol\d+/images/[^)]+)\)', processed_content)
        diagrams = []
        for caption, src in img_matches:
            clean_caption = caption.strip() if caption.strip() else f"Figure: {c_title}"
            diagrams.append({"src": src, "caption": clean_caption})

        # Extract "This chapter covers" bullet points
        key_points = []
        m_covers = re.search(r'## This chapter covers\s*\n\n(.*?)(?=\n##|\n\n[A-Z]|\Z)', processed_content, re.DOTALL)
        if m_covers:
            for l in m_covers.group(1).strip().split('\n'):
                ls = l.strip().lstrip('-*•').strip()
                if ls and len(ls) > 3:
                    key_points.append(ls)

        if not key_points:
            key_points = [
                f"Core theoretical principles and architecture of {c_title}.",
                f"Cisco IOS command line syntax and configuration verification.",
                f"Packet Tracer lab simulation and end-of-chapter quiz questions."
            ]

        cmds = cmds_map.get(c_num, [])
        if not cmds and c_num > 1 and (c_num - 1) in cmds_map:
            cmds = cmds_map.get(c_num - 1, [])[:6]

        quiz = quizzes_map.get(c_num, [])

        # Lab mission
        cmd_examples = [c['cmd'] for c in cmds[:3]] if cmds else ["show ip interface brief", "show running-config"]
        lab_mission = {
            "scenario": f"Deploy, configure, and verify {c_title} inside Cisco Packet Tracer according to Jeremy McDowell's lab specifications.",
            "objectives": [
                f"Download and open Cisco Packet Tracer (free at http://mng.bz/2Kra).",
                f"Construct the topology for Chapter {c_num}: {c_title}.",
                f"Implement core CLI commands: {', '.join(cmd_examples)}.",
                f"Verify operational state and capture verification output."
            ],
            "verificationCommands": [c['cmd'] for c in cmds[:5]] if cmds else ["show version", "show interfaces status"],
            "videoSubmissionPrompt": f"Record a 2 to 5-minute screen and microphone walkthrough of your Packet Tracer lab for Chapter {c_num}: {c_title}. Explain the core concepts in your own words, show your CLI configurations, and run verification commands to demonstrate mastery."
        }

        module_id = f"v{vol_num}-ch{c_num}-{re.sub(r'[^a-z0-9]+', '-', c_title.lower()).strip('-')}"

        # Find part metadata
        part_num = 1
        part_title = "Fundamentals"
        meta = next((m for m in chapters_meta if m[0] == c_num), None)
        if meta:
            part_num = meta[2]
            part_title = meta[3]
            desc = meta[4]
        else:
            desc = f"Comprehensive study of {c_title}."

        chapter_data = {
            "id": module_id,
            "volume": vol_num,
            "volumeTitle": "Volume 1: Fundamentals and Protocols" if vol_num == 1 else "Volume 2: Advanced Networking and Security",
            "partNumber": part_num,
            "partTitle": part_title,
            "chapterNumber": c_num,
            "title": f"Chapter {c_num}: {c_title}",
            "rawTitle": c_title,
            "description": desc,
            "readTime": f"{max(20, round(len(processed_content) / 900))} min",
            "keyPoints": key_points[:6],
            "tableOfContents": headings,
            "diagrams": diagrams,
            "ciscoCommands": cmds,
            "quiz": quiz,
            "labMission": lab_mission,
            "fullText": processed_content
        }

        # Save individual chapter JSON
        chap_file = CHAPTERS_DIR / f"{module_id}.json"
        with open(chap_file, 'w', encoding='utf-8') as f_out:
            json.dump(chapter_data, f_out, indent=2, ensure_ascii=False)

        # Append to summary module list (without giant fullText for fast initial navigation)
        summary_item = {k: v for k, v in chapter_data.items() if k != 'fullText'}
        summary_item["contentLength"] = len(processed_content)
        summary_item["diagramCount"] = len(diagrams)
        vol_modules.append(summary_item)

    return vol_modules

print("Starting full interactive book extraction...")
v1_mods = process_volume(1, EXTRACTED_V1, V1_CHAPTERS)
v2_mods = process_volume(2, EXTRACTED_V2, V2_CHAPTERS)
all_mods = v1_mods + v2_mods

total_chars = sum(m.get('contentLength', 0) for m in all_mods)
total_diagrams = sum(m.get('diagramCount', 0) for m in all_mods)
total_cmds = sum(len(m.get('ciscoCommands', [])) for m in all_mods)
total_quiz = sum(len(m.get('quiz', [])) for m in all_mods)

print(f"\nExtracted {len(all_mods)} chapters!")
print(f"Total textbook characters: {total_chars:,}")
print(f"Total book diagrams: {total_diagrams}")
print(f"Total Appendix B commands: {total_cmds}")
print(f"Total Appendix C/D quiz questions: {total_quiz}")

# Build global curriculum file
v1_parts_grouped = []
for p_num in range(7):
    p_chaps = [m for m in v1_mods if m['partNumber'] == p_num]
    if p_chaps:
        v1_parts_grouped.append({
            "partNumber": p_num,
            "partTitle": p_chaps[0]['partTitle'],
            "description": f"Chapters on {p_chaps[0]['partTitle']}",
            "chapters": [m['chapterNumber'] for m in p_chaps]
        })

v2_parts_grouped = []
for p_num in range(1, 6):
    p_chaps = [m for m in v2_mods if m['partNumber'] == p_num]
    if p_chaps:
        v2_parts_grouped.append({
            "partNumber": p_num,
            "partTitle": p_chaps[0]['partTitle'],
            "description": f"Chapters on {p_chaps[0]['partTitle']}",
            "chapters": [m['chapterNumber'] for m in p_chaps]
        })

global_curriculum = {
    "title": "Acing the CCNA Exam: Interactive Digital Edition",
    "author": "Jeremy McDowell (CCIE #59049)",
    "pedagogicalMethod": {
        "name": "Jeremy McDowell's 5-Pillar CCNA Learning Framework",
        "summary": "As detailed in Section 1.4 of the textbook, optimal CCNA preparation combines active reading with note-taking, mastering CLI commands from Appendix B, testing recall via Appendix C review questions with Appendix D explanations, extensive hands-on Cisco Packet Tracer labbing, and demonstrating mastery through active teaching and video proof.",
        "pillars": [
            {
                "pillar": 1,
                "title": "Active Reading & Topologies",
                "description": "Stop occasionally to reflect, take notes, and study network topologies and packet header diagrams rather than passively reading."
            },
            {
                "pillar": 2,
                "title": "Cisco IOS CLI Mastery (Appendix B)",
                "description": "Master exact command syntax, EXEC/Config modes, and operational parameters for all ~300 Cisco IOS commands."
            },
            {
                "pillar": 3,
                "title": "Hands-On Labbing (Cisco Packet Tracer)",
                "description": "Labbing is non-negotiable. Configure routers, switches, and firewalls in Cisco Packet Tracer to build real muscle memory."
            },
            {
                "pillar": 4,
                "title": "Official Chapter Review Quizzes (Appendix C & D)",
                "description": "Attempt official review questions immediately after each chapter and study official explanations in Appendix D."
            },
            {
                "pillar": 5,
                "title": "Active Recall & Video Proof of Skill",
                "description": "Explain concepts in your own words and record yourself walking through your working Packet Tracer topology. Video is stored directly in 5TB Google Drive and grade logged to Google Sheets."
            }
        ]
    },
    "volumes": [
        {
            "volumeNumber": 1,
            "title": "Volume 1: Fundamentals and Protocols",
            "parts": v1_parts_grouped
        },
        {
            "volumeNumber": 2,
            "title": "Volume 2: Advanced Networking and Security",
            "parts": v2_parts_grouped
        }
    ],
    "totalModules": len(all_mods),
    "modules": all_mods
}

with open(OUTPUT_CURRICULUM_JSON, 'w', encoding='utf-8') as f:
    json.dump(global_curriculum, f, indent=2, ensure_ascii=False)

print(f"Global curriculum saved to: {OUTPUT_CURRICULUM_JSON}")
