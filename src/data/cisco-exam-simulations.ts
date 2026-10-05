export interface DragDropItem {
  id: string;
  sourceText: string;
  targetCategory: string;
}

export interface SimletCommandOutput {
  command: string;
  output: string;
}

export interface SimletDevice {
  hostname: string;
  prompt: string;
  outputs: Record<string, string>;
}

export interface AuthenticExamQuestion {
  id: string;
  type: "single_choice" | "multi_choice" | "drag_drop" | "simlet";
  question: string;
  domainId: string;
  domainName: string;
  chapterNumber: number;
  volume: number;
  moduleId: string;
  moduleTitle: string;
  // Multiple Choice / Multi Choice
  options?: string[];
  correctAnswer?: string | string[]; // "A" or ["A", "C"]
  selectCount?: number; // For multi-choice e.g. 2 or 3
  // Drag and Drop
  dndItems?: DragDropItem[];
  dndCategories?: string[];
  // Simlet / CLI Lab
  simletScenario?: string;
  simletDevices?: SimletDevice[];
  // Exhibits / Topologies
  exhibitTitle?: string;
  exhibitContent?: string;
  exhibitType?: "topology" | "cli" | "table";
  // Official Cisco / Book Rationale
  explanation: string;
}

export const CISCO_AUTHENTIC_SIMULATIONS: AuthenticExamQuestion[] = [
  // -------------------------------------------------------------
  // SIMLET 1: OSPF Neighbor Adjacency Troubleshooting
  // -------------------------------------------------------------
  {
    id: "sim-ospf-mtu-1",
    type: "simlet",
    question: "Refer to the live router consoles on R1 and R2. An engineer notices that the OSPF adjacency between R1 and R2 over the point-to-point link is failing to reach the FULL state. Using the router CLI consoles, diagnose the issue and determine why the neighbor relationship is stuck in EXSTART/EXCHANGE state.",
    domainId: "3.0",
    domainName: "IP Connectivity",
    chapterNumber: 18,
    volume: 1,
    moduleId: "v1-ch18-open-shortest-path-first",
    moduleTitle: "Open Shortest Path First",
    options: [
      "The OSPF area IDs configured on R1 and R2 do not match.",
      "The interface MTU on R1 GigabitEthernet0/0 is 1500 bytes while R2 GigabitEthernet0/0 is configured with an MTU of 1400 bytes.",
      "The OSPF Hello and Dead timers on the point-to-point link do not match.",
      "R1 and R2 have duplicate OSPF Router IDs (RID 1.1.1.1)."
    ],
    correctAnswer: "B",
    simletScenario: "Point-to-Point Gigabit Link between R1 (10.0.0.1/30) and R2 (10.0.0.2/30) running OSPF Area 0.",
    simletDevices: [
      {
        hostname: "R1",
        prompt: "R1#",
        outputs: {
          "show ip ospf neighbor": `Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           0   EXSTART/  -     00:00:33    10.0.0.2        GigabitEthernet0/0`,
          "show ip ospf interface g0/0": `GigabitEthernet0/0 is up, line protocol is up 
  Internet Address 10.0.0.1/30, Area 0, Attached via Interface Enable
  Process ID 1, Router ID 1.1.1.1, Network Type POINT_TO_POINT, Cost: 1
  Topology-MTU: 1500, Cost: 1
  Transmit Delay is 1 sec, State POINT_TO_POINT
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
    Hello due in 00:00:04
  Neighbor Count is 1, Adjacent neighbor count is 0`,
          "show ip interface g0/0": `GigabitEthernet0/0 is up, line protocol is up
  Internet address is 10.0.0.1/30
  Broadcast address is 255.255.255.255
  Address determined by setup command
  MTU is 1500 bytes`,
          "show running-config | section router ospf": `router ospf 1
 router-id 1.1.1.1
 network 10.0.0.0 0.0.0.3 area 0`,
          "ping 10.0.0.2": `Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.0.0.2, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`
        }
      },
      {
        hostname: "R2",
        prompt: "R2#",
        outputs: {
          "show ip ospf neighbor": `Neighbor ID     Pri   State           Dead Time   Address         Interface
1.1.1.1           0   EXSTART/  -     00:00:36    10.0.0.1        GigabitEthernet0/0`,
          "show ip ospf interface g0/0": `GigabitEthernet0/0 is up, line protocol is up 
  Internet Address 10.0.0.2/30, Area 0, Attached via Interface Enable
  Process ID 1, Router ID 2.2.2.2, Network Type POINT_TO_POINT, Cost: 1
  Topology-MTU: 1400, Cost: 1
  Transmit Delay is 1 sec, State POINT_TO_POINT
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
    Hello due in 00:00:02
  Neighbor Count is 1, Adjacent neighbor count is 0`,
          "show ip interface g0/0": `GigabitEthernet0/0 is up, line protocol is up
  Internet address is 10.0.0.2/30
  MTU is 1400 bytes`
        }
      }
    ],
    exhibitTitle: "Topology: R1 and R2 Point-to-Point OSPF Link",
    exhibitContent: `
    +-----------------+                     +-----------------+
    |   Router R1     |  Gi0/0       Gi0/0  |   Router R2     |
    |   RID: 1.1.1.1  +---------------------+   RID: 2.2.2.2  |
    |   10.0.0.1/30   |   10.0.0.0/30       |   10.0.0.2/30   |
    |   MTU: 1500     |   OSPF Area 0       |   MTU: 1400     |
    +-----------------+                     +-----------------+
    `,
    explanation: "In OSPF, Database Description (DBD) packets are exchanged during the EXSTART and EXCHANGE states. DBD packets contain the interface MTU in the MTU field. If there is an MTU mismatch between the two neighbors (here R1 has MTU 1500 and R2 has MTU 1400), the router with the smaller MTU will reject DBD packets larger than its MTU, causing the adjacency to be perpetually stuck in the EXSTART or EXCHANGE state. To fix this, either adjust the MTU with 'ip mtu 1500' or configure 'ip ospf mtu-ignore' under the interface."
  },

  // -------------------------------------------------------------
  // SIMLET 2: VLAN Trunking & Native VLAN Mismatch
  // -------------------------------------------------------------
  {
    id: "sim-vlan-trunk-1",
    type: "simlet",
    question: "Refer to the live switch consoles on SW1 and SW2. Host A on VLAN 10 connected to SW1 is intermittently dropping frames when communicating with Host B on VLAN 10 connected to SW2 across trunk link Gi0/1. The console displays recurring %CDP-4-NATIVE_VLAN_MISMATCH messages. What is the root cause of this trunking issue?",
    domainId: "2.0",
    domainName: "Network Access",
    chapterNumber: 12,
    volume: 1,
    moduleId: "v1-ch12-vlans",
    moduleTitle: "VLANs",
    options: [
      "SW1 is using 802.1Q encapsulation while SW2 is using ISL encapsulation.",
      "SW1 has native VLAN 1 configured while SW2 has native VLAN 99 configured on trunk link GigabitEthernet0/1.",
      "VLAN 10 is not permitted on the allowed VLAN list of SW2.",
      "The duplex setting on GigabitEthernet0/1 is mismatched between Full and Half."
    ],
    correctAnswer: "B",
    simletScenario: "Switches SW1 and SW2 are interconnected via GigabitEthernet0/1 with an 802.1Q trunk carrying VLANs 10, 20, and 30.",
    simletDevices: [
      {
        hostname: "SW1",
        prompt: "SW1#",
        outputs: {
          "show interfaces trunk": `Port        Mode             Encapsulation  Status        Native vlan
Gi0/1       on               802.1q         trunking      1

Port        Vlans allowed on trunk
Gi0/1       1-4094

Port        Vlans allowed and active in management domain
Gi0/1       1,10,20,30`,
          "show interfaces g0/1 switchport": `Name: Gi0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Trunking Native Mode VLAN: 1 (default)
Administrative Native VLAN tagging: disabled`,
          "show logging": `*Mar 1 02:14:22.403: %CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (1), with SW2 GigabitEthernet0/1 (99).`
        }
      },
      {
        hostname: "SW2",
        prompt: "SW2#",
        outputs: {
          "show interfaces trunk": `Port        Mode             Encapsulation  Status        Native vlan
Gi0/1       on               802.1q         trunking      99

Port        Vlans allowed on trunk
Gi0/1       1-4094

Port        Vlans allowed and active in management domain
Gi0/1       1,10,20,30,99`,
          "show interfaces g0/1 switchport": `Name: Gi0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Trunking Native Mode VLAN: 99 (NATIVE_MGMT)`
        }
      }
    ],
    exhibitTitle: "Exhibit: 802.1Q Trunk between SW1 and SW2",
    exhibitContent: `
    +-----------------+                           +-----------------+
    |   Switch SW1    |  Gi0/1             Gi0/1  |   Switch SW2    |
    |   Native: VLAN 1+===========================+   Native: VLAN 99|
    |   (Trunking)    |      802.1Q Trunk         |   (Trunking)    |
    +--------+--------+                           +--------+--------+
             | Fa0/1                                       | Fa0/1
        +----+----+                                   +----+----+
        | Host A  | VLAN 10                           | Host B  | VLAN 10
        | 10.1.1.5|                                   | 10.1.1.6|
        +---------+                                   +---------+
    `,
    explanation: "In Cisco 802.1Q trunking, untagged traffic is placed into the Native VLAN. When the Native VLAN does not match on both sides of a trunk link (SW1 has Native VLAN 1, while SW2 has Native VLAN 99), traffic sent untagged by SW1 on VLAN 1 will be received by SW2 and forwarded into VLAN 99. CDP detects this inconsistency and generates '%CDP-4-NATIVE_VLAN_MISMATCH'. Furthermore, Spanning Tree Protocol will put the mismatched VLANs into a type-inconsistent (PVID-inconsistent) blocking state to prevent switching loops."
  },

  // -------------------------------------------------------------
  // SIMLET 3: Routing Table & Longest Prefix Match
  // -------------------------------------------------------------
  {
    id: "sim-ip-route-lpm-1",
    type: "simlet",
    question: "Refer to the live router console on Router R1. A host on the LAN transmits an IP packet with destination IP address 172.16.5.42. Based on the routing table of R1, which interface and next-hop IP address will R1 use to forward the packet?",
    domainId: "3.0",
    domainName: "IP Connectivity",
    chapterNumber: 9,
    volume: 1,
    moduleId: "v1-ch9-routing-fundamentals",
    moduleTitle: "Routing Fundamentals",
    options: [
      "GigabitEthernet0/0, next-hop 192.168.1.1 (Default Gateway)",
      "GigabitEthernet0/1, next-hop 10.1.1.2 (/16 match)",
      "GigabitEthernet0/2, next-hop 10.2.2.2 (/22 match via EIGRP)",
      "GigabitEthernet0/3, next-hop 10.3.3.2 (/26 match)"
    ],
    correctAnswer: "C",
    simletScenario: "Router R1 has multiple routes in its IPv4 routing table that overlap with the 172.16.0.0 network.",
    simletDevices: [
      {
        hostname: "R1",
        prompt: "R1#",
        outputs: {
          "show ip route": `Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area 

Gateway of last resort is 192.168.1.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 192.168.1.1, GigabitEthernet0/0
O     172.16.0.0/16 [110/2] via 10.1.1.2, 01:14:32, GigabitEthernet0/1
D     172.16.4.0/22 [90/30720] via 10.2.2.2, 00:45:10, GigabitEthernet0/2
S     172.16.5.64/26 [1/0] via 10.3.3.2, GigabitEthernet0/3
O     172.16.5.128/26 [110/3] via 10.4.4.2, 00:12:05, GigabitEthernet0/4`,
          "show ip route 172.16.5.42": `Routing entry for 172.16.4.0/22
  Known via "eigrp 100", distance 90, metric 30720, type internal
  Redistributing via eigrp 100
  Last update from 10.2.2.2 on GigabitEthernet0/2, 00:45:10 ago
  Routing Descriptor Blocks:
  * 10.2.2.2, from 10.2.2.2, 00:45:10 ago, via GigabitEthernet0/2
      Route metric is 30720, share count 1`
        }
      }
    ],
    explanation: "Routers forward packets based on the Longest Prefix Match (most specific subnet mask with matching bits), regardless of administrative distance or routing protocol. For destination 172.16.5.42: The /26 routes available are 172.16.5.64/26 (ranges .64 to .127) and 172.16.5.128/26 (ranges .128 to .191), neither of which contains .42. The /22 route 172.16.4.0/22 covers 172.16.4.0 through 172.16.7.255, which DOES contain 172.16.5.42. Because /22 (22 bits) is longer than /16 (16 bits) and /0 (0 bits), R1 forwards the packet using GigabitEthernet0/2 via next-hop 10.2.2.2."
  },

  // -------------------------------------------------------------
  // DRAG AND DROP 1: Cisco Administrative Distances
  // -------------------------------------------------------------
  {
    id: "dnd-ad-matching-1",
    type: "drag_drop",
    question: "Drag each Cisco routing protocol or route source from the left and drop it onto its matching default Administrative Distance (AD) value on the right.",
    domainId: "3.0",
    domainName: "IP Connectivity",
    chapterNumber: 9,
    volume: 1,
    moduleId: "v1-ch9-routing-fundamentals",
    moduleTitle: "Routing Fundamentals",
    dndCategories: ["AD 0", "AD 1", "AD 20", "AD 90", "AD 110", "AD 120"],
    dndItems: [
      { id: "item-1", sourceText: "Directly Connected Network", targetCategory: "AD 0" },
      { id: "item-2", sourceText: "Static Route", targetCategory: "AD 1" },
      { id: "item-3", sourceText: "External BGP (eBGP)", targetCategory: "AD 20" },
      { id: "item-4", sourceText: "Internal EIGRP", targetCategory: "AD 90" },
      { id: "item-5", sourceText: "OSPF", targetCategory: "AD 110" },
      { id: "item-6", sourceText: "RIP", targetCategory: "AD 120" }
    ],
    explanation: "Administrative Distance (AD) measures the trustworthiness of a routing information source in Cisco IOS. Default AD values: Connected = 0, Static = 1, eBGP = 20, EIGRP internal = 90, OSPF = 110, IS-IS = 115, RIP = 120, External EIGRP = 170, iBGP = 200, Unusable/Unknown = 255."
  },

  // -------------------------------------------------------------
  // DRAG AND DROP 2: OSI Model 7-Layer PDUs
  // -------------------------------------------------------------
  {
    id: "dnd-osi-pdus-1",
    type: "drag_drop",
    question: "Drag each Protocol Data Unit (PDU) name from the left onto its corresponding OSI Model layer on the right.",
    domainId: "1.0",
    domainName: "Network Fundamentals",
    chapterNumber: 4,
    volume: 1,
    moduleId: "v1-ch4-the-tcp-ip-networking-model",
    moduleTitle: "The TCP/IP Networking Model",
    dndCategories: [
      "Layer 7: Application",
      "Layer 4: Transport",
      "Layer 3: Network",
      "Layer 2: Data Link",
      "Layer 1: Physical"
    ],
    dndItems: [
      { id: "pdu-1", sourceText: "Data / Payload", targetCategory: "Layer 7: Application" },
      { id: "pdu-2", sourceText: "Segment", targetCategory: "Layer 4: Transport" },
      { id: "pdu-3", sourceText: "Packet", targetCategory: "Layer 3: Network" },
      { id: "pdu-4", sourceText: "Frame", targetCategory: "Layer 2: Data Link" },
      { id: "pdu-5", sourceText: "Bits", targetCategory: "Layer 1: Physical" }
    ],
    explanation: "At each layer of the OSI model, data is encapsulated with headers into a Protocol Data Unit (PDU): Layer 7-5 uses 'Data', Layer 4 (Transport) encapsulates into a 'Segment', Layer 3 (Network) adds IP headers to form a 'Packet', Layer 2 (Data Link) adds MAC header and FCS trailer to create a 'Frame', and Layer 1 (Physical) transmits raw 'Bits' over the physical medium."
  },

  // -------------------------------------------------------------
  // DRAG AND DROP 3: IPv6 Address Types & Prefixes
  // -------------------------------------------------------------
  {
    id: "dnd-ipv6-types-1",
    type: "drag_drop",
    question: "Drag each IPv6 address scope and category onto its corresponding IPv6 prefix range.",
    domainId: "1.0",
    domainName: "Network Fundamentals",
    chapterNumber: 20,
    volume: 1,
    moduleId: "v1-ch20-ipv6-addressing",
    moduleTitle: "IPv6 Addressing",
    dndCategories: ["2000::/3", "fe80::/10", "fc00::/7", "ff00::/8", "::1/128"],
    dndItems: [
      { id: "ipv6-1", sourceText: "Global Unicast (Publicly Routable)", targetCategory: "2000::/3" },
      { id: "ipv6-2", sourceText: "Link-Local Unicast", targetCategory: "fe80::/10" },
      { id: "ipv6-3", sourceText: "Unique Local (Private / RFC 4193)", targetCategory: "fc00::/7" },
      { id: "ipv6-4", sourceText: "Multicast Address", targetCategory: "ff00::/8" },
      { id: "ipv6-5", sourceText: "Loopback Address", targetCategory: "::1/128" }
    ],
    explanation: "IPv6 address architecture defines specific prefixes for scopes: 2000::/3 is Global Unicast (GUA), fe80::/10 is Link-Local (required on all IPv6 interfaces), fc00::/7 is Unique Local (ULA, equivalent to IPv4 RFC 1918 private addresses), ff00::/8 is Multicast, and ::1/128 is the Loopback address."
  },

  // -------------------------------------------------------------
  // DRAG AND DROP 4: Well-Known TCP and UDP Port Numbers
  // -------------------------------------------------------------
  {
    id: "dnd-ports-matching-1",
    type: "drag_drop",
    question: "Drag each application layer network service onto its official transport protocol and default well-known port number.",
    domainId: "4.0",
    domainName: "IP Services",
    chapterNumber: 22,
    volume: 1,
    moduleId: "v1-ch22-transmission-control-protocol-and-user-datagram-protocol",
    moduleTitle: "Transmission Control Protocol and User Datagram Protocol",
    dndCategories: ["TCP Port 22", "UDP Port 53", "UDP Port 67", "UDP Port 123", "TCP Port 443", "UDP Port 161"],
    dndItems: [
      { id: "port-1", sourceText: "Secure Shell (SSH)", targetCategory: "TCP Port 22" },
      { id: "port-2", sourceText: "DNS Queries", targetCategory: "UDP Port 53" },
      { id: "port-3", sourceText: "DHCP Server Messages", targetCategory: "UDP Port 67" },
      { id: "port-4", sourceText: "Network Time Protocol (NTP)", targetCategory: "UDP Port 123" },
      { id: "port-5", sourceText: "HTTPS (HTTP Secure / TLS)", targetCategory: "TCP Port 443" },
      { id: "port-6", sourceText: "Simple Network Management Protocol (SNMP)", targetCategory: "UDP Port 161" }
    ],
    explanation: "Common well-known ports defined by IANA: SSH uses TCP 22 for encrypted remote administration; DNS queries standardly use UDP 53; DHCP server listens on UDP 67 (clients on UDP 68); NTP synchronizes system clocks over UDP 123; HTTPS secures web browsing over TCP 443; SNMP agents listen for requests on UDP 161."
  },

  // -------------------------------------------------------------
  // MULTI-CHOICE 1: Wireless Security Standards (Choose Two)
  // -------------------------------------------------------------
  {
    id: "mc-wpa3-security-1",
    type: "multi_choice",
    question: "Which TWO statements accurately describe the security enhancements introduced in Wi-Fi Protected Access 3 (WPA3)? (Choose two.)",
    domainId: "5.0",
    domainName: "Security Fundamentals",
    chapterNumber: 20,
    volume: 2,
    moduleId: "v2-ch20-wireless-lan-security",
    moduleTitle: "Wireless LAN Security",
    options: [
      "WPA3 Personal replaces the vulnerable 4-way PSK handshake with Simultaneous Authentication of Equals (SAE) to protect against offline dictionary attacks.",
      "WPA3 requires the deprecated Temporal Key Integrity Protocol (TKIP) for backward compatibility.",
      "WPA3 mandates the use of Protected Management Frames (PMF) on all connections to mitigate deauthentication and spoofing attacks.",
      "WPA3 Enterprise reduces minimum encryption key strength down to 64-bit DES keys.",
      "WPA3 eliminates the need for 802.1X RADIUS authentication in enterprise networks."
    ],
    correctAnswer: ["A", "C"],
    selectCount: 2,
    explanation: "WPA3 introduces key cryptographic advancements: 1) Simultaneous Authentication of Equals (SAE, based on Dragonfly handshake) replaces PSK to prevent offline dictionary/rainbow table attacks even when weak passwords are used. 2) Protected Management Frames (PMF, 802.11w) are mandatory, defending against deauthentication, disassociation, and man-in-the-middle attacks."
  },

  // -------------------------------------------------------------
  // MULTI-CHOICE 2: First-Hop Redundancy Protocols (Choose Three)
  // -------------------------------------------------------------
  {
    id: "mc-fhrp-features-1",
    type: "multi_choice",
    question: "A network engineer is comparing First-Hop Redundancy Protocols (FHRPs) for a dual-core campus network. Which THREE characteristics describe the Hot Standby Router Protocol (HSRP)? (Choose three.)",
    domainId: "3.0",
    domainName: "IP Connectivity",
    chapterNumber: 19,
    volume: 1,
    moduleId: "v1-ch19-first-hop-redundancy-protocols",
    moduleTitle: "First Hop Redundancy Protocols",
    options: [
      "HSRP is an open standard defined by the IETF in RFC 3768.",
      "HSRP assigns one router as the Active router and another as the Standby router for a group.",
      "HSRP version 1 uses the multicast IP address 224.0.0.2 to exchange Hello packets.",
      "HSRP version 2 uses the multicast IP address 224.0.0.102 and UDP port 1985.",
      "HSRP automatically pre-empts the active router by default without requiring the 'standby preempt' command.",
      "HSRP dynamically balances traffic across all active routers simultaneously without multiple groups."
    ],
    correctAnswer: ["B", "C", "D"],
    selectCount: 3,
    explanation: "HSRP is a Cisco-proprietary FHRP (unlike VRRP which is open standard). HSRP elects an Active router to forward traffic and a Standby router to monitor. HSRPv1 uses multicast 224.0.0.2; HSRPv2 uses 224.0.0.102 (UDP port 1985). Preemption is DISABLED by default and must be explicitly configured with 'standby [group] preempt'."
  }
];
