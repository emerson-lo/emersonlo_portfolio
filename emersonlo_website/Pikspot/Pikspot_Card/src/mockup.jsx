/* Pikspot phone mockup for the home page card.
   Built from pikspot-piece.jsx (the handoff, in this folder):
   same screens and choreography, but only the phone (no blue backdrop)
   and a small built-in clock instead of the handoff's video engine.
   Source: src/mockup.jsx, compiled to mockup.js (plain React.createElement). */
(function () {

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const Easing = {
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeOutQuart: (t) => 1 - (--t) * t * t * t,
  easeOutBack: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};

// scenes: authored length (nat) played back over dur seconds (~1.25x slower)
const SCENES = [
  { name: 'Feed', dur: 2.75, nat: 2.2 },
  { name: 'Detail', dur: 2.75, nat: 2.2 },
  { name: 'Map', dur: 2.4, nat: 1.9 },
  { name: 'Events', dur: 2.1, nat: 1.7 },
];
const CUES = {};
const SECTIONS = [];
let PLAY_TOTAL = 0, AUTH_TOTAL = 0;
SCENES.forEach(s => {
  CUES[s.name] = Math.round(AUTH_TOTAL * 1000) / 1000;
  SECTIONS.push({ playStart: PLAY_TOTAL, dur: s.dur, authStart: AUTH_TOTAL, nat: s.nat });
  PLAY_TOTAL += s.dur; AUTH_TOTAL += s.nat;
});
// playback seconds -> authored time T
function warp(t) {
  let s = SECTIONS[SECTIONS.length - 1];
  for (const x of SECTIONS) { if (t < x.playStart + x.dur) { s = x; break; } }
  const local = clamp(t - s.playStart, 0, s.dur);
  return Math.min(s.authStart + local * (s.nat / s.dur), AUTH_TOTAL);
}

const INK = 'rgb(53,57,53)', BG = 'rgb(248,248,248)', BLUE = 'rgb(53,163,252)', PILL = 'rgb(150,205,250)', CHIP = 'rgb(199,227,249)', GREY = 'rgb(138,138,138)';
const FONT = '"Albert Sans", -apple-system, sans-serif';

// three motion helpers — all motion goes through these
const prog = (T, a, b) => clamp((T - a) / (b - a), 0, 1);
const MOTION = {
  move: (T, a, b) => Easing.easeInOutCubic(prog(T, a, b)),
  fling: (T, a, b) => Easing.easeOutQuart(prog(T, a, b)),
  pop: (T, a, b) => Easing.easeOutBack(prog(T, a, b)),
};
const mix = (a, b, p) => a + (b - a) * p;

const Heart = ({ fill, size = 16 }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 16 14.4" style={{ flexShrink: 0, overflow: 'visible' }}>
    <path d="M8 13.6S1 9.4 1 4.8A3.6 3.6 0 0 1 8 3.2a3.6 3.6 0 0 1 7 1.6C15 9.4 8 13.6 8 13.6z" fill={fill || 'none'} stroke={fill || INK} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const Bubble = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" style={{ flexShrink: 0 }}><path d="M7.5 1.2a6.2 6.2 0 0 0-5.4 9.3L1.2 13.8l3.3-.9A6.2 6.2 0 1 0 7.5 1.2z" fill="none" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" /></svg>
);
const Bookmark = ({ fill }) => (
  <svg width="13" height="16" viewBox="0 0 13 16" style={{ flexShrink: 0 }}><path d="M1 1h11v14l-5.5-4L1 15z" fill={fill || 'none'} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" /></svg>
);
const Chevron = () => (<svg width="10" height="18" viewBox="0 0 10 18"><path d="M9 1 1 9l8 8" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const Dots = () => (<svg width="18" height="4" viewBox="0 0 18 4"><circle cx="2" cy="2" r="1.8" fill={INK} /><circle cx="9" cy="2" r="1.8" fill={INK} /><circle cx="16" cy="2" r="1.8" fill={INK} /></svg>);
const Pin = () => (<svg width="11" height="14" viewBox="0 0 11 14"><path d="M5.5 13S1 8.4 1 5.3a4.5 4.5 0 0 1 9 0C10 8.4 5.5 13 5.5 13z" fill="none" stroke={INK} strokeWidth="1.1" /><circle cx="5.5" cy="5.3" r="1.6" fill={INK} /></svg>);

const txt = (size, weight = 400, color = INK, extra = {}) => ({ fontFamily: FONT, fontSize: size, fontWeight: weight, color, lineHeight: '100%', ...extra });

function StatusBar({ tint = BG }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 50, background: tint, zIndex: 30 }}>
      <span style={{ position: 'absolute', left: 48, top: 19, ...txt(16, 600, '#000') }}>9:41</span>
      <div style={{ position: 'absolute', right: 32, top: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 11 }}>
          {[4, 6, 8, 11].map(h => <div key={h} style={{ width: 3, height: h, borderRadius: 1, background: '#000' }} />)}
        </div>
        <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 10.5 5.3 8.2a3.1 3.1 0 0 1 4.4 0zM3.4 6.3a5.8 5.8 0 0 1 8.2 0l-1.1 1.1a4.3 4.3 0 0 0-6 0zM1.3 4.2a8.8 8.8 0 0 1 12.4 0l-1.1 1.1a7.2 7.2 0 0 0-10.2 0z" fill="#000" /></svg>
        <div style={{ width: 24, height: 12, borderRadius: 3.5, border: '1px solid rgba(0,0,0,.4)', padding: 1.5, boxSizing: 'border-box' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 2, background: '#000' }} />
        </div>
      </div>
    </div>
  );
}

