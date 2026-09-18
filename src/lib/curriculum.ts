import curriculumData from "@/data/curriculum.json";

export interface CiscoCommand {
  cmd: string;
  desc: string;
}

export interface Diagram {
  src: string;
  caption: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  readTime: string;
  summary: string;
  keyPoints: string[];
  ciscoCommands: CiscoCommand[];
  diagrams: Diagram[];
  content: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LabAssignment {
  title: string;
  duration: string;
  deliverable: string;
  rubric: string[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  volume: number;
  description: string;
  estimatedHours: number;
  badge: string;
  color: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
  labAssignment: LabAssignment;
}

export interface Curriculum {
  title: string;
  subtitle: string;
  author: string;
  totalModules: number;
  modules: Module[];
}

export const curriculum: Curriculum = curriculumData as Curriculum;

export function getAllModules(): Module[] {
  return curriculum.modules;
}

export function getModuleById(id: string): Module | undefined {
  return curriculum.modules.find((m) => m.id === id);
}

export function getLessonById(moduleId: string, lessonId: string): Lesson | undefined {
  const mod = getModuleById(moduleId);
  if (!mod) return undefined;
  return mod.lessons.find((l) => l.id === lessonId);
}
