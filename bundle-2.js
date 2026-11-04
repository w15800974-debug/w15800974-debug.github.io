window.__MODULES__=Object.assign(window.__MODULES__||{},{"app:components/Nav":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = Nav;
var _react = _req("react");
var _data = _req("app:data");
var _engine = _req("app:lib/engine");
var _sound = _req("app:lib/sound");
var _i18n = _req("app:lib/i18n");
function triggerOverdrive(msg) {
_engine.engine.overdrive = true;
document.body.classList.add("overdrive");
window.dispatchEvent(new CustomEvent("toast", {
detail: msg
}));
setTimeout(() => {
_engine.engine.overdrive = false;
document.body.classList.remove("overdrive");
}, 9000);
}
function Nav({
ready
}) {
const {
lang,
isRtl,
toggleLang
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
const sections = d.sections;
const [active, setActive] = (0, _react.useState)(0);
const [palIdx, setPalIdx] = (0, _react.useState)(0);
const [sound, setSoundState] = (0, _react.useState)(false);
const [open, setOpen] = (0, _react.useState)(false);
const [toast, setToast] = (0, _react.useState)(null);
const bar = (0, _react.useRef)(null);
const coords = (0, _react.useRef)(null);
const pct = (0, _react.useRef)(null);
const clock = (0, _react.useRef)(null);
(0, _react.useEffect)(() => {
let cur = 0;
let lastClock = 0;
const off = (0, _engine.onFrame)(t => {
const max = document.documentElement.scrollHeight - window.innerHeight;
const p = (0, _engine.clamp)(_engine.engine.scroll / Math.max(1, max));
if (bar.current) bar.current.style.transform = `scaleX(${p})`;
if (pct.current) pct.current.textContent = (0, _i18n.toPersianDigits)(String(Math.round(p * 100)).padStart(3, "0"), lang);
if (coords.current) coords.current.textContent = `${(0, _i18n.toPersianDigits)(String(Math.round(_engine.engine.mx)).padStart(4, "0"), lang)}:${(0, _i18n.toPersianDigits)(String(Math.round(_engine.engine.my)).padStart(4, "0"), lang)}`;
let a = 0;
sections.forEach((s, i) => {
const el = document.getElementById(s.id);
if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) a = i;
});
if (a !== cur) {
cur = a;
setActive(a);
}
if (t - lastClock > 1 && clock.current) {
lastClock = t;
clock.current.textContent = new Date().toLocaleTimeString(lang === "fa" ? "fa-IR" : [], {
hour: "2-digit",
minute: "2-digit",
second: "2-digit"
});
}
});
return off;
}, [lang, sections]);
(0, _react.useEffect)(() => {
let to = 0;
const onToast = e => {
setToast(e.detail);
clearTimeout(to);
to = window.setTimeout(() => setToast(null), 2600);
};
const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let pos = 0;
const key = e => {
if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
e.preventDefault();
setOpen(o => !o);
}
const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
pos = k === seq[pos] ? pos + 1 : k === seq[0] ? 1 : 0;
if (pos === seq.length) {
pos = 0;
triggerOverdrive(d.nav.toastOverdrive);
}
};
window.addEventListener("toast", onToast);
window.addEventListener("keydown", key);
return () => {
window.removeEventListener("toast", onToast);
window.removeEventListener("keydown", key);
clearTimeout(to);
};
}, [d.nav.toastOverdrive]);
const cyclePal = i => {
(0, _engine.setPalette)(i);
setPalIdx(i);
(0, _sound.tick)(600 + i * 200, 0.12, 0.05);
};
const toggleSound = (0, _react.useCallback)(() => {
const n = !(0, _sound.isSoundOn)();
(0, _sound.setSound)(n);
setSoundState(n);
if (n) setTimeout(() => (0, _sound.tick)(880, 0.2, 0.06), 100);
}, []);
const handleLangToggle = (0, _react.useCallback)(() => {
toggleLang();
(0, _sound.tick)(960, 0.14, 0.05);
window.dispatchEvent(new CustomEvent("toast", {
detail: lang === "fa" ? "🌐 Language switched to English" : "🌐 زبان وب‌سایت به فارسی تغییر کرد"
}));
}, [toggleLang, lang]);
const cmds = (0, _react.useMemo)(() => [{
id: "lang",
label: d.nav.cmdLang,
hint: lang === "fa" ? "EN" : "FA",
run: handleLangToggle
}, ...sections.map((s, i) => ({
id: s.id,
label: `${d.nav.goTo} «${s.label}»`,
hint: (0, _i18n.toPersianDigits)(`0${i}`, lang),
run: () => (0, _engine.scrollToId)(s.id)
})), {
id: "ask-cmd",
label: d.nav.cmdChat,
hint: "AI",
run: () => (0, _engine.scrollToId)("ask")
}, {
id: "copy",
label: d.nav.cmdCopy,
hint: "COPY",
run: () => {
try {
navigator.clipboard?.writeText(_data.EMAIL);
} catch {
}
window.dispatchEvent(new CustomEvent("toast", {
detail: d.nav.toastEmail
}));
}
}, ..._engine.PALETTES.map((p, i) => ({
id: `pal${i}`,
label: `${d.nav.cmdTheme} · ${d.nav.palettes[i] || p.name}`,
hint: "THEME",
run: () => cyclePal(i)
})), {
id: "sound",
label: d.nav.cmdSound,
hint: "AUDIO",
run: toggleSound
}, {
id: "od",
label: d.nav.cmdOverdrive,
hint: "⚡",
run: () => triggerOverdrive(d.nav.toastOverdrive)
}], [d.nav, sections, lang, handleLangToggle, toggleSound]);
return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
className: "fixed left-0 top-0 z-[100] h-[2px] w-full"
}, /*#__PURE__*/React.createElement("div", {
ref: bar,
className: `h-full ${isRtl ? "origin-right" : "origin-left"} bg-gradient-to-r from-[var(--c2)] via-[var(--c1)] to-[var(--c3)] shadow-[0_0_14px_var(--c2)]`,
style: {
transform: "scaleX(0)"
}
})), /*#__PURE__*/React.createElement("header", {
className: "fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-5 py-5 md:px-10 md:py-7",
style: {
opacity: ready ? 1 : 0,
transform: ready ? "none" : "translateY(-20px)",
transition: "all 1s .6s cubic-bezier(.2,.8,.2,1)"
}
}, /*#__PURE__*/React.createElement("button", {
onClick: () => (0, _engine.scrollToId)("hero"),
className: "group flex items-center gap-3 text-start",
"aria-label": "Back to top"
}, /*#__PURE__*/React.createElement("span", {
className: "relative grid h-10 w-10 place-items-center rounded-full border border-white/20 font-display text-sm font-bold"
}, /*#__PURE__*/React.createElement("span", {
className: "absolute inset-0 rounded-full border border-[var(--acid)] opacity-0 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100"
}), "AH"), /*#__PURE__*/React.createElement("span", {
className: "mono hidden text-white/60 sm:block"
}, lang === "fa" ? "علی حاجیان" : "Ali Hajjian", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
className: "text-white/30"
}, d.nav.subtitle))), /*#__PURE__*/React.createElement("div", {
className: "flex items-center gap-2 md:gap-3"
}, /*#__PURE__*/React.createElement("button", {
onClick: handleLangToggle,
title: d.nav.langTitle,
className: "glass mono flex h-9 items-center gap-1.5 rounded-full border border-[var(--acid)]/40 px-3.5 text-[var(--acid)] transition-all hover:bg-[var(--acid)] hover:text-black"
}, /*#__PURE__*/React.createElement("span", {
className: "text-xs"
}, "\uD83C\uDF10"), /*#__PURE__*/React.createElement("span", {
className: "font-bold"
}, d.nav.langLabel)), /*#__PURE__*/React.createElement("div", {
className: "glass flex items-center gap-2 rounded-full px-3 py-2"
}, _engine.PALETTES.map((p, i) => /*#__PURE__*/React.createElement("button", {
key: p.name,
title: d.nav.palettes[i] || p.name,
onClick: () => cyclePal(i),
className: "h-4 w-4 rounded-full transition-transform hover:scale-125",
style: {
background: `conic-gradient(${p.c1}, ${p.c2}, ${p.c3}, ${p.c1})`,
outline: palIdx === i ? "2px solid #fff" : "none",
outlineOffset: 2
}
}))), /*#__PURE__*/React.createElement("button", {
onClick: toggleSound,
className: "glass mono flex h-9 items-center gap-2 rounded-full px-3",
"aria-label": "Toggle sound"
}, /*#__PURE__*/React.createElement("span", {
className: "flex h-3 items-end gap-[2px]"
}, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("span", {
key: i,
className: "w-[2px] origin-bottom rounded bg-[var(--acid)]",
style: {
height: "100%",
transform: sound ? undefined : "scaleY(.25)",
animation: sound ? `bar ${0.7 + i * 0.15}s ease-in-out infinite` : "none"
}
}))), /*#__PURE__*/React.createElement("span", {
className: "hidden sm:inline"
}, sound ? d.nav.soundOn : d.nav.soundOff)), /*#__PURE__*/React.createElement("button", {
onClick: () => setOpen(true),
className: "glass mono hidden h-9 items-center gap-2 rounded-full px-4 sm:flex"
}, /*#__PURE__*/React.createElement("span", {
className: "text-white/50"
}, "\u2318K"), /*#__PURE__*/React.createElement("span", null, d.nav.command)), /*#__PURE__*/React.createElement("button", {
onClick: () => setOpen(true),
className: "glass mono grid h-9 w-9 place-items-center rounded-full sm:hidden",
"aria-label": "Menu"
}, "\u2261"))), /*#__PURE__*/React.createElement("nav", {
className: `fixed ${isRtl ? "right-5" : "left-5"} top-1/2 z-[100] hidden -translate-y-1/2 flex-col gap-3 lg:flex`,
style: {
opacity: ready ? 1 : 0,
transition: "opacity 1s 1s"
}
}, sections.map((s, i) => /*#__PURE__*/React.createElement("button", {
key: s.id,
onClick: () => (0, _engine.scrollToId)(s.id),
className: "group flex items-center gap-3",
"aria-label": s.label
}, /*#__PURE__*/React.createElement("span", {
className: `block h-px transition-all duration-500 ${active === i ? "w-8 bg-[var(--acid)]" : "w-3 bg-white/30 group-hover:w-6 group-hover:bg-white"}`
}), /*#__PURE__*/React.createElement("span", {
className: `mono !text-[10px] transition-all duration-300 ${active === i ? "translate-x-0 text-[var(--acid)] opacity-100" : `${isRtl ? "translate-x-2" : "-translate-x-2"} text-white/60 opacity-0 group-hover:translate-x-0 group-hover:opacity-100`}`
}, s.label)))), /*#__PURE__*/React.createElement("div", {
className: `mono pointer-events-none fixed bottom-5 ${isRtl ? "right-5 md:right-10" : "left-5 md:left-10"} z-[100] hidden gap-6 !text-[10px] text-white/40 md:flex`,
style: {
opacity: ready ? 1 : 0,
transition: "opacity 1s 1.2s"
}
}, /*#__PURE__*/React.createElement("span", {
dir: "ltr"
}, "XY ", /*#__PURE__*/React.createElement("span", {
ref: coords,
className: "text-white/70"
})), /*#__PURE__*/React.createElement("span", {
dir: "ltr"
}, "SCRL ", /*#__PURE__*/React.createElement("span", {
ref: pct,
className: "text-white/70"
}), "%")), /*#__PURE__*/React.createElement("div", {
className: `mono pointer-events-none fixed bottom-5 ${isRtl ? "left-5 md:left-10" : "right-5 md:right-10"} z-[100] hidden !text-[10px] text-white/40 md:block`,
style: {
opacity: ready ? 1 : 0,
transition: "opacity 1s 1.2s"
}
}, /*#__PURE__*/React.createElement("span", {
className: "text-[var(--acid)]"
}, "\xA7 ", sections[active]?.label), " \xB7 ", /*#__PURE__*/React.createElement("span", {
ref: clock,
className: "text-white/70"
})), /*#__PURE__*/React.createElement("div", {
className: "mono glass pointer-events-none fixed bottom-16 left-1/2 z-[300] -translate-x-1/2 rounded-full px-5 py-3 text-[var(--acid)] transition-all duration-500",
style: {
opacity: toast ? 1 : 0,
transform: `translate(-50%, ${toast ? 0 : 20}px)`
}
}, toast), open && /*#__PURE__*/React.createElement(Palette, {
cmds: cmds,
placeholder: d.nav.cmdPlaceholder,
emptyText: d.nav.cmdEmpty,
onClose: () => setOpen(false)
}));
}
function Palette({
cmds,
placeholder,
emptyText,
onClose
}) {
const [q, setQ] = (0, _react.useState)("");
const [sel, setSel] = (0, _react.useState)(0);
const input = (0, _react.useRef)(null);
const list = (0, _react.useMemo)(() => cmds.filter(c => c.label.toLowerCase().includes(q.toLowerCase())), [cmds, q]);
(0, _react.useEffect)(() => {
input.current?.focus();
_engine.engine.lenis?.stop();
return () => _engine.engine.lenis?.start();
}, []);
const run = c => {
if (!c) return;
onClose();
setTimeout(c.run, 120);
};
return /*#__PURE__*/React.createElement("div", {
className: "fixed inset-0 z-[250] flex items-start justify-center bg-black/60 px-4 pt-[16vh] backdrop-blur-md",
onClick: onClose,
style: {
animation: "fade-up .35s both"
}
}, /*#__PURE__*/React.createElement("div", {
className: "glass w-full max-w-xl overflow-hidden rounded-2xl shadow-[0_30px_120px_-20px_rgba(124,92,255,.5)]",
onClick: e => e.stopPropagation(),
onKeyDown: e => {
if (e.key === "Escape") onClose();
if (e.key === "ArrowDown") {
e.preventDefault();
setSel(s => (s + 1) % Math.max(1, list.length));
}
if (e.key === "ArrowUp") {
e.preventDefault();
setSel(s => (s - 1 + list.length) % Math.max(1, list.length));
}
if (e.key === "Enter") run(list[sel]);
}
}, /*#__PURE__*/React.createElement("div", {
className: "flex items-center gap-3 border-b border-white/10 px-5 py-4"
}, /*#__PURE__*/React.createElement("span", {
className: "text-[var(--acid)]"
}, "\u203A"), /*#__PURE__*/React.createElement("input", {
ref: input,
value: q,
onChange: e => {
setQ(e.target.value);
setSel(0);
},
placeholder: placeholder,
className: "w-full bg-transparent text-base text-white outline-none"
}), /*#__PURE__*/React.createElement("span", {
className: "mono text-white/30"
}, "ESC")), /*#__PURE__*/React.createElement("div", {
className: "max-h-[50vh] overflow-y-auto p-2",
"data-lenis-prevent": true
}, list.length === 0 && /*#__PURE__*/React.createElement("div", {
className: "px-4 py-8 text-center text-white/40"
}, emptyText), list.map((c, i) => /*#__PURE__*/React.createElement("button", {
key: c.id,
onMouseEnter: () => setSel(i),
onClick: () => run(c),
className: `flex w-full items-center justify-between rounded-xl px-4 py-3 text-start transition-colors ${i === sel ? "bg-white/10 text-white" : "text-white/60"}`
}, /*#__PURE__*/React.createElement("span", null, c.label), /*#__PURE__*/React.createElement("span", {
className: "mono !text-[10px] text-white/35"
}, c.hint))))));
}
},
"app:components/NeuralOrb":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.SHAPES = void 0;
exports.default = NeuralOrb;
var _react = _req("react");
var _engine = _req("app:lib/engine");
var _useCanvas = _req("app:lib/useCanvas");
var _sound = _req("app:lib/sound");
const N = 256;
const SHAPES = ["Sphere", "Torus", "Helix", "Cube", "Wave"];
exports.SHAPES = SHAPES;
const frac = v => v - Math.floor(v);
function shape(kind, i, t = 0) {
switch (kind) {
case 0:
{
const y = 1 - i / (N - 1) * 2;
const r = Math.sqrt(Math.max(0, 1 - y * y));
const th = i * 2.399963;
return [Math.cos(th) * r, y, Math.sin(th) * r];
}
case 1:
{
const u = frac(i * 0.6180339887) * Math.PI * 2;
const v = frac(i * 0.7548776662) * Math.PI * 2;
const R = 0.72;
const r = 0.32;
return [(R + r * Math.cos(v)) * Math.cos(u) * 1.1, r * Math.sin(v) * 1.1, (R + r * Math.cos(v)) * Math.sin(u) * 1.1];
}
case 2:
{
const k = i >> 1;
const strand = i & 1;
const tt = k / (N / 2 - 1);
const a = tt * Math.PI * 5 + strand * Math.PI;
return [Math.cos(a) * 0.55, (tt - 0.5) * 2.1, Math.sin(a) * 0.55];
}
case 3:
{
const f = i % 6;
const k = Math.floor(i / 6);
const a = (frac(k * 0.7548776662 + 0.5) * 2 - 1) * 0.78;
const b = (frac(k * 0.5698402910 + 0.3) * 2 - 1) * 0.78;
const s = 0.78;
return [[s, a, b], [-s, a, b], [a, s, b], [a, -s, b], [a, b, s], [a, b, -s]][f];
}
default:
{
const ix = i % 16;
const iz = Math.floor(i / 16);
const x = (ix / 15 - 0.5) * 2.1;
const z = (iz / 15 - 0.5) * 2.1;
return [x, Math.sin(x * 3 + t * 1.4) * Math.cos(z * 3 - t) * 0.32, z];
}
}
}
function buildEdges(pts, k) {
const set = new Set();
const edges = [];
for (let i = 0; i < N; i++) {
const d = [];
for (let j = 0; j < N; j++) {
if (i === j) continue;
const dx = pts[i][0] - pts[j][0];
const dy = pts[i][1] - pts[j][1];
const dz = pts[i][2] - pts[j][2];
d.push([dx * dx + dy * dy + dz * dz, j]);
}
d.sort((a, b) => a[0] - b[0]);
for (let n = 0; n < k; n++) {
const j = d[n][1];
const key = Math.min(i, j) * N + Math.max(i, j);
if (!set.has(key)) {
set.add(key);
edges.push([i, j]);
}
}
}
const adj = Array.from({
length: N
}, () => []);
edges.forEach(([a, b]) => {
adj[a].push(b);
adj[b].push(a);
});
return {
edges,
adj
};
}
const sprites = new Map();
function sprite(hex) {
let s = sprites.get(hex);
if (!s) {
s = document.createElement("canvas");
s.width = s.height = 64;
const c = s.getContext("2d");
const [r, g, b] = (0, _engine.hexRgb)(hex);
const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32);
gr.addColorStop(0, `rgba(255,255,255,1)`);
gr.addColorStop(0.15, `rgba(${r},${g},${b},.9)`);
gr.addColorStop(0.5, `rgba(${r},${g},${b},.25)`);
gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
c.fillStyle = gr;
c.fillRect(0, 0, 64, 64);
sprites.set(hex, s);
}
return s;
}
function NeuralOrb({
shapeIdx,
statRef
}) {
const shapeRef = (0, _react.useRef)(shapeIdx);
(0, _react.useEffect)(() => {
shapeRef.current = shapeIdx;
}, [shapeIdx]);
const ref = (0, _useCanvas.useCanvas)(s => {
const pos = Array.from({
length: N
}, (_, i) => shape(0, i));
let tars = pos.map(p => [...p]);
let {
edges,
adj
} = buildEdges(tars, 3);
let curShape = 0;
let edgeFade = 1;
const act = new Float32Array(N);
const fireAt = new Float32Array(N).fill(Infinity);
const proj = new Float32Array(N * 3);
let signals = 0;
let rx = 0.3;
let ry = 0;
let nextAmbient = 1;
let frameN = 0;
let T = 0;
const phase = Array.from({
length: N
}, () => Math.random() * 6.28);
const fire = (i, t, depth) => {
const seen = new Int8Array(N).fill(-1);
let q = [i];
seen[i] = 0;
for (let h = 0; h <= depth; h++) {
const nq = [];
for (const n of q) {
fireAt[n] = Math.min(fireAt[n], t + h * 0.085);
for (const m of adj[n]) {
if (seen[m] < 0) {
seen[m] = h + 1;
nq.push(m);
}
}
}
q = nq;
}
signals++;
};
const layout = () => {
const wide = s.w > 900;
return {
cx: wide ? s.w * 0.64 : s.w / 2,
cy: wide ? s.h * 0.5 : s.h * 0.42,
R: Math.min(s.h * 0.34, wide ? s.w * 0.24 : s.w * 0.36)
};
};
const down = e => {
if (e.target.closest?.("a,button,input,textarea")) return;
const p = (0, _useCanvas.pointerIn)(s.canvas);
if (!p.inside) return;
let best = 0;
let bd = Infinity;
for (let i = 0; i < N; i++) {
const d = (proj[i * 3] - p.x) ** 2 + (proj[i * 3 + 1] - p.y) ** 2;
if (d < bd) {
bd = d;
best = i;
}
}
fire(best, T, 9);
(0, _sound.tick)(300 + Math.random() * 300, 0.25, 0.06);
};
window.addEventListener("pointerdown", down);
const frame = (t, dt) => {
T = t;
const {
ctx
} = s;
const {
cx,
cy,
R
} = layout();
ctx.clearRect(0, 0, s.w, s.h);
if (shapeRef.current !== curShape) {
curShape = shapeRef.current;
tars = Array.from({
length: N
}, (_, i) => shape(curShape, i, 0));
const e = buildEdges(tars, curShape === 4 ? 2 : curShape === 2 ? 3 : 3);
edges = e.edges;
adj = e.adj;
edgeFade = 0;
fire(Math.floor(Math.random() * N), t, 8);
}
edgeFade = Math.min(1, edgeFade + dt * 0.9);
for (let i = 0; i < N; i++) {
const tg = curShape === 4 ? shape(4, i, t) : tars[i];
const k = 1 - Math.exp(-dt * (2.2 + i % 9 * 0.35));
pos[i][0] = (0, _engine.lerp)(pos[i][0], tg[0], k);
pos[i][1] = (0, _engine.lerp)(pos[i][1], tg[1], k);
pos[i][2] = (0, _engine.lerp)(pos[i][2], tg[2], k);
}
const p = (0, _useCanvas.pointerIn)(s.canvas);
const nx = Math.max(-1, Math.min(1, (p.x - cx) / s.w));
const ny = Math.max(-1, Math.min(1, (p.y - cy) / s.h));
ry += dt * (0.22 + (_engine.engine.overdrive ? 1.5 : 0)) + _engine.engine.velocity * 0.0016;
const trx = 0.25 + ny * 0.5;
rx = (0, _engine.lerp)(rx, trx, 1 - Math.exp(-dt * 3));
const ryOff = nx * 0.9;
const cyr = Math.cos(ry + ryOff);
const syr = Math.sin(ry + ryOff);
const cxr = Math.cos(rx);
const sxr = Math.sin(rx);
const project = (x, y, z, out, i) => {
const x1 = x * cyr + z * syr;
const z1 = -x * syr + z * cyr;
const y2 = y * cxr - z1 * sxr;
const z2 = y * sxr + z1 * cxr;
const f = 1 / (1 - z2 * 0.28);
const px = cx + x1 * R * f;
const py = cy + y2 * R * f;
if (out) {
out[i * 3] = px;
out[i * 3 + 1] = py;
out[i * 3 + 2] = z2;
}
return [px, py, z2, f];
};
for (let i = 0; i < N; i++) project(pos[i][0], pos[i][1], pos[i][2], proj, i);
if (t > nextAmbient) {
fire(Math.floor(Math.random() * N), t, 4);
nextAmbient = t + 0.7 + Math.random() * 1.2;
}
for (let i = 0; i < N; i++) {
if (t >= fireAt[i]) {
act[i] = 1;
fireAt[i] = Infinity;
}
act[i] *= Math.exp(-dt * 2.2);
}
const pal = _engine.engine.pal;
const cols = [pal.c1, pal.c2, pal.c3];
const rgb = cols.map(_engine.hexRgb);
ctx.globalCompositeOperation = "lighter";
const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.5);
halo.addColorStop(0, `rgba(${rgb[0].join(",")},.16)`);
halo.addColorStop(0.55, `rgba(${rgb[1].join(",")},.05)`);
halo.addColorStop(1, "rgba(0,0,0,0)");
ctx.fillStyle = halo;
ctx.fillRect(0, 0, s.w, s.h);
ctx.save();
ctx.translate(cx, cy);
ctx.rotate(-t * 0.08);
const rr = R * 1.62;
for (let i = 0; i < 90; i++) {
const a = i / 90 * Math.PI * 2;
const long = i % 5 === 0;
ctx.strokeStyle = `rgba(255,255,255,${long ? 0.28 : 0.1})`;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
ctx.lineTo(Math.cos(a) * (rr + (long ? 10 : 5)), Math.sin(a) * (rr + (long ? 10 : 5)));
ctx.stroke();
}
ctx.restore();
ctx.beginPath();
ctx.arc(cx, cy, R * 1.5, 0, Math.PI * 2);
ctx.strokeStyle = "rgba(255,255,255,.07)";
ctx.stroke();
for (let k = 0; k < 3; k++) {
const tilt = (k - 1) * 0.9 + 0.3;
const ct = Math.cos(tilt);
const st = Math.sin(tilt);
ctx.beginPath();
ctx.setLineDash([2, 7]);
for (let i = 0; i <= 96; i++) {
const a = i / 96 * Math.PI * 2;
const x = Math.cos(a) * 1.3;
const z0 = Math.sin(a) * 1.3;
const y = z0 * st;
const z = z0 * ct;
const [px, py] = project(x, y, z, null, 0);
if (i === 0) ctx.moveTo(px, py);else ctx.lineTo(px, py);
}
ctx.strokeStyle = `rgba(${rgb[k][0]},${rgb[k][1]},${rgb[k][2]},.35)`;
ctx.stroke();
ctx.setLineDash([]);
const a = t * (0.5 + k * 0.23) + k * 2;
const [sx, sy] = project(Math.cos(a) * 1.3, Math.sin(a) * 1.3 * st, Math.sin(a) * 1.3 * ct, null, 0);
const sp = sprite(cols[k]);
ctx.drawImage(sp, sx - 14, sy - 14, 28, 28);
}
ctx.lineWidth = 1;
ctx.beginPath();
for (const [a, b] of edges) {
ctx.moveTo(proj[a * 3], proj[a * 3 + 1]);
ctx.lineTo(proj[b * 3], proj[b * 3 + 1]);
}
ctx.strokeStyle = `rgba(${rgb[1].join(",")},${0.13 * edgeFade})`;
ctx.stroke();
for (const [a, b] of edges) {
const e = Math.max(act[a], act[b]);
if (e < 0.05) continue;
ctx.strokeStyle = `rgba(255,255,255,${e * 0.8 * edgeFade})`;
ctx.lineWidth = 0.8 + e * 1.4;
ctx.beginPath();
ctx.moveTo(proj[a * 3], proj[a * 3 + 1]);
ctx.lineTo(proj[b * 3], proj[b * 3 + 1]);
ctx.stroke();
}
const acid = sprite(pal.acid);
for (let i = 0; i < N; i++) {
const z = proj[i * 3 + 2];
const depth = (z + 1.2) / 2.4;
const col = rgb[i % 3];
const size = 1.1 + depth * 1.9 + Math.sin(t * 2 + phase[i]) * 0.2;
const x = proj[i * 3];
const y = proj[i * 3 + 1];
ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${0.3 + depth * 0.7})`;
ctx.beginPath();
ctx.arc(x, y, size, 0, Math.PI * 2);
ctx.fill();
if (act[i] > 0.06) {
const g = 14 + act[i] * 46;
ctx.globalAlpha = Math.min(1, act[i] * 1.2);
ctx.drawImage(acid, x - g / 2, y - g / 2, g, g);
ctx.globalAlpha = 1;
}
}
ctx.globalCompositeOperation = "source-over";
frameN++;
if (frameN % 8 === 0 && statRef.current) {
let live = 0;
for (let i = 0; i < N; i++) if (act[i] > 0.15) live++;
statRef.current.textContent = `${String(signals).padStart(3, "0")} sig · ${String(live).padStart(3, "0")} live`;
}
};
return {
frame,
cleanup: () => window.removeEventListener("pointerdown", down)
};
}, []);
return /*#__PURE__*/React.createElement("canvas", {
ref: ref,
className: "absolute inset-0 h-full w-full"
});
}
},
"app:components/Hero":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = Hero;
var _react = _req("react");
var _data = _req("app:data");
var _engine = _req("app:lib/engine");
var _NeuralOrb = _interopRequireDefault(_req("app:components/NeuralOrb"));
var _ui = _req("app:components/ui");
var _sound = _req("app:lib/sound");
var _i18n = _req("app:lib/i18n");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ProximityText({
text,
ready,
delay = 0,
fill = true,
className = "",
isPersian = false
}) {
const refs = (0, _react.useRef)([]);
(0, _react.useEffect)(() => {
const off = (0, _engine.onFrame)(t => {
refs.current.forEach((el, i) => {
if (!el) return;
let prox;
if (_engine.engine.touch) prox = 0.5 + 0.5 * Math.sin(t * 1.6 + i * 0.7 + delay);else {
const r = el.getBoundingClientRect();
const d = Math.hypot(_engine.engine.sx - (r.left + r.width / 2), _engine.engine.sy - (r.top + r.height / 2));
prox = (0, _engine.clamp)(1 - d / Math.max(160, r.height * 1.5));
prox = prox * prox * (3 - 2 * prox);
}
el.style.fontVariationSettings = `"wdth" ${(0, _engine.lerp)(78, 100, prox).toFixed(1)}, "wght" ${(0, _engine.lerp)(330, 820, prox).toFixed(0)}`;
el.style.fontWeight = `${Math.round((0, _engine.lerp)(350, 850, prox))}`;
if (fill) el.style.color = `rgba(255,255,255,${(0.05 + prox * 0.95).toFixed(2)})`;else el.style.textShadow = `0 0 ${prox * 40}px color-mix(in srgb, var(--c2) ${prox * 100}%, transparent)`;
});
});
return off;
}, [fill, delay, isPersian]);
if (isPersian) {
return /*#__PURE__*/React.createElement("span", {
className: `inline-flex ${className}`,
"aria-label": text
}, /*#__PURE__*/React.createElement("span", {
className: "inline-block overflow-hidden pb-[.12em] -mb-[.12em]"
}, /*#__PURE__*/React.createElement("span", {
className: "inline-block",
style: ready ? {
animation: `rise 1.4s cubic-bezier(.2,.8,.2,1) ${delay}ms both`
} : {
transform: "translateY(115%)"
}
}, /*#__PURE__*/React.createElement("span", {
ref: el => {
refs.current[0] = el;
},
className: `inline-block ${fill ? "outline-text" : ""}`,
style: {
fontVariationSettings: '"wdth" 90, "wght" 700'
}
}, text))));
}
return /*#__PURE__*/React.createElement("span", {
className: `inline-flex ${className}`,
"aria-label": text
}, text.split("").map((c, i) => /*#__PURE__*/React.createElement("span", {
key: i,
className: "inline-block overflow-hidden pb-[.06em] -mb-[.06em]",
"aria-hidden": true
}, /*#__PURE__*/React.createElement("span", {
className: "inline-block",
style: ready ? {
animation: `rise 1.4s cubic-bezier(.2,.8,.2,1) ${delay + i * 70}ms both`
} : {
transform: "translateY(115%)"
}
}, /*#__PURE__*/React.createElement("span", {
ref: el => {
refs.current[i] = el;
},
className: `inline-block ${fill ? "outline-text" : ""}`,
style: {
fontVariationSettings: '"wdth" 78, "wght" 330'
}
}, c)))));
}
function Hero({
ready
}) {
const {
lang,
isRtl
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
const [shape, setShape] = (0, _react.useState)(0);
const stat = (0, _react.useRef)(null);
const parallax = (0, _react.useRef)(null);
(0, _react.useEffect)(() => {
const off = (0, _engine.onFrame)(() => {
const el = parallax.current;
if (!el) return;
const y = _engine.engine.scroll;
el.style.transform = `translate3d(0,${y * 0.25}px,0)`;
el.style.opacity = String((0, _engine.clamp)(1 - y / (window.innerHeight * 0.9)));
});
return off;
}, []);
const fade = delayMs => ({
opacity: ready ? 1 : 0,
transform: ready ? "none" : "translateY(30px)",
transition: `all 1.2s ${delayMs}ms cubic-bezier(.2,.8,.2,1)`
});
return /*#__PURE__*/React.createElement("section", {
id: "hero",
className: "relative min-h-[100svh] overflow-hidden"
}, /*#__PURE__*/React.createElement("div", {
className: "absolute inset-0",
style: {
opacity: ready ? 1 : 0,
transition: "opacity 2.4s .4s"
}
}, /*#__PURE__*/React.createElement(_NeuralOrb.default, {
shapeIdx: shape,
statRef: stat
})), /*#__PURE__*/React.createElement("div", {
ref: parallax,
className: "relative z-10 flex min-h-[100svh] flex-col justify-between px-5 pb-20 pt-28 md:px-10 lg:ps-28"
}, /*#__PURE__*/React.createElement("div", {
style: fade(900),
className: "mono flex flex-wrap items-center gap-x-6 gap-y-2 text-white/60"
}, /*#__PURE__*/React.createElement("span", {
className: "flex items-center gap-2"
}, /*#__PURE__*/React.createElement("span", {
className: "pulse-dot h-2 w-2 rounded-full bg-[var(--acid)]"
}), d.hero.status), /*#__PURE__*/React.createElement("span", {
className: "hidden text-white/30 sm:inline"
}, "/"), /*#__PURE__*/React.createElement("span", {
className: "hidden sm:inline"
}, d.hero.substatus)), /*#__PURE__*/React.createElement("div", {
className: `my-10 select-none font-display ${isRtl ? "leading-[1.05] tracking-normal" : "leading-[.82] tracking-[-0.045em]"} text-white`
}, /*#__PURE__*/React.createElement("div", {
className: isRtl ? "text-[clamp(4.5rem,17vw,15rem)]" : "text-[clamp(6rem,24vw,22rem)]"
}, /*#__PURE__*/React.createElement(ProximityText, {
text: d.hero.firstName,
ready: ready,
delay: 500,
fill: false,
isPersian: isRtl
})), /*#__PURE__*/React.createElement("div", {
className: isRtl ? "mt-2 text-[clamp(3.5rem,13vw,12rem)]" : "-mt-[.02em] text-[clamp(3.6rem,15.6vw,15rem)]"
}, /*#__PURE__*/React.createElement(ProximityText, {
text: d.hero.lastName,
ready: ready,
delay: 750,
fill: true,
isPersian: isRtl
}))), /*#__PURE__*/React.createElement("div", {
className: "grid items-end gap-10 lg:grid-cols-[1fr_auto]"
}, /*#__PURE__*/React.createElement("div", {
className: "max-w-xl",
style: fade(1500)
}, /*#__PURE__*/React.createElement("p", {
className: "text-xl font-light leading-relaxed text-white/80 md:text-2xl"
}, d.hero.leadPrefix, /*#__PURE__*/React.createElement(_ui.ScrambleText, {
phrases: d.roles,
className: "serif text-grad whitespace-nowrap text-[1.12em]"
}), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
className: "text-white/50"
}, d.hero.leadSuffix)), /*#__PURE__*/React.createElement("div", {
className: "mt-8 flex flex-wrap items-center gap-4"
}, /*#__PURE__*/React.createElement(_ui.Magnetic, null, /*#__PURE__*/React.createElement("button", {
className: "btn btn-solid",
onClick: () => (0, _engine.scrollToId)("works"),
"data-cursor": d.hero.cursorView
}, d.hero.ctaPrimary, " ", /*#__PURE__*/React.createElement("span", null, "\u2193"))), /*#__PURE__*/React.createElement(_ui.Magnetic, null, /*#__PURE__*/React.createElement("button", {
className: "btn",
onClick: () => (0, _engine.scrollToId)("ask")
}, d.hero.ctaSecondary)))), /*#__PURE__*/React.createElement("div", {
style: fade(1700),
className: "glass w-full rounded-2xl p-4 lg:w-[300px]"
}, /*#__PURE__*/React.createElement("div", {
className: "mono mb-3 flex items-center justify-between !text-[10px] text-white/50"
}, /*#__PURE__*/React.createElement("span", null, d.hero.orbHeader), /*#__PURE__*/React.createElement("span", {
ref: stat,
dir: "ltr",
className: "text-[var(--acid)]"
}, "000 sig \xB7 000 live")), /*#__PURE__*/React.createElement("div", {
className: "flex flex-wrap gap-1.5"
}, d.hero.shapes.map((s, i) => /*#__PURE__*/React.createElement("button", {
key: s,
"data-on": shape === i,
className: "chip",
onClick: () => {
setShape(i);
(0, _sound.tick)(500 + i * 120, 0.15, 0.05);
}
}, s))), /*#__PURE__*/React.createElement("div", {
className: "mono mt-3 !text-[10px] normal-case !tracking-[.04em] text-white/35"
}, d.hero.orbHint)))), /*#__PURE__*/React.createElement("div", {
className: "absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex",
style: fade(2000)
}, /*#__PURE__*/React.createElement("span", {
className: "mono !text-[10px] text-white/40"
}, d.hero.scroll), /*#__PURE__*/React.createElement("span", {
className: "relative block h-10 w-px overflow-hidden bg-white/15"
}, /*#__PURE__*/React.createElement("span", {
className: "absolute inset-x-0 top-0 h-1/2 bg-[var(--acid)]",
style: {
animation: "cue 1.8s ease-in-out infinite"
}
}))));
}
},
"app:components/Manifesto":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = Manifesto;
var _react = _req("react");
var _data = _req("app:data");
var _engine = _req("app:lib/engine");
var _ui = _req("app:components/ui");
var _i18n = _req("app:lib/i18n");
function Manifesto() {
const {
lang,
isRtl
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
const sec = (0, _react.useRef)(null);
const words = (0, _react.useRef)([]);
const stats = (0, _react.useRef)(null);
const parts = d.manifesto.text.split(" ");
(0, _react.useEffect)(() => {
words.current = words.current.slice(0, parts.length);
const off = (0, _engine.onFrame)(() => {
const el = sec.current;
if (!el) return;
const r = el.getBoundingClientRect();
const p = (0, _engine.clamp)(-r.top / (r.height - window.innerHeight));
const pos = p * 1.18 * (parts.length + 3);
words.current.forEach((w, i) => {
if (!w) return;
const t = (0, _engine.clamp)((pos - i) / 3);
w.style.opacity = String(0.08 + t * 0.92);
w.style.filter = t < 1 ? `blur(${((1 - t) * 8).toFixed(1)}px)` : "none";
w.style.transform = `translateY(${((1 - t) * 14).toFixed(1)}px)`;
});
if (stats.current) {
const s = (0, _engine.clamp)((p - 0.78) / 0.15);
stats.current.style.opacity = String(s);
stats.current.style.transform = `translateY(${(1 - s) * 30}px)`;
}
void _engine.engine;
});
return off;
}, [parts.length, lang]);
return /*#__PURE__*/React.createElement("section", {
id: "manifesto",
ref: sec,
className: "relative",
style: {
height: "280vh"
}
}, /*#__PURE__*/React.createElement("div", {
className: "sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-5 md:px-10 lg:ps-28"
}, /*#__PURE__*/React.createElement(_ui.Reveal, null, /*#__PURE__*/React.createElement("div", {
className: "mono mb-10 flex items-center gap-4 text-white/50"
}, /*#__PURE__*/React.createElement("span", {
className: "text-[var(--acid)]"
}, (0, _i18n.toPersianDigits)("01", lang)), /*#__PURE__*/React.createElement("span", {
className: "h-px w-16 bg-white/25"
}), /*#__PURE__*/React.createElement("span", null, d.manifesto.label))), /*#__PURE__*/React.createElement("p", {
className: `max-w-[26ch] font-display text-[clamp(1.75rem,4.5vw,4.8rem)] font-medium ${isRtl ? "leading-[1.35] tracking-normal" : "leading-[1.04] tracking-[-0.035em]"} md:max-w-[28ch]`
}, parts.map((w, i) => {
const em = w.startsWith("*") && (w.endsWith("*") || w.endsWith("*."));
const word = w.replace(/\*/g, "");
return /*#__PURE__*/React.createElement("span", {
key: `${lang}-${i}`,
ref: el => {
words.current[i] = el;
},
className: `me-[.24em] inline-block will-change-[opacity,filter] ${em ? "serif text-grad px-[.06em]" : ""}`
}, word);
})), /*#__PURE__*/React.createElement("div", {
ref: stats,
className: "mt-14 grid max-w-3xl grid-cols-2 gap-6 opacity-0 md:grid-cols-4"
}, d.manifesto.stats.map(s => /*#__PURE__*/React.createElement("div", {
key: s.v,
className: "border-t border-white/15 pt-4"
}, /*#__PURE__*/React.createElement("div", {
className: "font-display text-4xl font-semibold tracking-tight md:text-5xl"
}, s.k), /*#__PURE__*/React.createElement("div", {
className: "mono mt-2 !text-[11px] text-white/45"
}, s.v))))));
}
},
"app:components/Capabilities":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = Capabilities;
var _react = _req("react");
var _data = _req("app:data");
var _ui = _req("app:components/ui");
var _sound = _req("app:lib/sound");
var _i18n = _req("app:lib/i18n");
function Capabilities() {
const {
lang,
isRtl
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
const [open, setOpen] = (0, _react.useState)(0);
return /*#__PURE__*/React.createElement("section", {
id: "capabilities",
className: "relative px-5 py-32 md:px-10 md:py-48 lg:ps-28"
}, /*#__PURE__*/React.createElement(_ui.SectionHead, {
n: "02",
label: d.capabilities.label,
title: d.capabilities.title,
kicker: d.capabilities.kicker
}), /*#__PURE__*/React.createElement("div", {
className: "border-t border-white/10"
}, d.services.map((s, i) => {
const on = open === i;
return /*#__PURE__*/React.createElement(_ui.Reveal, {
key: s.n,
delay: i * 70
}, /*#__PURE__*/React.createElement("div", {
"data-hover": true,
onPointerEnter: () => {
if (open !== i) (0, _sound.tick)(700 + i * 90, 0.08, 0.03);
setOpen(i);
},
onClick: () => setOpen(i),
onPointerMove: e => {
const r = e.currentTarget.getBoundingClientRect();
e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
},
className: "group relative cursor-pointer border-b border-white/10",
style: {
background: on ? "radial-gradient(520px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--c1) 22%, transparent), transparent 65%)" : "transparent",
transition: "background .5s"
}
}, /*#__PURE__*/React.createElement("div", {
className: "flex items-center gap-4 py-6 md:gap-10 md:py-9"
}, /*#__PURE__*/React.createElement("span", {
className: "mono w-10 text-[var(--acid)] md:w-16"
}, (0, _i18n.toPersianDigits)(s.n, lang)), /*#__PURE__*/React.createElement("h3", {
className: `flex-1 font-display text-[clamp(1.8rem,5vw,4.8rem)] font-semibold leading-tight tracking-[-0.03em] transition-all duration-700 ${on ? isRtl ? "-translate-x-3 md:-translate-x-8" : "translate-x-3 md:translate-x-8" : "text-white/35"}`,
style: {
fontVariationSettings: on ? '"wdth" 100' : '"wdth" 80'
}
}, s.title), /*#__PURE__*/React.createElement("span", {
className: `grid h-12 w-12 shrink-0 place-items-center rounded-full border text-xl transition-all duration-500 md:h-16 md:w-16 ${on ? "rotate-45 border-[var(--acid)] bg-[var(--acid)] text-black" : "border-white/20"}`
}, "+")), /*#__PURE__*/React.createElement("div", {
className: "grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.2,.8,.2,1)]",
style: {
gridTemplateRows: on ? "1fr" : "0fr"
}
}, /*#__PURE__*/React.createElement("div", {
className: "overflow-hidden"
}, /*#__PURE__*/React.createElement("div", {
className: "grid gap-6 pb-10 ps-14 md:grid-cols-[1.4fr_1fr] md:ps-[6.5rem] md:pe-24"
}, /*#__PURE__*/React.createElement("p", {
className: "max-w-xl text-lg leading-relaxed text-white/65"
}, s.text), /*#__PURE__*/React.createElement("div", {
className: "flex flex-wrap content-start gap-2"
}, s.tags.map((t, k) => /*#__PURE__*/React.createElement("span", {
key: t,
className: "chip",
style: {
transitionDelay: `${k * 60}ms`,
opacity: on ? 1 : 0,
transform: on ? "none" : "translateY(10px)",
transition: "all .6s"
}
}, t))))))));
})));
}
},
"app:components/GenArt":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = GenArt;
var _engine = _req("app:lib/engine");
var _useCanvas = _req("app:lib/useCanvas");
const TAU = Math.PI * 2;
const C = (h, a) => {
const [r, g, b] = (0, _engine.hexRgb)(h);
return `rgba(${r},${g},${b},${a})`;
};
function GenArt({
kind,
className = ""
}) {
const ref = (0, _useCanvas.useCanvas)(s => {
const {
ctx
} = s;
const rnd = Math.random;
if (kind === "flow") {
const P = Array.from({
length: 520
}, () => ({
x: rnd() * s.w,
y: rnd() * s.h,
px: 0,
py: 0,
k: rnd() * 3 | 0,
sp: 0.6 + rnd() * 1.4
}));
return {
frame(t) {
const m = (0, _useCanvas.pointerIn)(s.canvas);
ctx.fillStyle = "rgba(7,8,13,.09)";
ctx.fillRect(0, 0, s.w, s.h);
const cols = [_engine.engine.pal.c1, _engine.engine.pal.c2, _engine.engine.pal.c3];
ctx.lineWidth = 1.2;
for (const p of P) {
let a = (Math.sin(p.x * 0.004 + t * 0.3) + Math.cos(p.y * 0.005 - t * 0.2) + Math.sin((p.x + p.y) * 0.002 + t * 0.1)) * 1.7;
if (m.inside) {
const dx = p.x - m.x;
const dy = p.y - m.y;
const d = Math.hypot(dx, dy);
if (d < 220) a += (1 - d / 220) * 5 * Math.atan2(dy, dx);
}
p.px = p.x;
p.py = p.y;
p.x += Math.cos(a) * p.sp * 1.6;
p.y += Math.sin(a) * p.sp * 1.6;
if (p.x < 0 || p.x > s.w || p.y < 0 || p.y > s.h) {
p.x = rnd() * s.w;
p.y = rnd() * s.h;
p.px = p.x;
p.py = p.y;
}
ctx.strokeStyle = C(cols[p.k], 0.75);
ctx.beginPath();
ctx.moveTo(p.px, p.py);
ctx.lineTo(p.x, p.y);
ctx.stroke();
}
}
};
}
if (kind === "wave") {
const bars = 74;
return {
frame(t) {
const m = (0, _useCanvas.pointerIn)(s.canvas);
ctx.clearRect(0, 0, s.w, s.h);
const bw = s.w / bars;
for (let i = 0; i < bars; i++) {
const x = (i + 0.5) * bw;
const env = (Math.sin(i * 0.2 + t * 1.6) * 0.5 + 0.5) * (Math.sin(i * 0.065 - t * 0.9) * 0.5 + 0.5) * (0.6 + 0.4 * Math.sin(t * 3.1 + i));
const bump = m.inside ? Math.exp(-(((x - m.x) / 110) ** 2)) * 0.7 : 0;
const h = (0.05 + env * 0.55 + bump) * s.h * 0.62;
const g = ctx.createLinearGradient(0, s.h * 0.45 - h, 0, s.h * 0.45 + h);
g.addColorStop(0, C(_engine.engine.pal.c2, 0.95));
g.addColorStop(0.5, C(_engine.engine.pal.c1, 0.95));
g.addColorStop(1, C(_engine.engine.pal.c3, 0.95));
ctx.fillStyle = g;
ctx.beginPath();
ctx.roundRect(x - bw * 0.3, s.h * 0.45 - h, bw * 0.6, h * 2, bw * 0.3);
ctx.fill();
}
ctx.fillStyle = C(_engine.engine.pal.acid, 0.9);
const sx = t * 120 % (s.w + 100) - 50;
ctx.fillRect(sx, 0, 1, s.h);
}
};
}
if (kind === "grid") {
const cols = 46;
const rows = 28;
return {
frame(t) {
const m = (0, _useCanvas.pointerIn)(s.canvas);
const mx = m.inside ? m.x : s.w * 0.5 + Math.cos(t * 0.6) * s.w * 0.25;
const my = m.inside ? m.y : s.h * 0.4 + Math.sin(t * 0.8) * s.h * 0.2;
ctx.clearRect(0, 0, s.w, s.h);
for (let j = 0; j < rows; j++) {
ctx.beginPath();
for (let i = 0; i < cols; i++) {
const bx = i / (cols - 1) * s.w;
const by = j / (rows - 1) * s.h;
const d = Math.hypot(bx - mx, by - my);
const amp = Math.exp(-d / 230) * 26 * Math.sin(d * 0.04 - t * 4);
const y = by + amp;
if (i === 0) ctx.moveTo(bx, y);else ctx.lineTo(bx, y);
if (j % 1 === 0) {
ctx.fillStyle = C(j % 2 ? _engine.engine.pal.c2 : _engine.engine.pal.c3, 0.35 + Math.min(0.65, Math.abs(amp) / 24));
ctx.fillRect(bx - 1, y - 1, 2.2 + Math.abs(amp) * 0.07, 2.2 + Math.abs(amp) * 0.07);
}
}
ctx.strokeStyle = C(_engine.engine.pal.c1, 0.14);
ctx.stroke();
}
}
};
}
if (kind === "mesh") {
const nodes = Array.from({
length: 52
}, () => ({
x: rnd() * s.w,
y: rnd() * s.h,
vx: (rnd() - 0.5) * 0.5,
vy: (rnd() - 0.5) * 0.5
}));
const packets = [];
return {
frame() {
const m = (0, _useCanvas.pointerIn)(s.canvas);
ctx.clearRect(0, 0, s.w, s.h);
for (const n of nodes) {
if (m.inside) {
const dx = m.x - n.x;
const dy = m.y - n.y;
const d = Math.hypot(dx, dy);
if (d < 240) {
n.vx += dx / d * 0.012;
n.vy += dy / d * 0.012;
}
}
n.vx *= 0.995;
n.vy *= 0.995;
n.x += n.vx;
n.y += n.vy;
if (n.x < 0 || n.x > s.w) n.vx *= -1;
if (n.y < 0 || n.y > s.h) n.vy *= -1;
}
const links = [];
ctx.lineWidth = 1;
for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
if (d < 150) {
ctx.strokeStyle = C(_engine.engine.pal.c2, (1 - d / 150) * 0.4);
ctx.beginPath();
ctx.moveTo(nodes[i].x, nodes[i].y);
ctx.lineTo(nodes[j].x, nodes[j].y);
ctx.stroke();
links.push([i, j]);
}
}
if (links.length && rnd() < 0.2) {
const [a, b] = links[rnd() * links.length | 0];
packets.push({
a,
b,
t: 0
});
}
for (let k = packets.length - 1; k >= 0; k--) {
const p = packets[k];
p.t += 0.03;
if (p.t >= 1) {
packets.splice(k, 1);
continue;
}
const x = nodes[p.a].x + (nodes[p.b].x - nodes[p.a].x) * p.t;
const y = nodes[p.a].y + (nodes[p.b].y - nodes[p.a].y) * p.t;
ctx.fillStyle = C(_engine.engine.pal.acid, 1);
ctx.shadowColor = _engine.engine.pal.acid;
ctx.shadowBlur = 12;
ctx.beginPath();
ctx.arc(x, y, 2.4, 0, TAU);
ctx.fill();
ctx.shadowBlur = 0;
}
for (let i = 0; i < nodes.length; i++) {
ctx.fillStyle = C(i % 3 ? _engine.engine.pal.c1 : _engine.engine.pal.c3, 0.95);
ctx.beginPath();
ctx.arc(nodes[i].x, nodes[i].y, 2.8, 0, TAU);
ctx.fill();
}
}
};
}
let tilt = 0.4;
return {
frame(t) {
const m = (0, _useCanvas.pointerIn)(s.canvas);
ctx.clearRect(0, 0, s.w, s.h);
const cx = s.w * 0.5;
const cy = s.h * 0.45;
const base = Math.min(s.w, s.h) * 0.065;
const target = m.inside ? 0.2 + m.y / s.h * 0.8 : 0.45 + Math.sin(t * 0.4) * 0.1;
tilt += (target - tilt) * 0.06;
const rot = m.inside ? (m.x / s.w - 0.5) * 1.2 : t * 0.1;
const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 2.6);
g.addColorStop(0, C(_engine.engine.pal.acid, 0.95));
g.addColorStop(0.3, C(_engine.engine.pal.c3, 0.5));
g.addColorStop(1, C(_engine.engine.pal.c1, 0));
ctx.fillStyle = g;
ctx.fillRect(0, 0, s.w, s.h);
for (let k = 0; k < 8; k++) {
const r = base * (k + 2.2);
ctx.strokeStyle = C(k % 2 ? _engine.engine.pal.c2 : _engine.engine.pal.c1, 0.35);
ctx.lineWidth = 1;
ctx.beginPath();
ctx.ellipse(cx, cy, r, r * tilt, rot + k * 0.12, 0, TAU);
ctx.stroke();
const a = t * (0.9 - k * 0.07) + k;
const px = Math.cos(a) * r;
const py = Math.sin(a) * r * tilt;
const cr = Math.cos(rot + k * 0.12);
const sr = Math.sin(rot + k * 0.12);
ctx.fillStyle = C(k % 3 ? _engine.engine.pal.c2 : _engine.engine.pal.c3, 1);
ctx.beginPath();
ctx.arc(cx + px * cr - py * sr, cy + px * sr + py * cr, 3 + k % 3, 0, TAU);
ctx.fill();
}
}
};
}, [kind]);
return /*#__PURE__*/React.createElement("canvas", {
ref: ref,
className: `absolute inset-0 h-full w-full ${className}`
});
}
},
});