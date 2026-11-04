# IPv4 Subnetting & VLSM Architecture Guide

Mastery of binary mathematics, CIDR notation, and Variable Length Subnet Masking (VLSM) is the foundation of network engineering and a primary scoring metric on the Cisco CCNA 200-301 exam.

---

## 1. IPv4 Structure & Octet Values

An IPv4 address consists of 32 bits segmented into four 8-bit octets separated by dots:

$$\text{Total Bits} = 8 + 8 + 8 + 8 = 32 \text{ bits}$$

### Bit Value Weights within an Octet
| Bit Position | $2^7$ | $2^6$ | $2^5$ | $2^4$ | $2^3$ | $2^2$ | $2^1$ | $2^0$ |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Decimal Value** | **128** | **64** | **32** | **16** | **8** | **4** | **2** | **1** |

---

## 2. Complete CIDR & Subnet Mask Lookup Table

| CIDR Prefix | Subnet Mask | Interesting Octet Value | Block Size (Magic Number) | Total IPs ($2^H$) | Usable Hosts ($2^H - 2$) |
| :---: | :--- | :---: | :---: | :---: | :---: |
| `/24` | `255.255.255.0` | 0 | 256 | 256 | 254 |
| `/25` | `255.255.255.128` | 128 | 128 | 128 | 126 |
| `/26` | `255.255.255.192` | 192 | 64 | 64 | 62 |
| `/27` | `255.255.255.224` | 224 | 32 | 32 | 30 |
| `/28` | `255.255.255.240` | 240 | 16 | 16 | 14 |
| `/29` | `255.255.255.248` | 248 | 8 | 8 | 6 |
| `/30` | `255.255.255.252` | 252 | 4 | 4 | 2 (Point-to-Point) |
| `/31` | `255.255.255.254` | 254 | 2 | 2 | 2 (RFC 3021 Point-to-Point) |
| `/32` | `255.255.255.255` | 255 | 1 | 1 | 1 (Host Route / Loopback) |

---

## 3. The 4-Step "Magic Number" Method

To determine network boundaries and valid host ranges rapidly in testing conditions:

1. **Find the Interesting Octet**: The octet containing both 1s and 0s in the subnet mask (any octet other than `255` or `0`).
2. **Calculate the Magic Number (Block Size)**:
   $$\text{Magic Number} = 256 - \text{Mask Value of Interesting Octet}$$
3. **Determine Network Boundary**: Count in multiples of the Magic Number starting at 0 until reaching the given IP value. The highest multiple less than or equal to the IP is the **Network ID**.
4. **Determine Usable Range & Broadcast**:
   - First Usable IP = $\text{Network ID} + 1$
   - Next Network ID = $\text{Network ID} + \text{Magic Number}$
   - Broadcast IP = $\text{Next Network ID} - 1$
   - Last Usable IP = $\text{Broadcast IP} - 1$

---

## 4. Worked Example: Subnetting 172.16.45.100 / 20

- **Subnet Mask**: `/20` = $8 + 8 + 4 + 0$ bits $\rightarrow$ `255.255.240.0`
- **Interesting Octet**: 3rd octet (`240`)
- **Magic Number**: $256 - 240 = 16$
- **Multiples of 16 in 3rd octet**: $0, 16, 32, 48\dots$
- **Network ID**: 45 falls between 32 and 48 $\rightarrow$ `172.16.32.0/20`
- **First Usable**: `172.16.32.1`
- **Next Network ID**: `172.16.48.0`
- **Broadcast IP**: `172.16.47.255`
- **Last Usable**: `172.16.47.254`
- **Usable Host Capacity**: $2^{12} - 2 = 4096 - 2 = 4094$ hosts.
