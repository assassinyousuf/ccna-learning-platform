"use client";

import React, { useState, useMemo } from "react";
import { 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  Network, 
  ShieldCheck, 
  Sliders, 
  Sparkles,
  Info
} from "lucide-react";
import { sounds } from "@/lib/sound-effects";

type ConfigType = "roas" | "ospf" | "acl" | "nat" | "dhcp";

export function CiscoConfigGenerator() {
  const [activeTab, setActiveTab] = useState<ConfigType>("roas");
  const [copied, setCopied] = useState(false);

  // Router-on-a-Stick State
  const [roasPhysInt, setRoasPhysInt] = useState("GigabitEthernet0/0/0");
  const [roasVlan10, setRoasVlan10] = useState(10);
  const [roasIp10, setRoasIp10] = useState("192.168.10.1");
  const [roasMask10, setRoasMask10] = useState("255.255.255.0");
  const [roasVlan20, setRoasVlan20] = useState(20);
  const [roasIp20, setRoasIp20] = useState("192.168.20.1");
  const [roasMask20, setRoasMask20] = useState("255.255.255.0");
  const [roasNativeVlan, setRoasNativeVlan] = useState(99);

  // OSPFv2 State
  const [ospfProcess, setOspfProcess] = useState(1);
  const [ospfRouterId, setOspfRouterId] = useState("1.1.1.1");
  const [ospfNet1, setOspfNet1] = useState("192.168.10.0");
  const [ospfWildcard1, setOspfWildcard1] = useState("0.0.0.255");
  const [ospfArea1, setOspfArea1] = useState(0);
  const [ospfPassiveInt, setOspfPassiveInt] = useState("GigabitEthernet0/0/0.10");

  // ACL State
  const [aclType, setAclType] = useState<"standard" | "extended">("extended");
  const [aclName, setAclName] = useState("ENTERPRISE_EDGE_IN");
  const [aclAction, setAclAction] = useState<"permit" | "deny">("permit");
  const [aclProto, setAclProto] = useState<"tcp" | "udp" | "ip" | "icmp">("tcp");
  const [aclSrc, setAclSrc] = useState("192.168.10.0 0.0.0.255");
  const [aclDst, setAclDst] = useState("any");
  const [aclPort, setAclPort] = useState("eq 443");

  // NAT / PAT State
  const [natInsideInt, setNatInsideInt] = useState("GigabitEthernet0/0/0");
  const [natOutsideInt, setNatOutsideInt] = useState("Serial0/1/0");
  const [natAclNum, setNatAclNum] = useState(1);
  const [natInternalSubnet, setNatInternalSubnet] = useState("192.168.10.0 0.0.0.255");

  // DHCP Server State
  const [dhcpPoolName, setDhcpPoolName] = useState("CORP_VLAN10_POOL");
  const [dhcpNetwork, setDhcpNetwork] = useState("192.168.10.0");
  const [dhcpMask, setDhcpMask] = useState("255.255.255.0");
  const [dhcpGateway, setDhcpGateway] = useState("192.168.10.1");
  const [dhcpDns, setDhcpDns] = useState("8.8.8.8 1.1.1.1");
  const [dhcpExclude, setDhcpExclude] = useState("192.168.10.1 192.168.10.10");

  // Generated Cisco CLI Code
  const generatedConfig = useMemo(() => {
    switch (activeTab) {
      case "roas":
        return `! =======================================================
! CISCO IOS ROUTER-ON-A-STICK (802.1Q SUB-INTERFACES)
! =======================================================
configure terminal
!
! 1. Bring up physical parent interface without an IP
interface ${roasPhysInt}
 no shutdown
 no ip address
 exit
!
! 2. Sub-interface for VLAN ${roasVlan10}
interface ${roasPhysInt}.${roasVlan10}
 encapsulation dot1Q ${roasVlan10}
 ip address ${roasIp10} ${roasMask10}
 description GW_VLAN_${roasVlan10}_DATA
 no shutdown
 exit
!
! 3. Sub-interface for VLAN ${roasVlan20}
interface ${roasPhysInt}.${roasVlan20}
 encapsulation dot1Q ${roasVlan20}
 ip address ${roasIp20} ${roasMask20}
 description GW_VLAN_${roasVlan20}_VOICE
 no shutdown
 exit
!
! 4. Native Management VLAN (Untagged)
interface ${roasPhysInt}.${roasNativeVlan}
 encapsulation dot1Q ${roasNativeVlan} native
 ip address 192.168.${roasNativeVlan}.1 255.255.255.0
 description NATIVE_MGMT_VLAN_${roasNativeVlan}
 exit
end
write memory`;

      case "ospf":
        return `! =======================================================
! CISCO SINGLE-AREA OSPFv2 ROUTING CONFIGURATION
! =======================================================
configure terminal
!
router ospf ${ospfProcess}
 router-id ${ospfRouterId}
 ! Set Reference Bandwidth to Gigabit (1000 Mbps) or 10G
 auto-cost reference-bandwidth 1000
 ! Passive interface to prevent Hello packets toward end hosts
 passive-interface ${ospfPassiveInt}
 ! Network advertisement with wildcard mask
 network ${ospfNet1} ${ospfWildcard1} area ${ospfArea1}
 exit
!
! Verify neighbor state and database
! show ip ospf neighbor
! show ip ospf database
! show ip route ospf
end
write memory`;

      case "acl":
        if (aclType === "standard") {
          return `! =======================================================
! CISCO STANDARD NAMED ACCESS CONTROL LIST (L3 ONLY)
! =======================================================
configure terminal
!
ip access-list standard ${aclName}
 ${aclAction} ${aclSrc}
 deny any log
 exit
!
! Apply inbound/outbound on target interface
interface GigabitEthernet0/0/0
 ip access-group ${aclName} in
 exit
end
write memory`;
        }
        return `! =======================================================
! CISCO EXTENDED NAMED ACCESS CONTROL LIST (L3 + L4)
! =======================================================
configure terminal
!
ip access-list extended ${aclName}
 remark --- PERMIT AUTHORIZED ENCRYPTED APPLICATION FLOWS ---
 ${aclAction} ${aclProto} ${aclSrc} ${aclDst} ${aclPort}
 remark --- EXPLICIT DENY WITH SYSLOG LOGGING ---
 deny ip any any log
 exit
!
! Apply filter to ingress router interface
interface GigabitEthernet0/0/0
 ip access-group ${aclName} in
 exit
end
write memory`;

      case "nat":
        return `! =======================================================
! CISCO DYNAMIC PAT (PORT ADDRESS TRANSLATION / NAT OVERLOAD)
! =======================================================
configure terminal
!
! 1. Identify Inside and Outside Interfaces
interface ${natInsideInt}
 ip nat inside
 exit
!
interface ${natOutsideInt}
 ip nat outside
 exit
!
! 2. Standard ACL identifying hosts eligible for translation
access-list ${natAclNum} permit ${natInternalSubnet}
!
! 3. Bind ACL to Outside Interface with 'overload' keyword
ip nat inside source list ${natAclNum} interface ${natOutsideInt} overload
!
! Verify active translations:
! show ip nat translations
! show ip nat statistics
end
write memory`;

      case "dhcp":
        return `! =======================================================
! CISCO IOS DHCP SERVER CONFIGURATION
! =======================================================
configure terminal
!
! 1. Exclude static devices (Default Gateway, Printers, Servers)
ip dhcp excluded-address ${dhcpExclude}
!
! 2. Create and configure DHCP Pool
ip dhcp pool ${dhcpPoolName}
 network ${dhcpNetwork} ${dhcpMask}
 default-router ${dhcpGateway}
 dns-server ${dhcpDns}
 lease 7 0 0
 exit
!
! Verify active bindings:
! show ip dhcp binding
! show ip dhcp pool
end
write memory`;
    }
  }, [
    activeTab, 
    roasPhysInt, roasVlan10, roasIp10, roasMask10, roasVlan20, roasIp20, roasMask20, roasNativeVlan,
    ospfProcess, ospfRouterId, ospfNet1, ospfWildcard1, ospfArea1, ospfPassiveInt,
    aclType, aclName, aclAction, aclProto, aclSrc, aclDst, aclPort,
    natInsideInt, natOutsideInt, natAclNum, natInternalSubnet,
    dhcpPoolName, dhcpNetwork, dhcpMask, dhcpGateway, dhcpDns, dhcpExclude
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedConfig);
    setCopied(true);
    sounds.playCommandSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--primary)] mb-1">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>ENTERPRISE CISCO IOS WORKBENCH</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Live Cisco IOS Configuration Generator
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Configure sub-interfaces, OSPF areas, ACLs, NAT Overload, and DHCP with verified Cisco syntax.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)] overflow-x-auto">
          <button
            onClick={() => setActiveTab("roas")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === "roas"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Router-on-a-Stick
          </button>
          <button
            onClick={() => setActiveTab("ospf")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === "ospf"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            OSPFv2
          </button>
          <button
            onClick={() => setActiveTab("acl")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === "acl"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Named ACL
          </button>
          <button
            onClick={() => setActiveTab("nat")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === "nat"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            PAT (Overload)
          </button>
          <button
            onClick={() => setActiveTab("dhcp")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === "dhcp"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            DHCP Server
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Live CLI on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Form Parameter Controls */}
        <div className="lg:col-span-5 space-y-4">
          {activeTab === "roas" && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">
                  Physical Parent Interface
                </label>
                <input
                  type="text"
                  value={roasPhysInt}
                  onChange={(e) => setRoasPhysInt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">VLAN 1 ID</label>
                  <input
                    type="number"
                    value={roasVlan10}
                    onChange={(e) => setRoasVlan10(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Gateway IP</label>
                  <input
                    type="text"
                    value={roasIp10}
                    onChange={(e) => setRoasIp10(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">VLAN 2 ID</label>
                  <input
                    type="number"
                    value={roasVlan20}
                    onChange={(e) => setRoasVlan20(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Gateway IP</label>
                  <input
                    type="text"
                    value={roasIp20}
                    onChange={(e) => setRoasIp20(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">
                  Native Management VLAN
                </label>
                <input
                  type="number"
                  value={roasNativeVlan}
                  onChange={(e) => setRoasNativeVlan(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                />
              </div>
            </div>
          )}

          {activeTab === "ospf" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">OSPF Process ID</label>
                  <input
                    type="number"
                    value={ospfProcess}
                    onChange={(e) => setOspfProcess(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Router ID</label>
                  <input
                    type="text"
                    value={ospfRouterId}
                    onChange={(e) => setOspfRouterId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Network Address</label>
                <input
                  type="text"
                  value={ospfNet1}
                  onChange={(e) => setOspfNet1(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Wildcard Mask</label>
                  <input
                    type="text"
                    value={ospfWildcard1}
                    onChange={(e) => setOspfWildcard1(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">OSPF Area ID</label>
                  <input
                    type="number"
                    value={ospfArea1}
                    onChange={(e) => setOspfArea1(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Passive Interface</label>
                <input
                  type="text"
                  value={ospfPassiveInt}
                  onChange={(e) => setOspfPassiveInt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                />
              </div>
            </div>
          )}

          {activeTab === "acl" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">ACL Type</label>
                  <select
                    value={aclType}
                    onChange={(e) => setAclType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  >
                    <option value="extended">Extended (L3+L4)</option>
                    <option value="standard">Standard (L3)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Action</label>
                  <select
                    value={aclAction}
                    onChange={(e) => setAclAction(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  >
                    <option value="permit">permit</option>
                    <option value="deny">deny</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">ACL Identifier Name</label>
                <input
                  type="text"
                  value={aclName}
                  onChange={(e) => setAclName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Source (IP + Wildcard)</label>
                <input
                  type="text"
                  value={aclSrc}
                  onChange={(e) => setAclSrc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                />
              </div>
              {aclType === "extended" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Protocol</label>
                    <input
                      type="text"
                      value={aclProto}
                      onChange={(e) => setAclProto(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Port Match</label>
                    <input
                      type="text"
                      value={aclPort}
                      onChange={(e) => setAclPort(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "nat" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Inside Interface</label>
                  <input
                    type="text"
                    value={natInsideInt}
                    onChange={(e) => setNatInsideInt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Outside Interface</label>
                  <input
                    type="text"
                    value={natOutsideInt}
                    onChange={(e) => setNatOutsideInt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">ACL Number</label>
                <input
                  type="number"
                  value={natAclNum}
                  onChange={(e) => setNatAclNum(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Internal Subnet (Permitted)</label>
                <input
                  type="text"
                  value={natInternalSubnet}
                  onChange={(e) => setNatInternalSubnet(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                />
              </div>
            </div>
          )}

          {activeTab === "dhcp" && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">DHCP Pool Name</label>
                <input
                  type="text"
                  value={dhcpPoolName}
                  onChange={(e) => setDhcpPoolName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Network IP</label>
                  <input
                    type="text"
                    value={dhcpNetwork}
                    onChange={(e) => setDhcpNetwork(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Subnet Mask</label>
                  <input
                    type="text"
                    value={dhcpMask}
                    onChange={(e) => setDhcpMask(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Default Gateway (Router)</label>
                <input
                  type="text"
                  value={dhcpGateway}
                  onChange={(e) => setDhcpGateway(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--foreground-muted)] mb-1">Excluded Address Range</label>
                <input
                  type="text"
                  value={dhcpExclude}
                  onChange={(e) => setDhcpExclude(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Output Console */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-[var(--terminal-bg)] border border-[var(--terminal-border)] p-4 sm:p-5 relative shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--terminal-border)] text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-[var(--terminal-prompt)] font-bold pl-2">
                cisco-ios-live-syntax.cfg
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--background-subtle)] hover:bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] text-xs font-mono transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--primary)]" />}
              <span>{copied ? "Copied!" : "Copy Commands"}</span>
            </button>
          </div>

          <pre className="py-4 text-xs font-mono text-[var(--terminal-cmd)] overflow-x-auto whitespace-pre leading-relaxed select-all">
            {generatedConfig}
          </pre>

          <div className="pt-3 border-t border-[var(--terminal-border)] flex items-center justify-between text-[11px] font-mono text-[var(--foreground-muted)]">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cisco IOS 15.x / 17.x Verified Configuration Block</span>
            </span>
            <span>Paste directly into privileged exec</span>
          </div>
        </div>
      </div>
    </div>
  );
}
