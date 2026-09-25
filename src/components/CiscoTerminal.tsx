"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Maximize2, Minimize2, Trash2, Volume2, VolumeX, Sparkles, CheckCircle2 } from "lucide-react";
import { sounds } from "@/lib/sound-effects";

interface CiscoTerminalProps {
  initialHostname?: string;
  defaultCommands?: string[];
  title?: string;
}

type Mode = "user" | "priv" | "config" | "config-if" | "config-router" | "config-line";

interface HistoryEntry {
  type: "input" | "output" | "system";
  prompt?: string;
  text: string;
}

export function CiscoTerminal({
  initialHostname = "Switch",
  defaultCommands = [],
  title = "Cisco IOS CLI Simulator",
}: CiscoTerminalProps) {
  const [hostname, setHostname] = useState(initialHostname);
  const [mode, setMode] = useState<Mode>("user");
  const [currentInterface, setCurrentInterface] = useState<string>("GigabitEthernet0/1");
  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [fullScreen, setFullScreen] = useState(false);
  const [muted, setMuted] = useState(sounds.isMuted());

  // Simulated Device State
  const [interfaces, setInterfaces] = useState<Record<string, { ip: string; status: "up" | "down"; protocol: "up" | "down" }>>({
    "GigabitEthernet0/1": { ip: "unassigned", status: "up", protocol: "up" },
    "GigabitEthernet0/2": { ip: "unassigned", status: "up", protocol: "up" },
    "GigabitEthernet0/3": { ip: "unassigned", status: "down", protocol: "down" },
    "FastEthernet0/1": { ip: "unassigned", status: "up", protocol: "up" },
    "FastEthernet0/2": { ip: "unassigned", status: "up", protocol: "up" },
    "Vlan1": { ip: "192.168.1.1", status: "up", protocol: "up" },
  });

  const [vlans, setVlans] = useState<Array<{ id: number; name: string; status: string; ports: string }>>([
    { id: 1, name: "default", status: "active", ports: "Gi0/1, Gi0/2, Fa0/1, Fa0/2" },
    { id: 10, name: "MANAGEMENT", status: "active", ports: "Gi0/3" },
    { id: 20, name: "ENGINEERING", status: "active", ports: "" },
    { id: 30, name: "SALES", status: "active", ports: "" },
  ]);

  const [logs, setLogs] = useState<HistoryEntry[]>([
    {
      type: "system",
      text: `Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 15.2(2)E4, RELEASE SOFTWARE (fc2)
Technical Support: http://www.cisco.com/techsupport
Copyright (c) 1986-2024 by Cisco Systems, Inc.

*Mar 1 00:00:01.120: %LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up
*Mar 1 00:00:01.121: %LINK-3-UPDOWN: Interface Vlan1, changed state to up
Press '?' or 'help' for available Cisco IOS commands.`,
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getPrompt = (): string => {
    switch (mode) {
      case "user":
        return `${hostname}>`;
      case "priv":
        return `${hostname}#`;
      case "config":
        return `${hostname}(config)#`;
      case "config-if":
        return `${hostname}(config-if)#`;
      case "config-router":
        return `${hostname}(config-router)#`;
      case "config-line":
        return `${hostname}(config-line)#`;
      default:
        return `${hostname}>`;
    }
  };

  const toggleSound = () => {
    const isMuted = sounds.toggleMute();
    setMuted(isMuted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    sounds.playKeyClick();

    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(inputVal.trim());
      setInputVal("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      autoComplete(inputVal);
    }
  };

  const availableCommands: Record<Mode, string[]> = {
    user: ["enable", "ping", "traceroute", "show version", "exit", "?"],
    priv: [
      "configure terminal",
      "disable",
      "show ip interface brief",
      "show vlan brief",
      "show mac address-table",
      "show ip route",
      "show running-config",
      "show interfaces",
      "ping",
      "traceroute",
      "copy running-config startup-config",
      "write memory",
      "clear",
      "exit",
      "?",
    ],
    config: [
      "hostname",
      "interface",
      "vlan",
      "ip route",
      "router ospf",
      "line console 0",
      "line vty",
      "exit",
      "end",
      "do show",
      "?",
    ],
    "config-if": [
      "ip address",
      "no shutdown",
      "shutdown",
      "switchport mode access",
      "switchport mode trunk",
      "switchport access vlan",
      "description",
      "duplex full",
      "speed 1000",
      "exit",
      "end",
      "do show",
      "?",
    ],
    "config-router": ["network", "router-id", "passive-interface", "exit", "end", "?"],
    "config-line": ["password", "login", "transport input ssh", "exec-timeout", "exit", "end", "?"],
  };

  const autoComplete = (current: string) => {
    const trimmed = current.trim();
    if (!trimmed) return;
    const candidates = availableCommands[mode].filter((cmd) => cmd.startsWith(trimmed));
    if (candidates.length === 1) {
      setInputVal(candidates[0] + " ");
    }
  };

  const executeCommand = (cmd: string) => {
    const prompt = getPrompt();

    if (!cmd) {
      setLogs((prev) => [...prev, { type: "input", prompt, text: "" }]);
      return;
    }

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    sounds.playCommandSuccess();

    const parts = cmd.split(" ");
    const root = parts[0].toLowerCase();
    const arg1 = parts[1]?.toLowerCase();
    const rest = parts.slice(1).join(" ");

    let response = "";

    // Global clear command
    if (root === "clear") {
      setLogs([]);
      return;
    }

    // Help command
    if (cmd === "?" || root === "help") {
      response = `Available commands in current mode (${mode}):\n` +
        availableCommands[mode].map((c) => `  ${c.padEnd(28)} - Cisco IOS command`).join("\n");
    }
    // Navigation: enable / disable
    else if (root === "enable" || root === "en") {
      if (mode === "user") {
        setMode("priv");
      }
    } else if (root === "disable") {
      if (mode !== "user") {
        setMode("user");
      }
    }
    // Navigation: configure terminal
    else if ((root === "configure" && arg1 === "terminal") || cmd === "conf t") {
      if (mode === "priv") {
        setMode("config");
        response = "Enter configuration commands, one per line. End with CNTL/Z.";
      } else {
        response = "% Invalid command in this mode.";
      }
    }
    // Navigation: exit / end
    else if (root === "exit") {
      if (mode === "config-if" || mode === "config-router" || mode === "config-line") {
        setMode("config");
      } else if (mode === "config") {
        setMode("priv");
      } else if (mode === "priv") {
        setMode("user");
      } else {
        response = "% Connection closed by foreign host.";
      }
    } else if (root === "end") {
      setMode("priv");
    }
    // Hostname
    else if (root === "hostname" && parts[1]) {
      if (mode === "config") {
        setHostname(parts[1]);
      } else {
        response = "% Invalid command at this prompt.";
      }
    }
    // Interface config
    else if (root === "interface" || root === "int") {
      if (mode === "config") {
        const ifName = rest || "GigabitEthernet0/1";
        setCurrentInterface(ifName);
        setMode("config-if");
      } else {
        response = "% Invalid command at this prompt.";
      }
    }
    // IP address inside interface
    else if (root === "ip" && arg1 === "address" && mode === "config-if") {
      const ip = parts[2] || "192.168.1.1";
      const mask = parts[3] || "255.255.255.0";
      setInterfaces((prev) => ({
        ...prev,
        [currentInterface]: { ...prev[currentInterface], ip: `${ip}/${mask}` },
      }));
    }
    // No shutdown inside interface
    else if (cmd.startsWith("no shut") && mode === "config-if") {
      setInterfaces((prev) => ({
        ...prev,
        [currentInterface]: { ...prev[currentInterface], status: "up", protocol: "up" },
      }));
      response = `*Mar 1 00:04:12.441: %LINK-3-UPDOWN: Interface ${currentInterface}, changed state to up\n*Mar 1 00:04:13.443: %LINEPROTO-5-UPDOWN: Line protocol on Interface ${currentInterface}, changed state to up`;
    }
    // Shutdown
    else if (cmd === "shutdown" && mode === "config-if") {
      setInterfaces((prev) => ({
        ...prev,
        [currentInterface]: { ...prev[currentInterface], status: "down", protocol: "down" },
      }));
      response = `*Mar 1 00:04:22.112: %LINK-5-CHANGED: Interface ${currentInterface}, changed state to administratively down`;
    }
    // VLAN config
    else if (root === "vlan" && parts[1]) {
      const vlanId = parseInt(parts[1]);
      if (!isNaN(vlanId)) {
        if (!vlans.find((v) => v.id === vlanId)) {
          setVlans((prev) => [...prev, { id: vlanId, name: `VLAN00${vlanId}`, status: "active", ports: "" }]);
        }
        response = `% VLAN ${vlanId} created or selected.`;
      }
    }
    // Show commands
    else if (cmd.startsWith("show ip int") || cmd.startsWith("sh ip int") || cmd.startsWith("do show ip int")) {
      response = `Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/1     ${interfaces["GigabitEthernet0/1"]?.ip.padEnd(15)} YES manual ${interfaces["GigabitEthernet0/1"]?.status.padEnd(21)} ${interfaces["GigabitEthernet0/1"]?.protocol}
GigabitEthernet0/2     ${interfaces["GigabitEthernet0/2"]?.ip.padEnd(15)} YES manual ${interfaces["GigabitEthernet0/2"]?.status.padEnd(21)} ${interfaces["GigabitEthernet0/2"]?.protocol}
GigabitEthernet0/3     ${interfaces["GigabitEthernet0/3"]?.ip.padEnd(15)} YES unset  ${interfaces["GigabitEthernet0/3"]?.status.padEnd(21)} ${interfaces["GigabitEthernet0/3"]?.protocol}
FastEthernet0/1        ${interfaces["FastEthernet0/1"]?.ip.padEnd(15)} YES manual ${interfaces["FastEthernet0/1"]?.status.padEnd(21)} ${interfaces["FastEthernet0/1"]?.protocol}
Vlan1                  ${interfaces["Vlan1"]?.ip.padEnd(15)} YES manual ${interfaces["Vlan1"]?.status.padEnd(21)} ${interfaces["Vlan1"]?.protocol}`;
    } else if (cmd.startsWith("show vlan") || cmd.startsWith("sh vlan") || cmd.startsWith("do show vlan")) {
      response = `VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi0/1, Gi0/2, Fa0/1, Fa0/2
10   MANAGEMENT                       active    Gi0/3
20   ENGINEERING                      active    
30   SALES                            active    
1002 fddi-default                     act/unsup 
1003 token-ring-default               act/unsup`;
    } else if (cmd.startsWith("show mac") || cmd.startsWith("sh mac") || cmd.startsWith("do show mac")) {
      response = `          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0014.a892.4b01    DYNAMIC     Gi0/1
   1    0019.55c3.fa90    DYNAMIC     Gi0/2
  10    5475.d0ff.01c2    DYNAMIC     Gi0/3
Total Mac Addresses for this criterion: 3`;
    } else if (cmd.startsWith("show ip route") || cmd.startsWith("sh ip ro") || cmd.startsWith("do show ip ro")) {
      response = `Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area 

Gateway of last resort is 192.168.1.254 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 192.168.1.254
      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        10.1.1.0/24 is directly connected, GigabitEthernet0/1
L        10.1.1.1/32 is directly connected, GigabitEthernet0/1
O     172.16.0.0/16 [110/2] via 10.1.1.2, 00:14:22, GigabitEthernet0/1
C     192.168.1.0/24 is directly connected, Vlan1`;
    } else if (cmd.startsWith("show run") || cmd.startsWith("sh run") || cmd.startsWith("do show run")) {
      response = `Building configuration...
Current configuration : 1084 bytes
!
version 15.2
no service timestamps log datetime msec
no service password-encryption
!
hostname ${hostname}
!
spanning-tree mode rapid-pvst
!
interface GigabitEthernet0/1
 description Trunk to Core Switch
 switchport mode trunk
!
interface Vlan1
 ip address 192.168.1.1 255.255.255.0
 no shutdown
!
line con 0
line vty 0 4
 login
!
end`;
    } else if (cmd.startsWith("ping")) {
      const target = parts[1] || "8.8.8.8";
      response = `Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`;
    } else if (cmd.startsWith("write mem") || cmd.startsWith("copy run start")) {
      response = `Building configuration...
[OK]`;
    } else {
      response = `% Invalid input detected at '^' marker.\n% Unknown command: "${cmd}". Type '?' for help.`;
    }

    setLogs((prev) => [
      ...prev,
      { type: "input", prompt, text: cmd },
      ...(response ? [{ type: "output" as const, text: response }] : []),
    ]);
  };

  const loadPresetCommand = (cmd: string) => {
    setInputVal(cmd);
    inputRef.current?.focus();
  };

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-950 font-mono shadow-2xl overflow-hidden transition-all flex flex-col ${
        fullScreen ? "fixed inset-4 z-50 max-h-none" : "h-[560px]"
      }`}
    >
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="h-4 w-[1px] bg-slate-700 mx-1"></div>
          <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-white tracking-wide">{title}</span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] border border-cyan-500/20 uppercase font-mono">
            {mode} mode
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick preset suggestions */}
          <div className="hidden lg:flex items-center gap-1.5 mr-2">
            <span className="text-[10px] text-slate-400">Quick:</span>
            {["show ip int br", "show vlan br", "show mac", "conf t"].map((c) => (
              <button
                key={c}
                onClick={() => loadPresetCommand(c)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-[10px] text-slate-300 transition-colors border border-slate-700/60"
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={toggleSound}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={muted ? "Unmute terminal sound" : "Mute terminal sound"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          <button
            onClick={() => setLogs([])}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Clear output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setFullScreen(!fullScreen)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={fullScreen ? "Exit full screen" : "Full screen"}
          >
            {fullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Screen & Logs */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-1 text-[13px] leading-relaxed select-text cursor-text bg-slate-950/95 scrollbar-thin scrollbar-thumb-slate-800"
        onClick={() => inputRef.current?.focus()}
      >
        {logs.map((log, idx) => (
          <div key={idx} className="whitespace-pre-wrap font-mono">
            {log.type === "input" && (
              <div className="flex items-center gap-1 text-slate-200">
                <span className="text-emerald-400 font-semibold">{log.prompt}</span>
                <span className="text-white font-medium">{log.text}</span>
              </div>
            )}
            {log.type === "output" && (
              <div className="text-slate-300 pl-1 py-0.5 border-l border-slate-800 text-xs leading-5">
                {log.text}
              </div>
            )}
            {log.type === "system" && (
              <div className="text-cyan-400/90 text-xs py-1 border-b border-slate-800/80 mb-2">
                {log.text}
              </div>
            )}
          </div>
        ))}

        {/* Live Active Input Prompt */}
        <div className="flex items-center gap-1 text-slate-200 pt-1">
          <span className="text-emerald-400 font-semibold">{getPrompt()}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-[13px] caret-cyan-400"
            autoFocus
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
          />
        </div>

        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Bottom Helper Bar */}
      <div className="px-4 py-2 bg-slate-900/70 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Tab</kbd> Autocomplete</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">?</kbd> Command Help</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">↑/↓</kbd> History</span>
        </div>
        <div className="text-cyan-400 font-mono text-[10px]">
          Simulated IOS 15.2 • Ready
        </div>
      </div>
    </div>
  );
}
