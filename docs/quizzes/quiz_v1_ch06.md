# Assessment & Review: Volume 1 Chapter 6 - Chapter 6: Ethernet LAN switching

### Question 1: What is the OUI of the BIA “0cf5.a452.b103”?
- A. b103
- B. 52.b103
- C. 0cf5
- D. 0cf5.a4

> **Official Correct Answer**: **D** — D: 0cf5.a4  
> **Technical Explanation**: The Organizationally Unique Identifier (OUI) is the part of the burned-in address (BUA—another name for a MAC address) that uniquely identifies the manufacturer. It consists of the first 24 bits (the first half) of the MAC address.


---

### Question 2: What is the only field of the Ethernet trailer?
- A. EtherType
- B. Destination
- C. FCS
- D. SFD

> **Official Correct Answer**: **C** — C: FCS  
> **Technical Explanation**: The only field in the Ethernet trailer is the Frame Check Sequence (FCS). The frame’s receiver uses the FCS to detect errors in the frame.


---

### Question 3: Which field of an Ethernet frame does a switch use to dynamically learn MAC addresses?
- A. FCS
- B. Type/Length
- C. Destination
- D. Source

> **Official Correct Answer**: **D** — D: Source  
> **Technical Explanation**: A switch dynamically learns MAC addresses by examining the source MAC address field of each frame it receives. It then adds the MAC address to its MAC address table, associating it with the switch port on which it received the frame.


---

### Question 4: Which of the following frames are flooded by a switch? (select two)
- A. Broadcast
- B. Unknown unicast
- C. Known unicast

> **Official Correct Answer**: **A** — A: Broadcast  
> **Technical Explanation**: B: Unknown unicast Broadcast frames are addressed to the broadcast MAC address (ffff.ffff.ffff) and are flooded out of all ports except the one the frame was received on. Unknown unicast frames are addressed to a single host, but the switch doesn’t have a matching entry in its MAC address table, so the switch floods the frame like a broadcast frame.


---

### Question 5: Which of the following statements accurately describes ARP?
- A. ARP maps a known Layer 3 address to an unknown Layer 2 address.
- B. ARP maps a known Layer 3 address to a known Layer 2 address.
- C. ARP maps an unknown Layer 3 address to an unknown Layer 2 address.
- D. ARP maps an unknown Layer 3 address to an unknown Layer 2 address.

> **Official Correct Answer**: **A** — A: ARP maps a known Layer 3 address to an unknown Layer 2 address.  
> **Technical Explanation**: Address Resolution Protocol (ARP) is used to learn the unknown MAC address of another host by sending an ARP request to the host’s known IP address.


---

### Question 6: What is the destination MAC address of an unknown unicast frame?
- A. ffff.ffff.ffff
- B. The MAC address of the frame’s destination host
- C. The MAC address of the frame’s sender

> **Official Correct Answer**: **B** — B: The MAC address of the frame’s destination host  
> **Technical Explanation**: An unknown unicast frame is addressed to a single intended recipient (not to the broadcast MAC address “ffff.ffff.ffff”). However, because the switch does not have the intended recipient’s MAC address in its table, the switch’s only option is to flood the frame.


---

### Question 7: Which utility involves ICMP echo requests and responses?
- A. ARP
- B. ping
- C. broadcasting

> **Official Correct Answer**: **B** — B: ping  
> **Technical Explanation**: The ping utility involves sending Internet Control Message Protocol (ICMP) echo requests and waiting for echo responses. It is used to test the reachability of hosts on an IP network. ## 8.  In an ARP exchange, which of the following messages is unicast? B: ARP reply In an ARP exchange, the ARP request is broadcast to all devices on the local network, but the ARP reply is a unicast message sent back to the requester with the needed MAC address information.


---

### Question 8: In an ARP exchange, which of the following messages is unicast?
- A. ARP request
- B. ARP reply
- C. A and B
- D. None of the above

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.

