# Enterprise Wireless LAN Architecture (WLAN & WLC)

Comprehensive study of IEEE 802.11 standards, Cisco Wireless LAN Controllers (WLC), and Split-MAC operation.

---

## 1. IEEE 802.11 Wireless Standards Progression

| Standard | Frequency Bands | Maximum Theoretical Throughput | Key Modulation / MIMO Features |
| :--- | :--- | :---: | :--- |
| **802.11b** | 2.4 GHz | 11 Mbps | DSSS, CCK |
| **802.11g** | 2.4 GHz | 54 Mbps | OFDM |
| **802.11n (Wi-Fi 4)** | 2.4 GHz & 5.0 GHz | 600 Mbps | 4x4 MIMO, 40 MHz channel bonding |
| **802.11ac (Wi-Fi 5)**| 5.0 GHz | 6.93 Gbps | 8x8 MU-MIMO, 160 MHz channels, 256-QAM |
| **802.11ax (Wi-Fi 6)**| 2.4 GHz, 5 GHz, 6 GHz | 9.6 Gbps | OFDMA, 1024-QAM, Target Wake Time (TWT) |

---

## 2. Cisco Split-MAC Architecture & CAPWAP

Traditional Autonomous APs perform all 802.11 functions locally. Lightweight APs (LAP) split functionality with a centralized Wireless LAN Controller (WLC) connected via **Control and Provisioning of Wireless Access Points (CAPWAP)** tunnels:

### Split-MAC Function Allocation:
- **Lightweight Access Point (LAP)**:
  - 802.11 physical Layer transmission & reception.
  - Frame beacon generation and Probe Responses.
  - Real-time frame acknowledgments and retransmissions.
- **Wireless LAN Controller (WLC)**:
  - 802.11 authentication & 802.1X EAP termination.
  - Association and reassociation request processing.
  - Security policy enforcement and roaming coordination.
  - Radio Resource Management (RRM) dynamic channel/power tuning.

---

## 3. WPA3 Security & Simultaneous Authentication of Equals (SAE)

- Replaces vulnerable WPA2 Pre-Shared Key (PSK) 4-way handshakes with **SAE (Dragonfly handshake)**.
- Resistant to offline dictionary attacks even when weak passphrases are selected.
- Enforces Protected Management Frames (PMF) to prevent deauthentication spoofing attacks.
