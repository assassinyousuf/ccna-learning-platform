# IPv6 Addressing, SLAAC & EUI-64 Deep Dive

Mastering IPv6 128-bit address architecture, stateless autoconfiguration, and Neighbor Discovery Protocol (NDP).

---

## 1. IPv6 Address Scope Categories

- **Global Unicast Address (GUA)**: `2000::/3` (Globally routable on public Internet).
- **Unique Local Address (ULA)**: `FC00::/7` (RFC 4193 private enterprise routing, typically `FD00::/8`).
- **Link-Local Address (LLA)**: `FE80::/10` (Required on every active interface; valid only on local link).
- **Multicast Address**: `FF00::/8`:
  - `FF02::1` — All nodes on local link.
  - `FF02::2` — All routers on local link.
  - `FF02::5` — All OSPFv3 routers.
  - `FF02::1:FF00:0/104` — Solicited-Node Multicast (used for ARP replacement).
- **Loopback Address**: `::1/128`.
- **Default Route (Unspecified)**: `::/0`.

---

## 2. The 3-Step EUI-64 Translation Method

To generate a 64-bit interface identifier from a 48-bit MAC address:

1. **Split the MAC address into two 24-bit halves**:
   - `00:1A:2B : 3C:4D:5E`
2. **Inject the 16-bit hex constant `FFFE` in the center**:
   - `001A:2B` + `FF:FE` + `3C:4D5E` $\rightarrow$ `001A:2BFF:FE3C:4D5E`
3. **Invert the 7th bit (Universal/Local bit)** of the first octet:
   - First byte `00` in binary = `0000 0000`
   - Invert 7th bit $\rightarrow$ `0000 0010` = `02`
   - Final EUI-64 ID: `021A:2BFF:FE3C:4D5E`

---

## 3. SLAAC Address Autoconfiguration Workflow

1. Host boots and generates a Link-Local Address (`FE80::/10` + EUI-64 or Random).
2. Host sends a **Router Solicitation (RS)** packet to `FF02::2` (All Routers).
3. Local Router responds with a **Router Advertisement (RA)** packet to `FF02::1` (All Nodes) containing:
   - Global IPv6 network prefix (e.g. `2001:DB8:ACAD:1::/64`).
   - Prefix lifetime and MTU.
   - SLAAC flag (`A=1`) and DHCPv6 flags (`M` and `O`).
4. Host concatenates prefix with its 64-bit Interface ID to formulate its full Global Unicast Address.
5. Host performs **Duplicate Address Detection (DAD)** using Neighbor Solicitation before utilizing the IP.
