import {useMemo,useState} from 'react';
import {DownloadSimple,BracketsCurly,CaretRight,Cube,GameController,ImageSquare,MagnifyingGlass,MagicWand,PaperPlaneTilt,Plus,Sparkle} from 'phosphor-react';

type ToolMode='script'|'game'|'assets'|'generate';
type StudioItem={name:string;className:string;color:string;children?:StudioItem[]};
const services:StudioItem[]=[
 {name:'Workspace',className:'Workspace',color:'#54a8f5',children:[{name:'Arena',className:'Model',color:'#9aa4a0'},{name:'SpawnLocation',className:'SpawnLocation',color:'#54a8f5'}]},
 {name:'Players',className:'Players',color:'#52d18c'},{name:'Lighting',className:'Lighting',color:'#f3d35d'},{name:'MaterialService',className:'MaterialService',color:'#d49b63'},
 {name:'ReplicatedFirst',className:'ReplicatedFirst',color:'#71a9db'},{name:'ReplicatedStorage',className:'ReplicatedStorage',color:'#d7d75c',children:[{name:'RoundState',className:'RemoteEvent',color:'#61c8ec'}]},
 {name:'ServerScriptService',className:'ServerScriptService',color:'#5ed894',children:[{name:'RoundService',className:'ModuleScript',color:'#67d695'}]},
 {name:'ServerStorage',className:'ServerStorage',color:'#54c789'},{name:'StarterGui',className:'StarterGui',color:'#f0c950'},{name:'StarterPack',className:'StarterPack',color:'#f1ce60'},
 {name:'StarterPlayer',className:'StarterPlayer',color:'#dfc45f'},{name:'Teams',className:'Teams',color:'#5c9de2'},{name:'SoundService',className:'SoundService',color:'#49a8e6'},{name:'TextChatService',className:'TextChatService',color:'#dadede'}
];
const code=`local Players = game:GetService("Players")

local RoundService = {}
RoundService.__index = RoundService

function RoundService.new()
    local self = setmetatable({}, RoundService)
    self.roundActive = false
    self.participants = {}
    return self
end

function RoundService:startRound()
    if self.roundActive then return end
    self.roundActive = true
    self.participants = Players:GetPlayers()
end

return RoundService`;
const assets=[['Forest cabin','MODEL'],['Low-poly pine set','MODEL'],['Fantasy sword pack','MODEL'],['Inventory icons','IMAGE'],['Round lobby kit','MODEL'],['Stone materials','MATERIAL']];

function TreeItem({item,selected,onSelect,depth=0}:{item:StudioItem;selected:string;onSelect:(v:StudioItem)=>void;depth?:number}){const [open,setOpen]=useState(depth===0);return <div><button className={`studio-item ${selected===item.name?'selected':''}`} style={{paddingLeft:8+depth*16}} onClick={()=>{onSelect(item);if(item.children)setOpen(v=>!v)}}>{item.children?<CaretRight className={open?'open':''}/>:<span className="item-space"/>}<i style={{background:item.color}}/><span>{item.name}</span></button>{open&&item.children?.map(child=><TreeItem key={child.name} item={child} selected={selected} onSelect={onSelect} depth={depth+1}/>)}</div>}

export function Workbench(){
 const [mode,setMode]=useState<ToolMode>('script'),[selected,setSelected]=useState(services[0]),[query,setQuery]=useState(''),[ask,setAsk]=useState(''),[sent,setSent]=useState('');
 const filtered=useMemo(()=>services.filter(x=>x.name.toLowerCase().includes(query.toLowerCase())),[query]);
 return <section className="workbench">
  <nav className="workbench-tabs">{([['script',<BracketsCurly/>,'Script'],['game',<GameController/>,'Build game'],['assets',<DownloadSimple/>,'Creator Store'],['generate',<MagicWand/>,'Generate']] as const).map(([id,icon,label])=><button className={mode===id?'active':''} onClick={()=>setMode(id)} key={id}>{icon}{label}</button>)}</nav>
  {mode==='script'&&<div className="script-layout"><aside className="studio-explorer"><header><b>Explorer</b><button><Plus/></button></header><label><MagnifyingGlass/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search classes"/></label><div className="studio-tree">{filtered.map(item=><TreeItem key={item.name} item={item} selected={selected.name} onSelect={setSelected}/>)}</div></aside><main className="code-space"><header><div><span className="script-dot"/>RoundService.lua</div><small>{selected.name} <b>·</b> {selected.className}</small></header><div className="code-editor">{code.split('\n').map((line,i)=><div key={i}><span>{i+1}</span><code>{line||' '}</code></div>)}</div><div className="ai-script"><div><Sparkle/><span><b>Ask AI about {selected.name}</b><small>Stud Blox includes the selected class, properties, and related scripts as context.</small></span></div>{sent&&<p>Queued: “{sent}”</p>}<form onSubmit={e=>{e.preventDefault();if(ask.trim()){setSent(ask);setAsk('')}}}><input value={ask} onChange={e=>setAsk(e.target.value)} placeholder={`Script ${selected.name} to…`}/><button disabled={!ask.trim()}><PaperPlaneTilt/></button></form></div></main></div>}
  {mode==='game'&&<div className="feature-stage"><span className="stage-icon"><GameController/></span><p>GAME BUILDER</p><h2>Describe the whole experience.</h2><p className="stage-copy">Stud Blox breaks the game into map, systems, UI, data, and playtests. You approve the plan before it changes Studio.</p><div className="starter-prompts">{['Round-based survival game','Cozy farming simulator','Competitive movement obby','Story-driven adventure'].map(x=><button key={x}>{x}<CaretRight/></button>)}</div><textarea placeholder="Describe the game, its audience, core loop, visual style, and multiplayer rules…"/><button className="stage-primary"><Sparkle/>Create build plan</button></div>}
  {mode==='assets'&&<div className="asset-stage"><div className="asset-head"><div><p>ROBLOX CREATOR STORE</p><h2>Find the right building blocks.</h2></div><a href="https://create.roblox.com/store" target="_blank" rel="noreferrer">Open Creator Store ↗</a></div><label className="asset-search"><MagnifyingGlass/><input placeholder="Search models, images, audio, meshes…"/></label><div className="asset-grid">{assets.map(([name,type],i)=><article key={name}><div className={`asset-preview preview-${i}`}><Cube/></div><span>{type}</span><h3>{name}</h3><p>Review creator, permissions, and scripts before inserting.</p><button>Inspect asset</button></article>)}</div></div>}
  {mode==='generate'&&<div className="generate-stage"><div><p>ORIGINAL ASSETS</p><h2>Generate for the scene.</h2><p>Create a draft asset, inspect it, then decide whether to insert it into Studio.</p></div><div className="generator-grid"><article><Cube/><span>3D MODEL</span><h3>Props, terrain, and characters</h3><p>Describe shape, style, materials, scale, and collision needs.</p><textarea placeholder="A stylized low-poly sci-fi crate…"/><button>Generate 3D draft</button></article><article><ImageSquare/><span>2D IMAGE</span><h3>Icons, textures, and UI art</h3><p>Choose the intended use so sizing and transparency are correct.</p><textarea placeholder="A clean inventory icon for a frost sword…"/><button>Generate 2D draft</button></article></div></div>}
 </section>
}
