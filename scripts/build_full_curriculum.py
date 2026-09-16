import re
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
EXTRACTED_V1 = BASE_DIR / "extracted_content" / "vol1" / "markdown.md"
EXTRACTED_V2 = BASE_DIR / "extracted_content" / "vol2" / "markdown.md"
OUTPUT_JSON = BASE_DIR / "src" / "data" / "curriculum.json"

V1_PARTS = [
    {
        "partNumber": 1,
        "partTitle": "Network fundamentals",
        "description": "Understand core networking infrastructure: routers, switches, firewalls, Ethernet cabling, TCP/IP vs OSI model, Cisco IOS CLI navigation, frame switching, and IPv4 addressing.",
        "chapters": [2, 3, 4, 5, 6, 7, 8]
    },
    {
        "partNumber": 2,
        "partTitle": "Routing fundamentals and subnetting",
        "description": "Master host packet transmission, routing tables, longest prefix match, static routing, packet hop-by-hop forwarding, and binary IPv4 subnetting with FLSM and VLSM.",
        "chapters": [9, 10, 11]
    },
    {
        "partNumber": 3,
        "partTitle": "Layer 2 concepts",
        "description": "Deep dive into VLANs, 802.1Q trunking, Router-on-a-Stick, SVIs, DTP, VTP, Spanning Tree Protocol (STP), Rapid PVST+, and EtherChannel link aggregation.",
        "chapters": [12, 13, 14, 15, 16]
    },
    {
        "partNumber": 4,
        "partTitle": "Dynamic routing and first hop redundancy protocols",
        "description": "Configure and troubleshoot dynamic interior gateway routing with single-area OSPFv2, neighbor adjacencies, DR/BDR elections, and high-availability default gateway redundancy using HSRP.",
        "chapters": [17, 18, 19]
    },
    {
        "partNumber": 5,
        "partTitle": "IPv6",
        "description": "Comprehensive study of IPv6 architecture: hexadecimal notation, address types (GUA, ULA, Link-Local, Multicast, Anycast), Modified EUI-64, SLAAC, NDP, and IPv6 static routing.",
        "chapters": [20, 21]
    },
    {
        "partNumber": 6,
        "partTitle": "Layer 4 and IP access control lists",
        "description": "Analyze Layer 4 transport protocols (TCP vs UDP, port numbers, session multiplexing) and enforce network security using standard and extended Access Control Lists (ACLs).",
        "chapters": [22, 23, 24]
    }
]

V2_PARTS = [
    {
        "partNumber": 1,
        "partTitle": "Network services",
        "description": "Implement essential enterprise network services: CDP, LLDP, NTP time synchronization, DNS resolution, DHCP server and relay, SSH secure management, SNMP, Syslog, TFTP/FTP, NAT/PAT, and Quality of Service (QoS).",
        "chapters": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
        "partNumber": 2,
        "partTitle": "Security fundamentals",
        "description": "Master security architectures: the CIA triad, threats and vulnerabilities, AAA framework (RADIUS/TACACS+), 802.1X, and next-generation firewalls vs IPS.",
        "chapters": [11, 12, 13, 14]
    },
    {
        "partNumber": 3,
        "partTitle": "Network architectures",
        "description": "Explore enterprise campus design (two-tier collapsed core, three-tier), data center spine-leaf, SOHO topologies, WAN technologies (MPLS, leased lines, broadband), IPsec VPNs, virtualization, and cloud service models.",
        "chapters": [15, 16, 17]
    },
    {
        "partNumber": 4,
        "partTitle": "Wireless LANs",
        "description": "Wireless networking from the ground up: RF principles, 802.11 standards, Autonomous vs. Lightweight APs, CAPWAP, WLC architecture, WPA2/WPA3 enterprise encryption, and GUI/CLI WLAN configuration.",
        "chapters": [18, 19, 20, 21]
    },
    {
        "partNumber": 5,
        "partTitle": "Network automation",
        "description": "Modern software-defined networking: control vs. data plane separation, Cisco DNA/Catalyst Center, SD-Access, SD-WAN, REST APIs with HTTP methods, JSON data encoding, and DevOps automation with Ansible and Terraform.",
        "chapters": [22, 23, 24, 25]
    }
]

