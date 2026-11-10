# Cisco Catalyst Switch Hardware & ASIC Architecture

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
