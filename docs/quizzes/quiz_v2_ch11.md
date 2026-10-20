# Assessment & Review: Volume 2 Chapter 11 - Chapter 11: Security concepts

### Question 1: Which element of the CIA triad aims to protect systems and data from unauthorized access?
- A. C
- B. I
- C. A

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: The “C” in the CIA triad stands for “Confidentiality”, which aims to protect systems and data from unauthorized access, ensuring that sensitive information is only accessible by authorized entities. The “I” stands for “Integrity”, and the “A” stands for “Availability”.


---

### Question 2: A malicious user who intends to harm the security of an organization’s systems is an example of what?
- A. Threat
- B. Exploit
- C. Vulnerability
- D. Mitigation technique

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: A malicious user intent on harming an organization’s systems is an example of a threat—the real possibility of a vulnerability to be exploited. 3. A DHCP exhaustion attack is an example of which attack types? (select two) A: Spoofing B: DoS A DHCP exhaustion attack involves spoofing DHCP requests to exhaust the IP address pool of a DHCP server, leading to a Denial of Service (DoS) for legitimate users who cannot obtain IP addresses. 4. Which of the following are examples of social engineering? (select three) B: Whaling D: Phishing E: Tailgating Phishing involves tricking users into revealing sensitive information, and whaling is phishing targeted at highprofile individuals (i.e. a CEO). Tailgating is the act of following someone into a secured area. These are all forms of social engineering, which manipulates people into breaking normal security procedures.


---

### Question 3: A DHCP exhaustion attack is an example of which attack types? (select two)
- A. Spoofing
- B. DoS
- C. Man-in-the-middle
- D. Reflection

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 4: Which of the following are examples of social engineering? (select three)
- A. Backdoor
- B. Whaling
- C. Trojan horse
- D. Phishing
- E. Tailgating
- F. Ransomware

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 5: Which of the following are examples of physical access control? (select two)
- A. MFA door locks
- B. User education programs
- C. Phishing awareness email campaigns
- D. Security cameras
- E. Secure device passwords

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Multi-factor authentication (MFA) door locks and security cameras are examples of physical access controls. They are used to secure physical premises by controlling entry and monitoring physical activities. 6. Which of the following are common advantages of using a password manager? (select three) B: Stronger passwords C: Auto-fill D: Encrypted storage Password managers allow users to generate and store long, complex, and unique passwords for each account without having to remember each one, encouraging stronger passwords. The ability to automatically fill in usernames/passwords can protect against keylogger malware. Furthermore, password managers encrypt stored passwords, protecting the passwords even if the device is compromised.


---

### Question 6: Which of the following are common advantages of using a password manager? (select three)
- A. Integrated physical access control
- B. Stronger passwords
- C. Auto-fill
- D. Encrypted storage
- E. Integrated anti-malware
- F. Protection against social engineering

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 7: Which of the following commands configures an enable secret using type-9 hashing?
- A. enable algorithm-type scrypt secret AcingTheCCNAExam!
- B. enable algorithm-type md5 secret AcingTheCCNAExam!
- C. enable algorithm-type sha256 secret AcingTheCCNAExam!
- D. enable algorithm-type md9 secret AcingTheCCNAExam!

> **Official Correct Answer**: **A** — A: enable algorithm-type scrypt secret AcingTheCCNAExam!  
> **Technical Explanation**: typescript The command to configure an enable secret with a specific hashing algorithm is enable algorithm-type algorithm secret secret . The scrypt algorithm (Cisco’s recommendation), is type 9.


---

### Question 8: Which of the following is an example of MFA?
- A. Entering a username/password and a PIN
- B. Performing a fingerprint scan and a retina scan
- C. Scanning a badge and entering a PIN
- D. Scanning a badge and tapping a phone notification

> **Official Correct Answer**: **C** — C: Scanning a badge and entering a PIN  
> **Technical Explanation**: MFA involves verifying a user’s identity via at least two “factors”: knowledge (something you know), possession (something you have), and inherence (something you are). A badge is an example of something you have, and a PIN is an example of something you know.


---

### Question 9: Which of the following provides PNAC?
- A. NGFW
- B. NGIPS
- C. 802.1X
- D. AAA

> **Official Correct Answer**: **C** — C: 802.1X  
> **Technical Explanation**: 802.1X is a security protocol that provides port-based network access control (PNAC), ensuring that only authenticated devices can access network resources.


---

### Question 10: Which AAA element consists of granting a user or device appropriate access?
- A. Accounting
- B. Authentication
- C. Authorization
- D. Access

> **Official Correct Answer**: **C** — C: Authorization  
> **Technical Explanation**: AAA stands for Authentication, Authorization, and Accounting. Authentication is the process of verifying identity, authorization is the process of granting appropriate access, and accounting is the process of keeping track of activities.


---

### Question 11: Which AAA protocol combines authentication and authorization into a single operation?
- A. ISE
- B. RADIUS
- C. TACACS+
- D. AAA+

> **Official Correct Answer**: **B** — B: RADIUS  
> **Technical Explanation**: Remote Authentication Dial-In User Service (RADIUS) is an AAA protocol that combines authentication and authorization into a single operation, unlike Terminal Access Controller Access-Control System Plus (TACACS+), which keeps all three AAA components separate.


---

### Question 12: Which of the following is an example of stateless packet filtering?
- A. NGFW
- B. An ACL applied to a router interface
- C. NGIPS
- D. UDP

> **Official Correct Answer**: **B** — B: An ACL applied to a router interface  
> **Technical Explanation**: Stateless packet filtering, such as an ACL applied to a router interface, filters packets on a per-packet basis without considering other context such as the packet’s relation to other packets.


---

### Question 13: Which component of 802.1X is the network device that the client connects to?
- A. Supplicant
- B. Gateway
- C. Authentication server
- D. Authenticator

> **Official Correct Answer**: **D** — D: Authenticator  
> **Technical Explanation**: 802.1X defines three roles: the supplicant (the client device that wants to connect to the network), the authenticator (the network device that the supplicant connects to), and the authentication server (the server that verifies the supplicant’s credentials).

