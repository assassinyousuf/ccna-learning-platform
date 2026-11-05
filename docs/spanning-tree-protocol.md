# Spanning Tree Protocol (STP & RSTP) Deep Dive

Spanning Tree Protocol prevents Layer 2 loops (broadcast storms, frame duplication, and MAC table thrashing) in redundant switch topologies by transitioning redundant links into an alternate blocking state.

---

## 1. IEEE Standards Comparison

| Metric | Classic STP (802.1D) | PVST+ (Cisco) | RSTP (802.1w) | Rapid PVST+ (Cisco Default) |
| :--- | :--- | :--- | :--- | :--- |
| **Convergence** | 30 to 50 seconds | 30 to 50 seconds | $\le 2$ seconds | $\le 2$ seconds |
| **VLAN Instances** | Single (CST) | One per VLAN | Single (CST) | One per VLAN |
| **Standard** | IEEE 802.1D (1990) | Cisco Proprietary | IEEE 802.1w (2001) | Cisco Proprietary |
| **Port States** | Disabled, Blocking, Listening, Learning, Forwarding | Same as 802.1D | Discarding, Learning, Forwarding | Same as 802.1w |

---

## 2. Root Bridge Election Process

Switches exchange Bridge Protocol Data Units (BPDUs) every 2 seconds. The switch with the lowest **Bridge ID (BID)** is elected Root Bridge:

$$\text{Bridge ID} = \text{Bridge Priority (4 bits)} + \text{Extended System ID (12 bits)} + \text{Base MAC Address (48 bits)}$$

1. **Bridge Priority**: Default is `32768`. Can be configured in increments of `4096` ($0, 4096, 8192\dots 61440$).
2. **Extended System ID**: The VLAN ID (allows PVST+ to have unique BIDs per VLAN).
3. **MAC Address Tiebreaker**: Lowest base MAC address wins if priorities match.

```ios
! Explicitly set switch as primary root for VLAN 10
Switch(config)# spanning-tree vlan 10 priority 4096

! Macro method
Switch(config)# spanning-tree vlan 10 root primary   ! (Sets priority to 24576 or 4096 below current root)
```

---

## 3. Port Role Determination

For every switch that is not the Root Bridge:
1. **Root Port (RP)**: Exactly one port per non-root switch with the lowest root path cost to the Root Bridge.
2. **Designated Port (DP)**: Exactly one port per network segment with the lowest advertised path cost. All ports on the Root Bridge are DPs (Forwarding).
3. **Alternate / Non-Designated Port**: Ports that are neither RP nor DP are placed in Discarding/Blocking mode.

### STP Port Cost Table:
- `10 Mbps`: 100
- `100 Mbps (FastEthernet)`: 19
- `1 Gbps (GigabitEthernet)`: 4
- `10 Gbps (TenGigabitEthernet)`: 2

---

## 4. Spanning Tree Security Enhancements

```ios
! Enable PortFast on edge access ports (immediately transition from Discarding to Forwarding)
Switch(config)# interface GigabitEthernet1/0/1
Switch(config-if)# spanning-tree portfast
Switch(config-if)# exit

! BPDU Guard: Automatically err-disables port if an unauthorized BPDU is received
Switch(config)# interface GigabitEthernet1/0/1
Switch(config-if)# spanning-tree bpduguard enable

! Global BPDU Guard on all PortFast enabled ports
Switch(config)# spanning-tree portfast default
Switch(config)# spanning-tree portfast bpduguard default
```
