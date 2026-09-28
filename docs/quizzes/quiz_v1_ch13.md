# Assessment & Review: Volume 1 Chapter 13 - Chapter 13: Dynamic Trunking Protocol and VLAN Trunking Protocol

### Question 1: If two Cisco switches are connected with the default settings, what will be the operational mode of their ports?
- A. Access
- B. Trunk

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: Access Cisco switch ports default to **switchport mode dynamic auto**. Two connected ports in dynamic auto mode will not form a trunk; they will operate as access ports.


---

### Question 2: Which of the following **switchport mode** command combinations configured on two connected ports will result in a valid trunk link?
- A. **dynamic auto + trunk**
- B. **dynamic auto + dynamic auto**
- C. **dynamic desirable + access**
- D. **trunk + access**

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: dynamic auto + trunk Although a port configured with **switchport mode trunk** does not use DTP to determine its own operational mode, it will still send DTP messages to encourage its connected neighbor to operate in trunk mode. This means the port in dynamic auto mode will also operate in trunk mode, forming a valid trunk link.


---

### Question 3: Which administrative modes result in a port not sending DTP frames?
- A. Trunk and access
- B. Dynamic auto and access
- C. Access
- D. Trunk

> **Official Correct Answer**: **C** — C: Access  
> **Technical Explanation**: Ports configured with **switchport mode access** will not send DTP frames. Switch ports in other modes will, including those configured with **switchport mode trunk** (unless you also configure **switchport nonegotiate**).


---

### Question 4: Which VTP mode(s) will cause a switch to sync its VLAN database to other switches in the VTP domain?
- A. Server
- B. Transparent
- C. Client
- D. Server and client

> **Official Correct Answer**: **D** — D: Server and client  
> **Technical Explanation**: In VTP, both server and client modes will synchronize VLAN information upon receiving a VTP message with a higher revision number. Server mode allows a switch to create, modify, and delete VLANs and propagate those changes to other switches, while client mode switches receive and apply these changes but cannot create, change, or delete VLANs.


---

### Question 5: What will a switch without a VTP domain name do upon receiving a VTP message on one of its trunk ports?
- A. It will ignore the message.
- B. It will forward the message but not join the VTP domain.
- C. It will join the sender’s VTP domain.

> **Official Correct Answer**: **C** — C: It will join the sender’s VTP domain.  
> **Technical Explanation**: A switch that does not have a VTP domain name configured will adopt the domain name from a received VTP message and sync its VLAN database.


---

### Question 6: Which VTPv3 modes allow a switch to create VLANs and propagate them to other switches in the VTP domain?
- A. Server
- B. Server and transparent
- C. Primary server and transparent
- D. Primary server

> **Official Correct Answer**: **D** — D: Primary server  
> **Technical Explanation**: In VTP version 3, only the “primary server” mode allows a switch to create VLANs and propagate them across the VTP domain; regular VTPv3 servers cannot. Use **vtp primary** in privileged EXEC mode to make a switch the primary server.


---

### Question 7: Which VTP versions support extended-range VLANs?
- A. VTPv3
- B. VTPv2
- C. VTPv1, VTPv2, and VTPv3
- D. VTPv2 and VTPv3

> **Official Correct Answer**: **A** — A: VTPv3  
> **Technical Explanation**: Only VTP version 3 supports extended-range VLANs (VLANs 1006–4094). VTPv1 and VTPv2 support only normal-range VLANs (1–1005).


---

### Question 8: Which ports do switches send VTP messages out of?
- A. Access ports
- B. Trunk ports
- C. All ports

> **Official Correct Answer**: **B** — B: Trunk ports  
> **Technical Explanation**: VTP messages are only sent out of a switch’s trunk ports, not access ports.

