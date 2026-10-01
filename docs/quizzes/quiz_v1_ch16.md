# Assessment & Review: Volume 1 Chapter 16 - Chapter 16: EtherChannel

### Question 1: Which of the following statements about EtherChannel is false?
- A. EtherChannel combines multiple physical links into a single logical link.
- B. EtherChannel eliminates the need for STP in a LAN.
- C. A frame flooded out of a port-channel interface will only be flooded out of one of the member ports.
- D. EtherChannel formation can be dynamically negotiated or statically configured.

> **Official Correct Answer**: **B** — B: EtherChannel eliminates the need for STP in a LAN.  
> **Technical Explanation**: EtherChannel does not eliminate the need for STP in a LAN. While EtherChannel can aggregate multiple physical links into a single logical link, reducing the number of ports that need to be blocked by STP, STP still plays a critical role in the larger network topology for loop prevention.


---

### Question 2: Which of the following dynamic EtherChannel mode combinations will result in a valid EtherChannel? (select two)
- A. auto + auto
- B. desirable + active
- C. passive + active
- D. desirable + desirable

> **Official Correct Answer**: **C** — C: passive + active  
> **Technical Explanation**: D: desirable + desirable When using Link Aggregation Control Protocol (LACP), the mode combinations that will result in a valid EtherChannel are passive+active and active+active. When using Port Aggregation Protocol (PAgP), they are auto+desirable and desirable+desirable. PAgP and LACP modes don’t mix; a switch using PAgP won’t form an EtherChannel with a switch using LACP.


---

### Question 3: Which of the following settings doesn’t have to match among the member ports of an EtherChannel?
- A. Description
- B. Duplex
- C. Speed
- D. Operational mode (access or trunk)

> **Official Correct Answer**: **A** — A: Description  
> **Technical Explanation**: A description doesn’t affect a port’s operation, so each member port of an EtherChannel can have a unique description. However, settings like speed, duplex, and access/trunk mode must match among all ports in an EtherChannel.


---

### Question 4: Which dynamic EtherChannel modes can form a valid EtherChannel with a neighbor configured with **channel-group 1 mode on**?
- A. Desirable or active
- B. Desirable or auto
- C. Active only
- D. None of the above

> **Official Correct Answer**: **D** — D: None of the above  
> **Technical Explanation**: Just as PAgP and LACP modes can’t form an EtherChannel with each other, neither can form an EtherChannel with a switch configured to use static EtherChannel. To form a working static EtherChannel, both sides must be configured with **mode on**.


---

### Question 5: Which protocol can be used to negotiate an EtherChannel with a non-Cisco switch?
- A. PAgP
- B. LACP
- C. Neither

> **Official Correct Answer**: **B** — B: LACP  
> **Technical Explanation**: Link Aggregation Control Protocol (LACP) is an IEEE standard and can be used to negotiate an EtherChannel with a non-Cisco switch. PAgP, on the other hand, is a Cisco-proprietary protocol and can only be used on Cisco devices.


---

### Question 6: Port-channel 1 and its member ports currently operate in access mode.  What will happen after you configure **switchport mode trunk** on the portchannel 1 interface?
- A. The port-channel is disabled until you configure trunk mode on the member ports.
- B. The configuration is inherited by the member ports.
- C. The member ports are disabled until you configure trunk mode on them.
- D. The command is rejected.

> **Official Correct Answer**: **B** — B: The configuration is inherited by the member ports.  
> **Technical Explanation**: When you configure the port-channel interface, the member ports inherit this configuration. Changing the port-channel interface to trunk mode automatically updates the member ports to match this configuration, ensuring consistency across the EtherChannel.


---

### Question 7: When connecting two switches with a Layer-3 EtherChannel, where should each switch’s IP address be configured?
- A. On the port-channel interface
- B. On the member ports
- C. On both the port-channel interface and the member ports

> **Official Correct Answer**: **A** — A: On the port-channel interface  
> **Technical Explanation**: In a Layer-3 EtherChannel, IP addressing is configured on the port-channel interface rather than on the individual member ports. This setup allows the EtherChannel to function as a single logical interface at Layer 3.

