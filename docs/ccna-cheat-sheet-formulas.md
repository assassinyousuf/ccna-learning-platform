# Cisco CCNA 200-301 Fast Reference & Formulas

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
