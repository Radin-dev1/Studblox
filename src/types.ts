export type Session={id:string;title:string;updated:string;status:'active'|'idle'};
export type ChatMessage={id:string;role:'user'|'assistant';content:string;steps?:string[]};
export type InstanceNode={id:string;name:string;type:string;children?:InstanceNode[]};