V1_CHAPTER_METADATA = [
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

V2_CHAPTER_METADATA = [
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
        # Check if row has a chapter header
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

def parse_appendix_c_and_d(text, chapter_titles_map):
    """Extract questions from Appendix C and answers & explanations from Appendix D."""
    app_c_start = text.find('## Appendix C. Chapter quiz questions')
    app_d_start = text.find('## Appendix D. Chapter quiz answers')
    app_end = text.find('## Index', app_d_start)
    if app_end == -1: app_end = text.find('**Index**', app_d_start)
    if app_end == -1: app_end = len(text)

    c_text = text[app_c_start:app_d_start]
    d_text = text[app_d_start:app_end]

    # In D and C, match headers: ## Chapter X: Title or ## X: Title or ## X Title
    def parse_sections(raw_text):
        # find all chapter boundaries
        pattern = r'\n##\s+(?:Chapter\s+)?(\d+)[:\.\s]+([A-Za-z][^\n]+)'
        matches = list(re.finditer(pattern, raw_text))
        chaps = {}
        for idx, m in enumerate(matches):
            c_num = int(m.group(1))
            c_title = m.group(2).strip()
            # If the title ends with '?', it's a question, not a chapter!
            if '?' in c_title or c_title.lower().startswith(('what', 'which', 'how', 'why', 'where')):
                continue
            start_pos = m.end()
            # find next valid match
            next_start = len(raw_text)
            for next_m in matches[idx+1:]:
                next_title = next_m.group(2).strip()
                if '?' not in next_title and not next_title.lower().startswith(('what', 'which', 'how', 'why', 'where')):
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
        
        # Parse D answers
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
                # remove code backticks if any
                clean_l = l.replace('```txt', '').replace('```', '').strip()
                if not clean_l: continue
                if not ans_text and re.match(r'^[A-F](?::|\.)', clean_l):
                    ans_text = clean_l
                else:
                    if exp_text: exp_text += " " + clean_l
                    else: exp_text = clean_l
            d_dict[q_num] = {
                'q_text': q_text,
                'ans': ans_text,
                'exp': exp_text
            }

        # Parse C questions & options
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
                "options": options if options else [corr_ans, "Alternative Option B", "Alternative Option C", "Alternative Option D"],
                "correctAnswer": correct_index,
                "answerLetter": m_letter.group(1) if m_letter else "A",
                "officialAnswer": corr_ans.strip(),
                "explanation": explanation.strip()
            })
        quizzes[c_num] = chapter_quiz

    return quizzes

def extract_chapter_body(full_text, chap_num, chap_title, next_chap_title=None):
    """Extract chapter content and diagrams from extracted book markdown."""
    app_a_pos = full_text.find('## Appendix A')
    if app_a_pos == -1: app_a_pos = len(full_text)
    
    # Locate chapter start
    # Try finding "## This chapter covers" after chapter title or near chapter title
    title_pattern = rf'(?:##|#)?\s*(?:Chapter\s+)?{chap_num}[:\.\s]+{re.escape(chap_title)}'
    m_title = re.search(title_pattern, full_text[:app_a_pos], re.IGNORECASE)
    
    start_pos = 0
    if m_title:
        start_pos = m_title.start()
    else:
        # fallback search for chap_title
        p = full_text.lower().find(chap_title.lower())
        if p != -1:
            start_pos = p
            
    # Look for "## This chapter covers" right after start_pos
    covers_pos = full_text.find('## This chapter covers', max(0, start_pos - 100))
    if covers_pos != -1 and covers_pos - start_pos < 1000:
        actual_start = covers_pos
    else:
        actual_start = start_pos

    # Locate end pos (start of next chapter or appendix)
    end_pos = app_a_pos
    if next_chap_title:
        m_next = re.search(rf'(?:##|#)?\s*(?:Chapter\s+)?(?:\d+)[:\.\s]+{re.escape(next_chap_title)}', full_text[actual_start+500:app_a_pos], re.IGNORECASE)
        if m_next:
            end_pos = actual_start + 500 + m_next.start()
        else:
            p_next = full_text.lower().find(next_chap_title.lower(), actual_start + 500)
            if p_next != -1 and p_next < app_a_pos:
                end_pos = p_next

    chap_text = full_text[actual_start:end_pos].strip()
    
    # Extract diagrams / images
    img_matches = re.findall(r'!\[.*?\]\((images/[^)]+)\)', chap_text)
    diagrams = []
    for img in img_matches[:6]: # up to 6 diagrams per chapter
        diagrams.append({
            "src": f"/extracted/{img}",
            "caption": f"Figure for Chapter {chap_num}: {chap_title}"
        })

    # Extract key points from "This chapter covers"
    key_points = []
    m_covers = re.search(r'## This chapter covers\s*\n\n(.*?)(?=\n##|\n\n[A-Z]|\Z)', chap_text, re.DOTALL)
    if m_covers:
        covers_block = m_covers.group(1).strip()
        for line in covers_block.split('\n'):
            line_s = line.strip().lstrip('-*•').strip()
            if line_s and len(line_s) > 3:
                key_points.append(line_s)
    
    if not key_points:
        key_points = [
            f"Core theory, architectural protocols, and operations of {chap_title}.",
            f"Cisco IOS command line configuration and operational verification.",
            f"Official review questions and Packet Tracer lab implementation."
        ]

    # Format a concise reading summary
    # Clean up markdown text for reading
    clean_text = chap_text[:8000] # preserve rich introductory sections
    
    return {
        "keyPoints": key_points[:5],
        "diagrams": diagrams,
        "contentSnippet": clean_text
    }

