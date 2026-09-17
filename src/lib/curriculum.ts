import curriculumData from "@/data/curriculum.json";

export interface CiscoCommand {
  mode?: string;
  cmd: string;
  desc: string;
}

export interface Diagram {
  src: string;
  caption: string;
}

export interface QuizQuestion {
  id: string;
  number: number;
  question: string;
  options: string[];
  correctAnswer: number;
  answerLetter?: string;
  officialAnswer?: string;
  explanation: string;
}

export interface LabMission {
  scenario: string;
  objectives: string[];
  verificationCommands: string[];
  videoSubmissionPrompt: string;
}

export interface LearningMethodStep {
  step: number;
  name: string;
  desc: string;
}

export interface TocItem {
  anchor: string;
  title: string;
  level: number;
}

export interface Module {
  id: string;
  volume: number;
  volumeTitle: string;
  partNumber: number;
  partTitle: string;
  chapterNumber: number;
  title: string;
  rawTitle: string;
  description: string;
  readTime: string;
  learningMethodSteps?: LearningMethodStep[];
  keyPoints: string[];
  tableOfContents?: TocItem[];
  diagrams: Diagram[];
  ciscoCommands: CiscoCommand[];
  quiz: QuizQuestion[];
  labMission: LabMission;
  charCount?: number;
  diagramCount?: number;
  content?: string;
  domainId?: string;
  domainName?: string;
}

export interface Part {
  partNumber: number;
  partTitle: string;
  description: string;
  chapters: number[];
}

export interface Volume {
  volumeNumber: number;
  title: string;
  parts: Part[];
}

export interface PedagogicalPillar {
  pillar: number;
  title: string;
  description: string;
}

export interface PedagogicalMethod {
  name: string;
  summary: string;
  pillars: PedagogicalPillar[];
}

export interface Curriculum {
  title: string;
  author: string;
  pedagogicalMethod: PedagogicalMethod;
  volumes: Volume[];
  totalModules: number;
  modules: Module[];
}

export const curriculum: Curriculum = curriculumData as Curriculum;

export function getAllModules(): Module[] {
  return curriculum.modules;
}

export function getModulesByVolume(vol: number): Module[] {
  return curriculum.modules.filter((m) => m.volume === vol);
}

export function getModulesByPart(vol: number, partNum: number): Module[] {
  return curriculum.modules.filter((m) => m.volume === vol && m.partNumber === partNum);
}

