# Assessment & Review: Volume 2 Chapter 15 - Chapter 15: LAN architectures

### Question 1: Which layer of a three-tier LAN is most likely to implement security services such as Port Security, DHCP Snooping, and DAI?
- A. Access
- B. Distribution
- C. Core

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: Access The access layer in a three-tier LAN is usually responsible for implementing security services like Port Security, DHCP Snooping, and Dynamic ARP Inspection (DAI). This layer directly interacts with end-user devices, making it a critical point for enforcing security policies.


---

### Question 2: Which layers are combined in a two-tier LAN? (select two)
- A. Access
- B. Distribution
- C. Core

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: In a two-tier (collapsed core) LAN architecture, the distribution and core layers are collapsed into a single layer. This simplifies the architecture and is commonly used in smaller LANs where a separate core layer is not necessary.


---

### Question 3: In a three-tier LAN, where is the border between Layers 2 and 3 usually located?
- A. Access
- B. Distribution
- C. Core

> **Official Correct Answer**: **B** — B: Distribution  
> **Technical Explanation**: In a three-tier LAN, the distribution layer usually serves as the border between Layers 2 and 3 of the TCP/IP Model. End hosts use SVIs on the distribution switches as their default gateways, and the distribution switches use a routing protocol like OSPF to share routing information with each other and the core switches.


---

### Question 4: In a three-tier LAN, which switches are most likely to support PoE?
- A. Access switches
- B. Distribution switches
- C. Core switches

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: Access switches The access layer is where end hosts that might require Power over Ethernet (PoE), such as IP phones and wireless access points, connect to the network. Therefore, access switches are most likely to support PoE.


---

### Question 5: In a three-tier LAN, which layer is focused on speed and reliability, avoiding CPU-intensive operations?
- A. Access
- B. Distribution
- C. Core

> **Official Correct Answer**: **C** — C: Core  
> **Technical Explanation**: The Core layer in a three-tier LAN is focused on providing fast and reliable transport of packets across the LAN. Core switches typically don’t implement CPU-intensive operations like security features and QoS marking that would slow down the forwarding of packets.


---

### Question 6: In a three-tier LAN, where is QoS marking most often performed?
- A. Access
- B. Distribution
- C. Core

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: Access QoS marking should generally be performed close to a packet’s source, simplifying the classification process for the rest of the packet’s journey. The access layer is where end hosts connect to the network, so marking is often performed at this layer.


---

### Question 7: Which of the following statements about spine-leaf architecture is true?
- A. Every leaf switch is connected to every other leaf switch.
- B. Every leaf switch is connected to every spine switch.
- C. Every spine switch is connected to every other spine switch
- D. End hosts connect to spine switches.

> **Official Correct Answer**: **B** — B: Every leaf switch is connected to every spine switch.  
> **Technical Explanation**: In a spine-leaf architecture, every leaf switch connects to every spine switch, but leaf switches don’t connect to other leaf switches, and spine switches don’t connect to other spine switches. End hosts—typically servers— connect to leaf switches, not spine switches.


---

### Question 8: Which of the following are benefits of spine-leaf architecture? (select two)
- A. Consistent and predictable latency between servers
- B. More efficient north-south communication
- C. Simple scalability by adding more leaf switches
- D. Reduced need for east-west communication

> **Official Correct Answer**: **A** — A: Consistent and predictable latency between servers  
> **Technical Explanation**: C: Simple scalability by adding more leaf switches Different servers in a spine-leaf architecture are a consistent number of hops away from each other, providing consistent and predictable latency between servers. Scaling a spine-leaf LAN is simple: just add more leaf switches and connect each new leaf switch to each spine switch.


---

### Question 9: Which type of network is most likely to benefit from spine-leaf architecture?
- A. Small-to-medium enterprise LANs
- B. Large enterprise LANs
- C. Data center LANs
- D. SOHO LANs

> **Official Correct Answer**: **C** — C: Data center LANs  
> **Technical Explanation**: Data center LANs are most likely to benefit from spine-leaf architecture due to its high scalability, predictable latency, and efficient handling of the east-west traffic that is common in modern data centers.


---

### Question 10: Which of the following statements about SOHO networks is true?
- A. SOHO networks typically use a two-tier architecture.
- B. SOHO networks require redundant internet connections.
- C. SOHO networks require separate WAN and internet connections.
- D. SOHO networks’ needs are often met by a single wireless router.

> **Official Correct Answer**: **D** — D: SOHO networks’ needs are often met by a single wireless router.  
> **Technical Explanation**: Small Office/Home Office (SOHO) networks are typically simple, and their networking needs can often be met with a single wireless router that combines several functions such as routing, switching, stateful packet filtering, and wireless access.

