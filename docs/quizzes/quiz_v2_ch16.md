# Assessment & Review: Volume 2 Chapter 16 - Chapter 16: WAN architectures

### Question 1: In which type of MPLS VPN do CE routers form neighbor relationships directly with other CE routers (i.e. with OSPF)?
- A. L2VPN
- B. L3VPN

> **Official Correct Answer**: **A** — A: L2VPN  
> **Technical Explanation**: In a Multiprotocol Label Switching (MPLS) Layer-2 VPN (L2VPN), CE (customer edge) routers form neighbor relationships directly with each other. The service provider’s WAN network is transparent to the CE routers, functioning like a giant switch.


---

### Question 2: In which type of MPLS VPN do CE routers form neighbor relationships with PE routers?
- A. L2VPN
- B. L3VPN

> **Official Correct Answer**: **B** — B: L3VPN  
> **Technical Explanation**: In an MPLS Layer-3 VPN (L3VPN), CE routers form neighbor relationships with provider edge (PE) routers. Unlike in MPLS L2VPNs, the PE routers actively participate in the customer’s routing domain.


---

### Question 3: In an MPLS WAN, which of the following routers run MPLS? (select all that apply)
- A. P
- B. PE
- C. CE

> **Official Correct Answer**: **A** — A: P  
> **Technical Explanation**: B: PE In an MPLS WAN, only the service provider’s routers run MPLS: the P and PE routers. The CE routers connect to the PE routers, but don’t run MPLS themselves.


---

### Question 4: Where is the MPLS label inserted into a message?
- A. Before the Ethernet header
- B. Between the Ethernet and IP headers
- C. Between the IP and TCP/UDP headers
- D. After the TCP/UDP headers

> **Official Correct Answer**: **B** — B: Between the Ethernet and IP headers  
> **Technical Explanation**: The MPLS label is inserted between the Ethernet and IP headers. For this reason, MPLS is sometimes called a “Layer 2.5” protocol.


---

### Question 5: Which technology facilitates a full mesh of IPsec VPN tunnels with minimal manual configuration?
- A. MPLS
- B. DSL
- C. TLS
- D. DMVPN

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: DMVPN allows the creation of a dynamic full mesh of IPsec VPN tunnels with minimal manual configuration, simplifying the VPN setup for networks with many sites.


---

### Question 6: Which type of VPN establishes a tunnel between an end host and a corporate firewall or router?
- A. Site-to-site VPN
- B. Host-based VPN
- C. Remote-access VPN
- D. Secure-access VPN

> **Official Correct Answer**: **C** — C: Remote-access VPN  
> **Technical Explanation**: A remote-access VPN establishes a secure tunnel between an end host (like a remote employee’s device) and a corporate firewall or router, allowing secure access to internal network resources.


---

### Question 7: Which of the following protocols is most often used for site-to-site VPNs?
- A. IPsec
- B. TLS
- C. GRE
- D. CAPWAP

> **Official Correct Answer**: **A** — A: IPsec  
> **Technical Explanation**: IPsec is commonly used for site-to-site VPNs, providing secure tunnels between routers or firewalls at the edge of their respective LANs.


---

### Question 8: Which VPN technology is often used for its combination of broadcast/multicast support and security?
- A. GRE
- B. IPsec
- C. GRE over IPsec
- D. PPP
- A. Tunneling is the process of encapsulating a packet inside of another packet, creating a virtual pathway for the internal packet.
- B. Tunneling is the process of encrypting data for secure transmission across a network.
- C. Tunneling is a technique that limits the number of broadcast messages in the network.
- D. Tunneling is the process of encapsulating a TCP segment in an IP header for transmission across a network.

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: GRE over IPsec Generic Routing Encapsulation (GRE) over IPsec is used for its ability to encapsulate a variety of network layer protocols and support broadcast/multicast traffic while providing the security of IPsec.


---

### Question 9: Which of the following statements accurately describes tunneling?
- A: Tunneling is the process of encapsulating a packet inside of another packet, creating a virtual pathway for the internal packet.
- Option B
- Option C
- Option D

> **Official Correct Answer**: **A** — A: Tunneling is the process of encapsulating a packet inside of another packet, creating a virtual pathway for the internal packet.  
> **Technical Explanation**: Tunneling involves encapsulating one packet within another to create a virtual pathway through a network. Tunnels are not necessarily encrypted (for example, GRE is unencrypted), but encryption is often used to create a secure VPN tunnel over a shared network.


---

### Question 10: Which internet connection design offers one connection to each of two or more ISPs?
- A. Dual-homed
- B. Multi-homed
- C. Single-homed
- D. Dual multi-homed

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B: Multi-homed Single-homed offers one connection to one ISP. Dual-homed offers two connections to one ISP. Multi-homed offers one connection to each of two (or more) ISPs. Dual multi-homed offers two connections to each of two (or more) ISPs.

