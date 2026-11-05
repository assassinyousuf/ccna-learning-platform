# VLANs, 802.1Q Trunking & Inter-VLAN Routing

Virtual Local Area Networks (VLANs) segment broadcast domains at Layer 2, enhancing security, scalability, and bandwidth efficiency.

---

## 1. IEEE 802.1Q Frame Format

When an Ethernet frame crosses an access link, it is untagged. When transmitted across a trunk link, an IEEE 802.1Q tag (4 bytes) is inserted after the Source MAC field:

```
+------------+------------+---------------+----------+------------+-------+
|  Dest MAC  | Source MAC | 802.1Q Header | EtherType|  Payload   |  FCS  |
|  (6 bytes) |  (6 bytes) |   (4 bytes)   | (2 bytes)|(46-1500 B) |(4 B)  |
+------------+------------+---------------+----------+------------+-------+
```

### 802.1Q Header Breakdown (4 Bytes):
1. **Tag Protocol Identifier (TPID)**: 16 bits set to `0x8100` indicating an 802.1Q tagged frame.
2. **Priority Code Point (PCP)**: 3 bits for Layer 2 Class of Service (CoS) QoS prioritization.
3. **Drop Eligible Indicator (DEI)**: 1 bit indicating frames that may be dropped under congestion.
4. **VLAN Identifier (VID)**: 12 bits supporting $2^{12} = 4096$ VLANs:
   - `0` and `4095`: Reserved
   - `1 - 1005`: Normal range VLANs (stored in `vlan.dat` flash)
   - `1006 - 4094`: Extended range VLANs (stored in running-config)

---

## 2. Dynamic Trunking Protocol (DTP) Matrix

| Mode | Access | Dynamic Auto | Dynamic Desirable | Trunk |
| :--- | :--- | :--- | :--- | :--- |
| **Access** | Access | Access | Access | **DO NOT USE** (Mismatch) |
| **Dynamic Auto** | Access | Access | **Trunk** | **Trunk** |
| **Dynamic Desirable**| Access | **Trunk** | **Trunk** | **Trunk** |
| **Trunk** | Access | **Trunk** | **Trunk** | **Trunk** |

> [!IMPORTANT]
> Cisco best practice recommendation: Disable DTP on all operational links using `switchport nonegotiate` and explicitly define port modes (`switchport mode trunk` or `switchport mode access`).

---

## 3. Router-on-a-Stick (ROAS) Configuration

Router-on-a-Stick utilizes a single physical trunk link to carry multiple tagged VLANs to a router subinterface architecture:

```ios
! Configure Router Subinterfaces
R1(config)# interface GigabitEthernet0/0/0
R1(config-if)# no ip address
R1(config-if)# no shutdown
R1(config-if)# exit

! VLAN 10 Subinterface
R1(config)# interface GigabitEthernet0/0/0.10
R1(config-subif)# encapsulation dot1Q 10
R1(config-subif)# ip address 192.168.10.1 255.255.255.0
R1(config-subif)# exit

! VLAN 20 Subinterface
R1(config)# interface GigabitEthernet0/0/0.20
R1(config-subif)# encapsulation dot1Q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0
R1(config-subif)# exit
```

---

## 4. Layer 3 Switched Virtual Interfaces (SVI)

Multilayer switches (e.g. Cisco Catalyst 3850, 9300) provide hardware-based wire-rate Inter-VLAN routing:

```ios
! Enable global IP routing on switch
Switch(config)# ip routing

! Create VLANs
Switch(config)# vlan 10
Switch(config)# vlan 20

! Provision SVIs
Switch(config)# interface Vlan 10
Switch(config-if)# ip address 192.168.10.1 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

Switch(config)# interface Vlan 20
Switch(config-if)# ip address 192.168.20.1 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit
```
