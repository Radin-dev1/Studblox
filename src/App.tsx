import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  CaretRight,
  Check,
  Command,
  Eye,
  EyeSlash,
  GameController,
  Gear,
  GitDiff,
  HardDrives,
  Key,
  MagnifyingGlass,
  Plus,
  ShieldCheck,
  SidebarSimple,
  Sparkle,
  Stop,
  TreeStructure,
  WifiHigh,
  X,
} from "phosphor-react";
import { initialMessages, sessions, tree } from "./data";
import { providers, QUALITY_SYSTEM_PROMPT, type ProviderId } from "./ai/providers";
import { listOllamaModels, streamOllamaChat } from "./ai/ollama";
import type { ChatMessage, InstanceNode } from "./types";
const IconButton = ({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    className="icon-button"
    aria-label={label}
    title={label}
    onClick={onClick}
  >
    {children}
  </button>
);
function ExplorerNode({
  node,
  depth = 0,
}: {
  node: InstanceNode;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth < 1);
  return (
    <div>
      <button
        className="tree-row"
        style={{ paddingLeft: `${12 + depth * 17}px` }}
        onClick={() => setOpen((v) => !v)}
      >
        {node.children ? (
          <CaretRight className={open ? "open" : ""} size={13} />
        ) : (
          <span className="tree-spacer" />
        )}
        <span className={`instance-dot ${node.type.toLowerCase()}`} />
        <span>{node.name}</span>
        <small>{node.type}</small>
      </button>
      {open &&
        node.children?.map((child) => (
          <ExplorerNode key={child.id} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}
function CommandMenu({ close }: { close: () => void }) {
  const actions = [
    ["Connect to Studio", "Detect an open Roblox Studio session"],
    ["Run quality pass", "Review, test, and repair the latest build"],
    ["Review changes", "Inspect generated edits before applying"],
    ["New workspace", "Start a focused build session"],
  ];
  return (
    <div className="scrim" onMouseDown={close}>
      <section
        className="command-menu"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="command-search">
          <MagnifyingGlass size={18} />
          <input autoFocus placeholder="Type a command or search…" />
          <kbd>esc</kbd>
        </div>
        <p className="menu-label">Quick actions</p>
        {actions.map(([a, b], i) => (
          <button className="command-item" key={a}>
            <span>
              {[<WifiHigh />, <ShieldCheck />, <GitDiff />, <Plus />][i]}
            </span>
            <div>
              <b>{a}</b>
              <small>{b}</small>
            </div>
            <kbd>⌘{i + 1}</kbd>
          </button>
        ))}
      </section>
    </div>
  );
}
function ProviderDrawer({
  close,
  selected,
  setSelected,
}: {
  close: () => void;
  selected: ProviderId;
  setSelected: (id: ProviderId) => void;
}) {
  const active = providers.find((p) => p.id === selected)!;
  const [key, setKey] = useState(""),
    [show, setShow] = useState(false),
    [model, setModel] = useState(active.defaultModel),
    [url, setUrl] = useState(active.baseUrl ?? ""),
    [saved, setSaved] = useState(false),
    [installed, setInstalled] = useState<string[]>([]),
    [connectionTest, setConnectionTest] = useState<"idle"|"testing"|"ready"|"failed">("idle");
  const choose = (id: ProviderId) => {
    const next = providers.find((p) => p.id === id)!;
    setSelected(id);
    setModel(next.defaultModel);
    setUrl(next.baseUrl ?? "");
    setKey("");
    setSaved(false);
  };
  const modelInfo = active.models?.find((item) => item.id === model);
  const testLocalConnection=async()=>{setConnectionTest("testing");try{const found=await listOllamaModels(url||"http://localhost:11434");setInstalled(found.map(item=>item.name));setConnectionTest("ready")}catch{setInstalled([]);setConnectionTest("failed")}};
  const saveConfiguration = () => {
    localStorage.setItem(
      "stud-blox-ai-provider",
      JSON.stringify({ provider: selected, model, url }),
    );
    setSaved(true);
  };
  return (
    <div className="drawer-scrim" onMouseDown={close}>
      <aside
        className="provider-drawer"
        onMouseDown={(e) => e.stopPropagation()}
        aria-label="AI provider settings"
      >
        <header>
          <div>
            <p>AI ENGINE</p>
            <h2>Models and providers</h2>
          </div>
          <IconButton label="Close settings" onClick={close}>
            <X />
          </IconButton>
        </header>
        <div className="local-first">
          <HardDrives />
          <div>
            <b>Open-source by default</b>
            <span>
              Local models stay the default. Cloud API keys are optional.
            </span>
          </div>
        </div>
        <p className="settings-label">Choose a provider</p>
        <div className="provider-list">
          {providers.map((p) => (
            <button
              key={p.id}
              className={selected === p.id ? "active" : ""}
              onClick={() => choose(p.id)}
            >
              <span className="provider-icon">
                {p.kind === "local" ? <HardDrives /> : <Key />}
              </span>
              <div>
                <b>
                  {p.name}
                  {p.id === "ollama" && <em>DEFAULT</em>}
                </b>
                <small>{p.description}</small>
              </div>
              {selected === p.id && <Check />}
            </button>
          ))}
        </div>
        <section className="provider-form">
          {active.id === "ollama" && <div className={`ollama-test ${connectionTest}`}><span><b>{connectionTest==="ready"?"Ollama is ready":connectionTest==="failed"?"Ollama not found":"Local runtime"}</b><small>{connectionTest==="ready"?`${installed.length} installed model${installed.length===1?"":"s"}`:connectionTest==="failed"?"Start Ollama and try again":"Check your server and discover installed models"}</small></span><button onClick={testLocalConnection}>{connectionTest==="testing"?"Checking…":"Test connection"}</button></div>}
          {active.models && (
            <div className="open-models">
              <div>
                <b>Open model catalog</b>
                <span>{active.models.length} curated choices</span>
              </div>
              {active.models.map((item) => (
                <button
                  className={model === item.id ? "active" : ""}
                  onClick={() => {
                    setModel(item.id);
                    setSaved(false);
                  }}
                  key={item.id}
                >
                  <span>
                    <b>{item.name}</b>
                    <small>{item.use}</small>
                  </span>
                  <em>{installed.some(name=>name===item.id||name.startsWith(`${item.id}:`))?"INSTALLED · ":""}{item.vision ? "VISION · " : ""}{item.size}</em>
                </button>
              ))}
            </div>
          )}
          <label>
            Model name or custom Ollama tag
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              spellCheck={false}
            />
          </label>
          {modelInfo && (
            <p className="model-command">
              Install with <code>ollama pull {modelInfo.id}</code>
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(`ollama pull ${modelInfo.id}`)
                }
              >
                Copy
              </button>
            </p>
          )}
          {(active.baseUrl || active.id === "custom") && (
            <label>
              Server URL
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                spellCheck={false}
              />
            </label>
          )}
          {active.kind === "api" && (
            <label>
              API key
              <div className="secret-input">
                <input
                  type={show ? "text" : "password"}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Paste your key"
                />
                <button
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide key" : "Show key"}
                >
                  {show ? <EyeSlash /> : <Eye />}
                </button>
              </div>
            </label>
          )}
          <button
            className="save-provider"
            onClick={saveConfiguration}
            disabled={active.kind === "api" && !key.trim()}
          >
            {saved ? (
              <>
                <Check />
                Configuration ready
              </>
            ) : (
              <>Use {active.name}</>
            )}
          </button>
          {active.kind === "api" && (
            <p className="key-note">
              <ShieldCheck />
              Keys remain in memory in this preview. Desktop builds should use
              the operating-system keychain.
            </p>
          )}
        </section>
      </aside>
    </div>
  );
}
export function App() {
  const [sidebar, setSidebar] = useState(true),
    [panel, setPanel] = useState<"explorer" | "changes" | "playtest">(
      "explorer",
    ),
    [command, setCommand] = useState(false),
    [settings, setSettings] = useState(false),
    [connected, setConnected] = useState(false),
    [messages, setMessages] = useState<ChatMessage[]>(initialMessages),
    [prompt, setPrompt] = useState(""),
    [provider, setProvider] = useState<ProviderId>("ollama"),
    [building, setBuilding] = useState(false),
    [runtime, setRuntime] = useState<"idle" | "local" | "fallback" | "error">("idle");
  const generation = useRef<AbortController | null>(null);
  const active = providers.find((p) => p.id === provider)!;
  const wordCount = useMemo(
    () => (prompt.trim() ? prompt.trim().split(/\s+/).length : 0),
    [prompt],
  );
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommand(true);
      }
      if (e.key === "Escape") {
        setCommand(false);
        setSettings(false);
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);
  const send = async () => {
    if (!prompt.trim() || building) return;
    const content = prompt.trim();
    setPrompt("");
    const userMessage:ChatMessage={id:crypto.randomUUID(),role:"user",content};
    setMessages((v) => [...v,userMessage]);
    setBuilding(true);
    const saved=JSON.parse(localStorage.getItem("stud-blox-ai-provider")||"null");
    if((saved?.provider||provider)!=="ollama"){
      setRuntime("fallback");
      setMessages(v=>[...v,{id:crypto.randomUUID(),role:"assistant",content:"This provider is configured, but direct cloud calls are disabled in the desktop preview to keep API keys out of the renderer. Choose Ollama for live local responses."}]);
      setBuilding(false);return;
    }
    const id=crypto.randomUUID(),controller=new AbortController();generation.current=controller;
    setMessages(v=>[...v,{id,role:"assistant",content:""}]);
    try{
      setRuntime("local");
      await streamOllamaChat({baseUrl:saved?.url||"http://localhost:11434",model:saved?.model||active.defaultModel,signal:controller.signal,messages:[{role:"system",content:QUALITY_SYSTEM_PROMPT},...messages.map(({role,content})=>({role,content})),{role:"user",content}],onToken:(token)=>setMessages(v=>v.map(message=>message.id===id?{...message,content:message.content+token}:message))});
    }catch(error){
      if(controller.signal.aborted)setMessages(v=>v.map(message=>message.id===id?{...message,content:message.content||"Generation stopped."}:message));
      else{setRuntime("error");setMessages(v=>v.map(message=>message.id===id?{...message,content:`Could not reach Ollama. Start Ollama, install ${saved?.model||active.defaultModel}, then try again. ${error instanceof Error?error.message:""}`}:message))}
    }finally{generation.current=null;setBuilding(false)}
  };
  return (
    <div className={`app ${sidebar ? "" : "sidebar-closed"}`}>
      <a className="skip" href="#composer">
        Skip to composer
      </a>
      <header className="topbar">
        <div className="brand">
          <IconButton
            label="Toggle sidebar"
            onClick={() => setSidebar((v) => !v)}
          >
            <SidebarSimple size={19} />
          </IconButton>
          <span className="brand-mark">S</span>
          <b>Stud Blox</b>
          <span className="beta">PREVIEW</span>
        </div>
        <button className="command-trigger" onClick={() => setCommand(true)}>
          <MagnifyingGlass size={15} />
          Search or run a command <kbd>⌘ K</kbd>
        </button>
        <div className="top-actions">
          <button
            className={`connection ${connected ? "connected" : ""}`}
            onClick={() => setConnected((v) => !v)}
          >
            <span />
            <WifiHigh size={16} />
            {connected ? "Studio connected" : "Connect Studio"}
          </button>
          <IconButton label="AI settings" onClick={() => setSettings(true)}>
            <Gear size={18} />
          </IconButton>
          <div className="avatar">RD</div>
        </div>
      </header>
      {sidebar && (
        <aside className="sidebar">
          <button className="new-chat">
            <Plus size={17} />
            New build session <kbd>⌘ N</kbd>
          </button>
          <div className="side-section">
            <p>Workspace</p>
            <button className="side-link active">
              <Sparkle />
              Agent
            </button>
            <button className="side-link" onClick={() => setPanel("changes")}>
              <GitDiff />
              Changes <span>7</span>
            </button>
            <button className="side-link" onClick={() => setPanel("playtest")}>
              <GameController />
              Playtests
            </button>
            <button className="side-link" onClick={() => setSettings(true)}>
              <Gear />
              AI providers <span>Local</span>
            </button>
          </div>
          <div className="session-heading">
            <p>Recent sessions</p>
            <button>View all</button>
          </div>
          <div className="sessions">
            {sessions.map((s) => (
              <button
                className={`session ${s.status === "active" ? "active" : ""}`}
                key={s.id}
              >
                <span>{s.title}</span>
                <small>{s.updated}</small>
              </button>
            ))}
          </div>
          <div className="sidebar-foot">
            <div className="usage local-usage">
              <span>
                <HardDrives />
                Local engine
              </span>
              <b>FREE</b>
              <p>{runtime==="local"?"Ollama connected":runtime==="error"?"Ollama unavailable":"No metered usage"}</p>
            </div>
            <button className="side-link">
              <Command />
              Keyboard shortcuts
            </button>
          </div>
        </aside>
      )}
      <main className="workspace">
        <section className="chat">
          <div className="chat-header">
            <div>
              <p>BUILD SESSION</p>
              <h1>Combat arena prototype</h1>
            </div>
            <button className="model" onClick={() => setSettings(true)}>
              <span className={active.kind} />
              {active.name} · {active.defaultModel}
              <CaretRight size={13} />
            </button>
          </div>
          <div className="quality-bar">
            <ShieldCheck />
            <span>
              <b>Quality pass on</b> Plan → Build → Review → Test → Repair
            </span>
            <button onClick={() => setSettings(true)}>Configure</button>
          </div>
          <div className="messages">
            {messages.map((m) => (
              <article className={`message ${m.role}`} key={m.id}>
                {m.role === "assistant" && (
                  <div className="agent-icon">
                    <Sparkle size={15} />
                  </div>
                )}
                <div className="bubble">
                  <p>{m.content}</p>
                  {m.steps && (
                    <div className="steps">
                      {m.steps.map((x) => (
                        <div key={x}>
                          <Check size={13} />
                          <span>{x}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {m.role === "assistant" && (
                    <div className="message-actions">
                      <button onClick={()=>navigator.clipboard?.writeText(m.content)}>Copy</button>
                      <button onClick={() => setPanel("changes")}>
                        Open changes
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
            {building && (
              <article className="message assistant">
                <div className="agent-icon">
                  <Sparkle size={15} />
                </div>
                <div className="thinking">
                  <i />
                  <i />
                  <i />
                  <span>{runtime==="local"?"Generating with your local Ollama model":"Preparing the build"}</span>
                  <button className="stop-generation" onClick={()=>generation.current?.abort()}><Stop/>Stop</button>
                </div>
              </article>
            )}
          </div>
          <div className="composer-wrap">
            <div className="composer" id="composer">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Describe what you want to build or change…"
                aria-label="Build prompt"
              />
              <div className="composer-tools">
                <div>
                  <button title="Add context">
                    <Plus size={17} />
                  </button>
                  <button className="mode">
                    <Sparkle size={14} />
                    Build agent
                  </button>
                  <button className="mode">
                    <ShieldCheck size={14} />
                    High quality
                  </button>
                </div>
                <span>
                  {wordCount > 0 && `${wordCount} words`}
                  <button
                    className="send"
                    disabled={!prompt.trim()}
                    onClick={send}
                    aria-label="Send"
                  >
                    <ArrowUp size={17} />
                  </button>
                </span>
              </div>
            </div>
            <p className="hint">
              Every build is reviewed and playtested before Stud Blox marks it
              complete.
            </p>
          </div>
        </section>
        <aside className="inspector">
          <div className="tabs">
            <button
              className={panel === "explorer" ? "active" : ""}
              onClick={() => setPanel("explorer")}
            >
              <TreeStructure />
              Explorer
            </button>
            <button
              className={panel === "changes" ? "active" : ""}
              onClick={() => setPanel("changes")}
            >
              <GitDiff />
              Changes <span>7</span>
            </button>
            <button
              className={panel === "playtest" ? "active" : ""}
              onClick={() => setPanel("playtest")}
            >
              <GameController />
              Test
            </button>
          </div>
          {panel === "explorer" && (
            <>
              <div className="panel-search">
                <MagnifyingGlass />
                <input placeholder="Filter instances" />
              </div>
              <div className="tree">
                {tree.map((n) => (
                  <ExplorerNode key={n.id} node={n} />
                ))}
              </div>
              <div className="properties">
                <p>SELECTION</p>
                <div className="empty-selection">
                  <TreeStructure size={25} />
                  <span>Select an instance to inspect its properties</span>
                </div>
              </div>
            </>
          )}
          {panel === "changes" && (
            <div className="change-list">
              <div className="change-summary">
                <b>7 changes ready</b>
                <span>+184 −23</span>
              </div>
              {[
                "RoundService.server.lua",
                "SafeZoneController.lua",
                "ArenaConfig.lua",
                "RoundState",
              ].map((x, i) => (
                <button key={x}>
                  <span className={i === 3 ? "added" : "modified"}>
                    {i === 3 ? "A" : "M"}
                  </span>
                  <div>
                    {x}
                    <small>
                      {i === 3 ? "ReplicatedStorage" : "ServerScriptService"}
                    </small>
                  </div>
                  <CaretRight />
                </button>
              ))}
            </div>
          )}
          {panel === "playtest" && (
            <div className="playtest">
              <div className="test-orbit">
                <GameController size={31} />
              </div>
              <h3>Ready to test</h3>
              <p>
                Run the experience and watch server output, assertions, and
                player flows here.
              </p>
              <button disabled={!connected}>Start playtest</button>
              <small>
                {connected
                  ? "Quality gate will repair detected failures"
                  : "Connect Studio to begin"}
              </small>
            </div>
          )}
        </aside>
      </main>
      {command && <CommandMenu close={() => setCommand(false)} />}{" "}
      {settings && (
        <ProviderDrawer
          close={() => setSettings(false)}
          selected={provider}
          setSelected={setProvider}
        />
      )}
    </div>
  );
}
