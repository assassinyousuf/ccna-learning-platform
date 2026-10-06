# Assessment & Review: Volume 1 Chapter 21 - Chapter 21: IPv6 routing

### Question 1: What is the IPv4 equivalent of an IPv6 neighbor table?
- A. ARP table
- B. Routing table
- C. MAC address table
- D. IPv4 neighbor table

> **Official Correct Answer**: **A** — A: ARP table  
> **Technical Explanation**: In IPv4, the Address Resolution Protocol (ARP) table is used to map IPv4 addresses to MAC addresses. IPv6 doesn’t use ARP; instead, it uses Neighbor Discovery Protocol (NDP), storing IPv6- address-to-MAC-address mappings in the neighbor table.


---

### Question 2: What scope is used by IPv6 solicited-node multicast addresses?
- A. Interface-local
- B. Link-local
- C. Site-local
- D. Organization-local

> **Official Correct Answer**: **B** — B: Link-local  
> **Technical Explanation**: IPv6 solicited-node multicast addresses have a link-local scope (beginning with “ff02”); they are only used for communication within the local segment.


---

### Question 3: What solicited-node multicast address is generated from the unicast address df56:9098:1010:fd:ab29::f892?
- A. ff02::1:ff:f892
- B. ff02:1::ff00:f892
- C. ff02:1::ff:f892
- D. ff02::1:ff00:f892

> **Official Correct Answer**: **D** — D: ff02::1:ff00:f892  
> **Technical Explanation**: The solicited-node multicast address is formed by appending the last 24 bits of the unicast address to ff02::1:ff. Therefore, df56:9098:1010:fd:ab29::f892 generates ff02::1:ff00:f892. Note that, in the original address, two all-zero hextets were abbreviated; don’t forget to include two of those abbreviated zeros after the “ff02::1:ff” prefix—ff02::1:ff:f892 is incorrect.


---

### Question 4: Which message types does NDP use for Layer-2 address resolution? (select two)
- A. RS
- B. NS
- C. RA
- D. NA

> **Official Correct Answer**: **B** — B: NS  
> **Technical Explanation**: NDP uses Neighbor Solicitation (NS)—like ARP request—and Neighbor Advertisement (NA)—like ARP reply—messages for Layer-2 address resolution.


---

### Question 5: Which command can be used to view a list of IPv6- address-to-Layer-2-address mappings?
- A. **show ipv6 arp**
- B. **show ndp**
- C. **show ipv6 neighbors**
- D. **show ipv6 ndp**

> **Official Correct Answer**: **C** — C: **show ipv6 neighbors**  
> **Technical Explanation**: IPv6-address-to-Layer-2-address mappings are stored in the IPv6 neighbor table, which can be viewed with **show ipv6 neighbors**.


---

### Question 6: Which command can be used to configure an IPv6 with a prefix learned via RA and an automatically generated interface ID?
- A. **ipv6 enable**
- B. **ipv6 address eui-64**
- C. **ipv6 address autoconfig**
- D. **ipv6 address 2001:db8::/64 eui-64**

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: generated interface ID? ## C: ipv6 address autoconfig The **ipv6 address autoconfig** command configures an IPv6 address using the prefix advertised by Router Advertisements (RA) and automatically generates the interface ID using Modified EUI-64 rules.


---

### Question 7: Which NDP messages are used in the DAD process? (select two)
- A. RS
- B. NS
- C. RA
- D. NA

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: For Duplicate Address Detection (DAD), a host will send an NS message to its own IPv6 address. If it doesn’t receive a reply, it determines that the address is unique on the network. But if it receives an NA in reply, it determines that the address is a duplicate; it won’t be able to use the address.


---

### Question 8: Which of the following IPv6 static routes will not function properly, despite appearing in the routing table?
- A. **ipv6 route 2001:db8::/64 GigabitEthernet0/1**
- B. **ipv6 route 2001:db8::/64 2001:db8:12::2**
- C. **ipv6 route 2001:db8::/64 GigabitEthernet0/1 2001:db8:12::2**

> **Official Correct Answer**: **A** — A: **ipv6 route 2001:db8::/64 GigabitEthernet0/1**  
> **Technical Explanation**: Although Cisco IOS will allow you to configure this route, it will not function properly. Directly connected static routes can work in IPv4 because of proxy ARP, but Cisco IOS doesn’t implement an equivalent proxy NDP.


---

### Question 9: Which of the following commands configures a recursive host route?
- A. **ipv6 route 2001:db8::1/128 2001:db8:23::3**
- B. **ipv6 route 2001:db8::/64 2001:db8:23::3**
- C. **ipv6 route 2001:db8::1/128 GigabitEthernet0/1**
- D. **ipv6 route 2001:db8::/64 GigabitEthernet0/1**

> **Official Correct Answer**: **A** — A: **ipv6 route 2001:db8::1/128 2001:db8:23::3**  
> **Technical Explanation**: A host route is a route to a single destination address, using a /128 prefix length (/32 in IPv4). A recursive route is configured by specifying a destination network and a next-hop address, so A is the correct answer.


---

### Question 10: Which of the following commands configures a fully specified default route?
- A. **ipv6 route :: GigabitEthernet0/1**
- B. **ipv6 route ::/0 GigabitEthernet0/1**
- C. **ipv6 route ::/0 GigabitEthernet0/1 2001:db8::1**
- D. **ipv6 route :: GigabitEthernet0/1 2001:db8::1**

> **Official Correct Answer**: **C** — C: **ipv6 route ::/0 GigabitEthernet0/1 2001:db8::1**  
> **Technical Explanation**: A default route is a route to ::/0, matching all possible IPv6 addresses. A fully specified route includes both the exit interface and the next-hop address, so option C is correct.

