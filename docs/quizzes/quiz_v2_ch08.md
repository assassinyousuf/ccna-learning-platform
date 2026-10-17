# Assessment & Review: Volume 2 Chapter 8 - Chapter 8: Trivial File Transfer Protocol and File Transfer Protocol

### Question 1: Why does TFTP use UDP, not TCP?
- A. TFTP is a real-time application that is sensitive to delay.
- B. TFTP is a simple query/response protocol that doesn’t need the overhead of setting up a connection.
- C. TFTP provides its own reliability and doesn’t need TCP’s overhead.
- D. TFTP only sends trivial files that don’t need reliable data delivery.

> **Official Correct Answer**: **C** — C: TFTP provides its own reliability and doesn’t need TCP’s overhead.  
> **Technical Explanation**: Although file transfer protocols typically use TCP to provide reliable delivery of messages, the TFTP protocol itself uses lock-step communication to provide its own reliability. For that reason, it can use the lightweight UDP as its Layer-4 protocol instead of TCP.


---

### Question 2: Which type of IOS file system is used to represent external FTP/TFTP servers?
- A. Opaque
- B. File
- C. External
- D. Network

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: Network Cisco IOS uses the ftp: and tftp: file systems to represent external FTP/TFTP servers. Both file systems use the “network” file system type.


---

### Question 3: Which of the following is a characteristic of TFTP?
- A. Requires user credentials
- B. Clients can only issue read or write requests
- C. Establishes two connections between the client and server
- D. Clients can navigate through a server’s file directories

> **Official Correct Answer**: **B** — B: Clients can only issue read or write requests  
> **Technical Explanation**: Unlike FTP, which provides more robust capabilities, TFTP is a simple protocol that only allows clients to send read requests (to download a file) and write requests (to upload a file) to the server.


---

### Question 4: Which command can be used to transfer a file from the local device to an external FTP server?
- A. copy ftp: flash:
- B. copy flash: ftp:
- C. transfer ftp: flash:
- D. transfer flash: ftp:

> **Official Correct Answer**: **B** — B: copy flash: ftp:  
> **Technical Explanation**: The IOS command to transfer files is copy source destination . To transfer a file from the local device to an external FTP server, the source should be a file or directory on the local system (i.e. flash: ) and the destination should be ftp: .


---

### Question 5: Which of the following are characteristics of FTP? (select two)
- A. Provides reliable delivery at the Application Layer
- B. Establishes two connections between the client and server
- C. Uses TCP ports 20 and 21
- D. Provides encrypted file transfers

> **Official Correct Answer**: **B** — B: Establishes two connections between the client and server  
> **Technical Explanation**: C: Uses TCP ports 20 and 21 FTP establishes two connections between the client and server. The first is the control connection (TCP port 21), through which the server authenticates the client and the client sends commands to the server. The second is the data connection (TCP port 20), through which file transfers occur. With a single control connection, the client can establish multiple data connections with the server.


---

### Question 6: Which command can be used to specify which IOS file will be loaded upon the next system reboot?
- A. R1(config)# boot file
- B. R1(config)# boot system
- C. R1# boot file
- D. R1# boot system

> **Official Correct Answer**: **B** — B: R1(config)# boot system  
> **Technical Explanation**: The boot system file-path command, used in global configuration mode, is used to specify the IOS file that the device should load upon the next reboot.


---

### Question 7: Which commands configure the default FTP user credentials? (select two)
- A. ip ftp login jeremy
- B. ip ftp username jeremy
- C. ip ftp password password123
- D. ip ftp secret password123

> **Official Correct Answer**: **B** — B: ip ftp username jeremy  
> **Technical Explanation**: C: ip ftp password password123 The commands ip ftp username username and ip ftp password password are used to configure the default username and password for FTP connections initiated from the device.


---

### Question 8: Which connection does an FTP client use to send commands to the server?
- A. The control connection
- B. The command connection
- C. The data connection
- D. The transfer connection

> **Official Correct Answer**: **A** — A: The control connection  
> **Technical Explanation**: The client uses the FTP control connection to send commands to the server. One example is RETR (retrieve), which is used to download a copy of a file from the server.

