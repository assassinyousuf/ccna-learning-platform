# Assessment & Review: Volume 2 Chapter 9 - Chapter 9: Network Address Translation

### Question 1: Which of the following NAT types provide one-to-one translations only?
- A. Static NAT and dynamic PAT
- B. Static NAT
- C. Dynamic NAT
- D. Static NAT and dynamic NAT

> **Official Correct Answer**: **D** — D: Static NAT and dynamic NAT  
> **Technical Explanation**: Static NAT provides a permanent one-to-one translation between an inside local address and an inside global address. Dynamic NAT also provides one-to-one translations but assigns inside global addresses dynamically from a pool.


---

### Question 2: Which Cisco NAT term describes the IP address of a host in the internal network from the perspective of hosts in the external network?
- A. Outside global
- B. Inside global
- C. Outside local
- D. Inside local

> **Official Correct Answer**: **B** — B: Inside global  
> **Technical Explanation**: In Cisco NAT terminology, an inside global address is an IP address assigned to a host on the internal network, as seen from the external network. This address is usually a public IP address.


---

### Question 3: In a typical inside source NAT scenario, which of the following addresses is usually a private address?
- A. Outside global
- B. Inside global
- C. Outside local
- D. Inside local

> **Official Correct Answer**: **D** — D: Inside local  
> **Technical Explanation**: In a standard inside source NAT setup, the inside local address is usually a private IP address. This address is not routable on the internet and needs to be translated to a public (inside global) address for communication over the internet.


---

### Question 4: R1 must use NAT to allow hosts in its connected LAN to communicate over the internet. Which of the following commands should be used to enable this? (select two)
- A. ip nat inside on the LAN-facing interface
- B. ip nat outside on the internet-facing interface
- C. ip nat internal on the LAN-facing interface
- D. ip nat external on the internet-facing interface

> **Official Correct Answer**: **A** — A: ip nat inside on the LAN-facing interface  
> **Technical Explanation**: B: ip nat outside on the Internet-facing interface To enable NAT, use ip nat inside on the LAN-facing interface(s) and ip nat outside on the internetfacing interface(s). These commands define the interfaces’ roles in the NAT process.


---

### Question 5: Which of the following NAT types provides many-to-one translations?
- A. Static NAT
- B. Dynamic PAT
- C. Dynamic NAT

> **Official Correct Answer**: **B** — B: Dynamic PAT  
> **Technical Explanation**: Dynamic PAT, also known as NAT overload, maps multiple private IP addresses to a single public IP address, using unique port numbers to keep track of each session.


---

### Question 6: In a typical inside source NAT scenario, which of the following addresses should be identical in the output of show ip nat translations ? (select two)
- A. Inside local
- B. Inside global
- C. Outside local
- D. Outside global

> **Official Correct Answer**: **C** — C: Outside local  
> **Technical Explanation**: D: Outside global When performing inside NAT, only inside addresses are translated (inside local to inside global); the outside local and outside global addresses should be identical in the output of show ip nat translations .


---

### Question 7: Which of the following commands creates a pool for dynamic PAT?
- A. ip nat pool POOL1 203.0.113.1 203.0.113.10 netmask 255.255.255.248
- B. ip nat pool POOL1 203.0.113.1 203.0.113.10 netmask 0.0.0.15
- C. ip nat pool POOL1 203.0.113.1 203.0.113.10 prefix-length 28
- D. ip nat pool POOL1 203.0.113.1 203.0.113.10 prefix-length 29

> **Official Correct Answer**: **C** — C: ip nat pool POOL1 203.0.113.1 203.0.113.10 prefix-length 28  
> **Technical Explanation**: The command to create a NAT pool is ip nat pool name start-ip end-ip { prefix-length length netmask netmask } . Options A, C, and D use correct syntax, but options A and D specify a /29 prefix length (netmask 255.255.255.248). This only encompasses the range from 203.0.113.0 to 203.0.113.7, meaning that the commands will fail; the prefix length must be sufficient to encompass all of the addresses included in the start-ip to end-ip range.


---

### Question 8: ACL 1 only permits packets sourced from the 10.0.0.0/24 subnet. After issuing the ip nat inside source list 1 gigabitethernet0/0 command on R1, what action will it take on packets denied by ACL 1?
- A. It will forward them without translation.
- B. It will discard them.
- C. It will buffer them until they can be translated.
- D. It will translate their source IP to GigabitEthernet0/0’s IP.

> **Official Correct Answer**: **A** — A: It will forward them without translation.  
> **Technical Explanation**: In the context of NAT, an ACL is used to determine which packets are eligible for NAT; it isn’t used to decide which packets will be forwarded or discarded. Packets denied by the ACL are not translated, but will be forwarded as normal according to the router’s routing table. However, this will likely result in those untranslated packets being discarded by the ISP’s router due to their private addresses.


---

### Question 9: Which of the following commands configures dynamic PAT?
- A. ip nat inside source list 1 pool POOL1 overload
- B. ip nat inside source list 1 pool POOL1
- C. ip nat inside source list 1 pat POOL1
- D. ip nat inside source list 1 203.0.113.1 overload

> **Official Correct Answer**: **A** — A: ip nat inside source list 1 pool POOL1 overload  
> **Technical Explanation**: This command configures dynamic PAT using the specified access list and pool, with the overload keyword enabling multiple inside local addresses to share one inside global address.


---

### Question 10: When PAT is configured, what happens when two pre-translation messages use the same source port number?
- A. The second packet is dropped.
- B. The second packet is buffered until the port number becomes available.
- C. The second packet’s port number is translated to a new number.
- D. The second packet is forwarded without translation.

> **Official Correct Answer**: **C** — C: The second packet’s port number is translated to a new number.  
> **Technical Explanation**: In PAT, if two packets have the same source port, NAT will assign a unique port number for the second packet. The inside global IP address of each packet will be identical after translation, so a unique source port number is needed for identification.

