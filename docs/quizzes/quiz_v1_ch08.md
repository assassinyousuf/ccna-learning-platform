# Assessment & Review: Volume 1 Chapter 8 - Chapter 8: Router and switch interfaces

### Question 1: Which of the following statements are true? (select two)
- A. Cisco router interfaces have **no shutdown** applied by default.
- B. Cisco switch interfaces have **shutdown** applied by default.
- C. Cisco router interfaces have **shutdown** applied by default.
- D. Cisco switch interfaces have **no shutdown** applied by default.

> **Official Correct Answer**: **C** — C: Cisco router interfaces have **shutdown** applied by default.  
> **Technical Explanation**: D: Cisco switch interfaces have **no shutdown** applied by default. By default, Cisco router interfaces are disabled with the **shutdown** command. Cisco switch interfaces, on the other hand, are enabled; they have **no shutdown** applied by default.


---

### Question 2: Which of the following is the default setting on a Gigabit Ethernet interface?
- A. **speed 1000**
- B. **speed 1g**
- C. **speed auto**

> **Official Correct Answer**: **C** — C: **speed auto**  
> **Technical Explanation**: The default setting on interfaces of all speeds is typically **speed auto**, using autonegotiation to determine the speed at which the interface will operate.


---

### Question 3: Which term describes two-way communication in which devices take turns transmitting and receiving?
- A. Half duplex
- B. Full duplex
- C. Simplex

> **Official Correct Answer**: **A** — A: Half duplex  
> **Technical Explanation**: Half duplex refers to two-way communication where devices take turns transmitting and receiving. In half-duplex mode, a device must wait for the other to finish transmitting before it can start.


---

### Question 4: Two PCs and two servers are connected to a hub. How many collision domains are there in the LAN?
- A. One
- B. Two
- C. Three
- D. Four

> **Official Correct Answer**: **A** — A: One  
> **Technical Explanation**: When devices are connected to a hub, there is only one collision domain. This means that only one of the devices can transmit at once; the others must wait their turn.


---

### Question 5: Two PCs and two servers are connected to a switch. How many collision domains are there in the LAN?
- A. One
- B. Two
- C. Three
- D. Four

> **Official Correct Answer**: **D** — D: Four  
> **Technical Explanation**: When devices are connected to a switch, each port on the switch is a separate collision domain. Therefore, with four devices connected to a switch, there are four collision domains.


---

### Question 6: Which technology is used by Ethernet hosts operating in half-duplex to detect and recover from collisions?
- A. Auto MDI-X
- B. CSMA/CD
- C. CSMA/CA
- D. Autonegotiation

> **Official Correct Answer**: **B** — B: CSMA/CD  
> **Technical Explanation**: Carrier Sense Multiple Access with Collision Detection (CSMA/CD) is used by Ethernet hosts operating in half-duplex mode to detect and recover from collisions. The device senses whether other devices are transmitting or not and detects when collisions have occurred.


---

### Question 7: SW1 F0/1 and SW2 F0/1 are connected and have the default settings.  What speed and duplex settings will appear in the output of **show interfaces status**?
- A. 100, full
- B. 100, half
- C. a-100, half
- D. a-100, a-full

> **Official Correct Answer**: **D** — D: a-100, a-full  
> **Technical Explanation**: With default settings of **speed auto** and **duplex auto**, both switches will use autonegotiation to determine their speed and duplex settings. The interfaces will show a-100 for speed and a-full for duplex, with the a- prefix meaning “auto”.


---

### Question 8: Which error counter in the output of **show interfaces** counts frames that failed the FCS check?
- A. Collisions
- B. Input errors
- C. CRC
- D. Runts

> **Official Correct Answer**: **C** — C: CRC  
> **Technical Explanation**: Cyclic Redundancy Check (CRC) errors are recorded with the CRC error counter in the output of **show interfaces**. These errors occur when the frame fails the Frame Check Sequence (FCS) check in the Ethernet trailer.


---

### Question 9: What is the result of a speed mismatch on two connected interfaces?
- A. The interfaces will operate at the slower of the two speeds.
- B. The interfaces will be in a down/down state.
- C. Collisions and late collisions will occur.
- D. Communications will be unaffected.

> **Official Correct Answer**: **B** — B: The interfaces will be in a down/down state.  
> **Technical Explanation**: If there is a speed mismatch, the connection will not be operational; the devices will be unable to communicate. You can expect the connected interfaces to be in a down/down state.


---

### Question 10: When there is a duplex mismatch between two connected devices, which error counters will likely increment on the half-duplex device? (select two)
- A. Collisions
- B. Runts
- C. CRC
- D. Late collisions

> **Official Correct Answer**: **A** — A: Collisions  
> **Technical Explanation**: D: Late collisions If there is a duplex mismatch and the connected devices transmit at the same time, the halfduplex device will interpret it as a collision, which can lead to incrementing collision and late collision counters.

