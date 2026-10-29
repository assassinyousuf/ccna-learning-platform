# Assessment & Review: Volume 2 Chapter 20 - Chapter 20: Wireless LAN security

### Question 1: Which 802.11 security protocol was developed to overcome the vulnerabilities of WEP?
- A. CCMP
- B. GCMP
- C. TKIP
- D. RC4

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Temporal Key Integrity Protocol (TKIP) was developed as an interim solution to overcome the vulnerabilities of Wired Equivalent Privacy (WEP). TKIP was implemented as part of the original Wi-Fi Protected Access (WPA) standard to provide improved security compared to WEP. TKIP uses the same underlying mechanism as WEP but includes additional features to secure wireless data transmission.


---

### Question 2: Which authentication methods are available in WEP? (select two)
- A. PSK
- B. Open System
- C. Shared Key
- D. 802.1X

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: WEP supports two authentication methods: Open System and Shared Key. Open System Authentication allows any device to authenticate and attempt to connect to the network. Shared Key Authentication uses a WEP key for authentication, requiring the client device to have the correct key before it can connect.


---

### Question 3: Which WPA3 feature protects the PSK against brute-force attacks?
- A. PMF
- B. FS
- C. EAP
- D. SAE

> **Official Correct Answer**: **D** — D: SAE  
> **Technical Explanation**: Simultaneous Authentication of Equals (SAE) is a WPA3 feature that allows the client and AP to verify that they have matching PSKs without rendering the PSK vulnerable to brute-force attacks.


---

### Question 4: Which of the following use AES counter mode encryption? (select all that apply)
- A. CCMP
- B. GCMP
- C. TKIP
- D. WEP

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Both Counter Mode with Cipher Block Chaining Message Authentication Code Protocol (CCMP) and Galois/Counter Mode Protocol (GCMP) use Advanced Encryption Standard (AES) in counter mode for encryption. CCMP is used in WPA2 for secure data encryption, while GCMP, which offers enhanced performance and security, is utilized in WPA3.


---

### Question 5: Which protocol is used to carry EAP messages between a supplicant and authenticator?
- A. 802.1X
- B. EAPoL
- C. RADIUS
- D. EAP-FAST

> **Official Correct Answer**: **B** — B: EAPoL  
> **Technical Explanation**: EAPoL (EAP over LANs) is the protocol employed by 802.1X to carry EAP (Extensible Authentication Protocol) messages between a supplicant and an authenticator.


---

### Question 6: Which WPA3 feature ensures that a compromised PSK cannot be used to decrypt past communications?
- A. PMF
- B. FS
- C. EAP
- D. SAE

> **Official Correct Answer**: **B** — B: FS  
> **Technical Explanation**: Forward Secrecy (FS), also called Perfect Forward Secrecy (PFS), is a feature of WPA3 that ensures that a compromised PSK cannot be used to decrypt past communications. This is because the encryption keys used for each session are unique and not solely derived from the PSK.


---

### Question 7: Which of the following uses 802.1X authentication?
- A. WEP
- B. TKIP
- C. WPA-Enterprise
- D. WPA-Personal

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: WPA-Enterprise WPA-Enterprise uses 802.1X authentication, which provides a more robust security framework than simple PSK-based authentication. It is typically used in enterprise environments (hence the name).


---

### Question 8: Which of the following employs SAE?
- A. WPA2-Enterprise
- B. WPA2-Personal
- C. WPA3-Enterprise
- D. WPA3-Personal

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: WPA3-Personal WPA3-Personal employs SAE for authentication. SAE enhances the security of the authentication process, protecting against brute-force attacks on the PSK.


---

### Question 9: Which protocol does the original WPA standard employ for data encryption and integrity?
- A. TKIP
- B. WEP
- C. PSK
- D. EAP

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: TKIP The original WPA standard employs TKIP for data encryption and integrity. TKIP was designed to provide a more secure alternative to WEP while being able to run on existing hardware.


---

### Question 10: Which protocol does the WPA3 standard employ for the most secure data encryption and integrity?
- A. TKIP
- B. CCMP
- C. GCMP
- D. AES

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: GCMP The WPA3 standard employs GCMP for the most secure data encryption and integrity. GCMP uses the AES counter mode encryption and Galois Message Authentication Code (GMAC) for data integrity.

