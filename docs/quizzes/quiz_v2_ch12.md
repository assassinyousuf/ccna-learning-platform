# Assessment & Review: Volume 2 Chapter 12 - Chapter 12: Port Security

### Question 1: After configuring switchport port-security on a port, how many MAC addresses can be learned on the port by default?
- A. 0
- B. 1
- C. 2
- D. Unlimited

> **Official Correct Answer**: **B** — B: 1  
> **Technical Explanation**: By default, when port security is enabled, a switch port is allowed to learn only one MAC address. If a frame from another MAC address arrives on the port, a Port Security violation is triggered.


---

### Question 2: You issue switchport port-security on a port and receive the following error message: Command rejected: FastEthernet0/1 is a dynamic port . What is the cause for this error?
- A. The port uses dynamic MAC address learning.
- B. The port uses a dynamic routing protocol.
- C. The port’s operational mode is determined by DTP.
- D. The port is a DHCP client.

> **Official Correct Answer**: **C** — C: The port’s operational mode is determined by DTP.  
> **Technical Explanation**: To enable Port Security on a port, you must manually configure it as an access or trunk port with switchport mode access trunk } . If the switch’s mode is dynamic auto or dynamic desirable (meaning it uses DTP to determine its operational mode), the switchport port-security command will be rejected.


---

### Question 3: Which of the following actions does a switch take by default when a Port Security violation occurs? (select three)
- A. Discard the violating frames
- B. Increment the violation counter
- C. Disable dynamic MAC address learning
- D. Re-enable previously disabled ports
- E. Error-disable the port

> **Official Correct Answer**: **A** — A: Discard the violating frames  
> **Technical Explanation**: B: Increment the violation counter E: Error-disable the port The default Port Security violation mode is “shutdown”. This means that, if a Port Security violation occurs on a port, the switch will discard violating frames, increment the violation counter, and error-disable the port— effectively shutting it down.


---

### Question 4: Which of the following is a difference between secure MAC addresses and regular MAC addresses in a switch’s MAC address table?
- A. Secure MAC addresses can be statically configured.
- B. Static secure MAC addresses age out by default.
- C. Dynamic secure MAC addresses don’t age out by default.
- D. Only one secure MAC address can be learned per port.

> **Official Correct Answer**: **C** — C: Dynamic secure MAC addresses don’t age out by default.  
> **Technical Explanation**: One key difference between secure MAC addresses and regular MAC addresses in a switch’s MAC address table is that dynamic secure MAC addresses configured for Port Security do not age out by default, while regular dynamic MAC addresses do age out after a certain period of inactivity.


---

### Question 5: Which command can be used to automatically re-enable a port disabled by Port Security?
- A. errdisable recovery cause port-security
- B. errdisable recovery cause psec-shutdown
- C. errdisable recovery cause psec-disable
- D. errdisable recovery cause psecure-violation

> **Official Correct Answer**: **D** — D: errdisable recovery cause psecure-violation  
> **Technical Explanation**: The command to enable ErrDisable Recovery is errdisable recovery cause cause , and the keyword to enable it for ports disabled by Port Security is psecure-violation .


---

### Question 6: Which of the following commands causes dynamic secure MAC addresses to be saved in the device’s running-config?

```txt
- A. SW1(config)# switchport port-security mac-address sticky
- B. SW1(config)# switchport port-security sticky
- C. SW1(config-if)# switchport port-security mac-address sticky
- D. SW1(config-if)# switchport port-security sticky
```

> **Official Correct Answer**: **C** — C: SW1(config-if)# switchport port-security mac-address sticky  
> **Technical Explanation**: The switchport port-security mac-address sticky command in interface config mode enables the sticky learning feature, which saves dynamically-learned secure MAC addresses in the device’s running-config.


---

### Question 7: Which of the following MAC addresses will be removed from the MAC address table if the corresponding port goes down? (select all that apply)
- A. Sticky secure MAC addresses
- B. Dynamic secure MAC addresses
- C. Static secure MAC addresses
- D. Dynamic MAC addresses

> **Official Correct Answer**: **B** — B: Dynamic secure MAC addresses  
> **Technical Explanation**: D: Dynamic MAC addresses Both dynamic secure MAC addresses and regular dynamic MAC addresses are removed from the MAC address table when the corresponding port goes down. Sticky and static secure MAC addresses are not removed.


---

### Question 8: Which of the following commands configure a port to block frames from invalid MAC addresses without affecting valid traffic? (select two)

```txt
- A. switchport port-security violation guard
```

```txt
- B. switchport port-security violation protect
```
- C. switchport port-security violation restrict

> **Official Correct Answer**: **B** — B: switchport port-security violation protect  
> **Technical Explanation**: C: switchport port-security violation restrict The protect and restrict modes both drop packets with invalid source MAC addresses but continue to forward traffic from known MAC addresses.

