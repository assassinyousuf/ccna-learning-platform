# Assessment & Review: Volume 1 Chapter 10 - Chapter 10: The life of a packet

### Question 1: Which of the following statements is true about a message traversing multiple network hops to reach its final destination?
- A. The message’s destination IP address remains the same at each hop, but its destination MAC address changes.
- B. The message’s destination IP address and MAC address remain the same at each hop.
- C. The message’s destination IP address changes at each hop, but its destination MAC address remains the same.
- D. The message’s destination IP address and MAC address change at each hop.

> **Official Correct Answer**: **A** — A: The message’s destination IP address remains the same at each hop, but its destination MAC address changes.  
> **Technical Explanation**: As a message travels across multiple network hops to reach its final destination, the destination IP address remains constant throughout its journey. However, the destination MAC address changes at each hop. Each router changes the destination MAC address to that of the next hop on its path to the final destination.


---

### Question 2: Which of the following tables maps MAC addresses to physical ports?
- A. ARP table
- B. MAC address table
- C. Routing table

> **Official Correct Answer**: **B** — B: MAC address table  
> **Technical Explanation**: A switch’s MAC address table maps MAC addresses to physical ports. When a frame arrives at a switch, the switch uses this table to determine the port that the frame should be forwarded out of.


---

### Question 3: A router receives a packet destined for 10.0.0.1. The most specific matching route’s next-hop IP address is 172.16.12.2.  Which IP address will the router send an ARP request to?
- A. 10.0.0.1
- B. 172.16.12.2

> **Official Correct Answer**: **B** — B: 172.16.12.2  
> **Technical Explanation**: When a router forwards a packet, it needs to encapsulate the packet in a frame addressed to the next hop. To do so, it needs to send an ARP request for the next-hop IP address to determine the next hop’s MAC address (unless the router already has a corresponding entry in its ARP table).


---

### Question 4: A PC sends a packet destined for a host in a remote network.  What is the destination MAC address of the frame the PC sends out of its network port?
- A. The PC’s own MAC address
- B. The destination host’s MAC address
- C. The default gateway’s MAC address

> **Official Correct Answer**: **C** — C: The default gateway’s MAC address  
> **Technical Explanation**: When a PC sends a packet to a host in a remote network, the PC encapsulates the packet in a frame destined for the default gateway. The default gateway is responsible for routing the packet beyond the local network to reach the remote network.


---

### Question 5: Which of the following tables maps destination networks to next hops?
- A. ARP table
- B. MAC address table
- C. Routing table

> **Official Correct Answer**: **C** — C: Routing table  
> **Technical Explanation**: A router’s routing table maps destination networks to their corresponding next hops. This is how the router determines how to forward packets toward their destination.

