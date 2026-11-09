# Enterprise Network Topologies & Architectural Models

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
