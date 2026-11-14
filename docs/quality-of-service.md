# Quality of Service (QoS) Mechanics & Queueing

Traffic classification, marking, policing, shaping, and congestion management mechanisms on Cisco networks.

---

## 1. Network Traffic Characteristics

- **Voice**: Ultra-sensitive to delay, jitter, and packet loss. Requires latency $< 150$ ms, jitter $< 30$ ms, loss $< 1\%$. Bandwidth requirement is low (G.711 = 64 kbps).
- **Video**: Delay sensitive $< 200-400$ ms, bursty bandwidth consumption, jitter sensitive.
- **Data (Transactional / Best-Effort)**: Tolerant of variable latency and jitter; relies on TCP retransmissions for loss recovery.

---

## 2. Layer 2 & Layer 3 Marking Standards

### Layer 2 Marking (802.1Q CoS):
- 3 bits in the 802.1Q tag ($2^3 = 8$ Class of Service levels from 0 to 7).
- `CoS 5`: Voice Bearer traffic.

### Layer 3 Marking (IPv4 ToS & IPv6 Traffic Class):
- **IP Precedence (Legacy)**: 3 bits (0 to 7).
- **Differentiated Services Code Point (DSCP - Modern)**: 6 bits ($2^6 = 64$ values):
  - **Default Forwarding (DF)**: `000000` (Best Effort).
  - **Expedited Forwarding (EF)**: `101110` (Decimal 46) — Reserved exclusively for interactive VoIP audio.
  - **Assured Forwarding (AF)**: 12 classes structured as `AFxy` ($x$ = Class 1-4, $y$ = Drop Precedence 1-3).
  - **Class Selector (CS)**: Backward compatible mapping with IP Precedence (`CS1` to `CS7`).

---

## 3. Congestion Management & Queuing

- **FIFO (First-In, First-Out)**: Default queue. No prioritization.
- **CBWFQ (Class-Based Weighted Fair Queueing)**: Allocates guaranteed bandwidth percentages to defined classes.
- **LLQ (Low Latency Queuing - Industry Standard)**: CBWFQ combined with a strict **Priority Queue (PQ)** that is always serviced first. Voice traffic must be directed to LLQ.
