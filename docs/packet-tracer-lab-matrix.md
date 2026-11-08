# Packet Tracer Lab Simulation Matrix & Rubrics

A comprehensive mapping of all 49 book chapters and core hands-on Packet Tracer laboratory scenarios to build muscle memory for performance-based exam questions.

---

## Top 10 Core Must-Master Lab Scenarios

### Lab 1: Initial Switch & Router Security Baseline
- **Goal**: Configure hostname, banner, scrypt secret, console timeout, SSHv2, and disable unneeded services.
- **Verification**: `show running-config | section line vty`, verify SSH login from remote PC.

### Lab 2: Multi-VLAN Segmentation & Trunking
- **Goal**: Provision VLANs 10, 20, 30 across access switches; configure 802.1Q trunk on uplinks with native VLAN 99.
- **Verification**: `show vlan brief`, `show interfaces trunk`.

### Lab 3: Router-on-a-Stick (ROAS) Inter-VLAN Routing
- **Goal**: Route traffic between VLAN 10 and VLAN 20 using subinterfaces `G0/0/0.10` and `G0/0/0.20`.
- **Verification**: Ping between PC1 (VLAN 10) and PC2 (VLAN 20); examine router ARP cache.

### Lab 4: Rapid PVST+ Root Bridge Priority & PortFast/BPDU Guard
- **Goal**: Set primary root for VLAN 10 and secondary for VLAN 20; enable PortFast and BPDU Guard on edge ports.
- **Verification**: `show spanning-tree vlan 10`, test BPDU injection to verify err-disable state.

### Lab 5: L3 & L2 EtherChannel Link Aggregation
- **Goal**: Bundle Gigabit interfaces using LACP (`channel-group 1 mode active`).
- **Verification**: `show etherchannel summary`, confirm `(SU)` flag.

### Lab 6: Single-Area OSPFv2 Multi-Router Adjacency
- **Goal**: Configure OSPF process 1 on 3 routers, configure router-ids, passive interfaces on LANs, and adjust cost.
- **Verification**: `show ip ospf neighbor` (confirm `FULL` state), `show ip route ospf`.

### Lab 7: Standard & Extended Access Control Lists (ACLs)
- **Goal**: Create extended ACL permitting HTTP/HTTPS and DNS from LAN while blocking all other traffic.
- **Verification**: `show access-lists`, execute web requests and verify hit counters increment.

### Lab 8: Port Address Translation (NAT Overload)
- **Goal**: Translate entire private `192.168.1.0/24` subnet using single WAN IP on `G0/0/1`.
- **Verification**: `show ip nat translations` during active ping and web traffic.

### Lab 9: Cisco IOS DHCP Server & Relay Agent
- **Goal**: Configure DHCP pool with network, default-router, and dns-server on core router; configure `ip helper-address` on branch router.
- **Verification**: Verify client PCs receive dynamic IP leases with correct options.

### Lab 10: First Hop Redundancy Protocol (HSRP)
- **Goal**: Configure HSRP group 1 with virtual IP `192.168.1.1`, priority 110, and preemption on active router.
- **Verification**: `show standby brief`, shutdown active interface to observe sub-second failover to standby.