def generate_lab_mission(vol_num, chap_num, chap_title, commands):
    """Generate practical Packet Tracer lab mission instructions aligned with the chapter."""
    cmd_examples = [c['cmd'] for c in commands[:3]] if commands else ["show ip interface brief", "show running-config"]
    return {
        "scenario": f"Deploy, configure, and verify {chap_title} inside Cisco Packet Tracer according to Jeremy McDowell's lab specifications.",
        "objectives": [
            f"Download and open Cisco Packet Tracer (free at http://mng.bz/2Kra).",
            f"Build or load the network topology for Chapter {chap_num}: {chap_title}.",
            f"Implement the core Cisco IOS configurations: {', '.join(cmd_examples)}.",
            f"Verify operational state and ensure all end-to-end communication tests pass."
        ],
        "verificationCommands": [c['cmd'] for c in commands[:5]] if commands else ["show version", "show interfaces status"],
        "videoSubmissionPrompt": f"Record a 2 to 5-minute screen and microphone walkthrough of your Packet Tracer lab for Chapter {chap_num}: {chap_title}. Explain the theoretical concepts in your own words, show your CLI configurations, and run the verification commands to prove complete mastery."
    }

print("Building complete curriculum from both textbooks...")

with open(EXTRACTED_V1, 'r', encoding='utf-8') as f:
    v1_raw = f.read()
with open(EXTRACTED_V2, 'r', encoding='utf-8') as f:
    v2_raw = f.read()

v1_cmds_all = parse_appendix_b(v1_raw)
v2_cmds_all = parse_appendix_b(v2_raw)

v1_title_map = {num: title for num, title, _, _, _ in V1_CHAPTER_METADATA}
v2_title_map = {num: title for num, title, _, _, _ in V2_CHAPTER_METADATA}

v1_quizzes_all = parse_appendix_c_and_d(v1_raw, v1_title_map)
v2_quizzes_all = parse_appendix_c_and_d(v2_raw, v2_title_map)

modules = []

# Process Volume 1 Chapters
for idx, (c_num, c_title, part_num, part_title, desc) in enumerate(V1_CHAPTER_METADATA):
    next_title = V1_CHAPTER_METADATA[idx+1][1] if idx+1 < len(V1_CHAPTER_METADATA) else None
    body_info = extract_chapter_body(v1_raw, c_num, c_title, next_title)
    # Fix image paths for vol 1
    for d in body_info["diagrams"]:
        d["src"] = d["src"].replace("/extracted/images/", "/extracted/vol1/images/")
    
    cmds = v1_cmds_all.get(c_num, [])
    # Also inherit from previous chapter if grouped in appendix B (e.g. Ch 15 with Ch 14, Ch 18 with 17, etc.)
    if not cmds and c_num > 1 and (c_num - 1) in v1_cmds_all:
        cmds = v1_cmds_all.get(c_num - 1, [])[:6]

    quiz = v1_quizzes_all.get(c_num, [])
    lab = generate_lab_mission(1, c_num, c_title, cmds)

    module_id = f"v1-ch{c_num}-{re.sub(r'[^a-z0-9]+', '-', c_title.lower()).strip('-')}"

    modules.append({
        "id": module_id,
        "volume": 1,
        "volumeTitle": "Volume 1: Fundamentals and Protocols",
        "partNumber": part_num,
        "partTitle": part_title,
        "chapterNumber": c_num,
        "title": f"Chapter {c_num}: {c_title}",
        "rawTitle": c_title,
        "description": desc,
        "readTime": "35 min",
        "learningMethodSteps": [
            {"step": 1, "name": "Active Reading & Key Notes", "desc": "Study theory, architecture diagrams, and frame/packet formats."},
            {"step": 2, "name": "CLI Command Reference", "desc": "Memorize syntax and modes from Appendix B."},
            {"step": 3, "name": "Appendix C Review Quiz", "desc": "Test comprehension with Jeremy's exact chapter questions and explanations."},
            {"step": 4, "name": "Cisco Packet Tracer Lab", "desc": "Hands-on labbing on network simulator."},
            {"step": 5, "name": "Active Video Proof to Drive", "desc": "Record explanation & demo, upload to Google Drive 5TB storage."}
        ],
        "keyPoints": body_info["keyPoints"],
        "diagrams": body_info["diagrams"],
        "ciscoCommands": cmds,
        "quiz": quiz,
        "labMission": lab,
        "content": body_info["contentSnippet"]
    })

