# Assessment & Review: Volume 2 Chapter 13 - Chapter 13: DHCP Snooping

### Question 1: Which DHCP messages are always discarded when received on a DHCP Snooping untrusted port?
- A. ACK, REQUEST
- B. DISCOVER, OFFER
- C. ACK, OFFER
- D. REQUEST, DISCOVER

> **Official Correct Answer**: **C** — C: ACK, OFFER  
> **Technical Explanation**: DHCP Snooping always discards DHCP server messages received on untrusted ports. In the DHCP DORA (DISCOVER, OFFER, REQUEST, ACK) exchange, the OFFER and ACK messages are sent by the server, and will always be discarded if received on a DHCP Snooping untrusted port.


---

### Question 2: Which table is used by DHCP Snooping to inspect client DHCP RELEASE and DECLINE messages?
- A. The DAI table
- B. The DHCP binding table
- C. The DHCP Snooping binding table
- D. The ARP table

> **Official Correct Answer**: **C** — C: The DHCP Snooping binding table  
> **Technical Explanation**: The DHCP Snooping binding table holds information about successful DHCP leases that were observed by the DHCP Snooping-enabled switch. This table is then used to inspect and validate DHCP RELEASE and DECLINE messages received on untrusted ports.


---

### Question 3: Which command disables option 82 insertion on untrusted ports?
- A. no ip dhcp snooping option 82
- B. no ip dhcp snooping information option
- C. no ip dhcp snooping insert 82
- D. no ip dhcp snooping information insert

> **Official Correct Answer**: **B** — B: no ip dhcp snooping information option  
> **Technical Explanation**: The no ip dhcp snooping information option command disables the insertion of DHCP option 82 into messages received on untrusted ports. This is often necessary when configuring DHCP Snooping to allow clients to successfully lease addresses.


---

### Question 4: Which of the following statements is true?
- A. DHCP Snooping doesn’t work when a relay agent is used.
- B. DHCP Snooping inspects messages received on trusted ports.
- C. DHCP Snooping is enabled by default if DHCP is used.
- D. DHCP Snooping must be enabled globally and per-VLAN.

> **Official Correct Answer**: **D** — D: DHCP Snooping must be enabled globally and per-VLAN.  
> **Technical Explanation**: Enabling DHCP Snooping requires two commands: ip dhcp snooping to enable it globally, and then ip dhcp snooping vlan vlans to enable it on each VLAN. Without both commands, DHCP Snooping won’t function on the switch.


---

### Question 5: How does DHCP Snooping treat a DHCP message received on a trusted port?
- A. It allows the message.
- B. It allows the message if it is a DHCP server message.
- C. It allows the message if it is a DHCP client message.
- D. It inspects the message to decide which action to take.

> **Official Correct Answer**: **A** — A: It allows the message.  
> **Technical Explanation**: DHCP Snooping allows all DHCP messages received on trusted ports; it only inspects messages received on untrusted ports.


---

### Question 6: Which of the following messages are sent by DHCP clients? (select four)
- A. NAK
- B. REQUEST
- C. ACK
- D. OFFER
- E. RELEASE
- F. DISCOVER H. DECLINE

> **Official Correct Answer**: **B** — B: REQUEST  
> **Technical Explanation**: E: RELEASE F: DISCOVER G: DECLINE In addition to the DISCOVER and REQUEST messages sent in the DORA exchange, DHCP clients can also send RELEASE and DECLINE messages. OFFER, ACK, and NAK are server messages.


---

### Question 7: What does DHCP Snooping provide in addition to DHCP message inspection?
- A. Automated DHCP pool configuration
- B. Rate-limiting of DHCP messages
- C. Inspection of standard data frames
- D. Client credential authentication

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B: Rate-limiting of DHCP messages DHCP Snooping provides rate-limiting of DHCP messages to prevent DHCP starvation attacks. It can be enabled on a per-port basis with ip dhcp snooping limit rate pps .


---

### Question 8: Which two fields does DHCP Snooping inspect in client DISCOVER and REQUEST messages?
- A. Source MAC and chaddr
- B. Source MAC and source IP
- C. Source MAC and destination MAC
- D. Destination MAC and destination IP

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: Source MAC and chaddr DISCOVER and REQUEST messages are sent before the client has successfully leased an IP address, so the client doesn’t have an entry in the DHCP Snooping binding table yet. To inspect and validate these messages, the switch ensures that the Ethernet source MAC address and the “chaddr” (client hardware address) field of the DHCP message match.

