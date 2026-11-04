window.__MODULES__=Object.assign(window.__MODULES__||{},{"app:utils/cn":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.cn = cn;
var _clsx = _req("clsx");
var _tailwindMerge = _req("tailwind-merge");
function cn(...inputs) {
return (0, _tailwindMerge.twMerge)((0, _clsx.clsx)(inputs));
}
},
"app:lib/i18n":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.I18nProvider = I18nProvider;
exports.toPersianDigits = toPersianDigits;
exports.useI18n = useI18n;
var _react = _req("react");
const Ctx = /*#__PURE__*/(0, _react.createContext)({
lang: "fa",
isRtl: true,
setLang: () => {},
toggleLang: () => {}
});
function I18nProvider({
children
}) {
const [lang, setLangState] = (0, _react.useState)(() => {
try {
const saved = localStorage.getItem("ali_portfolio_lang");
if (saved === "en" || saved === "fa") return saved;
} catch {
}
return "fa";
});
const setLang = l => {
setLangState(l);
try {
localStorage.setItem("ali_portfolio_lang", l);
} catch {
}
};
const toggleLang = () => setLang(lang === "fa" ? "en" : "fa");
(0, _react.useEffect)(() => {
const html = document.documentElement;
html.lang = lang;
html.dir = lang === "fa" ? "rtl" : "ltr";
document.title = lang === "fa" ? "علی حاجیان — توسعه‌دهنده هوش مصنوعی · تکنولوژیست خلاق" : "Ali Hajjian — AI Developer · Creative Technologist";
}, [lang]);
return /*#__PURE__*/React.createElement(Ctx.Provider, {
value: {
lang,
isRtl: lang === "fa",
setLang,
toggleLang
}
}, children);
}
function useI18n() {
return (0, _react.useContext)(Ctx);
}
const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
function toPersianDigits(val, lang) {
const s = String(val);
if (lang !== "fa") return s;
return s.replace(/\d/g, d => FA_DIGITS[Number(d)]);
}
},
"app:lib/sound":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.isSoundOn = isSoundOn;
exports.setSound = setSound;
exports.tick = tick;
let ctx = null;
let master = null;
let enabled = false;
let built = false;
function build() {
if (!ctx || !master || built) return;
built = true;
const filter = ctx.createBiquadFilter();
filter.type = "lowpass";
filter.frequency.value = 380;
filter.Q.value = 6;
filter.connect(master);
const lfo = ctx.createOscillator();
const lfoGain = ctx.createGain();
lfo.frequency.value = 0.07;
lfoGain.gain.value = 240;
lfo.connect(lfoGain).connect(filter.frequency);
lfo.start();
[55, 82.41, 110.3, 164.8].forEach((f, i) => {
const o = ctx.createOscillator();
const g = ctx.createGain();
o.type = i % 2 ? "sine" : "sawtooth";
o.frequency.value = f;
o.detune.value = (i - 1.5) * 6;
g.gain.value = i % 2 ? 0.16 : 0.07;
o.connect(g).connect(filter);
o.start();
});
}
function isSoundOn() {
return enabled;
}
function setSound(on) {
enabled = on;
if (on) {
if (!ctx) {
const AC = window.AudioContext || window.webkitAudioContext;
ctx = new AC();
master = ctx.createGain();
master.gain.value = 0;
master.connect(ctx.destination);
}
ctx.resume();
build();
master.gain.cancelScheduledValues(ctx.currentTime);
master.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 1.5);
} else if (ctx && master) {
master.gain.cancelScheduledValues(ctx.currentTime);
master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
}
}
function tick(freq = 1200, dur = 0.05, vol = 0.04) {
if (!enabled || !ctx) return;
const o = ctx.createOscillator();
const g = ctx.createGain();
o.type = "sine";
o.frequency.setValueAtTime(freq, ctx.currentTime);
o.frequency.exponentialRampToValueAtTime(freq * 0.6, ctx.currentTime + dur);
g.gain.setValueAtTime(vol, ctx.currentTime);
g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
o.connect(g).connect(ctx.destination);
o.start();
o.stop(ctx.currentTime + dur + 0.02);
}
},
"app:lib/engine":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.lerp = exports.hexRgb = exports.engine = exports.clamp = exports.PALETTES = void 0;
exports.onFrame = onFrame;
exports.onPalette = onPalette;
exports.rgba = void 0;
exports.scrollToId = scrollToId;
exports.setPalette = setPalette;
exports.startEngine = startEngine;
var _lenis = _interopRequireDefault(_req("lenis"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const PALETTES = [{
name: "Plasma",
c1: "#7c5cff",
c2: "#29e5ff",
c3: "#ff4d8d",
acid: "#d6ff3f"
}, {
name: "Aurora",
c1: "#1de9b6",
c2: "#3b82ff",
c3: "#c06bff",
acid: "#f3ff6b"
}, {
name: "Ember",
c1: "#ff5a1f",
c2: "#ffb020",
c3: "#ff2e7a",
acid: "#fff3b0"
}];
exports.PALETTES = PALETTES;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
exports.clamp = clamp;
const lerp = (a, b, t) => a + (b - a) * t;
exports.lerp = lerp;
const hexRgb = h => {
const n = parseInt(h.slice(1), 16);
return [n >> 16 & 255, n >> 8 & 255, n & 255];
};
exports.hexRgb = hexRgb;
const rgba = (h, a) => {
const [r, g, b] = hexRgb(h);
return `rgba(${r},${g},${b},${a})`;
};
exports.rgba = rgba;
const engine = {
lenis: null,
scroll: 0,
velocity: 0,
mx: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
my: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
sx: 0,
sy: 0,
pal: PALETTES[0],
palIndex: 0,
overdrive: false,
click: {
x: 0.5,
y: 0.5,
t: -100
},
touch: false
};
exports.engine = engine;
const frameCbs = new Set();
function onFrame(cb) {
frameCbs.add(cb);
return () => {
frameCbs.delete(cb);
};
}
const palListeners = new Set();
function onPalette(cb) {
palListeners.add(cb);
return () => {
palListeners.delete(cb);
};
}
function setPalette(i) {
const p = PALETTES[i % PALETTES.length];
engine.pal = p;
engine.palIndex = i;
const r = document.documentElement.style;
r.setProperty("--c1", p.c1);
r.setProperty("--c2", p.c2);
r.setProperty("--c3", p.c3);
r.setProperty("--acid", p.acid);
palListeners.forEach(f => f());
}
function scrollToId(id) {
const el = document.getElementById(id);
if (!el) return;
if (engine.lenis) engine.lenis.scrollTo(el, {
duration: 1.8,
easing: t => 1 - Math.pow(1 - t, 4)
});else el.scrollIntoView({
behavior: "smooth"
});
}
let started = false;
function startEngine() {
if (started) return;
started = true;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lenis = new _lenis.default({
lerp: reduce ? 1 : 0.085
});
engine.lenis = lenis;
lenis.stop();
engine.touch = window.matchMedia("(pointer: coarse)").matches;
window.addEventListener("pointermove", e => {
engine.mx = e.clientX;
engine.my = e.clientY;
});
window.addEventListener("pointerdown", e => {
engine.mx = e.clientX;
engine.my = e.clientY;
engine.click = {
x: e.clientX / window.innerWidth,
y: 1 - e.clientY / window.innerHeight,
t: performance.now() / 1000
};
});
engine.sx = engine.mx;
engine.sy = engine.my;
let last = performance.now();
const loop = now => {
const dt = Math.min(0.05, (now - last) / 1000);
last = now;
lenis.raf(now);
engine.scroll = lenis.scroll;
engine.velocity = lenis.velocity || 0;
engine.sx = lerp(engine.sx, engine.mx, 1 - Math.pow(0.0006, dt));
engine.sy = lerp(engine.sy, engine.my, 1 - Math.pow(0.0006, dt));
const t = now / 1000;
frameCbs.forEach(cb => cb(t, dt));
requestAnimationFrame(loop);
};
requestAnimationFrame(loop);
}
},
"app:lib/useCanvas":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.pointerIn = pointerIn;
exports.useCanvas = useCanvas;
var _react = _req("react");
var _engine = _req("app:lib/engine");
function useCanvas(setup, deps = []) {
const ref = (0, _react.useRef)(null);
(0, _react.useEffect)(() => {
const canvas = ref.current;
const ctx = canvas.getContext("2d");
const s = {
canvas,
ctx,
w: 0,
h: 0,
dpr: 1,
visible: true
};
let loop = null;
const resize = () => {
const r = canvas.getBoundingClientRect();
s.dpr = Math.min(2, window.devicePixelRatio || 1);
s.w = r.width;
s.h = r.height;
canvas.width = Math.max(1, Math.floor(r.width * s.dpr));
canvas.height = Math.max(1, Math.floor(r.height * s.dpr));
ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
loop?.resize?.();
};
resize();
loop = setup(s);
const ro = new ResizeObserver(resize);
ro.observe(canvas);
const io = new IntersectionObserver(([e]) => s.visible = e.isIntersecting, {
rootMargin: "120px"
});
io.observe(canvas);
const off = (0, _engine.onFrame)((t, dt) => {
if (s.visible) loop.frame(t, dt);
});
return () => {
off();
ro.disconnect();
io.disconnect();
loop?.cleanup?.();
};
}, deps);
return ref;
}
function pointerIn(canvas) {
const r = canvas.getBoundingClientRect();
const x = _engine.engine.mx - r.left;
const y = _engine.engine.my - r.top;
return {
x,
y,
inside: x >= 0 && y >= 0 && x <= r.width && y <= r.height
};
}
},
"app:data":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.SKILL_EDGES = exports.SKILLS = exports.SIGIL_PROMPTS = exports.SERVICES = exports.SECTIONS = exports.ROLES = exports.PROJECTS = exports.MARQUEE_B = exports.MARQUEE_A = exports.KB_LIST = exports.KB_FALLBACK = exports.JOURNEY = exports.EMAIL = exports.DATA_FA = exports.DATA_EN = exports.CATS = exports.ASK_CHIPS = void 0;
exports.getData = getData;
const EMAIL = "hello@alihajjian.com";
exports.EMAIL = EMAIL;
const SKILL_EDGES = [["ali", "h-ai"], ["ali", "h-dev"], ["ali", "h-des"], ["ali", "h-ven"], ["h-ai", "llm"], ["h-ai", "agents"], ["h-ai", "rag"], ["h-ai", "prompt"], ["h-ai", "vision"], ["h-ai", "voice"], ["h-dev", "react"], ["h-dev", "ts"], ["h-dev", "node"], ["h-dev", "py"], ["h-dev", "webgl"], ["h-dev", "api"], ["h-des", "ux"], ["h-des", "motion"], ["h-des", "brand"], ["h-des", "gen"], ["h-ven", "auto"], ["h-ven", "prod"], ["h-ven", "mvp"], ["h-ven", "growth"], ["llm", "agents"], ["llm", "prompt"], ["rag", "py"], ["agents", "api"], ["agents", "auto"], ["voice", "node"], ["react", "ts"], ["react", "motion"], ["webgl", "gen"], ["webgl", "motion"], ["vision", "gen"], ["ux", "react"], ["prod", "ux"], ["auto", "api"], ["mvp", "growth"], ["brand", "growth"]];
exports.SKILL_EDGES = SKILL_EDGES;
const DATA_EN = {
sections: [{
id: "hero",
label: "Boot"
}, {
id: "manifesto",
label: "Manifesto"
}, {
id: "capabilities",
label: "Capabilities"
}, {
id: "works",
label: "Works"
}, {
id: "map",
label: "Neural Map"
}, {
id: "lab",
label: "The Lab"
}, {
id: "ask",
label: "Ask Ali"
}, {
id: "journey",
label: "Journey"
}, {
id: "contact",
label: "Contact"
}],
roles: ["intelligent products", "autonomous agents", "immersive interfaces", "AI-native startups", "the future, early"],
loaderLines: ["mounting neural substrate", "loading shaders · gl.context OK", "calibrating cursor telemetry", "waking the AI twin", "compiling imagination", "all systems nominal"],
hero: {
status: "Open to ambitious collaborations",
substatus: "AI Developer · Creative Technologist · Digital Entrepreneur",
firstName: "ALI",
lastName: "HAJJIAN",
leadPrefix: "I design and build ",
leadSuffix: "at the edge of what's possible with artificial intelligence.",
ctaPrimary: "Explore the work",
ctaSecondary: "Talk to my AI twin",
orbHeader: "Neural Orb · live",
orbHint: "Move to rotate · click anywhere on the orb to fire a signal through the graph.",
shapes: ["Sphere", "Torus", "Helix", "Cube", "Wave"],
scroll: "Scroll",
cursorView: "VIEW"
},
nav: {
subtitle: "AI · Creative Tech",
soundOn: "On",
soundOff: "Off",
command: "Command",
langLabel: "FA · فارسی",
langTitle: "Switch to Persian (تغییر به زبان فارسی)",
cmdPlaceholder: "Type a command or jump to a section…",
cmdEmpty: "No matching command",
goTo: "Go to",
cmdChat: "Chat with Ali's AI twin",
cmdCopy: `Copy email · ${EMAIL}`,
cmdLang: "Switch language to Persian (فارسی)",
cmdTheme: "Theme",
cmdSound: "Toggle ambient sound",
cmdOverdrive: "Engage overdrive",
toastEmail: "✓ Email copied",
toastOverdrive: "⚡ OVERDRIVE ENGAGED",
palettes: ["Plasma", "Aurora", "Ember"]
},
manifesto: {
label: "Manifesto",
text: "I believe intelligence is the *new* design material. I don't just *use* AI — I shape it, wire it into products, and turn raw *curiosity* into things people can *feel.*",
stats: [{
k: "24/7",
v: "Building mode"
}, {
k: "∞",
v: "Curiosity"
}, {
k: "0→1",
v: "Launch mindset"
}, {
k: "100%",
v: "Detail obsessed"
}]
},
capabilities: {
label: "Capabilities",
title: "What I *build* for the future",
kicker: "Five disciplines, one obsession: turning intelligence into experiences people remember."
},
works: {
label: "Selected works & prototypes",
title: "Things I've *made*",
nextLabel: "Next in the queue",
nextTitle: "More *experiments* loading…",
nextBtn: "Enter the lab →",
cursorPlay: "PLAY"
},
map: {
label: "Neural Map",
title: "A *living* map of what I do",
kicker: "Every node is a skill. Drag them, hover to trace connections, click to inspect. It's a real physics simulation — not a picture.",
hint: "Drag · hover · click",
nodesWord: "nodes",
synapsesWord: "synapses",
connectedTo: "Connected to",
filterBy: "Filter by domain",
cursorDrag: "DRAG"
},
lab: {
label: "The Lab",
title: "Play with the *machinery*",
kicker: "Not screenshots — working experiments. Two tiny pieces of the way I think about AI and generative systems, running live in your browser.",
nnTitle: "Neural Playground",
nnRunning: "Training",
nnPaused: "Paused",
nnDesc: "A real 7→10→8→1 network with backprop & Adam — learning in your browser right now. Click the field to add data points and watch it adapt.",
nnEpoch: "Epoch",
nnLoss: "Loss",
nnAcc: "Accuracy",
nnSets: {
spiral: "spiral",
circle: "circle",
xor: "xor",
moons: "moons"
},
nnPauseBtn: "❚❚ pause",
nnTrainBtn: "▶ train",
nnResetBtn: "↺ re-init",
nnAddBtn: "● add:",
sigilTitle: "Sigil Forge",
sigilDesc: "Type anything. Your words are hashed into a seed and forged into a one-of-one symbol. Same words, same sigil — always.",
sigilSymmetry: "-fold symmetry",
sigilPlaceholder: "Describe a feeling, a name, an idea…",
sigilSurprise: "⟳ surprise me",
sigilSave: "↓ save png",
sigilSavedToast: "✓ Sigil saved"
},
ask: {
label: "Ask Ali",
title: "Meet my AI *twin*",
kicker: "Can't wait for a reply? Interview the intelligence living in this site. It knows Ali's work, skills, vision — and a joke or two.",
twinName: "ALI·TWIN",
statusThinking: "thinking…",
statusSpeaking: "speaking",
statusIdle: "online · idle",
twinBio: "A scripted mini-intelligence, honest about what it is. No backend, no tracking — just a fast conversation with the site itself.",
sessionHeader: "ali-twin — session · local",
placeholder: "Ask about Ali's work, skills, vision…",
sendBtn: "Send",
welcome: "Hey 👋 I'm Ali's AI twin — a small, honest, scripted intelligence that lives in this site. Ask me anything about Ali: his work, skills, vision, or how to build something together."
},
journey: {
label: "Journey",
title: "From curiosity to *craft*",
kicker: "A story still being written — five chapters so far."
},
contact: {
label: "Contact",
title: "Let's build the *impossible* together.",
desc: "Got an AI product to launch, a workflow to automate, or a website that should make people say “wow”? Bring the idea — I'll bring the obsession.",
copied: "✓ Copied to clipboard",
openMail: "Open mail ↗",
formHeader: "Or send a transmission",
namePh: "Your name",
emailPh: "Your email",
msgPh: "Tell me about the idea…",
submitBtn: "Transmit →",
footerBrand: "ALI HAJJIAN",
copyright: `© ${new Date().getFullYear()} Ali Hajjian — designed & engineered with AI.`,
localTime: "Local time",
konamiHint: "Psst… try ↑ ↑ ↓ ↓ ← → ← → B A",
backToTop: "Back to top ↑",
cursorCopy: "COPY"
},
projects: [{
n: "01",
title: "NEURA//Agent",
kind: "flow",
tag: "Autonomous Agents",
blurb: "A workspace where AI agents plan, research, write code and ship tasks end-to-end — with a human-readable trace of every thought.",
metric: ["Agent loops", "plan → act → reflect"],
stack: ["LLM Orchestration", "Tool Use", "React", "Node"],
year: "Concept"
}, {
n: "02",
title: "Voxel Voice",
kind: "wave",
tag: "Realtime Voice AI",
blurb: "A conversational voice interface built for sub-second turn-taking: streaming speech in, streaming intelligence out, zero awkward silence.",
metric: ["Target latency", "< 800 ms"],
stack: ["Streaming", "WebRTC", "Speech AI", "TypeScript"],
year: "Prototype"
}, {
n: "03",
title: "Prompt Atelier",
kind: "grid",
tag: "Developer Tooling",
blurb: "An IDE for prompts: version them, diff them, evaluate them against test suites and watch quality climb like a performance graph.",
metric: ["Workflow", "write · test · evolve"],
stack: ["Evals", "Versioning", "React", "Python"],
year: "Prototype"
}, {
n: "04",
title: "Autopilot Studio",
kind: "mesh",
tag: "Intelligent Automation",
blurb: "Visual automation orchestrator that wires AI into real business workflows — inboxes, CRMs, spreadsheets — so repetitive work simply disappears.",
metric: ["Goal", "0 manual busywork"],
stack: ["Workflows", "APIs", "RAG", "Webhooks"],
year: "Concept"
}, {
n: "05",
title: "Lumen UI",
kind: "orbit",
tag: "Generative Design",
blurb: "Describe a feeling, get a design system: tokens, components and motion — generated, previewed live and exported as production React.",
metric: ["Output", "prompt → components"],
stack: ["Generative UI", "Design Tokens", "Tailwind", "WebGL"],
year: "Experiment"
}],
services: [{
n: "01",
title: "AI Products",
text: "From a spark of an idea to a shipped, AI-native product. I design the intelligence, the interface and the loop that makes people come back.",
tags: ["LLM apps", "Agents", "RAG", "Copilots"]
}, {
n: "02",
title: "Smart Automation",
text: "I connect models to the messy real world — emails, documents, data, operations — and turn hours of repetitive work into a quiet background process.",
tags: ["Workflows", "Integrations", "Pipelines", "Bots"]
}, {
n: "03",
title: "Web Experiences",
text: "Cinematic, fast, obsessively detailed websites. WebGL, motion, physics and interaction that make visitors stop scrolling and start playing.",
tags: ["React", "WebGL", "Motion", "Performance"]
}, {
n: "04",
title: "Creative Technology",
text: "Where code meets art: generative visuals, interactive installations, experimental interfaces and prototypes that make people say “wait, how?”",
tags: ["Generative", "Shaders", "Interaction", "Prototyping"]
}, {
n: "05",
title: "Digital Ventures",
text: "Product thinking with an entrepreneur's pulse: validate fast, build leaner, launch loud and let real users decide what comes next.",
tags: ["Strategy", "MVPs", "Growth", "Branding"]
}],
cats: {
ai: {
label: "Artificial Intelligence",
color: 0
},
dev: {
label: "Engineering",
color: 1
},
design: {
label: "Design & Motion",
color: 2
},
venture: {
label: "Venture & Product",
color: 3
},
core: {
label: "Core",
color: 3
}
},
skills: [{
id: "ali",
label: "ALI",
cat: "core",
desc: "The origin node. Everything here connects back to curiosity."
}, {
id: "h-ai",
label: "AI",
cat: "ai",
desc: "Making machine intelligence useful, usable and a little bit magical."
}, {
id: "h-dev",
label: "DEV",
cat: "dev",
desc: "Turning ideas into fast, reliable, beautiful software."
}, {
id: "h-des",
label: "DESIGN",
cat: "design",
desc: "Interfaces with taste, rhythm and personality."
}, {
id: "h-ven",
label: "VENTURE",
cat: "venture",
desc: "Building things people actually want — and getting them out the door."
}, {
id: "llm",
label: "LLMs",
cat: "ai",
desc: "Working with frontier language models: prompting, tool use, structured output, evaluation."
}, {
id: "agents",
label: "Agents",
cat: "ai",
desc: "Systems that plan, call tools, reflect and finish the job on their own."
}, {
id: "rag",
label: "RAG",
cat: "ai",
desc: "Giving models memory and truth: embeddings, retrieval and grounded answers."
}, {
id: "prompt",
label: "Prompt Eng.",
cat: "ai",
desc: "The craft of steering models with precision — and testing it like software."
}, {
id: "vision",
label: "Vision AI",
cat: "ai",
desc: "Image understanding and generation woven into products."
}, {
id: "voice",
label: "Voice AI",
cat: "ai",
desc: "Realtime speech interfaces that feel like conversations, not commands."
}, {
id: "react",
label: "React",
cat: "dev",
desc: "Component architecture, state, performance — the daily driver."
}, {
id: "ts",
label: "TypeScript",
cat: "dev",
desc: "Type-safe everything, from UI to APIs."
}, {
id: "node",
label: "Node.js",
cat: "dev",
desc: "APIs, streaming backends and glue code that scales."
}, {
id: "py",
label: "Python",
cat: "dev",
desc: "Data, models, scripts and rapid experiments."
}, {
id: "webgl",
label: "WebGL",
cat: "dev",
desc: "Shaders and GPU-powered visuals in the browser — like the one behind you."
}, {
id: "api",
label: "APIs",
cat: "dev",
desc: "Integrating, designing and orchestrating services."
}, {
id: "ux",
label: "UI / UX",
cat: "design",
desc: "Clear flows, strong hierarchy, interfaces that feel inevitable."
}, {
id: "motion",
label: "Motion",
cat: "design",
desc: "Choreographed animation that gives software a pulse."
}, {
id: "brand",
label: "Branding",
cat: "design",
desc: "Identity systems with a point of view."
}, {
id: "gen",
label: "Generative Art",
cat: "design",
desc: "Algorithms as paintbrushes: noise, particles, symmetry."
}, {
id: "auto",
label: "Automation",
cat: "venture",
desc: "Workflows that remove the boring parts of work."
}, {
id: "prod",
label: "Product",
cat: "venture",
desc: "Finding the sharp problem, then the simplest great solution."
}, {
id: "mvp",
label: "0 → 1",
cat: "venture",
desc: "Launch-minded: ship early, learn loudly, iterate fast."
}, {
id: "growth",
label: "Growth",
cat: "venture",
desc: "Distribution, storytelling and the loops that compound."
}],
journeyList: [{
n: "00",
title: "Spark",
text: "It starts with a question every curious kid asks a little too loudly: how does this thing actually work? Computers answered. Then AI answered back."
}, {
n: "01",
title: "Obsession",
text: "Late nights, endless tabs, models, papers and experiments. Learning in public, breaking things in private, and falling for the idea that intelligence itself can be built."
}, {
n: "02",
title: "Craft",
text: "Curiosity became skill: shipping interfaces, wiring models into products, and obsessing over the tiny details that make software feel alive."
}, {
n: "03",
title: "Venture",
text: "Not just building for the sake of it — building to launch. Treating every project like a company in the making: real users, real problems, real momentum."
}, {
n: "04",
title: "Next",
text: "The frontier is moving every week and so is Ali. The next chapter is being written — ideally with you."
}],
marqueeA: ["ARTIFICIAL INTELLIGENCE", "CREATIVE TECHNOLOGY", "AUTOMATION", "WEB EXPERIENCES", "AI PRODUCTS", "DIGITAL ENTREPRENEUR"],
marqueeB: ["BUILD", "LAUNCH", "ITERATE", "AUTOMATE", "IMAGINE", "REPEAT"],
sigilPrompts: ["Ali Hajjian", "a quiet storm of data", "the sound of a neural network dreaming", "launch day", "infinite curiosity", "ghost in the machine", "electric sunrise over silicon", "build the future early"],
kbList: [{
keys: /^(hi|hey|hello|yo|sup|salam|hola|سلام|درود|چطوری|خوبی)\b/i,
a: ["Hey! 👋 I'm Ali's resident AI twin — a small, honest, scripted intelligence living inside this site. Ask me about his work, skills, vision, or how to start something together."]
}, {
keys: /(who|about|introduce|tell me).*(ali|you|yourself)|who are you|who is ali|علی کیه|کی هستی|معرفی|درباره علی/i,
a: ["Ali Hajjian is an ambitious young AI enthusiast, AI developer, creative technologist and digital entrepreneur. He lives at the intersection of machine intelligence and design — building products that feel like they arrived from a few years in the future."]
}, {
keys: /(what|which).*(build|make|create|do)|work|project|portfolio|ship|پروژه|نمونه کار|چی میساز|چیکار میکن/i,
a: ["Ali builds AI-powered products, intelligent automations and cinematic web experiences. Scroll to ‘Works’ for agents, voice interfaces, prompt tooling, automation studios and generative design. Each one starts as an obsession and ends as something you can actually use."]
}, {
keys: /skill|stack|tech|language|tool|framework|good at|expert|مهارت|تکنولوژی|استک|ابزار|برنامه نویسی/i,
a: ["The toolbox: React + TypeScript on the front, Node and Python behind it, WebGL for the pretty parts, and LLM tooling (agents, RAG, prompt engineering, voice, vision) for the brains. Poke the Neural Map section — every node is draggable."]
}, {
keys: /why.*ai|love ai|passion|motivat|inspire|obsess|چرا هوش مصنوعی|علاقه|انگیزه/i,
a: ["Because intelligence is the first technology that can improve every other technology. For Ali, AI isn't a trend — it's the new creative material, like clay for a sculptor, and he wants to be shaping it from the early days."]
}, {
keys: /vision|future|goal|dream|mission|ambition|plan|آینده|چشم انداز|هدف|رویا/i,
a: ["The vision: a world where anyone with an idea has an army of intelligent tools behind them. Ali wants to build the products, companies and experiences that make that real — and make them beautiful enough that people actually want to use them."]
}, {
keys: /hire|available|contact|email|reach|collab|work with|freelance|talk|start|project together|quote|همکاری|تماس|ایمیل|سفارش|ارتباط/i,
a: ["Ali is open to ambitious collaborations: AI products, automation systems, standout websites and early-stage ventures. Scroll to the bottom and hit the big button — or write to hello@alihajjian.com. Bring the wild idea. 🚀"]
}, {
keys: /design|ui|ux|animation|motion|aesthetic|visual|طراحی|رابط کاربری|انیمیشن|موشن/i,
a: ["Design philosophy: software should have a pulse. Every hover, transition and shader on this page was crafted on purpose. If it works but doesn't feel like anything, it isn't finished yet."]
}, {
keys: /business|startup|entrepreneur|company|founder|money|venture|استارتاپ|کسب و کار|کارآفرین/i,
a: ["Ali thinks like a founder: find a sharp problem, validate fast, ship a lean MVP, then let real users steer. He treats projects like companies in the making — not just code in a repo."]
}, {
keys: /how.*(site|website|page|built|made)|this (site|page)|built with|این سایت|ساخته شده/i,
a: ["Under the hood: React, Vite and Tailwind. A raw WebGL fragment shader paints the background, the 3D orb is a canvas graph with signal propagation, the skill map is a physics simulation, the Lab trains a real neural network in your browser — and I'm a tiny scripted twin. No backend, all vibes."]
}, {
keys: /age|old|where.*(live|from|based)|location|country|city|born|سن|کجایی|کجا زندگی/i,
a: ["Ali keeps some personal details off the public record. If you'd like to know more, ask him directly — he's friendly. 😄"]
}, {
keys: /joke|funny|surprise|fun fact|bored|random|جوک|شوخی|سورپرایز|جالب/i,
a: ["Why did the neural network go to therapy? Too many unresolved layers. 🧠", "Fun fact: there's a hidden overdrive mode on this site. The Konami code might know the way. ↑ ↑ ↓ ↓ ← → ← → B A", "I'm 100% scripted, which makes me the only AI that has never hallucinated. Also the only one that can't help with your homework."]
}, {
keys: /thank|thanks|cool|awesome|nice|amazing|wow|great|ممنون|مرسی|عالی|باحال/i,
a: ["Appreciated! Tell Ali too — he loves a good reaction. 😉", "Glad you like it. There's more hiding in The Lab — try training that neural net."]
}],
kbFallback: ["Hmm, that's outside my tiny script. I know about Ali's work, skills, vision, availability and how this site was built — try one of those. For anything else, email Ali directly.", "I'm a small twin with a focused brain. Ask about projects, skills, vision, or collaboration and I'll shine."],
askChips: ["Who is Ali?", "What does he build?", "Why AI?", "What's the stack?", "How was this site built?", "Can I work with him?", "Surprise me"]
};
exports.DATA_EN = DATA_EN;
const DATA_FA = {
sections: [{
id: "hero",
label: "آغاز"
}, {
id: "manifesto",
label: "مانیفست"
}, {
id: "capabilities",
label: "توانمندی‌ها"
}, {
id: "works",
label: "پروژه‌ها"
}, {
id: "map",
label: "نقشه عصبی"
}, {
id: "lab",
label: "آزمایشگاه"
}, {
id: "ask",
label: "گفتگو با علی"
}, {
id: "journey",
label: "مسیر من"
}, {
id: "contact",
label: "ارتباط"
}],
roles: ["محصولات هوشمند", "ایجنت‌های خودمختار", "رابط‌های کاربری غوطه‌ور", "استارتاپ‌های بومی هوش مصنوعی", "آینده، زودتر از موعد"],
loaderLines: ["بارگذاری بستر عصبی سیستم", "راه‌اندازی شیدرها · gl.context آماده", "کالیبره‌سازی تله‌متری نشانگر", "بیدارسازی همزاد هوش مصنوعی", "کامپایل کردن تخیل و خلاقیت", "تمامی سیستم‌ها در وضعیت ایده‌آل"],
hero: {
status: "آماده همکاری در پروژه‌های جاه‌طلبانه",
substatus: "توسعه‌دهنده هوش مصنوعی · تکنولوژیست خلاق · کارآفرین دیجیتال",
firstName: "علی",
lastName: "حاجیان",
leadPrefix: "طراحی و ساخت ",
leadSuffix: "در مرزهای آنچه با هوش مصنوعی ممکن است.",
ctaPrimary: "مشاهده آثار و پروژه‌ها",
ctaSecondary: "گفتگو با همزاد هوش مصنوعی من",
orbHeader: "گوی عصبی · زنده",
orbHint: "برای چرخش حرکت دهید · روی هر نقطه از گوی کلیک کنید تا سیگنال در گراف منتشر شود.",
shapes: ["کره", "چنبره", "مارپیچ", "مکعب", "موج"],
scroll: "اسکرول",
cursorView: "مشاهده"
},
nav: {
subtitle: "هوش مصنوعی · تکنولوژی خلاق",
soundOn: "فعال",
soundOff: "خاموش",
command: "فرمان‌ها",
langLabel: "EN · English",
langTitle: "تغییر زبان به انگلیسی (Switch to English)",
cmdPlaceholder: "یک فرمان بنویسید یا به بخشی بپرید…",
cmdEmpty: "فرمانی با این عبارت یافت نشد",
goTo: "رفتن به بخش",
cmdChat: "گفتگو با همزاد هوش مصنوعی علی",
cmdCopy: `کپی کردن ایمیل · ${EMAIL}`,
cmdLang: "تغییر زبان به انگلیسی (Switch to English)",
cmdTheme: "پالت نوری",
cmdSound: "تغییر وضعیت صدای محیطی",
cmdOverdrive: "فعال‌سازی حالت اوردرایو (Overdrive)",
toastEmail: "✓ آدرس ایمیل کپی شد",
toastOverdrive: "⚡ حالت اوردرایو فعال شد",
palettes: ["پلاسما", "شفق قطبی", "اخگر"]
},
manifesto: {
label: "مانیفست",
text: "من باور دارم هوش، *متریال* جدید طراحی است. من فقط از هوش مصنوعی *استفاده* نمی‌کنم — به آن شکل می‌دهم، آن را در تار و پود محصولات می‌بافم و *کنجکاوی* خالص را به تجربه‌ای تبدیل می‌کنم که انسان‌ها بتوانند *لمسش* کنند.",
stats: [{
k: "۲۴/۷",
v: "در حال ساختن"
}, {
k: "∞",
v: "کنجکاوی بی‌پایان"
}, {
k: "۰←۱",
v: "ذهنیت خلق و عرضه"
}, {
k: "۱۰۰٪",
v: "وسواس در جزئیات"
}]
},
capabilities: {
label: "توانمندی‌ها",
title: "آنچه برای *آینده* می‌سازم",
kicker: "پنج حوزه تخصصی، یک دغدغه مشترک: تبدیل هوش ماشینی به تجربه‌هایی که در ذهن ماندگار می‌شوند."
},
works: {
label: "گزیده آثار و پروتوتایپ‌ها",
title: "چیزهایی که *ساخته‌ام*",
nextLabel: "در صف ساخت",
nextTitle: "*آزمایش‌های* بیشتر در راه است…",
nextBtn: "ورود به آزمایشگاه ←",
cursorPlay: "کاوش"
},
map: {
label: "نقشه عصبی",
title: "نقشه‌ای *زنده* از مهارت‌های من",
kicker: "هر گره یک مهارت است. آن‌ها را بکشید، برای دیدن ارتباطات نشانگر را رویشان ببرید و برای بررسی کلیک کنید. این یک شبیه‌سازی فیزیکی زنده است — نه یک تصویر ثابت.",
hint: "بکشید · نگه‌دارید · کلیک کنید",
nodesWord: "گره",
synapsesWord: "سیناپس",
connectedTo: "متصل به",
filterBy: "فیلتر بر اساس حوزه",
cursorDrag: "بکشید"
},
lab: {
label: "آزمایشگاه",
title: "بازی با *ماشین‌های* هوشمند",
kicker: "اسکرین‌شات نیستند — آزمایش‌های واقعی و زنده هستند. دو نمونه کوچک از نگاه من به هوش مصنوعی و سیستم‌های مولد که همین الان در مرورگر شما اجرا می‌شوند.",
nnTitle: "زمین بازی شبکه عصبی",
nnRunning: "در حال آموزش",
nnPaused: "متوقف‌شده",
nnDesc: "یک شبکه عصبی واقعی ۷←۱۰←۸←۱ با انتشار برگشتی (Backprop) و بهینه‌ساز Adam که همین الان در مرورگر شما یاد می‌گیرد. روی صفحه کلیک کنید تا داده جدید اضافه شود و سازگاری شبکه را ببینید.",
nnEpoch: "دوره (Epoch)",
nnLoss: "خطا (Loss)",
nnAcc: "دقت مدل",
nnSets: {
spiral: "مارپیچ",
circle: "دایره",
xor: "XOR",
moons: "هلال‌ها"
},
nnPauseBtn: "❚❚ توقف",
nnTrainBtn: "▶ آموزش",
nnResetBtn: "↺ بازنشانی",
nnAddBtn: "● افزودن کلاس:",
sigilTitle: "کارگاه نشان مولد (Sigil)",
sigilDesc: "هر عبارتی بنویسید؛ واژه‌های شما به یک بذر رمزنگاری (Seed) تبدیل شده و یک نماد هندسی یکتا خلق می‌کنند. واژه‌های یکسان، همیشه نمادی یکسان می‌سازند.",
sigilSymmetry: " محور تقارن",
sigilPlaceholder: "یک حس، یک نام یا یک ایده را بنویسید…",
sigilSurprise: "⟳ ایده تصادفی",
sigilSave: "↓ ذخیره تصویر PNG",
sigilSavedToast: "✓ نشان با موفقیت ذخیره شد"
},
ask: {
label: "گفتگو با علی",
title: "آشنایی با *همزاد* هوشمند من",
kicker: "حوصله صبر کردن برای پاسخ ایمیل را ندارید؟ با هوش مقیم این وب‌سایت گفتگو کنید. درباره پروژه‌ها، مهارت‌ها، دیدگاه‌های علی — و حتی چند شوخی برنامه‌نویسی — اطلاعات کامل دارد.",
twinName: "ALI·TWIN",
statusThinking: "در حال تفکر…",
statusSpeaking: "در حال پاسخگویی",
statusIdle: "آنلاین · آماده",
twinBio: "یک هوش کوچک و صادق که درون این سایت زندگی می‌کند. بدون سرور و بدون ردیابی — فقط یک گفتگوی سریع و مستقیم با خودِ وب‌سایت.",
sessionHeader: "ali-twin — نشست محلی · زنده",
placeholder: "درباره کارها، مهارت‌ها یا دیدگاه علی بپرسید…",
sendBtn: "ارسال",
welcome: "سلام! 👋 من همزاد هوش مصنوعی علی هستم — یک هوش کوچک، صادق و برنامه‌ریزی‌شده که داخل این سایت زندگی می‌کند. هر سوالی درباره علی، پروژه‌ها، مهارت‌ها، چشم‌انداز یا نحوه شروع یک همکاری دارید از من بپرسید."
},
journey: {
label: "مسیر من",
title: "از کنجکاوی تا *مهارت*",
kicker: "داستانی که هنوز در حال نوشته شدن است — تا اینجا در پنج فصل."
},
contact: {
label: "ارتباط با من",
title: "بیایید *غیرممکن‌ها* را با هم بسازیم.",
desc: "می‌خواهید یک محصول هوش مصنوعی خلق کنید، فرآیندهای کسب‌وکارتان را خودکار سازید یا وب‌سایتی داشته باشید که همه را شگفت‌زده کند؟ ایده از شما — وسواس در اجرا از من.",
copied: "✓ در حافظه کپی شد",
openMail: "ارسال ایمیل ↗",
formHeader: "یا پیام مستقیم ارسال کنید",
namePh: "نام شما",
emailPh: "ایمیل شما",
msgPh: "درباره ایده‌تان برایم بنویسید…",
submitBtn: "ارسال پیام ←",
footerBrand: "ALI HAJJIAN",
copyright: `© ${new Date().getFullYear()} علی حاجیان — طراحی و مهندسی‌شده با هوش مصنوعی.`,
localTime: "ساعت محلی",
konamiHint: "راز مخفی… کد ↑ ↑ ↓ ↓ ← → ← → B A را امتحان کنید",
backToTop: "بازگشت به بالا ↑",
cursorCopy: "کپی"
},
projects: [{
n: "01",
title: "NEURA//Agent",
kind: "flow",
tag: "ایجنت‌های خودمختار",
blurb: "محیط کاری هوشمند که در آن ایجنت‌های هوش مصنوعی برنامه‌ریزی، پژوهش، کدنویسی و اجرای کامل وظایف را انجام می‌دهند — همراه با نمایش شفاف زنجیره تفکر.",
metric: ["چرخه ایجنت", "طرح ← اقدام ← بازنگری"],
stack: ["ارکستریشن LLM", "فراخوانی ابزار", "React", "Node"],
year: "مفهومی"
}, {
n: "02",
title: "Voxel Voice",
kind: "wave",
tag: "هوش مصنوعی صوتی در لحظه",
blurb: "رابط صوتی محاوره‌ای با پاسخ‌دهی زیر یک ثانیه: دریافت جریانی صدا و تولید بلادرنگ پاسخ هوشمند، بدون مکث‌های مصنوعی.",
metric: ["تأخیر هدف", "کمتر از ۸۰۰ میلی‌ثانیه"],
stack: ["استریمینگ", "WebRTC", "هوش صوتی", "TypeScript"],
year: "پروتوتایپ"
}, {
n: "03",
title: "Prompt Atelier",
kind: "grid",
tag: "ابزار توسعه‌دهندگان",
blurb: "یک محیط توسعه (IDE) حرفه‌ای برای پرامپت‌ها: نسخه‌بندی، مقایسه تغییرات (Diff)، ارزیابی خودکار با تست‌ها و رصد ارتقای کیفیت خروجی.",
metric: ["گردش کار", "نگارش · تست · تکامل"],
stack: ["ارزیابی مدل", "نسخه‌بندی", "React", "Python"],
year: "پروتوتایپ"
}, {
n: "04",
title: "Autopilot Studio",
kind: "mesh",
tag: "اتوماسیون هوشمند",
blurb: "ارکستریتور بصری اتوماسیون که هوش مصنوعی را به فرآیندهای واقعی کسب‌وکار — ایمیل‌ها، CRM و جداول داده — متصل می‌کند تا کارهای تکراری حذف شوند.",
metric: ["هدف", "صفر کار دستی تکراری"],
stack: ["گردش‌کارها", "APIها", "RAG", "وب‌هوک"],
year: "مفهومی"
}, {
n: "05",
title: "Lumen UI",
kind: "orbit",
tag: "طراحی مولد (Generative)",
blurb: "یک حس را توصیف کنید و یک دیزاین سیستم کامل تحویل بگیرید: توکن‌ها، کامپوننت‌ها و موشن‌ها — با پیش‌نمایش زنده و خروجی آماده React.",
metric: ["خروجی", "پرامپت ← کامپوننت"],
stack: ["رابط کاربری مولد", "توکن‌های طراحی", "Tailwind", "WebGL"],
year: "آزمایشی"
}],
services: [{
n: "01",
title: "محصولات هوش مصنوعی",
text: "از جرقه اولیه یک ایده تا محصولی کامل و مبتنی بر هوش مصنوعی. من هوش، رابط کاربری و چرخه تجربه‌ای را طراحی می‌کنم که کاربران را دوباره بازمی‌گرداند.",
tags: ["اپلیکیشن‌های LLM", "ایجنت‌ها", "RAG", "کوپایلوت‌ها"]
}, {
n: "02",
title: "اتوماسیون هوشمند",
text: "مدل‌های زبانی را به دنیای واقعی — ایمیل‌ها، اسناد، داده‌ها و عملیات — متصل می‌کنم و ساعت‌ها کار تکراری را به فرآیندی خودکار و بی‌صدا در پس‌زمینه تبدیل می‌نمایم.",
tags: ["گردش‌کارها", "یکپارچه‌سازی", "پایپ‌لاین داده", "ربات‌ها"]
}, {
n: "03",
title: "تجربه‌های وب سینمایی",
text: "وب‌سایت‌هایی سینمایی، سریع و با جزئیات وسواس‌گونه. ترکیب WebGL، موشن، فیزیک و تعامل که بازدیدکننده را از اسکرول صرف به تجربه و تعامل دعوت می‌کند.",
tags: ["React", "WebGL", "موشن دیزاین", "پرفورمنس"]
}, {
n: "04",
title: "تکنولوژی خلاقانه",
text: "نقطه تلاقی کد و هنر: گرافیک‌های مولد (Generative)، چیدمان‌های تعاملی، رابط‌های کاربری تجربی و پروتوتایپ‌هایی که مخاطب را شگفت‌زده می‌کنند.",
tags: ["هنر مولد", "شیدرها", "تعامل زنده", "پروتوتایپ"]
}, {
n: "05",
title: "کارآفرینی و محصول دیجیتال",
text: "تفکر محصول با ضرباهنگ کارآفرینی: اعتبارسنجی سریع، ساخت چابک، عرضه قدرتمند و هدایت مسیر توسعه بر اساس بازخورد کاربران واقعی.",
tags: ["استراتژی محصول", "ساخت MVP", "رشد", "برندینگ"]
}],
cats: {
ai: {
label: "هوش مصنوعی",
color: 0
},
dev: {
label: "مهندسی نرم‌افزار",
color: 1
},
design: {
label: "طراحی و موشن",
color: 2
},
venture: {
label: "محصول و کارآفرینی",
color: 3
},
core: {
label: "هسته مرکزی",
color: 3
}
},
skills: [{
id: "ali",
label: "ALI",
cat: "core",
desc: "گره مبدأ. تمام مسیرهای این شبکه از کنجکاوی سرچشمه می‌گیرند."
}, {
id: "h-ai",
label: "AI",
cat: "ai",
desc: "تبدیل هوش ماشینی به ابزاری کاربردی، ملموس و کمی جادویی."
}, {
id: "h-dev",
label: "DEV",
cat: "dev",
desc: "تبدیل ایده‌ها به نرم‌افزارهایی سریع، پایدار و خوش‌ساخت."
}, {
id: "h-des",
label: "DESIGN",
cat: "design",
desc: "رابط‌های کاربری با سلیقه، ریتم بصری و شخصیت مستقل."
}, {
id: "h-ven",
label: "VENTURE",
cat: "venture",
desc: "ساختن محصولاتی که مردم واقعاً می‌خواهند — و رساندن آن‌ها به دست کاربران."
}, {
id: "llm",
label: "LLMs",
cat: "ai",
desc: "کار با مدل‌های زبانی پیشرو: پرامپت‌نویسی، استفاده از ابزار، خروجی ساختاریافته و ارزیابی."
}, {
id: "agents",
label: "ایجنت‌ها",
cat: "ai",
desc: "سیستم‌هایی که برنامه‌ریزی می‌کنند، ابزار فراخوانی می‌کنند، بازنگری دارند و کار را مستقل به پایان می‌رسانند."
}, {
id: "rag",
label: "RAG",
cat: "ai",
desc: "بخشیدن حافظه و دقت به مدل‌ها: امبدینگ، بازیابی دانش و پاسخ‌های مستند."
}, {
id: "prompt",
label: "مهندسی پرامپت",
cat: "ai",
desc: "هنر هدایت دقیق مدل‌ها — و تست سیستماتیک آن‌ها درست مانند کد نرم‌افزار."
}, {
id: "vision",
label: "بینایی ماشین",
cat: "ai",
desc: "درک تصویر و تولید محتوای بصری تنیده در دل محصولات."
}, {
id: "voice",
label: "هوش صوتی",
cat: "ai",
desc: "رابط‌های گفتاری بلادرنگ که حس مکالمه طبیعی دارند، نه فرمان دادن به ماشین."
}, {
id: "react",
label: "React",
cat: "dev",
desc: "معماری کامپوننت، مدیریت وضعیت و بهینه‌سازی عملکرد — ابزار اصلی روزانه."
}, {
id: "ts",
label: "TypeScript",
cat: "dev",
desc: "ایمنی نوع داده (Type-safety) در تمام لایه‌ها، از رابط کاربری تا APIها."
}, {
id: "node",
label: "Node.js",
cat: "dev",
desc: "طراحی API، بک‌اندهای استریمینگ و زیرساخت‌های مقیاس‌پذیر."
}, {
id: "py",
label: "Python",
cat: "dev",
desc: "پردازش داده، مدل‌های هوش مصنوعی، اسکریپت‌نویسی و آزمایش‌های سریع."
}, {
id: "webgl",
label: "WebGL",
cat: "dev",
desc: "شیدرها و گرافیک‌های متکی بر پردازنده گرافیکی (GPU) در مرورگر — مثل پس‌زمینه همین صفحه."
}, {
id: "api",
label: "APIها",
cat: "dev",
desc: "طراحی، یکپارچه‌سازی و هماهنگ‌سازی سرویس‌های نرم‌افزاری."
}, {
id: "ux",
label: "UI / UX",
cat: "design",
desc: "جریان‌های کاربری شفاف، سلسله‌مراتب بصری قوی و رابط‌هایی که کار با آن‌ها طبیعی است."
}, {
id: "motion",
label: "موشن دیزاین",
cat: "design",
desc: "انیمیشن‌های دقیق و حساب‌شده که به نرم‌افزار روح و ضرباهنگ می‌بخشند."
}, {
id: "brand",
label: "برندینگ",
cat: "design",
desc: "سیستم‌های هویت بصری با دیدگاه و امضای منحصربه‌فرد."
}, {
id: "gen",
label: "هنر مولد",
cat: "design",
desc: "الگوریتم‌ها به عنوان قلم‌مو: نویز، ذرات و تقارن‌های هندسی."
}, {
id: "auto",
label: "اتوماسیون",
cat: "venture",
desc: "گردش‌کارهایی که بخش‌های خسته‌کننده و تکراری کار را حذف می‌کنند."
}, {
id: "prod",
label: "تفکر محصول",
cat: "venture",
desc: "یافتن مسئله اصلی و طراحی ساده‌ترین و مؤثرترین راه‌حل برای آن."
}, {
id: "mvp",
label: "۰ ← ۱",
cat: "venture",
desc: "ذهنیت اجرا: انتشار سریع، یادگیری از بازخوردها و بهبود مستمر."
}, {
id: "growth",
label: "رشد (Growth)",
cat: "venture",
desc: "توزیع، روایت‌پردازی و ساخت حلقه‌های رشد تصاعدی."
}],
journeyList: [{
n: "۰۰",
title: "جرقه",
text: "همه‌چیز با سوالی شروع شد که هر کودک کنجکاوی کمی بلندتر از بقیه می‌پرسد: این سیستم چطور کار می‌کند؟ ابتدا کامپیوترها پاسخ دادند؛ و بعد هوش مصنوعی."
}, {
n: "۰۱",
title: "شیفتگی",
text: "شب‌بیداری‌ها، تب‌های بی‌پایان مرورگر، مدل‌ها، مقالات و آزمایش‌های پیاپی. یادگیری در عمل، آزمون و خطا در خلوت، و شیفته این ایده شدن که خودِ «هوش» را می‌توان ساخت."
}, {
n: "۰۲",
title: "مهارت و ساخت",
text: "کنجکاوی به مهارت تبدیل شد: پیاده‌سازی رابط‌های کاربری مدرن، اتصال مدل‌ها به محصولات واقعی و وسواس روی جزئیات ظریفی که به نرم‌افزار حس زندگی می‌دهند."
}, {
n: "۰۳",
title: "کارآفرینی",
text: "فقط ساختن برای سرگرمی نیست — ساختن برای عرضه به دنیای واقعی است. نگاه به هر پروژه به عنوان یک استارتاپ در حال شکل‌گیری: کاربران واقعی، مسائل واقعی و حرکت رو به جلو."
}, {
n: "۰۴",
title: "فصل بعد",
text: "مرزهای فناوری هر هفته جابه‌جا می‌شوند و علی هم پا‌به‌پای آن پیش می‌رود. فصل بعدی همین حالا در حال نوشته شدن است — شاید همراه با شما."
}],
marqueeA: ["هوش مصنوعی", "تکنولوژی خلاقانه", "اتوماسیون هوشمند", "تجربه‌های وب", "محصولات هوش مصنوعی", "کارآفرین دیجیتال"],
marqueeB: ["بساز", "عرضه کن", "بهبود بده", "خودکار کن", "تصور کن", "تکرار کن"],
sigilPrompts: ["علی حاجیان", "طوفان آرام داده‌ها", "رویای یک شبکه عصبی", "روز عرضه محصول", "کنجکاوی بی‌نهایت", "روح در کالبد ماشین", "طلوع الکتریکی بر فراز سیلیکون", "ساختن آینده زودتر از موعد"],
kbList: [{
keys: /^(hi|hey|hello|yo|sup|salam|hola|سلام|درود|چطوری|خوبی|وقت بخیر)\b/i,
a: ["سلام! 👋 من همزاد هوش مصنوعی علی هستم — یک هوش کوچک، صادق و برنامه‌ریزی‌شده که داخل این سایت زندگی می‌کند. درباره کارها، مهارت‌ها، چشم‌انداز علی یا نحوه شروع یک همکاری از من بپرسید."]
}, {
keys: /(who|about|introduce|tell me).*(ali|you|yourself)|who are you|who is ali|علی کیه|کی هستی|معرفی|درباره علی|بیوگرافی|علی حاجیان/i,
a: ["علی حاجیان یک توسعه‌دهنده جوان و پرانگیزه هوش مصنوعی، تکنولوژیست خلاق و کارآفرین دیجیتال است. او در نقطه تلاقی هوش ماشینی و طراحی فعالیت می‌کند — و محصولاتی می‌سازد که گویی چند سال از زمان خود جلوترند."]
}, {
keys: /(what|which).*(build|make|create|do)|work|project|portfolio|ship|پروژه|نمونه کار|چی میساز|چیکار میکن|کارها|آثار/i,
a: ["علی محصولات مبتنی بر هوش مصنوعی، سیستم‌های اتوماسیون هوشمند و وب‌سایت‌های تعاملی و سینمایی می‌سازد. به بخش «پروژه‌ها» سر بزنید تا ایجنت‌های هوشمند، رابط‌های صوتی، ابزارهای مهندسی پرامپت و استودیوهای اتوماسیون او را ببینید."]
}, {
keys: /skill|stack|tech|language|tool|framework|good at|expert|مهارت|تکنولوژی|استک|ابزار|برنامه نویسی|تخصص/i,
a: ["جعبه ابزار علی: React و TypeScript در فرانت‌اند، Node.js و Python در بک‌اند، WebGL برای گرافیک‌های سه‌بعدی و شیدرها، و ابزارهای مدل‌های زبانی (ایجنت‌ها، RAG، مهندسی پرامپت، هوش صوتی و بینایی ماشین) برای مغز متفکر محصولات. به بخش «نقشه عصبی» بروید و گره‌ها را بکشید!"]
}, {
keys: /why.*ai|love ai|passion|motivat|inspire|obsess|چرا هوش مصنوعی|علاقه|انگیزه|هدف/i,
a: ["چون «هوش» اولین فناوری تاریخ است که می‌تواند تمام فناوری‌های دیگر را ارتقا دهد. برای علی، هوش مصنوعی یک موج زودگذر نیست — بلکه متریال جدید خلاقیت است؛ درست مثل گل رس برای یک مجسمه‌ساز."]
}, {
keys: /vision|future|goal|dream|mission|ambition|plan|آینده|چشم انداز|رویا|برنامه/i,
a: ["چشم‌انداز علی دنیایی است که در آن هر فرد صاحب ایده، ارتشی از ابزارهای هوشمند را در کنار خود داشته باشد. او می‌خواهد محصولات و تجربه‌هایی بسازد که این آینده را ممکن و استفاده از آن را لذت‌بخش کنند."]
}, {
keys: /hire|available|contact|email|reach|collab|work with|freelance|talk|start|project together|quote|همکاری|تماس|ایمیل|سفارش|ارتباط|پروژه/i,
a: ["علی آماده همکاری در پروژه‌های جاه‌طلبانه است: محصولات هوش مصنوعی، اتوماسیون‌های هوشمند، وب‌سایت‌های خاص و استارتاپ‌های نوپا. به انتهای صفحه بروید یا به hello@alihajjian.com ایمیل بزنید. 🚀"]
}, {
keys: /design|ui|ux|animation|motion|aesthetic|visual|طراحی|رابط کاربری|انیمیشن|موشن|زیبایی/i,
a: ["فلسفه طراحی علی: نرم‌افزار باید نبض داشته باشد. تک‌تک افکت‌های هاور، انیمیشن‌ها و شیدرهای این صفحه با هدف و دقت طراحی شده‌اند. اگر برنامه‌ای کار کند اما حسی منتقل نکند، هنوز کامل نشده است."]
}, {
keys: /business|startup|entrepreneur|company|founder|money|venture|استارتاپ|کسب و کار|کارآفرین|شرکت/i,
a: ["علی با ذهنیت یک بنیان‌گذار فکر می‌کند: پیدا کردن مسئله دقیق، اعتبارسنجی سریع، ساخت MVP چابک و هدایت محصول با بازخورد کاربران واقعی."]
}, {
keys: /how.*(site|website|page|built|made)|this (site|page)|built with|این سایت|ساخته شده|چطور ساخته/i,
a: ["زیر کاپوت این سایت: React، Vite و Tailwind CSS. پس‌زمینه با یک شیدر WebGL زنده رندر می‌شود، گوی سه‌بعدی با انتشار سیگنال روی Canvas کار می‌کند، نقشه مهارت‌ها یک شبیه‌سازی فیزیکی است و در بخش آزمایشگاه یک شبکه عصبی واقعی در مرورگر شما آموزش می‌بیند!"]
}, {
keys: /age|old|where.*(live|from|based)|location|country|city|born|سن|کجایی|کجا زندگی|محل/i,
a: ["علی برخی جزئیات شخصی را عمومی نکرده است، اما اگر دوست دارید بیشتر بدانید می‌توانید مستقیماً به او پیام بدهید — بسیار خوش‌برخورد است! 😄"]
}, {
keys: /joke|funny|surprise|fun fact|bored|random|جوک|شوخی|سورپرایز|جالب|خنده|سرگرمی/i,
a: ["چرا شبکه عصبی پیش روان‌شناس رفت؟ چون لایه‌های پنهان و حل‌نشده زیادی داشت! 🧠", "نکته مخفی: در این سایت یک حالت «اوردرایو» پنهان وجود دارد! کد کونامی (↑ ↑ ↓ ↓ ← → ← → B A) را روی کیبورد امتحان کنید.", "من ۱۰۰٪ اسکریپت‌شده هستم، به همین خاطر تنها هوش مصنوعی‌ای هستم که هرگز توهم (Hallucination) نمی‌زند!"]
}, {
keys: /thank|thanks|cool|awesome|nice|amazing|wow|great|ممنون|مرسی|عالی|باحال|دمت گرم|فوق العاده/i,
a: ["خیلی ممنون! حتماً به خود علی هم بگویید — از بازخوردهای خوب انرژی می‌گیرد. 😉", "خوشحالم که پسندیدید! پیشنهاد می‌کنم بخش «آزمایشگاه» را هم امتحان کنید و شبکه عصبی را خودتان آموزش دهید."]
}],
kbFallback: ["همم، این مورد خارج از اسکریپت کوچک من است! من درباره پروژه‌ها، مهارت‌ها، چشم‌انداز، نحوه همکاری و معماری این سایت اطلاعات دارم — یکی از این‌ها را بپرسید یا مستقیماً به علی ایمیل بزنید.", "من یک همزاد هوشمند متمرکز هستم؛ درباره پروژه‌ها، مهارت‌های فنی، دیدگاه هوش مصنوعی یا همکاری بپرسید تا بهترین پاسخ را بدهم!"],
askChips: ["علی کیست؟", "چه چیزهایی می‌سازد؟", "چرا هوش مصنوعی؟", "استک فنی چیست؟", "این سایت چطور ساخته شده؟", "چطور همکاری کنیم؟", "غافلگیرم کن!"]
};
exports.DATA_FA = DATA_FA;
function getData(lang) {
return lang === "fa" ? DATA_FA : DATA_EN;
}
const SECTIONS = DATA_FA.sections;
exports.SECTIONS = SECTIONS;
const ROLES = DATA_FA.roles;
exports.ROLES = ROLES;
const PROJECTS = DATA_FA.projects;
exports.PROJECTS = PROJECTS;
const SERVICES = DATA_FA.services;
exports.SERVICES = SERVICES;
const CATS = DATA_FA.cats;
exports.CATS = CATS;
const SKILLS = DATA_FA.skills;
exports.SKILLS = SKILLS;
const JOURNEY = DATA_FA.journeyList;
exports.JOURNEY = JOURNEY;
const MARQUEE_A = DATA_FA.marqueeA;
exports.MARQUEE_A = MARQUEE_A;
const MARQUEE_B = DATA_FA.marqueeB;
exports.MARQUEE_B = MARQUEE_B;
const SIGIL_PROMPTS = DATA_FA.sigilPrompts;
exports.SIGIL_PROMPTS = SIGIL_PROMPTS;
const KB_LIST = DATA_FA.kbList;
exports.KB_LIST = KB_LIST;
const KB_FALLBACK = DATA_FA.kbFallback;
exports.KB_FALLBACK = KB_FALLBACK;
const ASK_CHIPS = DATA_FA.askChips;
exports.ASK_CHIPS = ASK_CHIPS;
},
"app:components/ui":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.CountUp = CountUp;
exports.Magnetic = Magnetic;
exports.Marquee = Marquee;
exports.Reveal = Reveal;
exports.ScrambleText = ScrambleText;
exports.SectionHead = SectionHead;
exports.SplitHeading = SplitHeading;
Object.defineProperty(exports, "tick", {
enumerable: true,
get: function () {
return _sound.tick;
}
});
exports.useInView = useInView;
var _react = _req("react");
var _engine = _req("app:lib/engine");
var _sound = _req("app:lib/sound");
var _i18n = _req("app:lib/i18n");
function useInView(threshold = 0.2) {
const ref = (0, _react.useRef)(null);
const [inView, set] = (0, _react.useState)(false);
(0, _react.useEffect)(() => {
const el = ref.current;
if (!el) return;
const io = new IntersectionObserver(([e]) => {
if (e.isIntersecting) {
set(true);
io.disconnect();
}
}, {
threshold
});
io.observe(el);
return () => io.disconnect();
}, [threshold]);
return [ref, inView];
}
function Reveal({
children,
delay = 0,
className = "",
as: Tag = "div"
}) {
const [ref, inView] = useInView(0.15);
const T = Tag;
return /*#__PURE__*/React.createElement(T, {
ref: ref,
className: `reveal ${inView ? "in" : ""} ${className}`,
style: {
"--d": `${delay}ms`
}
}, children);
}
function SplitHeading({
text,
className = "",
delay = 0
}) {
const [ref, inView] = useInView(0.2);
const {
isRtl
} = (0, _i18n.useI18n)();
const words = text.split(" ");
return /*#__PURE__*/React.createElement("h2", {
ref: ref,
className: `${inView ? "in" : ""} ${isRtl ? "leading-[1.18] tracking-normal" : ""} ${className}`
}, words.map((w, i) => {
const em = w.startsWith("*") && (w.endsWith("*") || w.endsWith("*."));
const word = w.replace(/\*/g, "");
return /*#__PURE__*/React.createElement("span", {
key: i,
className: "split-mask"
}, /*#__PURE__*/React.createElement("span", {
className: `split-inner ${em ? "serif text-grad px-[.06em]" : ""}`,
style: {
"--d": `${delay + i * 70}ms`
}
}, word, "\u00A0"));
}));
}
function SectionHead({
n,
label,
title,
kicker
}) {
const {
lang
} = (0, _i18n.useI18n)();
return /*#__PURE__*/React.createElement("div", {
className: "mb-14 md:mb-20"
}, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
className: "mono flex items-center gap-4 text-white/50"
}, /*#__PURE__*/React.createElement("span", {
className: "text-[var(--acid)]"
}, (0, _i18n.toPersianDigits)(n, lang)), /*#__PURE__*/React.createElement("span", {
className: "h-px w-16 bg-white/25"
}), /*#__PURE__*/React.createElement("span", null, label))), /*#__PURE__*/React.createElement(SplitHeading, {
text: title,
className: "mt-6 font-display text-[clamp(2.4rem,6.8vw,6.4rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
}), kicker && /*#__PURE__*/React.createElement(Reveal, {
delay: 300
}, /*#__PURE__*/React.createElement("p", {
className: "mt-6 max-w-xl text-base leading-relaxed text-white/55 md:text-lg"
}, kicker)));
}
function Magnetic({
children,
strength = 0.35,
className = ""
}) {
const ref = (0, _react.useRef)(null);
const st = (0, _react.useRef)({
x: 0,
y: 0,
tx: 0,
ty: 0
});
(0, _react.useEffect)(() => {
const el = ref.current;
const s = st.current;
const move = e => {
const r = el.getBoundingClientRect();
s.tx = (e.clientX - (r.left + r.width / 2)) * strength;
s.ty = (e.clientY - (r.top + r.height / 2)) * strength;
};
const leave = () => {
s.tx = 0;
s.ty = 0;
};
el.addEventListener("pointermove", move);
el.addEventListener("pointerleave", leave);
const off = (0, _engine.onFrame)(() => {
s.x += (s.tx - s.x) * 0.16;
s.y += (s.ty - s.y) * 0.16;
if (Math.abs(s.x) + Math.abs(s.y) > 0.02 || Math.abs(s.tx) + Math.abs(s.ty) > 0) el.style.transform = `translate3d(${s.x}px,${s.y}px,0)`;
});
return () => {
off();
el.removeEventListener("pointermove", move);
el.removeEventListener("pointerleave", leave);
};
}, [strength]);
return /*#__PURE__*/React.createElement("div", {
ref: ref,
className: `inline-block p-6 -m-6 ${className}`
}, children);
}
const GLYPHS_EN = "!<>-_\\/[]{}—=+*^?#01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const GLYPHS_FA = "۰۱۲۳۴۵۶۷۸۹✦⚡◈◇∆∇ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی";
function ScrambleText({
phrases,
interval = 2800,
className = ""
}) {
const {
lang
} = (0, _i18n.useI18n)();
const [txt, setTxt] = (0, _react.useState)(phrases[0]);
(0, _react.useEffect)(() => {
setTxt(phrases[0]);
let idx = 0;
let raf = 0;
let timer = 0;
const glyphs = lang === "fa" ? GLYPHS_FA : GLYPHS_EN;
const run = (to, from) => {
const len = Math.max(to.length, from.length);
const q = Array.from({
length: len
}, (_, i) => {
const start = Math.floor(Math.random() * 14);
return {
from: from[i] || "",
to: to[i] || "",
start,
end: start + Math.floor(Math.random() * 16) + 5
};
});
let frame = 0;
const step = () => {
let out = "";
let done = 0;
q.forEach(c => {
if (frame >= c.end) {
done++;
out += c.to;
} else if (frame >= c.start) {
out += c.to === " " ? " " : glyphs[Math.floor(Math.random() * glyphs.length)];
} else out += c.from;
});
setTxt(out);
frame++;
if (done < q.length) raf = requestAnimationFrame(step);
};
step();
};
const next = () => {
const from = phrases[idx];
idx = (idx + 1) % phrases.length;
run(phrases[idx], from);
timer = window.setTimeout(next, interval);
};
timer = window.setTimeout(next, interval);
return () => {
cancelAnimationFrame(raf);
clearTimeout(timer);
};
}, [phrases, interval, lang]);
return /*#__PURE__*/React.createElement("span", {
className: className
}, txt);
}
function Marquee({
items,
dir = 1,
outline = false,
className = ""
}) {
const track = (0, _react.useRef)(null);
const wrap = (0, _react.useRef)(null);
(0, _react.useEffect)(() => {
let x = 0;
const off = (0, _engine.onFrame)((_, dt) => {
const el = track.current;
if (!el) return;
const half = el.scrollWidth / 2;
x += (60 + Math.abs(_engine.engine.velocity) * 14) * dt * dir * (_engine.engine.velocity < 0 ? -1 : 1);
if (x > half) x -= half;
if (x < 0) x += half;
el.style.transform = `translate3d(${-x}px,0,0)`;
if (wrap.current) wrap.current.style.transform = `skewX(${(0, _engine.clamp)(_engine.engine.velocity * -0.35, -14, 14)}deg)`;
});
return off;
}, [dir, items]);
const row = items.map((t, i) => /*#__PURE__*/React.createElement("span", {
key: i,
className: "flex items-center gap-10 px-5"
}, /*#__PURE__*/React.createElement("span", {
className: outline ? "outline-text" : ""
}, t), /*#__PURE__*/React.createElement("span", {
className: "text-[var(--acid)]"
}, "\u2726")));
return /*#__PURE__*/React.createElement("div", {
dir: "ltr",
className: `overflow-hidden whitespace-nowrap ${className}`
}, /*#__PURE__*/React.createElement("div", {
ref: wrap
}, /*#__PURE__*/React.createElement("div", {
ref: track,
className: "flex w-max will-change-transform"
}, /*#__PURE__*/React.createElement("div", {
className: "flex"
}, row), /*#__PURE__*/React.createElement("div", {
className: "flex"
}, row), /*#__PURE__*/React.createElement("div", {
className: "flex"
}, row), /*#__PURE__*/React.createElement("div", {
className: "flex"
}, row))));
}
function CountUp({
to,
suffix = "",
duration = 1800
}) {
const [ref, inView] = useInView(0.5);
const [v, setV] = (0, _react.useState)(0);
(0, _react.useEffect)(() => {
if (!inView) return;
const s = performance.now();
let raf = 0;
const step = n => {
const p = (0, _engine.clamp)((n - s) / duration);
setV(Math.round(to * (1 - Math.pow(1 - p, 4))));
if (p < 1) raf = requestAnimationFrame(step);
};
raf = requestAnimationFrame(step);
return () => cancelAnimationFrame(raf);
}, [inView, to, duration]);
return /*#__PURE__*/React.createElement("span", {
ref: ref
}, v, suffix);
}
},
"app:components/Background":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = Background;
var _react = _req("react");
var _engine = _req("app:lib/engine");
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uScroll; uniform float uVel;
uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uClick; uniform float uBoost;
float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
vec2 i = floor(p), f = fract(p);
float a = hash(i), b = hash(i+vec2(1.,0.)), c = hash(i+vec2(0.,1.)), d = hash(i+vec2(1.,1.));
vec2 u = f*f*(3.-2.*f);
return mix(a,b,u.x) + (c-a)*u.y*(1.-u.x) + (d-b)*u.x*u.y;
}
float fbm(vec2 p){
float v = 0., a = .5;
mat2 r = mat2(.8,-.6,.6,.8);
for(int i=0;i<5;i++){ v += a*noise(p); p = r*p*2.03 + vec2(1.7,9.2); a *= .5; }
return v;
}
void main(){
vec2 uv = gl_FragCoord.xy / uRes;
float asp = uRes.x / uRes.y;
vec2 p = (uv - .5) * vec2(asp, 1.);
vec2 m = (uMouse - .5) * vec2(asp, 1.);
float t = uTime * .045 * (1. + uBoost*3.);
p.y += uScroll * .00022;
vec2 d = p - m;
float md = length(d);
p += normalize(d + 1e-4) * exp(-md*4.) * .06;
vec2 q = vec2(fbm(p*1.6 + t), fbm(p*1.6 + vec2(5.2,1.3) - t));
vec2 r = vec2(fbm(p*1.6 + 3.2*q + vec2(1.7,9.2) + t*1.4), fbm(p*1.6 + 3.2*q + vec2(8.3,2.8) - t*1.1));
float f = fbm(p*1.6 + 3.2*r + uVel*.02);
vec3 col = mix(uC1, uC2, clamp(f*f*2.4, 0., 1.));
col = mix(col, uC3, clamp(length(q)*.9 - .15, 0., 1.) * (.5 + .5*sin(uScroll*.0007)));
float inten = f*f*f*1.5 + .55*f*f + .12*f;
col *= inten * .62;
col += uC2 * exp(-md*3.2) * .10;
vec2 cp = (uClick.xy - .5) * vec2(asp, 1.);
float cd = length(p - cp);
float ct = uClick.z;
float ring = exp(-pow((cd - ct*.9)*9., 2.)) * exp(-ct*2.2);
col += mix(uC2, uC3, .5) * ring * .7;
vec2 g = abs(fract((uv*uRes)/ 64.) - .5);
float grid = smoothstep(.49,.5,max(g.x,g.y)) * .035;
col += vec3(grid) * (.4 + f);
float vig = smoothstep(1.15, .25, length(uv-.5)*1.25);
col *= vig;
col += vec3(.018,.02,.032);
gl_FragColor = vec4(col, 1.);
}`;
function Background() {
const ref = (0, _react.useRef)(null);
(0, _react.useEffect)(() => {
const canvas = ref.current;
const gl = canvas.getContext("webgl", {
antialias: false,
alpha: false,
powerPreference: "high-performance"
});
if (!gl) return;
const sh = (type, src) => {
const s = gl.createShader(type);
gl.shaderSource(s, src);
gl.compileShader(s);
return s;
};
const prog = gl.createProgram();
gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
gl.useProgram(prog);
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
const loc = gl.getAttribLocation(prog, "p");
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
const U = n => gl.getUniformLocation(prog, n);
const u = {
res: U("uRes"),
time: U("uTime"),
mouse: U("uMouse"),
scroll: U("uScroll"),
vel: U("uVel"),
c1: U("uC1"),
c2: U("uC2"),
c3: U("uC3"),
click: U("uClick"),
boost: U("uBoost")
};
const scale = window.innerWidth < 800 ? 0.4 : 0.5;
const resize = () => {
canvas.width = Math.floor(window.innerWidth * scale);
canvas.height = Math.floor(window.innerHeight * scale);
gl.viewport(0, 0, canvas.width, canvas.height);
};
resize();
window.addEventListener("resize", resize);
let boost = 0;
let vel = 0;
const off = (0, _engine.onFrame)((t, dt) => {
boost += ((_engine.engine.overdrive ? 1 : 0) - boost) * Math.min(1, dt * 2);
vel += (_engine.engine.velocity - vel) * Math.min(1, dt * 6);
const pal = _engine.engine.pal;
const c = h => (0, _engine.hexRgb)(h).map(v => v / 255);
gl.uniform2f(u.res, canvas.width, canvas.height);
gl.uniform1f(u.time, t);
gl.uniform2f(u.mouse, _engine.engine.sx / window.innerWidth, 1 - _engine.engine.sy / window.innerHeight);
gl.uniform1f(u.scroll, _engine.engine.scroll);
gl.uniform1f(u.vel, vel);
gl.uniform3f(u.c1, ...c(pal.c1));
gl.uniform3f(u.c2, ...c(pal.c2));
gl.uniform3f(u.c3, ...c(pal.c3));
gl.uniform3f(u.click, _engine.engine.click.x, _engine.engine.click.y, t - _engine.engine.click.t);
gl.uniform1f(u.boost, boost);
gl.drawArrays(gl.TRIANGLES, 0, 3);
});
return () => {
off();
window.removeEventListener("resize", resize);
};
}, []);
return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("canvas", {
ref: ref,
className: "fixed inset-0 z-0 h-full w-full",
style: {
imageRendering: "auto"
}
}), /*#__PURE__*/React.createElement("div", {
className: "vignette pointer-events-none fixed inset-0 z-[1]"
}));
}
},
"app:components/Loader":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = Loader;
var _react = _req("react");
var _data = _req("app:data");
var _i18n = _req("app:lib/i18n");
function Loader({
onDone
}) {
const {
lang
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
const lines = d.loaderLines;
const [p, setP] = (0, _react.useState)(0);
const [out, setOut] = (0, _react.useState)(false);
const [gone, setGone] = (0, _react.useState)(false);
(0, _react.useEffect)(() => {
const start = performance.now();
const dur = 2200;
let raf = 0;
const step = n => {
const t = Math.min(1, (n - start) / dur);
const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
setP(Math.round(e * 100));
if (t < 1) raf = requestAnimationFrame(step);else {
setTimeout(() => {
setOut(true);
onDone();
setTimeout(() => setGone(true), 1400);
}, 300);
}
};
raf = requestAnimationFrame(step);
return () => cancelAnimationFrame(raf);
}, []);
if (gone) return null;
const shown = Math.min(lines.length, Math.floor(p / 100 * lines.length) + 1);
const numStr = (0, _i18n.toPersianDigits)(String(p).padStart(2, "0"), lang);
return /*#__PURE__*/React.createElement("div", {
className: "fixed inset-0 z-[200] flex flex-col justify-between bg-[#05060a] p-6 md:p-12",
style: {
clipPath: out ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)",
transition: "clip-path 1.2s cubic-bezier(.75,0,.15,1)",
pointerEvents: out ? "none" : "auto"
}
}, /*#__PURE__*/React.createElement("div", {
className: "mono flex justify-between text-white/40"
}, /*#__PURE__*/React.createElement("span", null, "ALI.OS / ", lang === "fa" ? "راه‌اندازی سیستم" : "boot"), /*#__PURE__*/React.createElement("span", null, "v1.0 \xB7 ", (0, _i18n.toPersianDigits)(new Date().getFullYear(), lang))), /*#__PURE__*/React.createElement("div", {
className: "relative"
}, /*#__PURE__*/React.createElement("div", {
className: "font-display font-extrabold leading-none tracking-[-0.06em] text-white",
style: {
fontSize: "clamp(6rem, 26vw, 24rem)",
fontVariationSettings: '"wdth" 80',
transform: out ? "translateY(-30px) scale(1.04)" : "none",
transition: "transform 1.2s cubic-bezier(.75,0,.15,1)"
}
}, /*#__PURE__*/React.createElement("span", {
className: "glitch",
"data-text": numStr
}, numStr), /*#__PURE__*/React.createElement("span", {
className: "text-[.28em] text-[var(--acid)]"
}, lang === "fa" ? "٪" : "%")), /*#__PURE__*/React.createElement("div", {
className: "mt-4 h-px w-full overflow-hidden bg-white/10"
}, /*#__PURE__*/React.createElement("div", {
className: "h-full bg-[var(--acid)] shadow-[0_0_20px_var(--acid)]",
style: {
width: `${p}%`
}
}))), /*#__PURE__*/React.createElement("div", {
className: "flex flex-col justify-between gap-6 md:flex-row md:items-end"
}, /*#__PURE__*/React.createElement("div", {
className: "mono space-y-1.5 text-[11px] text-white/50"
}, lines.slice(0, shown).map((l, i) => /*#__PURE__*/React.createElement("div", {
key: l,
className: i === shown - 1 && p < 100 ? "caret text-white" : ""
}, /*#__PURE__*/React.createElement("span", {
className: "me-3 text-[var(--acid)]"
}, i === shown - 1 && p < 100 ? "›" : "✓"), l))), /*#__PURE__*/React.createElement("div", {
className: "font-display text-3xl font-light tracking-tight text-white/90 md:text-5xl"
}, lang === "fa" ? /*#__PURE__*/React.createElement(React.Fragment, null, "\u0639\u0644\u06CC ", /*#__PURE__*/React.createElement("span", {
className: "serif text-grad"
}, "\u062D\u0627\u062C\u06CC\u0627\u0646")) : /*#__PURE__*/React.createElement(React.Fragment, null, "Ali ", /*#__PURE__*/React.createElement("span", {
className: "serif text-grad"
}, "Hajjian")))));
}
},
"app:components/Cursor":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = Cursor;
var _react = _req("react");
var _engine = _req("app:lib/engine");
var _sound = _req("app:lib/sound");
function Cursor() {
const [enabled] = (0, _react.useState)(() => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches);
const dot = (0, _react.useRef)(null);
const ring = (0, _react.useRef)(null);
const label = (0, _react.useRef)(null);
const trail = (0, _react.useRef)(null);
(0, _react.useEffect)(() => {
if (!enabled) return;
document.documentElement.classList.add("has-cursor");
const state = {
rx: _engine.engine.mx,
ry: _engine.engine.my,
big: false,
text: "",
down: false
};
const pts = [];
const cv = trail.current;
const ctx = cv.getContext("2d");
const rs = () => {
cv.width = window.innerWidth;
cv.height = window.innerHeight;
};
rs();
window.addEventListener("resize", rs);
const over = e => {
const t = e.target;
const el = t.closest?.("[data-cursor]");
const inter = t.closest?.("a,button,input,textarea,[data-hover]");
if (el) {
state.big = true;
state.text = el.dataset.cursor || "";
} else if (inter) {
state.big = true;
state.text = "";
} else {
state.big = false;
state.text = "";
}
if (inter || el) (0, _sound.tick)(1100 + Math.random() * 500, 0.035, 0.02);
};
const down = () => state.down = true;
const up = () => state.down = false;
window.addEventListener("pointerover", over);
window.addEventListener("pointerdown", down);
window.addEventListener("pointerup", up);
const off = (0, _engine.onFrame)(() => {
state.rx += (_engine.engine.mx - state.rx) * 0.18;
state.ry += (_engine.engine.my - state.ry) * 0.18;
dot.current.style.transform = `translate3d(${_engine.engine.mx}px,${_engine.engine.my}px,0)`;
const size = state.big ? state.text ? 92 : 56 : state.down ? 24 : 36;
const r = ring.current;
r.style.width = r.style.height = `${size}px`;
r.style.transform = `translate3d(${state.rx - size / 2}px,${state.ry - size / 2}px,0)`;
r.style.background = state.text ? "var(--acid)" : state.big ? "rgba(255,255,255,.08)" : "transparent";
r.style.borderColor = state.text ? "var(--acid)" : "rgba(255,255,255,.55)";
const l = label.current;
l.textContent = state.text;
l.style.opacity = state.text ? "1" : "0";
dot.current.style.opacity = state.text ? "0" : "1";
pts.push({
x: _engine.engine.mx,
y: _engine.engine.my
});
if (pts.length > 26) pts.shift();
ctx.clearRect(0, 0, cv.width, cv.height);
ctx.lineCap = "round";
ctx.lineJoin = "round";
for (let i = 1; i < pts.length; i++) {
const a = i / pts.length;
ctx.strokeStyle = (0, _engine.rgba)(i % 2 ? _engine.engine.pal.c2 : _engine.engine.pal.c3, a * 0.35);
ctx.lineWidth = a * 5;
ctx.beginPath();
ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
ctx.lineTo(pts[i].x, pts[i].y);
ctx.stroke();
}
});
return () => {
off();
document.documentElement.classList.remove("has-cursor");
window.removeEventListener("resize", rs);
window.removeEventListener("pointerover", over);
window.removeEventListener("pointerdown", down);
window.removeEventListener("pointerup", up);
};
}, [enabled]);
if (!enabled) return null;
return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("canvas", {
ref: trail,
className: "pointer-events-none fixed inset-0 z-[150]"
}), /*#__PURE__*/React.createElement("div", {
ref: ring,
className: "pointer-events-none fixed left-0 top-0 z-[160] flex items-center justify-center rounded-full border",
style: {
transition: "width .35s cubic-bezier(.2,.8,.2,1), height .35s cubic-bezier(.2,.8,.2,1), background .3s, border-color .3s"
}
}, /*#__PURE__*/React.createElement("span", {
ref: label,
className: "mono !text-[10px] font-bold !tracking-[.12em] text-black transition-opacity"
})), /*#__PURE__*/React.createElement("div", {
ref: dot,
className: "pointer-events-none fixed left-0 top-0 z-[170] -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-white mix-blend-difference"
}));
}
},
});