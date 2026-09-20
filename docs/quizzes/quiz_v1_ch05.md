# Assessment & Review: Volume 1 Chapter 5 - Chapter 5: The Cisco IOS CLI

### Question 1: What kind of cable is typically used to connect to the console port of a Cisco router or switch?
- A. Fiber-optic
- B. Crossover
- C. Straight-through
- D. Rollover

> **Official Correct Answer**: **D** — D: Rollover  
> **Technical Explanation**: A rollover cable is typically used to connect a computer to the console port of a Cisco router or switch. This cable has a unique pinout where the wire connected to pin 1 on one end is connected to pin 8 on the other end, pin 2 to pin 7, pin 3 to pin 6, etc.


---

### Question 2: What mode in the IOS hierarchy is indicated by the prompt hostname>?
- A. Privileged EXEC mode
- B. Global configuration mode
- C. User EXEC mode
- D. Enable mode

> **Official Correct Answer**: **C** — C: User EXEC mode  
> **Technical Explanation**: The prompt hostname> indicates that the device is in User EXEC mode. This mode provides limited access to the device and doesn’t support any configurations or disruptive commands.


---

### Question 3: Which of the following commands can be used to return to privileged EXEC mode from global configuration mode? (select two)
- A. **disable**
- B. **exit**
- C. **escape**
- D. **end**

> **Official Correct Answer**: **B** — B: **exit**  
> **Technical Explanation**: D: **end** The **exit** command returns you to the previous level in the IOS hierarchy, which, from global configuration mode, would be privileged EXEC mode. The **end** command also takes you directly back to privileged EXEC mode from any point in the configuration hierarchy.


---

### Question 4: Which command can be used to view the device’s active configuration from global configuration mode?
- A. **do show running-config**
- B. **show running-config**
- C. **do show startup-config**
- D. **show startup-config**

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: do show running-config The running-config is the device’s active configuration—the configuration that determines the device’s current operation—and it can be viewed with **show running-config**. To use **show** commands from global config mode, you must add **do** in front of the command. ## 5.  Where is a device’s startup-config file stored? ## C: NVRAM The startup configuration file of a Cisco device is stored in Non-Volatile Random-Access Memory (NVRAM). Unlike standard RAM, NVRAM retains its contents even when the device is powered off.


---

### Question 5: Where is a device’s startup-config file stored?
- A. Flash
- B. RAM
- C. NVRAM

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 6: Which of the following commands cannot be used to save a device’s configuration?
- A. **write**
- B. **write memory**
- C. **copy running-config startup-config**
- D. **copy startup-config running-config**

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: copy startup-config running-config To save a device’s configuration, you must copy the contents of the running-config in RAM to the startup-config in NVRAM, but this command does the opposite. It copies the contents of the startup-config to the running-config.


---

### Question 7: Which of the following commands configures a password to limit access to privileged EXEC mode and stores the password as a secure hash?
- A. **enable password password**
- B. **enable secret password**
- C. **service password-encryption**
- D. **exec password password**

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B: enable secret password The “enable secret” is a password for accessing privileged EXEC mode. The device stores the enable secret as a secure hash, providing better security than the “enable password”.


---

### Question 8: What is the effect of the **service passwordencryption** command?
- A. Currently configured passwords are encrypted.
- B. Passwords configured in the future will be encrypted.
- C. A and B
- D. None of the above

> **Official Correct Answer**: **C** — C: A and B  
> **Technical Explanation**: The **service password-encryption** command has two effects: it encrypts currently configured cleartext passwords and ensures that any passwords configured in the future are automatically encrypted. Note that this encryption is not secure, but it does provide basic protection against someone looking at the configuration over your shoulder.

