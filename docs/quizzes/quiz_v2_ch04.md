# Assessment & Review: Volume 2 Chapter 4 - Chapter 4: Dynamic Host Configuration Protocol

### Question 1: Which of the following DHCP messages are sent by a DHCP server? (select two)
- A. ACK
- B. DISCOVER
- C. REQUEST
- D. OFFER

> **Official Correct Answer**: **A** — A: ACK  
> **Technical Explanation**: D: OFFER In the standard Dynamic Host Configuration Protocol (DHCP) DISCOVER, OFFER, REQUEST, ACK (DORA) exchange, the DISCOVER and REQUEST messages are sent by the client, and the OFFER and ACK messages are sent by the server.


---

### Question 2: When configuring a DHCP pool, which of the following DHCP settings is configured in global configuration mode?
- A. The range of addresses to assign to clients
- B. The excluded address range(s)
- C. The default gateway
- D. The DNS server

> **Official Correct Answer**: **B** — B: The excluded address range(s)  
> **Technical Explanation**: When configuring a DHCP pool on a Cisco router, most settings are configured in DHCP configuration mode (accessed with ip dhcp pool name ). However, any ranges of excluded addresses—addresses that should not be leased to clients—must be configured in global configuration mode with ip dhcp excluded-address low-ip high-ip .


---

### Question 3: Which of the following commands configures a Cisco router as a DHCP client?
- A. R1(config-if)# ip address dhcp
- B. R1(config-if)# ip dhcp client
- C. R1(config)# ip address dhcp
- D. R1(config)# ip dhcp client

> **Official Correct Answer**: **A** — A: R1(config-if)# ip address dhcp  
> **Technical Explanation**: To configure a Cisco router interface to obtain its IP address via DHCP, use the ip address dhcp command in interface configuration mode. The router will send DHCP DISCOVER messages out of the interface to attempt to lease an IP address.


---

### Question 4: Which command displays the list of clients that a Cisco router, functioning as a DHCP server, has leased addresses to using DHCP?
- A. show ip dhcp table
- B. show ip dhcp binding
- C. show ip dhcp server
- D. show ip dhcp database

> **Official Correct Answer**: **B** — B: show ip dhcp binding  
> **Technical Explanation**: The show ip dhcp binding command displays the current address bindings and lease times for a Cisco router operating as a DHCP server.


---

### Question 5: R1’s G0/1 interface is connected to the WAN and G0/2 is connected to a LAN with DHCP clients. Where should the ip helper-address command be configured to make R1 function as a DHCP relay agent?
- A. Interface configuration mode for G0/1
- B. Interface configuration mode for G0/2
- C. Global configuration mode
- D. DHCP configuration mode

> **Official Correct Answer**: **B** — B: Interface configuration mode for G0/2  
> **Technical Explanation**: To configure R1 as a DHCP relay agent, the ip helper-address ip-address command should be applied to the LAN-facing interface (G0/2). This command forwards clients’ broadcast DHCP messages received on the interface to the DHCP server specified in the command.


---

### Question 6: Which command shows detailed information about a Windows host’s network configuration?
- A. ipconfig
- B. ipconfig /detail
- C. ipconfig /verbose
- D. ipconfig /all

> **Official Correct Answer**: **D** — D: ipconfig /all  
> **Technical Explanation**: The ipconfig /all command in Windows displays detailed information about the host’s network configuration, including IP address, subnet mask, default gateway, DNS servers, and DHCP status.


---

### Question 7: Which command can be used to clear all of a router’s DHCP bindings?
- A. clear ip dhcp binding all
- B. clear ip dhcp binding
- C. clear ip dhcp binding \*
- D. clear ip dhcp binding dynamic

> **Official Correct Answer**: **C** — C: clear ip dhcp binding *  
> **Technical Explanation**: The clear ip dhcp binding \* command is used to clear all dynamic DHCP bindings from a Cisco router’s DHCP server database.


---

### Question 8: Which of the following DHCP messages are always broadcast? (select two)
- A. OFFER
- B. REQUEST
- C. DISCOVER
- D. ACK

> **Official Correct Answer**: **B** — B: REQUEST  
> **Technical Explanation**: In the DHCP DORA exchange, messages sent by clients (DISCOVER and REQUEST) are always broadcast. Messages sent by the server can be either unicast or broadcast, depending on what the client indicates in its messages. C: DISCOVER