const topicAliases: Record<string, string> = {
  // Volume 1
  "intro": "v1-ch1-introduction-to-the-ccna",
  "introduction": "v1-ch1-introduction-to-the-ccna",
  "intro-ccna": "v1-ch1-introduction-to-the-ccna",
  "network-devices": "v1-ch2-network-devices",
  "devices": "v1-ch2-network-devices",
  "cables": "v1-ch3-cables-connectors-and-ports",
  "connectors": "v1-ch3-cables-connectors-and-ports",
  "tcp-ip": "v1-ch4-the-tcp-ip-networking-model",
  "osi": "v1-ch4-the-tcp-ip-networking-model",
  "cli": "v1-ch5-the-cisco-ios-cli",
  "cisco-ios-cli": "v1-ch5-the-cisco-ios-cli",
  "switching": "v1-ch6-ethernet-lan-switching",
  "lan-switching": "v1-ch6-ethernet-lan-switching",
  "ethernet-switching": "v1-ch6-ethernet-lan-switching",
  "ipv4": "v1-ch7-ipv4-addressing",
  "ipv4-addressing": "v1-ch7-ipv4-addressing",
  "interfaces": "v1-ch8-router-and-switch-interfaces",
  "routing": "v1-ch9-routing-fundamentals",
  "routing-fundamentals": "v1-ch9-routing-fundamentals",
  "life-of-a-packet": "v1-ch10-the-life-of-a-packet",
  "packet-life": "v1-ch10-the-life-of-a-packet",
  "subnetting": "v1-ch11-subnetting-ipv4-networks",
  "ipv4-subnetting": "v1-ch11-subnetting-ipv4-networks",
  "vlan": "v1-ch12-vlans",
  "vlans": "v1-ch12-vlans",
  "dtp": "v1-ch13-dynamic-trunking-protocol-and-vlan-trunking-protocol",
  "vtp": "v1-ch13-dynamic-trunking-protocol-and-vlan-trunking-protocol",
  "trunking": "v1-ch13-dynamic-trunking-protocol-and-vlan-trunking-protocol",
  "stp": "v1-ch14-spanning-tree-protocol",
  "spanning-tree": "v1-ch14-spanning-tree-protocol",
  "rstp": "v1-ch15-rapid-spanning-tree-protocol",
  "rapid-spanning-tree": "v1-ch15-rapid-spanning-tree-protocol",
  "etherchannel": "v1-ch16-etherchannel",
  "dynamic-routing": "v1-ch17-dynamic-routing",
  "ospf": "v1-ch18-open-shortest-path-first",
  "open-shortest-path-first": "v1-ch18-open-shortest-path-first",
  "fhrp": "v1-ch19-first-hop-redundancy-protocols",
  "hsrp": "v1-ch19-first-hop-redundancy-protocols",
  "ipv6": "v1-ch20-ipv6-addressing",
  "ipv6-addressing": "v1-ch20-ipv6-addressing",
  "ipv6-routing": "v1-ch21-ipv6-routing",
  "tcp-udp": "v1-ch22-transmission-control-protocol-and-user-datagram-protocol",
  "udp": "v1-ch22-transmission-control-protocol-and-user-datagram-protocol",
  "acl": "v1-ch23-standard-access-control-lists",
  "acls": "v1-ch23-standard-access-control-lists",
  "standard-acl": "v1-ch23-standard-access-control-lists",
  "extended-acl": "v1-ch24-extended-access-control-lists",

  // Volume 2
  "cdp": "v2-ch1-cisco-discovery-protocol-and-link-layer-discovery-protocol",
  "lldp": "v2-ch1-cisco-discovery-protocol-and-link-layer-discovery-protocol",
  "discovery-protocols": "v2-ch1-cisco-discovery-protocol-and-link-layer-discovery-protocol",
  "ntp": "v2-ch2-network-time-protocol",
  "dns": "v2-ch3-domain-name-system",
  "dhcp": "v2-ch4-dynamic-host-configuration-protocol",
  "ssh": "v2-ch5-secure-shell",
  "snmp": "v2-ch6-simple-network-management-protocol",
  "syslog": "v2-ch7-syslog",
  "tftp": "v2-ch8-trivial-file-transfer-protocol-and-file-transfer-protocol",
  "ftp": "v2-ch8-trivial-file-transfer-protocol-and-file-transfer-protocol",
  "nat": "v2-ch9-network-address-translation",
  "pat": "v2-ch9-network-address-translation",
  "qos": "v2-ch10-quality-of-service",
  "security": "v2-ch11-security-concepts",
  "security-concepts": "v2-ch11-security-concepts",
  "port-security": "v2-ch12-port-security",
  "dhcp-snooping": "v2-ch13-dhcp-snooping",
  "dai": "v2-ch14-dynamic-arp-inspection",
  "arp-inspection": "v2-ch14-dynamic-arp-inspection",
  "lan-architecture": "v2-ch15-lan-architectures",
  "wan-architecture": "v2-ch16-wan-architectures",
  "wan": "v2-ch16-wan-architectures",
  "cloud": "v2-ch17-virtualization-and-cloud",
  "virtualization": "v2-ch17-virtualization-and-cloud",
  "wireless": "v2-ch18-wireless-lan-fundamentals",
  "wlan": "v2-ch18-wireless-lan-fundamentals",
  "wireless-fundamentals": "v2-ch18-wireless-lan-fundamentals",
  "wireless-architectures": "v2-ch19-wireless-lan-architectures",
  "wireless-security": "v2-ch20-wireless-lan-security",
  "wireless-config": "v2-ch21-wireless-lan-configuration",
  "automation": "v2-ch22-network-automation",
  "network-automation": "v2-ch22-network-automation",
  "rest": "v2-ch23-rest-apis",
  "rest-api": "v2-ch23-rest-apis",
  "rest-apis": "v2-ch23-rest-apis",
  "json": "v2-ch24-data-formats",
  "yaml": "v2-ch24-data-formats",
  "xml": "v2-ch24-data-formats",
  "data-formats": "v2-ch24-data-formats",
  "ansible": "v2-ch25-ansible-and-terraform",
  "terraform": "v2-ch25-ansible-and-terraform",
  "ansible-terraform": "v2-ch25-ansible-and-terraform",
};

