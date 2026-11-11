# Cisco Integrated Services Routers (ISR) Architecture

Technical overview of Cisco ISR 4000 series routing platforms, Cisco IOS-XE architecture, and WAN connectivity options.

---

## 1. Cisco IOS-XE Operating System Architecture

Cisco IOS-XE separates the operating system into distinct functional planes running on a multi-core Linux kernel:
- **Control Plane**: Linux-based control plane process managing OSPF, BGP, SSH, and administrative CLI.
- **Data Plane (Forwarding)**: Cisco QuantumFlow Processor (QFP) hardware dedicated exclusively to cryptographic acceleration, QoS shaping, and packet switching.

---

## 2. WAN Physical Layer Interfaces

- **Serial / T1 / E1**: Legacy synchronous serial interfaces utilizing HDLC or PPP encapsulation.
- **Metro Ethernet (Gigabit / TenGigabit)**: Modern fiber optical Ethernet uplinks hand-off directly from service providers.
- **Cellular LTE / 5G NIMs**: Network Interface Modules providing automated secondary failover WAN links.

---

## 3. Generic Routing Encapsulation (GRE)

GRE (IP Protocol 47) encapsulates multi-protocol packet payloads inside an IP transport packet:
```ios
! Configure GRE Tunnel Interface
R1(config)# interface Tunnel0
R1(config-if)# ip address 10.255.255.1 255.255.255.252
R1(config-if)# tunnel source GigabitEthernet0/0/1
R1(config-if)# tunnel destination 203.0.113.2
R1(config-if)# exit
```
