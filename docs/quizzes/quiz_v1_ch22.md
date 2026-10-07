# Assessment & Review: Volume 1 Chapter 22 - Chapter 22: Transmission Control Protocol and User Datagram Protocol

### Question 1: Which of the following protocol and port pairs are correct? (select three)
- A. DNS = TCP/UDP port 53
- B. SSH = TCP port 23
- C. HTTPS = TCP port 80
- D. Syslog = TCP port 514
- E. DHCP server = UDP port 67
- F. DHCP client = UDP port 68

> **Official Correct Answer**: **A** — A: DNS = TCP/UDP port 53  
> **Technical Explanation**: E: DHCP server = UDP port 67 F: DHCP client = UDP port 68 DNS uses both TCP and UDP on port 53. DHCP servers use UDP port 67, and DHCP clients use UDP port 68. SSH uses TCP port 22 (not 23), HTTPS uses TCP port 443 (not 80), and Syslog typically uses UDP port 514.


---

### Question 2: Which TCP field does a host use to indicate how much data it can receive before sending an ACK?
- A. Maximum Segment Size
- B. Acknowledgment Number
- C. Sequence Number
- D. Window Size

> **Official Correct Answer**: **D** — D: Window Size  
> **Technical Explanation**: The Window Size field in the TCP header specifies the amount of data the sender can transmit before it must receive an acknowledgment from the receiving host.


---

### Question 3: Which of the following is provided by TCP, but not UDP?
- A. Best-effort communication
- B. Data sequencing
- C. Session multiplexing
- D. Error detection

> **Official Correct Answer**: **B** — B: Data sequencing  
> **Technical Explanation**: TCP provides data sequencing, ensuring that packets arrive in the correct order. UDP, being a simpler and more lightweight protocol, does not provide this feature. Both protocols support error detection (both headers include a “Checksum” field for that purpose), but only TCP ensures reliable delivery and ordered data sequencing.


---

### Question 4: In which of the following cases is UDP usually preferred? (select two)
- A. When reliable delivery of messages is required.
- B. Real-time applications
- C. Simple query/response protocols
- D. File transfer protocols

> **Official Correct Answer**: **B** — B: Real-time applications  
> **Technical Explanation**: C: Simple query/response protocols UDP is often chosen for real-time applications (like streaming and online gaming) due to its lower latency, and for simple query/response protocols like DNS due to its simplicity and lower overhead. TCP is most often used for reliable data transfer, like file transfers.


---

### Question 5: What is the correct sequence of the TCP three-way handshake?
- A. SYN, ACK, SYN, ACK
- B. SYN, ACK, SYN-ACK
- C. SYN, SYN-ACK, ACK
- D. SYN, SYN, ACK

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: The TCP three-way handshake involves a SYN packet sent from the client to the server, a SYN-ACK response from the server, and finally an ACK from the client to the server.


---

### Question 6: What does the value in a TCP segment’s Acknowledgement Number field represent?
- A. The sequence number of the last segment the host received.
- B. The sequence number of the next segment the host expects to receive.
- C. The sequence number of the first segment the host received.

> **Official Correct Answer**: **B** — B: The sequence number of the next segment the host expects to receive.  
> **Technical Explanation**: The Acknowledgement Number in a TCP segment indicates the sequence number of the next expected byte from the sender, effectively acknowledging receipt of all preceding bytes.


---

### Question 7: When a client sends a request to a server, which type of port does the client typically source the request from?
- A. A registered port
- B. An ephemeral port
- C. A well-known port

> **Official Correct Answer**: **B** — B: An ephemeral port  
> **Technical Explanation**: Clients typically select a random ephemeral port for the source port when initiating communication to a server. Ephemeral ports are temporary ports assigned for the duration of the session.


---

### Question 8: Which of the following protocols use a Layer-4 protocol that provides reliable delivery of messages? (select two)
- A. Telnet
- B. NTP
- C. SNMP
- D. FTP

> **Official Correct Answer**: **A** — A: Telnet  
> **Technical Explanation**: ## D: FTP Both Telnet and FTP use TCP, which provides reliable delivery of messages. SNMP and NTP, on the other hand, use UDP, which does not provide reliable delivery.