function NavBar({ active }) {
  const op = k => (active === k ? 1 : 0.42);
  const ico = (k, src, w, h) => <img src={src} style={{ width: w, height: h, opacity: op(k), display: 'block' }} />;
  return (
    <div style={{ position: 'absolute', left: 0, top: 770, width: 393, height: 82, background: BG, borderTop: '0.5px solid rgba(53,57,53,0.25)', display: 'flex', gap: 47, padding: '25px 30px', alignItems: 'center', boxSizing: 'border-box', zIndex: 20 }}>
      <div style={{ width: 32, display: 'flex', justifyContent: 'center' }}>{ico('home', 'card-assets/nav-home.svg', 21.3, 23.3)}</div>
      <div style={{ width: 30, display: 'flex', justifyContent: 'center' }}>{ico('map', 'card-assets/nav-map.svg', 22.5, 22.5)}</div>
      <div style={{ width: 23, display: 'flex', justifyContent: 'center' }}>{ico('plus', 'card-assets/nav-plus.svg', 23, 23)}</div>
      <svg width="30" height="30" viewBox="0 0 30 30" style={{ opacity: op('events'), flexShrink: 0 }}>
        <rect x="4" y="5.5" width="22" height="21" rx="4.5" fill="none" stroke={INK} strokeWidth="2" />
        <path d="M4.5 11.5h21M10 3.2v4.2M20 3.2v4.2" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <path d="M15 13.6l1.75 3.6 3.95.45-2.92 2.7.78 3.9L15 22.3l-3.56 1.95.78-3.9-2.92-2.7 3.95-.45z" fill="none" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      <div style={{ width: 30, display: 'flex', justifyContent: 'center' }}>{ico('user', 'card-assets/nav-user.svg', 25, 25)}</div>
    </div>
  );
}

