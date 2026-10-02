# Assessment & Review: Volume 1 Chapter 17 - Chapter 17: Dynamic routing

### Question 1: Which type of dynamic routing protocol is used to exchange routing information within an AS?
- A. IGP
- B. EGP
- C. BGP
- D. ISP

> **Official Correct Answer**: **A** — A: IGP  
> **Technical Explanation**: Interior gateway protocols (IGPs) are used to exchange routing information within an autonomous system (AS). Examples include OSPF, EIGRP, RIP, and IS-IS. This is in contrast to exterior gateway protocols (EGPs) like BGP, which are used to exchange routing information between ASs.


---

### Question 2: Which of the following dynamic routing protocols use a link-state algorithm? (select two)
- A. IS-IS
- B. RIP
- C. OSPF
- D. EIGRP

> **Official Correct Answer**: **A** — A: IS-IS  
> **Technical Explanation**: C: OSPF IS-IS and OSPF are both link-state routing protocols. They maintain a complete map of the network topology to make routing decisions.


---

### Question 3: Which type of routing protocol is also known as “routing by rumor”?
- A. IGP
- B. Link-state
- C. Distance-vector
- D. Path-vector

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Distance-vector routing protocols are often referred to as “routing by rumor” because the router doesn’t build a complete map of the network; it only knows what its neighbors tell it.


---

### Question 4: When multiple routes to the same destination network are learned via the same routing protocol, which parameter is used to select which route(s) will enter the routing table?
- A. Prefix length
- B. Metric
- C. AD
- D. Specificity

> **Official Correct Answer**: **B** — B: Metric  
> **Technical Explanation**: When a router learns multiple routes to the same destination from the same routing protocol, the route with the lowest metric is selected for the routing table.


---

### Question 5: When multiple routes to the same destination network are learned via different routing protocols, which parameter is used to select which route(s) will enter the routing table?
- A. Prefix length
- B. Metric
- C. AD
- D. Specificity

> **Official Correct Answer**: **C** — C: AD  
> **Technical Explanation**: When routes to the same destination are learned via different routing protocols, the administrative distance (AD) is used to determine the preferred route. The route with the lowest AD is selected. Each routing protocol calculates route metric values differently, so they can’t be directly compared.


---

### Question 6: Which of the following accurately represent IOS default AD values? (select two)
- A. Static = 0
- B. EIGRP = 90
- C. OSPF = 110
- D. RIP = 115

> **Official Correct Answer**: **B** — B: EIGRP = 90  
> **Technical Explanation**: C: OSPF = 110 Here are some default AD values in Cisco IOS: connected = 0, static = 1, External BGP (EBGP) = 20, EIGRP = 90, OSPF = 110, IS-IS = 115, RIP = 120, Internal BGP (IBGP) = 200, unusable = 255.


---

### Question 7: If a Cisco router learns multiple routes to the same destination via the same routing protocol, and all routes have the same metric, what is the maximum number of routes to that destination that the router will insert into its routing table by default?
- A. 1
- B. 2
- C. 4
- D. 8

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: 4 By default, Cisco routers can load-balance across up to four equal-cost paths; this is called equalcost multi-path (ECMP) routing. If multiple routes to the same destination have the same metric, up to four of them can be inserted into the routing table for load balancing.


---

### Question 8: What kind of static route acts as a backup for another route, only entering the routing table if the more preferred route is removed from the routing table?
- A. Default static route
- B. Floating static route
- C. Recursive static route
- D. Backup static route

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B: Floating static route A floating static route is a static route with a higher AD than the primary route. It acts as a backup and is used only if the primary route is unavailable.


---

### Question 9: A router learns the following routes via manual configuration and dynamic routing protocols.  Which route(s) will it insert into its routing table? (select all that apply)
- A. 10.0.0.0/8 via RIP, metric 6
- B. 10.0.0.0/16 via OSPF, metric 5
- C. 10.0.0.0/16 via static routing
- D. 10.0.0.0/24 via EIGRP, metric 10127

