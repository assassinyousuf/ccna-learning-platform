# Assessment & Review: Volume 1 Chapter 14 - Chapter 14: Spanning Tree Protocol

### Question 1: Which of the following are negative effects of Layer-2 loops? (select two)
- A. MAC address flapping
- B. Broadcast storms
- C. Expired TTL
- D. Routing loops

> **Official Correct Answer**: **A** — A: MAC address flapping  
> **Technical Explanation**: B: Broadcast storms Layer-2 loops can cause MAC address flapping, where a switch cannot determine the correct port for a MAC address due to the address repeatedly appearing on different ports. They can also cause broadcast storms, where looping broadcast frames consume network bandwidth and overwhelm network devices.


---

### Question 2: In a four-switch LAN, which of the following switches would be selected as the STP root bridge?
- A. SW1, BID: 32769:5254.00fa.abcd
- B. SW2, BID: 32769:5254.0000.0002
- C. SW3, BID: 36865:5254.0000.0001
- D. SW4, BID: 1:5254.00ff.f012

> **Official Correct Answer**: **D** — D: SW4, BID: 1:5254.00ff.f012  
> **Technical Explanation**: The switch with the lowest Bridge ID (BID) will be selected as the root bridge in STP. The BID is a combination of the priority value and the MAC address. SW4 has the lowest priority (1) and therefore the lowest BID, so it would be the root bridge. ## 3.  How many root ports will there be in a four-switch LAN? ## C: 3 In a network with four switches, there will be one root bridge and three non-root bridges. Each non-root bridge will select one root port—the port with the lowest cost to reach the root bridge. Therefore, there will be three root ports in total. ## 4.  Which STP port roles send BPDUs? ## A: Designated ports STP BPDUs are only sent out of designated ports. The root bridge, which has only designated ports, sends BPDUs out of all ports every 2 seconds. Then, other switches use their designated ports to propagate those BPDUs out to other switches.


---

### Question 3: How many root ports will there be in a four-switch LAN?
- A. 1
- B. 2
- C. 3
- D. 4

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 4: Which STP port roles send BPDUs?
- A. Designated ports
- B. Root ports
- C. Designated and root ports
- D. Designated, root, and non-designated port

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 5: When you connect an end host to a switch port without PortFast, how long does it take for the port to enter the STP forwarding state?
- A. 15 seconds
- B. 20 seconds
- C. 30 seconds
- D. 35 seconds

> **Official Correct Answer**: **B** — B: The port is error-disabled.  
> **Technical Explanation**: ## C: 30 seconds When an end host is first connected to a switch port without PortFast, the port must transition through the STP listening and learning states before entering the forwarding state. How long the port spends in each state is determined by the forward delay timer, which is 15 seconds by default; this means it will take 30 seconds in total (15\*2). ## 6.  What happens when a switch port configured with spanning-tree bpduguard enable receives a BPDU? When BPDU Guard is enabled on a port and it receives a BPDU, the port is put into an errordisabled state to prevent potential STP topology changes. This is a protective measure typically used on access ports that should be connected to end hosts.


---

### Question 6: What happens when a switch port configured with **spanning-tree bpduguard enable** receives a BPDU?
- A. The port ignores the BPDU.
- B. The port is error-disabled.
- C. BPDU Guard is disabled on the port.
- D. The port immediately moves to the forwarding state.

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 7: Two switches, SW1 and SW2, are connected by two links using the default STP cost values. SW2 is the root bridge. SW1 G0/1 is connected to SW2 G0/2, and SW1 G0/2 is connected to SW2 G0/1.  Which port will SW1 select as its root port?
- A. G0/1
- B. G0/2

> **Official Correct Answer**: **B** — B: G0/2  
> **Technical Explanation**: A switch selects its port with the lowest root cost as its root port. If multiple ports are tied, it will select the port connected to the switch with the lowest BID. If multiple ports are still tied, it will select the port connected to the port with the lowest port ID. In this question, SW1 G0/2 (connected to SW2 G0/1) is connected to a port with a lower port ID than SW1 G0/1 (connected to SW2 G0/2), so SW1 G0/2 will become SW1’s root port. It’s important to note that SW1 doesn’t compare its own port IDs; it compares the neighbor’s (SW2’s) port IDs.


---

### Question 8: SW3 and SW4 are part of a larger LAN. They are connected by their G0/1 ports, neither of which is a root port. Both switches have equal root costs. How will they determine which port becomes designated and which becomes non-designated?
- A. The port with the lowest port ID will become designated.
- B. The port with the highest port ID will become designated.
- C. The port on the switch with the lowest BID will become designated.
- D. The port on the switch with the highest BID will become designated.

> **Official Correct Answer**: **C** — C: The port on the switch with the lowest BID will become designated.  
> **Technical Explanation**: When two switches have equal root costs, the switch with the lower BID will have its port become the designated port. The other switch’s port will be non-designated (blocking).


---

### Question 9: How many STP designated ports will there be in a four-switch LAN with a total of seven links?
- A. 1
- B. 4
- C. 7
- D. 14

> **Official Correct Answer**: **C** — C: 7  
> **Technical Explanation**: In an STP network, every network segment (link) will have one designated port. With seven links, there will be seven designated ports.


---

### Question 10: Which STP port role points away from the root bridge and is in a forwarding state?
- A. Designated
- B. Non-designated
- C. Root

> **Official Correct Answer**: **A** — A: Designated  
> **Technical Explanation**: STP root and designated ports are in a forwarding state once the LAN has converged. Root ports point toward the root bridge; they provide each switch’s active path to the root bridge. Designated ports, on the other hand, point away from the root bridge. Each root port always connects to a designated port.


---

### Question 11: Which command is most likely to ensure that a switch becomes the root bridge for VLAN 1?
- A. **spanning-tree vlan 1 root primary**
- B. **spanning tree vlan 1 root 0**
- C. **spanning-tree vlan 1 priority root**
- D. **spanning-tree vlan 1 priority 0**

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: spanning-tree vlan 1 priority 0 The best way to ensure that a switch becomes the root bridge for a particular VLAN is to use **spanning-tree vlan vlan-id priority 0** to make its bridge priority 0—the lowest possible value. This way, it can only be usurped by another switch with a lower MAC address that also has its priority set to 0.

