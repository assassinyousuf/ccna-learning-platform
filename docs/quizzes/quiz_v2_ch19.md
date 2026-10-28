# Assessment & Review: Volume 2 Chapter 19 - Chapter 19: Wireless LAN architectures

### Question 1: When a wireless client sends a frame to another client associated with the same AP, what is the RA of the frame when the client transmits it?
- A. The destination client’s MAC
- B. The sender’s MAC
- C. The AP’s MAC

> **Official Correct Answer**: **C** — C: The AP’s MAC  
> **Technical Explanation**: When a wireless client sends a frame to another client associated with the same AP, the receiver address (RA) is set to the AP’s MAC address when the client transmits the frame. The AP then forwards the frame to the destination client.


---

### Question 2: Which of the following messages are used in passive scanning?
- A. Beacon messages
- B. Discovery messages
- C. Advertisement messages
- D. Probe messages

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: Beacon messages In passive scanning, a wireless client listens for beacon messages broadcasted by APs. These beacon messages contain information about the network, such as the SSID and supported data rates.


---

### Question 3: Which of the following are not 802.11 management messages?
- A. CTS/RTS
- B. Probe request/response
- C. Authentication request/response
- D. Association request/response

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: CTS/RTS Clear to Send (CTS) and Request to Send (RTS) are 802.11 control messages, not management messages. Management messages include Probe request/response, Authentication request/response, and Association request/response.


---

### Question 4: Which kind of AP is managed by a WLC?
- A. Autonomous AP
- B. Managed AP
- C. Lightweight AP
- D. Controller AP

> **Official Correct Answer**: **C** — C: Lightweight AP  
> **Technical Explanation**: A lightweight access point (LWAP) is managed by a wireless LAN controller (WLC). The LWAP relies on the WLC for management functions, configuration, and control.


---

### Question 5: Which of the following APs typically connects to the DS via an access link?
- A. Cloud-based AP
- B. Autonomous AP
- C. LWAP in local mode
- D. LWAP in FlexConnect mode

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: LWAP in local mode An LWAP in local mode typically connects to the DS via an access link. Because all data traffic is tunneled to the WLC using Control and Provisioning of Wireless Access Points (CAPWAP), the LWAP’s connection to the distribution system (DS) typically only needs to support the management VLAN.


---

### Question 6: Which LWAP mode captures 802.11 frames for analysis in Wireshark?
- A. Monitor
- B. Sniffer
- C. SE-Connect
- D. Rogue detector

> **Official Correct Answer**: **B** — B: Sniffer  
> **Technical Explanation**: In Sniffer mode, an LWAP captures 802.11 frames, which can be exported and analyzed using tools like Wireshark.


---

### Question 7: When FlexConnect local switching is enabled for a WLAN, which device is responsible for switching traffic between the 802.11 and Ethernet networks?
- A. The LWAP
- B. The WLC
- C. The switch
- D. The router

> **Official Correct Answer**: **A** — A: The LWAP  
> **Technical Explanation**: When FlexConnect local switching is enabled, the LWAP is responsible for switching traffic between the 802.11 wireless and Ethernet wired networks; it doesn’t tunnel data traffic to the WLC.


---

### Question 8: Which LWAP mode is dedicated to analyzing traffic on the wired LAN?
- A. Monitor
- B. Sniffer
- C. SE-Connect
- D. Rogue Detector

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: Rogue detector In Rogue Detector mode, the LWAP is dedicated to analyzing traffic on the wired LAN to detect rogue devices connected to the network. The LWAP’s radios are disabled.


---

### Question 9: In Cisco Meraki’s cloud-based AP solution, which traffic is tunneled to the Meraki cloud?
- A. Management traffic
- B. Data traffic
- C. All traffic

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: Management traffic In Cisco Meraki’s cloud-based AP solution, management traffic is tunneled to the Meraki cloud. This includes configuration and monitoring data, while user data traffic is handled locally on the AP.


---

### Question 10: Which WLC deployment option uses a dedicated hardware appliance?
- A. Embedded
- B. Autonomous
- C. Cloud
- D. Unified

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: Unified A unified WLC is a dedicated hardware appliance. Various hardware models are available, supporting anywhere from a few hundred LWAPs to as many as 6000.


---

### Question 11: Which of the following functions are centrally controlled in a split-MAC architecture? (select two)
- A. Client authentication and association
- B. RF management
- C. Beacon transmission
- D. RF signal transmission and reception

> **Official Correct Answer**: **A** — A: Client authentication and association  
> **Technical Explanation**: ## B: RF management In a split-MAC architecture, functions like client authentication, association, and RF management are centrally controlled by the WLC. This central control allows for consistent policy enforcement and network management. The LWAPs handle real-time operations like transmitting and receiving RF signals. ## 12. Which statement about CAPWAP is true? A: The CAPWAP control tunnel is encrypted by default. Only the CAPWAP control tunnel is encrypted by default. The data tunnel, however, is not encrypted by default; it must be enabled separately. CAPWAP encryption uses Datagram Transport Layer Security (DTLS)—a type of TLS that uses UDP instead of TCP.


---

### Question 12: Which statement about CAPWAP is true?
- A. The CAPWAP control tunnel is encrypted by default.
- B. The CAPWAP data tunnel is encrypted by default.
- C. Both CAPWAP tunnels are encrypted by default.

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 13: Which of the following is not a benefit of cloud-based network management?
- A. Rapid deployment with ZTP
- B. Highly customizable to meet complex networking requirements
- C. Simplified management via a web-based dashboard
- D. Enhanced visibility and analytics

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B. Highly customizable to meet complex networking requirements While cloud-based network management provides a variety of benefits such as rapid deployment with zero-touch provisioning (ZTP), simplified management via a web-based dashboard, and enhanced network visibility and analytics, it might not be suitable for organizations with highly specialized or complex network requirements.

