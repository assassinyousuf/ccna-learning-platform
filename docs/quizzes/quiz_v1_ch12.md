# Assessment & Review: Volume 1 Chapter 12 - Chapter 12: VLANs

### Question 1: Which of the following statements about VLANs is true?
- A. VLANs divide a collision domain into multiple collision domains.
- B. VLANs divide a broadcast domain into multiple broadcast domains.
- C. VLANs segment a LAN at Layer 3 of the TCP/IP Model.
- D. Switches can flood frames to hosts in different VLANs, but cannot forward frames to hosts in different VLANs.

> **Official Correct Answer**: **B** — B: VLANs divide a broadcast domain into multiple broadcast domains.  
> **Technical Explanation**: Virtual Local Area Networks (VLANs) divide a single broadcast domain into multiple smaller broadcast domains. This improves network performance and security by reducing the size of the broadcast domains and isolating network traffi c.


---

### Question 2: You issue **switchport access vlan 10** on a switch port, but VLAN 10 doesn’t exist yet on the switch. What is the result of the command?
- A. The port is disabled until you create VLAN 10.
- B. The command is rejected.
- C. The switch automatically creates VLAN 10.
- D. The port is assigned to the default VLAN.

> **Official Correct Answer**: **C** — C: The switch automatically creates VLAN 10.  
> **Technical Explanation**: On Cisco switches, if you assign a port to a VLAN that does not exist, the switch will automatically create that VLAN.


---

### Question 3: Which VLANs exist on a Cisco switch by default and cannot be deleted?
- A. VLANs 1, 1002, 1003, 1004, and 1005
- B. VLANs 1, 1001, 1002, 1003, 1004, and 1005
- C. VLANs 1, 1003, 1004, and 1005
- D. VLAN 1

> **Official Correct Answer**: **A** — A: VLANs 1, 1002, 1003, 1004, and 1005  
> **Technical Explanation**: VLAN 1 and several VLANs reserved for FDDI and Token Ring support (1002–1005)—old technologies that are no longer used—exist on Cisco switches by default. These VLANs cannot be deleted. ## 4.  Which VLAN is untagged on a trunk port? ## B: The native VLAN When a trunk port receives untagged frames, it assigns them to the native VLAN, and when sending frames in the native VLAN, it sends them untagged. The native VLAN is VLAN 1 by default, but it can be changed with **switchport trunk native vlan vlan** in interface config mode. ## 5.  How many VLANs are there in total, including reserved VLANs? D: 4096 The VLAN Identifier (VID) field of the 802.1Q tag is 12 bits in size, allowing for 2<sup>12</sup> = 4096 VLANs (0–4095). However, VLANs 0 and 4095 are reserved for special purposes, so a Cisco switch can have a maximum of 4094 VLANs (1–4094).


---

### Question 4: Which VLAN is untagged on a trunk port?
- A. The default VLAN
- B. The native VLAN
- C. The access VLAN
- D. VLAN 1

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 5: How many VLANs are there in total, including reserved VLANs?
- A. 4092
- B. 4094
- C. 4095
- D. 4096

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 6: Which VLANs are allowed on a trunk port by default?
- A. 1–4094
- B. 1–1001
- C. 1
- D. No VLANs are allowed by default.

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: By default, all VLANs (1–4094) are allowed on a trunk port. You can use the **switchport trunk allowed vlan** command to allow only the necessary VLANs.


---

### Question 7: A LAN you are managing includes VLANs 1, 2, and 3. VLAN 4, a new VLAN, is added and it is your job to make sure that all trunk links allow it.  Which command is appropriate to add VLAN 4 to each trunk’s list of allowed VLANs?
- A. **switchport trunk allowed vlan 4**
- B. **switchport trunk allowed vlan add 4**
- C. **switchport trunk allowed vlan allow 4**
- D. **switchport trunk vlan allow 4**

> **Official Correct Answer**: **B** — B: **switchport trunk allowed vlan add 4**  
> **Technical Explanation**: Use **switchport trunk allowed vlan add vlans** to add VLANs to a trunk’s list of allowed VLANs. The **add** keyword is very important. If you configure **switchport trunk allowed vlan 4**, it won’t add VLAN 4 to the list of allowed VLANs; it will replace the current list with only VLAN 4.


---

### Question 8: Which of the following is a security best practice related to VLANs?
- A. Leave VLAN 1 as the native VLAN but don’t assign hosts to it.
- B. A port’s native VLAN should be the same as its access VLAN.
- C. Configure a non-default unused VLAN as the native VLAN.
- D. The default and native VLANs should be the same.

> **Official Correct Answer**: **C** — C: Configure a non-default unused VLAN as the native VLAN.  
> **Technical Explanation**: A security best practice for VLANs is to configure a non-default, unused VLAN as the native VLAN on trunk ports. This helps mitigate security exploits related to the native VLAN; it is recommended that you do not use the native VLAN in your networks.


---

### Question 9: In a ROAS configuration, which command tells the router which VLAN to tag frames with?
- A. R1(config)# **interface g0/1.10**
- B. R1(config-subif)# **switchport trunk vlan 10**
- C. R1(config-subif)# **vlan tag dot1q 10**
- D. R1(config-subif)# **encapsulation dot1q 10**

> **Official Correct Answer**: **D** — D: R1(config-subif)# **encapsulation dot1q 10**  
> **Technical Explanation**: In a router-on-a-stick (ROAS) configuration, the command **encapsulation dot1q vlan-id** is used in subinterface configuration mode to specify the VLAN ID for tagging frames. The VLAN ID doesn’t have to match the subinterface ID (i.e. GigabitEthernet0/1.10), but it’s best to match them for simplicity’s sake.


---

### Question 10: Which of the following is NOT a requirement for an SVI to be in an up/up state?
- A. The VLAN associated with the SVI must exist on the switch.
- B. The SVI must be enabled.
- C. The VLAN must be enabled.
- D. The switch must have both an access port associated with the VLAN and a trunk port that allows the VLAN.

> **Official Correct Answer**: **D** — D: The switch must have both an access port associated with the VLAN and a trunk port that allows the VLAN.  
> **Technical Explanation**: For a switch virtual interface (SVI) to be in an up/up state, the switch must have either an access port associated with the VLAN or a trunk port that allows the VLAN; it is not necessary to have both.

