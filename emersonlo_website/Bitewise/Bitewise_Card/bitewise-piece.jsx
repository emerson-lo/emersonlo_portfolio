const { useComposition, CompositionStage, Easing, clamp } = window;

const BG = 'rgb(25,26,31)', DEEP = 'rgb(1,4,15)', LIME = 'rgb(184,243,133)', GREY = 'rgb(179,179,179)', MID = 'rgb(141,141,141)';
const SH = '0 0 10px rgba(233,233,233,0.25)';
const F = 'Inter, -apple-system, sans-serif';
const tx = (size, weight, color, extra) => ({ fontFamily: F, fontSize: size, fontWeight: weight || 400, color: color || '#fff', lineHeight: 1.2, ...extra });
const prog = (T, a, b) => clamp((T - a) / (b - a), 0, 1);
const move = (T, a, b) => Easing.easeInOutCubic(prog(T, a, b));
const glide = (T, a, b) => Easing.easeInOutQuart(prog(T, a, b));
const pop = (T, a, d = 0.35) => Easing.easeOutBack(prog(T, a, a + d));
const mix = (a, b, p) => a + (b - a) * p;
const pulse = (T, t, w = 0.12) => Math.max(0, 1 - Math.abs(T - t) / w);

const I = {
  clock: (c = '#fff', s = 20) => <svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="none" stroke={c} strokeWidth="2" /><path d="M12 6.5V12l3.5 2.5" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>,
  smile: (c = '#fff', s = 20) => <svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="none" stroke={c} strokeWidth="2" /><circle cx="9" cy="10" r="1.3" fill={c} /><circle cx="15" cy="10" r="1.3" fill={c} /><path d="M8 14.5c2.2 2.4 5.8 2.4 8 0" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>,
  dollar: (c = '#fff', s = 20) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 2v20M16.5 6.5c-.8-1.5-2.4-2.2-4.5-2.2-2.6 0-4.4 1.4-4.4 3.4 0 4.8 9.2 2.6 9.2 7.8 0 2.1-2 3.7-4.8 3.7-2.3 0-4-1-4.8-2.8" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>,
  star: (c = '#fff', s = 20) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17l-5.7 3.1 1.2-6.3L2.9 9.4l6.3-.8z" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" /></svg>,
  person: (c = '#fff', s = 9) => <svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.5" fill="none" stroke={c} strokeWidth="2.2" /><path d="M4 21c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" /></svg>,
  edit: (s = 12) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4M13 4H5a1 1 0 0 0-1 1v14" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /></svg>,
  back: (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  bookmark: (fill, s = 20) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4.5L6 21z" fill={fill || 'none'} stroke={fill || '#fff'} strokeWidth="2.2" strokeLinejoin="round" /></svg>,
  thumb: (fill, s = 22) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M7 11v10H3V11zM7 11l4-8c1.7 0 2.8 1.2 2.5 3L13 10h6.2c1.3 0 2.2 1.2 1.9 2.4l-1.8 7c-.3.9-1.1 1.6-2 1.6H7" fill={fill || 'none'} stroke={fill || '#fff'} strokeWidth="2" strokeLinejoin="round" /></svg>,
  dots: () => <svg width="16" height="6" viewBox="0 0 16 6"><circle cx="2.5" cy="3" r="2" fill="#fff" /><circle cx="8" cy="3" r="2" fill="#fff" /><circle cx="13.5" cy="3" r="2" fill="#fff" /></svg>,
  trash: () => <svg width="7" height="7" viewBox="0 0 24 24"><path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15" fill="none" stroke="#fff" strokeWidth="2.4" /></svg>,
  pen: () => <svg width="7" height="7" viewBox="0 0 24 24"><path d="M4 20l1-5L16 4l4 4L9 19z" fill="none" stroke="#fff" strokeWidth="2.4" /></svg>,
};
const NavIcon = {
  list: c => <svg width="20" height="16" viewBox="0 0 20 16"><g fill={c}><circle cx="2" cy="2" r="1.6" /><circle cx="2" cy="8" r="1.6" /><circle cx="2" cy="14" r="1.6" /><rect x="5.5" y="0.6" width="14" height="2.8" rx="1.4" /><rect x="5.5" y="6.6" width="14" height="2.8" rx="1.4" /><rect x="5.5" y="12.6" width="14" height="2.8" rx="1.4" /></g></svg>,
  bookmark: c => <svg width="14" height="18" viewBox="0 0 14 18"><path d="M1 0h12v18l-6-4.2L1 18z" fill={c} /></svg>,
  home: c => <svg width="20" height="18" viewBox="0 0 20 18"><path d="M10 0L0 8.5h2.8V18h5v-6h4.4v6h5V8.5H20z" fill={c} /></svg>,
  chat: c => <svg width="22" height="18" viewBox="0 0 22 18"><path d="M9 1C4.3 1 1 3.6 1 7c0 1.8 1 3.4 2.6 4.5L2.5 15l4-2.2c.8.2 1.6.3 2.5.3 4.7 0 8-2.6 8-6S13.7 1 9 1z" fill={c} /><path d="M18.5 7.5c1.6 1 2.5 2.4 2.5 4 0 1.3-.6 2.4-1.7 3.3l.7 2.7-3-1.6c-.6.1-1.2.2-1.9.2-2.2 0-4.1-.8-5.2-2" fill="none" stroke={c} strokeWidth="1.4" /></svg>,
  profile: c => <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="4.8" r="4.3" fill={c} /><path d="M0 18c.4-4.6 4-7.2 9-7.2s8.6 2.6 9 7.2z" fill={c} /></svg>,
};

function BottomNav({ active }) {
  const items = [['list', 'Lists'], ['bookmark', 'Forums'], ['home', 'Home'], ['chat', 'Forums'], ['profile', 'Profile']];
  return (
    <div style={{ position: 'absolute', left: 0, bottom: 0, width: 393, height: 74, background: DEEP, borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-around', padding: '14px 28px 0', boxSizing: 'border-box', zIndex: 20 }}>
      {items.map(([k, l], i) => { const c = i === active ? LIME : '#fff'; return (
        <div key={i} style={{ width: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ height: 18, display: 'flex', alignItems: 'flex-end' }}>{NavIcon[k](c)}</div>
          <span style={tx(7, 400, c)}>{l}</span>
        </div>); })}
    </div>
  );
}

const RECIPES = [
  { img: 'bw/pizza.jpg', name: 'Gluten Free Margarita Pizza', price: '$15.00', meta: ['Serves 3-4', '50 min'], person: true, sel: true },
  { img: 'bw/burger.jpg', name: 'Gluten Free Cheese Burger', price: '$24.16', meta: ['Serves 4', '35 min'], person: true, sel: true },
  { img: 'bw/pasta.jpg', name: 'Gluten Free Vodka Pasta', price: '$16.79', meta: ['Serves 4', '25 min'], person: true, sel: false },
  { img: 'bw/cookies.jpg', name: 'Gluten Free Chocolate Chip Cookies', price: '$18.50', meta: ['12 cookies', '1 hr'], sel: true },
  { img: 'bw/pancakes.jpg', name: 'Gluten Free Pancakes', price: '$11.54', meta: ['Serves 4', '20 min'], person: true, sel: false },
];

function RecipeCard({ r, selP = null, press = 0, menu = 0, dotsMode }) {
  const on = selP === null ? (r.sel ? 1 : 0) : selP;
  return (
    <div style={{ position: 'relative', width: 365, height: 100, background: BG, boxShadow: SH, display: 'flex', transform: `scale(${1 - press * 0.03})` }}>
      <div style={{ width: 100, height: 100, background: `url(${r.img}) center / cover`, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: '10px 50px 0 10px', display: 'flex', flexDirection: 'column' }}>
        <span style={tx(15, 500, '#fff', { lineHeight: 1.27 })}>{r.name}</span>
        <span style={tx(11, 300, LIME, { marginTop: 3 })}>{r.price}</span>
        <div style={{ position: 'absolute', left: 110, bottom: 9, display: 'flex', alignItems: 'center', gap: 4, ...tx(10, 300, '#fff') }}>
          {r.meta[0]}{r.person && I.person('#fff')}<span style={{ width: 1, height: 11, background: '#fff', margin: '0 4px' }} />{r.meta[1]}
        </div>
      </div>
      {dotsMode ? (
        <div style={{ position: 'absolute', right: 12, top: 14 }}>{I.dots()}</div>
      ) : (
        <div style={{ position: 'absolute', right: 12, top: 10, width: 12, height: 12, borderRadius: 6, boxSizing: 'border-box', border: on > 0.5 ? 'none' : '1px solid #fff', background: on > 0.5 ? LIME : 'transparent', transform: `scale(${on > 0.5 ? mix(0.6, 1, Math.min(on, 1)) * (on > 1 ? 1 : 1) : 1})` }} />
      )}
      {menu > 0 && (
        <div style={{ position: 'absolute', right: 8, top: 26, width: 46, borderRadius: 3, border: '0.5px dashed rgba(255,255,255,.35)', background: BG, opacity: menu, transform: `translateY(${(1 - menu) * -6}px) scale(${mix(0.9, 1, menu)})`, transformOrigin: '100% 0', boxShadow: '0 4px 14px rgba(0,0,0,.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', ...tx(6, 400) }}>Remove {I.trash()}</div>
          <div style={{ height: 0.5, background: 'rgba(255,255,255,.35)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', ...tx(6, 400) }}>Edit {I.pen()}</div>
        </div>
      )}
    </div>
  );
}

function Home({ scroll, pastaSel, cardPress, circlePress, count }) {
  const tabs = [['clock', 'Quickest'], ['smile', 'Healthiest'], ['dollar', 'Cheapest'], ['star', 'Popular']];
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 393, transform: `translateY(${-scroll}px)` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 300, background: 'url(bw/spread.jpg) center 30% / cover' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 300, background: 'linear-gradient(180deg, rgba(25,26,31,0.55) 0%, rgba(25,26,31,0.7) 55%, rgb(25,26,31) 100%)' }} />
        <div style={{ position: 'absolute', left: 14, top: 55, width: 365, height: 32, borderRadius: 20, background: 'rgba(25,26,31,0.55)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, ...tx(14, 300) }}>
          Davis<span style={{ width: 1, height: 16, background: '#fff' }} />$30<span style={{ width: 1, height: 16, background: '#fff' }} />Gluten Free
          <div style={{ position: 'absolute', right: 16, top: 10 }}>{I.edit()}</div>
        </div>
        <span style={{ position: 'absolute', left: 23, top: 118, ...tx(16, 400, LIME) }}>Welcome Emerson!</span>
        <span style={{ position: 'absolute', left: 21, top: 141, width: 340, ...tx(22, 700, '#fff', { lineHeight: 1.25 }) }}>Check out these Gluten Free recipes!</span>
        <div style={{ position: 'absolute', left: 14, top: 219, width: 97, height: 21, borderRadius: 11, background: DEEP, display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 16, boxSizing: 'border-box', ...tx(11, 400) }}>Meal type<svg width="8" height="6" viewBox="0 0 8 6"><path d="M0 0h8L4 6z" fill="#fff" /></svg></div>
        <div style={{ position: 'absolute', left: 14, top: 251, width: 365, height: 53, borderRadius: 10, background: DEEP, display: 'flex', padding: 3, boxSizing: 'border-box' }}>
          {tabs.map(([k, l], i) => { const on = i === 3; const c = on ? LIME : MID; return (
            <div key={l} style={{ flex: 1, borderRadius: 8, background: on ? BG : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              {I[k](on ? LIME : GREY, 20)}<span style={tx(10, on ? 400 : 300, on ? '#fff' : GREY)}>{l}</span>
            </div>); })}
        </div>
        {RECIPES.map((r, i) => (
          <div key={i} style={{ position: 'absolute', left: 14, top: 320 + i * 116 }}>
            <RecipeCard r={r} selP={i === 2 ? pastaSel : null} press={i === 0 ? cardPress : 0} />
            {i === 2 && circlePress > 0 && <div style={{ position: 'absolute', right: 6, top: 4, width: 24, height: 24, borderRadius: 12, background: LIME, opacity: circlePress * 0.35, transform: `scale(${1 + (1 - circlePress) * 0.8})` }} />}
          </div>
        ))}
        <div style={{ height: 320 + 5 * 116 + 120 }} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 64, background: `linear-gradient(180deg, rgba(25,26,31,${clamp(scroll / 120, 0, 1)}) 72%, rgba(25,26,31,0))`, zIndex: 9 }} />
      <div style={{ position: 'absolute', left: 14, bottom: 84, width: 365, height: 38, borderRadius: 15, background: DEEP, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12), 0 6px 20px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, ...tx(16, 500) }}>Save all selected ({count})</div>
      <BottomNav active={2} />
    </div>
  );
}

const INGR = [
  { sec: 'Gluten Free - Dough', items: [['bw/flour.jpg', 'King Arthur Baking Company Gluten Free All Purpose Flour'], ['bw/yeast.jpg', 'Fleischmann’s Active Dry Yeast']] },
  { sec: 'Tomato Sauce', items: [['bw/tomato.jpg', 'Signature’s Select Crushed Red Tomatoes']] },
];
const STEPS = [
  ['Step 1:', 'Make The Dough!', ['In a large mixing bowl, combine 1½ cups of gluten-free all-purpose flour, 1 teaspoon of instant yeast, 1 teaspoon of sugar or honey, and ½ teaspoon of salt.', 'Add ¾ cup of warm water (about 110°F) and 1 tablespoon of olive oil.', 'Mix until a sticky dough forms.']],
  ['Step 2:', 'Preheat the Oven', ['While the dough rises, preheat your oven to 475°F (245°C) so it’s ready when the pizza is assembled.']],
  ['Step 3:', 'Prepare the Sauce', ['In a small bowl, stir together ½ cup of crushed tomatoes, 1 tablespoon of olive oil, ¼ teaspoon of salt, and 1 minced garlic clove.', 'Tear in 1–2 fresh basil leaves for added flavor. Set aside.']],
  ['Step 4:', 'Shape the Dough', ['Lightly oil a pizza pan or baking sheet. Using wet hands, press the dough into a 12-inch circle on the pan.']],
  ['Step 5:', 'Add the Topings', ['Spread the tomato sauce evenly over the dough. Tear 4 to 6 ounces of fresh mozzarella and place the pieces over the sauce.']],
  ['Step 6:', 'Bake the Pizza', ['Bake for 12 to 15 minutes, until the crust turns golden and the cheese is bubbling.']],
];

function Recipe({ scroll, tabP, saved, tabPress, savePress }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 393, transform: `translateY(${-scroll}px)` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 300, background: 'url(bw/pizza.jpg) center / cover' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 300, background: 'linear-gradient(180deg, rgba(25,26,31,0.92) 0%, rgba(25,26,31,0.85) 30%, rgba(26,27,32,0.1) 52%, rgba(26,27,32,0) 62%, rgb(25,26,31) 94%)' }} />
        <div style={{ position: 'absolute', left: 343, top: 117 }}>{I.thumb()}</div>
        <div style={{ position: 'absolute', left: 16, top: 236, width: 361, height: 165, borderRadius: 30, background: BG, boxShadow: SH, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 22, boxSizing: 'border-box' }}>
          <span style={tx(20, 700)}>Gluten Free  Margherita Pizza</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, ...tx(12, 400) }}>$15.00<span style={{ width: 1, height: 18, background: '#fff' }} />Serves 4</div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
            {[['clock', '50 Minutes', 'Time'], ['star', '83/100', 'Health Score'], ['smile', '19 Likes', 'From Users']].map(([k, v, l], i) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <div style={{ width: 1, height: 30, background: '#fff', marginTop: 20 }} />}
                <div style={{ width: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  {I[k](LIME, 20)}<span style={tx(15, 500)}>{v}</span><span style={tx(10, 100, '#fff')}>{l}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 64, top: 430, width: 265, height: 45, borderRadius: 10, background: DEEP, padding: 3, boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: 3 + tabP * 126, top: 3, width: 133, height: 39, borderRadius: 8, background: BG, boxShadow: '0 0 0 1px rgba(255,255,255,.04)' }} />
          <div style={{ position: 'relative', display: 'flex', height: '100%', transform: `scale(${1 - tabPress * 0.03})` }}>
            {['Ingredients', 'Instructions'].map(l => <span key={l} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', ...tx(10.5, 500) }}>{l}</span>)}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 500, width: 393, opacity: 1 - tabP, transform: `translateX(${-tabP * 30}px)` }}>
          {INGR.map((s, si) => (
            <div key={s.sec} style={{ position: 'absolute', left: 33, top: si === 0 ? 0 : 196, width: 331, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={tx(14, 700)}>{s.sec}</span>
              {s.items.map(([img, n]) => (
                <div key={n} style={{ height: 70, borderRadius: 20, boxShadow: '0 0 6px rgba(233,233,233,0.25)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 70, height: 70, borderRadius: 15, background: `#fff url(${img}) center / 88% no-repeat`, flexShrink: 0 }} />
                  <span style={{ ...tx(12, 700, '#fff', { lineHeight: 1.25 }), paddingTop: 12, paddingRight: 30 }}>{n}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: 16, top: 500, width: 361, borderRadius: 30, boxShadow: SH, padding: '36px 30px 40px 26px', boxSizing: 'border-box', opacity: tabP, transform: `translateX(${(1 - tabP) * 30}px)`, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ position: 'absolute', left: 32, top: 46, bottom: 60, width: 0.8, background: LIME }} />
          {STEPS.map(([a, b, bullets]) => (
            <div key={a} style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 9, height: 9, borderRadius: 5, boxShadow: `inset 0 0 0 1px ${LIME}`, background: BG, marginRight: 4 }} />
                <span style={tx(12, 700)}>{a}</span><span style={tx(12, 500)}>{b}</span>
              </div>
              {bullets.map((t, i) => <div key={i} style={{ display: 'flex', gap: 6, paddingLeft: 26, ...tx(8.5, 200, '#fff', { lineHeight: 1.35 }) }}><span>•</span><span>{t}</span></div>)}
            </div>
          ))}
        </div>
        <div style={{ height: 1500 }} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 100, background: `linear-gradient(180deg, rgba(25,26,31,${clamp(scroll / 160, 0, 1) * 0.95}) 70%, rgba(25,26,31,0))`, zIndex: 5 }} />
      <div style={{ position: 'absolute', left: 0, top: 47, width: 393, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6 }}>
        <div style={{ position: 'absolute', left: 26 }}>{I.back()}</div>
        <span style={tx(14, 700)}>Safeway @ 2121 Cowell  Blvd</span>
        <div style={{ position: 'absolute', right: 22, transform: `scale(${1 + savePress * 0.25})` }}>{I.bookmark(saved ? LIME : null)}</div>
      </div>
      <BottomNav active={2} />
    </div>
  );
}

function Favorites({ menu, dotsPress }) {
  const favs = [RECIPES[0], RECIPES[1], RECIPES[3]];
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 240, background: 'url(bw/spread.jpg) center 60% / cover' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 240, background: 'linear-gradient(180deg, rgba(25,26,31,0.25) 0%, rgba(25,26,31,0.45) 55%, rgb(25,26,31) 100%)' }} />
      <div style={{ position: 'absolute', left: 14, top: 58, width: 40, height: 40, borderRadius: 20, background: 'rgba(25,26,31,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.back(14)}</div>
      <span style={{ position: 'absolute', left: 14, top: 140, ...tx(36, 700) }}>Favorite Recipes</span>
      {favs.map((r, i) => (
        <div key={i} style={{ position: 'absolute', left: 14, top: 260 + i * 125 }}>
          <RecipeCard r={r} dotsMode menu={i === 1 ? menu : 0} />
          {i === 1 && dotsPress > 0 && <div style={{ position: 'absolute', right: 4, top: 4, width: 32, height: 20, borderRadius: 10, background: '#fff', opacity: dotsPress * 0.2 }} />}
        </div>
      ))}
      <BottomNav active={1} />
    </div>
  );
}

function Touch({ x, y, op, down }) {
  return <div style={{ position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.4)', border: '2px solid rgba(255,255,255,0.65)', boxShadow: '0 4px 14px rgba(0,0,0,0.35)', boxSizing: 'border-box', opacity: op, transform: `scale(${down ? 0.82 : 1})`, zIndex: 80, pointerEvents: 'none' }} />;
}

// gestures: taps {t, x, y} and drags {t0, t1, x0, y0, x1, y1}
function touchAt(T, G) {
  for (const g of G) {
    if (g.t !== undefined) {
      if (T >= g.t - 0.28 && T <= g.t + 0.2) return { x: g.x, y: g.y, op: Math.min(prog(T, g.t - 0.28, g.t - 0.14), 1 - prog(T, g.t + 0.06, g.t + 0.2)), down: Math.abs(T - g.t) < 0.07 };
    } else if (T >= g.t0 - 0.16 && T <= g.t1 + 0.16) {
      const p = move(T, g.t0, g.t1);
      return { x: mix(g.x0, g.x1, p), y: mix(g.y0, g.y1, p), op: Math.min(prog(T, g.t0 - 0.16, g.t0), 1 - prog(T, g.t1, g.t1 + 0.16)), down: T >= g.t0 && T <= g.t1 };
    }
  }
  return null;
}

function Piece() {
  const { T, CUES } = useComposition();
  const H = CUES.Browse, RC = CUES.Recipe, FV = CUES.Saved, BK = CUES.Back;

  // Home: scroll down, select pasta, scroll back, tap pizza
  const tSel = H + 1.55, tPizza = H + 2.9;
  const homeScroll = 200 * glide(T, H + 0.5, H + 1.2) - 200 * glide(T, H + 1.9, H + 2.5);
  const tReset = FV + 2.3; // pasta deselects while Favorites still covers Home
  const pastaSel = T < tSel || T > tReset ? 0 : pop(T, tSel, 0.3);
  const count = T < tSel || T > tReset ? 3 : 4;
  // Recipe
  const tSave = RC + 0.55, tTab = RC + 1.85, tBack = RC + 3.75;
  const recScroll = 300 * glide(T, RC + 0.95, RC + 1.55) + 480 * glide(T, RC + 2.4, RC + 3.15) - 780 * glide(T, tBack - 0.45, tBack - 0.05);
  const tabP = move(T, tTab, tTab + 0.35);
  // Favorites
  const tNav = BK - 0.0, tDots = FV + 0.9, tClose = FV + 2.0;
  const menu = Easing.easeOutCubic(prog(T, tDots, tDots + 0.22)) * (1 - prog(T, tClose, tClose + 0.18));

  // screen transitions (x offsets in px of 393 space)
  const push1 = Easing.easeInOutCubic(prog(T, tPizza + 0.08, tPizza + 0.5)); // home → recipe
  const pop1 = Easing.easeInOutCubic(prog(T, tBack + 0.08, tBack + 0.5)); // recipe → home
  const toFav = Easing.easeInOutCubic(prog(T, FV + 0.08, FV + 0.42));
  const toHome = Easing.easeInOutCubic(prog(T, tClose + 0.55, tClose + 0.95));
  const recipeX = 393 * (1 - push1) + 393 * pop1;
  const homeX = -110 * push1 + 110 * pop1;
  const favOp = toFav * (1 - toHome);

  const G = [
    { t0: H + 0.5, t1: H + 1.1, x0: 200, y0: 700, x1: 200, y1: 500 },
    { t: tSel, x: 371, y: 336 + 232 - 200 + 10 },
    { t0: H + 1.9, t1: H + 2.4, x0: 200, y0: 420, x1: 200, y1: 620 },
    { t: tPizza, x: 210, y: 370 },
    { t: tSave, x: 361, y: 69 },
    { t0: RC + 0.95, t1: RC + 1.45, x0: 200, y0: 700, x1: 200, y1: 400 },
    { t: tTab, x: 262, y: 452 - 300 },
    { t0: RC + 2.4, t1: RC + 3.0, x0: 200, y0: 720, x1: 200, y1: 260 },
    { t: tBack, x: 34, y: 69 },
    { t: FV, x: 99, y: 805 },
    { t: tDots, x: 371, y: 260 + 125 + 17 },
    { t: tClose, x: 220, y: 700 },
  ];
  const touch = touchAt(T, G);
  const pressAt = t => pulse(T, t, 0.1);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F5F5F4' }}>
      <div style={{ position: 'absolute', left: 482, top: 52, width: 437, height: 896, borderRadius: 64, background: '#111', padding: 12, boxSizing: 'border-box', boxShadow: '0 40px 80px rgba(20,22,20,0.28), inset 0 0 0 2px #3a3a3e' }}>
        <div style={{ position: 'relative', width: 413, height: 872, borderRadius: 52, overflow: 'hidden', background: BG }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 852, transform: 'scale(1.0509)', transformOrigin: '0 0' }}>
            <div style={{ position: 'absolute', inset: 0, transform: `translateX(${homeX}px)`, filter: `brightness(${1 - 0.4 * Math.min(push1, 1 - pop1)})` }}>
              <Home scroll={homeScroll} pastaSel={pastaSel} cardPress={pressAt(tPizza)} circlePress={T > tSel && T < tSel + 0.4 ? 1 - prog(T, tSel, tSel + 0.4) : 0} count={count} />
            </div>
            {push1 > 0 && pop1 < 1 && (
              <div style={{ position: 'absolute', inset: 0, transform: `translateX(${recipeX}px)`, boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}>
                <Recipe scroll={recScroll} tabP={tabP} saved={T > tSave} tabPress={pressAt(tTab)} savePress={pressAt(tSave) } />
              </div>
            )}
            {favOp > 0 && (
              <div style={{ position: 'absolute', inset: 0, opacity: favOp, transform: `translateY(${(1 - toFav) * 16}px)` }}>
                <Favorites menu={menu} dotsPress={pressAt(tDots)} />
              </div>
            )}
            <div style={{ position: 'absolute', left: 0, top: 0, width: 393, height: 47, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 30px 0 40px', boxSizing: 'border-box' }}>
              <span style={tx(15, 600)}>9:41</span>
              <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
                {[4, 6, 8, 11].map(h => <div key={h} style={{ width: 3, height: h, borderRadius: 1, background: '#fff' }} />)}
                <div style={{ width: 23, height: 11, borderRadius: 3.5, border: '1px solid rgba(255,255,255,.5)', padding: 1.5, boxSizing: 'border-box', marginLeft: 6 }}><div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: 2 }} /></div>
              </div>
            </div>
            <div style={{ position: 'absolute', left: 136, top: 11, width: 121, height: 34, borderRadius: 17, background: '#000', zIndex: 75 }} />
            <div style={{ position: 'absolute', left: 130, bottom: 7, width: 134, height: 5, borderRadius: 3, background: '#fff', zIndex: 75 }} />
            {touch && <Touch {...touch} />}
          </div>
        </div>
      </div>
    </div>
  );
}

window.BitewiseVideo = function BitewiseVideo() {
  React.useEffect(() => {
    const fix = () => {
      const svg = document.querySelector('svg[data-om-exportable-video-with-duration-secs]');
      if (!svg || /scale\(0\.05\)/.test(svg.style.transform)) window.dispatchEvent(new Event('resize'));
    };
    const iv = setInterval(fix, 100);
    return () => clearInterval(iv);
  }, []);
  return (
    <CompositionStage width={1400} height={1000} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#F5F5F4">
      <Piece />
    </CompositionStage>
  );
};
