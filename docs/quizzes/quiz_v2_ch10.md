# Assessment & Review: Volume 2 Chapter 10 - Chapter 10: Quality of service

### Question 1: What does traffic shaping do?
- A. Buffer traffic that exceeds the configured rate limit
- B. Drop traffic that exceeds the configured rate limit
- C. Decide the order in which queued packets are transmitted
- D. Categorize packets according to their markings

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Official answer: . Review the chapter concepts to master this exam topic.


---

### Question 2: Which of the following often leads to TCP global synchronization?
- A. WRED
- B. RED
- C. Tail drop
- D. Jitter

> **Official Correct Answer**: **C** — C: Tail drop  
> **Technical Explanation**: Tail drop, which occurs when packets are dropped from the end of a full queue, can lead to TCP global synchronization, where multiple TCP flows reduce their window sizes simultaneously, leading to network underutilization. This can lead to a global TCP window size increase, leading to congestion and tail drop again— a vicious cycle. Random Early Detection (RED) and Weighted RED (WRED) are techniques to avoid tail drop, not causes of it.


---

### Question 3: Which QoS feature modifies specific fields in the Layer-2 and Layer-3 headers to facilitate the categorization of messages?
- A. Classification
- B. Scheduling
- C. Marking
- D. Queuing

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: Marking Marking modifies fields in Layer-2 (CoS) and Layer-3 (DSCP) headers, making the classification of messages for QoS much simpler.


---

### Question 4: Which feature would an ISP’s customer likely implement to avoid exceeding the ISP’s rate limit?
- A. Marking
- B. Policing
- C. Scheduling
- D. Shaping

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: Shaping Traffic shaping is often used to control traffic rates to comply with ISP-imposed rate limits, buffering and delaying excess traffic. The ISP, on the other hand, often uses policing to strictly enforce the configured rate limit.


---

### Question 5: Which QoS feature involves identifying the traffic type of a particular packet?
- A. Identification
- B. Classification
- C. Queuing
- D. Marking

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B: Classification Classification identifies the traffic type of a packet based on defined criteria, such as the marking in the DSCP field of the IP header.


---

### Question 6: Which of the following markings indicates a high priority and a high drop precedence?
- A. AF11

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## D: AF43 AF43 (Assured Forwarding class 4, drop precedence 3) indicates high priority but also a high likelihood of being dropped in times of congestion. AF defines four priority classes (1–4) and three drop precedence values (1–3).


---

### Question 7: Which QoS feature drops or re-marks traffic that exceeds the configured rate limit?
- A. Policing
- B. Shaping
- C. Marking
- D. Buffering

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: Policing Policing drops or re-marks traffic that exceeds a configured rate limit, enforcing a strict bandwidth limit without buffering.


---

### Question 8: Which scheduling method combines a priority queue with a weighted round-robin scheduler?
- A. CBWFQ
- B. PQ
- C. EF
- D. LLQ

> **Official Correct Answer**: **D** — D: LLQ  
> **Technical Explanation**: Low Latency Queuing (LLQ) combines a strict Priority Queue (PQ) for high-priority traffic with Class-Based Weighted Fair Queuing (CBWFQ) for other traffic classes, using a weighted round-robin scheduler.


---

### Question 9: Which marking is typically used for voice call traffic?
- A. EF
- B. DF
- C. AF4x
- D. CS6

> **Official Correct Answer**: **A** — A: EF  
> **Technical Explanation**: The Expedited Forwarding (EF) marking is typically used for voice traffic to ensure low delay, jitter, and loss by treating these packets with high priority. When using LLQ, packets marked with EF are typically queued in the priority queue.


---

### Question 10: Which marking is typically used for best effort traffic?
- A. EF
- B. DF
- C. CS1
- D. AF3x

> **Official Correct Answer**: **B** — B: DF  
> **Technical Explanation**: Default Forwarding (DF) is the default marking for best effort traffic, indicating no special treatment or priority.


---

### Question 11: Which concept refers to the variation in delay?
- A. Latency
- B. Jitter
- C. Loss
- D. RTT

> **Official Correct Answer**: **B** — B: Jitter  
> **Technical Explanation**: Jitter refers to the variation in delay between packets, which can negatively affect user experience in real-time apps like voice and video calls.


---

### Question 12: Which command guarantees power to a PoE-enabled device connected to the port?
- A. power inline auto
- B. power inline static
- C. power inline police
- D. power inline port

> **Official Correct Answer**: **B** — B: power inline static  
> **Technical Explanation**: The power inline static command reserved a fixed amount of power for the specified port, ensuring the device connected to the port receives power.

