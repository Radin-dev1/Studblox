import { useEffect, useMemo, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowUUpRight,
  BracketsCurly,
  CaretRight,
  Check,
  Cube,
  DownloadSimple,
  FloppyDisk,
  GameController,
  Heart,
  ImageSquare,
  MagnifyingGlass,
  MagicWand,
  PaperPlaneTilt,
  Plus,
  Sparkle,
  Trash,
  Warning,
} from "phosphor-react";
type ToolMode = "script" | "game" | "assets" | "generate";
type StudioItem = {
  id: string;
  name: string;
  className: string;
  color: string;
  children?: StudioItem[];
};
type ScriptFile = { id: string; name: string; code: string; dirty?: boolean };
const starterServices: StudioItem[] = [
  {
    id: "workspace",
    name: "Workspace",
    className: "Workspace",
    color: "#54a8f5",
    children: [
      { id: "arena", name: "Arena", className: "Model", color: "#9aa4a0" },
      {
        id: "spawn",
        name: "SpawnLocation",
        className: "SpawnLocation",
        color: "#54a8f5",
      },
    ],
  },
  { id: "players", name: "Players", className: "Players", color: "#52d18c" },
  { id: "lighting", name: "Lighting", className: "Lighting", color: "#f3d35d" },
  {
    id: "materials",
    name: "MaterialService",
    className: "MaterialService",
    color: "#d49b63",
  },
  {
    id: "repfirst",
    name: "ReplicatedFirst",
    className: "ReplicatedFirst",
    color: "#71a9db",
  },
  {
    id: "repstorage",
    name: "ReplicatedStorage",
    className: "ReplicatedStorage",
    color: "#d7d75c",
    children: [
      {
        id: "roundstate",
        name: "RoundState",
        className: "RemoteEvent",
        color: "#61c8ec",
      },
    ],
  },
  {
    id: "serverscripts",
    name: "ServerScriptService",
    className: "ServerScriptService",
    color: "#5ed894",
    children: [
      {
        id: "roundservice",
        name: "RoundService",
        className: "ModuleScript",
        color: "#67d695",
      },
    ],
  },
  {
    id: "serverstorage",
    name: "ServerStorage",
    className: "ServerStorage",
    color: "#54c789",
  },
  {
    id: "startergui",
    name: "StarterGui",
    className: "StarterGui",
    color: "#f0c950",
  },
  {
    id: "starterpack",
    name: "StarterPack",
    className: "StarterPack",
    color: "#f1ce60",
  },
  {
    id: "starterplayer",
    name: "StarterPlayer",
    className: "StarterPlayer",
    color: "#dfc45f",
  },
  { id: "teams", name: "Teams", className: "Teams", color: "#5c9de2" },
  {
    id: "sound",
    name: "SoundService",
    className: "SoundService",
    color: "#49a8e6",
  },
  {
    id: "chat",
    name: "TextChatService",
    className: "TextChatService",
    color: "#dadede",
  },
];
const starterCode = `--!strict\nlocal Players = game:GetService("Players")\n\nlocal RoundService = {}\nRoundService.__index = RoundService\n\nfunction RoundService.new()\n    local self = setmetatable({}, RoundService)\n    self.roundActive = false\n    self.participants = {}\n    return self\nend\n\nfunction RoundService:startRound()\n    if self.roundActive then return end\n    self.roundActive = true\n    self.participants = Players:GetPlayers()\nend\n\nreturn RoundService`;
const starterFiles: ScriptFile[] = [
  { id: "round", name: "RoundService.lua", code: starterCode },
  {
    id: "config",
    name: "ArenaConfig.lua",
    code: "--!strict\nreturn {\n    MinimumPlayers = 2,\n    RoundLength = 180,\n    Intermission = 20,\n}",
  },
];
const assets = [
  ["Forest cabin", "MODEL"],
  ["Low-poly pine set", "MODEL"],
  ["Fantasy sword pack", "MODEL"],
  ["Inventory icons", "IMAGE"],
  ["Round lobby kit", "MODEL"],
  ["Stone materials", "MATERIAL"],
  ["Footstep collection", "AUDIO"],
  ["Neon city signs", "IMAGE"],
];
const storageKey = "stud-blox-guest-project-v1";
function TreeItem({
  item,
  selected,
  onSelect,
  depth = 0,
}: {
  item: StudioItem;
  selected: string;
  onSelect: (v: StudioItem) => void;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth === 0);
  return (
    <div>
      <button
        className={`studio-item ${selected === item.id ? "selected" : ""}`}
        style={{ paddingLeft: 8 + depth * 16 }}
        onClick={() => {
          onSelect(item);
          if (item.children) setOpen((v) => !v);
        }}
      >
        {item.children ? (
          <CaretRight className={open ? "open" : ""} />
        ) : (
          <span className="item-space" />
        )}
        <i style={{ background: item.color }} />
        <span>{item.name}</span>
        <small>{item.className}</small>
      </button>
      {open &&
        item.children?.map((child) => (
          <TreeItem
            key={child.id}
            item={child}
            selected={selected}
            onSelect={onSelect}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}
export function Workbench() {
  const restored = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "null");
    } catch {
      return null;
    }
  }, []);
  const [mode, setMode] = useState<ToolMode>("script"),
    [services, setServices] = useState<StudioItem[]>(
      restored?.services || starterServices,
    ),
    [selected, setSelected] = useState<StudioItem>(services[0]),
    [query, setQuery] = useState(""),
    [ask, setAsk] = useState(""),
    [notice, setNotice] = useState("Ready"),
    [files, setFiles] = useState<ScriptFile[]>(restored?.files || starterFiles),
    [activeFile, setActiveFile] = useState(restored?.activeFile || "round"),
    [history, setHistory] = useState<string[]>([]),
    [future, setFuture] = useState<string[]>([]),
    [bottom, setBottom] = useState<"output" | "diagnostics">("output"),
    [assetQuery, setAssetQuery] = useState(""),
    [assetType, setAssetType] = useState("ALL"),
    [favorites, setFavorites] = useState<string[]>([]),
    [gameIdea, setGameIdea] = useState(""),
    [plan, setPlan] = useState<string[]>([]),
    [generation, setGeneration] = useState(""),
    [drafts, setDrafts] = useState<string[]>([]),
    [projectName, setProjectName] = useState(
      restored?.projectName || "Combat arena",
    ),
    [explainInCode, setExplainInCode] = useState(
      localStorage.getItem("stud-blox-explain-in-code") === null
        ? (restored?.explainInCode ?? true)
        : localStorage.getItem("stud-blox-explain-in-code") === "true",
    );
  const current = files.find((f) => f.id === activeFile) || files[0];
  const filtered = useMemo(
    () =>
      services.filter(
        (x) =>
          x.name.toLowerCase().includes(query.toLowerCase()) ||
          x.className.toLowerCase().includes(query.toLowerCase()),
      ),
    [services, query],
  );
  const shownAssets = assets.filter(
    ([name, type]) =>
      (assetType === "ALL" || type === assetType) &&
      name.toLowerCase().includes(assetQuery.toLowerCase()),
  );
  const diagnostics = useMemo(() => {
    const found: string[] = [];
    if (!current.code.includes("--!strict"))
      found.push("Strict type checking is not enabled.");
    if (/wait\(/.test(current.code))
      found.push("Prefer task.wait() over wait().");
    if (
      /OnServerEvent/.test(current.code) &&
      !/typeof|type\(/.test(current.code)
    )
      found.push("Validate RemoteEvent arguments on the server.");
    return found;
  }, [current.code]);
  const save = () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        services,
        files,
        activeFile,
        projectName,
        explainInCode,
        updatedAt: new Date().toISOString(),
      }),
    );
    setFiles((v) => v.map((f) => ({ ...f, dirty: false })));
    setNotice("Saved locally just now");
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  });
  const edit = (value: string) => {
    setHistory((h) => [...h.slice(-39), current.code]);
    setFuture([]);
    setFiles((v) =>
      v.map((f) =>
        f.id === current.id ? { ...f, code: value, dirty: true } : f,
      ),
    );
    setNotice("Unsaved changes");
  };
  const undo = () => {
    const last = history.at(-1);
    if (last === undefined) return;
    setFuture((f) => [current.code, ...f]);
    setHistory((h) => h.slice(0, -1));
    setFiles((v) =>
      v.map((f) =>
        f.id === current.id ? { ...f, code: last, dirty: true } : f,
      ),
    );
  };
  const redo = () => {
    const next = future[0];
    if (next === undefined) return;
    setHistory((h) => [...h, current.code]);
    setFuture((f) => f.slice(1));
    setFiles((v) =>
      v.map((f) =>
        f.id === current.id ? { ...f, code: next, dirty: true } : f,
      ),
    );
  };
  const addFile = () => {
    const id = crypto.randomUUID(),
      name = `Script${files.length + 1}.lua`;
    setFiles((v) => [...v, { id, name, code: "--!strict\n\n", dirty: true }]);
    setActiveFile(id);
    setNotice(`Created ${name}`);
  };
  const addInstance = () => {
    const item = {
      id: crypto.randomUUID(),
      name: `NewPart${services.length}`,
      className: "Part",
      color: "#54a8f5",
    };
    setServices((v) => [...v, item]);
    setSelected(item);
    setNotice("Created a local Part draft");
  };
  const exportProject = () => {
    const blob = new Blob(
        [JSON.stringify({ projectName, services, files }, null, 2)],
        { type: "application/json" },
      ),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "stud-blox"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Project exported");
  };
  const askAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ask.trim()) return;
    const cleanCode = `\n\nlocal function configureSelected(instance: Instance)\n    instance:SetAttribute("StudBloxGenerated", true)\nend\n`;
    const explainedCode = `\n\n-- AI draft for ${selected.name}\n-- Request: ${ask.trim()}\n-- Review this draft before applying it in Roblox Studio.\n${cleanCode.trimStart()}`;
    edit(current.code + (explainInCode ? explainedCode : cleanCode));
    setAsk("");
    setNotice("AI draft added for review");
  };
  return (
    <section className="workbench">
      <header className="project-bar">
        <div>
          <span className="project-health" />
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            aria-label="Project name"
          />
          <small>{notice}</small>
        </div>
        <span>
          <button onClick={undo} disabled={!history.length} title="Undo">
            <ArrowCounterClockwise />
          </button>
          <button onClick={redo} disabled={!future.length} title="Redo">
            <ArrowUUpRight />
          </button>
          <button onClick={save}>
            <FloppyDisk />
            Save
          </button>
          <button onClick={exportProject}>
            <DownloadSimple />
            Export
          </button>
        </span>
      </header>
      <nav className="workbench-tabs">
        {(
          [
            ["script", <BracketsCurly />, "Script"],
            ["game", <GameController />, "Build game"],
            ["assets", <DownloadSimple />, "Creator Store"],
            ["generate", <MagicWand />, "Generate"],
          ] as const
        ).map(([id, icon, label]) => (
          <button
            className={mode === id ? "active" : ""}
            onClick={() => setMode(id)}
            key={id}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>
      {mode === "script" && (
        <div className="script-layout">
          <aside className="studio-explorer">
            <header>
              <b>Explorer</b>
              <button onClick={addInstance} title="Add instance">
                <Plus />
              </button>
            </header>
            <label>
              <MagnifyingGlass />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search classes"
              />
            </label>
            <div className="studio-tree">
              {filtered.length ? (
                filtered.map((item) => (
                  <TreeItem
                    key={item.id}
                    item={item}
                    selected={selected.id}
                    onSelect={setSelected}
                  />
                ))
              ) : (
                <p className="tree-empty">No matching classes</p>
              )}
            </div>
            <section className="property-grid">
              <p>PROPERTIES</p>
              <label>
                Name
                <input
                  value={selected.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setSelected((v) => ({ ...v, name }));
                    setServices((v) =>
                      v.map((x) => (x.id === selected.id ? { ...x, name } : x)),
                    );
                  }}
                />
              </label>
              <label>
                Class
                <input value={selected.className} readOnly />
              </label>
              <label>
                Archivable
                <select defaultValue="true">
                  <option>true</option>
                  <option>false</option>
                </select>
              </label>
            </section>
          </aside>
          <main className="code-space">
            <div className="file-tabs">
              {files.map((f) => (
                <button
                  className={f.id === current.id ? "active" : ""}
                  onClick={() => setActiveFile(f.id)}
                  key={f.id}
                >
                  <span />
                  {f.name}
                  {f.dirty && <i />}
                </button>
              ))}
              <button className="add-file" onClick={addFile}>
                <Plus />
              </button>
            </div>
            <textarea
              className="real-editor"
              spellCheck={false}
              value={current.code}
              onChange={(e) => edit(e.target.value)}
              aria-label="Luau code editor"
            />
            <div className="bottom-panel">
              <nav>
                <button
                  className={bottom === "output" ? "active" : ""}
                  onClick={() => setBottom("output")}
                >
                  Output
                </button>
                <button
                  className={bottom === "diagnostics" ? "active" : ""}
                  onClick={() => setBottom("diagnostics")}
                >
                  Diagnostics <b>{diagnostics.length}</b>
                </button>
              </nav>
              {bottom === "output" ? (
                <p>
                  <Check /> Local workspace ready. Connect Roblox Studio to run
                  this script.
                </p>
              ) : diagnostics.length ? (
                diagnostics.map((x) => (
                  <p key={x}>
                    <Warning />
                    {x}
                  </p>
                ))
              ) : (
                <p>
                  <Check />
                  No local diagnostics found.
                </p>
              )}
            </div>
            <div className="ai-script">
              <div>
                <Sparkle />
                <span>
                  <b>Ask AI about {selected.name}</b>
                  <small>
                    Selected class and current script are included as context.
                  </small>
                </span>
                <label className="code-comment-setting">
                  <input
                    type="checkbox"
                    checked={explainInCode}
                    onChange={(e) => {
                      setExplainInCode(e.target.checked);
                      localStorage.setItem(
                        "stud-blox-explain-in-code",
                        String(e.target.checked),
                      );
                      setNotice(
                        e.target.checked
                          ? "AI code explanations enabled"
                          : "Code only mode enabled",
                      );
                    }}
                  />
                  <span>
                    Explain in script
                    <small>{explainInCode ? "Comments on" : "Code only"}</small>
                  </span>
                </label>
              </div>
              <form onSubmit={askAi}>
                <input
                  value={ask}
                  onChange={(e) => setAsk(e.target.value)}
                  placeholder={`Script ${selected.name} to…`}
                />
                <button disabled={!ask.trim()}>
                  <PaperPlaneTilt />
                </button>
              </form>
            </div>
          </main>
        </div>
      )}
      {mode === "game" && (
        <div className="feature-stage">
          <span className="stage-icon">
            <GameController />
          </span>
          <p>GAME BUILDER</p>
          <h2>Turn an idea into a build plan.</h2>
          <p className="stage-copy">
            Choose a starting point or describe the core loop. The plan stays
            editable before anything reaches Studio.
          </p>
          <div className="starter-prompts">
            {[
              "Round-based survival game",
              "Cozy farming simulator",
              "Competitive movement obby",
              "Story-driven adventure",
            ].map((x) => (
              <button onClick={() => setGameIdea(x)} key={x}>
                {x}
                <CaretRight />
              </button>
            ))}
          </div>
          <textarea
            value={gameIdea}
            onChange={(e) => setGameIdea(e.target.value)}
            placeholder="Describe the audience, core loop, art direction, progression, and multiplayer rules…"
          />
          <button
            className="stage-primary"
            disabled={!gameIdea.trim()}
            onClick={() =>
              setPlan([
                "Create a small playable map and spawn flow",
                "Build server-owned round and progression systems",
                "Add responsive HUD, menus, and accessibility settings",
                "Run multiplayer, mobile, and failure-path playtests",
              ])
            }
          >
            <Sparkle />
            Create build plan
          </button>
          {plan.length > 0 && (
            <ol className="build-plan">
              {plan.map((x, i) => (
                <li key={x}>
                  <b>{i + 1}</b>
                  <span>{x}</span>
                  <Check />
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
      {mode === "assets" && (
        <div className="asset-stage">
          <div className="asset-head">
            <div>
              <p>ROBLOX CREATOR STORE</p>
              <h2>Find safer building blocks.</h2>
            </div>
            <a
              href="https://create.roblox.com/store"
              target="_blank"
              rel="noreferrer"
            >
              Open Creator Store ↗
            </a>
          </div>
          <label className="asset-search">
            <MagnifyingGlass />
            <input
              value={assetQuery}
              onChange={(e) => setAssetQuery(e.target.value)}
              placeholder="Search models, images, audio, meshes…"
            />
          </label>
          <div className="asset-filters">
            {["ALL", "MODEL", "IMAGE", "AUDIO", "MATERIAL"].map((x) => (
              <button
                className={assetType === x ? "active" : ""}
                onClick={() => setAssetType(x)}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
          <div className="asset-grid">
            {shownAssets.map(([name, type], i) => (
              <article key={name}>
                <button
                  className={`favorite ${favorites.includes(name) ? "active" : ""}`}
                  onClick={() =>
                    setFavorites((v) =>
                      v.includes(name)
                        ? v.filter((x) => x !== name)
                        : [...v, name],
                    )
                  }
                >
                  <Heart
                    weight={favorites.includes(name) ? "fill" : "regular"}
                  />
                </button>
                <div className={`asset-preview preview-${i}`}>
                  <Cube />
                </div>
                <span>{type}</span>
                <h3>{name}</h3>
                <p>Scan scripts and permissions before inserting this asset.</p>
                <button
                  onClick={() => setNotice(`${name} queued for inspection`)}
                >
                  Inspect asset
                </button>
              </article>
            ))}
          </div>
          {!shownAssets.length && (
            <div className="empty-assets">
              <MagnifyingGlass />
              <h3>No assets match</h3>
              <p>Try another term or remove a filter.</p>
            </div>
          )}
        </div>
      )}
      {mode === "generate" && (
        <div className="generate-stage">
          <div>
            <p>ORIGINAL ASSETS</p>
            <h2>Draft assets for the scene.</h2>
            <p>
              Generated items stay in a review queue until you approve them.
            </p>
          </div>
          <div className="generator-grid">
            <article>
              <Cube />
              <span>3D MODEL</span>
              <h3>Props, terrain, and characters</h3>
              <p>
                Describe shape, style, materials, scale, and collision needs.
              </p>
              <textarea
                value={generation}
                onChange={(e) => setGeneration(e.target.value)}
                placeholder="A stylized low-poly sci-fi crate…"
              />
              <button
                disabled={!generation.trim()}
                onClick={() => {
                  setDrafts((v) => [`${generation} · 3D`, ...v]);
                  setGeneration("");
                }}
              >
                Add 3D draft
              </button>
            </article>
            <article>
              <ImageSquare />
              <span>2D IMAGE</span>
              <h3>Icons, textures, and UI art</h3>
              <p>
                Create a transparent image prompt with the correct intended use.
              </p>
              <textarea placeholder="A clean inventory icon for a frost sword…" />
              <button
                onClick={() =>
                  setDrafts((v) => ["Frost sword inventory icon · 2D", ...v])
                }
              >
                Add 2D draft
              </button>
            </article>
          </div>
          {drafts.length > 0 && (
            <section className="draft-queue">
              <header>
                <b>Review queue</b>
                <span>{drafts.length} drafts</span>
              </header>
              {drafts.map((x, i) => (
                <div key={`${x}-${i}`}>
                  <Cube />
                  <span>
                    {x}
                    <small>Local draft · not inserted</small>
                  </span>
                  <button
                    onClick={() =>
                      setDrafts((v) => v.filter((_, n) => n !== i))
                    }
                  >
                    <Trash />
                  </button>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </section>
  );
}
