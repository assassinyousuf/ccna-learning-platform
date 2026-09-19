# Assessment & Review: Volume 1 Chapter 4 - Chapter 4: The TCP/IP networking model

### Question 1: Which of the following define standards at Layers 1 and 2 of the TCP/IP Model? (select two)
- A. IPv4
- B. HTTP
- C. Ethernet
- D. 802.11 (Wi-Fi)

> **Official Correct Answer**: **C** — C: Ethernet  
> **Technical Explanation**: D: 802.11 (Wi-Fi) Ethernet and 802.11 (Wi-Fi) are standards that operate at Layers 1 (Physical) and 2 (Data Link) of the TCP/IP model. They both define standards relating to a physical medium (cables or electromagnetic radio waves) and sending messages over that medium.


---

### Question 2: Which layer of the TCP/IP Model defines standards related to the physical medium and how data should be encoded into signals sent over the medium?
- A. Layer 1
- B. Layer 2
- C. Layer 3
- D. Layer 7

> **Official Correct Answer**: **A** — A: Layer 1  
> **Technical Explanation**: Layer 1, the Physical Layer, is responsible for the physical connections between devices and how to encode messages into signals (such as electrical or light signals) that are sent over those connections.


---

### Question 3: Which layer of the TCP/IP Model is responsible for end-to-end delivery of a message from the source host to the destination host?
- A. Layer 1
- B. Layer 2
- C. Layer 3
- D. Layer 4

> **Official Correct Answer**: **C** — C: Layer 3  
> **Technical Explanation**: Layer 3, the Network Layer, is responsible for the end-to-end delivery of messages across a network. It uses IP addressing to determine routes for data, ensuring that packets are delivered from the source host to the destination host.


---

### Question 4: Which layer of the TCP/IP Model is responsible for delivering a message to the next node in the path to the final destination?
- A. Layer 1
- B. Layer 2
- C. Layer 3
- D. Layer 4

> **Official Correct Answer**: **B** — B: Layer 2  
> **Technical Explanation**: Layer 2, the Data Link Layer, is responsible for delivering a message to the next node in the network path. It handles communication between adjacent network nodes and can include protocols like Ethernet or Wi-Fi, dealing with the MAC addresses of the devices.


---

### Question 5: Which word describes a frame’s payload?
- A. Packet
- B. Segment
- C. L2PDU
- D. L4PDU

> **Official Correct Answer**: **A** — A: Packet  
> **Technical Explanation**: A frame is a Layer 2 Protocol Data Unit (L2PDU), and its payload (the message it encapsulates) is typically a packet. A packet is an L3PDU and contains the Layer 3 header (like an IP header) and its payload.


---

### Question 6: Which layer provides a service to the Application Layer by delivering data to the appropriate application process on the destination host?
- A. Layer 2
- B. Layer 3
- C. Layer 4
- D. Layer 7

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: Layer 4 Layer 4, the Transport Layer, provides services to the Application Layer by delivering data to the appropriate application process on the destination host. This is an example of adjacentlayer interaction—a layer servicing the layer above it.


---

### Question 7: Signals sent out of a physical port of one device are received by a physical port of another device. Which term describes this interaction?
- A. Same-layer interaction
- B. Adjacent-layer interaction

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: Same-layer interaction “Same-layer interaction” refers to the process where a layer in one device communicates with the same layer in another device. For example, when signals are sent from a physical port of one device and are received by a physical port of another device, it’s an instance of same-layer interaction, as each device’s Physical Layer is involved in the communication.


---

### Question 8: Which layer of the TCP/IP Model provides an interface between a web browser like Google Chrome and the network?
- A. Application Layer
- B. Transport Layer
- C. Network Layer
- D. Data Link Layer

> **Official Correct Answer**: **A** — A: Application Layer  
> **Technical Explanation**: The Application Layer provides an interface between application software, like a web browser, and the underlying network.

