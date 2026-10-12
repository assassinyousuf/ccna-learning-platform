# Assessment & Review: Volume 2 Chapter 3 - Chapter 3: Domain Name System

### Question 1: Which part of the URL “https://www.jeremysitlab.com/ccna-resources” is the authority?
- A. https
- B. www.jeremysitlab.comC. /ccna-resources
- D. www.jeremysitlab.com/ccna-resources

> **Official Correct Answer**: **B** — B: www.jeremysitlab.com  
> **Technical Explanation**: In a URL, the authority specifies the domain name or IP address of the server where the resource is hosted. In this case, “www.jeremysitlab.com” is the authority.


---

### Question 2: What is the TLD of “mail.google.com.”?
- A. mail
- B. google
- C. com
- D. .

> **Official Correct Answer**: **C** — C: com  
> **Technical Explanation**: Domains that are immediately under the root (which is represented by “.”) are called top-level domains (TLDs). In this URL, the TLD is “com”. Other common TLDs include “net”, “org”, “edu”, etc.


---

### Question 3: Which kind of DNS server holds the definitive set of records for a specific domain?
- A. Domain DNS server
- B. Authoritative DNS server
- C. Definitive DNS server
- D. Root DNS server

> **Official Correct Answer**: **B** — B: Authoritative DNS server  
> **Technical Explanation**: The DNS server that holds the definitive set of records for a specific domain is called an “authoritative DNS server”.


---

### Question 4: Which kind of DNS query asks for a definite answer (the IP address or an error message)?
- A. Iterative DNS
- B. Definitive DNS
- C. Authoritative DNS
- D. Recursive DNS

> **Official Correct Answer**: **D** — D: Recursive DNS  
> **Technical Explanation**: A recursive DNS query expects a definite answer from the DNS server. If the DNS server does not have the answer, it will query other DNS servers until it finds the answer, or reply with an error message if it can’t.


---

### Question 5: A recursive resolver receives a query for a domain name that does not exist in its cache. What kind of DNS query does the recursive resolver send to the root server to resolve the domain name?
- A. Iterative DNS
- B. Definitive DNS
- C. Authoritative DNS
- D. Recursive DNS

> **Official Correct Answer**: **A** — A: Iterative DNS  
> **Technical Explanation**: When a recursive resolver sends a query to a root server, it typically performs an iterative query. The root server responds with a referral to a TLD server, and the recursive resolver continues querying down the DNS hierarchy to find the answer.


---

### Question 6: Which of the following DNS record type descriptions are correct? (select three)
- A. A: Points to an IPv6 address
- B. CNAME: Points to another domain name
- C. PTR: Used for reverse DNS lookups
- D. NS: Specifies the domain’s mail server(s)
- E. AAAA: Points to an IPv4 address
- F. SOA: Provides administrative information such as admin contact

> **Official Correct Answer**: **B** — B: CNAME: Points to another domain name  
> **Technical Explanation**: C: PTR: Used for reverse DNS lookups F: SOA: Provides administrative information such as admin contact A CNAME record maps a domain name to another domain name. PTR records are used for reverse DNS lookups and map an IP address to a domain name. SOA records provide administrative information such as admin contact details, a serial number, etc. The others are incorrect: An A record points to an IPv4 address, an NS record specifies the domain’s authoritative DNS server(s), and a AAAA record points to an IPv6 address.


---

### Question 7: Which command allows a Cisco IOS device to respond to DNS queries?
- A. ip domain-lookup
- B. ip name-server
- C. dns-server
- D. ip dns server

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: The ip dns server command enables a Cisco router to act as a DNS server, allowing it to respond to DNS queries.


---

### Question 8: Which configuration is needed on a Cisco router for it to forward DNS request packets between a PC and a DNS server?
- A. ip dns server
- B. ip domain-lookup
- C. ip name-server 8.8.8.8
- D. No DNS configuration is needed.

> **Official Correct Answer**: **D** — D: No DNS configuration is needed.  
> **Technical Explanation**: For a Cisco router to forward DNS requests, no specific DNS configuration is needed. The router will simply forward these packets based on its routing table. The ip dns server , ip domain-lookup , and ip nameserver commands are used for different DNS functionalities on the router itself, not for forwarding DNS requests.

