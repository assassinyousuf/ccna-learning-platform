# OSPFv2 Routing Protocol Configuration Guide

Open Shortest Path First (OSPF) is an open-standard link-state Interior Gateway Protocol (IGP) utilizing Dijkstra's Shortest Path First (SPF) algorithm to calculate loop-free shortest paths.

---

## 1. OSPF Protocol Characteristics

- **Type**: Link-State IGP
- **Administrative Distance**: `110`
- **Transport**: Native IP Protocol `89` (no TCP or UDP transport)
- **Multicast Addresses**:
  - `224.0.0.5` — All OSPF Routers
  - `224.0.0.6` — All DR/BDR Routers (Designated Routers)
- **Metric**: Cumulative Cost based on reference bandwidth:
  $$\text{Cost} = \frac{\text{Reference Bandwidth}}{\text{Interface Bandwidth}} = \frac{100\text{ Mbps}}{\text{Interface Bandwidth}}$$

---

## 2. OSPF Neighbor States

OSPF neighbor relationships transition through sequential state machines:

```
[Down] ---> [Init] ---> [2-Way] ---> [ExStart] ---> [Exchange] ---> [Loading] ---> [Full]
```

1. **Down**: No Hello packets received from neighbor.
2. **Init**: Hello received, but local router ID not listed in neighbor's Hello packet.
3. **2-Way**: Bidirectional communication verified. DR/BDR election occurs on multiaccess segments.
4. **ExStart**: Master/Slave relationship established; initial Database Description (DBD) sequence numbers negotiated.
5. **Exchange**: Routers exchange DBD packets describing Link State Database (LSDB) contents.
6. **Loading**: Routers send Link State Requests (LSR) and receive Link State Updates (LSU) containing LSAs.
7. **Full**: LSDBs are completely synchronized across neighbors.

---

## 3. Router ID (RID) Selection Hierarchy

OSPF requires a unique 32-bit Router ID:
1. Manually configured `router-id <x.x.x.x>` in OSPF process.
2. Highest IPv4 address on any active **Loopback** interface.
3. Highest IPv4 address on any active **Physical** interface (`up/up`).

---

## 4. OSPFv2 Configuration Examples

### Modern Interface-Level Configuration (Recommended):
```ios
! Adjust reference bandwidth to support modern 1G/10G/100G links
R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# auto-cost reference-bandwidth 1000000   ! (1000 Gbps reference)
R1(config-router)# passive-interface GigabitEthernet0/0/0  ! Do not send hellos out user LAN
R1(config-router)# exit

! Enable OSPF directly under the interface
R1(config)# interface GigabitEthernet0/0/1
R1(config-if)# ip ospf 1 area 0
R1(config-if)# ip ospf network point-to-point  ! Avoids DR/BDR election on direct P2P link
R1(config-if)# exit
```

### Classic Network Statement Configuration:
```ios
R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 10.1.1.0 0.0.0.255 area 0
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# exit
```

---

## 5. Verification Commands

- `show ip ospf neighbor` — Display neighbor router ID, state (`FULL/DR`, `FULL/BDR`), and dead time.
- `show ip ospf interface brief` — Quick view of interfaces participating in OSPF, area, cost, and state.
- `show ip route ospf` — Routes learned through OSPF (indicated by `O` code, AD 110).
- `show ip ospf database` — Complete Link State Database summary.
