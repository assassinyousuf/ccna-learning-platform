# Assessment & Review: Volume 1 Chapter 19 - Chapter 19: First hop redundancy protocols

### Question 1: Which of the following statements about the virtual IP and virtual MAC used by HSRP are true?
- A. The active and standby routers share a VIP, but each uses a different virtual MAC address.
- B. The active and standby routers each use a different VIP, but share a virtual MAC address.
- C. The active and standby routers share a VIP and virtual MAC address.
- D. The active and standby router each use different VIPs and virtual MAC addresses.

2.During HSRP failover, what is the purpose of the new active router sending GARP messages?
- A. To make end hosts update their ARP table.
- B. To make end hosts update their default gateway IP address.
- C. To make switches update their MAC address table.
- D. To inform the former active router of the failover.

> **Official Correct Answer**: **C** — C: The active and standby routers share a VIP and virtual MAC address.  
> **Technical Explanation**: The Hot Standby Router Protocol (HSRP) active and standby routers share a virtual IP address (VIP) and virtual MAC address. This allows for a seamless failover from the active router to the standby router; end hosts don’t have to update their default gateway IP address or ARP table when a failover occurs.


---

### Question 2: During HSRP failover, what is the purpose of the new active router sending GARP messages?
- C: To make switches update their MAC address table.
- Option B
- Option C
- Option D

> **Official Correct Answer**: **C** — C: To make switches update their MAC address table.  
> **Technical Explanation**: As the previous explanation mentioned, end hosts don’t have to update their default gateway IP address or ARP table when a failover from active to standby occurs. Instead, the gratuitous ARP (GARP) messages sent by the new active router serve to make switches update their MAC address tables. This allows them to correctly forward frames to the new active router.


---

### Question 3: Which virtual MAC address is used by VRRP group 12?
- A. 0000.5e00.010c
- B. 0000.5e00.0112
- C. 0000.0c07.ac0c
- D. 0000.0c07.ac12

> **Official Correct Answer**: **A** — A: 0000.5e00.010c  
> **Technical Explanation**: The Virtual Router Redundancy Protocol (VRRP) virtual MAC uses the format 0000.5e00.01XX, where XX is the VRRP group number. However, because MAC addresses are written in hexadecimal, the virtual MAC format for VRRP group 12 is 0000.5e00.010c (0d12 = 0xc), not 0000.5e00.0112.


---

### Question 4: R1 is a master router, actively forwarding packets between the LAN and external networks. R2 is a backup router, waiting to take over in case R1 fails. Which FHRP are R1 and R2 using?
- A. HSRP
- B. VRRP
- C. GLBP

> **Official Correct Answer**: **B** — B: VRRP  
> **Technical Explanation**: In VRRP, the terms “master” and “backup” are used. HSRP uses the terms “active” and “standby”, and GLBP uses “Active Virtual Gateway (AVG)” and “Active Virtual Forwarder (AVF)”.


---

### Question 5: Which FHRP facilitates load balancing of traffic within a single subnet?
- A. HSRP
- B. VRRP
- C. GLBP

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Gateway Load Balancing Protocol (GLBP) facilitates load balancing of traffic from hosts across multiple routers in a single subnet. GLBP elects up to four AVFs, each with a unique virtual MAC address, and traffic is load-balanced among the AVFs.


---

### Question 6: R1 and R2 use VRRP to provide a redundant default gateway for end hosts. R1 was the master router, but a hardware failure on R1 caused R2 to take over the master role. Given the default settings, what happens when R1 recovers from its hardware failure?
- A. R1 becomes the master router again.
- B. R2 remains the master router.

> **Official Correct Answer**: **A** — A: R1 becomes the master router again.  
> **Technical Explanation**: In VRRP, preemption is enabled by default. This means that if the master router (R1, in this case) recovers from a failure, it will preempt the backup router and take back its role as the master router. This ensures that the router with the highest priority always serves as the master router when it is operational.


---

### Question 7: Which command configures the HSRP VIP?
- A. R1(config-if)# **hsrp 1 vip 10.0.0.1**
- B. R1(config-if)# **hsrp 1 ip 10.0.0.1**
- C. R1(config-if)# **standby 1 vip 10.0.0.1**
- D. R1(config-if)# **standby 1 ip 10.0.0.1**

> **Official Correct Answer**: **D** — D: R1(config-if)# **standby 1 ip 10.0.0.1**  
> **Technical Explanation**: The command to configure the HSRP VIP is **standby group-number ip vip** in interface config mode.


---

### Question 8: What is the correct order of priority when electing the HSRP active router?
- A. 1) Lowest interface priority, 2) Lowest interface IP address
- B. 1) Lowest interface IP address, 2) Lowest interface priority
- C. 1) Highest interface IP address, 2) Highest interface priority
- D. 1) Highest interface priority, 2) Highest interface IP address

> **Official Correct Answer**: **D** — D: 1) Highest interface priority, 2) Highest interface IP address  
> **Technical Explanation**: The active router in HSRP is determined first by the highest interface priority. If there is a tie in priority, the router with the highest IP address on the HSRP-enabled interface becomes the active router.

