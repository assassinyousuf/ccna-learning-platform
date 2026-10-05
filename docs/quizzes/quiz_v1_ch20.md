# Assessment & Review: Volume 1 Chapter 20 - Chapter 20: IPv6 addressing

### Question 1: Which of the following are not valid IPv6 addresses? (select two)
- A. 2607:f8b0:4005:800::1004
- B. 2607:f8b0:4005:800:1111:0:1:2:3
- C. 2607:f8b0:4005:800:gh::1004
- D. fe80::204:61ff:fe9d:f156

> **Official Correct Answer**: **B** — B: 2607:f8b0:4005:800:1111:0:1:2:3  
> **Technical Explanation**: C: 2607:f8b0:4005:800:gh::1004 Option B has too many hextets (9), and option C contains invalid characters (“g” and “h”). Hexadecimal only uses 0–9 and a–f.


---

### Question 2: Which of the following is a correctly abbreviated version of the IPv6 address 2001:0db8:85a3:0000:0000:8a2e:0370:7334?
- A. 2001:db8:85a3::8a2e:37:7334
- B. 2001:db8:85a3::0:8a2e:37:7334
- C. 2001:0db8:85a3::8a2e:370:7334
- D. 2001:db8:85a3::8a2e:370:7334

> **Official Correct Answer**: **D** — D: 2001:db8:85a3::8a2e:370:7334  
> **Technical Explanation**: This option correctly abbreviates the IPv6 address by removing leading zeros and consecutive all-zero hextets. Make sure to avoid common pitfalls like removing trailing zeros, failing to remove all leading zeros, and improperly abbreviating all-zero hextets.


---

### Question 3: Which command configures an IPv6 address using the specified prefix and an automatically generated interface ID?
- A. **ipv6 address eui-64**
- B. **ipv6 address 2001:db8:0:1::/64 auto**
- C. **ipv6 address autoconfig**
- D. **ipv6 address 2001:db8:0:1::/64 eui-64**

> **Official Correct Answer**: **D** — D: **ipv6 address 2001:db8:0:1::/64 eui-64**  
> **Technical Explanation**: The command **ipv6 address prefix/64 eui-64** allows you to specify a /64 network prefix and automatically generate a 64-bit interface ID from the interface’s MAC address using Modified EUI-64 rules.


---

### Question 4: R1’s G0/1 interface’s MAC address is 7ea2.1097.ff27. What is its Modified EUI-64 interface ID?
- A. 7ea2:10ff:fe97:ff27
- B. 7ca2:10ff:fe97:ff27
- C. 7da2:10ff:ff97:ff27
- D. 7fa2:10ff:fe97:ff27

> **Official Correct Answer**: **B** — B: 7ca2:10ff:fe97:ff27  
> **Technical Explanation**: The Modified EUI-64 format inverts the 7th bit of the MAC address, and inserts ‘ff:fe’ in the middle to expand the MAC to a 64-bit interface ID. The MAC address 7ea2.1097.ff27 becomes 7ca2:10ff:fe97:ff27.


---

### Question 5: Which MAC address was used to generate the Modified EUI-64 interface ID 1f7d:2aff:fedd:611c?
- A. 1b7d.2add.611c
- B. 1c7d.2add.611c
- C. 1d7d.2add.611c
- D. 1e7d.2add.611c

> **Official Correct Answer**: **C** — C: 1d7d.2add.611c  
> **Technical Explanation**: To find the original MAC address, remove “ff:fe” and then invert the 7th bit back to its original state. The interface ID 1f7d:2aff:fedd:611c corresponds to the MAC address 1d7d.2add.611c.


---

### Question 6: Which type of IPv6 address is equivalent to a private IPv4 address?
- A. ULA
- B. LLA
- C. EUI
- D. GUA

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Unique local addresses (ULAs) in IPv6 are equivalent to private IPv4 addresses. They are used for local communications within a private network and are not routable over the Internet (although they are routable within the private network).


---

### Question 7: Which kind of IPv6 address is not routable?
- A. ULA
- B. LLA
- C. Multicast
- D. GUA

> **Official Correct Answer**: **B** — B: LLA  
> **Technical Explanation**: Link-local addresses (LLAs) are not routable beyond their local network segment. They are used for communication on a single link or network segment. IPv6 LLAs use the fe80::/10 range.


---

### Question 8: Which kind of IPv6 address must be configured on every IPv6-enabled interface?
- A. ULA
- B. LLA
- C. Anycast
- D. GUA

> **Official Correct Answer**: **B** — B: LLA  
> **Technical Explanation**: Every IPv6-enabled interface must have an LLA. These addresses are used for various functions on the local network segment, so they are mandatory on all IPv6-enabled interfaces.


---

### Question 9: Which IPv6 multicast scope remains on the local segment?
- A. ff01
- B. ff02
- C. ff05
- D. ff08

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: IPv6 multicast addresses that begin with “ff02” have the “link-local” scope. These packets remain on the local segment; routers will not route them.


---

### Question 10: Which IPv6 multicast address can be used to achieve the same effect as a message to the IPv4 address 255.255.255.255?
- A. ff02::1
- B. ff02::2
- C. ff02::5
- D. ff02::a

> **Official Correct Answer**: **A** — A: ff02::1  
> **Technical Explanation**: ff02::1 is the “all nodes” link-local multicast address. Although IPv6 doesn’t use the concept of “broadcast”, a packet sent to this multicast address has the same effect as a packet sent to the IPv4 broadcast address 255.255.255.255; it addresses the packet to all nodes on the local segment.


---

### Question 11: Which IPv6 address is equivalent to an IPv4 address in the 127.0.0.0/8 range?
- A. ::
- B. ::1
- C. ::127
- D. 127::1

> **Official Correct Answer**: **B** — B: ::1  
> **Technical Explanation**: This is the IPv6 loopback address. Whereas IPv4 reserves a whole range (127.0.0.0/8) for loopback addresses, IPv6 uses only ::1. Messages sent to this address are “looped back” to the local device; they are not sent out of any interface. ## 12.  Which IPv6 address type involves configuring the same address on multiple hosts? D: Anycast An anycast address is indistinguishable from a unicast address; the only difference is that an anycast address is configured on multiple hosts. This is useful when providing services over the internet; by configuring the same IP address on servers in different global locations, client devices can access the server closest to their location.


---

### Question 12: Which IPv6 address type involves configuring the same address on multiple hosts?
- A. Unicast
- B. Broadcast
- C. Multicast
- D. Anycast

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.