> **Official Correct Answer**: **A** — A: 10.0.0.0/8 via RIP, metric 6  
> **Technical Explanation**: C: 10.0.0.0/16 via static routing D: 10.0.0.0/24 via EIGRP, metric 10127 The router has learned routes to three different destination networks: 10.0.0.0/8, 10.0.0.0/16, and 10.0.0.0/24. It has only learned one route to each of 10.0.0.0/8 and 10.0.0.0/24, so it will insert both routes as is—no need to compare them with other routes. Then, the router will select which route to 10.0.0.0/16 to insert. The static route has a lower AD (1) than the OSPF route (110), so it will insert the static route into its routing table. Note that “select all that apply” questions will not appear on the CCNA exam; if you need to select multiple answers, it will state exactly how many you need to select (select two, select three, etc).


---

### Question 10: A router learns the following routes via manual configuration and dynamic routing protocols.  Which route(s) will it insert into its routing table? (select all that apply)
- A. 192.168.1.0/24 via RIP, metric 2
- B. 192.168.1.0/24 via OSPF, metric 15
- C. 192.168.1.0/24 via EIGRP, metric 2345
- D. 192.168.1.0/24 via static routing, AD 89

> **Official Correct Answer**: **D** — D: 192.168.1.0/24 via static routing, AD 89  
> **Technical Explanation**: The router has learned four different routes to a single destination network: 192.168.1.0/24. So it will only insert one route into its routing table (unless ECMP comes into play). The static route has been configured with a non-default AD (89). However, its AD is still lower than that of the EIGRP route (90), so the router will insert the static route into its routing table. When configuring a floating static route, make sure to configure it so that its AD is sufficiently high to make it less preferred than other routes.


---

### Question 11: A router receives a packet destined for 192.0.2.29. It has the following four routes in its routing table. Which route will it select to forward the packet?
- A. R 192.0.2.0/27 [120/5] via 10.0.0.2
- B. S 192.0.2.0/28 [1/0] via 10.0.0.6
- C. O 192.0.2.16/29 [110/20] via 10.0.0.10

> **Official Correct Answer**: **A** — A: R 192.0.2.0/27 [120/5] via 10.0.0.2  
> **Technical Explanation**: When selecting which route should be used to forward a particular packet, the router only considers one thing: the most specific matching route. AD and metric are not considered. In this case, only the route to 192.0.2.0/27 (option A) matches the packet’s destination IP address, so the router will forward the packet according to that route’s instructions.


---

### Question 12: A router receives a packet destined for 10.23.107.126. It has the following four routes in its routing table.  Which route will it select to forward the packet?
- A. S 10.23.107.0/25 [1/0] via 172.16.1.1
- B. O 10.23.107.0/26 [110/10] via 172.16.1.5
- C. D 10.23.107.96/27 [90/2345] via 172.16.1.9
- D. D 10.23.107.112/28 [90/3456] via 172.16.1.13

> **Official Correct Answer**: **D** — D: D 10.23.107.112/28 [90/3456] via 172.16.1.13  
> **Technical Explanation**: In this case, three routes match the packet’s destination IP address: the route to 10.23.107.0/25 (A), the route to 10.23.107.96/27 (C), and the route to 10.23.107.112/28 (D). The route to 10.23.107.112/28 has the longest prefix length, so it is the most specific matching route; the router will forward the packet according to that route’s instructions.


---

### Question 13: R1’s G0/1 interface has the IP address 192.168.209.101/30.  Which of the following **network** commands would activate OSPF on the interface? (select all that apply)
- A. **network 192.168.209.100 0.0.0.3 area 0**
- B. **network 192.168.209.101 0.0.0.0 area 0**
- C. **network 192.168.0.0 0.0.255.255 area 0**

> **Official Correct Answer**: **A** — A: **network 192.168.209.100 0.0.0.3 area 0**  
> **Technical Explanation**: B: **network 192.168.209.101 0.0.0.0 area 0** C: **network 192.168.0.0 0.0.255.255 area 0** The OSPF **network** command is quite flexible; as long as the appropriate bits match between the interface’s IP address and the address in the **network** command (those indicated by a “0” bit in the wildcard mask), OSPF will be activated on the interface. In this case, all three **network** statements match the appropriate bits in the interface’s IP address, so all three commands would activate OSPF on the interface.

