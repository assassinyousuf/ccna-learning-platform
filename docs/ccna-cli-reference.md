# Cisco IOS Command & Syntax Quick Reference

A comprehensive cheat sheet for the Cisco CCNA 200-301 examination covering core Cisco IOS command modes, interface provisioning, VLAN switching, routing protocols, and diagnostic utilities.

---

## 1. Cisco IOS Execution Modes

Cisco IOS operates in hierarchical command modes. Each mode provides access to specific configuration commands and diagnostics:

| Mode | Prompt | Transition Command | Exit / Return Command |
| :--- | :--- | :--- | :--- |
| **User EXEC Mode** | `Router>` | Connect to device / Console login | `exit` / `logout` |
| **Privileged EXEC Mode** | `Router#` | `enable` (requires secret) | `disable` / `exit` |
| **Global Configuration** | `Router(config)#` | `configure terminal` | `exit` / `end` / `Ctrl+Z` |
| **Interface Configuration** | `Router(config-if)#` | `interface GigabitEthernet0/0/0` | `exit` |
| **Subinterface Configuration** | `Router(config-subif)#` | `interface G0/0/0.10` | `exit` |
| **Line Configuration** | `Router(config-line)#` | `line console 0` or `line vty 0 4` | `exit` |
| **Router Configuration** | `Router(config-router)#` | `router ospf 1` | `exit` |

---

## 2. Fundamental Device Setup

```ios
! Set device host name
Router(config)# hostname R1-EDGE

! Secure privileged EXEC mode with strong scrypt hash
R1-EDGE(config)# enable algorithm-type scrypt secret Cisco12345!

! Encrypt all plaintext passwords in running configuration
R1-EDGE(config)# service password-encryption

! Disable automatic DNS lookups for mistyped commands
R1-EDGE(config)# no ip domain-lookup

! Configure login banner
R1-EDGE(config)# banner motd ^C
=====================================================
AUTHORIZED ACCESS ONLY - CCNA NOC TESTING ENVIRONMENT
=====================================================
^C

! Configure line console with timeout and logging sync
R1-EDGE(config)# line console 0
R1-EDGE(config-line)# exec-timeout 15 0
R1-EDGE(config-line)# logging synchronous
R1-EDGE(config-line)# login local
R1-EDGE(config-line)# exit

! Configure SSH management access
R1-EDGE(config)# ip domain-name cisco.local
R1-EDGE(config)# crypto key generate rsa modulus 2048
R1-EDGE(config)# ip ssh version 2
R1-EDGE(config)# username admin privilege 15 secret SuperSecretP@ss!
R1-EDGE(config)# line vty 0 4
R1-EDGE(config-line)# transport input ssh
R1-EDGE(config-line)# login local
R1-EDGE(config-line)# exec-timeout 10 0
R1-EDGE(config-line)# exit
```

---

## 3. Interface Management & IP Addressing

```ios
! Configure an active GigabitEthernet interface
R1-EDGE(config)# interface GigabitEthernet0/0/0
R1-EDGE(config-if)# description UPLINK-TO-CORE-SW1
R1-EDGE(config-if)# ip address 192.168.10.1 255.255.255.0
R1-EDGE(config-if)# no shutdown
R1-EDGE(config-if)# exit

! Configure Loopback interface (always up/up, ideal for testing & Router IDs)
R1-EDGE(config)# interface Loopback0
R1-EDGE(config-if)# ip address 1.1.1.1 255.255.255.255
R1-EDGE(config-if)# exit
```

---

## 4. Layer 2 Switching Commands

```ios
! Create and name VLANs
Switch(config)# vlan 10
Switch(config-vlan)# name Engineering
Switch(config)# vlan 20
Switch(config-vlan)# name Management
Switch(config)# exit

! Assign Access Port to VLAN
Switch(config)# interface GigabitEthernet1/0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# exit

! Configure 802.1Q Trunk Port
Switch(config)# interface GigabitEthernet1/0/24
Switch(config-if)# switchport trunk encapsulation dot1q   ! (Required on 3560/3750 switches)
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk native vlan 999
Switch(config-if)# switchport trunk allowed vlan 10,20,999
Switch(config-if)# no shutdown
Switch(config-if)# exit
```

---

## 5. Essential Show & Diagnostic Commands

- `show ip interface brief` — View summary status (`Status` & `Protocol`) of all interfaces.
- `show interfaces status` — Port status, duplex, speed, and VLAN assignment (Switches).
- `show running-config` — Current active configuration stored in RAM.
- `show ip route` — IPv4 routing table.
- `show mac address-table` — CAM table mapping MACs to switch ports.
- `show vlan brief` — Active VLAN IDs and member access ports.
- `show cdp neighbors` / `show lldp neighbors` — Layer 2 discovered Cisco and open standard neighbors.
- `copy running-config startup-config` (`write memory`) — Save configuration to NVRAM.
