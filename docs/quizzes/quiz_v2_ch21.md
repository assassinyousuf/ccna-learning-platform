# Assessment & Review: Volume 2 Chapter 21 - Chapter 21: Wireless LAN configuration

### Question 1: Which of the following methods can be used to connect to the GUI of a Cisco WLC? (select all that apply)
- A. Telnet
- B. SSH
- C. HTTP
- D. HTTPS
- E. Console port

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: The graphical user interface (GUI) of a Cisco wireless LAN controller (WLC) can be accessed via HTTP or HTTPS in a web browser. Telnet and SSH are used for remote access to the command-line interface (CLI), and the console port can be used to access the CLI with a console cable.


---

### Question 2: Which WLC port type is used to carry user data traffic?
- A. Distribution system port
- B. Data port
- C. Service port
- D. Dynamic port

> **Official Correct Answer**: **A** — A: Distribution system port  
> **Technical Explanation**: A WLC’s distribution system (DS) ports are the standard network ports that connect to the DS—the switched Ethernet LAN. User data traffic is sent from and received on these ports.


---

### Question 3: Which WLC port type is used for OOB management of the WLC over the network?
- A. Distribution system port
- B. Data port
- C. Service port
- D. Console port

> **Official Correct Answer**: **C** — C: Service port  
> **Technical Explanation**: The service port on a Cisco WLC is used for out-of-band (OOB) management—connecting to and managing the WLC via a dedicated connection that is separate from the DS ports.


---

### Question 4: Which WLC interface type is used to establish CAPWAP tunnels with LWAPs?
- A. Virtual interface
- B. Dynamic interface
- C. Management interface
- D. AP-manager interface

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: AP-manager interface The AP-manager interface on a Cisco WLC is used to establish CAPWAP tunnels with LWAPs. By default, the management interface acts as the AP-manager interface, but you can optionally configure a separate AP-manager interface. For this reason, option D is more correct than option C; although the management interface sometimes acts as the AP-manager interface, that is not always the case.


---

### Question 5: Which WLC interface type is used for OOB management of the WLC over the network?
- A. Virtual interface
- B. Service-port interface
- C. Management interface
- D. AP-manager interface

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B: Service-port interface The service-port interface corresponds to the physical service port and is used for OOB management. The management interface, on the other hand, is the default interface for in-band management via the DS ports.


---

### Question 6: Which advanced WLAN feature encourages clients to associate with less-busy LWAPs?
- A. Client Autoconfig
- B. Client Override
- C. Client Load Balancing
- D. Client Band Select

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: Client Load Balancing If a client tries to associate with a busy LWAP, the Client Load Balancing feature makes the WLC encourage the client to seek a less-busy AP.


---

### Question 7: When configuring a hexadecimal WPA2 PSK in the Cisco WLC GUI, how many characters must the PSK be?
- A. 8 characters
- B. 32 characters
- C. 64 characters
- D. 256 characters

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: The WPA2 PSK can be configured as 64 hexadecimal characters. Alternatively, it can be configured as 8–63 ASCII characters.


---

### Question 8: Which QoS level is assigned to a WLAN by default, offering best-effort treatment of traffic?
- A. Bronze
- B. Silver
- C. Gold
- D. Platinum

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B: Silver The Silver QoS level is the default and is used for best-effort treatment of traffic. The other levels are: Platinum (voice), Gold (video), and Bronze (background).


---

### Question 9: Which advanced WLAN feature delays responses to 2.4 GHz probes to encourage clients to use 5 GHz instead?
- A. Client Autoconfig
- B. Client Override
- C. Client Load Balancing
- D. Client Band Select

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: Client Band Select Client Band Select is a feature that delays responses to 2.4 GHz probe requests to encourage clients to connect to the 5 GHz band, which is usually less crowded.


---

### Question 10: Which of the following are Layer-3 security settings? (select two)
- A. 802.1X
- B. Passthrough
- C. PMF
- D. Conditional Web Redirect

> **Official Correct Answer**: **B** — B: Passthrough  
> **Technical Explanation**: ## D: Conditional Web Redirect Passthrough and Conditional Web Redirect are both Layer-3 WLAN security settings. Passthrough allows the user to access the network after accepting certain terms and conditions or viewing a mandatory message. Conditional Web Redirect redirects the user to a specific web page under certain conditions (i.e. their password is expired).


---

### Question 11: Which WLC interface type is used to map WLANs to VLANs?
- A. Virtual interface
- B. SVI
- C. WLAN interface
- D. Dynamic interface

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: Dynamic interface Dynamic interfaces on a Cisco WLC are used to map WLANs to VLANs. Each dynamic interface is mapped to a VLAN on the wired network and a corresponding WLAN on the wireless network.


---

### Question 12: Which tab of the Cisco WLC GUI allows you to configure settings related to the LWAPs managed by the WLC?
- A. Wireless
- B. Management
- C. WLANs
- D. Controller

> **Official Correct Answer**: **A** — A: Wireless  
> **Technical Explanation**: The Wireless tab in the Cisco WLC GUI is where you configure settings related to the LWAPs managed by the WLC.


---

### Question 13: If you enable LAG on a Cisco WLC, which ports are included in the LAG?
- A. All ports
- B. All DS ports
- C. All DS and redundancy ports
- D. All service ports

> **Official Correct Answer**: **B** — B: All DS ports  
> **Technical Explanation**: When you enable link aggregation group (LAG), all DS ports are included in the LAG. However, not all DS ports need to be active; as long as there is one functioning physical port in the LAG, it will be operational.