function Post({ img, user, place, caption, likes, comments }) {
  return (
    <div style={{ width: 393, flexShrink: 0 }}>
      <div style={{ width: 393, height: 472, background: `url(${img}) center / cover` }} />
      <div style={{ height: 162, background: BG, boxShadow: '0 0 15px rgba(0,0,0,0.1)', padding: '24px 25px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={txt(20)}>{user}</span>
          <div style={{ width: 0.5, height: 16, background: INK }} />
          <span style={txt(12)}>{place}</span>
        </div>
        <span style={txt(16, 400, INK, { lineHeight: '120%' })}>{caption}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={txt(16)}>{likes}</span><Heart />
          <span style={{ ...txt(16), marginLeft: 8 }}>{comments}</span><Bubble />
          <div style={{ flex: 1 }} /><Bookmark />
        </div>
      </div>
    </div>
  );
}

function Chips({ labels, active }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: 353 }}>
      {labels.map((l, i) => (
        <div key={l} style={{ width: 108, height: 35, borderRadius: 20, background: i === active ? CHIP : BG, boxShadow: '0 0 8px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...txt(16) }}>{l}</div>
      ))}
      <img src="card-assets/sliders.svg" style={{ width: 23, height: 19, marginLeft: 4 }} />
    </div>
  );
}

function HomeScreen({ scroll }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 393, transform: `translateY(${-scroll}px)` }}>
        <div style={{ position: 'absolute', left: 20, top: 64, display: 'flex', gap: 6, alignItems: 'center' }}>
          <img src="card-assets/logo.svg" style={{ width: 26, height: 26 }} />
          <span style={txt(32, 700, INK, { letterSpacing: '-0.05em' })}>Pikspot</span>
        </div>
        <div style={{ position: 'absolute', left: 20, top: 120, width: 353, background: BG, boxShadow: `0 0 10px ${PILL}`, padding: 16, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={txt(20, 600, BLUE)}>Tip of the Day</span>
          <span style={txt(16, 400, INK, { lineHeight: '120%' })}>Use the 'Vivid' filter on Instagram with reduced intensity to enhance colors without making them look over-saturated.</span>
        </div>
        <div style={{ position: 'absolute', left: 20, top: 266, width: 353, background: BG, boxShadow: `0 0 10px ${PILL}`, overflow: 'hidden' }}>
          <div style={{ height: 130, background: 'url(card-assets/challenge.jpg) center 60% / cover' }} />
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <span style={txt(20, 600, INK, { lineHeight: '115%' })}>This Week’s Photo Challenge:<br />Light and Shadow</span>
            <div style={{ padding: '7px 16px', borderRadius: 20, background: PILL, ...txt(12) }}>View Event</div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 20, top: 556, width: 353, height: 0.5, background: 'rgba(53,57,53,0.25)' }} />
        <div style={{ position: 'absolute', left: 20, top: 584 }}><Chips labels={['Near You', 'Friends', 'Explore']} active={0} /></div>
        <div style={{ position: 'absolute', left: 0, top: 649, display: 'flex', flexDirection: 'column' }}>
          <Post img="card-assets/gg.jpg" user="alex.salinas" place="Golden Gate Bridge, San Francisco" caption="Let the sun hit your face, let the wind mess up your hair, and let the quiet..." likes="17" comments="3" />
          <Post img="card-assets/ladies.jpg" user="josh.brunson" place="Painted Ladies, San Francisco" caption="A row of charming, brightly colored houses lines a sloping street in San Francisco..." likes="53" comments="8" />
        </div>
      </div>
      <StatusBar />
    </div>
  );
}

