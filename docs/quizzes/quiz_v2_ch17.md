# Assessment & Review: Volume 2 Chapter 17 - Chapter 17: Virtualization and cloud

### Question 1: Which of the following virtualization technologies is installed directly on server hardware?
- A. Type 1 hypervisor
- B. Type 2 hypervisor
- C. Container

> **Official Correct Answer**: **A** — A: Type 1 hypervisor  
> **Technical Explanation**: A type 1 hypervisor is installed directly on server hardware, interacting directly with the physical hardware. Examples include VMware ESXi and Microsoft Hyper-V. Type 2 Hypervisors run on a host OS and are less efficient, suitable for testing or development. Containers offer OS-level virtualization, sharing the host’s kernel, but are not installed on server hardware directly.


---

### Question 2: Which of the following statements about type-2 hypervisors is true?
- A. The hypervisor interacts directly with the hardware resources.
- B. VMware ESXi is a popular type-2 hypervisor.
- C. The hypervisor is installed on a host OS.
- D. VMs running on a type-2 hypervisor don’t need to run their own OS.

> **Official Correct Answer**: **C** — C: The hypervisor is installed on a host OS.  
> **Technical Explanation**: A type-2 hypervisor runs on a host operating system rather than directly on the hardware. This makes it less efficient compared to a type-1 hypervisor, as it needs to go through the host OS to access hardware resources.


---

### Question 3: Which of the following statements about VRF is true?
- A. VRF enables the creation of virtual interfaces in a router.
- B. VRF creates multiple routing tables on a router.
- C. By default, hosts in different VRFs can communicate with each other.
- D. All interfaces are assigned to VRF 1 by default.

> **Official Correct Answer**: **B** — B: VRF creates multiple routing tables on a router.  
> **Technical Explanation**: Virtual Routing and Forwarding (VRF) allows a router to create multiple routing tables. In effect, this divides the router into multiple virtual routers, with each virtual router isolated from the others.


---

### Question 4: Which of the following cloud service models provides the most control to the customer?
- A. PaaS
- B. SaaS
- C. IaaS

> **Official Correct Answer**: **C** — C: IaaS  
> **Technical Explanation**: The infrastructure as a service (IaaS) model provides the most control to the customer. The cloud service provider offers the underlying infrastructure, on top of which customers can install virtual machines (VMs), install OSs, run applications, etc, customizing the CPU, RAM, and storage for each VM and configuring their interconnections to form a network.


---

### Question 5: Which cloud service model offers a complete software product to the customer?
- A. PaaS
- B. SaaS
- C. IaaS

> **Official Correct Answer**: **B** — B: SaaS  
> **Technical Explanation**: Software as a Service (SaaS) offers a complete software product to customers over the Internet. The software is hosted on cloud infrastructure, and users can typically access it through a web browser. Common examples are Microsoft 365 and Google Workspace.


---

### Question 6: AWS, Azure, and GCP are examples of what cloud deployment model?
- A. Commercial cloud
- B. Private cloud
- C. Public cloud
- D. Hybrid cloud

> **Official Correct Answer**: **C** — C: Public cloud  
> **Technical Explanation**: Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP) are examples of public cloud providers. They offer cloud resources over the internet, available for open use by the public (for a fee).


---

### Question 7: Which of the following are advantages of cloud computing? (select two)
- A. Reduced CapEx
- B. Reduced OpEx
- C. Greater control over infrastructure
- D. Simplified global scaling

> **Official Correct Answer**: **A** — A: Reduced CapEx  
> **Technical Explanation**: D: Simplified global scaling Cloud computing offers reduced capital expenditure (CapEx)—upfront costs—as it minimizes the need for physical hardware investments. Additionally, cloud computing simplifies global scaling, allowing businesses to quickly expand their computing resources over the globe as needed.


---

### Question 8: In the context of cloud computing, what is rapid elasticity?
- A. Measuring and charging based on each customer’s use of resources
- B. The ability to deploy cloud resource with a self-service model
- C. The ability to flexibly scale infrastructure according to need
- D. The ability to flexibly connect to cloud infrastructure via a variety of connection methods

> **Official Correct Answer**: **C** — C: The ability to flexibly scale infrastructure according to need  
> **Technical Explanation**: Rapid elasticity is a key feature of cloud computing, enabling businesses to quickly scale their IT resources up or down based on their current requirements.


---

### Question 9: In which model do customers rent space, cooling, electricity, etc, in a shared data center?
- A. SaaS
- B. IaaS
- C. Colocation
- D. On-prem

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## C: Colocation In colocation services, customers rent space, cooling, electricity, and other data center resources in a shared facility. They typically own the hardware and are responsible for managing their equipment within the data center.


---

### Question 10: Which of the following virtualization technologies is more lightweight, using fewer hardware resources?
- A. A container
- B. A VM running on a type-1 hypervisor
- C. A VM running on a type-2 hypervisor

> **Official Correct Answer**: **A** —   
> **Technical Explanation**: ## A: A container Containers are more lightweight and use fewer hardware resources compared to Virtual Machines (VMs). They share the host system’s kernel and do not require a full operating system for each instance, which significantly reduces their overhead.

