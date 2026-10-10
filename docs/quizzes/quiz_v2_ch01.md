# Assessment & Review: Volume 2 Chapter 1 - Chapter 1: Cisco Discovery Protocol and Link Layer Discovery Protocol

### Question 1: A Cisco switch and a Juniper switch use a Layer-2 discovery protocol to share information about each other. Which protocol are they likely using?
- A. CDP
- B. LLDP
- C. FHRP

> **Official Correct Answer**: **B** — B: LLDP  
> **Technical Explanation**: Link Layer Discovery Protocol (LLDP) is a vendor-neutral Layer-2 discovery protocol used by various networking devices, including those from Cisco, Juniper, and most other vendors. Cisco Discovery Protocol (CDP), on the other hand, is Cisco proprietary (although it has been implemented by a few other vendors).


---

### Question 2: Which of the following commands doubles the frequency at which a device sends CDP messages?
- A. cdp timer 30
- B. cdp hello-interval 30
- C. cdp timer 15
- D. cdp hello-interval 15

> **Official Correct Answer**: **A** — A: cdp timer 30  
> **Technical Explanation**: The cdp timer command sets the frequency at which CDP messages are sent. The default timer is 60 seconds, so setting it to 30 seconds would double the frequency.


---

### Question 3: By default, how many LLDP messages can a device miss from its neighbor before removing the neighbor from its LLDP neighbor table?
- A. 1
- B. 2
- C. 3
- D. 4

> **Official Correct Answer**: **D** — D: 4  
> **Technical Explanation**: The default hold time for LLDP is 120 seconds, and LLDP messages are sent every 30 seconds by default. Therefore, a device can miss up to 4 LLDP messages (120 seconds / 30 seconds per message) before it removes the neighbor from its table.


---

### Question 4: Which command allows the device to control how long its LLDP neighbors wait before removing its entry from their neighbor tables?
- A. lldp timer
- B. lldp holdtime
- C. lldp reinit
- D. lldp receive

> **Official Correct Answer**: **B** — B: lldp holdtime  
> **Technical Explanation**: The lldp holdtime command sets the amount of time a device’s neighbors should hold information before discarding it. This time is communicated in LLDP messages sent by the device.


---

### Question 5: Which command globally enables CDP on a device?
- A. cdp enable
- B. cdp transmit
- C. cdp run
- D. cdp receive

> **Official Correct Answer**: **C** — C: cdp run  
> **Technical Explanation**: The cdp run command—issued in global config mode—globally enables CDP on a Cisco device. This command is required to activate CDP if it has been previously disabled (although CDP is globally enabled by default).


---

### Question 6: You issue show cdp neighbors on R1. SW1’s entry shows Local Intrfce: Gig 0/0 and Port ID: 0/1 . Which of the following statements is true?
- A. R1 G0/0 is connected to SW1 G0/1.
- B. R1 G0/1 is connected to SW1 G0/0.

> **Official Correct Answer**: **A** — A: R1 G0/0 is connected to SW1 G0/1.  
> **Technical Explanation**: In the output of show cdp neighbors , the Local Intrfce column indicates the interface of this device (R1), and the Port ID column indicates the interface of the neighboring device (SW1).


---

### Question 7: Which of the following statements about LLDP is false?
- A. An interface must have an IP address to send LLDP messages.
- B. LLDP Tx and Rx can be controlled separately.
- C. LLDP is disabled on Cisco devices by default.
- D. Any vendor can implement LLDP on its devices.

> **Official Correct Answer**: **A** — A: An interface must have an IP address to send LLDP messages.  
> **Technical Explanation**: LLDP doesn’t require an IP address on an interface to send (or receive) messages—the same applies to CDP. CDP and LLDP are Layer-2 discovery protocols; they function even on interfaces that don’t have Layer-3 IP addresses.


---

### Question 8: Which command(s) can be used to disable LLDP on an interface?
- A. no lldp run
- B. no lldp enable
- C. no lldp transmit and no lldp receive
- D. lldp disable

> **Official Correct Answer**: **C** — C: no lldp transmit and no lldp receive  
> **Technical Explanation**: To completely disable LLDP on an interface, both transmission and reception of LLDP messages must be turned off. You can do this with the no lldp transmit and no lldp receive commands in interface config mode.

