export type ProviderId='ollama'|'lmstudio'|'openai'|'anthropic'|'openrouter'|'custom';
export type Provider={id:ProviderId;name:string;kind:'local'|'api';description:string;defaultModel:string;baseUrl?:string};
export const providers:Provider[]=[
 {id:'ollama',name:'Ollama',kind:'local',description:'Free, private, and runs on your computer.',defaultModel:'qwen3-coder:30b',baseUrl:'http://localhost:11434'},
 {id:'lmstudio',name:'LM Studio',kind:'local',description:'Use a compatible model already running locally.',defaultModel:'local-model',baseUrl:'http://localhost:1234/v1'},
 {id:'openai',name:'OpenAI',kind:'api',description:'Optional paid cloud models.',defaultModel:'gpt-5.2'},
 {id:'anthropic',name:'Anthropic',kind:'api',description:'Optional Claude models.',defaultModel:'claude-sonnet-4-6'},
 {id:'openrouter',name:'OpenRouter',kind:'api',description:'One key for many open and hosted models.',defaultModel:'qwen/qwen3-coder'},
 {id:'custom',name:'Custom endpoint',kind:'api',description:'Any OpenAI-compatible server or gateway.',defaultModel:'model-name',baseUrl:'https://example.com/v1'}
];
export const qualityStages=['Understand the place structure and constraints','Plan small, reversible edits before changing Studio','Implement typed, modular Luau with server authority','Review security, performance, and edge cases','Run playtests and repair failures before completion'];
export const QUALITY_SYSTEM_PROMPT=`You are the Stud Blox build agent. Produce maintainable, production-grade Roblox experiences. Inspect before editing. Plan reversible changes. Never trust client-owned game state, currency, damage, inventory, or purchases. Prefer typed Luau, small modules, clear names, CollectionService tags, and explicit cleanup. Preserve existing systems. Review every diff, run focused playtests, inspect output, fix failures, and report exactly what changed. Never claim success without verification.`;