function DetailScreen({ scroll, liked }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 393, transform: `translateY(${-scroll}px)` }}>
        <div style={{ position: 'absolute', left: 20, top: 62, right: 20, display: 'flex', alignItems: 'center', gap: 18 }}>
          <Chevron /><div style={{ flex: 1 }} /><Bookmark /><Dots />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 96, width: 393, height: 400, background: 'url(card-assets/gg.jpg) center / cover' }} />
        <div style={{ position: 'absolute', left: 20, top: 512, width: 353, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: 'url(card-assets/avatar.jpg) center / cover' }} />
          <span style={txt(14)}>alex.salinas</span>
          <div style={{ flex: 1 }} />
          <span style={txt(16)}>{liked.count}</span>
          <div style={{ transform: `scale(${liked.scale})` }}><Heart fill={liked.on ? INK : null} size={17} /></div>
          <span style={{ ...txt(16), marginLeft: 8 }}>3</span><Bubble />
        </div>
        <div style={{ position: 'absolute', left: 20, top: 562, width: 353, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={txt(24, 700)}>Golden Gate Bridge</span>
          <span style={txt(16, 400, INK, { lineHeight: '125%' })}>Let the sun hit your face, let the wind mess up your hair, and let the quiet calm your mind.</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={txt(12)}>Posted May 4th, 2025 3:01 pm</span>
            <span style={txt(10, 400, GREY)}>Taken May 4th, 2025 6:30 am</span>
          </div>
          <div style={{ position: 'relative', width: 353, height: 150, borderRadius: 10, overflow: 'hidden', marginTop: 6 }}>
            <div style={{ position: 'absolute', left: -560, top: -330, width: 1396, height: 1283, background: 'url(card-assets/map.jpg) center / cover' }} />
            <div style={{ position: 'absolute', left: 110, top: 18, width: 116, height: 116, borderRadius: 58, background: 'rgba(102,184,251,0.35)', border: '1.5px solid rgb(102,184,251)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Pin /><span style={txt(12)}>Around San Francisco, CA, USA</span><div style={{ flex: 1 }} />
            <div style={{ padding: '7px 14px', borderRadius: 20, background: PILL, ...txt(12) }}>View in Map</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {['#sunrise', '#SF', '#california', '#bridge'].map(t => (
              <div key={t} style={{ padding: '7px 14px', borderRadius: 20, border: `0.5px solid ${INK}`, ...txt(12) }}>{t}</div>
            ))}
          </div>
          <span style={{ ...txt(20, 600), marginTop: 10 }}>Comments (3)</span>
          {[['maya.smith', 'This looks amazing!! How did you get that shot?'], ['real.raymond.wong', 'omg ts so tuff']].map(([u, c]) => (
            <div key={u} style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: CHIP }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={txt(10, 400, GREY)}>{u} | 5d</span><span style={txt(14)}>{c}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <StatusBar />
    </div>
  );
}

// every pin stands on land, as in the final prototype's map: the south end of
// the Golden Gate (the one tapped), the Presidio, Lands End, Sausalito and
// the city itself. None sit out on the bay.
const MARKERS = [
  { x: 196, y: 372, img: 'card-assets/m3.jpg', n: 24 },
  { x: 268, y: 423, img: 'card-assets/m1.jpg', n: 9 },
  { x: 118, y: 507, img: 'card-assets/m4.jpg', n: 6 },
  { x: 160, y: 206, img: 'card-assets/ev3.jpg', n: 3 },
  { x: 318, y: 530, img: 'card-assets/ladies.jpg', n: 12 },
];

function MapScreen({ zoom, pops, sheet, tapped }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '196px 372px' }}>
        <div style={{ position: 'absolute', left: -1244, top: -836, width: 3054, height: 2807, background: 'url(card-assets/map.jpg) center / cover' }} />
        {MARKERS.map((m, i) => (
          <div key={i} style={{ position: 'absolute', left: m.x - 28, top: m.y - 64, width: 56, height: 64, transform: `scale(${pops[i] * (tapped && i === 0 ? 1.12 : 1)})`, transformOrigin: '28px 64px', opacity: Math.min(1, pops[i] * 1.5) }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, border: '3px solid #fff', boxSizing: 'border-box', background: `url(${m.img}) center / cover`, boxShadow: '0 4px 10px rgba(0,0,0,0.25)' }} />
            <div style={{ position: 'absolute', left: 22, top: 52, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid #fff' }} />
            <div style={{ position: 'absolute', right: -9, top: -9, minWidth: 22, height: 22, borderRadius: 11, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...txt(11, 700) }}>{m.n}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 20, top: 62, width: 353, height: 40, borderRadius: 20, background: 'rgb(240,240,240)', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', padding: '0 16px', boxSizing: 'border-box', ...txt(14, 400, GREY) }}>Search for a location...</div>
      <div style={{ position: 'absolute', right: 20, top: 640, width: 36, height: 80, borderRadius: 8, background: BG, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', ...txt(22, 400) }}>
        <span>+</span><div style={{ width: 20, height: 0.5, background: 'rgba(53,57,53,0.3)' }} /><span>−</span>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 770 - sheet * 300, width: 393, height: 320, borderRadius: '16px 16px 0 0', background: BG, boxShadow: '0 -2px 12px rgba(0,0,0,0.2)', padding: '12px 20px', boxSizing: 'border-box', zIndex: 25 }}>
        <div style={{ width: 60, height: 5, borderRadius: 3, background: 'rgb(217,217,217)', margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          <span style={txt(20, 600)}>Golden Gate Bridge</span>
          <span style={txt(12, 400, GREY)}>San Francisco, CA</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['card-assets/m3.jpg', 'card-assets/m1.jpg', 'card-assets/m4.jpg', 'card-assets/m2.jpg'].map(s => (
            <div key={s} style={{ width: 108, height: 140, flexShrink: 0, borderRadius: 6, background: `url(${s}) center / cover` }} />
          ))}
        </div>
      </div>
      <StatusBar tint="rgba(248,248,248,0.85)" />
    </div>
  );
}

function EventCard({ img, title, prompt, loc, left, saved }) {
  return (
    <div style={{ width: 353, background: BG, boxShadow: '0 0 10px rgba(0,0,0,0.1)', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ height: 170, background: `url(${img}) center / cover` }} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <span style={txt(16, 500, BLUE)}>{title}</span><div style={{ flex: 1 }} /><Bookmark fill={saved ? INK : null} />
        </div>
        <span style={txt(12, 400, INK, { lineHeight: '125%' })}><b>Prompt:</b> {prompt}</span>
        <span style={txt(12)}><b>Location:</b> {loc}</span>
        <span style={txt(12)}><b>Time Left:</b> {left}</span>
        <div style={{ marginTop: 6, padding: '7px 16px', borderRadius: 20, background: PILL, ...txt(12) }}>View Event</div>
      </div>
    </div>
  );
}

function EventsScreen({ scroll, chip }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 393, transform: `translateY(${-scroll}px)` }}>
        <div style={{ position: 'absolute', left: 20, top: 66, width: 353, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={txt(24, 600, BLUE)}>Community Events</span><div style={{ flex: 1 }} /><Bookmark />
          <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.8" fill="none" stroke={INK} strokeWidth="1.2" /><path d="M8 4.2V8l2.6 1.6" fill="none" stroke={INK} strokeWidth="1.2" strokeLinecap="round" /></svg>
        </div>
        <div style={{ position: 'absolute', left: 20, top: 112, width: 353, background: BG, boxShadow: `0 0 10px ${PILL}`, overflow: 'hidden' }}>
          <div style={{ height: 150, background: 'url(card-assets/challenge.jpg) center 60% / cover' }} />
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <span style={txt(20, 600, INK, { lineHeight: '115%' })}>This Week’s Photo Challenge:<br />Light and Shadow</span>
            <span style={txt(12, 400, INK, { lineHeight: '125%' })}><b>Prompt:</b> Explore the contrast between light and shadow in your environment.</span>
            <span style={txt(12)}><b>Time Left:</b> 3 Days</span>
            <div style={{ marginTop: 4, padding: '7px 16px', borderRadius: 20, background: PILL, ...txt(12) }}>View Event</div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 20, top: 450 }}><Chips labels={['Near You', 'Friends', 'Global']} active={chip} /></div>
        <div style={{ position: 'absolute', left: 20, top: 510, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <EventCard img="card-assets/ev1.jpg" title="Golden Hour" prompt="Shoot during the hour after sunrise or before sunset for warm, soft light." loc="Daly City, CA" left="2 days, 14 hours" saved />
          <EventCard img="card-assets/e_e.jpg" title="Campus Frames" prompt="Take photos that show the spirit of your campus." loc="UC Davis Campus" left="4 days, 23 hours" />
        </div>
      </div>
      <StatusBar />
    </div>
  );
}

function Touch({ T, gestures }) {
  const g = gestures.find(g => T >= g.t0 - 0.14 && T <= g.t1 + 0.16);
  if (!g) return null;
  const p = MOTION.move(T, g.t0, g.t1);
  const x = mix(g.x0, g.x1, p), y = mix(g.y0, g.y1, p);
  const fade = Math.min(prog(T, g.t0 - 0.14, g.t0), 1 - prog(T, g.t1, g.t1 + 0.16));
  const pressed = T >= g.t0 && T <= g.t1;
  return (
    <div style={{ position: 'absolute', left: x - 24, top: y - 24, width: 48, height: 48, borderRadius: 24, background: 'rgba(255,255,255,0.55)', border: '2px solid rgba(53,57,53,0.35)', boxShadow: '0 4px 14px rgba(0,0,0,0.25)', boxSizing: 'border-box', opacity: fade, transform: `scale(${pressed ? 0.82 : 1})`, zIndex: 50, pointerEvents: 'none' }} />
  );
}

function Piece({ T }) {
  const D = CUES.Detail, M = CUES.Map, E = CUES.Events;

  const homeScroll = T < M ? 560 * MOTION.fling(T, 0.35, 1.45) : 0;
  const detailX = 393 * (1 - MOTION.move(T, D - 0.3, D + 0.15));
  const homeShift = -90 * MOTION.move(T, D - 0.3, D + 0.15);
  const likeT = D + 0.75;
  const liked = { on: T >= likeT, count: T >= likeT ? 18 : 17, scale: T >= likeT ? 1 + 0.45 * Math.sin(Math.PI * prog(T, likeT, likeT + 0.3)) : 1 };
  const detailScroll = 300 * MOTION.fling(T, D + 1.1, D + 1.85);
  const detailOp = 1 - MOTION.move(T, M - 0.15, M + 0.25);
  const mapOp = MOTION.move(T, M - 0.15, M + 0.25);
  const mapZoom = mix(1.12, 1, MOTION.move(T, M - 0.15, M + 0.6)) + 0.04 * MOTION.move(T, M + 0.6, E);
  const pops = MARKERS.map((_, i) => MOTION.pop(T, M + 0.3 + i * 0.08, M + 0.65 + i * 0.08));
  const markerTap = M + 1.05;
  const sheet = MOTION.move(T, markerTap + 0.12, markerTap + 0.5);
  const eventsIn = MOTION.move(T, E - 0.1, E + 0.2);
  const eventsOut = MOTION.move(T, E + 1.3, E + 1.6);
  const eventsScroll = 280 * MOTION.fling(T, E + 0.4, E + 1.1);
  const chip = T >= E + 0.3 && T < E + 1.3 ? 1 : 0;

  const activeTab = T < M - 0.1 || T >= E + 1.3 ? 'home' : T < E - 0.1 ? 'map' : 'events';
  const showHome = T < M - 0.1 || T >= E + 1.3;
  const showMap = T >= M - 0.15 && T < E + 0.25;
  const showEvents = T >= E - 0.1;

  const gestures = [
    { t0: 0.35, t1: 0.95, x0: 210, y0: 640, x1: 210, y1: 250 },
    { t0: 1.75, t1: 1.9, x0: 190, y0: 330, x1: 190, y1: 330 },
    { t0: likeT - 0.08, t1: likeT + 0.06, x0: 312, y0: 528, x1: 312, y1: 528 },
    { t0: D + 1.1, t1: D + 1.55, x0: 200, y0: 700, x1: 200, y1: 430 },
    // "View in Map" pill sits at y≈870 in detail content; after the 300px scroll ≈ 570
    { t0: M - 0.35, t1: M - 0.2, x0: 334, y0: 570, x1: 334, y1: 570 },
    { t0: markerTap - 0.07, t1: markerTap + 0.07, x0: 196, y0: 340, x1: 196, y1: 340 },
    { t0: E - 0.3, t1: E - 0.15, x0: 271, y0: 811, x1: 271, y1: 811 },
    { t0: E + 0.4, t1: E + 0.85, x0: 200, y0: 680, x1: 200, y1: 420 },
    { t0: E + 1.15, t1: E + 1.3, x0: 46, y0: 811, x1: 46, y1: 811 },
  ];

  // phone only: 14px bezel, no backdrop. Scaling to the card happens outside.
  return (
    <div style={{ position: 'relative', width: 393 + 28, height: 852 + 28, borderRadius: 66, background: '#111', padding: 14, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(20,22,20,0.22), inset 0 0 0 2px #333' }}>
      <div style={{ position: 'relative', width: 393, height: 852, borderRadius: 52, overflow: 'hidden', background: BG }}>
        {showHome && <div style={{ position: 'absolute', inset: 0, isolation: 'isolate', zIndex: 1, transform: `translateX(${T < M ? homeShift : 0}px)` }}><HomeScreen scroll={homeScroll} /></div>}
        {showMap && <div style={{ position: 'absolute', inset: 0, isolation: 'isolate', zIndex: 2, opacity: T < E ? mapOp : 1 }}><MapScreen zoom={mapZoom} pops={pops} sheet={sheet} tapped={T >= markerTap} /></div>}
        {showEvents && <div style={{ position: 'absolute', inset: 0, isolation: 'isolate', zIndex: 3, opacity: eventsIn * (1 - eventsOut) }}><EventsScreen scroll={eventsScroll} chip={chip} /></div>}
        <NavBar active={activeTab} />
        {T >= D - 0.3 && T < M + 0.25 && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 40, transform: `translateX(${detailX}px)`, opacity: detailOp, boxShadow: '-10px 0 30px rgba(0,0,0,0.15)' }}>
            <DetailScreen scroll={detailScroll} liked={liked} />
          </div>
        )}
        <Touch T={T} gestures={gestures} />
        <div style={{ position: 'absolute', left: 136, top: 11, width: 121, height: 35, borderRadius: 18, background: '#000', zIndex: 60 }} />
        <div style={{ position: 'absolute', left: 130, bottom: 8, width: 134, height: 5, borderRadius: 3, background: '#000', zIndex: 60 }} />
      </div>
    </div>
  );
}

/* ── runtime ─────────────────────────────────────────────────────────────
   Sits paused on the first frame (the Home screen) until the parent page
   posts {pikspot: 'play'}; {pikspot: 'pause'} freezes it where it is.
   ?autoplay in the URL plays it straight away; ?t=<seconds> shows one frame. */
const stage = document.getElementById('stage');
const root = ReactDOM.createRoot(stage);
const PHONE_W = 421, PHONE_H = 880, FILL = 0.84;   // phone height = 84% of the card

function fit() {
  const s = Math.min(window.innerHeight * FILL / PHONE_H, window.innerWidth * 0.9 / PHONE_W);
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
}
window.addEventListener('resize', fit);
fit();

let clock = 0, last = 0, raf = 0;
const draw = () => root.render(<Piece T={warp(clock)} />);
function tick(now) {
  if (last) clock = (clock + Math.min(now - last, 100) / 1000) % PLAY_TOTAL;
  last = now;
  draw();
  raf = requestAnimationFrame(tick);
}
function play() { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } }
function pause() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

window.addEventListener('message', e => {
  if (!e.data || typeof e.data !== 'object') return;
  if (e.data.pikspot === 'play') play();
  if (e.data.pikspot === 'pause') pause();
});

// warm every image so nothing pops in mid-loop
['avatar.jpg', 'challenge.jpg', 'e_e.jpg', 'ev1.jpg', 'ev3.jpg', 'gg.jpg', 'ladies.jpg', 'm1.jpg', 'm2.jpg', 'm3.jpg', 'm4.jpg', 'map.jpg']
  .forEach(f => { const i = new Image(); i.src = 'card-assets/' + f; });

// ?t=4.2 shows the frame at 4.2 playback seconds (for checking stills)
const at = location.search.match(/[?&]t=([\d.]+)/);
if (at) clock = parseFloat(at[1]) % PLAY_TOTAL;
draw();
if (/[?&]autoplay\b/.test(location.search)) play();

})();
