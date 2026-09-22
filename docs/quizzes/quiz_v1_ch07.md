# Assessment & Review: Volume 1 Chapter 7 - Chapter 7: IPv4 addressing

### Question 1: What bit pattern is found at the beginning of an IPv4 packet?
- A. 0110
- B. 0100
- C. 1000
- D. 0001

> **Official Correct Answer**: **B** — B: 0100  
> **Technical Explanation**: The first field of the IPv4 header is the four-bit Version field, which indicates the IP version of the packet. IP version 4 is indicated with 0b0100 (which is equal to 0d4).


---

### Question 2: What is indicated by the Total Length field of the IPv4 header?
- A. The length of the Frame
- B. The length of the Packet
- C. The length of the IPv4 header
- D. The length of the Ethernet header and trailer

> **Official Correct Answer**: **B** — B: The length of the Packet  
> **Technical Explanation**: The Total Length field in the IPv4 header specifies the entire packet’s length, including both the header and the encapsulated payload, in bytes.


---

### Question 3: Which field of the IPv4 header is used to prevent packets infinitely looping around the network?
- A. DSCP
- B. ECN
- C. IHL
- D. TTL

> **Official Correct Answer**: **D** — D: TTL  
> **Technical Explanation**: The Time To Live (TTL) field in the IPv4 header is used to prevent packets from looping infinitely around the network. The TTL value is decremented by one by each router that forwards the packet. If the TTL reaches zero, the packet is discarded.


---

### Question 4: Which netmask is equivalent to a /16 prefix length?
- A. 255.0.0.0
- B. 255.255.0.0
- C. 255.255.255.0
- D. 255.255.255.255

> **Official Correct Answer**: **B** — B: 255.255.0.0  
> **Technical Explanation**: A /16 prefix length is indicated with a netmask consisting of 16 1s followed by 16 0s: 11111111.11111111.00000000.00000000, which is 255.255.0.0 in dotted decimal.


---

### Question 5: In the output of **show ip interface brief**, what are the default Status and Protocol of a Cisco router interface?
- A. administratively down/down
- B. down/down
- C. up/down
- D. up/up

> **Official Correct Answer**: **A** — A: administratively down/down  
> **Technical Explanation**: Cisco router interfaces have the **shutdown** command applied by default, which means they will be in the “administratively down/down” state. To enable a router interface, use **no shutdown** on the interface.


---

### Question 6: A PC’s IP address is 172.16.12.27/24.  What is the first usable address of its network?
- A. 172.16.12.0
- B. 172.16.12.1
- C. 172.16.12.254
- D. 172.16.12.255

> **Official Correct Answer**: **B** — B: 172.16.12.1  
> **Technical Explanation**: With a /24 prefix length, the network address of the network is 172.16.12.0—a reserved address. The first usable address is the next address, 172.16.12.1.


---

### Question 7: Which of the following is a loopback address?
- A. 203.0.113.107
- B. 192.0.5.50
- C. 127.20.67.1
- D. 10.11.11.10

> **Official Correct Answer**: **C** — C: 127.20.67.1  
> **Technical Explanation**: In IPv4, the address range 127.0.0.0/8 (127.0.0.0–127.255.255.255) is reserved for loopback addresses, used to test network functionality on the local host.


---

### Question 8: Which of the following commands configures an IPv4 address on a router’s interface?
- A. R1(config)# **ipv4 address 10.0.0.1 255.255.255.0**
- B. R1(config)# **ip address 10.0.0.1 255.255.255.0**
- C. R1(config-if)# **ipv4 address 10.0.0.1 255.255.255.0**
- D. R1(config-if)# **ip address 10.0.0.1 255.255.255.0**

> **Official Correct Answer**: **D** — D: R1(config-if)# **ip address 10.0.0.1 255.255.255.0**  
> **Technical Explanation**: The command to configure an IPv4 address on a router’s interface is **ip address ip-address netmask** in interface config mode.

