# Assessment & Review: Volume 1 Chapter 9 - Chapter 9: Routing fundamentals

### Question 1: After configuring an IP address on and enabling a router interface, which route(s) will be automatically added to the router’s routing table?
- A. C and L
- B. L
- C. S and C
- D. C

> **Official Correct Answer**: **A** — A: C and L  
> **Technical Explanation**: When an IP address is configured on an active router interface, two types of routes are automatically added to the router’s routing table: a connected route (C) and a local route (L). The connected route indicates the network directly connected to the router, and the local route indicates the exact IP address of the router’s interface with a /32 prefix length.


---

### Question 2: Which type of route represents the exact IP address of a router’s interface with a /32 prefix length?
- A. S
- B. L
- C. C
- D. O

> **Official Correct Answer**: **B** — B: L  
> **Technical Explanation**: A local (L) route in the routing table represents the exact IP address of a router’s interface with a /32 prefix length. A local route is automatically created by the router for each of its active interfaces.


---

### Question 3: If a packet’s destination IP address doesn’t match any routes in the routing table, what action will the router take on the packet?
- A. It will drop the packet.
- B. It will broadcast the packet out of all interfaces.
- C. It will use ARP to identify the next hop.
- D. It will receive the packet for itself.

> **Official Correct Answer**: **A** — A: It will drop the packet.  
> **Technical Explanation**: If a packet’s destination IP address does not match any entries in the router’s routing table, the router doesn’t know how to forward the packet. As a result, the router will drop the packet. Routers don’t flood messages like switches.


---

### Question 4: Which of the following is a host route?
- A. A route to 10.0.0.0/8
- B. A route to 203.0.113.0/24
- C. A route to 8.8.8.8/32
- D. A route to 172.25.0.0/16

> **Official Correct Answer**: **C** — C: A route to 8.8.8.8/32  
> **Technical Explanation**: A host route is a route to a single IP address, represented by a /32 prefix length. The route to 8.8.8.8/32 is a host route as it specifies a single IP address: 8.8.8.8.


---

### Question 5: Which of the following commands configures a recursive static route?
- A. **ip route 10.0.0.0 255.0.0.0 gigabitethernet0/0**
- B. **ip route 10.0.0.0 255.0.0.0 192.168.1.1**
- C. **ip route 10.0.0.0 255.0.0.0 gigabitethernet0/0 192.168.1.1**

> **Official Correct Answer**: **B** — B: **ip route 10.0.0.0 255.0.0.0 192.168.1.1**  
> **Technical Explanation**: A recursive static route specifies the next-hop IP address, not the exit interface. It is “recursive” because it requires an additional routing table lookup: after the router has determined the nexthop IP address, it must perform an additional lookup to determine which interface the next hop is connected to.


---

### Question 6: Which route in its routing table will a router select to forward a packet?
- A. The most specific matching route
- B. The route with the longest prefix length
- C. The route with the shortest prefix length
- D. The route that matches the most IP addresses

> **Official Correct Answer**: **A** — A: The most specific matching route  
> **Technical Explanation**: When forwarding a packet, a router will choose the most specific matching route in its routing table; this is the matching route with the longest prefix length.


---

### Question 7: Which of the following commands configures a default route?
- A. **ip route 0.0.0.0 0.0.0.0 203.0.113.1**
- B. **ip route 8.0.0.0 255.255.255.0 default**
- C. **ip route default 203.0.113.1**

> **Official Correct Answer**: **A** — A: **ip route 0.0.0.0 0.0.0.0 203.0.113.1**  
> **Technical Explanation**: A default route is a route to 0.0.0.0/0—a route that matches all possible IP addresses. When the router has a default route in its routing table, it will use the route to forward packets that don’t match any more specific routes.


---

### Question 8: Which of the following static routes relies on proxy ARP?
- A. **ip route 5.0.0.0 255.0.0.0 192.0.2.2**
- B. **ip route 5.0.0.0 255.0.0.0 gigabitethernet0/1**
- C. **ip route 5.0.0.0 255.0.0.0 gigabitethernet0/2 203.0.113.2**

> **Official Correct Answer**: **B** — B: **ip route 5.0.0.0 255.0.0.0 gigabitethernet0/1**  
> **Technical Explanation**: This route relies on proxy ARP because it specifies only the exit interface; it’s a directly connected static route. This makes the router behave as if it were directly connected to the destination, and it will therefore send an ARP request directly to the destination IP address (instead of to the next-hop router’s IP address). This will only work if the next-hop router has proxy ARP enabled and can reply to the ARP request.

