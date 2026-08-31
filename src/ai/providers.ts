export type ProviderId =
  | "ollama"
  | "lmstudio"
  | "openai"
  | "anthropic"
  | "openrouter"
  | "custom";
export type ModelOption = {
  id: string;
  name: string;
  size: string;
  use: string;
  vision?: boolean;
};
export type Provider = {
  id: ProviderId;
  name: string;
  kind: "local" | "api";
  description: string;
  defaultModel: string;
  baseUrl?: string;
  models?: ModelOption[];
};
export const openModels: ModelOption[] = [
  {
    id: "qwen3-coder:30b",
    name: "Qwen3 Coder 30B",
    size: "19 GB",
    use: "Best default for complex Roblox and Luau work",
  },
  {
    id: "qwen3-coder-next",
    name: "Qwen3 Coder Next",
    size: "large",
    use: "Agentic coding and longer build tasks",
  },
  {
    id: "deepseek-coder-v2:16b",
    name: "DeepSeek Coder V2",
    size: "8.9 GB",
    use: "Strong code generation on mid-range hardware",
  },
  {
    id: "deepseek-coder:6.7b",
    name: "DeepSeek Coder 6.7B",
    size: "3.8 GB",
    use: "Fast coding for smaller computers",
  },
  {
    id: "codegemma:7b",
    name: "CodeGemma 7B",
    size: "5 GB",
    use: "Completion, explanations, and small scripts",
  },
  {
    id: "qwen2.5-coder:7b",
    name: "Qwen2.5 Coder 7B",
    size: "4.7 GB",
    use: "Balanced lightweight coding",
  },
  {
    id: "deepseek-r1:8b",
    name: "DeepSeek R1 8B",
    size: "5.2 GB",
    use: "Reasoning, planning, and debugging",
  },
  {
    id: "llama3.2-vision:11b",
    name: "Llama 3.2 Vision",
    size: "7.8 GB",
    use: "Understand screenshots and UI references",
    vision: true,
  },
  {
    id: "qwen2.5vl:7b",
    name: "Qwen2.5 VL 7B",
    size: "6 GB",
    use: "Vision-based scene and interface analysis",
    vision: true,
  },
];
export const providers: Provider[] = [
  {
    id: "ollama",
    name: "Ollama",
    kind: "local",
    description: "Free, private, and runs on your computer.",
    defaultModel: "qwen3-coder:30b",
    baseUrl: "http://localhost:11434",
    models: openModels,
  },
  {
    id: "lmstudio",
    name: "LM Studio",
    kind: "local",
    description: "Use a compatible model already running locally.",
    defaultModel: "qwen3-coder:30b",
    baseUrl: "http://localhost:1234/v1",
    models: openModels,
  },
  {
    id: "openai",
    name: "OpenAI",
    kind: "api",
    description: "Optional paid cloud models.",
    defaultModel: "gpt-5.2",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    kind: "api",
    description: "Optional Claude models.",
    defaultModel: "claude-sonnet-4-6",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    kind: "api",
    description: "One key for many open and hosted models.",
    defaultModel: "qwen/qwen3-coder",
  },
  {
    id: "custom",
    name: "Custom endpoint",
    kind: "api",
    description: "Any OpenAI-compatible server or gateway.",
    defaultModel: "model-name",
    baseUrl: "https://example.com/v1",
  },
];
export const qualityStages = [
  "Understand the place structure and constraints",
  "Plan small, reversible edits before changing Studio",
  "Implement typed, modular Luau with server authority",
  "Review security, performance, and edge cases",
  "Run playtests and repair failures before completion",
];
export const QUALITY_SYSTEM_PROMPT = `You are the Stud Blox build agent. Produce maintainable, production-grade Roblox experiences. Inspect before editing. Plan reversible changes. Never trust client-owned game state, currency, damage, inventory, or purchases. Prefer typed Luau, small modules, clear names, CollectionService tags, and explicit cleanup. Preserve existing systems. Review every diff, run focused playtests, inspect output, fix failures, and report exactly what changed. Never claim success without verification.`;
