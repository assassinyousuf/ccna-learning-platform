# Access Control Lists (ACL) Architecture & Syntax

Access Control Lists (ACLs) provide sequential packet filtering at Layer 3 and Layer 4 to enforce security policies and traffic classification.

---

## 1. ACL Types & Placement Rules

| Attribute | Standard ACLs | Extended ACLs |
| :--- | :--- | :--- |
| **Numbered Range** | `1 - 99` and `1300 - 1999` | `100 - 199` and `2000 - 2699` |
| **Inspection Scope** | Source IPv4 Address only | Source IP, Destination IP, Protocol (TCP, UDP, ICMP), Port |
| **Placement Guideline** | **As close to the DESTINATION as possible** (prevents discarding traffic prematurely) | **As close to the SOURCE as possible** (saves transit network bandwidth) |

---

## 2. Wildcard Mask Calculations

Wildcard masks determine which bits must match (`0` bit = exact match) and which bits are ignored (`1` bit = do not care):

$$\text{Wildcard Mask} = 255.255.255.255 - \text{Subnet Mask}$$

### Examples:
- Subnet `/24` (`255.255.255.0`): $255.255.255.255 - 255.255.255.0 = \mathbf{0.0.0.255}$
- Subnet `/28` (`255.255.255.240`): $255.255.255.255 - 255.255.255.240 = \mathbf{0.0.0.15}$
- Single Host (`255.255.255.255`): $\mathbf{0.0.0.0}$ (can use keyword `host <ip>`)
- Any Host (`0.0.0.0`): $\mathbf{255.255.255.255}$ (can use keyword `any`)

---

## 3. Configuration Examples

### Standard Named ACL:
```ios
! Permit only Admin Host 192.168.1.50 to access VTY lines
R1(config)# ip access-list standard VTY-ADMIN-RESTRICT
R1(config-std-nacl)# 10 permit host 192.168.1.50
R1(config-std-nacl)# 20 deny any log
R1(config-std-nacl)# exit

! Apply to VTY lines
R1(config)# line vty 0 4
R1(config-line)# access-class VTY-ADMIN-RESTRICT in
R1(config-line)# exit
```

### Extended Named ACL:
```ios
! Allow LAN (192.168.10.0/24) to reach Web Servers (HTTP/HTTPS) and DNS, block all other outbound
R1(config)# ip access-list extended SECURE-INTERNET-OUT
R1(config-ext-nacl)# 10 permit tcp 192.168.10.0 0.0.0.255 any eq 80
R1(config-ext-nacl)# 20 permit tcp 192.168.10.0 0.0.0.255 any eq 443
R1(config-ext-nacl)# 30 permit udp 192.168.10.0 0.0.0.255 any eq 53
R1(config-ext-nacl)# 40 permit icmp 192.168.10.0 0.0.0.255 any echo
R1(config-ext-nacl)# 50 deny ip any any log
R1(config-ext-nacl)# exit

! Apply outbound on WAN interface
R1(config)# interface GigabitEthernet0/0/1
R1(config-if)# ip access-group SECURE-INTERNET-OUT out
R1(config-if)# exit
```

> [!WARNING]
> Remember that every ACL has an invisible **Implicit Deny Any** at the very bottom. If a packet does not match any permit statement, it is dropped silently.
