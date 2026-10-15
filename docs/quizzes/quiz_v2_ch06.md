# Assessment & Review: Volume 2 Chapter 6 - Chapter 6: Simple Network Management Protocol

### Question 1: Which SNMP message type is an unacknowledged notification from a managed device to the NMS?
- A. Inform
- B. Trap
- C. Set
- D. Notify

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: A Simple Network Management Protocol (SNMP) trap is an unacknowledged message sent from a managed device to a Network Management Station (NMS). Traps are used to notify the NMS of significant events or conditions on the managed device, but the NMS doesn’t acknowledge them with Response messages.


---

### Question 2: Which SNMP message type allows the NMS to retrieve a large amount of information from a managed device without specifying each individual OID?
- A. Get
- B. GetNext
- C. GetBulk
- D. GetRange

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: GetBulk The GetBulk message type is used to retrieve large amounts of data from a managed device. It allows the NMS to request a range of OIDs in a single message, making it more efficient than specifying each OID individually.


---

### Question 3: Which message type triggers a response from the NMS?
- A. Get
- B. Inform
- C. Set
- D. GetNext

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B: Inform An Inform message is similar to a Trap, but it requires an acknowledgment from the NMS. After receiving an Inform message, the NMS sends a Response message back to the managed device.


---

### Question 4: Which SNMP version(s) use community-string authentication? (select all that apply)
- A. SNMPv1
- B. SNMPv2
- C. SNMPv2c
- D. SNMPv3

> **Official Correct Answer**: **C** — C: SNMPv2c  
> **Technical Explanation**: ## A: SNMPv1 SNMP versions 1 and 2c use community-string authentication; a community string is basically a password. SNMPv2 (no “c”) is not widely implemented; it doesn’t use community strings. SNMPv3 uses a more advanced user-based security model.


---

### Question 5: Which of the following statements are true? (select two)
- A. The RO community string allows the NMS to send Get/GetNext/GetBulk and Set messages.
- B. The RW community string allows the NMS to send Get/GetNext/GetBulk and Set messages.
- C. The RW community string allows the NMS to send Set messages only.
- D. The RO community string allows the NMS to send Get/GetNext/GetBulk messages only.

> **Official Correct Answer**: **B** — B: The RW community string allows the NMS to send Get/GetNext/GetBulk and Set messages.  
> **Technical Explanation**: D: The RO community string allows the NMS to send Get/GetNext/GetBulk messages only. The read-only (RO) community string only allows the NMS to read information from the managed device with Get, GetNext, and GetBulk; it can’t modify the managed device with Set messages. The read-write (RW) community string, on the other hand, allows Get, GetNext, GetBulk, and Set messages.


---

### Question 6: Where does an SNMP managed device store OIDs?
- A. The RIB
- B. The IMDB
- C. The MIB
- D. The OIDB

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: The MIB Object Identifiers (OIDs) in SNMP are stored in a database called the Management Information Base (MIB) of a managed device. Each OID is a variable containing a value, and SNMP works by interacting with these variables and their values.


---

### Question 7: Which of the following statements are true? (select two)
- A. SNMP managers listen on UDP port 161.
- B. SNMP managers listen on UDP port 162.
- C. SNMP agents listen on UDP port 161.
- D. SNMP agents listen on UDP port 162.

> **Official Correct Answer**: **B** — B: SNMP managers listen on UDP port 162.  
> **Technical Explanation**: ## C: SNMP agents listen on UDP port 161. SNMP agents, running on managed devices, listen on UDP port 161 for incoming SNMP messages from the SNMP manager, running on the NMS. The SNMP manager listens on UDP port 162 for messages from the SNMP agents running on the devices it manages.


---

### Question 8: Which SNMP versions support a user-based security model? (select all that apply)
- A. SNMPv1
- B. SNMPv2
- C. SNMPv2c
- D. SNMPv3

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: SNMPv3 SNMPv3 is the only version of SNMP that supports a user-based security model, which provides a more secure framework than the simple community-string authentication used in SNMPv1 and SNMPv2c.

