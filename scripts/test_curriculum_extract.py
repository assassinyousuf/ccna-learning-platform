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
        "description": "Master security architectures: the CIA triad, threats and vulnerabilities, AAA authentication, next-gen firewalls, Port Security, DHCP Snooping, and Dynamic ARP Inspection (DAI).",
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
    app_end = text.find('## Appendix E', app_d_start)
    if app_end == -1: app_end = text.find('## Index', app_d_start)
    if app_end == -1: app_end = text.find('**Index**', app_d_start)
    if app_end == -1: app_end = len(text)

    c_text = text[app_c_start:app_d_start]
    d_text = text[app_d_start:app_end]

    # Parse Appendix D first because it has clean answers and explanations
    d_chaps = {}
    d_sections = re.split(r'\n##\s+(?:Chapter\s+)?(\d+)[^\n]*', d_text)
    for i in range(1, len(d_sections), 2):
        c_num = int(d_sections[i].strip())
        content = d_sections[i+1]
        d_chaps[c_num] = content

    # Parse Appendix C
    c_chaps = {}
    c_sections = re.split(r'\n##\s+(?:Chapter\s+)?(\d+)[^\n]*', c_text)
    for i in range(1, len(c_sections), 2):
        c_num = int(c_sections[i].strip())
        content = c_sections[i+1]
        c_chaps[c_num] = content

    # Now parse questions for each chapter
    quizzes = {}
    for c_num in set(list(c_chaps.keys()) + list(d_chaps.keys())):
        c_raw = c_chaps.get(c_num, "")
        d_raw = d_chaps.get(c_num, "")
        
        # In D, items are formatted like:
        # **1.** Question text ... \n\n Answer \n\n Explanation
        # or 1. Question text ...
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
                if not ans_text and re.match(r'^[A-Z](?::|\.)', l):
                    ans_text = l
                else:
                    if exp_text: exp_text += " " + l
                    else: exp_text = l
            d_dict[q_num] = {
                'q_text': q_text,
                'ans': ans_text,
                'exp': exp_text
            }

        # In C, items are formatted like: 1.  Question text? A. opt1 B. opt2 ...
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
            
            # Extract question text and options from c_block
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
            # Extract the correct option index
            correct_index = 0
            m_letter = re.match(r'^([A-F])(?::|\.|\s)', corr_ans)
            if m_letter:
                letter = m_letter.group(1).upper()
                letter_idx = ord(letter) - ord('A')
                if 0 <= letter_idx < len(options):
                    correct_index = letter_idx
            
            explanation = d_info.get('exp', '')
            if not explanation:
                explanation = f"Correct answer is: {corr_ans}. Refer to the chapter text for complete coverage."

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


with open(EXTRACTED_V2, 'r', encoding='utf-8') as f:
    v2_text = f.read()

v2_cmds = parse_appendix_b(v2_text)
v2_quiz = parse_appendix_c_and_d(v2_text)

print(f"Vol 2: parsed {len(v2_cmds)} command chapters, {len(v2_quiz)} quiz chapters.")
total_q2 = sum(len(q) for q in v2_quiz.values())
print(f"Vol 2 Total Questions: {total_q2}")
if 1 in v2_quiz:
    print(f"Sample Vol 2 Ch 1 Q1: {v2_quiz[1][0]}")

