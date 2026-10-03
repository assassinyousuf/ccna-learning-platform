# Assessment & Review: Volume 1 Chapter 18 - Chapter 18: Open Shortest Path First

### Question 1: R1 is part of an OSPF network, and all of its OSPF-enabled interfaces are in area 1.  Furthermore, it connects to the Internet and advertises a default route to other OSPF routers.  What OSPF router types apply to R1? (select all that apply).
- A. Internal router
- B. Backbone router
- C. ABR
- D. ASBR

> **Official Correct Answer**: **A** — A: Internal router  
> **Technical Explanation**: D: ASBR R1 is an internal router because all of its OSPF-enabled interfaces are in a single area (area 1). It’s also an autonomous system boundary router (ASBR) because it connects to an external network (the Internet) and advertises a default route to other OSPF routers. It is not an area border router (ABR) because it does not connect to multiple OSPF areas, nor is it a backbone router because it’s not in area 0.


---

### Question 2: What command should you configure on a router to ensure that all GigabitEthernet interfaces have an OSPF cost of 10?
- A. **auto-cost reference-bandwidth 100**
- B. **auto-cost reference-bandwidth 1000**
- C. **auto-cost reference-bandwidth 10000**
- D. **auto-cost reference-bandwidth 100000**

> **Official Correct Answer**: **C** — C: **auto-cost reference-bandwidth 10000**  
> **Technical Explanation**: OSPF’s automatic cost calculation uses the formula “reference bandwidth/interface bandwidth”. The **auto-cost reference-bandwidth** command is configured in Mbps, so to make a 1 Gbps (1000 Mbps) interface have a cost of 10, the reference bandwidth should be 10000 Mbps (10000/1000 = 10).


---

### Question 3: What is the effect of the **passive-interface** command on an OSPF-activated interface?
- A. The router will attempt to form OSPF neighbor relationships on the interface, but won’t send hello messages out of the interface.
- B. The router will advertise the interface’s network to other OSPF routers, but won’t send hello messages out of the interface.
- C. The router will send hello messages out of the interface, but won’t advertise the interface’s network to other OSPF routers.
- D. The router will send hello messages out of the interface, but won’t attempt to form OSPF neighbor relationships on the interface.

> **Official Correct Answer**: **B** — B: The router will advertise the interface’s network to other OSPF routers, but won’t send hello messages out of the interface.  
> **Technical Explanation**: The **passive-interface** command in OSPF stops the router from sending OSPF hello packets out of the interface, preventing OSPF neighbor relationships from forming on that interface. However, the network connected to the interface will still be advertised to other OSPF routers.


---

### Question 4: Which of the following represents the order of priority when a router decides its OSPF RID?
- A. 1) Manual configuration, 2) Highest IP address on a loopback interface, 3) Highest IP address on a physical interface
- B. 1) Manual configuration, 2) Lowest IP address on a loopback interface, 3) Lowest IP address on a physical interface
- C. 1) Manual configuration, 2) Highest IP address on a physical interface, 3) Highest IP address on a loopback interface
- D. 1) Manual configuration, 2) Lowest IP address on a physical interface, 3) Lowest IP address on a

loopback interface

> **Official Correct Answer**: **A** — A: 1) Manual configuration, 2) Highest IP address on a loopback interface, 3) Highest IP address on a physical interface  
> **Technical Explanation**: The OSPF Router ID (RID) is determined in this order of priority: first, a manually configured router ID; second, the highest IP address on any active loopback interface; third, the highest IP address on any active physical interface.


---

### Question 5: R1 has multiple OSPF neighbor relationships. R1’s OSPF RID is 192.168.1.1, which was inherited from a physical interface’s IP address.  You then configure the IP address 10.0.0.2 on a loopback interface and configure **router-id 1.1.1.1** in router config mode for the OSPF process.  What is R1’s RID after you issue the **router-id 1.1.1.1** command?
- A. 192.168.1.1
- B. 10.0.0.2
- C. 1.1.1.1

