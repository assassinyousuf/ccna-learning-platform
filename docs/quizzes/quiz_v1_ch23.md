# Assessment & Review: Volume 1 Chapter 23 - Chapter 23: Standard access control lists

### Question 1: Which of the following commands permit only the specified host’s IP address? (select three)
- A. **access-list 1 permit 8.8.8.8**
- B. **access-list 1 permit 8.8.8.8 0.0.0.0**
- C. **access-list 1 permit 8.8.8.8 255.255.255.255**
- D. **access-list 1 permit host 8.8.8.8**

> **Official Correct Answer**: **A** — A: **access-list 1 permit 8.8.8.8**  
> **Technical Explanation**: B: **access-list 1 permit 8.8.8.8 0.0.0.0** D: **access-list 1 permit host 8.8.8.8** When configuring a standard ACL, there are three ways to specify a single IP address: {**permit**|**deny**} **ip-address**, {**permit**|**deny**} **ipaddress 0.0.0.0**, and {**permit**|**deny**} **host ipaddress**. Option C is incorrect because it specifies the wildcard mask **255.255.255.255**, which is equivalent to a /0 netmask; it matches all possible IP addresses.


---

### Question 2: Where should standard ACLs generally be applied?
- A. As close to the source as possible
- B. As close to the destination as possible

> **Official Correct Answer**: **B** — B: As close to the destination as possible  
> **Technical Explanation**: Standard ACLs should generally be applied as close to the destination of the traffic you want to filter. Because standard ACLs filter packets based only on their source IP address, applying a standard ACL too close to the source can filter more traffic from the host/network than intended.


---

### Question 3: Which of the following are valid standard ACL numbers? (select three)
- A. 100
- B. 1301
- C. 1999
- D. 2000
- E. 99
- F. 199

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Standard ACLs can use numbers from 1 to 99 and 1300 to 1999. Therefore, 1301, 1999, and 99 are valid standard ACL numbers.


---

### Question 4: Which command can be used to create a standard named ACL?
- A. **ip access-list TEST\_ACL**
- B. **access-list TEST\_ACL**
- C. **ip access-list standard TEST\_ACL**
- D. **access-list standard TEST\_ACL**

> **Official Correct Answer**: **C** — C: **ip access-list standard TEST\_ACL**  
> **Technical Explanation**: The correct command to create a standard named ACL is **ip access-list standard name**. This command brings you to standard named ACL configuration mode, where you can configure rules for the ACL.


---

### Question 5: Which parameters can standard ACLs use to match packets? (select all that apply)
- A. Source IP address
- B. Destination IP address
- C. Protocol
- D. Source and/or destination port numbers

> **Official Correct Answer**: **A** — A: Source IP address  
> **Technical Explanation**: Standard ACLs can only match packets based on the source IP address. They cannot filter based on destination IP, protocol, or port numbers.


---

### Question 6: You create an ACL with a single ACE: **deny 192.168.1.0 0.0.0.255**.  You then apply the ACL to an interface.  What is the effect of this ACL?
- A. Packets sourced from 192.168.1.0/24 are denied.
- B. All packets are denied.
- C. All packets are permitted.
- D. Packets sourced from 192.168.1.0/24 are permitted.

> **Official Correct Answer**: **B** — B: All packets are denied.  
> **Technical Explanation**: Since the only ACE in the ACL denies packets from 192.168.1.0/24, and ACLs have an implicit “**deny any**” at the end, all packets will be denied. The ACL needs an explicit **permit** statement to allow other traffic.


---

### Question 7: Which command applies ACL 1 to an interface, filtering packets received by the interface?
- A. **ip access-list 1 in**
- B. **ip-access-list 1 out**
- C. **ip access-group 1 in**
- D. **ip-access-group 1 out**

> **Official Correct Answer**: **C** — C: **ip access-group 1 in**  
> **Technical Explanation**: The correct command to apply an ACL to an interface to filter incoming traffic is **ip addressgroup acl in**.


---

### Question 8: What is the effect of an ACL that has been created, but not applied to an interface?
- A. The ACL has no effect.
- B. The ACL filters all packets received by the router.
- C. The ACL filters all packets forwarded by the router.
- D. The ACL filters all packets sent by the router itself.

> **Official Correct Answer**: **A** — A: The ACL has no effect.  
> **Technical Explanation**: An ACL that has been created but not applied to any interface has no effect on traffic. ACLs must be applied to interfaces to filter traffic.

