export type OllamaModel = {name:string;size:number;details?:{parameter_size?:string;quantization_level?:string}};
export async function listOllamaModels(baseUrl='http://localhost:11434',signal?:AbortSignal):Promise<OllamaModel[]> {
  const response=await fetch(`${baseUrl.replace(/\/$/,'')}/api/tags`,{signal});
  if(!response.ok) throw new Error(`Ollama returned ${response.status}`);
  const data=await response.json();
  return Array.isArray(data.models)?data.models:[];
}
export async function streamOllamaChat({baseUrl='http://localhost:11434',model,messages,signal,onToken}:{baseUrl?:string;model:string;messages:{role:string;content:string}[];signal?:AbortSignal;onToken:(token:string)=>void}) {
  const response=await fetch(`${baseUrl.replace(/\/$/,'')}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model,messages,stream:true}),signal});
  if(!response.ok){const detail=await response.text();throw new Error(detail||`Ollama returned ${response.status}`)}
  if(!response.body) throw new Error('Ollama returned an empty response');
  const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';
  while(true){const {done,value}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});const lines=buffer.split('\n');buffer=lines.pop()||'';for(const line of lines){if(!line.trim())continue;const part=JSON.parse(line);if(part.message?.content)onToken(part.message.content);if(part.error)throw new Error(part.error)}}
}
