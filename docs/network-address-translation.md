# Network Address Translation (NAT & PAT) Implementation

Network Address Translation (NAT) conserves IPv4 address space by translating private RFC 1918 addresses into globally routable public addresses.

---

## 1. RFC 1918 Private IPv4 Address Blocks

- **Class A**: `10.0.0.0` to `10.255.255.255` (`10.0.0.0/8`)
- **Class B**: `172.16.0.0` to `172.31.255.255` (`172.16.0.0/12`)
- **Class C**: `192.168.0.0` to `192.168.255.255` (`192.168.0.0/16`)

---

## 2. Cisco NAT Terminology Definitions

| Term | Perspective | Definition |
| :--- | :--- | :--- |
| **Inside Local** | Inside Network | The actual private IP address assigned to an internal host device. |
| **Inside Global** | Outside Network | The public IP address representing the inside host to the outside Internet. |
| **Outside Local** | Inside Network | The IP address of an outside host as known to the inside network. |
| **Outside Global** | Outside Network | The actual public IP address assigned to an external host on the Internet. |

---

## 3. Three Flavors of NAT

1. **Static NAT**: One-to-one mapping between a private IP and a dedicated public IP. Commonly used for web, email, or database servers hosted in a DMZ.
2. **Dynamic NAT**: Many-to-many mapping from a pooled range of registered public IP addresses. First-come, first-served.
3. **Port Address Translation (PAT / NAT Overload)**: Many-to-one translation using unique Layer 4 source TCP/UDP port numbers. Permits over 65,000 simultaneous connections across a single public IPv4 address.

---

## 4. PAT (NAT Overload) Configuration Workflow

```ios
! Step 1: Designate Inside and Outside Interfaces
R1(config)# interface GigabitEthernet0/0/0
R1(config-if)# description INTERNAL-LAN
R1(config-if)# ip nat inside
R1(config-if)# exit

R1(config)# interface GigabitEthernet0/0/1
R1(config-if)# description PUBLIC-ISP-UPLINK
R1(config-if)# ip nat outside
R1(config-if)# exit

! Step 2: Define Standard ACL identifying private internal subnet
R1(config)# ip access-list standard NAT-PERMIT-LAN
R1(config-std-nacl)# 10 permit 192.168.10.0 0.0.0.255
R1(config-std-nacl)# exit

! Step 3: Enable NAT Overload referencing the external public interface
R1(config)# ip nat inside source list NAT-PERMIT-LAN interface GigabitEthernet0/0/1 overload
```

---

## 5. Verification Commands

- `show ip nat translations` — Inspect active stateful NAT translation table entries.
- `show ip nat statistics` — Displays active translations, hits, misses, pools, and assigned inside/outside interfaces.
- `clear ip nat translation *` — Clears dynamic translation entries.
