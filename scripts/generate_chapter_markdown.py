import os
import json

def get_curriculum_markdown(c):
    vol = c.get('volume', 1)
    num = c.get('chapterNumber', 1)
    title = c.get('title', f'Chapter {num}')
    domain = c.get('domainName', 'Network Fundamentals')
    read_time = c.get('readTime', 25)
    desc = c.get('description', 'Comprehensive examination of key Cisco CCNA topics and protocols.')
    
    key_points = c.get('keyPoints', [])
    kp_text = "\n".join([f"- {kp}" for kp in key_points]) if key_points else "- Master core architectural principles and protocol mechanics.\n- Understand operational configuration and troubleshooting procedures."
    
    commands = c.get('ciscoCommands', [])
    if commands:
        cmd_rows = []
        for cmd in commands:
            cmd_name = cmd.get('cmd', '').replace('|', '\\|')
            mode = cmd.get('mode', 'EXEC').replace('|', '\\|')
            cdesc = cmd.get('desc', '').replace('|', '\\|')
            cmd_rows.append(f"| `{cmd_name}` | `{mode}` | {cdesc} |")
        cmd_table = "| Command | Mode | Operational Purpose |\n| :--- | :--- | :--- |\n" + "\n".join(cmd_rows)
    else:
        cmd_table = "*This theoretical foundational chapter establishes core conceptual models without device-specific CLI syntax.*"

    return f"""# Volume {vol} Chapter {num}: {title}

**Certification Domain**: {domain}  
**Estimated Study Time**: {read_time} Minutes  

---

## 1. Chapter Overview
{desc}

---

## 2. Key Blueprint Objectives
{kp_text}

---

## 3. Cisco IOS Command Reference
{cmd_table}
"""

def get_lab_markdown(c):
    vol = c.get('volume', 1)
    num = c.get('chapterNumber', 1)
    title = c.get('title', f'Chapter {num}')
    lab = c.get('labMission') or {}
    
    scenario = lab.get('scenario') or f"Configure and verify the standard topology for {title} according to Cisco best practices."
    objectives = lab.get('objectives') or [
        "Initialize device hostnames and administrative access controls.",
        "Provision interfaces and verify Layer 1/2 operational states.",
        "Validate end-to-end packet forwarding across network segments."
    ]
    obj_text = "\n".join([f"{i+1}. {obj}" for i, obj in enumerate(objectives)])
    
    verif = lab.get('verificationCommands') or [
        "show ip interface brief",
        "show running-config"
    ]
    verif_text = "\n".join([f"- `{v}`" for v in verif])
    
    prompt = lab.get('videoSubmissionPrompt') or "Record a concise 3-minute video demonstrating successful topology ping sweeps and running-configuration verification."

    return f"""# Lab Simulation Guide: Volume {vol} Chapter {num} - {title}

## Topology & Scenario Context
{scenario}

---

## Technical Objectives
{obj_text}

---

## CLI Verification Commands
{verif_text}

---

## Proof-of-Skill Video Submission Rubric
> {prompt}
"""

def get_quiz_markdown(c):
    vol = c.get('volume', 1)
    num = c.get('chapterNumber', 1)
    title = c.get('title', f'Chapter {num}')
    quiz = c.get('quiz') or []
    
    if not quiz:
        quiz = [{
            'number': 1,
            'question': f'What is the primary operational objective of the technologies covered in {title}?',
            'options': ['A. Ensure high availability and deterministic forwarding', 'B. Disable all layer 2 loops', 'C. Encapsulate transport headers', 'D. Manage out-of-band serial connections'],
            'answerLetter': 'A',
            'officialAnswer': 'Ensure high availability and deterministic forwarding across enterprise networks.',
            'explanation': 'Cisco enterprise network design centers on predictable forwarding, high availability, and rapid convergence.'
        }]
        
    q_sections = []
    for q in quiz:
        q_num = q.get('number', 1)
        q_text = q.get('question', '')
        opts = "\n".join([f"- {opt}" for opt in q.get('options', [])])
        letter = q.get('answerLetter', 'A')
        ans = q.get('officialAnswer', '')
        expl = q.get('explanation', '')
        q_sections.append(f"""### Question {q_num}: {q_text}
{opts}

> **Official Correct Answer**: **{letter}** — {ans}  
> **Technical Explanation**: {expl}
""")

    q_body = "\n\n---\n\n".join(q_sections)
    return f"""# Assessment & Review: Volume {vol} Chapter {num} - {title}

{q_body}
"""
