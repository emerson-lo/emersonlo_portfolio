const { useState, useEffect, useRef, useMemo } = React;

const INK = 'rgb(53,57,53)', BG = 'rgb(248,248,248)', BLUE = 'rgb(53,163,252)', BTN = 'rgb(102,184,251)', PILL = 'rgb(150,205,250)', CHIP = 'rgb(199,227,249)', GREY = 'rgb(138,138,138)', LINE = 'rgba(53,57,53,0.18)';
const FONT = '"Albert Sans", -apple-system, sans-serif';
const tx = (s, w = 400, c = INK, x = {}) => ({ fontFamily: FONT, fontSize: s, fontWeight: w, color: c, lineHeight: '120%', ...x });
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const Tap = ({ onClick, style, children, dd }) => <div data-demo={dd} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', userSelect: 'none', WebkitTapHighlightColor: 'transparent', ...style }}>{children}</div>;

/* ---------- icons ---------- */
const ic = (w, h, vb, kids) => <svg width={w} height={h} viewBox={vb} style={{ flexShrink: 0, display: 'block', overflow: 'visible' }}>{kids}</svg>;
const sk = { fill: 'none', stroke: INK, strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
const I = {
  heart: (on, s = 17) => ic(s, s * 0.9, '0 0 16 14.4', <path d="M8 13.6S1 9.4 1 4.8A3.6 3.6 0 0 1 8 3.2a3.6 3.6 0 0 1 7 1.6C15 9.4 8 13.6 8 13.6z" fill={on ? INK : 'none'} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />),
  bubble: (s = 15) => ic(s, s, '0 0 15 15', <path d="M7.5 1.2a6.2 6.2 0 0 0-5.4 9.3L1.2 13.8l3.3-.9A6.2 6.2 0 1 0 7.5 1.2z" {...sk} strokeWidth="1.2" />),
  mark: (on, s = 16) => ic(s * 0.81, s, '0 0 13 16', <path d="M1 1h11v14l-5.5-4L1 15z" fill={on ? INK : 'none'} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />),
  back: () => ic(10, 18, '0 0 10 18', <path d="M9 1 1 9l8 8" {...sk} strokeWidth="1.8" />),
  chevR: () => ic(8, 14, '0 0 8 14', <path d="M1 1l6 6-6 6" {...sk} strokeWidth="1.6" />),
  dots: () => ic(18, 4, '0 0 18 4', <g fill={INK}><circle cx="2" cy="2" r="1.8" /><circle cx="9" cy="2" r="1.8" /><circle cx="16" cy="2" r="1.8" /></g>),
  pin: (s = 14) => ic(s * 0.8, s, '0 0 11 14', <g><path d="M5.5 13S1 8.4 1 5.3a4.5 4.5 0 0 1 9 0C10 8.4 5.5 13 5.5 13z" {...sk} strokeWidth="1.1" /><circle cx="5.5" cy="5.3" r="1.6" fill={INK} /></g>),
  check: (c = '#fff', s = 12) => ic(s, s, '0 0 12 12', <path d="M2 6.5l2.6 2.6L10 3.4" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />),
  x: (s = 12) => ic(s, s, '0 0 12 12', <path d="M2 2l8 8M10 2l-8 8" {...sk} strokeWidth="1.5" />),
  search: () => ic(15, 15, '0 0 15 15', <g {...sk} stroke={GREY}><circle cx="6.5" cy="6.5" r="5" /><path d="M10.3 10.3L14 14" /></g>),
  clock: () => ic(16, 16, '0 0 16 16', <g {...sk} strokeWidth="1.2"><circle cx="8" cy="8" r="6.8" /><path d="M8 4.2V8l2.6 1.6" /></g>),
  trophy: () => ic(14, 14, '0 0 14 14', <path d="M4 1.5h6v4a3 3 0 0 1-6 0zM4 3H1.5c0 2 1 3 2.6 3.2M10 3h2.5c0 2-1 3-2.6 3.2M7 8.5V11M4.5 12.5h5" {...sk} strokeWidth="1.1" />),
  tag: () => ic(14, 14, '0 0 14 14', <g {...sk} strokeWidth="1.1"><path d="M1.5 7.2V2.2c0-.4.3-.7.7-.7h5l5.3 5.3-5.7 5.7z" /><circle cx="4.6" cy="4.6" r="1" /></g>),
  gear: () => ic(14, 14, '0 0 14 14', <g {...sk} strokeWidth="1.1"><circle cx="7" cy="7" r="2" /><path d="M7 1v1.6M7 11.4V13M1 7h1.6M11.4 7H13M2.8 2.8l1.1 1.1M10.1 10.1l1.1 1.1M2.8 11.2l1.1-1.1M10.1 3.9l1.1-1.1" /></g>),
  locate: () => ic(18, 18, '0 0 18 18', <g {...sk} strokeWidth="1.4"><circle cx="9" cy="9" r="5" /><circle cx="9" cy="9" r="1.6" fill={INK} /><path d="M9 1v3M9 14v3M1 9h3M14 9h3" /></g>),
  updown: () => ic(10, 16, '0 0 10 16', <path d="M2 6l3-3 3 3M2 10l3 3 3-3" {...sk} strokeWidth="1.3" />),
  sliders: () => <img src="assets/sliders.svg" style={{ width: 23, height: 19, display: 'block' }} />,
};

/* ---------- shared chrome ---------- */
function StatusBar({ tint = 'rgba(248,248,248,0.94)' }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 50, background: tint, zIndex: 40, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: 48, top: 19, ...tx(16, 600, '#000', { lineHeight: '100%' }) }}>9:41</span>
      <div style={{ position: 'absolute', right: 32, top: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 11 }}>{[4, 6, 8, 11].map(h => <div key={h} style={{ width: 3, height: h, borderRadius: 1, background: '#000' }} />)}</div>
        <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 10.5 5.3 8.2a3.1 3.1 0 0 1 4.4 0zM3.4 6.3a5.8 5.8 0 0 1 8.2 0l-1.1 1.1a4.3 4.3 0 0 0-6 0zM1.3 4.2a8.8 8.8 0 0 1 12.4 0l-1.1 1.1a7.2 7.2 0 0 0-10.2 0z" fill="#000" /></svg>
        <div style={{ width: 24, height: 12, borderRadius: 3.5, border: '1px solid rgba(0,0,0,.4)', padding: 1.5, boxSizing: 'border-box' }}><div style={{ width: '100%', height: '100%', borderRadius: 2, background: '#000' }} /></div>
      </div>
    </div>
  );
}
function NavBar({ active }) {
  const op = k => (active === k ? 1 : 0.42);
  const ico = (k, src, w, h) => <img src={src} style={{ width: w, height: h, opacity: op(k), display: 'block' }} />;
  return (
    <div style={{ position: 'absolute', left: 0, top: 770, width: 393, height: 82, background: BG, borderTop: '0.5px solid rgba(53,57,53,0.25)', display: 'flex', gap: 47, padding: '25px 30px', alignItems: 'center', boxSizing: 'border-box', zIndex: 20 }}>
      <div style={{ width: 32, display: 'flex', justifyContent: 'center' }}>{ico('home', 'assets/nav-home.svg', 21.3, 23.3)}</div>
      <div style={{ width: 30, display: 'flex', justifyContent: 'center' }}>{ico('map', 'assets/nav-map.svg', 22.5, 22.5)}</div>
      <div style={{ width: 23, display: 'flex', justifyContent: 'center' }}>{ico('plus', 'assets/nav-plus.svg', 23, 23)}</div>
      <svg width="30" height="30" viewBox="0 0 30 30" style={{ opacity: op('events'), flexShrink: 0 }}>
        <rect x="4" y="5.5" width="22" height="21" rx="4.5" fill="none" stroke={INK} strokeWidth="2" />
        <path d="M4.5 11.5h21M10 3.2v4.2M20 3.2v4.2" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <path d="M15 13.6l1.75 3.6 3.95.45-2.92 2.7.78 3.9L15 22.3l-3.56 1.95.78-3.9-2.92-2.7 3.95-.45z" fill="none" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      <div style={{ width: 30, display: 'flex', justifyContent: 'center' }}>{ico('user', 'assets/nav-user.svg', 25, 25)}</div>
    </div>
  );
}
const Scroll = React.forwardRef(({ top = 50, bottom = 0, children, style, dd }, ref) => (
  <div ref={ref} data-demo={dd} style={{ position: 'absolute', left: 0, right: 0, top, bottom, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', ...style }}>{children}</div>
));
const TopBar = ({ onBack, title, right, size = 20 }) => (
  <div style={{ position: 'absolute', left: 0, top: 50, width: 393, height: 46, display: 'flex', alignItems: 'center', padding: '0 20px', boxSizing: 'border-box', gap: 14, zIndex: 8, background: BG }}>
    {onBack && <Tap dd="back" onClick={onBack} style={{ padding: '8px 10px 8px 0' }}>{I.back()}</Tap>}
    {title && <span style={tx(size, 600)}>{title}</span>}
    <div style={{ flex: 1 }} />{right}
  </div>
);
const BigBtn = ({ children, on = true, onClick, top = 760, style, dd }) => (
  <Tap dd={dd} onClick={on ? onClick : undefined} style={{ position: 'absolute', left: 20, top, width: 353, height: 50, borderRadius: 25, background: on ? BTN : CHIP, display: 'flex', alignItems: 'center', justifyContent: 'center', ...tx(16, 500, on ? INK : 'rgba(53,57,53,0.42)'), boxShadow: on ? '0 4px 14px rgba(53,163,252,0.28)' : 'none', transition: 'background .25s, box-shadow .25s', zIndex: 9, ...style }}>{children}</Tap>
);
const SmallPill = ({ children, onClick, bg = PILL, style, dd }) => <Tap dd={dd} onClick={onClick} style={{ padding: '7px 16px', borderRadius: 20, background: bg, ...tx(12, 400, INK, { lineHeight: '100%', whiteSpace: 'nowrap' }), ...style }}>{children}</Tap>;
function Chips({ labels, active, onPick, onFilter, dot }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: 353 }}>
      {labels.map((l, i) => (
        <Tap key={l} dd={'chip-' + i} onClick={() => onPick(i)} style={{ width: 108, height: 35, borderRadius: 20, background: i === active ? CHIP : BG, boxShadow: '0 0 8px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...tx(16, 400, INK, { lineHeight: '100%' }), transition: 'background .2s' }}>{l}</Tap>
      ))}
      <Tap dd="filter" onClick={onFilter} style={{ marginLeft: 4, position: 'relative' }}>{I.sliders()}{dot && <div style={{ position: 'absolute', right: -4, top: -4, width: 8, height: 8, borderRadius: 4, background: BLUE }} />}</Tap>
    </div>
  );
}
function Sheet({ open, onClose, height = 520, children, title }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity .3s', zIndex: 44 }} />
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: 393, height, borderRadius: '18px 18px 0 0', background: BG, boxShadow: '0 -4px 20px rgba(0,0,0,0.18)', transform: open ? 'none' : 'translateY(105%)', transition: 'transform .38s cubic-bezier(.2,.8,.2,1)', zIndex: 45, display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 60, height: 5, borderRadius: 3, background: 'rgb(217,217,217)', margin: '10px auto 6px', flexShrink: 0 }} />
        {title && <div style={{ display: 'flex', alignItems: 'center', padding: '6px 20px 12px' }}><span style={tx(20, 600)}>{title}</span><div style={{ flex: 1 }} /><Tap onClick={onClose} style={{ padding: 6 }}>{I.x(13)}</Tap></div>}
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>{children}</div>
      </div>
    </>
  );
}
function useToast() {
  const [t, setT] = useState(null);
  const tm = useRef();
  const show = msg => { clearTimeout(tm.current); setT({ msg, k: Date.now() }); tm.current = setTimeout(() => setT(null), 2100); };
  useEffect(() => () => clearTimeout(tm.current), []);
  const el = t ? <div key={t.k} style={{ position: 'absolute', left: '50%', bottom: 104, transform: 'translateX(-50%)', padding: '10px 18px', borderRadius: 22, background: 'rgba(53,57,53,0.92)', ...tx(13, 500, '#fff', { whiteSpace: 'nowrap' }), zIndex: 50, animation: 'pktoast 2.1s ease forwards', pointerEvents: 'none' }}>{t.msg}</div> : null;
  return [el, show];
}
function Field({ label, value, onChange, demo, secure, placeholder, area, dd }) {
  const [focus, setFocus] = useState(false);
  const typing = useRef();
  useEffect(() => () => clearInterval(typing.current), []);
  const onFocus = () => {
    setFocus(true);
    if (!value && demo) { let i = 0; clearInterval(typing.current); typing.current = setInterval(() => { i++; onChange(demo.slice(0, i)); if (i >= demo.length) clearInterval(typing.current); }, 38); }
  };
  const Tag = area ? 'textarea' : 'input';
  return (
    <div style={{ width: 353, borderRadius: 10, border: `1px solid ${focus ? PILL : CHIP}`, background: BG, padding: '8px 12px 9px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 3, transition: 'border-color .2s, box-shadow .2s', boxShadow: focus ? `0 0 0 3px rgba(199,227,249,0.7)` : 'none' }}>
      <span style={tx(9, 400, INK)}>{label}</span>
      <Tag data-demo={dd} value={value} placeholder={placeholder} type={secure ? 'password' : 'text'} onFocus={onFocus} onBlur={() => setFocus(false)} onChange={e => { clearInterval(typing.current); onChange(e.target.value); }} rows={area ? 3 : undefined}
        style={{ border: 'none', outline: 'none', background: 'transparent', padding: 0, margin: 0, resize: 'none', width: '100%', ...tx(14) }} />
    </div>
  );
}
const Dots3 = ({ i, top = 726 }) => (
  <div style={{ position: 'absolute', left: 0, top, width: 393, display: 'flex', justifyContent: 'center', gap: 6, zIndex: 9 }}>
    {[0, 1, 2].map(k => <div key={k} style={{ width: k === i ? 22 : 7, height: 5, borderRadius: 3, background: k === i ? 'rgb(110,112,110)' : CHIP, transition: 'width .3s, background .3s' }} />)}
  </div>
);
const Avatar = ({ src, name, s = 28 }) => src
  ? <div style={{ width: s, height: s, borderRadius: s / 2, background: `url(${src}) center / cover`, flexShrink: 0 }} />
  : <div style={{ width: s, height: s, borderRadius: s / 2, background: CHIP, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...tx(s * 0.42, 600, BLUE) }}>{(name || '?')[0].toUpperCase()}</div>;
const MapThumb = ({ w = 300, h = 70, r = 34 }) => (
  <div style={{ position: 'relative', width: w, height: h, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
    <div style={{ position: 'absolute', left: -560, top: -360, width: 1396, height: 1283, background: 'url(assets/map.jpg) center / cover' }} />
    <div style={{ position: 'absolute', left: w / 2 - r, top: h / 2 - r, width: r * 2, height: r * 2, borderRadius: r, background: 'rgba(102,184,251,0.35)', border: '1.5px solid rgb(102,184,251)', boxSizing: 'border-box' }} />
  </div>
);
const ROLL = ['pk/r1.jpg', 'pk/r2.jpg', 'pk/r3.jpg', 'pk/r4.jpg', 'pk/r5.jpg', 'pk/r6.jpg', 'pk/r7.jpg', 'pk/r8.jpg', 'pk/g1.jpg', 'pk/g3.jpg', 'pk/g5.jpg', 'pk/g6.jpg'];
function RollSheet({ open, onClose, onPick, cta = 'Choose' }) {
  const [sel, setSel] = useState(null);
  useEffect(() => { if (!open) setSel(null); }, [open]);
  return (
    <Sheet open={open} onClose={onClose} height={560} title="Camera Roll">
      <Scroll top={0} bottom={80}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {ROLL.map(s => (
            <Tap key={s} dd={'roll-' + ROLL.indexOf(s)} onClick={() => setSel(s)} style={{ position: 'relative', aspectRatio: '1', background: `url(${s}) center / cover`, boxShadow: sel === s ? `inset 0 0 0 3px ${BLUE}` : 'none' }}>
              {sel === s && <div style={{ position: 'absolute', right: 6, top: 6, width: 20, height: 20, borderRadius: 10, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pkpop .3s' }}>{I.check()}</div>}
            </Tap>
          ))}
        </div>
      </Scroll>
      <BigBtn dd="roll-cta" on={!!sel} top={undefined} style={{ bottom: 22, top: 'auto' }} onClick={() => onPick(sel)}>{cta}</BigBtn>
    </Sheet>
  );
}
function usePan(init = { x: 0, y: 0 }, lim = [900, 700]) {
  const [pan, setPan] = useState(init);
  const [dragging, setDragging] = useState(false);
  const moved = useRef(false);
  const panRef = useRef(pan); panRef.current = pan;
  const onPointerDown = e => {
    const sx = e.clientX, sy = e.clientY, p = panRef.current; moved.current = false;
    const mv = ev => { const dx = ev.clientX - sx, dy = ev.clientY - sy; if (Math.abs(dx) + Math.abs(dy) > 5) { moved.current = true; setDragging(true); } if (moved.current) setPan({ x: cl(p.x + dx, -lim[0], lim[0]), y: cl(p.y + dy, -lim[1], lim[1]) }); };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); setDragging(false); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  return { pan, setPan, dragging, moved, onPointerDown };
}
function MapLayer({ P, z = 1, children, onTap }) {
  return (
    <div data-demo="map" onPointerDown={P.onPointerDown} onClick={() => { if (!P.moved.current && onTap) onTap(); }} style={{ position: 'absolute', inset: 0, overflow: 'hidden', cursor: P.dragging ? 'grabbing' : 'grab', touchAction: 'none' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 852, transform: `translate(${P.pan.x}px,${P.pan.y}px) scale(${z})`, transformOrigin: '196px 426px', transition: P.dragging ? 'none' : 'transform .45s cubic-bezier(.2,.8,.2,1)' }}>
        <div style={{ position: 'absolute', left: -1244, top: -836, width: 3054, height: 2807, background: 'url(assets/map.jpg) center / cover' }} />
        {children}
      </div>
    </div>
  );
}

/* ================= 01 ONBOARDING ================= */
const COLLAGE = ['pk/g1.jpg', 'pk/g3.jpg', 'pk/g4.jpg', 'pk/g2.jpg', 'pk/g5.jpg', 'pk/g6.jpg'];
const INTERESTS = [['Architecture', 'pk/arch.jpg'], ['Portraits', 'pk/a1.jpg'], ['Animals', 'assets/e_c.jpg'], ['Landscapes', 'pk/a2.jpg'], ['Macro', 'assets/e_d.jpg'], ['Urban', 'assets/m2.jpg'], ['Nature', 'assets/ev1.jpg'], ['Night', 'pk/r8.jpg']];
function Onboarding() {
  const blank = { email: '', pw: '', user: '', country: '', city: '' };
  const [step, setStep] = useState(0);
  const [f, setF] = useState(blank);
  const [dialog, setDialog] = useState(false);
  const [loc, setLoc] = useState(null);
  const [picks, setPicks] = useState([]);
  const set = k => v => setF(s => ({ ...s, [k]: v }));
  useEffect(() => { if (step === 3 && !loc) { const t = setTimeout(() => setDialog(true), 700); return () => clearTimeout(t); } setDialog(false); }, [step, loc]);
  const back = () => setStep(s => Math.max(0, s - 1));
  const choose = v => { setDialog(false); setLoc(v); setTimeout(() => setStep(4), 700); };
  const reset = () => { setStep(0); setF(blank); setLoc(null); setPicks([]); };
  const toggle = n => setPicks(p => (p.includes(n) ? p.filter(x => x !== n) : [...p, n]));
  const anim = { position: 'absolute', inset: 0, animation: 'pkslide .38s cubic-bezier(.2,.8,.2,1)' };

  if (step === 0) {
    const rows = [0, 1, 2, 3, 0, 1, 2, 3];
    return (
      <div key="s0" style={{ ...anim, animation: 'pkfade .4s' }}>
        <div style={{ position: 'absolute', left: 20, top: 66, display: 'flex', gap: 6, alignItems: 'center', zIndex: 2 }}>
          <img src="assets/logo.svg" style={{ width: 30, height: 30 }} /><span style={tx(34, 700, INK, { letterSpacing: '-0.05em', lineHeight: '100%' })}>Pikspot</span>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 128, width: 393, height: 470, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(transparent, #000 8%, #000 92%, transparent)', maskImage: 'linear-gradient(transparent, #000 8%, #000 92%, transparent)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, animation: 'pkmarq 22s linear infinite' }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginLeft: r % 2 ? -40 : 60 }}>
                {[0, 1, 2].map(k => <div key={k} style={{ width: 112, height: 112, flexShrink: 0, background: `url(${COLLAGE[(r * 3 + k) % 6]}) center / cover` }} />)}
              </div>
            ))}
          </div>
        </div>
        <span style={{ position: 'absolute', left: 20, top: 614, width: 353, textAlign: 'center', ...tx(15, 400, GREY) }}>Find the best photo spots, wherever you are.</span>
        <BigBtn dd="signup" top={660} onClick={() => setStep(1)}>Sign Up</BigBtn>
        <BigBtn top={722} onClick={() => setStep(1)} style={{ background: BG, boxShadow: '0 0 10px rgba(0,0,0,0.14)', borderRadius: 4 }}>Log in</BigBtn>
      </div>
    );
  }
  if (step === 5) {
    return (
      <div key="s5" style={{ ...anim, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 40, boxSizing: 'border-box', textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: 42, background: CHIP, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pkpop .5s' }}><img src="assets/logo.svg" style={{ width: 44, height: 44 }} /></div>
        <span style={tx(26, 700)}>Welcome, {f.user || 'shutter.jules'}!</span>
        <span style={tx(15, 400, GREY, { lineHeight: '140%' })}>Your feed is tuned to {picks.slice(0, 3).join(', ')}{picks.length > 3 ? ` and ${picks.length - 3} more` : ''}, around {f.city || 'Davis, CA'}.</span>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>{INTERESTS.filter(x => picks.includes(x[0])).slice(0, 4).map(([n, s], i) => <div key={n} style={{ width: 64, height: 64, borderRadius: 8, background: `url(${s}) center / cover`, animation: `pkin .4s ${0.1 + i * 0.08}s both` }} />)}</div>
        <SmallPill onClick={reset} style={{ marginTop: 14, padding: '10px 22px', fontSize: 14 }}>Start over</SmallPill>
      </div>
    );
  }
  const titles = { 1: 'Create profile', 2: 'Where are you based?', 3: 'Enable location access', 4: 'Select your interests' };
  return (
    <div key={'s' + step} style={anim}>
      <TopBar onBack={back} />
      <span style={{ position: 'absolute', left: 22, top: 104, ...tx(20, 600) }}>{titles[step]}</span>
      {step === 1 && (
        <div style={{ position: 'absolute', left: 20, top: 144, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Field dd="f-email" label="Email" value={f.email} onChange={set('email')} demo="shuju13@gmail.com" placeholder="Enter email address" />
          <Field dd="f-pw" label="Password" value={f.pw} onChange={set('pw')} demo="photospots4ever!" secure placeholder="Create a password" />
          <Field dd="f-user" label="Username" value={f.user} onChange={set('user')} demo="shutter.jules" placeholder="Create your username" />
        </div>
      )}
      {step === 2 && (
        <div style={{ position: 'absolute', left: 20, top: 144, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Field dd="f-country" label="Country" value={f.country} onChange={set('country')} demo="United States of America" placeholder="Enter country" />
          <Field dd="f-city" label="City" value={f.city} onChange={set('city')} demo="Davis, CA" placeholder="Enter city" />
        </div>
      )}
      {step === 3 && (
        <>
          <span style={{ position: 'absolute', left: 22, top: 136, width: 330, ...tx(14, 400, INK, { lineHeight: '135%' }) }}>This will help us recommend photo spots near your area!</span>
          <div style={{ position: 'absolute', left: 96, top: 290, width: 200, height: 200, borderRadius: 100, background: CHIP, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 30, borderRadius: 100, border: `1.5px solid ${PILL}`, animation: 'pkpulse 2s ease-out infinite' }} />
            <div style={{ transform: 'scale(4)' }}>{I.pin(14)}</div>
          </div>
          {loc && <span style={{ position: 'absolute', left: 0, top: 520, width: 393, textAlign: 'center', ...tx(14, 500, BLUE), animation: 'pkin .3s' }}>{loc === "Don't Allow" ? 'You can enable this later in Settings' : 'Location enabled'}</span>}
          {!loc && !dialog && <BigBtn top={760} onClick={() => setDialog(true)}>Enable location</BigBtn>}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.22)', opacity: dialog ? 1 : 0, pointerEvents: dialog ? 'auto' : 'none', transition: 'opacity .3s', zIndex: 46, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 270, borderRadius: 14, background: 'rgba(242,242,242,0.97)', overflow: 'hidden', transform: dialog ? 'scale(1)' : 'scale(1.12)', transition: 'transform .3s cubic-bezier(.2,.8,.2,1)', textAlign: 'center' }}>
              <div style={{ padding: '18px 16px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={tx(16, 600, '#000')}>Allow “Pikspot” to access your location?</span>
                <span style={tx(12, 400, '#000', { lineHeight: '130%' })}>We use your location to recommend photo spots near you. Other users will not be able to see your location.</span>
              </div>
              {['Only While Using App', 'Allow Once', "Don't Allow"].map((o, i) => <Tap key={o} dd={'opt-' + i} onClick={() => choose(o)} style={{ borderTop: '0.5px solid rgba(0,0,0,0.2)', padding: '11px 0', ...tx(16, i === 0 ? 600 : 400, 'rgb(0,122,255)') }}>{o}</Tap>)}
            </div>
          </div>
        </>
      )}
      {step === 4 && (
        <>
          <span style={{ position: 'absolute', left: 22, top: 134, width: 330, ...tx(14, 400, INK, { lineHeight: '130%' }) }}>Almost there! Pick your favorite subjects to customize your home feed.</span>
          <Scroll top={180} bottom={0}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 14px', padding: '4px 20px 120px' }}>
              {INTERESTS.map(([n, s]) => {
                const on = picks.includes(n);
                return (
                  <Tap key={n} dd={'int-' + n} onClick={() => toggle(n)} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: `url(${s}) center / cover`, boxShadow: on ? `0 0 0 3px ${BLUE}` : 'none', transform: on ? 'scale(0.96)' : 'none', transition: 'transform .2s, box-shadow .2s' }}>
                      {on && <div style={{ position: 'absolute', right: 8, top: 8, width: 22, height: 22, borderRadius: 4, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pkpop .3s' }}>{I.check()}</div>}
                    </div>
                    <span style={tx(14, on ? 600 : 400)}>{n}</span>
                  </Tap>
                );
              })}
            </div>
          </Scroll>
          <BigBtn dd="start" on={picks.length > 0} onClick={() => setStep(5)}>{picks.length ? `Start Exploring! (${picks.length})` : 'Start Exploring!'}</BigBtn>
        </>
      )}
      {step < 4 && <Dots3 i={step - 1} />}
      {step === 1 && <BigBtn dd="next" on={!!(f.email && f.pw && f.user)} onClick={() => setStep(2)}>Next</BigBtn>}
      {step === 2 && <BigBtn dd="next" on={!!(f.country && f.city)} onClick={() => setStep(3)}>Next</BigBtn>}
    </div>
  );
}

/* ================= 02 HOME ================= */
const TIPS = [
  "Use the 'Vivid' filter on Instagram with reduced intensity to enhance colors without making them look over-saturated.",
  'Shoot an hour after sunrise: the light is soft, warm, and the crowds have not arrived yet.',
  'Tap and hold on your subject to lock focus and exposure before you take the shot.',
];
const FEED = [
  [{ id: 'gg', img: 'assets/gg.jpg', user: 'alex.salinas', place: 'Golden Gate Bridge, San Francisco', cap: 'Let the sun hit your face, let the wind mess up your hair, and let the quiet calm your mind.', likes: 17, com: 3 },
   { id: 'pl', img: 'assets/ladies.jpg', user: 'josh.brunson', place: 'Painted Ladies, San Francisco', cap: 'A row of charming, brightly colored houses lines a sloping street in San Francisco, glowing in the late afternoon sun.', likes: 53, com: 8 },
   { id: 'mg', img: 'assets/moongate.jpg', user: 'casey.horner', place: 'Golden Gate Park, San Francisco', cap: 'Just took a stroll around a botanical garden with my friends this afternoon. The moon gate was my favorite part.', likes: 46, com: 5 }],
  [{ id: 'ec', img: 'assets/e_e.jpg', user: 'emily.chen', place: 'Davis, California', cap: 'Every path leads to a new burst of color, a quiet bench, or the soft rustle of leaves.', likes: 69, com: 5 },
   { id: 'cy', img: 'assets/e_f.jpg', user: 'celine.yimz', place: 'Botanical Conservatory, Davis', cap: 'Sitting among a thousand tiny plants, you can almost hear them growing.', likes: 46, com: 4 },
   { id: 'ms', img: 'assets/e_c.jpg', user: 'maya.smith', place: 'Sacramento, California', cap: 'Found the friendliest model on my morning walk. Zero direction needed.', likes: 72, com: 9 }],
  [{ id: 'rw', img: 'assets/e_a.jpg', user: 'real.raymond.wong', place: 'Acropolis of Athens', cap: 'Standing here at the Acropolis, you can’t help but feel the weight of history and the whisper of the ancient world.', likes: 205, com: 17 },
   { id: 'mb', img: 'assets/p4.jpg', user: 'michel.bale', place: 'Sagrada Família, Barcelona', cap: 'The Sagrada Família rises like a dream in stone, where every curve and spire tells a story.', likes: 49, com: 6 },
   { id: 'sl', img: 'assets/p5.jpg', user: 'stacey.linipe', place: 'Monterey Bay, California', cap: 'Gentle waves roll in under a sky brushed with seabirds while sea otters float in the kelp.', likes: 56, com: 7 }],
];
function FeedPost({ p, liked, saved, onLike, onSave, onOpen }) {
  const [burst, setBurst] = useState(0);
  const [open, setOpen] = useState(false);
  const lastTap = useRef(0);
  const dbl = () => { const n = Date.now(); if (n - lastTap.current < 320) { if (!liked) onLike(); setBurst(n); } lastTap.current = n; };
  return (
    <div style={{ width: 393, animation: 'pkin .4s both' }}>
      <div data-demo={'img-' + p.id} onClick={dbl} style={{ position: 'relative', width: 393, height: 472, background: `url(${p.img}) center / cover`, cursor: 'pointer' }}>
        {burst > 0 && <div key={burst} style={{ position: 'absolute', left: 146, top: 186, animation: 'pkburst .9s ease forwards', pointerEvents: 'none' }}>{ic(100, 90, '0 0 16 14.4', <path d="M8 13.6S1 9.4 1 4.8A3.6 3.6 0 0 1 8 3.2a3.6 3.6 0 0 1 7 1.6C15 9.4 8 13.6 8 13.6z" fill="#fff" />)}</div>}
      </div>
      <div style={{ background: BG, boxShadow: '0 0 15px rgba(0,0,0,0.1)', padding: '22px 25px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={tx(20, 400, INK, { lineHeight: '100%' })}>{p.user}</span><div style={{ width: 0.5, height: 16, background: INK }} /><span style={tx(12, 400, INK, { lineHeight: '100%' })}>{p.place}</span>
        </div>
        <Tap dd={'open-' + p.id} onClick={onOpen} style={{ ...tx(16, 400, INK, { lineHeight: '125%' }), display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.cap}</Tap>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={tx(16, 400, INK, { lineHeight: '100%' })}>{p.likes + (liked ? 1 : 0)}</span>
          <Tap dd={'like-' + p.id} onClick={onLike} style={{ padding: 2 }}><div key={liked ? 'on' : 'off'} style={{ animation: liked ? 'pkpop .35s' : 'none' }}>{I.heart(liked)}</div></Tap>
          <span style={{ ...tx(16, 400, INK, { lineHeight: '100%' }), marginLeft: 10 }}>{p.com}</span>{I.bubble()}
          <div style={{ flex: 1 }} />
          <Tap dd={'save-' + p.id} onClick={onSave} style={{ padding: 2 }}><div key={saved ? 'on' : 'off'} style={{ animation: saved ? 'pkpop .35s' : 'none' }}>{I.mark(saved, 17)}</div></Tap>
        </div>
      </div>
    </div>
  );
}
function Home() {
  const [chip, setChip] = useState(0);
  const [tip, setTip] = useState(0);
  const [likes, setLikes] = useState({});
  const [saves, setSaves] = useState({});
  const [sortOpen, setSortOpen] = useState(false);
  const [open, setOpen] = useState(null);
  const [sort, setSort] = useState('Recent');
  const [toast, show] = useToast();
  const sc = useRef();
  let posts = FEED[chip].slice();
  if (sort === 'Most liked') posts.sort((a, b) => b.likes - a.likes);
  const pick = i => { setChip(i); if (sc.current && sc.current.scrollTop > 500) sc.current.scrollTo({ top: 470, behavior: 'smooth' }); };
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Scroll ref={sc} dd="feed" top={0} bottom={82}>
        <div style={{ padding: '64px 20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><img src="assets/logo.svg" style={{ width: 26, height: 26 }} /><span style={tx(32, 700, INK, { letterSpacing: '-0.05em', lineHeight: '100%' })}>Pikspot</span></div>
          <Tap dd="tip" onClick={() => setTip(t => (t + 1) % TIPS.length)} style={{ background: BG, boxShadow: `0 0 10px ${PILL}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={tx(20, 600, BLUE)}>Tip of the Day</span><div style={{ flex: 1 }} /><span style={tx(11, 400, GREY)}>{tip + 1}/{TIPS.length} · tap for next</span></div>
            <span key={tip} style={{ ...tx(16, 400, INK, { lineHeight: '120%' }), animation: 'pkin .35s' }}>{TIPS[tip]}</span>
          </Tap>
          <div style={{ background: BG, boxShadow: `0 0 10px ${PILL}`, overflow: 'hidden' }}>
            <div style={{ height: 130, background: 'url(assets/challenge.jpg) center 60% / cover' }} />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
              <span style={tx(20, 600, INK, { lineHeight: '115%' })}>This Week’s Photo Challenge:<br />Light and Shadow</span>
              <SmallPill onClick={() => show('Opens the challenge in Events')}>View Event</SmallPill>
            </div>
          </div>
          <div style={{ height: 0.5, background: 'rgba(53,57,53,0.25)', margin: '8px 0 4px' }} />
          <div style={{ position: 'relative' }}>
            <Chips labels={['Near You', 'Friends', 'Explore']} active={chip} onPick={pick} onFilter={() => setSortOpen(o => !o)} dot={sort !== 'Recent'} />
            {sortOpen && (
              <div style={{ position: 'absolute', right: 0, top: 44, width: 170, background: BG, borderRadius: 10, boxShadow: '0 6px 24px rgba(0,0,0,0.18)', padding: 6, zIndex: 5, animation: 'pkin .2s' }}>
                <span style={{ display: 'block', padding: '6px 10px', ...tx(11, 500, GREY) }}>Sort feed by</span>
                {['Recent', 'Most liked'].map(o => <Tap key={o} onClick={() => { setSort(o); setSortOpen(false); }} style={{ display: 'flex', alignItems: 'center', padding: '9px 10px', borderRadius: 6, background: sort === o ? CHIP : 'transparent', ...tx(14) }}>{o}<div style={{ flex: 1 }} />{sort === o && I.check(INK)}</Tap>)}
              </div>
            )}
          </div>
        </div>
        <div key={chip + sort} style={{ marginTop: 26, display: 'flex', flexDirection: 'column' }}>
          {posts.map(p => <FeedPost key={p.id} p={p} onOpen={() => setOpen(p)} liked={!!likes[p.id]} saved={!!saves[p.id]}
            onLike={() => setLikes(l => ({ ...l, [p.id]: !l[p.id] }))}
            onSave={() => { const on = !saves[p.id]; setSaves(s => ({ ...s, [p.id]: on })); show(on ? 'Saved to your collection' : 'Removed from saved'); }} />)}
          <div style={{ padding: '30px 0 40px', textAlign: 'center', ...tx(13, 400, GREY) }}>You're all caught up</div>
        </div>
      </Scroll>
      <NavBar active="home" />
      {toast}
      {open && <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: BG, boxShadow: '-10px 0 30px rgba(0,0,0,0.15)', animation: 'pkslide .35s cubic-bezier(.2,.8,.2,1)' }}><Detail p={open} onBack={() => setOpen(null)} /></div>}
    </div>
  );
}

/* ================= 03 POST DETAIL ================= */
const COMMENTS0 = [
  { u: 'maya.smith', t: 'This looks amazing!! How did you get that shot?', ago: '5d', replies: [{ u: 'alex.salinas', t: 'Thank you! I got there at 5 am and waited for the fog to clear.', ago: '5d' }] },
  { u: 'real.raymond.wong', t: 'omg ts so tuff', ago: '5d', replies: [] },
  { u: 'josh.brunson', t: 'What an awesome photo of the golden gate bridge!', ago: '4d', replies: [] },
];
function CommentRow({ c, onReply, depth = 0 }) {
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  return (
    <div style={{ display: 'flex', gap: 10, paddingLeft: depth ? 38 : 0, animation: c.fresh ? 'pkin .35s' : 'none' }}>
      <Avatar src={c.mine ? 'pk/a1.jpg' : null} name={c.u} s={depth ? 22 : 28} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={tx(10, 400, GREY)}>@{c.u} | {c.ago}</span>
        <span style={tx(14, 400, INK, { lineHeight: '125%' })}>{c.t}</span>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 2 }}>
          {c.replies && c.replies.length > 0 && <Tap dd={'replies-' + c.u} onClick={() => setOpen(o => !o)} style={tx(11, 500, GREY)}>{open ? '- Hide replies' : `- View Replies (${c.replies.length})`}</Tap>}
          {!depth && <Tap onClick={() => onReply(c.u)} style={tx(11, 500, GREY)}>Reply</Tap>}
          <div style={{ flex: 1 }} />
          <Tap onClick={() => setLiked(l => !l)}><div key={String(liked)} style={{ animation: liked ? 'pkpop .3s' : 'none' }}>{I.heart(liked, 12)}</div></Tap>
        </div>
        {open && <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8, animation: 'pkin .3s' }}>{c.replies.map((r, i) => <CommentRow key={i} c={r} depth={1} onReply={onReply} />)}</div>}
      </div>
    </div>
  );
}
function Detail({ p = FEED[0][0], onBack }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [menu, setMenu] = useState(false);
  const [comments, setComments] = useState(COMMENTS0);
  const [draft, setDraft] = useState('');
  const [toast, show] = useToast();
  const sc = useRef(); const inp = useRef();
  const post = () => {
    const t = draft.trim(); if (!t) return;
    setComments(cs => [...cs, { u: 'shutter.jules', t, ago: 'now', mine: true, fresh: true, replies: [] }]); setDraft('');
    setTimeout(() => sc.current && sc.current.scrollTo({ top: 99999, behavior: 'smooth' }), 60);
  };
  const reply = u => { setDraft(`@${u} `); inp.current && inp.current.focus(); };
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <TopBar onBack={onBack || (() => show('Back to feed'))} right={
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <Tap dd="d-save" onClick={() => { setSaved(s => !s); show(saved ? 'Removed from saved' : 'Saved to your collection'); }}><div key={String(saved)} style={{ animation: saved ? 'pkpop .35s' : 'none' }}>{I.mark(saved)}</div></Tap>
          <Tap dd="d-menu" onClick={() => setMenu(m => !m)} style={{ padding: '8px 0' }}>{I.dots()}</Tap>
        </div>} />
      {menu && (
        <div style={{ position: 'absolute', right: 16, top: 92, width: 170, background: BG, borderRadius: 10, boxShadow: '0 6px 24px rgba(0,0,0,0.18)', padding: 6, zIndex: 20, animation: 'pkin .2s' }}>
          {['Share', 'Copy link', 'Report'].map(o => <Tap key={o} onClick={() => { setMenu(false); show(o === 'Copy link' ? 'Link copied' : o === 'Share' ? 'Share sheet opened' : 'Thanks, we’ll review it'); }} style={{ padding: '10px 10px', borderRadius: 6, ...tx(14, 400, o === 'Report' ? 'rgb(220,70,70)' : INK) }}>{o}</Tap>)}
        </div>
      )}
      <Scroll ref={sc} dd="d-scroll" top={96} bottom={66}>
        <div onDoubleClick={() => setLiked(true)} style={{ width: 393, height: 400, background: `url(${p.img}) center / cover` }} />
        <div style={{ padding: '16px 20px 30px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar src={p.id === 'gg' ? 'assets/avatar.jpg' : null} name={p.user} s={32} /><span style={tx(14)}>{p.user}</span><div style={{ flex: 1 }} />
            <span style={tx(16)}>{p.likes + (liked ? 1 : 0)}</span>
            <Tap dd="d-like" onClick={() => setLiked(l => !l)}><div key={String(liked)} style={{ animation: liked ? 'pkpop .35s' : 'none' }}>{I.heart(liked)}</div></Tap>
            <span style={{ ...tx(16), marginLeft: 8 }}>{comments.length}</span>{I.bubble()}
          </div>
          <span style={tx(24, 700)}>{p.place.split(',')[0]}</span>
          <span style={tx(16, 400, INK, { lineHeight: '125%' })}>{p.cap}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={tx(12)}>Posted May 05, 2025 3:03 pm</span><span style={tx(10, 400, GREY)}>Taken May 05, 2025 12:00 pm</span></div>
          <div style={{ marginTop: 6 }}><MapThumb w={353} h={150} r={58} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{I.pin()}<span style={tx(12)}>Around {p.place.split(', ').slice(-1)[0]}</span><div style={{ flex: 1 }} /><SmallPill onClick={() => show('Opens this spot on the Map')}>View in Map</SmallPill></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: `0.5px solid ${LINE}`, borderBottom: `0.5px solid ${LINE}`, marginTop: 4 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={tx(13, 600)}>Apple iPhone 12</span><span style={tx(10, 400, GREY)}>Wide Camera — 26 mm ƒ 1.6</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px 16px', ...tx(10, 400, GREY) }}><span>ISO 160</span><span>26 mm</span><span>ƒ 1.6</span><span>1/1000 s</span></div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>{['#sunrise', '#SF', '#california', '#bridge'].map(t => <SmallPill key={t} bg="transparent" style={{ boxShadow: `inset 0 0 0 0.5px ${INK}` }} onClick={() => show(`Showing ${t} posts`)}>{t}</SmallPill>)}</div>
          <span style={{ ...tx(20, 600), marginTop: 10 }}>Comments ({comments.length})</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{comments.map((c, i) => <CommentRow key={i} c={c} onReply={reply} />)}</div>
        </div>
      </Scroll>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: 393, height: 66, background: BG, borderTop: `0.5px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px 10px', boxSizing: 'border-box', zIndex: 10 }}>
        <Avatar src="pk/a1.jpg" s={30} />
        <div style={{ flex: 1, height: 36, borderRadius: 18, border: `1px solid ${CHIP}`, display: 'flex', alignItems: 'center', padding: '0 6px 0 14px' }}>
          <input ref={inp} data-demo="d-input" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && post()} placeholder="Add a Comment" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', ...tx(13) }} />
          <Tap dd="d-post" onClick={post} style={{ padding: '6px 10px', ...tx(13, 600, draft.trim() ? BLUE : 'rgba(53,57,53,0.3)') }}>Post</Tap>
        </div>
      </div>
      {toast}
    </div>
  );
}

/* ================= 04 MAP ================= */
const LOCS = [
  { name: 'Golden Gate Bridge', sub: 'San Francisco, CA', x: 208, y: 408, img: 'assets/m3.jpg', photos: ['assets/m3.jpg', 'assets/m1.jpg', 'assets/m4.jpg', 'assets/m2.jpg', 'assets/gg.jpg', 'assets/avatar.jpg'] },
  { name: 'Palace of Fine Arts', sub: 'Marina, San Francisco', x: 282, y: 438, img: 'assets/moongate.jpg', photos: ['assets/moongate.jpg', 'assets/e_f.jpg', 'assets/m1.jpg', 'assets/m2.jpg'] },
  { name: 'Lands End', sub: 'San Francisco, CA', x: 122, y: 488, img: 'assets/p5.jpg', photos: ['assets/p5.jpg', 'pk/g4.jpg', 'assets/m4.jpg'] },
  { name: 'Sausalito Waterfront', sub: 'Sausalito, CA', x: 138, y: 232, img: 'assets/ev3.jpg', photos: ['assets/ev3.jpg', 'assets/e_f.jpg', 'assets/ev1.jpg'] },
  { name: 'Painted Ladies', sub: 'Alamo Square, San Francisco', x: 316, y: 578, img: 'assets/ladies.jpg', photos: ['assets/ladies.jpg', 'assets/moongate.jpg', 'pk/g1.jpg', 'pk/g3.jpg', 'pk/g6.jpg'] },
];
function MapScreen() {
  const P = usePan();
  const [z, setZ] = useState(1);
  const [sel, setSel] = useState(null);
  const [big, setBig] = useState(false);
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);
  const [me, setMe] = useState(false);
  const open = i => { setSel(i); setBig(false); setFocus(false); setQ(''); P.setPan({ x: 196 - LOCS[i].x, y: 300 - LOCS[i].y }); };
  const results = LOCS.map((l, i) => ({ ...l, i })).filter(l => !q || l.name.toLowerCase().includes(q.toLowerCase()));
  const L = sel !== null ? LOCS[sel] : null;
  const sheetH = big ? 640 : 300;
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgb(230,232,234)' }}>
      <MapLayer P={P} z={z} onTap={() => { setSel(null); setFocus(false); }}>
        {LOCS.map((m, i) => (
          <div key={i} data-demo={'marker-' + i} onClick={e => { e.stopPropagation(); if (!P.moved.current) open(i); }} style={{ position: 'absolute', left: m.x - 28, top: m.y - 64, width: 56, height: 64, transformOrigin: '28px 64px', transform: `scale(${(sel === i ? 1.14 : 1) / z})`, transition: 'transform .3s', cursor: 'pointer', zIndex: sel === i ? 3 : 1, animation: `pkpopin .45s ${0.08 * i}s both` }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, border: `3px solid ${sel === i ? BLUE : '#fff'}`, boxSizing: 'border-box', background: `url(${m.img}) center / cover`, boxShadow: '0 4px 10px rgba(0,0,0,0.25)' }} />
            <div style={{ position: 'absolute', left: 22, top: 52, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `8px solid ${sel === i ? BLUE : '#fff'}` }} />
            <div style={{ position: 'absolute', right: -9, top: -9, minWidth: 22, height: 22, borderRadius: 11, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...tx(11, 700, INK, { lineHeight: '100%' }) }}>{m.photos.length}</div>
          </div>
        ))}
        {me && <div style={{ position: 'absolute', left: 186, top: 500, width: 20, height: 20 }}><div style={{ position: 'absolute', inset: -14, borderRadius: 30, background: 'rgba(53,163,252,0.25)', animation: 'pkpulse 1.8s ease-out infinite' }} /><div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: BLUE, border: '3px solid #fff', boxSizing: 'border-box', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} /></div>}
      </MapLayer>
      <div style={{ position: 'absolute', left: 20, top: 62, width: 353, zIndex: 12 }}>
        <div style={{ height: 42, borderRadius: 21, background: 'rgb(244,244,244)', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
          {I.search()}
          <input data-demo="search" value={q} onChange={e => setQ(e.target.value)} onFocus={() => setFocus(true)} placeholder="Search for a location..." style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', ...tx(14) }} />
          {(focus || q) && <Tap onClick={() => { setFocus(false); setQ(''); }} style={tx(13, 500, BLUE)}>Cancel</Tap>}
        </div>
        {(focus || q) && (
          <div style={{ marginTop: 8, borderRadius: 14, background: BG, boxShadow: '0 6px 24px rgba(0,0,0,0.16)', overflow: 'hidden', animation: 'pkin .2s' }}>
            <span style={{ display: 'block', padding: '12px 16px 6px', ...tx(11, 500, GREY) }}>{q ? 'Results' : 'Popular nearby'}</span>
            {results.length === 0 && <span style={{ display: 'block', padding: '8px 16px 16px', ...tx(13, 400, GREY) }}>No spots found for “{q}”</span>}
            {results.map(l => (
              <Tap key={l.i} dd={'res-' + l.i} onClick={() => open(l.i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 6, background: `url(${l.img}) center / cover` }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}><span style={tx(14, 500)}>{l.name}</span><span style={tx(11, 400, GREY)}>{l.sub} · {l.photos.length} photos</span></div>
              </Tap>
            ))}
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', right: 20, top: 122, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 11, opacity: (focus || q) ? 0 : 1, transition: 'opacity .2s' }}>
        <div style={{ width: 38, borderRadius: 8, background: BG, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tap dd="zoom-in" onClick={() => setZ(v => cl(v + 0.25, 0.75, 2))} style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', ...tx(22) }}>+</Tap>
          <div style={{ width: 20, height: 0.5, background: 'rgba(53,57,53,0.3)' }} />
          <Tap dd="zoom-out" onClick={() => setZ(v => cl(v - 0.25, 0.75, 2))} style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', ...tx(22) }}>−</Tap>
        </div>
        <Tap dd="locate" onClick={() => { setMe(true); setSel(null); P.setPan({ x: 0, y: -60 }); setZ(1); }} style={{ width: 38, height: 38, borderRadius: 8, background: BG, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.locate()}</Tap>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 770 - (L ? sheetH : 0), width: 393, height: 660, borderRadius: '16px 16px 0 0', background: BG, boxShadow: '0 -2px 12px rgba(0,0,0,0.2)', zIndex: 15, transition: 'top .4s cubic-bezier(.2,.8,.2,1)' }}>
        <Tap onClick={() => setBig(b => !b)} style={{ padding: '10px 0 14px' }}><div style={{ width: 60, height: 5, borderRadius: 3, background: 'rgb(217,217,217)', margin: '0 auto' }} /></Tap>
        {L && (
          <div key={sel} style={{ padding: '0 20px', animation: 'pkfade .3s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={tx(20, 600)}>{L.name}</span><span style={tx(12, 400, GREY)}>{L.sub} · {L.photos.length} photos</span></div>
              <div style={{ flex: 1 }} /><Tap dd="sheet-more" onClick={() => setBig(b => !b)} style={{ ...tx(12, 500, BLUE), padding: '4px 0' }}>{big ? 'Show less' : 'See all'}</Tap>
            </div>
            {big
              ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>{L.photos.map((s, i) => <div key={i} style={{ aspectRatio: '0.78', borderRadius: 6, background: `url(${s}) center / cover`, animation: `pkin .3s ${i * 0.04}s both` }} />)}</div>
              : <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', margin: '0 -20px', padding: '0 20px' }}>{L.photos.map((s, i) => <div key={i} style={{ width: 108, height: 150, flexShrink: 0, borderRadius: 6, background: `url(${s}) center / cover` }} />)}</div>}
          </div>
        )}
      </div>
      <NavBar active="map" />
      <StatusBar tint="rgba(248,248,248,0.8)" />
    </div>
  );
}

/* ================= 05 EVENTS ================= */
const EVENTS = [
  { id: 'gh', c: 0, img: 'assets/ev1.jpg', title: 'Golden Hour', prompt: 'Shoot during the hour after sunrise or before sunset for warm, soft light.', loc: 'Daly City, CA', left: '2 days, 14 hours', d: 2.6 },
  { id: 'cf', c: 0, img: 'assets/e_e.jpg', title: 'Campus Frames', prompt: 'Take photos that show the spirit of your campus. Look for hidden corners, small details, or everyday moments.', loc: 'UC Davis Campus', left: '4 days, 23 hours', d: 4.9 },
  { id: 'ts', c: 0, img: 'assets/e_b.jpg', title: 'The Streets', prompt: 'Capture a detail, a moment, or a mood from the street.', loc: 'Sacramento, CA', left: '6 days', d: 6 },
  { id: 'pp', c: 1, img: 'assets/e_f.jpg', title: 'Plant Parenthood', prompt: 'Hosted by celine.yimz. Show us the greenest corner you can find.', loc: 'Davis Botanical Conservatory', left: '1 day, 3 hours', d: 1.1 },
  { id: 'cc', c: 1, img: 'assets/e_c.jpg', title: 'Cat Café Crawl', prompt: 'Hosted by maya.smith. Portraits of the neighborhood’s best four-legged locals.', loc: 'Midtown Sacramento', left: '5 days', d: 5 },
  { id: 'rf', c: 2, img: 'pk/g3.jpg', title: 'Reflections', prompt: 'Find a surface that mirrors the world: water, glass, puddles, or chrome.', loc: 'Anywhere', left: '3 days, 2 hours', d: 3.1 },
  { id: 'ac', c: 2, img: 'pk/g4.jpg', title: 'Above the Clouds', prompt: 'Climb high and shoot the sea of clouds below you.', loc: 'Anywhere', left: '9 days', d: 9 },
];
const PAST = [
  { id: 'lt', img: 'pk/r8.jpg', title: 'Light Trails', ended: 'Ended 3 days ago', subs: 41, win: ['pk/r8.jpg', 'assets/m1.jpg', 'pk/g2.jpg'] },
  { id: 'bb', img: 'assets/m4.jpg', title: 'Bay Bridges', ended: 'Ended 2 weeks ago', subs: 67, win: ['assets/m4.jpg', 'assets/m3.jpg', 'assets/m2.jpg'] },
];
function EventCard({ e, saved, onSave, onView }) {
  return (
    <div style={{ width: 353, background: BG, boxShadow: '0 0 10px rgba(0,0,0,0.1)', overflow: 'hidden', flexShrink: 0, animation: 'pkin .35s both' }}>
      <div style={{ height: 170, background: `url(${e.img}) center / cover` }} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}><span style={tx(16, 500, BLUE)}>{e.title}</span><div style={{ flex: 1 }} /><Tap dd={'save-' + e.id} onClick={onSave} style={{ padding: 2 }}><div key={String(saved)} style={{ animation: saved ? 'pkpop .35s' : 'none' }}>{I.mark(saved)}</div></Tap></div>
        <span style={tx(12, 400, INK, { lineHeight: '125%' })}><b>Prompt:</b> {e.prompt}</span>
        <span style={tx(12)}><b>Location:</b> {e.loc}</span>
        <span style={tx(12)}><b>Time Left:</b> {e.left}</span>
        <SmallPill onClick={onView} style={{ marginTop: 6 }}>View Event</SmallPill>
      </div>
    </div>
  );
}
function Events() {
  const [view, setView] = useState('list');
  const [chip, setChip] = useState(0);
  const [saved, setSaved] = useState({ gh: true });
  const [filt, setFilt] = useState({ open: false, time: 'Any', dist: 25 });
  const [sTab, setSTab] = useState(0);
  const [roll, setRoll] = useState(false);
  const [sub, setSub] = useState(null);
  const [mine, setMine] = useState([]);
  const [toast, show] = useToast();
  const toggle = id => { const on = !saved[id]; setSaved(s => ({ ...s, [id]: on })); show(on ? 'Event saved' : 'Removed from saved events'); };
  const passT = e => filt.time === 'Any' || (filt.time === '< 3 days' ? e.d < 3 : e.d <= 7);
  const list = [...mine, ...EVENTS].filter(e => e.c === chip && passT(e));
  const slide = { position: 'absolute', inset: 0, animation: 'pkslide .35s cubic-bezier(.2,.8,.2,1)' };

  let body;
  if (view === 'create') {
    body = <div key="cr" style={slide}><CreateEvent onBack={() => setView('list')} onDone={e => { setMine(m => [e, ...m]); setChip(0); setFilt(f => ({ ...f, time: 'Any' })); setView('list'); show('Your event is live'); }} /></div>;
  } else if (view === 'challenge') {
    body = (
      <div key="ch" style={slide}>
        <TopBar onBack={() => setView('list')} right={<Tap onClick={() => toggle('ls')}>{I.mark(!!saved.ls)}</Tap>} />
        <Scroll dd="ch-scroll" top={96} bottom={82}>
          <div style={{ height: 230, background: 'url(assets/challenge.jpg) center 60% / cover' }} />
          <div style={{ padding: '16px 20px 30px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={tx(11, 400, GREY)}>{sub ? 53 : 52} submissions</span>
            <span style={tx(22, 700, INK, { lineHeight: '115%' })}>This Week’s Photo Challenge:<br />Light and Shadow</span>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={tx(12, 500)}>3 days remaining!</span><div style={{ flex: 1 }} />
              {sub ? <SmallPill bg={CHIP} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>{I.check(INK, 10)} Submitted</SmallPill> : <SmallPill dd="submit" onClick={() => setRoll(true)}>Submit Photo</SmallPill>}
            </div>
            <span style={tx(14, 600)}>Prompt:</span>
            <span style={tx(13, 400, INK, { lineHeight: '135%' })}>Explore the contrast between light and shadow in your environment. Whether indoors or outdoors, capture a moment where light creates interesting shapes, patterns, or contrasts.</span>
            <span style={{ ...tx(14, 600), marginTop: 8 }}>Submissions:</span>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, filter: sub ? 'none' : 'blur(28px) brightness(0.85)', transform: sub ? 'none' : 'scale(1.15)', transition: 'filter .7s, transform .7s' }}>
                {(sub ? [sub] : []).concat(['assets/challenge.jpg', 'pk/g4.jpg', 'assets/moongate.jpg', 'pk/r8.jpg', 'assets/e_b.jpg', 'pk/g2.jpg', 'assets/m2.jpg', 'pk/g6.jpg']).map((s, i) => (
                  <div key={s + i} style={{ position: 'relative', aspectRatio: '1', background: `url(${s}) center / cover` }}>
                    {sub && i === 0 && <span style={{ position: 'absolute', left: 6, top: 6, padding: '3px 7px', borderRadius: 10, background: BLUE, ...tx(10, 600, '#fff') }}>You</span>}
                  </div>
                ))}
              </div>
              {!sub && <div style={{ position: 'absolute', inset: 0, background: 'rgba(25,27,25,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', ...tx(15, 600, '#fff', { lineHeight: '140%', textShadow: '0 1px 8px rgba(0,0,0,0.45)' }) }}>Participant submissions are hidden until you submit a photo.</div>}
            </div>
          </div>
        </Scroll>
        <RollSheet open={roll} onClose={() => setRoll(false)} cta="Submit to challenge" onPick={s => { setRoll(false); setSub(s); show('Submitted! Submissions unlocked'); }} />
      </div>
    );
  } else if (view === 'saved') {
    const act = EVENTS.filter(e => saved[e.id]);
    body = (
      <div key="sv" style={slide}>
        <TopBar onBack={() => setView('list')} title="Saved Events" />
        <div style={{ position: 'absolute', left: 20, top: 104, display: 'flex', gap: 8, zIndex: 3 }}>
          {['Active', 'Past'].map((l, i) => <Tap key={l} dd={'stab-' + i} onClick={() => setSTab(i)} style={{ width: 86, height: 35, borderRadius: 20, background: sTab === i ? CHIP : BG, boxShadow: '0 0 8px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...tx(16) }}>{l}</Tap>)}
        </div>
        <Scroll top={154} bottom={82}>
          <div key={sTab} style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '6px 20px 30px' }}>
            {sTab === 0 && act.length === 0 && <span style={{ padding: '60px 20px', textAlign: 'center', ...tx(14, 400, GREY) }}>No saved events yet. Tap the bookmark on any event to keep it here.</span>}
            {sTab === 0 && act.map(e => <EventCard key={e.id} e={e} saved onSave={() => toggle(e.id)} onView={() => show(`Opening ${e.title}`)} />)}
            {sTab === 1 && <PastCard p={PAST[1]} />}
          </div>
        </Scroll>
      </div>
    );
  } else if (view === 'past') {
    body = (
      <div key="pa" style={slide}>
        <TopBar onBack={() => setView('list')} title="Past Events" />
        <Scroll top={100} bottom={82}><div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '6px 20px 30px' }}>{PAST.map(p => <PastCard key={p.id} p={p} />)}</div></Scroll>
      </div>
    );
  } else {
    body = (
      <div key="ls" style={{ position: 'absolute', inset: 0, animation: 'pkfade .3s' }}>
        <Scroll dd="ev-scroll" top={50} bottom={82}>
          <div style={{ padding: '14px 20px 30px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={tx(24, 600, BLUE)}>Community Events</span><div style={{ flex: 1 }} />
              <Tap dd="create" onClick={() => setView('create')} style={{ width: 26, height: 26, borderRadius: 13, background: PILL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ic(12, 12, '0 0 12 12', <path d="M6 1v10M1 6h10" {...sk} strokeWidth="1.6" />)}</Tap>
              <Tap dd="saved-btn" onClick={() => { setSTab(0); setView('saved'); }} style={{ position: 'relative' }}>{I.mark(false, 18)}{Object.values(saved).some(Boolean) && <div style={{ position: 'absolute', right: -5, top: -4, minWidth: 14, height: 14, borderRadius: 7, background: BLUE, ...tx(9, 700, '#fff', { lineHeight: '14px' }), textAlign: 'center' }}>{Object.values(saved).filter(Boolean).length}</div>}</Tap>
              <Tap dd="clock" onClick={() => setView('past')}>{I.clock()}</Tap>
            </div>
            <div style={{ background: BG, boxShadow: `0 0 10px ${PILL}`, overflow: 'hidden' }}>
              <div style={{ height: 150, background: 'url(assets/challenge.jpg) center 60% / cover' }} />
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                <span style={tx(20, 600, INK, { lineHeight: '115%' })}>This Week’s Photo Challenge:<br />Light and Shadow</span>
                <span style={tx(12, 400, INK, { lineHeight: '125%' })}><b>Prompt:</b> Explore the contrast between light and shadow in your environment.</span>
                <span style={tx(12)}><b>Time Left:</b> 3 Days</span>
                <SmallPill dd="challenge" onClick={() => setView('challenge')} style={{ marginTop: 4 }}>View Event</SmallPill>
              </div>
            </div>
            <Chips labels={['Near You', 'Friends', 'Global']} active={chip} onPick={setChip} onFilter={() => setFilt(f => ({ ...f, open: true }))} dot={filt.time !== 'Any'} />
            <div key={chip + filt.time} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {list.length === 0 && <span style={{ padding: '30px 10px', textAlign: 'center', ...tx(14, 400, GREY) }}>No events match your filters.</span>}
              {list.map(e => <EventCard key={e.id} e={e} saved={!!saved[e.id]} onSave={() => toggle(e.id)} onView={() => show(`Opening ${e.title}`)} />)}
            </div>
          </div>
        </Scroll>
        <Sheet open={filt.open} onClose={() => setFilt(f => ({ ...f, open: false }))} height={400} title="Filters">
          <div style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex' }}><span style={tx(14, 600)}>Distance</span><div style={{ flex: 1 }} /><span style={tx(13, 400, GREY)}>Within {filt.dist} mi</span></div>
            <input data-demo="dist" type="range" min="5" max="100" step="5" value={filt.dist} onChange={e => setFilt(f => ({ ...f, dist: +e.target.value }))} style={{ width: '100%', accentColor: BLUE }} />
            <span style={{ ...tx(14, 600), marginTop: 6 }}>Time left</span>
            <div style={{ display: 'flex', gap: 8 }}>{['Any', '< 3 days', 'This week'].map(t => <Tap key={t} dd={'time-' + t} onClick={() => setFilt(f => ({ ...f, time: t }))} style={{ padding: '9px 16px', borderRadius: 20, background: filt.time === t ? CHIP : BG, boxShadow: '0 0 6px rgba(0,0,0,0.2)', ...tx(14) }}>{t}</Tap>)}</div>
          </div>
          <BigBtn dd="apply" top={undefined} style={{ top: 'auto', bottom: 26 }} onClick={() => { setFilt(f => ({ ...f, open: false })); show('Filters applied'); }}>Apply filters</BigBtn>
        </Sheet>
      </div>
    );
  }
  return (<div style={{ position: 'absolute', inset: 0 }}>{body}{view !== 'create' && <NavBar active="events" />}{toast}</div>);
}
function PastCard({ p }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ width: 353, background: BG, boxShadow: '0 0 10px rgba(0,0,0,0.1)', overflow: 'hidden', animation: 'pkin .35s both' }}>
      <div style={{ height: 140, background: `url(${p.img}) center / cover`, filter: 'grayscale(0.5)' }} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={tx(16, 500, BLUE)}>{p.title}</span>
        <span style={tx(12, 400, GREY)}>{p.ended} · {p.subs} submissions</span>
        <SmallPill dd={'win-' + p.id} onClick={() => setOpen(o => !o)} style={{ alignSelf: 'flex-start', marginTop: 4 }}>{open ? 'Hide winners' : 'View winners'}</SmallPill>
        {open && <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>{p.win.map((s, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, animation: `pkin .3s ${i * 0.07}s both` }}>
            <div style={{ aspectRatio: '1', borderRadius: 6, background: `url(${s}) center / cover` }} /><span style={tx(10, 600)}>{['1st', '2nd', '3rd'][i]}</span>
          </div>))}</div>}
      </div>
    </div>
  );
}

/* ================= 06 CREATE EVENT ================= */
const FRIENDS = ['alex.salinas', 'maya.smith', 'josh.brunson', 'emily.chen', 'real.raymond.wong', 'celine.yimz'];
const TIMES = ['12:00 AM', '6:00 AM', '9:00 AM', '12:00 PM', '5:00 PM', '8:00 PM', '11:59 PM'];
const DatePill = ({ children, onClick, dd }) => <Tap dd={dd} onClick={onClick} style={{ padding: '6px 10px', borderRadius: 6, background: 'rgb(226,226,226)', ...tx(14, 400, INK, { lineHeight: '100%' }) }}>{children}</Tap>;
const Card = ({ children, style }) => <div style={{ width: 353, borderRadius: 14, border: `1px solid ${CHIP}`, background: BG, overflow: 'hidden', ...style }}>{children}</div>;
function CreateEvent({ onBack, onDone }) {
  const init = { img: null, title: '', loc: '', sd: 25, st: '12:00 AM', ed: 31, et: '11:59 PM', prompt: '', type: 'Public', inv: [] };
  const [f, setF] = useState(init);
  const [sheet, setSheet] = useState(null);
  const [typeOpen, setTypeOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const ok = f.img && f.title.trim() && f.prompt.trim();
  const create = () => { setBusy(true); setTimeout(() => { setBusy(false); setDone(true); }, 900); };
  const inp = { border: 'none', outline: 'none', background: 'transparent', width: '100%', ...tx(17) };
  if (done) {
    return (
      <div style={{ position: 'absolute', inset: 0, animation: 'pkfade .35s', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 90, gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: BTN, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pkpop .5s' }}>{I.check('#fff', 28)}</div>
        <span style={tx(24, 700)}>Event created!</span>
        <span style={tx(14, 400, GREY)}>{f.type === 'Private' ? `Invites sent to ${f.inv.length || 'no'} friend${f.inv.length === 1 ? '' : 's'}` : 'Your event is live in Community Events'}</span>
        <div style={{ marginTop: 10, animation: 'pkin .45s .15s both' }}><EventCard e={{ img: f.img, title: f.title, prompt: f.prompt, loc: f.loc || 'Anywhere', left: `${f.ed - f.sd} days` }} saved onSave={() => {}} onView={() => {}} /></div>
        {onDone ? <SmallPill dd="c-view" onClick={() => onDone({ id: 'mine' + Date.now(), c: 0, d: f.ed - f.sd, img: f.img, title: f.title, prompt: f.prompt, loc: f.loc || 'Anywhere', left: `${f.ed - f.sd} days` })} style={{ marginTop: 10, padding: '10px 22px', fontSize: 14 }}>View in Events</SmallPill> : <SmallPill onClick={() => { setF(init); setDone(false); }} style={{ marginTop: 10, padding: '10px 22px', fontSize: 14 }}>Create another</SmallPill>}
      </div>
    );
  }
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const which = sheet && sheet[0];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <TopBar onBack={onBack || (() => setF(init))} />
      <Scroll top={96} bottom={96}>
        <Tap dd="cover" onClick={() => setSheet('img')} style={{ height: 210, background: 'rgb(240,240,240)', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 270, height: 210, background: f.img ? `url(${f.img}) center / cover` : 'rgb(152,153,150)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .3s' }}>
            {!f.img && <span style={tx(17, 400, '#fff')}>Choose Image</span>}
            {f.img && <span style={{ position: 'absolute', right: 8, bottom: 8, padding: '5px 10px', borderRadius: 12, background: 'rgba(0,0,0,0.55)', ...tx(11, 500, '#fff') }}>Change</span>}
          </div>
        </Tap>
        <div style={{ padding: '20px 20px 30px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${CHIP}` }}><input data-demo="c-title" value={f.title} onChange={e => set('title', e.target.value)} placeholder="New Event" style={inp} /></div>
            <div style={{ padding: '14px 16px' }}><input data-demo="c-loc" value={f.loc} onChange={e => set('loc', e.target.value)} placeholder="Location (optional)" style={inp} /></div>
          </Card>
          <Card>
            {[['Starts', 'sd', 'st'], ['Ends', 'ed', 'et']].map(([l, d, t], i) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 10px 10px 16px', borderTop: i ? `1px solid ${CHIP}` : 'none' }}>
                <span style={tx(17)}>{l}</span><div style={{ flex: 1 }} />
                <DatePill dd={'c-' + d} onClick={() => setSheet('d' + d)}>May {f[d]}, 2025</DatePill><DatePill dd={'c-' + t} onClick={() => setSheet('t' + t)}>{f[t]}</DatePill>
              </div>
            ))}
          </Card>
          <Card style={{ padding: '14px 16px' }}>
            <span style={tx(17)}>Prompt:</span>
            <textarea data-demo="c-prompt" value={f.prompt} onChange={e => set('prompt', e.target.value)} rows={3} placeholder="What should people photograph?" style={{ ...inp, ...tx(14), resize: 'none', marginTop: 6 }} />
          </Card>
          <Card style={{ overflow: 'visible' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: `1px solid ${CHIP}` }}>
              <span style={tx(17)}>Event Type</span><div style={{ flex: 1 }} />
              <Tap dd="c-type" onClick={() => setTypeOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, ...tx(14) }}>{f.type}{I.updown()}</Tap>
              {typeOpen && <div style={{ position: 'absolute', right: 10, top: 44, width: 150, background: BG, borderRadius: 10, boxShadow: '0 6px 24px rgba(0,0,0,0.18)', padding: 6, zIndex: 5, animation: 'pkin .2s' }}>
                {['Public', 'Private'].map(o => <Tap key={o} dd={'type-' + o} onClick={() => { set('type', o); setTypeOpen(false); }} style={{ display: 'flex', alignItems: 'center', padding: '9px 10px', borderRadius: 6, background: f.type === o ? CHIP : 'transparent', ...tx(14) }}>{o}<div style={{ flex: 1 }} />{f.type === o && I.check(INK)}</Tap>)}
              </div>}
            </div>
            <Tap dd="c-inv" onClick={() => setSheet('inv')} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 10 }}>
              <span style={tx(17)}>Invitees</span><div style={{ flex: 1 }} />
              {f.inv.length > 0 && <div style={{ display: 'flex' }}>{f.inv.slice(0, 3).map((n, i) => <div key={n} style={{ marginLeft: i ? -8 : 0, boxShadow: `0 0 0 2px ${BG}`, borderRadius: 12 }}><Avatar name={n} s={22} /></div>)}</div>}
              <span style={tx(13, 400, GREY)}>{f.inv.length ? `${f.inv.length} invited` : ''}</span>{I.chevR()}
            </Tap>
          </Card>
        </div>
      </Scroll>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: 393, height: 96, background: BG, zIndex: 8 }} />
      <BigBtn dd="c-create" on={!!ok} top={770} onClick={create}>{busy ? <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${INK}`, borderTopColor: 'transparent', animation: 'pkspin .7s linear infinite' }} /> : 'Create Event'}</BigBtn>
      <RollSheet open={sheet === 'img'} onClose={() => setSheet(null)} onPick={s => { set('img', s); setSheet(null); }} />
      <Sheet open={which === 'd'} onClose={() => setSheet(null)} height={430} title={sheet === 'dsd' ? 'Start date' : 'End date'}>
        <div style={{ padding: '0 20px' }}>
          <span style={tx(14, 600)}>May 2025</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginTop: 10, textAlign: 'center' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} style={tx(11, 500, GREY)}>{d}</span>)}
            {[0, 1, 2, 3].map(i => <span key={'b' + i} />)}
            {days.map(d => {
              const k = sheet === 'dsd' ? 'sd' : 'ed'; const on = f[k] === d; const inRange = d > f.sd && d < f.ed;
              return <Tap key={d} dd={'day-' + d} onClick={() => { set(k, d); if (k === 'sd' && d > f.ed) set('ed', d); setTimeout(() => setSheet(null), 180); }} style={{ height: 36, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? BTN : inRange ? CHIP : 'transparent', ...tx(14, on ? 600 : 400) }}>{d}</Tap>;
            })}
          </div>
        </div>
      </Sheet>
      <Sheet open={which === 't'} onClose={() => setSheet(null)} height={420} title={sheet === 'tst' ? 'Start time' : 'End time'}>
        <Scroll top={0} bottom={0}>{TIMES.map(t => { const k = sheet === 'tst' ? 'st' : 'et'; return <Tap key={t} onClick={() => { set(k, t); setSheet(null); }} style={{ display: 'flex', padding: '12px 20px', borderTop: `0.5px solid ${LINE}`, ...tx(16, f[k] === t ? 600 : 400) }}>{t}<div style={{ flex: 1 }} />{f[k] === t && I.check(BLUE, 14)}</Tap>; })}</Scroll>
      </Sheet>
      <Sheet open={sheet === 'inv'} onClose={() => setSheet(null)} height={520} title="Invite friends">
        <Scroll top={0} bottom={90}>{FRIENDS.map(n => { const on = f.inv.includes(n); return (
          <Tap key={n} dd={'fr-' + n} onClick={() => set('inv', on ? f.inv.filter(x => x !== n) : [...f.inv, n])} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px' }}>
            <Avatar name={n} s={36} /><span style={tx(15)}>{n}</span><div style={{ flex: 1 }} />
            <div style={{ width: 22, height: 22, borderRadius: 11, border: on ? 'none' : `1.5px solid ${PILL}`, background: on ? BLUE : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>{on && I.check()}</div>
          </Tap>); })}</Scroll>
        <BigBtn dd="inv-done" top={undefined} style={{ top: 'auto', bottom: 26 }} onClick={() => setSheet(null)}>{f.inv.length ? `Invite ${f.inv.length}` : 'Done'}</BigBtn>
      </Sheet>
    </div>
  );
}

/* ================= 07 UPLOAD PHOTO ================= */
const UP_EVENTS = [
  { id: 'ls', title: 'Light and Shadows', rec: true, left: '3 Days', prompt: 'Explore the contrast between light and shadow in your environment. Capture a moment where light creates interesting shapes, patterns, or contrasts.', img: 'assets/challenge.jpg' },
  { id: 'ts', title: 'The Streets', rec: true, left: '6 Days', prompt: 'Capture a detail, a moment, or a mood from the street.', img: 'assets/e_b.jpg' },
  { id: 'cf', title: 'Campus Frames', left: '4 Days', prompt: 'Take photos that show the spirit of your campus. Look for hidden corners, small details, or everyday moments.', img: 'assets/e_e.jpg' },
];
const SUGGEST = ['#sunset', '#SF', '#california', '#bridge', '#goldenhour', '#bayarea'];
function Upload() {
  const init = { step: 'roll', tab: 0, photo: 'pk/r1.jpg', title: 'Sunset at SF', cap: 'Saw a gorgeous sunset today at SF and wanted to snap a pic.', loc: null, ev: null, tags: [], exif: true, comments: true };
  const [s, setS] = useState(init);
  const [mode, setMode] = useState('pin');
  const [radius, setRadius] = useState(60);
  const [pick, setPick] = useState(null);
  const [tagIn, setTagIn] = useState('');
  const [prog, setProg] = useState(-1);
  const [setOpen, setSetOpen] = useState(false);
  const P = usePan({ x: 0, y: 0 });
  const set = (k, v) => setS(o => ({ ...o, [k]: v }));
  const go = st => set('step', st);
  const slide = { position: 'absolute', inset: 0, animation: 'pkslide .35s cubic-bezier(.2,.8,.2,1)' };
  const addTag = t => { t = t.trim(); if (!t) return; if (!t.startsWith('#')) t = '#' + t; if (!s.tags.includes(t)) set('tags', [...s.tags, t]); setTagIn(''); };
  const upload = () => { setProg(0); let p = 0; const id = setInterval(() => { p += 0.07; setProg(Math.min(p, 1)); if (p >= 1) { clearInterval(id); setTimeout(() => { setProg(-1); go('done'); }, 250); } }, 60); };
  const Row = ({ icon, label, onClick, children }) => (
    <div style={{ borderBottom: `1px solid ${CHIP}` }}>
      <Tap dd={'row-' + label} onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 4px' }}>{icon}<span style={tx(14)}>{label}</span><div style={{ flex: 1 }} />{I.chevR()}</Tap>
      {children && <div style={{ padding: '0 4px 14px 26px', animation: 'pkin .3s' }}>{children}</div>}
    </div>
  );

  if (s.step === 'roll') {
    const drafts = ['pk/r8.jpg', 'pk/r5.jpg'];
    const grid = s.tab === 0 ? ROLL : drafts;
    return (
      <div key="roll" style={{ position: 'absolute', inset: 0, animation: 'pkfade .3s' }}>
        <TopBar title="New Post" size={18} right={<Tap dd="u-next" onClick={() => go('form')} style={tx(15, 600, BLUE)}>Next</Tap>} />
        <div style={{ position: 'absolute', left: 0, top: 96, width: 393, height: 330, background: `rgb(240,240,240) url(${s.photo}) center / contain no-repeat`, transition: 'background .25s' }} />
        <div style={{ position: 'absolute', left: 0, top: 426, width: 393, height: 44, display: 'flex', borderBottom: `0.5px solid ${LINE}` }}>
          {['Camera Roll', 'Drafts'].map((l, i) => <Tap key={l} dd={'utab-' + i} onClick={() => set('tab', i)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', ...tx(14, s.tab === i ? 600 : 400, s.tab === i ? INK : GREY), boxShadow: s.tab === i ? `inset 0 -2px 0 ${BLUE}` : 'none' }}>{l}</Tap>)}
        </div>
        <Scroll top={470} bottom={0}>
          <div key={s.tab} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, paddingBottom: 30, animation: 'pkfade .25s' }}>
            {grid.map(g => (
              <Tap key={g} dd={'pick-' + grid.indexOf(g)} onClick={() => set('photo', g)} style={{ position: 'relative', aspectRatio: '1', background: `url(${g}) center / cover`, opacity: s.photo === g ? 0.75 : 1 }}>
                {s.photo === g && <div style={{ position: 'absolute', right: 6, top: 6, width: 20, height: 20, borderRadius: 10, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pkpop .3s' }}>{I.check()}</div>}
                {s.tab === 1 && <span style={{ position: 'absolute', left: 6, bottom: 6, padding: '2px 7px', borderRadius: 8, background: 'rgba(0,0,0,0.55)', ...tx(10, 500, '#fff') }}>Draft</span>}
              </Tap>
            ))}
          </div>
        </Scroll>
      </div>
    );
  }
  if (s.step === 'loc') {
    return (
      <div key="loc" style={{ ...slide, background: 'rgb(230,232,234)' }}>
        <MapLayer P={P}>{null}</MapLayer>
        <div style={{ position: 'absolute', left: 0, top: 50, width: 393, height: 96, background: 'linear-gradient(rgba(248,248,248,0.96) 60%, rgba(248,248,248,0))', zIndex: 5 }} />
        <Tap onClick={() => go('form')} style={{ position: 'absolute', left: 20, top: 64, padding: 8, zIndex: 6 }}>{I.back()}</Tap>
        <div style={{ position: 'absolute', left: 96, top: 62, width: 200, height: 34, borderRadius: 17, background: 'rgb(232,232,232)', display: 'flex', padding: 3, boxSizing: 'border-box', zIndex: 6 }}>
          <div style={{ position: 'absolute', left: mode === 'pin' ? 3 : 100, top: 3, width: 97, height: 28, borderRadius: 14, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: 'left .25s cubic-bezier(.2,.8,.2,1)' }} />
          {[['pin', 'Pinpoint'], ['radius', 'Radius']].map(([k, l]) => <Tap key={k} dd={'mode-' + k} onClick={() => setMode(k)} style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', ...tx(13, mode === k ? 600 : 400) }}>{l}</Tap>)}
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 852, pointerEvents: 'none', zIndex: 4 }}>
          {mode === 'radius' && <div style={{ position: 'absolute', left: 196 - radius, top: 400 - radius, width: radius * 2, height: radius * 2, borderRadius: radius, background: 'rgba(102,184,251,0.3)', border: '2px solid rgb(102,184,251)', boxSizing: 'border-box', transition: P.dragging ? 'none' : 'all .2s' }} />}
          <div style={{ position: 'absolute', left: 196 - 14, top: 400 - 36 - (P.dragging ? 10 : 0), transition: 'top .2s', transform: 'scale(2.4)', transformOrigin: '50% 100%' }}>{ic(14, 17, '0 0 11 14', <g><path d="M5.5 13S1 8.4 1 5.3a4.5 4.5 0 0 1 9 0C10 8.4 5.5 13 5.5 13z" fill={BLUE} stroke="#fff" strokeWidth="1" /><circle cx="5.5" cy="5.3" r="1.7" fill="#fff" /></g>)}</div>
          <div style={{ position: 'absolute', left: 190, top: 398, width: 12, height: 5, borderRadius: '50%', background: 'rgba(0,0,0,0.25)', opacity: P.dragging ? 1 : 0.6 }} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 640, width: 393, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, zIndex: 6 }}>
          <span style={{ padding: '8px 14px', borderRadius: 16, background: 'rgba(248,248,248,0.94)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', ...tx(12) }}>{mode === 'pin' ? 'Move map to select pin location' : 'Move the map and drag the slider to set the radius'}</span>
          {mode === 'radius' && <div style={{ width: 300, padding: '8px 14px', borderRadius: 16, background: 'rgba(248,248,248,0.94)', display: 'flex', alignItems: 'center', gap: 10 }}><span style={tx(11, 400, GREY)}>Size</span><input data-demo="radius" type="range" min="30" max="140" value={radius} onChange={e => setRadius(+e.target.value)} style={{ flex: 1, accentColor: BLUE }} /></div>}
        </div>
        <BigBtn dd="select-loc" top={760} onClick={() => { setS(o => ({ ...o, loc: { mode, radius }, step: 'form' })); }}>Select Location</BigBtn>
      </div>
    );
  }
  if (s.step === 'event') {
    return (
      <div key="ev" style={slide}>
        <TopBar onBack={() => go('form')} title="Select Event" />
        <Scroll top={100} bottom={96}>
          <div style={{ padding: '6px 20px 30px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {UP_EVENTS.map(e => { const on = (pick || s.ev) === e.id; return (
              <Tap key={e.id} dd={'uev-' + e.id} onClick={() => setPick(e.id)} style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 12, background: BG, boxShadow: on ? `0 0 0 2px ${BLUE}` : '0 0 10px rgba(0,0,0,0.1)', transition: 'box-shadow .2s' }}>
                <div style={{ width: 84, height: 84, borderRadius: 8, flexShrink: 0, background: `url(${e.img}) center / cover` }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={tx(15, 600, BLUE)}>{e.title}</span>{e.rec && <span style={{ padding: '2px 6px', borderRadius: 8, background: CHIP, ...tx(9, 600) }}>Recommended</span>}</div>
                  <span style={{ ...tx(11, 400, INK, { lineHeight: '130%' }), display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}><b>Prompt:</b> {e.prompt}</span>
                  <span style={tx(11, 400, GREY)}>Time Left: {e.left}</span>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: 10, border: on ? `6px solid ${BLUE}` : `1.5px solid ${PILL}`, boxSizing: 'border-box', alignSelf: 'center', transition: 'border .2s' }} />
              </Tap>); })}
          </div>
        </Scroll>
        <BigBtn dd="select-ev" on={!!(pick || s.ev)} onClick={() => { setS(o => ({ ...o, ev: pick || o.ev, step: 'form' })); setPick(null); }}>Select Event</BigBtn>
      </div>
    );
  }
  if (s.step === 'tags') {
    return (
      <div key="tg" style={slide}>
        <TopBar onBack={() => go('form')} title="Add Tags" />
        <div style={{ position: 'absolute', left: 20, top: 104, width: 353, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, height: 42, borderRadius: 21, border: `1px solid ${CHIP}`, display: 'flex', alignItems: 'center', padding: '0 14px' }}><input data-demo="tag-in" value={tagIn} onChange={e => setTagIn(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag(tagIn)} placeholder="Add Tags" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', ...tx(14) }} /></div>
          <SmallPill dd="tag-add" onClick={() => addTag(tagIn)} style={{ padding: '0 18px', display: 'flex', alignItems: 'center', fontSize: 14 }}>Add</SmallPill>
        </div>
        <div style={{ position: 'absolute', left: 20, top: 166, width: 353, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={tx(13, 600)}>Your tags</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 32 }}>
            {s.tags.length === 0 && <span style={tx(13, 400, GREY)}>No tags yet</span>}
            {s.tags.map(t => <Tap key={t} onClick={() => set('tags', s.tags.filter(x => x !== t))} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 20, background: CHIP, ...tx(13), animation: 'pkpop .3s' }}>{t}{I.x(8)}</Tap>)}
          </div>
          <span style={{ ...tx(13, 600), marginTop: 12 }}>Suggested</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{SUGGEST.filter(t => !s.tags.includes(t)).map(t => <Tap key={t} dd={'sug-' + t} onClick={() => addTag(t)} style={{ padding: '7px 12px', borderRadius: 20, boxShadow: `inset 0 0 0 0.5px ${INK}`, ...tx(13) }}>+ {t}</Tap>)}</div>
        </div>
        <BigBtn dd="tags-done" onClick={() => go('form')}>Done</BigBtn>
      </div>
    );
  }
  if (s.step === 'done') {
    const ev = UP_EVENTS.find(e => e.id === s.ev);
    return (
      <div key="dn" style={{ position: 'absolute', inset: 0, animation: 'pkfade .4s' }}>
        <TopBar title="Posted" size={18} right={<SmallPill onClick={() => { setS(init); P.setPan({ x: 0, y: 0 }); }}>Upload another</SmallPill>} />
        <Scroll dd="done-scroll" top={96} bottom={0}>
          <div style={{ height: 300, background: `rgb(240,240,240) url(${s.photo}) center / cover` }} />
          <div style={{ padding: '16px 20px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar src="pk/a1.jpg" s={32} /><span style={tx(14)}>shutter.jules</span><div style={{ flex: 1 }} /><span style={tx(16)}>0</span>{I.heart(false)}<span style={{ ...tx(16), marginLeft: 8 }}>0</span>{I.bubble()}</div>
            <span style={tx(24, 700)}>{s.title}</span>
            <span style={tx(16, 400, INK, { lineHeight: '125%' })}>{s.cap}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={tx(12)}>Posted just now</span>{s.exif && <span style={tx(10, 400, GREY)}>Taken May 05, 2025 12:00 pm · Apple iPhone 12</span>}</div>
            {ev && <span style={{ ...tx(12, 500, BLUE), display: 'flex', alignItems: 'center', gap: 6 }}>{I.trophy()} Submitted to: {ev.title}</span>}
            {s.loc && <><MapThumb w={353} h={120} r={s.loc.mode === 'radius' ? s.loc.radius * 0.45 : 8} /><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{I.pin()}<span style={tx(12)}>Around San Francisco, CA, USA</span></div></>}
            {s.tags.length > 0 && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{s.tags.map(t => <SmallPill key={t} bg="transparent" style={{ boxShadow: `inset 0 0 0 0.5px ${INK}` }}>{t}</SmallPill>)}</div>}
            <span style={{ ...tx(20, 600), marginTop: 8 }}>Comments (0)</span>
            <span style={tx(13, 400, GREY)}>{s.comments ? 'Be the first to comment.' : 'Comments are turned off for this post.'}</span>
          </div>
        </Scroll>
      </div>
    );
  }
  const ev = UP_EVENTS.find(e => e.id === s.ev);
  return (
    <div key="form" style={slide}>
      <TopBar onBack={() => go('roll')} />
      <Scroll top={96} bottom={96}>
        <div style={{ height: 216, background: `rgb(240,240,240) url(${s.photo}) center / contain no-repeat` }} />
        <div style={{ padding: '16px 20px 30px' }}>
          <input value={s.title} onChange={e => set('title', e.target.value)} style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', padding: 0, ...tx(22, 600) }} />
          <textarea value={s.cap} onChange={e => set('cap', e.target.value)} rows={2} style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', padding: 0, marginTop: 8, resize: 'none', ...tx(14, 400, INK, { lineHeight: '135%' }) }} />
          <div style={{ height: 1, background: CHIP, marginTop: 14 }} />
          <Row icon={I.pin()} label="Location" onClick={() => go('loc')}>{s.loc && <><MapThumb w={300} h={70} r={s.loc.mode === 'radius' ? cl(s.loc.radius * 0.4, 14, 34) : 6} /><span style={{ display: 'block', marginTop: 8, ...tx(11) }}>{s.loc.mode === 'radius' ? 'Around San Francisco, CA' : 'Golden Gate Overlook, San Francisco'}</span></>}</Row>
          <Row icon={I.trophy()} label="Event" onClick={() => go('event')}>{ev && <span style={tx(12)}>{ev.title}</span>}</Row>
          <Row icon={I.tag()} label="Tags" onClick={() => go('tags')}>{s.tags.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{s.tags.map(t => <span key={t} style={{ padding: '5px 10px', borderRadius: 14, boxShadow: `inset 0 0 0 0.5px ${INK}`, ...tx(11) }}>{t}</span>)}</div>}</Row>
          <Row icon={I.gear()} label="Settings" onClick={() => setSetOpen(o => !o)}>{setOpen && <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['exif', 'Show camera details'], ['comments', 'Allow comments']].map(([k, l]) => <Tap key={k} dd={'tog-' + k} onClick={() => set(k, !s[k])} style={{ display: 'flex', alignItems: 'center', ...tx(13) }}>{l}<div style={{ flex: 1 }} />
              <div style={{ width: 40, height: 24, borderRadius: 12, background: s[k] ? BTN : 'rgb(220,220,220)', position: 'relative', transition: 'background .2s' }}><div style={{ position: 'absolute', top: 2, left: s[k] ? 18 : 2, width: 20, height: 20, borderRadius: 10, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'left .2s' }} /></div></Tap>)}
          </div>}</Row>
        </div>
      </Scroll>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: 393, height: 96, background: BG, zIndex: 8 }} />
      <BigBtn dd="upload" on={!!s.loc} top={770} onClick={upload}>{s.loc ? 'Upload Photo' : 'Add a location to upload'}</BigBtn>
      {prog >= 0 && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(248,248,248,0.86)', zIndex: 46, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, animation: 'pkfade .2s' }}>
          <div style={{ width: 120, height: 120, borderRadius: 10, background: `url(${s.photo}) center / cover`, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }} />
          <span style={tx(15, 600)}>Uploading…</span>
          <div style={{ width: 220, height: 6, borderRadius: 3, background: CHIP, overflow: 'hidden' }}><div style={{ width: `${prog * 100}%`, height: '100%', background: BLUE, transition: 'width .06s linear' }} /></div>
        </div>
      )}
    </div>
  );
}

/* ================= 08 PROFILE ================= */
const ACH = [
  { id: 'refl', name: 'Reflections Champion', icon: 'pk/ach5.svg', r: 48.75 / 56.875 },
  { id: 'moment', name: 'Moment Catcher', icon: 'pk/ach3.svg', r: 43.959 / 49.738 },
  { id: 'motion', name: 'Motion Caught Still', icon: 'pk/ach4.svg', r: 56.667 / 28.333 },
  { id: 'cat', name: 'Cat-nip Clicker', icon: 'pk/ach1.svg', r: 55.502 / 38.75 },
  { id: 'angle', name: 'Angle Master', icon: 'pk/ach2.svg', r: 52.5 / 43.75 },
];
const LOCKED = [['Off the Map', 'Be the first to post a photo from a new location.', 0], ['Golden Hour Guru', 'Upload during sunrise or sunset.', 0], ['Wanderer', 'Submit a photo from 5 different neighborhoods.', 0.6], ['Photo Fan', 'Vote on 20 different event submissions. Vote 5 more to achieve.', 0.75]];
const AchIcon = ({ a, h = 40, color = BLUE }) => <div style={{ width: Math.min(h * a.r, 56), height: h, maskImage: `url(${a.icon})`, WebkitMaskImage: `url(${a.icon})`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center', background: color }} />;
const POSTS = ['pk/g1.jpg', 'pk/g3.jpg', 'pk/g4.jpg', 'pk/g2.jpg', 'pk/g5.jpg', 'pk/g6.jpg', 'pk/r1.jpg', 'pk/r5.jpg', 'pk/r7.jpg'];
const SAVED_P = ['assets/gg.jpg', 'assets/ladies.jpg', 'assets/p4.jpg', 'assets/p5.jpg', 'assets/moongate.jpg', 'assets/e_a.jpg'];
const LIKED_P = ['assets/m3.jpg', 'assets/e_e.jpg', 'assets/e_c.jpg', 'assets/ev1.jpg', 'assets/m2.jpg', 'assets/e_f.jpg', 'pk/a2.jpg', 'assets/m4.jpg', 'assets/challenge.jpg'];
const BANNERS = [null, 'pk/a2.jpg', 'pk/g4.jpg', 'pk/r1.jpg'];
function Grid({ items, onOpen }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>{items.map((s, i) => <Tap key={s + i} dd={'post-' + i} onClick={() => onOpen(s)} style={{ aspectRatio: '1', background: `url(${s}) center / cover`, animation: `pkfade .3s ${Math.min(i, 8) * 0.03}s both` }} />)}</div>;
}
function Profile() {
  const [view, setView] = useState('main');
  const [p, setP] = useState({ user: 'shutter.jules', bio: 'Urban explorer and writer', loc: 'Davis, CA', banner: 0, feat: ['refl', 'moment', 'motion'] });
  const [draft, setDraft] = useState(p);
  const [lb, setLb] = useState(null);
  const [toast, show] = useToast();
  const slide = { position: 'absolute', inset: 0, animation: 'pkslide .35s cubic-bezier(.2,.8,.2,1)' };
  const startEdit = () => { setDraft(p); setView('edit'); };
  const bannerBg = b => (BANNERS[b] ? `url(${BANNERS[b]}) center / cover` : 'rgb(232,232,232)');
  const Featured = ({ ids, edit }) => (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 10px' }}>
      {ids.map(id => { const a = ACH.find(x => x.id === id); return (
        <div key={id} style={{ width: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, animation: 'pkin .3s both' }}>
          <div style={{ height: 44, display: 'flex', alignItems: 'center' }}><AchIcon a={a} /></div>
          <span style={{ ...tx(10, 400, INK, { lineHeight: '115%' }), textAlign: 'center', width: 70 }}>{a.name}</span>
          {edit && <Tap dd={'edit-ach-' + id} onClick={() => setView('pick')} style={{ padding: '3px 18px', borderRadius: 10, background: INK, ...tx(10, 500, '#fff') }}>Edit</Tap>}
        </div>); })}
    </div>
  );
  let body;
  if (view === 'saved' || view === 'liked') {
    body = (
      <div key={view} style={slide}>
        <TopBar onBack={() => setView('main')} title={view === 'saved' ? 'Saved Posts' : 'Liked Posts'} />
        <Scroll top={100} bottom={82}><Grid items={view === 'saved' ? SAVED_P : LIKED_P} onOpen={setLb} /></Scroll>
      </div>
    );
  } else if (view === 'ach') {
    body = (
      <div key="ach" style={slide}>
        <TopBar onBack={() => setView('main')} />
        <Scroll dd="ach-scroll" top={96} bottom={82}>
          <div style={{ padding: '6px 20px 30px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span style={{ ...tx(17, 600), textAlign: 'center' }}>Unlocked Achievements</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px 0' }}>{ACH.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, animation: `pkin .3s ${i * 0.05}s both` }}><div style={{ height: 44, display: 'flex', alignItems: 'center' }}><AchIcon a={a} /></div><span style={{ ...tx(10, 400, INK, { lineHeight: '115%' }), textAlign: 'center', width: 70 }}>{a.name}</span></div>))}</div>
            <span style={{ ...tx(17, 600), textAlign: 'center', marginTop: 16 }}>Locked Achievements</span>
            {LOCKED.map(([n, d, pr]) => (
              <div key={n} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ position: 'relative', width: 34, height: 34, flexShrink: 0 }}>{ic(34, 34, '0 0 24 24', <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.8z" fill="rgb(205,205,205)" />)}<span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...tx(12, 700, '#fff') }}>?</span></div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={tx(12, 600)}>{n}</span><span style={tx(11, 400, INK, { lineHeight: '125%' })}>{d}</span>
                  {pr > 0 && <div style={{ height: 4, borderRadius: 2, background: CHIP, marginTop: 2 }}><div style={{ width: `${pr * 100}%`, height: '100%', borderRadius: 2, background: BLUE }} /></div>}
                </div>
              </div>
            ))}
          </div>
        </Scroll>
      </div>
    );
  } else if (view === 'pick') {
    const tog = id => setDraft(d => { const on = d.feat.includes(id); if (on) return d.feat.length > 1 ? { ...d, feat: d.feat.filter(x => x !== id) } : d; if (d.feat.length >= 3) { show('You can feature up to 3'); return d; } return { ...d, feat: [...d.feat, id] }; });
    body = (
      <div key="pick" style={slide}>
        <TopBar onBack={() => setView('edit')} right={<Tap dd="pick-done" onClick={() => setView('edit')} style={tx(15, 600, BLUE)}>Done</Tap>} />
        <span style={{ position: 'absolute', left: 40, top: 106, width: 313, textAlign: 'center', ...tx(16, 600) }}>Pick unlocked achievements to feature on your profile:</span>
        <span style={{ position: 'absolute', left: 0, top: 152, width: 393, textAlign: 'center', ...tx(12, 400, GREY) }}>{draft.feat.length}/3 selected</span>
        <div style={{ position: 'absolute', left: 36, top: 180, display: 'grid', gridTemplateColumns: 'repeat(3, 98px)', gap: 8 }}>
          {ACH.map(a => { const on = draft.feat.includes(a.id); return (
            <Tap key={a.id} dd={'ach-' + a.id} onClick={() => tog(a.id)} style={{ height: 106, borderRadius: 6, background: on ? CHIP : 'rgb(205,205,205)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background .2s', transform: on ? 'scale(1)' : 'scale(0.97)' }}>
              <div style={{ height: 40, display: 'flex', alignItems: 'center' }}><AchIcon a={a} color={on ? BLUE : 'rgb(150,150,150)'} /></div>
              <span style={{ ...tx(10, 400, on ? INK : 'rgb(130,130,130)', { lineHeight: '115%' }), textAlign: 'center', width: 70 }}>{a.name}</span>
            </Tap>); })}
        </div>
      </div>
    );
  } else if (view === 'edit') {
    body = (
      <div key="edit" style={slide}>
        <TopBar onBack={() => setView('main')} />
        <Scroll top={96} bottom={82}>
          <Tap dd="banner" onClick={() => setDraft(d => ({ ...d, banner: (d.banner + 1) % BANNERS.length }))} style={{ height: 120, background: bannerBg(draft.banner), display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .3s' }}><span style={{ padding: '5px 12px', borderRadius: 12, background: 'rgba(0,0,0,0.35)', ...tx(11, 500, '#fff') }}>Edit banner</span></Tap>
          <div style={{ position: 'relative', height: 50 }}>
            <Tap onClick={() => show('Photo picker opened')} style={{ position: 'absolute', left: 14, top: -44, width: 80, height: 80, borderRadius: 40, background: 'url(pk/a1.jpg) center / cover', boxShadow: `0 0 0 3px ${BG}`, overflow: 'hidden' }}><div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', ...tx(10, 600, '#fff') }}>Edit profile<br />picture</div></Tap>
            <SmallPill dd="p-save" bg={BG} onClick={() => { setP(draft); setView('main'); show('Profile updated'); }} style={{ position: 'absolute', right: 16, top: 12, boxShadow: '0 0 6px rgba(0,0,0,0.2)', fontWeight: 600, fontSize: 11 }}>Save Changes</SmallPill>
          </div>
          <div style={{ padding: '4px 20px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Field label="Username" value={draft.user} onChange={v => setDraft(d => ({ ...d, user: v }))} />
            <Field dd="f-bio" label="Bio" value={draft.bio} onChange={v => setDraft(d => ({ ...d, bio: v }))} />
            <Field label="Location" value={draft.loc} onChange={v => setDraft(d => ({ ...d, loc: v }))} />
            <span style={{ ...tx(16, 600), marginTop: 10 }}>Edit featured achievements</span>
            <Featured ids={draft.feat} edit />
          </div>
        </Scroll>
      </div>
    );
  } else {
    body = (
      <div key="main" style={{ position: 'absolute', inset: 0, animation: 'pkfade .3s' }}>
        <Scroll dd="p-scroll" top={50} bottom={82}>
          <div style={{ height: 120, background: bannerBg(p.banner), marginTop: 46 }} />
          <div style={{ position: 'relative', height: 46 }}>
            <div style={{ position: 'absolute', left: 14, top: -44, width: 80, height: 80, borderRadius: 40, background: 'url(pk/a1.jpg) center / cover', boxShadow: `0 0 0 3px ${BG}` }} />
            <SmallPill dd="p-edit" bg={BG} onClick={startEdit} style={{ position: 'absolute', right: 16, top: 10, boxShadow: '0 0 6px rgba(0,0,0,0.2)', fontWeight: 600, fontSize: 11 }}>Edit profile</SmallPill>
          </div>
          <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={tx(24, 700)}>{p.user}</span>
            <span style={tx(12)}>Friends: 13</span><span style={tx(12)}>{p.loc}</span><span style={tx(12)}>{p.bio}</span>
            <Tap dd="p-saved" onClick={() => setView('saved')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0 4px' }}>{I.mark(false, 15)}<span style={tx(12)}>Saved</span><div style={{ flex: 1 }} />{I.chevR()}</Tap>
            <Tap dd="p-liked" onClick={() => setView('liked')} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 0 8px' }}>{I.heart(false, 15)}<span style={tx(12)}>Liked</span><div style={{ flex: 1 }} />{I.chevR()}</Tap>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}><span style={tx(16, 600)}>Featured achievements</span><div style={{ flex: 1 }} /><Tap dd="see-all" onClick={() => setView('ach')} style={tx(12)}>See all</Tap></div>
            <Featured ids={p.feat} />
            <span style={{ ...tx(16, 600), marginTop: 8 }}>Your posts</span>
          </div>
          <div style={{ padding: '0 14px 20px' }}><Grid items={POSTS} onOpen={setLb} /></div>
        </Scroll>
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {body}
      <NavBar active="user" />
      {lb && <Tap dd="lightbox" onClick={() => setLb(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.92)', zIndex: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pkfade .2s' }}><div style={{ width: 393, height: 500, background: `url(${lb}) center / contain no-repeat`, animation: 'pkpopin .3s' }} /><span style={{ position: 'absolute', bottom: 60, ...tx(12, 400, 'rgba(255,255,255,0.7)') }}>Tap anywhere to close</span></Tap>}
      {toast}
    </div>
  );
}

/* ---------- auto-demo driver ---------- */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const setNative = (el, v) => { const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
async function runDemo(script, scr, setFin, ctx, done, sp = 1) {
  const root = () => scr.current;
  const W = async ms => { await sleep(ms / sp); if (ctx.dead || !root()) throw 0; };
  const geo = () => { const R = root().getBoundingClientRect(); return { R, k: R.width / 393 }; };
  const posOf = el => { const r = el.getBoundingClientRect(), { R, k } = geo(); return { x: (r.left + r.width / 2 - R.left) / k, y: (r.top + r.height / 2 - R.top) / k }; };
  const find = async sel => { for (let i = 0; i < 40; i++) { const el = root() && root().querySelector('[data-demo="' + sel + '"]'); if (el) return el; await W(100); } return null; };
  const moveTo = async (x, y, dur = 560) => { setFin(f => ({ ...f, x, y, show: true, dur: dur / sp })); await W(dur + 60); };
  const press = async () => { setFin(f => ({ ...f, down: true })); await W(120); setFin(f => ({ ...f, down: false })); };
  const scrollerOf = el => { let n = el.parentElement; while (n && n !== root()) { const o = getComputedStyle(n).overflowY; if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight + 2) return n; n = n.parentElement; } return null; };
  const swipe = async (sc, dy) => {
    const y0 = dy > 0 ? 640 : 300, y1 = dy > 0 ? 300 : 640;
    await moveTo(214, y0, 420); setFin(f => ({ ...f, down: true }));
    sc.scrollTo({ top: sc.scrollTop + dy, behavior: 'smooth' });
    await moveTo(214, y1, 640); setFin(f => ({ ...f, down: false })); await W(260);
  };
  const reveal = async el => { for (let i = 0; i < 5; i++) { const p = posOf(el); if (p.y > 120 && p.y < 720) return; const sc = scrollerOf(el); if (!sc) return; const b = sc.scrollTop; await swipe(sc, cl(p.y - 420, -540, 540)); if (Math.abs(sc.scrollTop - b) < 2) return; } };
  try {
    await W(600);
    for (const st of script) {
      const [a, sel, arg, flag] = st;
      if (a === 'w') { await W(sel); continue; }
      if (a === 'nav') { await moveTo(sel, arg, 640); await press(); await W(180); if (ctx.nav) ctx.nav(flag); return; }
      let el = await find(sel); if (!el) continue;
      if (a === 'scroll') { await swipe(el, arg); continue; }
      if (a === 'drag') {
        const [x0, y0, x1, y1] = arg, { R, k } = geo(), cx = x => R.left + x * k, cy = y => R.top + y * k;
        await moveTo(x0, y0, 480); setFin(f => ({ ...f, down: true }));
        el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: cx(x0), clientY: cy(y0) }));
        for (let i = 1; i <= 26; i++) { const t = i / 26, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e; setFin(f => ({ ...f, x, y, dur: 0 })); window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx(x), clientY: cy(y) })); await W(28); }
        window.dispatchEvent(new PointerEvent('pointerup', {})); setFin(f => ({ ...f, down: false })); await W(400); continue;
      }
      await reveal(el); const p = posOf(el); await moveTo(p.x, p.y);
      el = root().querySelector('[data-demo="' + sel + '"]') || el;
      const isField = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
      if (a === 'tap') { await press(); if (isField) el.focus({ preventScroll: true }); else el.click(); await W(arg || 500); }
      else if (a === 'dbl') { el.click(); await press(); await W(60); el.click(); await press(); await W(arg || 700); }
      else if (a === 'type') { await press(); el.focus({ preventScroll: true }); let v = flag ? '' : el.value; if (flag) setNative(el, ''); for (const ch of arg) { v += ch; setNative(el, v); await W(55); } await W(450); }
      else if (a === 'range') { await press(); const from = +el.value; for (let i = 1; i <= 16; i++) { setNative(el, String(Math.round(from + (arg - from) * (i / 16)))); await W(40); } await W(400); }
    }
    await W(1800);
    setFin(f => ({ ...f, show: false })); await W(500);
    done();
  } catch (e) { if (e !== 0) console.warn(e); }
}
const DEMOS = {
  onboarding: [['w', 1200], ['tap', 'signup', 700], ['type', 'f-email', 'shuju13@gmail.com'], ['type', 'f-pw', 'photospots4ever!'], ['type', 'f-user', 'shutter.jules'], ['tap', 'next', 900],
    ['type', 'f-country', 'United States of America'], ['type', 'f-city', 'Davis, CA'], ['tap', 'next', 1500], ['tap', 'opt-0', 1500],
    ['tap', 'int-Architecture', 380], ['tap', 'int-Landscapes', 380], ['tap', 'int-Urban', 380], ['tap', 'int-Night', 600], ['tap', 'start', 2800]],
  home: [['w', 900], ['tap', 'tip', 1100], ['tap', 'tip', 900], ['tap', 'chip-1', 1100], ['tap', 'chip-2', 1100], ['tap', 'chip-0', 900],
    ['dbl', 'img-gg', 1000], ['tap', 'save-gg', 1100], ['scroll', 'feed', 560], ['w', 500], ['scroll', 'feed', -560], ['w', 300],
    ['tap', 'open-gg', 1200], ['tap', 'd-like', 700], ['tap', 'd-save', 1000], ['scroll', 'd-scroll', 540], ['w', 400], ['scroll', 'd-scroll', 520],
    ['tap', 'replies-maya.smith', 1100], ['type', 'd-input', 'Golden hour hits different here'], ['tap', 'd-post', 1500], ['tap', 'back', 1200]],
  map: [['w', 1100], ['tap', 'marker-0', 1500], ['tap', 'sheet-more', 1600], ['tap', 'sheet-more', 900], ['tap', 'zoom-in', 700], ['tap', 'zoom-out', 900],
    ['drag', 'map', [260, 300, 170, 400]], ['w', 600], ['type', 'search', 'Pain'], ['w', 500], ['tap', 'res-4', 1700], ['tap', 'locate', 1900]],
  events: [['w', 900], ['tap', 'chip-1', 1000], ['tap', 'chip-2', 1000], ['tap', 'chip-0', 800], ['tap', 'save-cf', 1000],
    ['tap', 'filter', 800], ['range', 'dist', 60], ['tap', 'time-< 3 days', 600], ['tap', 'apply', 1500], ['tap', 'filter', 700], ['tap', 'time-Any', 400], ['tap', 'apply', 1000],
    ['tap', 'saved-btn', 1300], ['tap', 'stab-1', 1100], ['tap', 'back', 700], ['tap', 'clock', 900], ['tap', 'win-lt', 1400], ['tap', 'back', 700],
    ['tap', 'challenge', 1100], ['tap', 'submit', 800], ['tap', 'roll-0', 500], ['tap', 'roll-cta', 900], ['scroll', 'ch-scroll', 420], ['w', 1500], ['tap', 'back', 800],
    ['tap', 'create', 900], ['tap', 'cover', 800], ['tap', 'roll-2', 500], ['tap', 'roll-cta', 800], ['type', 'c-title', 'Sunset Picnic'], ['type', 'c-loc', 'Dolores Park, SF'],
    ['tap', 'c-sd', 700], ['tap', 'day-26', 800], ['tap', 'c-ed', 700], ['tap', 'day-30', 800], ['type', 'c-prompt', 'Capture the warm glow as the sun sets over the city.'],
    ['tap', 'c-type', 600], ['tap', 'type-Private', 600], ['tap', 'c-inv', 700], ['tap', 'fr-maya.smith', 300], ['tap', 'fr-emily.chen', 300], ['tap', 'fr-alex.salinas', 500], ['tap', 'inv-done', 800],
    ['tap', 'c-create', 2400], ['tap', 'c-view', 2400]],
  upload: [['w', 900], ['tap', 'pick-3', 700], ['tap', 'pick-6', 700], ['tap', 'pick-0', 700], ['tap', 'utab-1', 900], ['tap', 'utab-0', 600], ['tap', 'u-next', 1000],
    ['tap', 'row-Location', 900], ['drag', 'map', [200, 520, 140, 420]], ['w', 300], ['tap', 'mode-radius', 700], ['range', 'radius', 120], ['w', 400], ['tap', 'select-loc', 1200],
    ['tap', 'row-Event', 800], ['tap', 'uev-ls', 700], ['tap', 'select-ev', 1000], ['tap', 'row-Tags', 800], ['tap', 'sug-#sunset', 400], ['tap', 'sug-#SF', 400],
    ['type', 'tag-in', 'goldengate'], ['tap', 'tag-add', 700], ['tap', 'tags-done', 900], ['tap', 'row-Settings', 700], ['tap', 'tog-comments', 900],
    ['tap', 'upload', 2600], ['scroll', 'done-scroll', 420], ['w', 1600]],
  profile: [['w', 900], ['tap', 'p-saved', 1300], ['tap', 'back', 600], ['tap', 'p-liked', 1200], ['tap', 'back', 600], ['tap', 'see-all', 1000], ['scroll', 'ach-scroll', 360], ['w', 700], ['tap', 'back', 700],
    ['tap', 'post-4', 1300], ['tap', 'lightbox', 700], ['scroll', 'p-scroll', -800], ['tap', 'p-edit', 900], ['tap', 'banner', 600], ['tap', 'banner', 800],
    ['type', 'f-bio', 'Urban explorer, writer and night owl', true], ['tap', 'edit-ach-motion', 900], ['tap', 'ach-motion', 500], ['tap', 'ach-angle', 700], ['tap', 'pick-done', 900], ['tap', 'p-save', 2400]],
};

/* ---------- phone shell (website build) ----------
   index.html?screen=<name>   onboarding, home, map, events, upload, profile, or
                              tour (home, then the map tab, then back, on a loop)
             &frame=0         the screen alone, filling the window (the hero)
             &autoplay=0      start still, on the first frame
   The page drives it with postMessage {pk: 'play' | 'stop' | 'reset'} and hears
   back {pk: 'state', playing, touched} whenever that changes. */
const SCREENS = { onboarding: Onboarding, home: Home, detail: Detail, map: MapScreen, events: Events, create: CreateEvent, upload: Upload, profile: Profile };
const NAV_XY = { home: [46, 811], map: [124, 811] };   /* the nav-bar tabs, in screen px */
const Q = new URLSearchParams(location.search);
const START = Q.get('screen') || 'home';
const TOUR = START === 'tour';

function PKEmbed() {
  const first = TOUR ? 'home' : START;
  const [cur, setCur] = useState(first);
  const [k, setK] = useState(0);
  const [play, setPlay] = useState(Q.get('autoplay') !== '0');
  const [touched, setTouched] = useState(false);
  const [fin, setFin] = useState({ x: 214, y: 620, show: false, down: false, dur: 500 });
  const scr = useRef();
  const Comp = SCREENS[cur] || Home;
  const view = useMemo(() => <Comp key={k} />, [k, cur]);

  useEffect(() => {
    if (!play) { setFin(f => ({ ...f, show: false })); return; }
    const ctx = { dead: false, nav: next => { setCur(next); setK(v => v + 1); } };
    let script = DEMOS[cur] || [];
    /* the tour keeps Home short (tips, filters, a like and a save, a scroll) so the map comes round sooner */
    if (TOUR && cur === 'home') script = script.slice(0, script.findIndex(st => st[1] === 'open-gg'));
    if (TOUR) { const next = cur === 'home' ? 'map' : 'home'; script = script.concat([['nav', NAV_XY[next][0], NAV_XY[next][1], next]]); }
    runDemo(script, scr, setFin, ctx, () => setK(v => v + 1), 1);
    return () => { ctx.dead = true; };
  }, [play, k, cur]);

  useEffect(() => {
    const on = e => {
      const d = e.data;
      if (!d || typeof d !== 'object' || !d.pk) return;
      if (d.pk === 'play') { setTouched(false); setCur(first); setK(v => v + 1); setPlay(true); }
      if (d.pk === 'stop') setPlay(false);
      if (d.pk === 'reset') { setPlay(false); setTouched(false); setCur(first); setK(v => v + 1); }
    };
    window.addEventListener('message', on);
    return () => window.removeEventListener('message', on);
  }, []);
  useEffect(() => { if (window.parent !== window) window.parent.postMessage({ pk: 'state', playing: play, touched }, '*'); }, [play, touched]);

  const screen = (
    <div ref={scr} onPointerDownCapture={e => { if (!e.isTrusted) return; setPlay(false); setTouched(true); }}
      style={{ position: 'relative', width: 393, height: 852, borderRadius: FRAME ? 52 : 0, overflow: 'hidden', background: BG, transform: 'translateZ(0)', fontFamily: FONT }}>
      {view}
      {cur !== 'map' && <StatusBar />}
      <div style={{ position: 'absolute', left: fin.x - 22, top: fin.y - 22, width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.55)', border: '2px solid rgba(53,57,53,0.35)', boxShadow: '0 4px 14px rgba(0,0,0,0.25)', boxSizing: 'border-box', opacity: fin.show ? 1 : 0, transform: `scale(${fin.down ? 0.8 : 1})`, transition: `left ${fin.dur}ms cubic-bezier(.45,0,.2,1), top ${fin.dur}ms cubic-bezier(.45,0,.2,1), opacity .3s, transform .12s`, pointerEvents: 'none', zIndex: 80 }} />
      {/* the camera island and home bar; left out for the screen alone (the hero's phone photo has its own) */}
      {FRAME && <div style={{ position: 'absolute', left: 136, top: 11, width: 121, height: 35, borderRadius: 18, background: '#000', zIndex: 60 }} />}
      {FRAME && <div style={{ position: 'absolute', left: 130, bottom: 8, width: 134, height: 5, borderRadius: 3, background: '#000', zIndex: 60, pointerEvents: 'none' }} />}
    </div>
  );
  if (!FRAME) return screen;
  return (
    <div style={{ width: 421, height: 880, borderRadius: 66, background: '#111', padding: 14, boxSizing: 'border-box', boxShadow: 'inset 0 0 0 2px #333' }}>{screen}</div>
  );
}

/* scale the phone (or the bare screen) to the window: fit inside it, or fill it
   when it's the screen alone */
const FRAME = Q.get('frame') !== '0';
const W0 = FRAME ? 421 : 393, H0 = FRAME ? 880 : 852;
const rootEl = document.getElementById('root');
function fit() {
  const sx = innerWidth / W0, sy = innerHeight / H0;
  const s = FRAME ? Math.min(sx, sy) : Math.max(sx, sy);
  rootEl.style.width = W0 + 'px';
  rootEl.style.height = H0 + 'px';
  rootEl.style.transform = `translate(-50%, ${FRAME ? '-50%' : '0'}) scale(${s})`;
  rootEl.style.top = FRAME ? '50%' : '0';
  rootEl.style.transformOrigin = FRAME ? '50% 50%' : '50% 0';
}
window.addEventListener('resize', fit);
fit();
ReactDOM.createRoot(rootEl).render(<PKEmbed />);
