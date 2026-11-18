SUPPLEMENTARY_DOCS = {
    "docs/network-topologies.md": """# Enterprise Network Topologies & Architectural Models

A deep dive into Cisco enterprise campus network architectures, data center topologies, and branch designs.

---

## 1. Cisco Hierarchical 3-Tier Model

1. **Core Layer**:
   - The high-speed backbone of the network.
   - Optimized for ultra-low latency, maximum throughput, and zero packet manipulation.
   - Redundant Layer 3 switches with dynamic routing (OSPF / IS-IS / BGP).
2. **Distribution Layer**:
   - Aggregates access switches and provides boundary controls.
   - Enforces routing policies, Access Control Lists (ACLs), QoS markings, and VLAN termination.
   - Redundancy via First Hop Redundancy Protocols (HSRP / VRRP).
3. **Access Layer**:
   - Connects end-user endpoints (workstations, IP phones, wireless APs, printers).
   - Enforces port security, 802.1X authentication, Power over Ethernet (PoE), and Spanning Tree guard features.

---

## 2. Collapsed Core (2-Tier) Architecture

In small to medium enterprise deployments, the Core and Distribution layers are merged into a single **Collapsed Core** tier to reduce hardware footprint, cabling complexity, and CAPEX/OPEX.

---

## 3. Modern Spine-and-Leaf Data Center Fabric

- Replaces traditional multi-tier Spanning Tree topologies in modern virtualized data centers.
- Every **Leaf Switch** (Top of Rack) connects to every **Spine Switch**.
- Equal-Cost Multi-Path (ECMP) routing across all links delivers deterministic latency (exactly 2 hops between any two leaf nodes) with zero blocked ports.
""",

    "docs/cisco-hardware-catalyst.md": """# Cisco Catalyst Switch Hardware & ASIC Architecture

Understanding the physical engineering, ASIC forwarding pipelines, and TCAM memory architecture of enterprise Catalyst switches.

---

## 1. Forwarding Planes & Hardware ASICs

- **Software Switching**: Route Processor (CPU) examines packet headers and consults the routing table in RAM. Slow and resource intensive.
- **Hardware Switching (CEF / ASICs)**: Application-Specific Integrated Circuits (ASICs) forward packets directly at wire rate without CPU intervention.
  - **FIB (Forwarding Information Base)**: Mirror of the IP routing table optimized for high-speed hardware lookups.
  - **Adjacency Table**: Stores pre-computed Layer 2 rewrite headers (Destination MAC, Source MAC, EtherType) for all connected next hops.

---

## 2. Ternary Content Addressable Memory (TCAM)

Traditional RAM returns data when given a memory address. TCAM does the opposite: it searches memory matching data in parallel within a single clock cycle.
- **Three Matching States**: `0`, `1`, and `X` (Don't care / Wildcard).
- Essential for wire-speed ACL evaluation, QoS policy maps, and longest-prefix route matching.

---

## 3. Power over Ethernet (PoE) Standards

| Standard | Name | Max Power at Source | Delivered Power at Device | Supported Wire Pairs |
| :--- | :--- | :---: | :---: | :---: |
| **802.3af** | PoE | 15.4 W | 12.95 W | 2 pairs |
| **802.3at** | PoE+ | 30.0 W | 25.5 W | 2 pairs |
| **802.3bt (Type 3)** | 4PPoE / UPOE | 60.0 W | 51.0 W | 4 pairs |
| **802.3bt (Type 4)** | UPOE+ | 90.0 W | 71.3 W | 4 pairs |
""",

    "docs/cisco-routers-isr.md": """# Cisco Integrated Services Routers (ISR) Architecture

Technical overview of Cisco ISR 4000 series routing platforms, Cisco IOS-XE architecture, and WAN connectivity options.

---

## 1. Cisco IOS-XE Operating System Architecture

Cisco IOS-XE separates the operating system into distinct functional planes running on a multi-core Linux kernel:
- **Control Plane**: Linux-based control plane process managing OSPF, BGP, SSH, and administrative CLI.
- **Data Plane (Forwarding)**: Cisco QuantumFlow Processor (QFP) hardware dedicated exclusively to cryptographic acceleration, QoS shaping, and packet switching.

---

## 2. WAN Physical Layer Interfaces

- **Serial / T1 / E1**: Legacy synchronous serial interfaces utilizing HDLC or PPP encapsulation.
- **Metro Ethernet (Gigabit / TenGigabit)**: Modern fiber optical Ethernet uplinks hand-off directly from service providers.
- **Cellular LTE / 5G NIMs**: Network Interface Modules providing automated secondary failover WAN links.

---

## 3. Generic Routing Encapsulation (GRE)

GRE (IP Protocol 47) encapsulates multi-protocol packet payloads inside an IP transport packet:
```ios
! Configure GRE Tunnel Interface
R1(config)# interface Tunnel0
R1(config-if)# ip address 10.255.255.1 255.255.255.252
R1(config-if)# tunnel source GigabitEthernet0/0/1
R1(config-if)# tunnel destination 203.0.113.2
R1(config-if)# exit
```
""",

    "docs/wireless-lan-fundamentals.md": """# Enterprise Wireless LAN Architecture (WLAN & WLC)

Comprehensive study of IEEE 802.11 standards, Cisco Wireless LAN Controllers (WLC), and Split-MAC operation.

---

## 1. IEEE 802.11 Wireless Standards Progression

| Standard | Frequency Bands | Maximum Theoretical Throughput | Key Modulation / MIMO Features |
| :--- | :--- | :---: | :--- |
| **802.11b** | 2.4 GHz | 11 Mbps | DSSS, CCK |
| **802.11g** | 2.4 GHz | 54 Mbps | OFDM |
| **802.11n (Wi-Fi 4)** | 2.4 GHz & 5.0 GHz | 600 Mbps | 4x4 MIMO, 40 MHz channel bonding |
| **802.11ac (Wi-Fi 5)**| 5.0 GHz | 6.93 Gbps | 8x8 MU-MIMO, 160 MHz channels, 256-QAM |
| **802.11ax (Wi-Fi 6)**| 2.4 GHz, 5 GHz, 6 GHz | 9.6 Gbps | OFDMA, 1024-QAM, Target Wake Time (TWT) |

---

## 2. Cisco Split-MAC Architecture & CAPWAP

Traditional Autonomous APs perform all 802.11 functions locally. Lightweight APs (LAP) split functionality with a centralized Wireless LAN Controller (WLC) connected via **Control and Provisioning of Wireless Access Points (CAPWAP)** tunnels:

### Split-MAC Function Allocation:
- **Lightweight Access Point (LAP)**:
  - 802.11 physical Layer transmission & reception.
  - Frame beacon generation and Probe Responses.
  - Real-time frame acknowledgments and retransmissions.
- **Wireless LAN Controller (WLC)**:
  - 802.11 authentication & 802.1X EAP termination.
  - Association and reassociation request processing.
  - Security policy enforcement and roaming coordination.
  - Radio Resource Management (RRM) dynamic channel/power tuning.

---

## 3. WPA3 Security & Simultaneous Authentication of Equals (SAE)

- Replaces vulnerable WPA2 Pre-Shared Key (PSK) 4-way handshakes with **SAE (Dragonfly handshake)**.
- Resistant to offline dictionary attacks even when weak passphrases are selected.
- Enforces Protected Management Frames (PMF) to prevent deauthentication spoofing attacks.
""",

    "docs/ipv6-slaac-eui64.md": """# IPv6 Addressing, SLAAC & EUI-64 Deep Dive

Mastering IPv6 128-bit address architecture, stateless autoconfiguration, and Neighbor Discovery Protocol (NDP).

---

## 1. IPv6 Address Scope Categories

- **Global Unicast Address (GUA)**: `2000::/3` (Globally routable on public Internet).
- **Unique Local Address (ULA)**: `FC00::/7` (RFC 4193 private enterprise routing, typically `FD00::/8`).
- **Link-Local Address (LLA)**: `FE80::/10` (Required on every active interface; valid only on local link).
- **Multicast Address**: `FF00::/8`:
  - `FF02::1` — All nodes on local link.
  - `FF02::2` — All routers on local link.
  - `FF02::5` — All OSPFv3 routers.
  - `FF02::1:FF00:0/104` — Solicited-Node Multicast (used for ARP replacement).
- **Loopback Address**: `::1/128`.
- **Default Route (Unspecified)**: `::/0`.

---

## 2. The 3-Step EUI-64 Translation Method

To generate a 64-bit interface identifier from a 48-bit MAC address:

1. **Split the MAC address into two 24-bit halves**:
   - `00:1A:2B : 3C:4D:5E`
2. **Inject the 16-bit hex constant `FFFE` in the center**:
   - `001A:2B` + `FF:FE` + `3C:4D5E` $\\rightarrow$ `001A:2BFF:FE3C:4D5E`
3. **Invert the 7th bit (Universal/Local bit)** of the first octet:
   - First byte `00` in binary = `0000 0000`
   - Invert 7th bit $\\rightarrow$ `0000 0010` = `02`
   - Final EUI-64 ID: `021A:2BFF:FE3C:4D5E`

---

## 3. SLAAC Address Autoconfiguration Workflow

1. Host boots and generates a Link-Local Address (`FE80::/10` + EUI-64 or Random).
2. Host sends a **Router Solicitation (RS)** packet to `FF02::2` (All Routers).
3. Local Router responds with a **Router Advertisement (RA)** packet to `FF02::1` (All Nodes) containing:
   - Global IPv6 network prefix (e.g. `2001:DB8:ACAD:1::/64`).
   - Prefix lifetime and MTU.
   - SLAAC flag (`A=1`) and DHCPv6 flags (`M` and `O`).
4. Host concatenates prefix with its 64-bit Interface ID to formulate its full Global Unicast Address.
5. Host performs **Duplicate Address Detection (DAD)** using Neighbor Solicitation before utilizing the IP.
""",

    "docs/quality-of-service.md": """# Quality of Service (QoS) Mechanics & Queueing

Traffic classification, marking, policing, shaping, and congestion management mechanisms on Cisco networks.

---

## 1. Network Traffic Characteristics

- **Voice**: Ultra-sensitive to delay, jitter, and packet loss. Requires latency $< 150$ ms, jitter $< 30$ ms, loss $< 1\\%$. Bandwidth requirement is low (G.711 = 64 kbps).
- **Video**: Delay sensitive $< 200-400$ ms, bursty bandwidth consumption, jitter sensitive.
- **Data (Transactional / Best-Effort)**: Tolerant of variable latency and jitter; relies on TCP retransmissions for loss recovery.

---

## 2. Layer 2 & Layer 3 Marking Standards

### Layer 2 Marking (802.1Q CoS):
- 3 bits in the 802.1Q tag ($2^3 = 8$ Class of Service levels from 0 to 7).
- `CoS 5`: Voice Bearer traffic.

### Layer 3 Marking (IPv4 ToS & IPv6 Traffic Class):
- **IP Precedence (Legacy)**: 3 bits (0 to 7).
- **Differentiated Services Code Point (DSCP - Modern)**: 6 bits ($2^6 = 64$ values):
  - **Default Forwarding (DF)**: `000000` (Best Effort).
  - **Expedited Forwarding (EF)**: `101110` (Decimal 46) — Reserved exclusively for interactive VoIP audio.
  - **Assured Forwarding (AF)**: 12 classes structured as `AFxy` ($x$ = Class 1-4, $y$ = Drop Precedence 1-3).
  - **Class Selector (CS)**: Backward compatible mapping with IP Precedence (`CS1` to `CS7`).

---

## 3. Congestion Management & Queuing

- **FIFO (First-In, First-Out)**: Default queue. No prioritization.
- **CBWFQ (Class-Based Weighted Fair Queueing)**: Allocates guaranteed bandwidth percentages to defined classes.
- **LLQ (Low Latency Queuing - Industry Standard)**: CBWFQ combined with a strict **Priority Queue (PQ)** that is always serviced first. Voice traffic must be directed to LLQ.
""",

    "docs/network-management-snmp.md": """# Network Management Protocols: SNMP, Syslog & NTP

Operational reference for infrastructure telemetry, synchronized timestamps, and remote monitoring.

---

## 1. Simple Network Management Protocol (SNMP)

- **Architecture**: Managed Devices (SNMP Agents) queried by a centralized Network Management Station (NMS).
- **Operations**:
  - `GetRequest` / `GetNextRequest`: NMS queries specific OID values from the agent's Management Information Base (MIB).
  - `SetRequest`: NMS modifies device parameters.
  - `Trap` (UDP 162): Unsolicited event alert pushed by agent to NMS (unacknowledged).
  - `Inform` (UDP 162): Unsolicited event alert requiring NMS acknowledgment.

### SNMP Versions Comparison:
| Version | Authentication | Privacy (Encryption) | Security Evaluation |
| :--- | :--- | :--- | :--- |
| **SNMPv1** | Plaintext Community String | None | Insecure |
| **SNMPv2c** | Plaintext Community String | None | Insecure |
| **SNMPv3 (noAuthNoPriv)** | Username | None | Low |
| **SNMPv3 (authNoPriv)** | SHA / MD5 Hash | None | Moderate |
| **SNMPv3 (authPriv)** | SHA-256 Hash | AES-128 / AES-256 | **Production Standard** |

---

## 2. Syslog Severity Levels

Cisco IOS assigns severity levels 0 through 7 to all system notification messages:

| Level | Keyword | Description |
| :---: | :--- | :--- |
| **0** | **Emergency** | System is completely unusable. |
| **1** | **Alert** | Immediate action required. |
| **2** | **Critical** | Critical hardware or software condition. |
| **3** | **Error** | Error condition reported. |
| **4** | **Warning** | Warning condition (e.g. interface flap threshold). |
| **5** | **Notice** | Normal but significant condition (e.g. `%LINK-5-CHANGED`). |
| **6** | **Informational**| Informational message (e.g. ACL match log). |
| **7** | **Debugging** | Highly verbose diagnostic tracing (`debug`). |

> [!TIP]
> Memory Mnemonic: **E**very **A**gent **C**an **E**asily **W**rite **N**etwork **I**nformation **D**atabases.
""",

    "docs/ccna-cheat-sheet-formulas.md": """# Cisco CCNA 200-301 Fast Reference & Formulas

A consolidated quick-reference matrix of essential networking mathematics, protocol numbers, and default values.

---

## 1. Administrative Distance (AD) Hierarchy

| Route Source | Administrative Distance |
| :--- | :---: |
| **Connected Interface** | `0` |
| **Static Route** | `1` |
| **External BGP (eBGP)** | `20` |
| **EIGRP (Internal)** | `90` |
| **OSPF** | `110` |
| **IS-IS** | `115` |
| **RIP** | `120` |
| **External EIGRP** | `170` |
| **Internal BGP (iBGP)** | `200` |
| **Unreachable (Discard)**| `255` |

---

## 2. Common Layer 4 Port Numbers

| Protocol | Transport | Port |
| :--- | :---: | :---: |
| **FTP Data / Control** | TCP | 20 / 21 |
| **SSH** | TCP | 22 |
| **Telnet** | TCP | 23 |
| **DNS** | UDP / TCP | 53 |
| **DHCP Server / Client**| UDP | 67 / 68 |
| **TFTP** | UDP | 69 |
| **HTTP / HTTPS** | TCP | 80 / 443 |
| **SNMP / SNMP Traps** | UDP | 161 / 162 |
| **BGP** | TCP | 179 |
| **NTP** | UDP | 123 |

---

## 3. Well-Known IPv4 Multicast Addresses

- `224.0.0.1` — All hosts on local subnet.
- `224.0.0.2` — All routers on local subnet.
- `224.0.0.5` — All OSPF routers.
- `224.0.0.6` — All OSPF Designated Routers (DR/BDR).
- `224.0.0.9` — RIPv2 routers.
- `224.0.0.10` — EIGRP routers.
- `224.0.0.102` — HSRPv2 virtual router group.
"""
}