# Process Volume 2 Chapters
for idx, (c_num, c_title, part_num, part_title, desc) in enumerate(V2_CHAPTER_METADATA):
    next_title = V2_CHAPTER_METADATA[idx+1][1] if idx+1 < len(V2_CHAPTER_METADATA) else None
    body_info = extract_chapter_body(v2_raw, c_num, c_title, next_title)
    # Fix image paths for vol 2
    for d in body_info["diagrams"]:
        d["src"] = d["src"].replace("/extracted/images/", "/extracted/vol2/images/")
    
    cmds = v2_cmds_all.get(c_num, [])
    if not cmds and c_num > 1 and (c_num - 1) in v2_cmds_all:
        cmds = v2_cmds_all.get(c_num - 1, [])[:6]

    quiz = v2_quizzes_all.get(c_num, [])
    lab = generate_lab_mission(2, c_num, c_title, cmds)

    module_id = f"v2-ch{c_num}-{re.sub(r'[^a-z0-9]+', '-', c_title.lower()).strip('-')}"

    modules.append({
        "id": module_id,
        "volume": 2,
        "volumeTitle": "Volume 2: Advanced Networking and Security",
        "partNumber": part_num,
        "partTitle": part_title,
        "chapterNumber": c_num,
        "title": f"Chapter {c_num}: {c_title}",
        "rawTitle": c_title,
        "description": desc,
        "readTime": "35 min",
        "learningMethodSteps": [
            {"step": 1, "name": "Active Reading & Key Notes", "desc": "Study theory, architecture diagrams, and frame/packet formats."},
            {"step": 2, "name": "CLI Command Reference", "desc": "Memorize syntax and modes from Appendix B."},
            {"step": 3, "name": "Appendix C Review Quiz", "desc": "Test comprehension with Jeremy's exact chapter questions and explanations."},
            {"step": 4, "name": "Cisco Packet Tracer Lab", "desc": "Hands-on labbing on network simulator."},
            {"step": 5, "name": "Active Video Proof to Drive", "desc": "Record explanation & demo, upload to Google Drive 5TB storage."}
        ],
        "keyPoints": body_info["keyPoints"],
        "diagrams": body_info["diagrams"],
        "ciscoCommands": cmds,
        "quiz": quiz,
        "labMission": lab,
        "content": body_info["contentSnippet"]
    })

full_data = {
    "title": "Acing the CCNA Exam: Complete Platform",
    "author": "Jeremy McDowell (CCIE #59049)",
    "pedagogicalMethod": {
        "name": "Jeremy McDowell's 5-Pillar CCNA Learning Framework",
        "summary": "As detailed in Section 1.4 of the textbook, optimal CCNA preparation combines active reading with note-taking, mastering CLI commands from Appendix B, testing recall via Appendix C review questions with Appendix D explanations, extensive hands-on Cisco Packet Tracer labbing, and demonstrating mastery through active teaching and video proof.",
        "pillars": [
            {
                "pillar": 1,
                "title": "Active Reading & Visual Analysis",
                "description": "Stop occasionally to reflect, take notes, and study network topologies and packet header diagrams rather than passively reading."
            },
            {
                "pillar": 2,
                "title": "Cisco IOS CLI Mastery (Appendix B)",
                "description": "Master exact command syntax, EXEC/Config modes, and operational parameters for all ~300 Cisco IOS commands."
            },
            {
                "pillar": 3,
                "title": "Official Chapter Review Quizzes (Appendix C & D)",
                "description": "Attempt the official review questions immediately after completing each chapter and review official explanations in Appendix D."
            },
            {
                "pillar": 4,
                "title": "Hands-On Labbing (Cisco Packet Tracer)",
                "description": "Labbing is non-negotiable. Configure routers, switches, and firewalls in Cisco Packet Tracer to build real muscle memory."
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
            "parts": V1_PARTS
        },
        {
            "volumeNumber": 2,
            "title": "Volume 2: Advanced Networking and Security",
            "parts": V2_PARTS
        }
    ],
    "totalModules": len(modules),
    "modules": modules
}

with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(full_data, f, indent=2, ensure_ascii=False)

print(f"SUCCESS! Successfully built curriculum with {len(modules)} chapters across 2 volumes!")
print(f"Output saved to: {OUTPUT_JSON}")
