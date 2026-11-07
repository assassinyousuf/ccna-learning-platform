# Network Automation & Programmability Reference

Modern network engineering couples traditional CLI operations with model-driven programmability, software-defined architectures (SDN), and declarative configuration management.

---

## 1. Controller Architecture & Network Planes

- **Management Plane**: Configuration, diagnostics, and monitoring (SSH, HTTPS, SNMP, REST APIs).
- **Control Plane**: Protocol decisions and table population (OSPF, BGP, STP, ARP processing).
- **Data / Forwarding Plane**: Hardware ASICs forwarding frames and packets at wire speed based on CAM and FIB tables.

### SDN Controller Interfaces:
- **Southbound APIs (SBIs)**: Controller to Network Devices (OpenFlow, NETCONF, RESTCONF, gRPC).
- **Northbound APIs (NBIs)**: Controller to Applications & Business Orchestrators (RESTful HTTP APIs with JSON/YAML).

---

## 2. Data Formats Comparison

### JSON (JavaScript Object Notation):
```json
{
  "cisco-ios-xe:interface": {
    "name": "GigabitEthernet0/0/0",
    "description": "Primary WAN Uplink",
    "enabled": true,
    "ipv4": {
      "address": "192.168.1.1",
      "netmask": "255.255.255.0"
    }
  }
}
```

### YAML (YAML Ain't Markup Language):
```yaml
cisco-ios-xe:interface:
  name: GigabitEthernet0/0/0
  description: Primary WAN Uplink
  enabled: true
  ipv4:
    address: 192.168.1.1
    netmask: 255.255.255.0
```

---

## 3. RESTful API Architectural Principles

- **Client-Server**: Loose coupling between UI client and backend service.
- **Stateless**: Every request contains all context needed to execute.
- **Cacheable**: Explicit HTTP headers indicating cache validity.
- **CRUD to HTTP Verb Mapping**:
  - `Create` $\rightarrow$ `POST`
  - `Read` $\rightarrow$ `GET`
  - `Update` $\rightarrow$ `PUT` (full replacement) / `PATCH` (partial edit)
  - `Delete` $\rightarrow$ `DELETE`

---

## 4. Configuration Management Tooling

| Feature | Ansible | Puppet | Chef |
| :--- | :--- | :--- | :--- |
| **Architecture** | **Agentless** (SSH/API) | Agent-based (Default) | Agent-based |
| **Communication Model** | **Push** | **Pull** | **Pull** |
| **Configuration Language**| **YAML (Playbooks)** | Ruby DSL (Manifests) | Ruby DSL (Recipes) |
