window.__MODULES__=Object.assign(window.__MODULES__||{},{"app:components/Works":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = Works;
var _react = _req("react");
var _data = _req("app:data");
var _engine = _req("app:lib/engine");
var _GenArt = _interopRequireDefault(_req("app:components/GenArt"));
var _ui = _req("app:components/ui");
var _i18n = _req("app:lib/i18n");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function Works() {
const {
lang,
isRtl
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
const projects = d.projects;
const sec = (0, _react.useRef)(null);
const track = (0, _react.useRef)(null);
const bar = (0, _react.useRef)(null);
const [height, setHeight] = (0, _react.useState)("400vh");
const [idx, setIdx] = (0, _react.useState)(0);
(0, _react.useEffect)(() => {
const measure = () => {
const t = track.current;
if (!t) return;
setHeight(`${t.scrollWidth - window.innerWidth + window.innerHeight}px`);
};
measure();
const ro = new ResizeObserver(measure);
ro.observe(track.current);
window.addEventListener("resize", measure);
let cur = 0;
const off = (0, _engine.onFrame)(() => {
const el = sec.current;
const t = track.current;
if (!el || !t) return;
const r = el.getBoundingClientRect();
const p = (0, _engine.clamp)(-r.top / Math.max(1, r.height - window.innerHeight));
const max = t.scrollWidth - window.innerWidth;
const shift = isRtl ? p * max : -p * max;
t.style.transform = `translate3d(${shift}px,0,0) skewX(${(0, _engine.clamp)(_engine.engine.velocity * -0.18, -6, 6)}deg)`;
if (bar.current) bar.current.style.transform = `scaleX(${p})`;
const n = Math.min(projects.length - 1, Math.round(p * projects.length - 0.5 + 0.0001));
if (n !== cur) {
cur = Math.max(0, n);
setIdx(cur);
}
});
return () => {
off();
ro.disconnect();
window.removeEventListener("resize", measure);
};
}, [isRtl, projects.length]);
const tilt = e => {
const el = e.currentTarget;
const r = el.getBoundingClientRect();
const x = (e.clientX - r.left) / r.width - 0.5;
const y = (e.clientY - r.top) / r.height - 0.5;
el.style.transition = "transform .1s";
el.style.transform = `perspective(1400px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(0)`;
};
const untilt = e => {
e.currentTarget.style.transition = "transform .8s cubic-bezier(.2,.8,.2,1)";
e.currentTarget.style.transform = "none";
};
return /*#__PURE__*/React.createElement("section", {
id: "works",
ref: sec,
className: "relative",
style: {
height
}
}, /*#__PURE__*/React.createElement("div", {
className: "sticky top-0 flex h-screen flex-col overflow-hidden pb-8 pt-20 md:pt-24"
}, /*#__PURE__*/React.createElement("div", {
className: "flex items-end justify-between px-5 md:px-10 lg:ps-28"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_ui.Reveal, null, /*#__PURE__*/React.createElement("div", {
className: "mono flex items-center gap-4 text-white/50"
}, /*#__PURE__*/React.createElement("span", {
className: "text-[var(--acid)]"
}, (0, _i18n.toPersianDigits)("03", lang)), /*#__PURE__*/React.createElement("span", {
className: "h-px w-16 bg-white/25"
}), /*#__PURE__*/React.createElement("span", null, d.works.label))), /*#__PURE__*/React.createElement(_ui.SplitHeading, {
text: d.works.title,
className: "mt-3 font-display text-[clamp(2rem,4.8vw,4.4rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
})), /*#__PURE__*/React.createElement("div", {
className: "text-end",
dir: "ltr"
}, /*#__PURE__*/React.createElement("div", {
className: "font-display text-5xl font-light tabular-nums md:text-7xl"
}, /*#__PURE__*/React.createElement("span", {
className: "text-white"
}, (0, _i18n.toPersianDigits)(String(idx + 1).padStart(2, "0"), lang)), /*#__PURE__*/React.createElement("span", {
className: "text-white/25"
}, " / ", (0, _i18n.toPersianDigits)(String(projects.length).padStart(2, "0"), lang))))), /*#__PURE__*/React.createElement("div", {
className: "mx-5 mt-4 h-px bg-white/10 md:mx-10 lg:ms-28"
}, /*#__PURE__*/React.createElement("div", {
ref: bar,
className: `h-full ${isRtl ? "origin-right" : "origin-left"} bg-[var(--acid)]`,
style: {
transform: "scaleX(0)"
}
})), /*#__PURE__*/React.createElement("div", {
className: "relative flex flex-1 items-center"
}, /*#__PURE__*/React.createElement("div", {
ref: track,
className: "flex w-max items-stretch gap-5 px-5 will-change-transform md:gap-8 md:px-10 lg:ps-28 lg:pe-[10vw]",
style: {
height: "min(64vh, 640px)"
}
}, projects.map(p => /*#__PURE__*/React.createElement("article", {
key: p.n,
onPointerMove: tilt,
onPointerLeave: untilt,
"data-cursor": d.works.cursorPlay,
className: "group relative w-[84vw] shrink-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#07080d] sm:w-[72vw] lg:w-[min(62vw,980px)]"
}, /*#__PURE__*/React.createElement(_GenArt.default, {
kind: p.kind
}), /*#__PURE__*/React.createElement("div", {
className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05060a] via-[#05060a]/55 to-transparent"
}), /*#__PURE__*/React.createElement("div", {
className: "pointer-events-none absolute inset-0 rounded-[28px] opacity-0 shadow-[inset_0_0_0_1px_var(--acid)] transition-opacity duration-500 group-hover:opacity-60"
}), /*#__PURE__*/React.createElement("div", {
className: "pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5 md:p-8"
}, /*#__PURE__*/React.createElement("span", {
className: "mono glass rounded-full px-3 py-1.5 text-white/80"
}, p.tag), /*#__PURE__*/React.createElement("span", {
className: "mono text-white/50"
}, p.year)), /*#__PURE__*/React.createElement("div", {
className: "pointer-events-none absolute inset-x-0 bottom-0 grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-end md:p-9"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
className: "mono mb-2 text-[var(--acid)]"
}, (0, _i18n.toPersianDigits)(p.n, lang)), /*#__PURE__*/React.createElement("h3", {
dir: "ltr",
className: `font-display text-[clamp(2.2rem,5vw,4.8rem)] font-semibold leading-[.95] tracking-[-0.045em] ${isRtl ? "text-right" : "text-left"}`
}, p.title), /*#__PURE__*/React.createElement("p", {
className: "mt-3 max-w-xl text-sm leading-relaxed text-white/65 md:text-base"
}, p.blurb), /*#__PURE__*/React.createElement("div", {
className: "mt-4 flex flex-wrap gap-1.5"
}, p.stack.map(s => /*#__PURE__*/React.createElement("span", {
key: s,
className: "chip !py-1 !text-[10px]"
}, s)))), /*#__PURE__*/React.createElement("div", {
className: "glass hidden rounded-2xl p-4 md:block"
}, /*#__PURE__*/React.createElement("div", {
className: "mono !text-[10px] text-white/45"
}, p.metric[0]), /*#__PURE__*/React.createElement("div", {
className: "mt-1 font-display text-xl font-medium"
}, p.metric[1]))))), /*#__PURE__*/React.createElement("article", {
className: "relative flex w-[70vw] shrink-0 flex-col items-start justify-between overflow-hidden rounded-[28px] border border-dashed border-white/20 p-8 sm:w-[44vw] lg:w-[32vw] md:p-10"
}, /*#__PURE__*/React.createElement("div", {
className: "mono text-white/45"
}, d.works.nextLabel), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_ui.SplitHeading, {
text: d.works.nextTitle,
className: "font-display text-4xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl"
}), /*#__PURE__*/React.createElement("button", {
onClick: () => (0, _engine.scrollToId)("lab"),
className: "btn mt-8"
}, d.works.nextBtn)))))));
}
},
"app:components/SkillGraph":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = SkillGraph;
var _react = _req("react");
var _data = _req("app:data");
var _engine = _req("app:lib/engine");
var _useCanvas = _req("app:lib/useCanvas");
var _ui = _req("app:components/ui");
var _sound = _req("app:lib/sound");
var _i18n = _req("app:lib/i18n");
const rgba = (h, a) => {
const [r, g, b] = (0, _engine.hexRgb)(h);
return `rgba(${r},${g},${b},${a})`;
};
function SkillGraph() {
const {
lang
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
const skills = d.skills;
const cats = d.cats;
const colOf = cat => {
const p = _engine.engine.pal;
return [p.c1, p.c2, p.c3, p.acid][cats[cat].color];
};
const [sel, setSel] = (0, _react.useState)("ali");
const [filter, setFilter] = (0, _react.useState)(null);
const selRef = (0, _react.useRef)(sel);
const filterRef = (0, _react.useRef)(filter);
const skillsRef = (0, _react.useRef)(skills);
(0, _react.useEffect)(() => {
selRef.current = sel;
filterRef.current = filter;
skillsRef.current = skills;
}, [sel, filter, skills]);
const ref = (0, _useCanvas.useCanvas)(s => {
const idIdx = new Map(skillsRef.current.map((k, i) => [k.id, i]));
const nodes = skillsRef.current.map((k, i) => {
const hub = k.id.startsWith("h-");
const ali = k.id === "ali";
const a = Math.random() * Math.PI * 2;
const rad = ali ? 0 : hub ? 120 : 220;
return {
id: k.id,
x: s.w / 2 + Math.cos(a) * rad,
y: s.h / 2 + Math.sin(a) * rad,
vx: 0,
vy: 0,
r: ali ? 24 : hub ? 15 : 8,
node: k,
hub,
i
};
});
const edges = _data.SKILL_EDGES.map(([a, b]) => ({
a: idIdx.get(a),
b: idIdx.get(b),
kind: a === "ali" ? 0 : a.startsWith("h-") ? 1 : 2
}));
const packets = [];
let hover = -1;
let drag = -1;
let moved = 0;
const ptr = {
x: 0,
y: 0
};
const pos = e => {
const r = s.canvas.getBoundingClientRect();
ptr.x = e.clientX - r.left;
ptr.y = e.clientY - r.top;
};
const hit = () => {
let best = -1;
let bd = Infinity;
nodes.forEach((n, i) => {
const dist = Math.hypot(n.x - ptr.x, n.y - ptr.y);
if (dist < n.r + 14 && dist < bd) {
bd = dist;
best = i;
}
});
return best;
};
const move = e => {
pos(e);
if (drag >= 0) moved += Math.abs(e.movementX) + Math.abs(e.movementY);else hover = hit();
s.canvas.style.cursor = hover >= 0 || drag >= 0 ? "grab" : "default";
};
const down = e => {
pos(e);
const h = hit();
if (h >= 0) {
drag = h;
moved = 0;
s.canvas.setPointerCapture(e.pointerId);
}
};
const up = () => {
if (drag >= 0 && moved < 6) {
setSel(nodes[drag].id);
(0, _sound.tick)(900, 0.1, 0.05);
}
drag = -1;
};
const leave = () => {
if (drag < 0) hover = -1;
};
s.canvas.addEventListener("pointermove", move);
s.canvas.addEventListener("pointerdown", down);
s.canvas.addEventListener("pointerup", up);
s.canvas.addEventListener("pointerleave", leave);
const frame = t => {
const {
ctx,
w,
h
} = s;
const sc = Math.min(w, h) / 620;
const cx = w / 2;
const cy = h / 2;
nodes.forEach((n, idx) => {
if (skillsRef.current[idx]) n.node = skillsRef.current[idx];
});
for (let step = 0; step < 2; step++) {
for (let i = 0; i < nodes.length; i++) {
const a = nodes[i];
for (let j = i + 1; j < nodes.length; j++) {
const b = nodes[j];
let dx = a.x - b.x;
let dy = a.y - b.y;
const d2 = dx * dx + dy * dy + 40;
const dist = Math.sqrt(d2);
const f = (a.r + b.r) * 120 * sc * sc / d2;
dx /= dist;
dy /= dist;
a.vx += dx * f;
a.vy += dy * f;
b.vx -= dx * f;
b.vy -= dy * f;
}
}
for (const e of edges) {
const a = nodes[e.a];
const b = nodes[e.b];
const dx = b.x - a.x;
const dy = b.y - a.y;
const dist = Math.hypot(dx, dy) || 1;
const rest = (e.kind === 0 ? 120 : e.kind === 1 ? 105 : 170) * sc;
const k = e.kind === 2 ? 0.006 : 0.03;
const f = (dist - rest) * k;
a.vx += dx / dist * f;
a.vy += dy / dist * f;
b.vx -= dx / dist * f;
b.vy -= dy / dist * f;
}
for (const n of nodes) {
n.vx += (cx - n.x) * 0.0016;
n.vy += (cy - n.y) * 0.0016;
if (n.id === "ali") {
n.vx += (cx - n.x) * 0.02;
n.vy += (cy - n.y) * 0.02;
}
n.vx *= 0.88;
n.vy *= 0.88;
n.x += n.vx;
n.y += n.vy;
n.x = Math.max(n.r + 4, Math.min(w - n.r - 4, n.x));
n.y = Math.max(n.r + 4, Math.min(h - n.r - 4, n.y));
}
if (drag >= 0) {
const n = nodes[drag];
n.x += (ptr.x - n.x) * 0.5;
n.y += (ptr.y - n.y) * 0.5;
n.vx = n.vy = 0;
}
}
nodes.forEach((n, i) => {
n.vx += Math.sin(t * 0.7 + i) * 0.004;
n.vy += Math.cos(t * 0.6 + i * 1.3) * 0.004;
});
ctx.clearRect(0, 0, w, h);
const focus = hover >= 0 ? nodes[hover].id : drag >= 0 ? nodes[drag].id : selRef.current;
const fi = idIdx.get(focus);
const flt = filterRef.current;
const linked = new Set([fi]);
edges.forEach(e => {
if (e.a === fi) linked.add(e.b);
if (e.b === fi) linked.add(e.a);
});
const dim = n => flt ? n.node.cat !== flt && n.node.cat !== "core" : false;
const getCol = cat => {
const p = _engine.engine.pal;
return [p.c1, p.c2, p.c3, p.acid][cats[cat].color];
};
edges.forEach(e => {
const a = nodes[e.a];
const b = nodes[e.b];
const on = e.a === fi || e.b === fi;
const dd = dim(a) && dim(b);
ctx.lineWidth = on ? 1.8 : 1;
if (on) {
const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
g.addColorStop(0, rgba(getCol(a.node.cat), 0.95));
g.addColorStop(1, rgba(getCol(b.node.cat), 0.95));
ctx.strokeStyle = g;
} else ctx.strokeStyle = `rgba(255,255,255,${dd ? 0.03 : 0.1})`;
ctx.beginPath();
ctx.moveTo(a.x, a.y);
ctx.lineTo(b.x, b.y);
ctx.stroke();
});
if (Math.random() < 0.18 && packets.length < 36) packets.push({
e: Math.random() * edges.length | 0,
t: 0,
sp: 0.008 + Math.random() * 0.012
});
for (let k = packets.length - 1; k >= 0; k--) {
const p = packets[k];
p.t += p.sp;
if (p.t >= 1) {
packets.splice(k, 1);
continue;
}
const a = nodes[edges[p.e].a];
const b = nodes[edges[p.e].b];
ctx.fillStyle = rgba(_engine.engine.pal.acid, 0.95);
ctx.beginPath();
ctx.arc(a.x + (b.x - a.x) * p.t, a.y + (b.y - a.y) * p.t, 1.8, 0, Math.PI * 2);
ctx.fill();
}
for (const n of nodes) {
const col = getCol(n.node.cat);
const isF = n.i === fi;
const isL = linked.has(n.i);
const dd = dim(n);
const a = dd ? 0.2 : isL || hover < 0 ? 1 : 0.55;
const pulse = isF ? 1 + Math.sin(t * 4) * 0.08 : 1;
const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * (isF ? 4 : 2.8));
g.addColorStop(0, rgba(col, 0.55 * a));
g.addColorStop(1, rgba(col, 0));
ctx.fillStyle = g;
ctx.beginPath();
ctx.arc(n.x, n.y, n.r * (isF ? 4 : 2.8), 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = n.hub || n.id === "ali" ? rgba(col, a) : `rgba(8,9,14,${a})`;
ctx.strokeStyle = rgba(col, a);
ctx.lineWidth = n.hub ? 0 : 2;
ctx.beginPath();
ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
ctx.fill();
if (!n.hub) ctx.stroke();
if (isF) {
ctx.strokeStyle = rgba("#ffffff", 0.5);
ctx.lineWidth = 1;
ctx.beginPath();
ctx.arc(n.x, n.y, n.r + 7 + Math.sin(t * 3) * 2, 0, Math.PI * 2);
ctx.stroke();
}
ctx.font = n.id === "ali" ? "700 13px 'JetBrains Mono', 'Vazirmatn', monospace" : n.hub ? "600 11px 'JetBrains Mono', 'Vazirmatn', monospace" : "500 12px 'Vazirmatn', 'JetBrains Mono', sans-serif";
ctx.textAlign = "center";
ctx.fillStyle = n.id === "ali" || n.hub ? `rgba(0,0,0,${a})` : isL ? `rgba(255,255,255,${a})` : `rgba(255,255,255,${0.55 * a})`;
if (n.hub || n.id === "ali") ctx.fillText(n.node.label, n.x, n.y + 4);else ctx.fillText(n.node.label, n.x, n.y + n.r + 16);
}
};
return {
frame,
cleanup: () => {
s.canvas.removeEventListener("pointermove", move);
s.canvas.removeEventListener("pointerdown", down);
s.canvas.removeEventListener("pointerup", up);
s.canvas.removeEventListener("pointerleave", leave);
}
};
}, []);
const node = skills.find(k => k.id === sel) || skills[0];
const connected = (0, _react.useMemo)(() => {
const ids = new Set();
_data.SKILL_EDGES.forEach(([a, b]) => {
if (a === sel) ids.add(b);
if (b === sel) ids.add(a);
});
return skills.filter(k => ids.has(k.id));
}, [sel, skills]);
const col = colOf(node.cat);
return /*#__PURE__*/React.createElement("section", {
id: "map",
className: "relative px-5 py-32 md:px-10 md:py-48 lg:ps-28"
}, /*#__PURE__*/React.createElement(_ui.SectionHead, {
n: "04",
label: d.map.label,
title: d.map.title,
kicker: d.map.kicker
}), /*#__PURE__*/React.createElement(_ui.Reveal, null, /*#__PURE__*/React.createElement("div", {
className: "grid gap-5 lg:grid-cols-[1fr_340px]"
}, /*#__PURE__*/React.createElement("div", {
className: "glass relative h-[68vh] min-h-[480px] overflow-hidden rounded-3xl",
"data-cursor": d.map.cursorDrag
}, /*#__PURE__*/React.createElement("canvas", {
ref: ref,
className: "absolute inset-0 h-full w-full touch-pan-y"
}), /*#__PURE__*/React.createElement("div", {
className: "mono pointer-events-none absolute bottom-4 start-5 !text-[10px] text-white/35"
}, d.map.hint), /*#__PURE__*/React.createElement("div", {
className: "mono pointer-events-none absolute end-5 top-4 !text-[10px] text-white/35"
}, (0, _i18n.toPersianDigits)(skills.length, lang), " ", d.map.nodesWord, " \xB7 ", (0, _i18n.toPersianDigits)(_data.SKILL_EDGES.length, lang), " ", d.map.synapsesWord)), /*#__PURE__*/React.createElement("div", {
className: "flex flex-col gap-5"
}, /*#__PURE__*/React.createElement("div", {
className: "glass flex-1 rounded-3xl p-6"
}, /*#__PURE__*/React.createElement("div", {
className: "mono flex items-center gap-2 !text-[10px]",
style: {
color: col
}
}, /*#__PURE__*/React.createElement("span", {
className: "h-2 w-2 rounded-full",
style: {
background: col,
boxShadow: `0 0 12px ${col}`
}
}), cats[node.cat].label), /*#__PURE__*/React.createElement("h3", {
className: "mt-3 font-display text-4xl font-semibold tracking-tight"
}, node.label), /*#__PURE__*/React.createElement("p", {
className: "mt-3 leading-relaxed text-white/60"
}, node.desc), /*#__PURE__*/React.createElement("div", {
className: "mono mb-2 mt-6 !text-[10px] text-white/35"
}, d.map.connectedTo), /*#__PURE__*/React.createElement("div", {
className: "flex flex-wrap gap-1.5"
}, connected.map(c => /*#__PURE__*/React.createElement("button", {
key: c.id,
className: "chip",
onClick: () => setSel(c.id)
}, c.label)))), /*#__PURE__*/React.createElement("div", {
className: "glass rounded-3xl p-5"
}, /*#__PURE__*/React.createElement("div", {
className: "mono mb-3 !text-[10px] text-white/35"
}, d.map.filterBy), /*#__PURE__*/React.createElement("div", {
className: "flex flex-wrap gap-1.5"
}, Object.entries(cats).filter(([k]) => k !== "core").map(([k, v]) => /*#__PURE__*/React.createElement("button", {
key: k,
className: "chip",
"data-on": filter === k,
onClick: () => setFilter(filter === k ? null : k)
}, v.label))))))));
}
},
"app:components/Lab":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = Lab;
var _react = _req("react");
var _data = _req("app:data");
var _engine = _req("app:lib/engine");
var _useCanvas = _req("app:lib/useCanvas");
var _ui = _req("app:components/ui");
var _sound = _req("app:lib/sound");
var _i18n = _req("app:lib/i18n");
const rn = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.667;
function makeData(kind, n = 200) {
const out = [];
const half = n / 2;
if (kind === "spiral") {
for (let c = 0; c < 2; c++) for (let i = 0; i < half; i++) {
const r = i / half * 0.88 + 0.04;
const t = 1.75 * i / half * Math.PI * 2 + c * Math.PI;
out.push({
x: r * Math.sin(t) + rn() * 0.05,
y: r * Math.cos(t) + rn() * 0.05,
c: c
});
}
} else if (kind === "circle") {
for (let i = 0; i < half; i++) {
const r = Math.random() * 0.4;
const a = Math.random() * Math.PI * 2;
out.push({
x: Math.cos(a) * r,
y: Math.sin(a) * r,
c: 0
});
const r2 = 0.62 + Math.random() * 0.32;
const a2 = Math.random() * Math.PI * 2;
out.push({
x: Math.cos(a2) * r2,
y: Math.sin(a2) * r2,
c: 1
});
}
} else if (kind === "xor") {
while (out.length < n) {
const x = (Math.random() * 2 - 1) * 0.95;
const y = (Math.random() * 2 - 1) * 0.95;
if (Math.abs(x) < 0.1 || Math.abs(y) < 0.1) continue;
out.push({
x,
y,
c: x * y > 0 ? 1 : 0
});
}
} else {
for (let i = 0; i < half; i++) {
const a = Math.random() * Math.PI;
out.push({
x: Math.cos(a) * 0.55 - 0.22 + rn() * 0.07,
y: Math.sin(a) * 0.55 - 0.1 + rn() * 0.07,
c: 0
});
const b = Math.random() * Math.PI;
out.push({
x: 0.22 - Math.cos(b) * 0.55 + rn() * 0.07,
y: 0.1 - Math.sin(b) * 0.55 + rn() * 0.07,
c: 1
});
}
}
return out;
}
const NF = 7;
const feats = (x, y, out) => {
out[0] = x;
out[1] = y;
out[2] = x * x;
out[3] = y * y;
out[4] = x * y;
out[5] = Math.sin(3 * x);
out[6] = Math.sin(3 * y);
};
class Net {
sizes = [NF, 10, 8, 1];
W = [];
B = [];
mW = [];
vW = [];
mB = [];
vB = [];
gW = [];
gB = [];
acts = [];
deltas = [];
step = 0;
constructor() {
this.reset();
}
reset() {
const L = this.sizes.length - 1;
this.W = [];
this.B = [];
this.mW = [];
this.vW = [];
this.mB = [];
this.vB = [];
this.gW = [];
this.gB = [];
this.step = 0;
this.acts = this.sizes.map(n => new Float64Array(n));
this.deltas = this.sizes.map(n => new Float64Array(n));
for (let l = 0; l < L; l++) {
const i = this.sizes[l];
const o = this.sizes[l + 1];
const w = new Float64Array(i * o);
const sc = Math.sqrt(2 / (i + o)) * 1.6;
for (let k = 0; k < w.length; k++) w[k] = (Math.random() * 2 - 1) * sc;
this.W.push(w);
this.B.push(new Float64Array(o));
this.mW.push(new Float64Array(i * o));
this.vW.push(new Float64Array(i * o));
this.mB.push(new Float64Array(o));
this.vB.push(new Float64Array(o));
this.gW.push(new Float64Array(i * o));
this.gB.push(new Float64Array(o));
}
}
forward(a) {
const L = this.sizes.length - 1;
for (let l = 0; l < L; l++) {
const inn = this.sizes[l];
const out = this.sizes[l + 1];
const W = this.W[l];
for (let o = 0; o < out; o++) {
let z = this.B[l][o];
for (let i = 0; i < inn; i++) z += W[o * inn + i] * a[l][i];
a[l + 1][o] = l === L - 1 ? 1 / (1 + Math.exp(-z)) : Math.tanh(z);
}
}
return a[L][0];
}
predict(x, y, scratch) {
feats(x, y, scratch[0]);
return this.forward(scratch);
}
train(data, batch, lr) {
const L = this.sizes.length - 1;
for (let l = 0; l < L; l++) {
this.gW[l].fill(0);
this.gB[l].fill(0);
}
let loss = 0;
for (let n = 0; n < batch; n++) {
const p = data[Math.random() * data.length | 0];
feats(p.x, p.y, this.acts[0]);
const out = this.forward(this.acts);
loss += -(p.c * Math.log(out + 1e-9) + (1 - p.c) * Math.log(1 - out + 1e-9));
this.deltas[L][0] = out - p.c;
for (let l = L - 1; l >= 0; l--) {
const inn = this.sizes[l];
const o = this.sizes[l + 1];
if (l > 0) this.deltas[l].fill(0);
for (let j = 0; j < o; j++) {
const d = this.deltas[l + 1][j];
this.gB[l][j] += d;
for (let i = 0; i < inn; i++) {
this.gW[l][j * inn + i] += d * this.acts[l][i];
if (l > 0) this.deltas[l][i] += this.W[l][j * inn + i] * d;
}
}
if (l > 0) for (let i = 0; i < inn; i++) this.deltas[l][i] *= 1 - this.acts[l][i] * this.acts[l][i];
}
}
this.step++;
const b1 = 0.9;
const b2 = 0.999;
const c1 = 1 - Math.pow(b1, this.step);
const c2 = 1 - Math.pow(b2, this.step);
for (let l = 0; l < L; l++) {
for (let k = 0; k < this.W[l].length; k++) {
const g = this.gW[l][k] / batch;
this.mW[l][k] = b1 * this.mW[l][k] + (1 - b1) * g;
this.vW[l][k] = b2 * this.vW[l][k] + (1 - b2) * g * g;
this.W[l][k] -= lr * (this.mW[l][k] / c1) / (Math.sqrt(this.vW[l][k] / c2) + 1e-8);
}
for (let k = 0; k < this.B[l].length; k++) {
const g = this.gB[l][k] / batch;
this.mB[l][k] = b1 * this.mB[l][k] + (1 - b1) * g;
this.vB[l][k] = b2 * this.vB[l][k] + (1 - b2) * g * g;
this.B[l][k] -= lr * (this.mB[l][k] / c1) / (Math.sqrt(this.vB[l][k] / c2) + 1e-8);
}
}
return loss / batch;
}
}
function NeuralPlayground() {
const {
lang
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
const [ds, setDs] = (0, _react.useState)("spiral");
const [running, setRunning] = (0, _react.useState)(true);
const [addClass, setAddClass] = (0, _react.useState)(0);
const [stats, setStats] = (0, _react.useState)({
epoch: 0,
loss: 0,
acc: 0
});
const [resetKey, setResetKey] = (0, _react.useState)(0);
const runRef = (0, _react.useRef)(running);
const addRef = (0, _react.useRef)(addClass);
const dsRef = (0, _react.useRef)(ds);
const resetRef = (0, _react.useRef)(0);
(0, _react.useEffect)(() => {
runRef.current = running;
addRef.current = addClass;
dsRef.current = ds;
}, [running, addClass, ds]);
(0, _react.useEffect)(() => {
resetRef.current++;
}, [ds, resetKey]);
const ref = (0, _useCanvas.useCanvas)(s => {
const net = new Net();
let data = makeData(dsRef.current);
let lastReset = resetRef.current;
const G = 40;
const off = document.createElement("canvas");
off.width = off.height = G;
const octx = off.getContext("2d");
const img = octx.createImageData(G, G);
const scratch = net.sizes.map(n => new Float64Array(n));
const ev = new Float64Array(NF);
let epoch = 0;
let loss = 0;
let acc = 0;
let fr = 0;
let lastStat = 0;
const click = e => {
const r = s.canvas.getBoundingClientRect();
const x = (e.clientX - r.left) / r.width * 2 - 1;
const y = (e.clientY - r.top) / r.height * 2 - 1;
const c = e.shiftKey ? 1 : addRef.current;
for (let k = 0; k < 6; k++) data.push({
x: x + rn() * 0.04,
y: y + rn() * 0.04,
c
});
(0, _sound.tick)(c ? 700 : 500, 0.08, 0.04);
};
s.canvas.addEventListener("pointerdown", click);
return {
cleanup: () => s.canvas.removeEventListener("pointerdown", click),
frame(t) {
if (lastReset !== resetRef.current) {
lastReset = resetRef.current;
net.reset();
data = makeData(dsRef.current);
epoch = 0;
}
if (runRef.current) {
let l = 0;
for (let k = 0; k < 7; k++) l = net.train(data, 24, 0.03);
loss = (0, _engine.lerp)(loss || l, l, 0.2);
epoch += 7 * 24 / data.length;
}
fr++;
const {
ctx,
w,
h
} = s;
if (fr % 2 === 0 || !runRef.current) {
const [r0, g0, b0] = (0, _engine.hexRgb)(_engine.engine.pal.c2);
const [r1, g1, b1] = (0, _engine.hexRgb)(_engine.engine.pal.c3);
for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
const p = net.predict((i + 0.5) / G * 2 - 1, (j + 0.5) / G * 2 - 1, scratch);
const k = (j * G + i) * 4;
img.data[k] = (0, _engine.lerp)(r0, r1, p);
img.data[k + 1] = (0, _engine.lerp)(g0, g1, p);
img.data[k + 2] = (0, _engine.lerp)(b0, b1, p);
img.data[k + 3] = 40 + Math.abs(p - 0.5) * 170;
}
octx.putImageData(img, 0, 0);
}
ctx.clearRect(0, 0, w, h);
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";
ctx.drawImage(off, 0, 0, w, h);
ctx.strokeStyle = "rgba(255,255,255,.07)";
ctx.beginPath();
ctx.moveTo(w / 2, 0);
ctx.lineTo(w / 2, h);
ctx.moveTo(0, h / 2);
ctx.lineTo(w, h / 2);
ctx.stroke();
let ok = 0;
for (const p of data) {
const px = (p.x + 1) / 2 * w;
const py = (p.y + 1) / 2 * h;
ctx.fillStyle = p.c ? _engine.engine.pal.c3 : _engine.engine.pal.c2;
ctx.strokeStyle = "rgba(255,255,255,.85)";
ctx.lineWidth = 1;
ctx.beginPath();
ctx.arc(px, py, 3.6, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
if (fr % 15 === 0) {
feats(p.x, p.y, ev);
scratch[0].set(ev);
ok += (net.forward(scratch) > 0.5 ? 1 : 0) === p.c ? 1 : 0;
}
}
if (fr % 15 === 0) acc = ok / data.length;
if (t - lastStat > 0.3) {
lastStat = t;
setStats({
epoch: Math.round(epoch),
loss,
acc
});
}
}
};
}, []);
const sets = ["spiral", "circle", "xor", "moons"];
return /*#__PURE__*/React.createElement("div", {
className: "glass flex flex-col rounded-3xl p-5 md:p-7"
}, /*#__PURE__*/React.createElement("div", {
className: "mb-1 flex items-center justify-between"
}, /*#__PURE__*/React.createElement("h3", {
className: "font-display text-2xl font-semibold tracking-tight md:text-3xl"
}, d.lab.nnTitle), /*#__PURE__*/React.createElement("span", {
className: `mono flex items-center gap-2 !text-[10px] ${running ? "text-[var(--acid)]" : "text-white/40"}`
}, /*#__PURE__*/React.createElement("span", {
className: `h-1.5 w-1.5 rounded-full ${running ? "pulse-dot bg-[var(--acid)]" : "bg-white/30"}`
}), running ? d.lab.nnRunning : d.lab.nnPaused)), /*#__PURE__*/React.createElement("p", {
className: "mb-4 max-w-md text-sm leading-relaxed text-white/50"
}, d.lab.nnDesc), /*#__PURE__*/React.createElement("div", {
className: "relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30",
"data-cursor": addClass ? "ADD B" : "ADD A"
}, /*#__PURE__*/React.createElement("canvas", {
ref: ref,
className: "absolute inset-0 h-full w-full"
})), /*#__PURE__*/React.createElement("div", {
className: "mt-4 grid grid-cols-3 gap-2"
}, [[d.lab.nnEpoch, (0, _i18n.toPersianDigits)(stats.epoch.toString().padStart(4, "0"), lang)], [d.lab.nnLoss, (0, _i18n.toPersianDigits)(stats.loss.toFixed(3), lang)], [d.lab.nnAcc, `${(0, _i18n.toPersianDigits)(Math.round(stats.acc * 100), lang)}${lang === "fa" ? "٪" : "%"}`]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
key: k,
className: "rounded-xl border border-white/10 bg-white/[.03] px-3 py-2"
}, /*#__PURE__*/React.createElement("div", {
className: "mono !text-[9px] text-white/40"
}, k), /*#__PURE__*/React.createElement("div", {
className: "font-display text-xl tabular-nums"
}, v)))), /*#__PURE__*/React.createElement("div", {
className: "mt-4 flex flex-wrap items-center gap-1.5"
}, sets.map(dsItem => /*#__PURE__*/React.createElement("button", {
key: dsItem,
className: "chip",
"data-on": ds === dsItem,
onClick: () => setDs(dsItem)
}, d.lab.nnSets[dsItem])), /*#__PURE__*/React.createElement("span", {
className: "mx-1 h-4 w-px bg-white/15"
}), /*#__PURE__*/React.createElement("button", {
className: "chip",
onClick: () => setRunning(r => !r)
}, running ? d.lab.nnPauseBtn : d.lab.nnTrainBtn), /*#__PURE__*/React.createElement("button", {
className: "chip",
onClick: () => setResetKey(k => k + 1)
}, d.lab.nnResetBtn), /*#__PURE__*/React.createElement("button", {
className: "chip",
onClick: () => setAddClass(c => c ? 0 : 1),
style: {
color: addClass ? "var(--c3)" : "var(--c2)"
}
}, d.lab.nnAddBtn, " ", addClass ? "B" : "A")));
}
function seedFrom(str) {
let h1 = 1779033703,
h2 = 3144134277,
h3 = 1013904242,
h4 = 2773480762;
for (let i = 0; i < str.length; i++) {
const k = str.charCodeAt(i);
h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
}
h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}
function mulberry(a) {
return () => {
a |= 0;
a = a + 0x6d2b79f5 | 0;
let t = Math.imul(a ^ a >>> 15, 1 | a);
t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
}
function buildSigil(text) {
const seed = seedFrom(text || " ");
const rnd = mulberry(seed);
const folds = 5 + Math.floor(rnd() * 5);
const wedge = Math.PI * 2 / folds;
const els = [];
for (let k = 0; k < 3 + Math.floor(rnd() * 2); k++) els.push({
t: "ring",
r: 0.2 + k * 0.2 + rnd() * 0.08,
a0: rnd() * 6.28,
a1: 1.2 + rnd() * 4.2,
w: 1 + rnd() * 2,
c: Math.floor(rnd() * 3)
});
const nc = 9 + Math.floor(rnd() * 9);
for (let k = 0; k < nc; k++) els.push({
t: "curve",
p: [rnd() * 0.25, rnd() * wedge, 0.3 + rnd() * 0.7, rnd() * wedge, 0.1 + rnd() * 0.9, rnd() * wedge, 0.1 + rnd() * 0.9, rnd() * wedge],
w: 0.8 + rnd() * 2.2,
c: Math.floor(rnd() * 4)
});
for (let k = 0; k < 8; k++) els.push({
t: "dot",
r: 0.15 + rnd() * 0.8,
a: rnd() * wedge,
s: 1.5 + rnd() * 3.5,
c: Math.floor(rnd() * 4)
});
for (let k = 0; k < 2; k++) els.push({
t: "poly",
r: 0.1 + rnd() * 0.25,
n: 3 + Math.floor(rnd() * 5),
rot: rnd() * 3,
c: 3
});
return {
folds,
els,
code: seed.toString(16).toUpperCase().padStart(8, "0").slice(0, 8)
};
}
function SigilForge() {
const {
lang
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
const [text, setText] = (0, _react.useState)(d.sigilPrompts[0]);
const sigil = (0, _react.useRef)(buildSigil(text));
const born = (0, _react.useRef)(performance.now() / 1000);
const [code, setCode] = (0, _react.useState)(sigil.current.code);
const textRef = (0, _react.useRef)(text);
(0, _react.useEffect)(() => {
textRef.current = text;
sigil.current = buildSigil(text);
born.current = performance.now() / 1000;
setCode(sigil.current.code);
}, [text]);
const draw = (ctx, w, h, t, bg) => {
const {
folds,
els
} = sigil.current;
const U = Math.min(w, h) * 0.46;
const grow = (0, _engine.clamp)((t - born.current) / 2.2);
const cols = [_engine.engine.pal.c1, _engine.engine.pal.c2, _engine.engine.pal.c3, _engine.engine.pal.acid];
ctx.clearRect(0, 0, w, h);
if (bg) {
ctx.fillStyle = "#05060a";
ctx.fillRect(0, 0, w, h);
}
ctx.save();
ctx.translate(w / 2, h / 2);
const g = ctx.createRadialGradient(0, 0, 0, 0, 0, U * 1.1);
const [r, gg, b] = (0, _engine.hexRgb)(_engine.engine.pal.c1);
g.addColorStop(0, `rgba(${r},${gg},${b},.28)`);
g.addColorStop(1, "rgba(0,0,0,0)");
ctx.fillStyle = g;
ctx.fillRect(-w, -h, w * 2, h * 2);
ctx.rotate(t * 0.06);
const sc = 1 + Math.sin(t * 0.8) * 0.015;
ctx.scale(sc, sc);
ctx.globalCompositeOperation = "lighter";
ctx.lineCap = "round";
const L = 900;
els.forEach((e, idx) => {
const local = (0, _engine.clamp)(grow * (els.length + 6) - idx);
if (local <= 0) return;
const col = cols[e.c];
const [cr, cg, cb] = (0, _engine.hexRgb)(col);
for (let f = 0; f < folds; f++) {
for (let m = 0; m < 2; m++) {
ctx.save();
ctx.rotate(f * (Math.PI * 2 / folds));
if (m) ctx.scale(1, -1);
ctx.setLineDash([L, L]);
ctx.lineDashOffset = L * (1 - local);
if (e.t === "ring") {
if (m) {
ctx.restore();
continue;
}
ctx.rotate(-f * (Math.PI * 2 / folds));
if (f > 0) {
ctx.restore();
continue;
}
ctx.beginPath();
ctx.arc(0, 0, e.r * U, e.a0, e.a0 + e.a1);
ctx.strokeStyle = `rgba(${cr},${cg},${cb},.8)`;
ctx.lineWidth = e.w;
ctx.stroke();
ctx.beginPath();
ctx.arc(0, 0, e.r * U, e.a0 + e.a1 + 0.5, e.a0 + Math.PI * 2 - 0.3);
ctx.strokeStyle = `rgba(${cr},${cg},${cb},.18)`;
ctx.lineWidth = 1;
ctx.stroke();
} else if (e.t === "curve") {
const P = k => [Math.cos(e.p[k * 2 + 1]) * e.p[k * 2] * U, Math.sin(e.p[k * 2 + 1]) * e.p[k * 2] * U];
const [x0, y0] = P(0);
const [x1, y1] = P(1);
const [x2, y2] = P(2);
const [x3, y3] = P(3);
ctx.beginPath();
ctx.moveTo(x0, y0);
ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
ctx.strokeStyle = `rgba(${cr},${cg},${cb},.14)`;
ctx.lineWidth = e.w * 5;
ctx.stroke();
ctx.strokeStyle = `rgba(${cr},${cg},${cb},.85)`;
ctx.lineWidth = e.w;
ctx.stroke();
} else if (e.t === "dot") {
ctx.setLineDash([]);
ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.9 * local})`;
ctx.beginPath();
ctx.arc(Math.cos(e.a) * e.r * U, Math.sin(e.a) * e.r * U, e.s * local, 0, Math.PI * 2);
ctx.fill();
} else if (e.t === "poly") {
if (f > 0 || m) {
ctx.restore();
continue;
}
ctx.rotate(-0);
ctx.beginPath();
for (let i = 0; i <= e.n; i++) {
const a = e.rot + i / e.n * Math.PI * 2;
ctx.lineTo(Math.cos(a) * e.r * U, Math.sin(a) * e.r * U);
}
ctx.strokeStyle = `rgba(${cr},${cg},${cb},.9)`;
ctx.lineWidth = 1.5;
ctx.stroke();
}
ctx.restore();
}
}
});
ctx.restore();
ctx.globalCompositeOperation = "source-over";
ctx.setLineDash([]);
};
const ref = (0, _useCanvas.useCanvas)(s => ({
frame: t => draw(s.ctx, s.w, s.h, t, false)
}), []);
const download = () => {
const c = ref.current;
const tmp = document.createElement("canvas");
tmp.width = c.width;
tmp.height = c.height;
const x = tmp.getContext("2d");
x.fillStyle = "#05060a";
x.fillRect(0, 0, tmp.width, tmp.height);
x.drawImage(c, 0, 0);
tmp.toBlob(blob => {
if (!blob) return;
const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = `sigil-${sigil.current.code}.png`;
a.click();
window.dispatchEvent(new CustomEvent("toast", {
detail: d.lab.sigilSavedToast
}));
});
};
return /*#__PURE__*/React.createElement("div", {
className: "glass flex flex-col rounded-3xl p-5 md:p-7"
}, /*#__PURE__*/React.createElement("div", {
className: "mb-1 flex items-center justify-between"
}, /*#__PURE__*/React.createElement("h3", {
className: "font-display text-2xl font-semibold tracking-tight md:text-3xl"
}, d.lab.sigilTitle), /*#__PURE__*/React.createElement("span", {
dir: "ltr",
className: "mono !text-[10px] text-[var(--acid)]"
}, "SIGIL\xB7", code)), /*#__PURE__*/React.createElement("p", {
className: "mb-4 max-w-md text-sm leading-relaxed text-white/50"
}, d.lab.sigilDesc), /*#__PURE__*/React.createElement("div", {
className: "relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30"
}, /*#__PURE__*/React.createElement("canvas", {
ref: ref,
className: "absolute inset-0 h-full w-full"
}), /*#__PURE__*/React.createElement("div", {
className: "mono pointer-events-none absolute start-4 top-3 !text-[9px] text-white/30"
}, (0, _i18n.toPersianDigits)(sigil.current.folds, lang), d.lab.sigilSymmetry)), /*#__PURE__*/React.createElement("div", {
className: "mt-4 flex items-center gap-2 rounded-full border border-white/15 bg-white/[.03] px-5 py-3 focus-within:border-[var(--acid)]"
}, /*#__PURE__*/React.createElement("span", {
className: "text-[var(--acid)]"
}, "\u2726"), /*#__PURE__*/React.createElement("input", {
value: text,
onChange: e => setText(e.target.value),
maxLength: 60,
placeholder: d.lab.sigilPlaceholder,
className: "w-full bg-transparent text-sm outline-none"
})), /*#__PURE__*/React.createElement("div", {
className: "mt-3 flex flex-wrap items-center gap-1.5"
}, /*#__PURE__*/React.createElement("button", {
className: "chip",
onClick: () => {
const prompts = d.sigilPrompts;
setText(prompts[Math.floor(Math.random() * prompts.length)] + (Math.random() < 0.5 ? "" : " " + Math.floor(Math.random() * 99)));
(0, _sound.tick)(800, 0.12, 0.05);
}
}, d.lab.sigilSurprise), /*#__PURE__*/React.createElement("button", {
className: "chip",
onClick: download
}, d.lab.sigilSave)));
}
function Lab() {
const {
lang
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
return /*#__PURE__*/React.createElement("section", {
id: "lab",
className: "relative px-5 py-32 md:px-10 md:py-48 lg:ps-28"
}, /*#__PURE__*/React.createElement(_ui.SectionHead, {
n: "05",
label: d.lab.label,
title: d.lab.title,
kicker: d.lab.kicker
}), /*#__PURE__*/React.createElement("div", {
className: "grid gap-5 lg:grid-cols-2"
}, /*#__PURE__*/React.createElement(_ui.Reveal, null, /*#__PURE__*/React.createElement(NeuralPlayground, null)), /*#__PURE__*/React.createElement(_ui.Reveal, {
delay: 150
}, /*#__PURE__*/React.createElement(SigilForge, null))));
}
},
"app:components/AskAli":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = AskAli;
var _react = _req("react");
var _data = _req("app:data");
var _ui = _req("app:components/ui");
var _sound = _req("app:lib/sound");
var _i18n = _req("app:lib/i18n");
function StreamText({
text,
onTick,
onDone
}) {
const [n, setN] = (0, _react.useState)(0);
(0, _react.useEffect)(() => {
let i = 0;
const id = window.setInterval(() => {
i += 1 + Math.floor(Math.random() * 3);
setN(Math.min(text.length, i));
onTick();
if (i % 6 === 0) (0, _sound.tick)(1500 + Math.random() * 600, 0.02, 0.012);
if (i >= text.length) {
clearInterval(id);
onDone();
}
}, 22);
return () => clearInterval(id);
}, [text]);
return /*#__PURE__*/React.createElement("span", {
className: n < text.length ? "caret" : ""
}, text.slice(0, n));
}
function answer(q, lang) {
const d = (0, _data.getData)(lang);
for (const k of d.kbList) if (k.keys.test(q)) return k.a[Math.floor(Math.random() * k.a.length)];
return d.kbFallback[Math.floor(Math.random() * d.kbFallback.length)];
}
function AskAli() {
const {
lang
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
const [msgs, setMsgs] = (0, _react.useState)([{
id: 0,
role: "ai",
text: d.ask.welcome
}]);
const [thinking, setThinking] = (0, _react.useState)(false);
const [speaking, setSpeaking] = (0, _react.useState)(true);
const [input, setInput] = (0, _react.useState)("");
const [streamId, setStreamId] = (0, _react.useState)(0);
const box = (0, _react.useRef)(null);
const id = (0, _react.useRef)(1);
(0, _react.useEffect)(() => {
setMsgs(prev => {
if (prev.length === 1 && prev[0].id === 0) {
return [{
id: 0,
role: "ai",
text: d.ask.welcome
}];
}
return prev;
});
}, [d.ask.welcome]);
const scroll = (0, _react.useCallback)(() => {
if (box.current) box.current.scrollTop = box.current.scrollHeight;
}, []);
const send = q => {
const text = q.trim();
if (!text || thinking) return;
const uid = id.current++;
setMsgs(m => [...m, {
id: uid,
role: "user",
text
}]);
setInput("");
setThinking(true);
setSpeaking(false);
(0, _sound.tick)(700, 0.08, 0.04);
setTimeout(scroll, 30);
setTimeout(() => {
const aid = id.current++;
setMsgs(m => [...m, {
id: aid,
role: "ai",
text: answer(text, lang)
}]);
setStreamId(aid);
setThinking(false);
setSpeaking(true);
}, 650 + Math.random() * 600);
};
(0, _react.useEffect)(scroll, [msgs, thinking, scroll]);
const dur = thinking ? "1.2s" : speaking ? "3s" : "9s";
return /*#__PURE__*/React.createElement("section", {
id: "ask",
className: "relative px-5 py-32 md:px-10 md:py-48 lg:ps-28"
}, /*#__PURE__*/React.createElement(_ui.SectionHead, {
n: "06",
label: d.ask.label,
title: d.ask.title,
kicker: d.ask.kicker
}), /*#__PURE__*/React.createElement("div", {
className: "grid gap-6 lg:grid-cols-[380px_1fr]"
}, /*#__PURE__*/React.createElement(_ui.Reveal, null, /*#__PURE__*/React.createElement("div", {
className: "glass flex h-full flex-col items-center rounded-3xl p-8 text-center"
}, /*#__PURE__*/React.createElement("div", {
className: "relative my-4 h-56 w-56"
}, /*#__PURE__*/React.createElement("div", {
className: "absolute inset-0 rounded-full blur-3xl",
style: {
background: "conic-gradient(from 0deg, var(--c1), var(--c2), var(--c3), var(--c1))",
opacity: 0.55,
animation: `spin ${dur} linear infinite`
}
}), /*#__PURE__*/React.createElement("div", {
className: "absolute inset-3 rounded-full",
style: {
background: "conic-gradient(from 90deg, var(--c2), var(--c1), var(--c3), var(--c2))",
animation: `spin ${dur} linear infinite reverse`,
filter: "blur(2px)"
}
}), /*#__PURE__*/React.createElement("div", {
className: "absolute inset-[22px] rounded-full bg-[#05060a]"
}), /*#__PURE__*/React.createElement("div", {
className: "absolute inset-[22px] grid place-items-center overflow-hidden rounded-full"
}, /*#__PURE__*/React.createElement("div", {
className: "flex h-16 items-center gap-1.5"
}, Array.from({
length: 9
}).map((_, i) => /*#__PURE__*/React.createElement("span", {
key: i,
className: "w-1.5 origin-center rounded-full bg-gradient-to-t from-[var(--c2)] to-[var(--c3)]",
style: {
height: "100%",
animation: `bar ${thinking ? 0.5 : speaking ? 0.8 : 2.4}s ease-in-out ${i * 0.09}s infinite`,
opacity: thinking || speaking ? 1 : 0.5
}
}))))), /*#__PURE__*/React.createElement("div", {
className: "font-display text-2xl font-semibold"
}, d.ask.twinName), /*#__PURE__*/React.createElement("div", {
className: "mono mt-1 flex items-center gap-2 !text-[10px] text-[var(--acid)]"
}, /*#__PURE__*/React.createElement("span", {
className: "pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--acid)]"
}), thinking ? d.ask.statusThinking : speaking ? d.ask.statusSpeaking : d.ask.statusIdle), /*#__PURE__*/React.createElement("p", {
className: "mt-5 text-sm leading-relaxed text-white/45"
}, d.ask.twinBio), /*#__PURE__*/React.createElement("div", {
className: "mt-6 flex flex-wrap justify-center gap-1.5"
}, d.ask.askChips.map(c => /*#__PURE__*/React.createElement("button", {
key: c,
className: "chip",
onClick: () => send(c)
}, c))))), /*#__PURE__*/React.createElement(_ui.Reveal, {
delay: 150
}, /*#__PURE__*/React.createElement("div", {
className: "glass flex h-[620px] flex-col overflow-hidden rounded-3xl"
}, /*#__PURE__*/React.createElement("div", {
className: "flex items-center gap-2 border-b border-white/10 px-5 py-4"
}, /*#__PURE__*/React.createElement("span", {
className: "h-3 w-3 rounded-full bg-[#ff5f57]"
}), /*#__PURE__*/React.createElement("span", {
className: "h-3 w-3 rounded-full bg-[#febc2e]"
}), /*#__PURE__*/React.createElement("span", {
className: "h-3 w-3 rounded-full bg-[#28c840]"
}), /*#__PURE__*/React.createElement("span", {
className: "mono ms-3 !text-[10px] text-white/40"
}, d.ask.sessionHeader)), /*#__PURE__*/React.createElement("div", {
ref: box,
"data-lenis-prevent": true,
className: "flex-1 space-y-5 overflow-y-auto p-5 md:p-7"
}, msgs.map(m => /*#__PURE__*/React.createElement("div", {
key: m.id,
className: `flex gap-3 ${m.role === "user" ? "justify-end" : ""}`,
style: {
animation: "fade-up .5s both"
}
}, m.role === "ai" && /*#__PURE__*/React.createElement("span", {
className: "mono mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--acid)] !text-[9px] font-bold text-black"
}, "AI"), /*#__PURE__*/React.createElement("div", {
className: `max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${m.role === "user" ? "rounded-ee-sm bg-white text-black" : "rounded-es-sm border border-white/10 bg-white/[.04] text-white/85"}`
}, m.role === "ai" && (m.id === streamId || m.id === 0) ? /*#__PURE__*/React.createElement(StreamText, {
key: `${m.id}-${lang}`,
text: m.text,
onTick: scroll,
onDone: () => m.id === streamId && setSpeaking(false)
}) : m.text))), thinking && /*#__PURE__*/React.createElement("div", {
className: "flex items-center gap-3"
}, /*#__PURE__*/React.createElement("span", {
className: "mono grid h-7 w-7 place-items-center rounded-full bg-[var(--acid)] !text-[9px] font-bold text-black"
}, "AI"), /*#__PURE__*/React.createElement("div", {
className: "flex gap-1.5 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-4"
}, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
key: i,
className: "h-1.5 w-1.5 rounded-full bg-white/70",
style: {
animation: `bar .9s ease-in-out ${i * 0.15}s infinite`
}
}))))), /*#__PURE__*/React.createElement("form", {
onSubmit: e => {
e.preventDefault();
send(input);
},
className: "flex items-center gap-3 border-t border-white/10 p-4"
}, /*#__PURE__*/React.createElement("span", {
className: "mono ps-2 text-[var(--acid)]"
}, "\u203A"), /*#__PURE__*/React.createElement("input", {
value: input,
onChange: e => setInput(e.target.value),
placeholder: d.ask.placeholder,
className: "flex-1 bg-transparent py-2 text-[15px] outline-none"
}), /*#__PURE__*/React.createElement("button", {
type: "submit",
className: "btn btn-solid !px-5 !py-2.5",
disabled: thinking
}, d.ask.sendBtn))))));
}
},
"app:components/Journey":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = Journey;
var _react = _req("react");
var _data = _req("app:data");
var _engine = _req("app:lib/engine");
var _ui = _req("app:components/ui");
var _i18n = _req("app:lib/i18n");
function Journey() {
const {
lang,
isRtl
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
const journey = d.journeyList;
const wrap = (0, _react.useRef)(null);
const fill = (0, _react.useRef)(null);
const items = (0, _react.useRef)([]);
(0, _react.useEffect)(() => {
const off = (0, _engine.onFrame)(() => {
const el = wrap.current;
if (!el) return;
const r = el.getBoundingClientRect();
const mid = window.innerHeight * 0.55;
const p = (0, _engine.clamp)((mid - r.top) / r.height);
if (fill.current) fill.current.style.transform = `scaleY(${p})`;
items.current.forEach(it => {
if (!it) return;
const ir = it.getBoundingClientRect();
const lit = ir.top + 30 < mid;
if (it.dataset.lit !== String(lit)) it.dataset.lit = String(lit);
});
});
return off;
}, []);
return /*#__PURE__*/React.createElement("section", {
id: "journey",
className: "relative px-5 py-32 md:px-10 md:py-48 lg:ps-28"
}, /*#__PURE__*/React.createElement(_ui.SectionHead, {
n: "07",
label: d.journey.label,
title: d.journey.title,
kicker: d.journey.kicker
}), /*#__PURE__*/React.createElement("div", {
ref: wrap,
className: "relative mx-auto max-w-5xl"
}, /*#__PURE__*/React.createElement("div", {
className: `absolute bottom-0 ${isRtl ? "right-4 md:right-1/2" : "left-4 md:left-1/2"} top-0 w-px bg-white/10`
}, /*#__PURE__*/React.createElement("div", {
ref: fill,
className: "h-full origin-top bg-gradient-to-b from-[var(--c2)] via-[var(--c1)] to-[var(--c3)] shadow-[0_0_16px_var(--c2)]",
style: {
transform: "scaleY(0)"
}
})), /*#__PURE__*/React.createElement("div", {
className: "space-y-20 md:space-y-32"
}, journey.map((j, i) => /*#__PURE__*/React.createElement("div", {
key: j.n,
ref: el => {
items.current[i] = el;
},
"data-lit": "false",
className: `group relative grid ps-12 md:grid-cols-2 md:ps-0 ${i % 2 ? "md:[&>div:first-of-type]:order-2" : ""}`
}, /*#__PURE__*/React.createElement("span", {
className: `absolute ${isRtl ? "right-4 translate-x-1/2 md:right-1/2" : "left-4 -translate-x-1/2 md:left-1/2"} top-3 z-10 h-4 w-4 rounded-full border-2 border-white/30 bg-[#05060a] transition-all duration-700 group-data-[lit=true]:scale-125 group-data-[lit=true]:border-[var(--acid)] group-data-[lit=true]:bg-[var(--acid)] group-data-[lit=true]:shadow-[0_0_24px_var(--acid)]`
}), /*#__PURE__*/React.createElement("div", {
className: `${i % 2 ? "md:ps-20" : "md:pe-20 md:text-end"}`
}, /*#__PURE__*/React.createElement(_ui.Reveal, null, /*#__PURE__*/React.createElement("div", {
className: "font-display text-[clamp(5rem,12vw,10rem)] font-extrabold leading-[.8] tracking-[-0.06em] text-white/[.06] transition-colors duration-700 group-data-[lit=true]:text-white/[.14]",
style: {
WebkitTextStroke: "1px rgba(255,255,255,.2)"
}
}, j.n))), /*#__PURE__*/React.createElement("div", {
className: `${i % 2 ? "md:pe-20 md:text-end" : "md:ps-20"} mt-4 md:mt-0`
}, /*#__PURE__*/React.createElement(_ui.Reveal, {
delay: 150
}, /*#__PURE__*/React.createElement("h3", {
className: "font-display text-4xl font-semibold tracking-tight md:text-5xl"
}, j.title, /*#__PURE__*/React.createElement("span", {
className: "text-[var(--acid)]"
}, ".")), /*#__PURE__*/React.createElement("p", {
className: "mt-4 text-lg leading-relaxed text-white/55 transition-colors duration-700 group-data-[lit=true]:text-white/75"
}, j.text))))))));
}
},
"app:components/Contact":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = Contact;
var _react = _req("react");
var _data = _req("app:data");
var _engine = _req("app:lib/engine");
var _useCanvas = _req("app:lib/useCanvas");
var _ui = _req("app:components/ui");
var _sound = _req("app:lib/sound");
var _i18n = _req("app:lib/i18n");
const SOCIALS = [{
n: "GitHub",
href: "https://github.com/w15800974-debug"
}, {
n: "LinkedIn",
href: "https://linkedin.com"
}, {
n: "X / Twitter",
href: "https://x.com"
}, {
n: "Instagram",
href: "https://instagram.com"
}];
function Burst({
trigger
}) {
const trig = (0, _react.useRef)(trigger);
const ref = (0, _useCanvas.useCanvas)(s => {
let ps = [];
return {
frame(_, dt) {
if (trig.current !== s.canvas._t) {
s.canvas._t = trig.current;
if (trig.current > 0) for (let i = 0; i < 90; i++) {
const a = Math.random() * Math.PI * 2;
const v = 2 + Math.random() * 9;
ps.push({
x: s.w / 2,
y: s.h / 2,
vx: Math.cos(a) * v,
vy: Math.sin(a) * v - 3,
l: 1,
c: Math.floor(Math.random() * 4),
r: 2 + Math.random() * 4
});
}
}
s.ctx.clearRect(0, 0, s.w, s.h);
const cols = [_engine.engine.pal.c1, _engine.engine.pal.c2, _engine.engine.pal.c3, _engine.engine.pal.acid];
ps = ps.filter(p => p.l > 0);
for (const p of ps) {
p.vy += 0.22;
p.vx *= 0.985;
p.x += p.vx;
p.y += p.vy;
p.l -= dt * 0.7;
s.ctx.globalAlpha = (0, _engine.clamp)(p.l);
s.ctx.fillStyle = cols[p.c];
s.ctx.fillRect(p.x, p.y, p.r, p.r * 1.8);
}
s.ctx.globalAlpha = 1;
}
};
}, []);
(0, _react.useEffect)(() => {
trig.current = trigger;
}, [trigger]);
return /*#__PURE__*/React.createElement("canvas", {
ref: ref,
className: "pointer-events-none absolute inset-0 h-full w-full"
});
}
function Contact() {
const {
lang
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
const [copied, setCopied] = (0, _react.useState)(false);
const [burst, setBurst] = (0, _react.useState)(0);
const [form, setForm] = (0, _react.useState)({
name: "",
email: "",
msg: ""
});
const foot = (0, _react.useRef)(null);
const clock = (0, _react.useRef)(null);
const copy = () => {
try {
navigator.clipboard?.writeText(_data.EMAIL).catch(() => {});
} catch {
}
setCopied(true);
setBurst(b => b + 1);
(0, _sound.tick)(1000, 0.3, 0.07);
setTimeout(() => setCopied(false), 2200);
};
(0, _react.useEffect)(() => {
let last = 0;
const off = (0, _engine.onFrame)(t => {
const el = foot.current;
if (el) {
const r = el.getBoundingClientRect();
el.style.setProperty("--fx", `${_engine.engine.sx - r.left}px`);
el.style.setProperty("--fy", `${_engine.engine.sy - r.top}px`);
}
if (t - last > 1 && clock.current) {
last = t;
clock.current.textContent = new Date().toLocaleTimeString(lang === "fa" ? "fa-IR" : [], {
hour: "2-digit",
minute: "2-digit"
});
}
});
return off;
}, [lang]);
const submit = e => {
e.preventDefault();
const subject = encodeURIComponent(`Project inquiry from ${form.name || "a curious human"}`);
const body = encodeURIComponent(`${form.msg}\n\n— ${form.name}\n${form.email}`);
window.location.href = `mailto:${_data.EMAIL}?subject=${subject}&body=${body}`;
setBurst(b => b + 1);
};
return /*#__PURE__*/React.createElement("section", {
id: "contact",
className: "relative overflow-hidden px-5 pb-10 pt-32 md:px-10 md:pt-48 lg:ps-28"
}, /*#__PURE__*/React.createElement(_ui.Reveal, null, /*#__PURE__*/React.createElement("div", {
className: "mono mb-8 flex items-center gap-4 text-white/50"
}, /*#__PURE__*/React.createElement("span", {
className: "text-[var(--acid)]"
}, (0, _i18n.toPersianDigits)("08", lang)), /*#__PURE__*/React.createElement("span", {
className: "h-px w-16 bg-white/25"
}), /*#__PURE__*/React.createElement("span", null, d.contact.label))), /*#__PURE__*/React.createElement(_ui.SplitHeading, {
text: d.contact.title,
className: "max-w-6xl font-display text-[clamp(2.6rem,7.8vw,7.8rem)] font-semibold leading-[1.08] tracking-[-0.03em]"
}), /*#__PURE__*/React.createElement("div", {
className: "mt-20 grid gap-10 lg:grid-cols-[1fr_1fr]"
}, /*#__PURE__*/React.createElement(_ui.Reveal, null, /*#__PURE__*/React.createElement("div", {
className: "relative"
}, /*#__PURE__*/React.createElement(Burst, {
trigger: burst
}), /*#__PURE__*/React.createElement("p", {
className: "max-w-md text-lg leading-relaxed text-white/60"
}, d.contact.desc), /*#__PURE__*/React.createElement("div", {
className: "mt-8 flex flex-wrap items-center gap-4"
}, /*#__PURE__*/React.createElement(_ui.Magnetic, null, /*#__PURE__*/React.createElement("button", {
onClick: copy,
className: "btn btn-solid",
"data-cursor": d.contact.cursorCopy
}, copied ? d.contact.copied : _data.EMAIL)), /*#__PURE__*/React.createElement(_ui.Magnetic, null, /*#__PURE__*/React.createElement("a", {
className: "btn",
href: `mailto:${_data.EMAIL}`
}, d.contact.openMail))), /*#__PURE__*/React.createElement("div", {
className: "mt-12 flex flex-wrap gap-x-8 gap-y-3"
}, SOCIALS.map(s => /*#__PURE__*/React.createElement("a", {
key: s.n,
href: s.href,
target: "_blank",
rel: "noreferrer",
className: "group mono flex items-center gap-2 text-white/60 transition-colors hover:text-[var(--acid)]"
}, s.n, /*#__PURE__*/React.createElement("span", {
className: "transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
}, "\u2197")))))), /*#__PURE__*/React.createElement(_ui.Reveal, {
delay: 150
}, /*#__PURE__*/React.createElement("form", {
onSubmit: submit,
className: "glass space-y-4 rounded-3xl p-6 md:p-8"
}, /*#__PURE__*/React.createElement("div", {
className: "mono !text-[10px] text-white/40"
}, d.contact.formHeader), [["name", d.contact.namePh, "text"], ["email", d.contact.emailPh, "email"]].map(([k, ph, type]) => /*#__PURE__*/React.createElement("input", {
key: k,
required: true,
type: type,
value: form[k],
onChange: e => setForm({
...form,
[k]: e.target.value
}),
placeholder: ph,
className: "w-full border-b border-white/15 bg-transparent py-3 text-lg outline-none transition-colors focus:border-[var(--acid)]"
})), /*#__PURE__*/React.createElement("textarea", {
required: true,
rows: 4,
value: form.msg,
onChange: e => setForm({
...form,
msg: e.target.value
}),
placeholder: d.contact.msgPh,
className: "w-full resize-none border-b border-white/15 bg-transparent py-3 text-lg outline-none transition-colors focus:border-[var(--acid)]"
}), /*#__PURE__*/React.createElement("button", {
type: "submit",
className: "btn btn-solid w-full justify-center"
}, d.contact.submitBtn)))), /*#__PURE__*/React.createElement("div", {
ref: foot,
className: "relative mt-32 select-none",
dir: "ltr"
}, /*#__PURE__*/React.createElement("div", {
className: "whitespace-nowrap text-center font-display font-extrabold leading-[.8] tracking-[-0.06em]",
style: {
fontSize: "clamp(3.4rem, 15.4vw, 17rem)",
WebkitTextStroke: "1px rgba(255,255,255,.18)",
color: "transparent",
backgroundImage: "radial-gradient(circle 280px at var(--fx,50%) var(--fy,50%), var(--c2), var(--c1) 45%, transparent 75%)",
WebkitBackgroundClip: "text",
backgroundClip: "text"
}
}, d.contact.footerBrand)), /*#__PURE__*/React.createElement("div", {
className: "mono mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 !text-[10px] text-white/40 md:flex-row"
}, /*#__PURE__*/React.createElement("span", null, d.contact.copyright), /*#__PURE__*/React.createElement("span", null, d.contact.localTime, " ", /*#__PURE__*/React.createElement("span", {
ref: clock,
className: "text-white/70"
}), " \xB7 ", d.contact.konamiHint), /*#__PURE__*/React.createElement("button", {
onClick: () => (0, _engine.scrollToId)("hero"),
className: "transition-colors hover:text-[var(--acid)]"
}, d.contact.backToTop)));
}
},
"app:App":function(module,exports,_req){
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = App;
var _react = _req("react");
var _data = _req("app:data");
var _engine = _req("app:lib/engine");
var _i18n = _req("app:lib/i18n");
var _Background = _interopRequireDefault(_req("app:components/Background"));
var _Loader = _interopRequireDefault(_req("app:components/Loader"));
var _Cursor = _interopRequireDefault(_req("app:components/Cursor"));
var _Nav = _interopRequireDefault(_req("app:components/Nav"));
var _Hero = _interopRequireDefault(_req("app:components/Hero"));
var _Manifesto = _interopRequireDefault(_req("app:components/Manifesto"));
var _Capabilities = _interopRequireDefault(_req("app:components/Capabilities"));
var _Works = _interopRequireDefault(_req("app:components/Works"));
var _SkillGraph = _interopRequireDefault(_req("app:components/SkillGraph"));
var _Lab = _interopRequireDefault(_req("app:components/Lab"));
var _AskAli = _interopRequireDefault(_req("app:components/AskAli"));
var _Journey = _interopRequireDefault(_req("app:components/Journey"));
var _Contact = _interopRequireDefault(_req("app:components/Contact"));
var _ui = _req("app:components/ui");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function Bands() {
const {
lang
} = (0, _i18n.useI18n)();
const d = (0, _data.getData)(lang);
return /*#__PURE__*/React.createElement("div", {
className: "relative z-10 -my-4 overflow-hidden py-16 md:py-24"
}, /*#__PURE__*/React.createElement("div", {
className: "-mx-10 -rotate-2 border-y border-white/10 bg-[#05060a]/60 py-4 backdrop-blur-md"
}, /*#__PURE__*/React.createElement(_ui.Marquee, {
items: d.marqueeA,
className: "font-display text-4xl font-semibold tracking-tight md:text-6xl"
})), /*#__PURE__*/React.createElement("div", {
className: "-mx-10 mt-3 rotate-1 border-y border-white/10 py-3"
}, /*#__PURE__*/React.createElement(_ui.Marquee, {
items: d.marqueeB,
dir: -1,
outline: true,
className: "font-display text-5xl font-extrabold tracking-[-0.04em] md:text-8xl"
})));
}
function InnerApp() {
const [ready, setReady] = (0, _react.useState)(false);
(0, _react.useEffect)(() => {
(0, _engine.startEngine)();
window.scrollTo(0, 0);
}, []);
const done = (0, _react.useCallback)(() => {
setReady(true);
_engine.engine.lenis?.start();
}, []);
return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Background.default, null), /*#__PURE__*/React.createElement(_Loader.default, {
onDone: done
}), /*#__PURE__*/React.createElement(_Cursor.default, null), /*#__PURE__*/React.createElement(_Nav.default, {
ready: ready
}), /*#__PURE__*/React.createElement("main", {
className: "relative z-10"
}, /*#__PURE__*/React.createElement(_Hero.default, {
ready: ready
}), /*#__PURE__*/React.createElement(Bands, null), /*#__PURE__*/React.createElement(_Manifesto.default, null), /*#__PURE__*/React.createElement(_Capabilities.default, null), /*#__PURE__*/React.createElement(_Works.default, null), /*#__PURE__*/React.createElement(_SkillGraph.default, null), /*#__PURE__*/React.createElement(_Lab.default, null), /*#__PURE__*/React.createElement(_AskAli.default, null), /*#__PURE__*/React.createElement(_Journey.default, null), /*#__PURE__*/React.createElement(_Contact.default, null)), /*#__PURE__*/React.createElement("div", {
className: "grain"
}));
}
function App() {
return /*#__PURE__*/React.createElement(_i18n.I18nProvider, null, /*#__PURE__*/React.createElement(InnerApp, null));
}
},
});
(function() {
  class LenisShim {
    constructor(opts) {
      this.lerp = (opts && opts.lerp) || 0.1;
      this.scroll = window.scrollY || 0;
      this.targetScroll = window.scrollY || 0;
      this.velocity = 0;
      this.stopped = false;
      window.addEventListener("scroll", () => {
        this.targetScroll = window.scrollY || document.documentElement.scrollTop || 0;
      }, { passive: true });
    }
    stop() { this.stopped = true; document.documentElement.classList.add("lenis-stopped"); }
    start() { this.stopped = false; document.documentElement.classList.remove("lenis-stopped"); }
    raf() {
      const prev = this.scroll;
      const cur = window.scrollY || document.documentElement.scrollTop || 0;
      this.scroll += (cur - this.scroll) * 0.22;
      this.velocity = (this.scroll - prev) * 0.6;
    }
    scrollTo(target) {
      if (typeof target === "string") target = document.querySelector(target);
      if (target && typeof target.getBoundingClientRect === "function") target.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    }
  }
  const externals = {
    "react": window.React,
    "react-dom": window.ReactDOM,
    "react-dom/client": { createRoot: function(el) { return window.ReactDOM.createRoot(el); } },
    "lenis": { __esModule: true, default: LenisShim },
    "clsx": { clsx: function() { return Array.from(arguments).flat().filter(Boolean).join(" "); } },
    "tailwind-merge": { twMerge: function(s) { return s; } }
  };
  const cache = {};
  function loadModule(id) {
    if (externals[id]) return externals[id];
    if (cache[id]) return cache[id].exports;
    const fn = window.__MODULES__[id];
    if (!fn) throw new Error("Module not found: " + id);
    const mod = { exports: {} };
    cache[id] = mod;
    fn(mod, mod.exports, loadModule);
    return mod.exports;
  }
  function boot() {
    const App = loadModule("app:App").default;
    const rootEl = document.getElementById("root");
    const root = window.ReactDOM.createRoot(rootEl);
    root.render(window.React.createElement(window.React.StrictMode, null, window.React.createElement(App)));
  }
  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", boot);
  else boot();
})();