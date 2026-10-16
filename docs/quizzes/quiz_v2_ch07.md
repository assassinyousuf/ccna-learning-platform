# Assessment & Review: Volume 2 Chapter 7 - Chapter 7: Syslog

### Question 1: Which command enables logging to an external Syslog server with the informational severity level and higher?
- A. logging host 5
- B. logging host 6
- C. logging trap 5
- D. logging trap 6

> **Official Correct Answer**: **D** — D: logging trap 6  
> **Technical Explanation**: The logging trap [ severity ] command can be used to control the severity level of messages logged to a Syslog server. “Informational” is severity level 6, so the logging trap 6 command enables logging to an external Syslog server with the informational severity level and higher.


---

### Question 2: Which of the following Syslog severity level and IOS keyword pairs are correct? (select three)
- A. informational = 6
- B. warnings = 3
- C. errors = 4
- D. alerts = 2
- E. critical = 1
- F. emergencies = 0 G. notifications = 5

> **Official Correct Answer**: **A** — A: informational = 6  
> **Technical Explanation**: F: emergencies = 0 G: notifications = 5 Here are the Syslog severity levels in order: emergencies = 0 alerts = 1 critical = 2 • errors = 3 warnings = 4 notifications = 5 informational = 6 debugging = 7


---

### Question 3: Which command is necessary to enable real-time logging to the VTY lines for the current session?
- A. R1# logging monitor
- B. R1# terminal monitor
- C. R1(config)# logging monitor
- D. R1(config)# terminal monitor

> **Official Correct Answer**: **B** — B: R1# terminal monitor  
> **Technical Explanation**: The command terminal monitor is used in the command-line interface to enable real-time logging to the VTY lines for the current session. Although the logging monitor command enables/disables logging to the VTY lines, terminal monitor must be used to enable it for the current session.


---

### Question 4: Which of the following statements accurately describes the effect of the logging buffered notifications command?
- A. Logs of severity level 5 and numerically higher will be logged.
- B. Logs of severity level 5 and numerically lower will be logged.
- C. Logs of severity level 5 will be logged.

> **Official Correct Answer**: **B** — B: Logs of severity level 5 and numerically lower will be logged.  
> **Technical Explanation**: logging buffered notifications enables logging at severity level 5. However, it doesn’t only enable logging of messages of severity level 5; it enables logging of all messages with a severity level of 5 and numerically lower (more severe). So, the command enables logging of messages of severity levels 0–5.


---

### Question 5: What is the facility of the Syslog message Jan 20 08:05:52: %LINK-3-UPDOWN: Interface GigabitEthernet0/2, changed state to up ?
- A. LINK
- B. 3
- C. UPDOWN
- D. Interface GigabitEthernet0/2, changed state to up

> **Official Correct Answer**: **A** — A: LINK  
> **Technical Explanation**: The format of a Syslog message is seq:timestamp: %facility-severity-mnemonic: description . In this case, LINK in the facility, indicating the service, application, or other component of the device that generated the message.


---

### Question 6: What is the mnemonic of the Syslog message Jan 20 08:36:29: %SYS-5-CONFIG\_I: Configured from console by jeremy on vty3 (192.168.1.224) ?
- A. SYS
- B. 5
- C. CONFIG\_I
- D. Configured from console by jeremy on vty3 (192.168.1.224)

> **Official Correct Answer**: **C** — C: CONFIG_I  
> **Technical Explanation**: CONFIG\_I is the mnemonic of this Syslog message, a short text string providing a brief description of the event that triggered the Syslog message. In this case, we know it is something related to the configuration of the device.


---

### Question 7: Which command specifies an external Syslog server to send log messages to?
- A. logging server 10.0.0.10
- B. logging trap 10.0.0.10
- C. logging external 10.0.0.10
- D. logging host 10.0.0.10

> **Official Correct Answer**: **D** — D: logging host 10.0.0.10  
> **Technical Explanation**: Although the logging trap command is used to enable/disable logging to external Syslog servers, the logging host ip-address command is used to specify a Syslog server to send log messages to.


---

### Question 8: Which severity levels will be logged to the console line as a result of the logging console 2 command? (select three)
- A. Alerts
- B. Errors
- C. Warnings
- D. Emergencies
- E. Notifications
- F. Critical

> **Official Correct Answer**: **A** — A: Alerts  
> **Technical Explanation**: D: Emergencies F: Critical The logging console 2 command configures the console to log messages with a severity of critical (level 2) and numerically lower, which includes alerts (level 1) and emergencies (level 0).