const legacyAliases: Record<string, string> = {
  "module-1-network-fundamentals": "v1-ch1-introduction-to-the-ccna",
  "module-2-network-access": "v1-ch6-ethernet-lan-switching",
  "module-3-ip-connectivity": "v1-ch9-routing-fundamentals",
  "module-4-ip-services": "v2-ch4-dynamic-host-configuration-protocol",
  "module-5-security-fundamentals": "v2-ch11-security-concepts",
  "module-6-network-automation-programmability": "v2-ch22-network-automation",
  "v1-ch1-intro-ccna": "v1-ch1-introduction-to-the-ccna",
  "v1-ch18-ospf": "v1-ch18-open-shortest-path-first",
  "v2-ch1-wireless-fundamentals": "v2-ch18-wireless-lan-fundamentals",
  ...topicAliases,
};

export function getModuleById(id: string): Module | undefined {
  if (!id || typeof id !== "string") return undefined;
  const rawId = id.trim().toLowerCase();

  // 1. Direct exact match
  let found = curriculum.modules.find((m) => m.id.toLowerCase() === rawId);
  if (found) return found;

  // 2. Legacy and topic alias dictionary lookup
  const slugForm = rawId.replace(/[\s_]+/g, "-");
  if (legacyAliases[slugForm] || legacyAliases[rawId]) {
    const canonicalId = legacyAliases[slugForm] || legacyAliases[rawId];
    found = curriculum.modules.find((m) => m.id === canonicalId);
    if (found) return found;
  }

  // 3. Volume and Chapter pattern: require explicit v/vol/volume or v1/v2 prefix
  const volChMatch = rawId.match(/^(?:v|vol|volume)\s*([12])[-_\s]*(?:ch|chapter)?[-_\s]*(\d+)(?:[-_\s].*)?$/i);
  if (volChMatch) {
    const vol = parseInt(volChMatch[1], 10);
    const ch = parseInt(volChMatch[2], 10);
    found = curriculum.modules.find((m) => m.volume === vol && m.chapterNumber === ch);
    if (found) return found;
  }

  // Also match v1ch1 or v1-ch1
  const vChMatch = rawId.match(/^v([12])[-_]?ch[-_]?(\d+)(?:[-_\s].*)?$/i);
  if (vChMatch) {
    const vol = parseInt(vChMatch[1], 10);
    const ch = parseInt(vChMatch[2], 10);
    found = curriculum.modules.find((m) => m.volume === vol && m.chapterNumber === ch);
    if (found) return found;
  }

  // 4. Sequential module index: module-1 to module-49, m1 to m49, or plain numbers 1 to 49
  const modNumMatch = rawId.match(/^(?:module|mod|m)?[-_\s]?(\d+)$/i);
  if (modNumMatch) {
    const num = parseInt(modNumMatch[1], 10);
    if (num >= 1 && num <= curriculum.modules.length) {
      return curriculum.modules[num - 1];
    }
  }

  // 5. Chapter pattern alone: ch1 to ch49, chapter-1 to chapter-49, chapter 12
  const chMatch = rawId.match(/^(?:ch|chapter)[-_\s]?(\d+)(?:[-_\s].*)?$/i);
  if (chMatch) {
    const chNum = parseInt(chMatch[1], 10);
    if (chNum >= 1 && chNum <= 24) {
      found = curriculum.modules.find((m) => m.volume === 1 && m.chapterNumber === chNum);
      if (found) return found;
    } else if (chNum >= 25 && chNum <= 49) {
      found = curriculum.modules.find((m) => m.volume === 2 && m.chapterNumber === chNum - 24);
      if (found) return found;
    }
  }

  // 6. Substring or slug matching: e.g. "etherchannel", "vlans", "subnetting"
  const cleanSearch = rawId.replace(/[^a-z0-9]/g, "");
  if (cleanSearch.length >= 3) {
    found = curriculum.modules.find((m) => {
      const cleanId = m.id.replace(/[^a-z0-9]/g, "");
      const cleanTitle = m.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      return cleanId.includes(cleanSearch) || cleanTitle.includes(cleanSearch);
    });
    if (found) return found;
  }

  return undefined;
}

export function getCanonicalModuleId(id: string): string {
  const mod = getModuleById(id);
  return mod ? mod.id : id;
}

export function getNextModule(currentId: string): Module | undefined {
  const mod = getModuleById(currentId);
  if (!mod) return undefined;
  const index = curriculum.modules.findIndex((m) => m.id === mod.id);
  if (index >= 0 && index < curriculum.modules.length - 1) {
    return curriculum.modules[index + 1];
  }
  return undefined;
}

export function getPreviousModule(currentId: string): Module | undefined {
  const mod = getModuleById(currentId);
  if (!mod) return undefined;
  const index = curriculum.modules.findIndex((m) => m.id === mod.id);
  if (index > 0) {
    return curriculum.modules[index - 1];
  }
  return undefined;
}
