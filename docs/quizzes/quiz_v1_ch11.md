# Assessment & Review: Volume 1 Chapter 11 - Chapter 11: Subnetting IPv4 networks

### Question 1: Given a /25 address block, what prefix length is appropriate to create 16 subnets of equal size?
- A. /27
- B. /28
- C. /29
- D. /30

> **Official Correct Answer**: **C** — C: /29  
> **Technical Explanation**: To create 16 subnets, you need to borrow 4 bits from the host portion (since 2<sup>4</sup>  = 16). This results in a /29 prefix length, adding 4 to the original /25 prefix length.


---

### Question 2: Given a /23 address block, how many subnets can you create that support at least 16 usable host addresses in each subnet?
- A. 8 subnets
- B. 16 subnets
- C. 32 subnets
- D. 64 subnets

> **Official Correct Answer**: **B** — B: 16 subnets  
> **Technical Explanation**: A /23 address block has 9 host bits (32 − 23 = 9). To support at least 16 usable host addresses, 5 host bits are needed, which supports 2<sup>5</sup> − 2 = 30 host addresses. 9 host bits minus the 5 needed for host addresses leaves 4 bits that you can borrow to make subnets, allowing for 2<sup>4</sup> = 16 subnets.


---

### Question 3: A server’s IP address is 172.19.209.178/29.  What is the network address of its subnet?
- A. 172.19.209.168
- B. 172.19.209.176
- C. 172.19.209.180
- D. 172.19.209.192

> **Official Correct Answer**: **B** — B: 172.19.209.176  
> **Technical Explanation**: To calculate this, write the final octet in binary: 0d178 = 0b10110010. Then, change the bits of the host portion (the last 3 bits) all to 0: 10110000. Then convert back to decimal: 0b10110000 = 0d176. Therefore, the network address is 172.19.209.176.


---

### Question 4: PC1’s IP address is 192.168.222.101/26.  What is the broadcast address of its subnet?
- A. 192.168.222.127
- B. 192.168.222.128
- C. 192.168.222.255
- D. 192.168.222.254

> **Official Correct Answer**: **A** — A: 192.168.222.127  
> **Technical Explanation**: To calculate this, write the final octet in binary: 0d101 = 0b01100101. Then, change the bits of the host portion (the last 6 bits) all to 1: 01111111. Then convert back to decimal: 0b01111111 = 0d127. Therefore, the broadcast address is 192.168.222.127.


---

### Question 5: Given a /12 address block, how many subnets can you create that support at least 200 usable host addresses in each subnet?
- A. 512 subnets
- B. 1024 subnets
- C. 2048 subnets
- D. 4096 subnets

> **Official Correct Answer**: **D** — D: 4096 subnets  
> **Technical Explanation**: A /12 address block has 20 host bits (32 − 12 = 20). To create subnets that support at least 200 usable host addresses, 8 host bits are needed (2<sup>8</sup> − 2 = 254). That leaves 12 bits that you can borrow to make subnets (20 − 8 = 12), allowing for $2 ^ { 1 2 } = 4 0 9 6$ subnets.


---

### Question 6: Given a /15 address block, what prefix length is appropriate to create 1024 subnets of equal size?
- A. /25
- B. /24
- C. /23
- D. /22

> **Official Correct Answer**: **A** — A: /25  
> **Technical Explanation**: Making 1024 subnets requires 10 borrowed bits (since $2 ^ { 1 0 } = 1 0 2 4 )$ . Therefore, the answer is /25, adding 10 to the original /15 prefix length.


---

### Question 7: A printer’s IP address is 10.109.211.107/28.  What is the network address of its subnet?
- A. 10.109.211.106
- B. 10.109.211.96
- C. 10.109.211.112
- D. 10.109.211.104

> **Official Correct Answer**: **B** — B: 10.109.211.96  
> **Technical Explanation**: To calculate the network address, write the final octet in binary: 0d107 = 0b01101011. Then, change the hosts bits (the final 4 bits) to 0: 01100000. Finally, convert back to decimal: 0b01100000 = 0d96. Therefore, the network address is 10.109.211.96.


---

### Question 8: R1’s IP address is 203.0.113.237/27.  What is the broadcast address of its subnet?
- A. 203.0.113.238
- B. 203.0.113.239
- C. 203.0.113.247
- D. 203.0.113.255

> **Official Correct Answer**: **D** — D: 203.0.113.255  
> **Technical Explanation**: To determine the broadcast address, write the final octet in binary: 0d237 = 0b11101101. Then, change the host bits (the last 5 bits) to 1: 11111111. Then, convert back to decimal: 0b11111111 = 0d255. Therefore, the broadcast address is 203.0.113.255.


---

### Question 9: You have been given the 192.168.27.0/24 address block to create subnets of appropriate sizes for your organization.  You have already assigned the first subnet to support 109 hosts. The second subnet must support 60 hosts.  What is the usable host address range of the second subnet?
- A. 192.168.27.129 to 192.168.27.190
- B. 192.168.27.65 to 192.168.27.126
- C. 192.168.27.128 to 192.168.27.191
- D. 192.168.27.129 to 192.168.27.254

> **Official Correct Answer**: **A** — A: 192.168.27.129 to 192.168.27.190  
> **Technical Explanation**: The first subnet, which must support 109 hosts, is 192.168.27.0/25 (a /25 prefix length leaves 7 host bits and supports 2<sup>7</sup> − 2 = 126 hosts). The second subnet, which must support 60 hosts, should use a /26 prefix length (leaving 6 hosts bits and supporting 2<sup>6</sup> − 2 = 62 hosts). Therefore, the second subnet is 192.168.27.128/26, with a usable address range of 192.168.27.129–192.168.27.190.


---

### Question 10: You have been given the 10.0.2.0/23 address block to create subnets of appropriate sizes for your organization.  You have already assigned the first subnet to support 40 hosts. The second subnet must support 29 hosts.  What is the broadcast address of the second subnet?
- A. 10.0.2.111
- B. 10.0.2.79
- C. 10.0.2.95
- D. 10.0.2.127

> **Official Correct Answer**: **C** — C: 10.0.2.95  
> **Technical Explanation**: The first subnet must use a /26 prefix length, which leaves 6 host bits, to support 40 hosts $( 2 ^ { 6 }$ $- 2 = 6 2 )$ ; it is 10.0.2.0/26. The second subnet should use a /27 prefix length, leaving 5 hosts bits and supporting $2 ^ { 5 } - 2 = 3 0$ hosts. Therefore, the second subnet is 10.0.2.64/27, and its broadcast address is 10.0.2.95 (host bits all set to 1).

