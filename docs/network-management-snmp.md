# Network Management Protocols: SNMP, Syslog & NTP

Operational reference for infrastructure telemetry, synchronized timestamps, and remote monitoring.

---

## 1. Simple Network Management Protocol (SNMP)

- **Architecture**: Managed Devices (SNMP Agents) queried by a centralized Network Management Station (NMS).
- **Operations**:
  - `GetRequest` / `GetNextRequest`: NMS queries specific OID values from the agent's Management Information Base (MIB).
  - `SetRequest`: NMS modifies device parameters.
  - `Trap` (UDP 162): Unsolicited event alert pushed by agent to NMS (unacknowledged).
  - `Inform` (UDP 162): Unsolicited event alert requiring NMS acknowledgment.

### SNMP Versions Comparison:
| Version | Authentication | Privacy (Encryption) | Security Evaluation |
| :--- | :--- | :--- | :--- |
| **SNMPv1** | Plaintext Community String | None | Insecure |
| **SNMPv2c** | Plaintext Community String | None | Insecure |
| **SNMPv3 (noAuthNoPriv)** | Username | None | Low |
| **SNMPv3 (authNoPriv)** | SHA / MD5 Hash | None | Moderate |
| **SNMPv3 (authPriv)** | SHA-256 Hash | AES-128 / AES-256 | **Production Standard** |

---

## 2. Syslog Severity Levels

Cisco IOS assigns severity levels 0 through 7 to all system notification messages:

| Level | Keyword | Description |
| :---: | :--- | :--- |
| **0** | **Emergency** | System is completely unusable. |
| **1** | **Alert** | Immediate action required. |
| **2** | **Critical** | Critical hardware or software condition. |
| **3** | **Error** | Error condition reported. |
| **4** | **Warning** | Warning condition (e.g. interface flap threshold). |
| **5** | **Notice** | Normal but significant condition (e.g. `%LINK-5-CHANGED`). |
| **6** | **Informational**| Informational message (e.g. ACL match log). |
| **7** | **Debugging** | Highly verbose diagnostic tracing (`debug`). |

> [!TIP]
> Memory Mnemonic: **E**very **A**gent **C**an **E**asily **W**rite **N**etwork **I**nformation **D**atabases.
