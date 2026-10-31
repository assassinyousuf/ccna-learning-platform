# Assessment & Review: Volume 2 Chapter 22 - Chapter 22: Network automation

### Question 1: Which logical plane is responsible for routers exchanging BGP messages with each other to share routing information and build their routing tables?
- A. Management Plane
- B. Control Plane
- C. Data Plane

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B: Control Plane The Control Plane is responsible for the exchange of routing protocol messages, like BGP, between routers. This plane handles the logic needed to build and maintain routing tables and other tables necessary for forwarding messages.


---

### Question 2: Which logical plane is responsible for a switch examining the source MAC address of each frame it receives and creating MAC address table entries?
- A. Management Plane
- B. Control Plane
- C. Data Plane

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## B: Control Plane The Control Plane in a switch is responsible for examining the source MAC addresses of incoming frames and creating MAC address table entries, which are used for making forwarding decisions. The forwarding decisions themselves are the role of the Data Plane.


---

### Question 3: Which logical plane is responsible for a switch examining the destination MAC address of each frame it receives and making a forwarding/flooding decision?
- A. Management Plane
- B. Control Plane
- C. Data Plane

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: Data Plane The Data Plane (or Forwarding Plane) in a switch is responsible for examining the destination MAC addresses of incoming frames and making forwarding or flooding decisions based on this information. Any activities related to the actual forwarding of messages are the responsibility of the Data Plane.


---

### Question 4: Which of the following planes are distributed in a traditional (non-SDN) network? (select all that apply)
- A. Management Plane
- B. Control Plane
- C. Data Plane

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: In a traditional network architecture, all three planes are distributed. Each network device is managed individually, builds its own tables for forwarding traffic, and makes independent forwarding decisions.


---

### Question 5: Which of the following statements about SDN architecture are true? (select two)
- A. The Data Plane is distributed
- B. The Control Plane is distributed
- C. The Data Plane is centralized
- D. The Control Plane is centralized

> **Official Correct Answer**: **A** — A: The Data Plane is distributed  
> **Technical Explanation**: D: The Control Plane is centralized In software-defined networking (SDN) architecture, the Data Plane remains distributed; each network device is responsible for forwarding messages across the network. The Control Plane, on the other hand, is centralized in the SDN controller, which is responsible for providing instructions about how to forward messages to the network devices.


---

### Question 6: Which type of API is most common in the NBI of SDN architecture?
- A. OpenFlow
- B. REST
- C. NETCONF
- D. OpFlex

> **Official Correct Answer**: **B** — B: REST  
> **Technical Explanation**: In the northbound interface (NBI) of an SDN controller, representational state transfer (REST) APIs are commonly used, allowing applications to programmatically interact with the controller.


---

### Question 7: Which SDN interface is used to communicate with the managed devices?
- A. NBI
- B. SBI
- C. HTTP
- D. Application

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: The southbound interface (SBI) of an SDN controller is used to communicate with the managed devices. The name comes from how SDN architecture is usually illustrated, with the Application Layer at the top, the Control Layer in the middle, and the Infrastructure Layer (where the managed devices are located) at the bottom.


---

### Question 8: Which SDN architecture layer contains the network devices responsible for forwarding messages across the network?
- A. Application Layer
- B. Transport Layer
- C. Control Layer
- D. Infrastructure Layer

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: The Infrastructure Layer in SDN architecture contains the physical and virtual network devices responsible for forwarding messages across the network. This layer is where the Data Plane’s forwarding of messages takes place.


---

### Question 9: Which Cisco SDN solution takes advantage of spine-leaf architecture?
- A. ACI
- B. SD-Access
- C. SD-WAN
- D. SD-DC

> **Official Correct Answer**: **A** — A: ACI  
> **Technical Explanation**: Cisco’s Application-Centric Infrastructure (ACI) uses a spine-leaf architecture, optimizing east-west communication between servers in a data center.


---

### Question 10: Which of the following are Management Layer protocols? (select two)
- A. SSH
- B. NTP
- C. STP
- D. ARP

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Secure Shell (SSH) and Network Time Protocol (NTP) are protocols used in the management layer of network systems. SSH provides secure access to the CLI of network devices, and NTP ensures accurate time synchronization across the network.


---

### Question 11: Which of the following is not a benefit of network automation?
- A. Reduced human error
- B. Reduced time to configure devices
- C. Reduced OpEx
- D. Reduced CapEx

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: While network automation can lead to reduced operating expenses (OpEx) through efficiency and reduced human error, it doesn’t directly lead to reduced (capital expenses (CapEx). CapEx is typically associated with investments in equipment and infrastructure.


---

### Question 12: Which type of machine learning involves labeled data sets?
- A. Supervised learning
- B. Unsupervised learning
- C. Reinforcement learning

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: Supervised learning is a type of machine learning (and deep learning) that involves labeled data sets. This is highly effective when clear and accurate labels are available, enabling precise predictions and classifications.


---

### Question 13: Which of the following can be provided by predictive AI?
- A. Device configuration generation
- B. Automated network diagrams
- C. Network traffic forecasting
- D. Automated network design

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: AI models can analyze network traffic to predict future network load, allowing for proactive provisioning of additional resources or QoS policy optimization.


---

### Question 14: Which Catalyst Center AI feature can be used to automate troubleshooting?
- A. Machine reasoning
- B. AI endpoint analytics
- C. AI enhanced RRM
- D. AI remediation

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: Machine reasoning Catalyst Center’s Machine reasoning (MR) engine automates network troubleshooting, performing a root cause analysis when issues arise and potentially resolving problems without requiring manual intervention.