> **Official Correct Answer**: **A** — A: 192.168.1.1  
> **Technical Explanation**: Once a router has determined its RID and established an OSPF neighbor relationship with another router, the only way to change the RID is to manually configure it with the **router-id rid** command and then reset the OSPF process with **clear ip ospf process**. However, the scenario does not indicate that you reset the OSPF process, so R1’s RID remains 192.168.1.1.


---

### Question 6: Which of the following commands activates OSPF on an interface without using the **network** command?
- A. **R1(config)# ip ospf 1 area 0**
- B. **R1(config-if)# ip ospf 1 area 0**
- C. **R1(config-router)# ip ospf 1 area 0**
- D. **R1(config-ospf)# ip ospf 1 area 0**

7.Four routers connected to a segment with the OSPF broadcast network type have the default OSPF priority. R4 is the DR and R3 is the BDR.  You configure **ip ospf priority 100** on R2’s interface connected to the segment and reset OSPF on R4 with **clear ip ospf process**.  Which of the following statements is true after you reset R4’s OSPF process?
- A. R2 is the DR and R3 is the BDR.
- B. R3 is the DR and R2 is the BDR.
- C. R2 is the DR and R4 is the BDR.
- D. R3 is the DR and R4 is the BDR

> **Official Correct Answer**: **B** — B: R1(config-if)# **ip ospf 1 area 0**  
> **Technical Explanation**: You can use the **ip ospf process-id area areaid** in interface config mode to activate OSPF on the interface. This is generally preferred over the **network** command due to its simplicity.


---

### Question 7: Four routers connected to a segment with the OSPF broadcast network type have the default OSPF priority. R4 is the DR and R3 is the BDR. You configure ip ospf priority 100 on R2’s interface connected to the segment and reset OSPF on R4 with **clear ip ospf process**. Which of the following statements is true after you reset R4’s OSPF process?
- B: R3 is the DR and R2 is the BDR.
- Option B
- Option C
- Option D

> **Official Correct Answer**: **B** — B: R3 is the DR and R2 is the BDR.  
> **Technical Explanation**: When the OSPF process of R4 (the DR) is reset, R3 (the BDR) immediately takes over its role as the DR, even though R2’s interface now has the highest priority (100, whereas others have the default of 1). Then, an election is held to determine the new BDR; R2 wins this due to its higher priority and becomes the BDR.


---

### Question 8: Which of the following commands can be used to prevent routers from electing a DR/BDR?
- A. Router(config-if)# **ip ospf network point-to-point**
- B. Router(config-if)# **ip ospf network broadcast**
- C. Router(config-if)# **ip ospf priority 1**
- D. Router(config-if)# **ip ospf network direct**

> **Official Correct Answer**: **A** — A: Router(config-if)# **ip ospf network point-to-point**  
> **Technical Explanation**: Whereas OSPF neighbors using the broadcast network type hold DR/BDR elections, those using the point-to-point network type do not. The default network type of Ethernet interfaces is broadcast, but you can use **ip ospf network point-to-point** to configure the point-to-point network type.


---

### Question 9: Which of the following are requirements for two routers to become OSPF neighbors? (select two)
- A. Area numbers must be unique.
- B. RIDs must be unique.
- C. Hello and dead timers must match.
- D. RIDs must match.

> **Official Correct Answer**: **B** — B: RIDs must be unique.  
> **Technical Explanation**: C: Hello and dead timers must match. For two routers to become OSPF neighbors, their RIDs must be unique, and their hello and dead timers must match. The other two options are incorrect because the area numbers must match (not be unique) and the RIDs must be unique (not match).


---

### Question 10: Which of the following represents the order of priority when routers elect a DR/BDR?
- A. 1) Lowest interface priority, 2) Lowest RID
- B. 1) Lowest RID, 2) Lowest interface priority
- C. 1) Highest interface priority, 2) Highest RID
- D. 1) Highest RID, 2) Highest interface priority

> **Official Correct Answer**: **C** — C: 1) Highest interface priority, 2) Highest RID  
> **Technical Explanation**: The router with the highest interface priority is elected as the DR of an OSPF broadcast network. If there is a tie, the router with the highest RID becomes the DR. Then, an election using identical rules is held to determine the BDR.

