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

export function getModuleById(id: string): Module | undefined {
  return curriculum.modules.find((m) => m.id === id);
}

export function getNextModule(currentId: string): Module | undefined {
  const index = curriculum.modules.findIndex((m) => m.id === currentId);
  if (index >= 0 && index < curriculum.modules.length - 1) {
    return curriculum.modules[index + 1];
  }
  return undefined;
}

export function getPreviousModule(currentId: string): Module | undefined {
  const index = curriculum.modules.findIndex((m) => m.id === currentId);
  if (index > 0) {
    return curriculum.modules[index - 1];
  }
  return undefined;
}
