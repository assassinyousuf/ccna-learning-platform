# Assessment & Review: Volume 2 Chapter 5 - Chapter 5: Secure Shell

### Question 1: Which command, when applied to a console or VTY line, requires login with a local user account to access the line?
- A. login local
- B. login
- C. local login
- D. login user

> **Official Correct Answer**: **A** — A: login local  
> **Technical Explanation**: The login local command on a console or VTY line configures the device to require users to log in with a username and password in the device’s local user database.


---

### Question 2: Which command can be used to configure a Layer-2 switch’s default gateway?
- A. ip default-gateway 10.0.0.1
- B. ip route 0.0.0.0 0.0.0.0 10.0.0.1
- C. ip default-router 10.0.0.1
- D. default route 10.0.0.1

> **Official Correct Answer**: **A** — A: ip default-gateway 10.0.0.1  
> **Technical Explanation**: The ip default-gateway ip-address command is used to set the default gateway on a Layer-2 switch, which is necessary for the switch to communicate with devices outside of its local subnet (for example, when connecting to the switch remotely with SSH).


---

### Question 3: The output of show ip ssh states SSH Enabled - version 1.99 . What does this output mean?
- A. The device accepts SSHv1.99 connections only.
- B. The device accepts SSHv1 and SSHv1.99 connections.
- C. The device accepts SSHv2 connections only.
- D. The device accepts SSHv1 and SSHv2 connections.

> **Official Correct Answer**: **D** — D: The device accepts SSHv1 and SSHv2 connections.  
> **Technical Explanation**: There are two versions of SSH: version 1 and version 2. “Version 1.99” isn’t a separate version of SSH; instead, it means that the device accepts both SSH version 1 and version 2 connections.


---

### Question 4: Why is a domain name needed to generate an RSA key pair with the crypto key generate rsa command?
- A. Each RSA key pair is domain-specific.
- B. The domain name is used as part of the key pair’s name.
- C. The domain name determines the size of the key pair.
- D. Each RSA key pair requires a unique domain name.

> **Official Correct Answer**: **B** — B: The domain name is used as part of the key pair’s name.  
> **Technical Explanation**: A domain name is required for generating RSA key pairs because it is combined with the device hostname to name the key pair.


---

### Question 5: When generating RSA keys, what is the minimum modulus size required to support SSHv2?
- A. 512 bits
- B. 768 bits
- C. 1024 bits
- D. 1536 bits

> **Official Correct Answer**: **B** — B: 768 bits  
> **Technical Explanation**: The modulus of the RSA keys must be at least 768 bits in size to support SSHv2. Otherwise, only SSHv1 can be used. However, in newer software versions, SSH can’t be used at all with modulus sizes smaller than 2048 bits.


---

### Question 6: Which of the following commands can be used to allow only SSH connections?
- A. R1(config)# transport input ssh

|
- B. R1(config-vty)# | transport input ssh |
| --- | --- |
|
- C. R1(config-if)# | transport input ssh |
|
- D. R1(config-line)# | transport input ssh |

> **Official Correct Answer**: **D** — D: R1(config-line)# transport input ssh  
> **Technical Explanation**: The transport input ssh command, when applied to VTY lines (using line vty 0 15 ), specifies that only SSH connections are allowed to the device—no Telnet.


---

### Question 7: Which command can be used to apply an ACL to the VTY lines?
- A. access-class 1 in
- B. access-group 1 in
- C. access-list 1 in
- D. ip access-group 1 in

> **Official Correct Answer**: **A** — A: access-class 1 in  
> **Technical Explanation**: Use access-class acl in to apply an ACL to the VTY lines to control remote access to the device. This filters incoming connections, limiting which hosts can connect to the device.


---

### Question 8: In addition to a domain name, what configuration might be required to generate RSA keys with crypto key generate rsa ?
- A. A VTY line password
- B. A management interface
- C. A non-default hostname
- D. A DNS server

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: A non-default hostname In some devices, in addition to a domain name, a non-default hostname is also required to generate RSA keys with crypto key generate rsa .

