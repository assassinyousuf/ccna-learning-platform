# Assessment & Review: Volume 2 Chapter 14 - Chapter 14: Dynamic ARP Inspection

### Question 1: Which table does DAI use to inspect messages received on untrusted ports?
- A. The ARP table
- B. The MAC address table
- C. The DHCP Snooping binding table
- D. The DHCP binding table

> **Official Correct Answer**: **C** — C: The DHCP Snooping binding table  
> **Technical Explanation**: DAI uses the DHCP Snooping binding table to validate ARP messages received on untrusted ports. This table contains mappings of IP addresses to MAC addresses that DAI refers to when validating ARP messages.


---

### Question 2: How does DAI treat ARP messages received on trusted ports?
- A. It allows them.
- B. It allows ARP replies.
- C. It allows ARP requests.
- D. It inspects them to determine the appropriate action.

> **Official Correct Answer**: **A** — A: It allows them.  
> **Technical Explanation**: ARP messages received on trusted ports are allowed without inspection in DAI; this is similar to DHCP Snooping’s behavior.


---

### Question 3: Which of the following statements about DAI is false?
- A. DAI must be enabled globally and per-VLAN.
- B. DAI validates ARP messages using the DHCP Snooping binding table.
- C. DAI rate limits ARP messages on untrusted ports by default.
- D. All ports are untrusted by default.

> **Official Correct Answer**: **A** — A: DAI must be enabled globally and per-VLAN.  
> **Technical Explanation**: Unlike DHCP Snooping, there is no separate command to globally enable DAI. It only needs to be enabled pervlan with ip arp inspection vlan vlans .


---

### Question 4: What kind of ARP reply is sent without receiving an ARP request?
- A. Unprompted ARP
- B. Spoofed ARP
- C. Gratuitous ARP
- D. Poisoned ARP

> **Official Correct Answer**: **C** — C: Gratuitous ARP  
> **Technical Explanation**: Gratuitous ARP (GARP) is an ARP reply sent without a preceding request. Although there are many legitimate uses for GARP, it can also be used in ARP poisoning attacks.


---

### Question 5: Which of the following commands are necessary for a basic DAI configuration? (select two)
- A. ip arp inspection
- B. ip arp inspection vlan 10
- C. ip arp inspection trust
- D. ip arp inspection validate src-mac

> **Official Correct Answer**: **B** — B: ip arp inspection vlan 10  
> **Technical Explanation**: C: ip arp inspection trust Basic DAI configuration requires you to enable DAI on each VLAN with ip arp inspection vlan vlans , and then trust the necessary ports with ip arp inspection trust .


---

### Question 6: What is the default DAI rate limit on trusted ports?
- A. 10 pps
- B. 15 pps
- C. 25 pps
- D. Unlimited

> **Official Correct Answer**: **D** — D: Unlimited  
> **Technical Explanation**: Although DAI limits ARP messages on untrusted ports to 15 pps (packets per second) by default, trusted ports do not have a default rate limit.


---

### Question 7: Which command enables automatic recovery of ports disabled by DAI rate-limiting?
- A. errdisable recovery cause arp-inspection
- B. errdisable recovery cause dai-violation
- C. errdisable recovery cause dai-rate-limit
- D. errdisable recovery cause dai

> **Official Correct Answer**: **A** — A: errdisable recovery cause arp-inspection  
> **Technical Explanation**: The errdisable recovery cause arp-inspection command enables ErrDisable Recovery for ports disabled by DAI rate-limiting, allowing them to automatically recover without manual intervention.


---

### Question 8: Which command causes the switch to inspect ARP messages for suspicious IP addresses?
- A. ip arp inspection validate src-ip
- B. ip arp inspection validate dst-ip
- C. ip arp inspection validate ip
- D. ip arp inspection validate src-dst-ip

> **Official Correct Answer**: **C** — C: ip arp inspection validate ip  
> **Technical Explanation**: Use the ip arp inspection validate checks command to enable optional DAI checks. The ip keyword makes the switch check for suspicious IP addresses in the ARP Sender IP or Target IP fields. The other options are src-mac and dst-mac

