# Assessment & Review: Volume 2 Chapter 2 - Chapter 2: Network Time Protocol

### Question 1: The output of show clock shows an asterisk ( \* ) before the time. What is the significance of this asterisk?
- A. The device’s clock was manually configured.
- B. The time was learned via NTP.
- C. The time is considered trustworthy.
- D. The time is not authoritative.

> **Official Correct Answer**: **D** — D: The time is not authoritative.  
> **Technical Explanation**: An asterisk before the time, such as \*08:56:18.831 UTC Mon Aug 28 2023 , means that the clock’s time is not authoritative—not considered to be accurate. This disappears after manually setting the time or syncing to an NTP server.


---

### Question 2: Which command manually configures a Cisco device’s clock?
- A. R1# clock set 12:45:00 January 19 2024
- B. R1(config)# clock set 12:45:00 January 19 2024
- C. R1# clock time 12:45:00 January 19 2024
- D. R1(config)# clock time 12:45:00 January 19 2024

> **Official Correct Answer**: **A** — A: R1# clock set 12:45:00 January 19 2024  
> **Technical Explanation**: The command to set the software clock is clock set hh:mm:ss month day year . Note that the month and day arguments can be reversed: January 19 and 19 January are both valid.


---

### Question 3: Which kind of NTP server operates as both an NTP client and server?
- A. Reference server
- B. Primary server
- C. Secondary server

> **Official Correct Answer**: **C** — C: Secondary server  
> **Technical Explanation**: A secondary NTP server operates both as an NTP client (synchronizing its time with a more authoritative server) and as a server (providing the time to clients of its own).


---

### Question 4: Which of the following commands configures a Cisco device in NTP client/server mode?
- A. ntp master
- B. ntp server
- C. ntp client
- D. ntp peer

> **Official Correct Answer**: **B** — B: ntp server  
> **Technical Explanation**: The ntp server ip-address command configures a Cisco device in NTP client/server mode. The device will become an NTP client of the server specified in the command. It will also function as an NTP server, capable of providing the time to clients of its own. This makes the device a secondary NTP server.


---

### Question 5: R1 is an NTP client. The output of show ntp associations on R1 shows st: 3 . What does this output mean?
- A. R1 has a total of three NTP associations.
- B. R1’s NTP stratum is 3.
- C. R1 learns the time from a server whose NTP stratum is 3.

> **Official Correct Answer**: **C** — C: R1 learns the time from a server whose NTP stratum is 3.  
> **Technical Explanation**: The show ntp associations command lists the device’s NTP associations—NTP servers that it learns the time from. The st column lists the association’s NTP stratum. In this case, the value of 3 means that R1 learns the time from a server whose NTP stratum is 3.


---

### Question 6: Which command allows a Cisco device to function as an NTP server without being an NTP client?
- A. ntp master
- B. ntp server
- C. ntp primary-server
- D. ntp primary

> **Official Correct Answer**: **A** — A: ntp master  
> **Technical Explanation**: The ntp master command can be used to make the device function as an NTP server even if it isn’t an NTP client of another server. This command can be useful in isolated environments where an external NTP server isn’t available. It can also function as a backup; if the device loses connectivity to its NTP servers, it can still function as an NTP server and provide the time to its own clients.


---

### Question 7: Which commands are necessary to configure a Cisco IOS device as an NTP client, authenticating the server it learns the time from? (select three)
- A. ntp authentication
- B. ntp server 10.0.0.1 authenticate
- C. ntp authentication-key 1 md5 P3sSw!rd
- D. ntp trusted-key 1
- E. ntp server 10.0.0.1 key 1

> **Official Correct Answer**: **C** — C: ntp authentication-key 1 md5 P3sSw!rd  
> **Technical Explanation**: D: ntp trusted-key 1 The ntp authentication-key key-number md5 key command is necessary to create an authentication key. Then, ntp trusted-key key-number is necessary to identify the key as “trusted”. Finally, ntp server ip-address key key-number is necessary to specify that the key should be used to authenticate the specified server. The ntp authentication command is not necessary in this case, although some sources incorrectly state otherwise.


---

### Question 8: What is the default NTP stratum level of a Cisco router that has been configured with ntp master ?
- A. 5
- B. 6
- C. 7
- D. 8

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: 8 When a Cisco router is configured with ntp master without specifying a stratum level, it defaults to stratum 8.

