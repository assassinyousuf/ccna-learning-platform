# Assessment & Review: Volume 1 Chapter 15 - Chapter 15: Rapid Spanning Tree Protocol

### Question 1: The output of **show spanning–tree** on a Cisco switch states Spanning tree enabled protocol ieee.  Which version of STP is the switch running?
- A. IEEE-standard Rapid STP
- B. Rapid PVST+
- C. IEEE-standard STP
- D. PVST+

> **Official Correct Answer**: **D** — D: PVST+  
> **Technical Explanation**: Spanning tree enabled protocol ieee means that the switch is running Cisco’s Per-VLAN Spanning Tree Plus (PVST+), not IEEE-standard STP. If the switch is running Rapid PVST+, it will state Spanning tree enabled protocol rstp. Cisco switches don’t run the IEEE-standard versions of these protocols.


---

### Question 2: You configure **spanning-tree pathcost method long** on a Cisco switch.  Which of the following accurately represent the default port costs after issuing that command? (select two)
- A. 1 Tbps: 2
- B. 10 Gbps: 2,000
- C. 10 Mbps: 20,000,000
- D. 100 Mbps: 200,000

> **Official Correct Answer**: **B** — B: 10 Gbps: 2,000  
> **Technical Explanation**: D: 100 Mbps: 200,000 The long port costs are: 10 Mbps = 2,000,000, 100 Mbps = 200,000, 1 Gbps = 20,000, 10 Gbps = 2,000, 100 Gbps = 200, 1 Tbps = 20, and 10 Tbps = 2.


---

### Question 3: If the RSTP sync mechanism succeeds, how long does it take for a port to transition from the discarding state to the forwarding state?
- A. 6 seconds
- B. 15 seconds
- C. 30 seconds
- D. It transitions immediately.

> **Official Correct Answer**: **D** — D: It transitions immediately.  
> **Technical Explanation**: In RSTP, when the sync mechanism succeeds, a port can transition from the discarding state to the forwarding state immediately, bypassing the 30 second wait that is necessary in classic STP. This is the primary advantage of RSTP.


---

### Question 4: SW1 G0/1 is not a root port or a designated port, and SW1 is not the designated bridge for the segment G0/1 is connected to.  What is SW1’s G0/1’s RSTP port role?
- A. Alternate
- B. Backup
- C. Non-designated

> **Official Correct Answer**: **A** — A: Alternate  
> **Technical Explanation**: In RSTP, a port that is neither a root port nor a designated port, and is not the designated bridge for its segment, is an alternate port. Alternate ports provide an alternate path to the root bridge and remain in a discarding state while they are not needed.


---

### Question 5: Which RSTP port type will not trigger a topology change notification if the port’s status changes?
- A. Point-to-point
- B. Shared
- C. Edge
- D. Backup

> **Official Correct Answer**: **C** — C: Edge  
> **Technical Explanation**: An edge port in RSTP connects to an end device (like a PC or server)—not to another switch. If an edge port’s status changes (goes up or down), it does not trigger a topology change notification because it does not affect the RSTP topology among the switches.


---

### Question 6: If the RSTP root bridge has two ports connected to the same segment via a hub, what will the role be of the port that is not designated?
- A. Root
- B. Alternate
- C. Blocking
- D. Backup

> **Official Correct Answer**: **D** — D: Backup  
> **Technical Explanation**: In RSTP, if the root bridge has multiple ports connected to the same segment via a hub, one port will be the designated port and the others will be backup ports. The backup port role is used for ports that provide a redundant path to the same segment as another port on the same switch. This is an exception to the general rule that all ports on the root bridge must be designated. ## 7.  Which command configures the RSTP edge link type on a port? ## B: spanning-tree portfast The **spanning-tree portfast** command is used to configure an RSTP edge port. Unlike the point-to-point and shared link types, you cannot use the **spanning-tree link-type** command to configure an edge port.


---

### Question 7: Which command configures the RSTP edge link type on a port?
- A. **spanning-tree link-type edge**
- B. **spanning-tree portfast**
- C. **spanning-tree link-type portfast**
- D. **spanning-tree edge**

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 8: SW1’s G0/1 port is in the up/up state but has stopped receiving BPDUs from its RSTP neighbor. How long will SW1 wait before reacting and initiating a topology change?
- A. 6 seconds
- B. 15 seconds
- C. 20 seconds
- D. 30 seconds

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: 6 seconds In RSTP, if a switch stops receiving BPDUs on a port, it waits for three times the Hello time before initiating a topology change. The default Hello time is 2 seconds, so the switch will wait 6 seconds (3\*2 seconds) before reacting and initiating a topology change. Note that the switch will only wait 6 seconds if the port remains up/up; if a hardware failure or something else causes the port to go down, the switch will react immediately—no need to wait 6 seconds.


---

### Question 9: Which RSTP link type is default on full-duplex ports?
- A. Full
- B. Shared
- C. Point-to-point
- D. Independent

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: Point-to-point Full-duplex ports use the RSTP point-to-point link type by default; this is the only link type that can use RSTP’s sync mechanism for rapid convergence. This link type should be used for direct connections between two switches.


---

### Question 10: Four switches are interconnected, with a total of six links between them. How many of each RSTP port role are there?
- A. 4 root, 4 designated, 4 alternate
- B. 3 root, 6 designated, 3 alternate
- C. 3 root, 3 designated
- D. 3 root, 3 designated, 6 alternate

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B: 3 root, 6 designated, 3 alternate Because there are 6 links, there are a total of 12 ports (2 connected to each link). There are 4 switches, and each non-root switch must have 1 root port, so there are 3 root ports. Each link must have one designated port, so there are 6 designated ports. The remaining ports are alternate ports - they enter the discarding state to prevent loops. So, there are 3 alternate ports. There are no backup ports; hubs are extremely rare in modern networks, and no hubs are mentioned in the question.


---

### Question 11: Which optional STP feature disables a port if it stops receiving BPDUs?
- A. BPDU Guard
- B. BPDU Filter
- C. Root Guard
- D. Loop Guard

> **Official Correct Answer**: **D** — D: Loop Guard  
> **Technical Explanation**: When a Loop Guard-enabled port stops receiving BPDUs, it will enter the loop-inconsistent state, effectively disabling the port. This protects against loops caused by a port erroneously transitioning to the forwarding state.


---

### Question 12: BPDU Filter has been enabled globally for all PortFast-enabled ports.  What happens when one of the BPDU Filter-enabled ports receives a BPDU?
- A. PortFast and BPDU Filter are disabled on the port.
- B. The port is error-disabled.
- C. The port ignores the BPDU.
- D. The port enters the discarding state.

> **Official Correct Answer**: **A** — A: PortFast and BPDU Filter are disabled on the port.  
> **Technical Explanation**: BPDU Filter can be enabled in two ways: in interface config mode with **spanning-tree bpdufilter enable**, or globally on all PortFastenabled ports with **spanning-tree portfast bpdufilter default**. When enabled in interface config mode, the port doesn’t send BPDUs and ignores all received BPDUs. When enabled globally, the port doesn’t send BPDUs, but if it receives a BPDU, PortFast and BPDU Filter will be disabled; the port then operates as a normal STP or RSTP port.

