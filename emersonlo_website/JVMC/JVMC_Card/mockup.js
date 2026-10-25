/* JVMC MacBook + iPhone mockup for the home page card.
   Built from jvmc-piece.jsx (the handoff, in this folder): same pages and
   choreography, with a small built-in clock instead of the handoff's
   video engine and no playback bar.
   Source: src/mockup.jsx, compiled to mockup.js (plain React.createElement). */
(function () {
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const Easing = {
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutCubic: t => --t * t * t + 1,
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
  };

  // scenes play at their authored length, so the clock is the timeline
  const SCENES = [{
    name: 'Intro',
    dur: 2.0
  }, {
    name: 'Story',
    dur: 2.4
  }, {
    name: 'Clinics',
    dur: 2.9
  }, {
    name: 'Return',
    dur: 1.8
  }];
  const CUES = {};
  let TOTAL = 0;
  SCENES.forEach(s => {
    CUES[s.name] = Math.round(TOTAL * 1000) / 1000;
    TOTAL += s.dur;
  });
  TOTAL = Math.round(TOTAL * 1000) / 1000;
  const TEAL = 'rgb(1,136,122)',
    MINT = 'rgb(171,220,207)',
    DEEP = 'rgb(9,73,53)',
    INK = 'rgb(53,57,53)',
    BG = 'rgb(248,248,248)';
  const SERIF = 'Merriweather, Georgia, serif',
    SANS = 'Inter, -apple-system, sans-serif';
  const CARD_SHADOW = 'inset 0 0 0 2px rgb(171,220,207), 0 0 50px rgba(171,220,207,0.35)';
  const prog = (T, a, b) => clamp((T - a) / (b - a), 0, 1);
  const MOTION = {
    move: (T, a, b) => Easing.easeInOutCubic(prog(T, a, b)),
    glide: (T, a, b) => Easing.easeInOutQuart(prog(T, a, b)),
    settle: (T, a, b) => Easing.easeOutCubic(prog(T, a, b))
  };
  const mix = (a, b, p) => a + (b - a) * p;
  const t = (size, weight, color, extra) => ({
    fontFamily: SANS,
    fontSize: size,
    fontWeight: weight || 400,
    color: color || INK,
    lineHeight: 1.5,
    ...extra
  });
  const serif = (size, color, extra) => ({
    fontFamily: SERIF,
    fontSize: size,
    fontWeight: 700,
    color: color || DEEP,
    lineHeight: 1.2,
    ...extra
  });
  const Logo = ({
    w,
    h
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      height: h,
      background: 'url(jv/logo.png) 38.48% 50% / 129.098% 220.264% no-repeat',
      flexShrink: 0
    }
  });
  const Cal = ({
    s = 24
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 19H5V8h14m-3-7v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5z",
    fill: DEEP
  }));
  const Info = ({
    s = 24
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9",
    fill: DEEP
  }), /*#__PURE__*/React.createElement("rect", {
    x: "11",
    y: "6.5",
    width: "2",
    height: "7",
    rx: "1",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "16.5",
    r: "1.2",
    fill: "#fff"
  }));
  const Chev = ({
    dir = 1,
    s = 18
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s * 2,
    viewBox: "0 0 10 20",
    style: {
      transform: dir < 0 ? 'scaleX(-1)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 2l6 8-6 8",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
  const Pill = ({
    children,
    size = 18,
    pad = '10px 30px',
    hover = 0
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: pad,
      borderRadius: 100,
      background: TEAL,
      ...t(size, 700, BG, {
        whiteSpace: 'nowrap'
      }),
      boxShadow: hover ? `0 0 0 ${3 * hover}px rgba(1,136,122,0.25)` : 'none'
    }
  }, children);

  // soft pastel wave behind hero / footer
  function Haze({
    w,
    h,
    path,
    vb,
    drift,
    opacity = 0.55,
    blur = 40
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: w,
      height: h,
      viewBox: vb,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        filter: `blur(${blur}px)`,
        opacity,
        transform: `translateX(${drift}px)`
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: 'hz' + w,
      x1: "0",
      y1: "0",
      x2: "1",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0.25",
      stopColor: "rgb(255,186,208)"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.53",
      stopColor: "rgb(227,197,255)"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.8",
      stopColor: "rgb(138,213,229)"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "rgb(202,226,173)"
    }))), /*#__PURE__*/React.createElement("path", {
      d: path,
      fill: `url(#hz${w})`
    }));
  }
  function Bubbles({
    list
  }) {
    return list.map(([x, y, s], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: x,
        top: y,
        width: s,
        height: s,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(171,220,207,0.9), rgba(171,220,207,0.35))'
      }
    }));
  }
  function Ribbon({
    scale = 1
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 679 * scale,
        height: 163.5 * scale,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: 679 * scale,
      height: 131 * scale,
      viewBox: "0 0 679 131",
      style: {
        position: 'absolute',
        left: 0,
        top: 19 * scale
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "rib",
      x1: "0",
      y1: "1",
      x2: "0",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0.4",
      stopColor: TEAL
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.74",
      stopColor: "rgb(27,94,73)"
    }))), /*#__PURE__*/React.createElement("path", {
      d: "M 84.411 4.451 C 86.265 1.67 89.387 0 92.73 0 L 583.042 0 C 586.323 0 589.396 1.609 591.264 4.307 L 668.132 115.307 C 672.725 121.939 667.978 131 659.911 131 L 18.691 131 C 10.703 131 5.939 122.096 10.372 115.451 L 84.411 4.451 Z",
      fill: "url(#rib)"
    })), /*#__PURE__*/React.createElement("svg", {
      width: 604 * scale,
      height: 163.5 * scale,
      viewBox: "0 0 604 163.525",
      style: {
        position: 'absolute',
        left: 37 * scale,
        top: 0,
        filter: 'drop-shadow(0 0 25px rgba(173,173,173,0.25))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 75.015 5.707 C 76.672 2.221 80.187 0 84.047 0 L 517.085 0 C 520.892 0 524.368 2.161 526.053 5.575 L 596.881 149.099 C 600.161 155.745 595.325 163.525 587.914 163.525 L 15.826 163.525 C 8.479 163.525 3.64 155.867 6.794 149.232 L 75.015 5.707 Z",
      fill: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 170 * scale,
        top: 40 * scale,
        width: 338 * scale,
        textAlign: 'center',
        ...serif(36 * scale)
      }
    }, "Serving the Oak Park Community"));
  }
  const CLINICS = [{
    img: 'jv/rhc.jpg',
    title: 'Reproductive Health Clinic',
    a: 'Last Saturday of every month, 1:00 pm - 4:00 pm.',
    b: 'Call or text to schedule an appointment.'
  }, {
    img: 'jv/volunteer.jpg',
    pos: '4.6% 33%',
    title: 'Volunteer',
    a: 'Arrive at 12:30pm. Volunteer from 1:00pm - 5:00pm',
    b: 'Email with questions about recruitment or fill out our interest form.'
  }, {
    img: 'jv/ghc.jpg',
    title: 'Gender Health Clinic',
    a: '1st and 3rd Friday of each month, 6:00pm - 9:00pm.',
    b: 'Appointments are made on the GHC website.'
  }, {
    img: 'jv/people.jpg',
    title: 'JVMC Clinic',
    a: 'Every Saturday, 1:00pm - 4:00pm.',
    b: 'Walk-ins welcome during clinic hours.'
  }];
  function ClinicCard({
    c,
    w,
    h,
    imgH,
    fs
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        height: h,
        borderRadius: 20 * fs,
        background: '#fff',
        boxShadow: CARD_SHADOW,
        padding: 20 * fs,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: imgH,
        borderRadius: `${10 * fs}px ${10 * fs}px 0 0`,
        background: `url(${c.img}) ${c.pos || 'center'} / cover`,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26 * fs,
        padding: `0 ${24 * fs}px`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...serif(34 * fs, INK),
        textAlign: 'center'
      }
    }, c.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10 * fs,
        alignSelf: 'stretch'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12 * fs,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Cal, {
      s: 24 * fs
    }), /*#__PURE__*/React.createElement("span", {
      style: t(17 * fs)
    }, c.a)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12 * fs,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Info, {
      s: 24 * fs
    }), /*#__PURE__*/React.createElement("span", {
      style: t(16 * fs)
    }, c.b))), /*#__PURE__*/React.createElement(Pill, {
      size: 22 * fs,
      pad: `${10 * fs}px ${30 * fs}px`
    }, "Schedule Now")));
  }

  // carousel: p = fractional index of the centred card
  function Carousel({
    p,
    width,
    height,
    cw,
    ch,
    imgH,
    fs,
    spread
  }) {
    const n = CLINICS.length;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width,
        height,
        overflow: 'hidden'
      }
    }, CLINICS.map((c, i) => {
      let o = i - p;
      o = (o % n + n + n / 2) % n - n / 2;
      const a = Math.min(1, Math.abs(o));
      const s = mix(1, 0.756, a);
      const vis = Math.abs(o) < 1.6;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          position: 'absolute',
          left: width / 2 - cw / 2 + o * spread,
          top: height / 2 - ch / 2,
          transform: `scale(${s})`,
          opacity: vis ? mix(1, 0.45, a) * (1 - clamp(Math.abs(o) - 1, 0, 0.6) / 0.6) : 0,
          filter: `blur(${a * 1.5 * fs}px)`,
          zIndex: Math.round(10 - Math.abs(o) * 4)
        }
      }, /*#__PURE__*/React.createElement(ClinicCard, {
        c: c,
        w: cw,
        h: ch,
        imgH: imgH,
        fs: fs
      }));
    }));
  }
  function Dots({
    p,
    w,
    h,
    d,
    gap
  }) {
    const n = CLINICS.length;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        height: h,
        borderRadius: 25,
        background: BG,
        boxShadow: 'inset 0 0 0 1.5px rgb(189,189,189)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap
      }
    }, CLINICS.map((_, i) => {
      const dist = Math.min(Math.abs(i - p), n - Math.abs(i - p));
      const on = 1 - clamp(dist, 0, 1);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          width: d,
          height: d,
          borderRadius: '50%',
          background: on > 0.5 ? TEAL : 'rgb(189,189,189)',
          transform: `scale(${1 + on * 0.25})`
        }
      });
    }));
  }
  const ArrowBtn = ({
    dir,
    s,
    press = 0
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      width: s,
      height: s,
      borderRadius: '50%',
      background: TEAL,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transform: `scale(${1 - press * 0.08})`,
      boxShadow: press ? '0 0 0 6px rgba(1,136,122,0.18)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Chev, {
    dir: dir,
    s: s * 0.26
  }));

  /* ---------------- Desktop page (1440 wide) ---------------- */
  function DesktopPage({
    scroll,
    p,
    drift,
    press
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: BG,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 80,
        top: 0,
        width: 1440,
        height: 4731,
        transform: `translateY(${-scroll}px)`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -252,
        top: 115
      }
    }, /*#__PURE__*/React.createElement(Haze, {
      w: 1778,
      h: 606,
      vb: "0 0 1778.366 605.546",
      drift: drift,
      path: "M 1081 130.5 C 280.797 -74.718 175.167 360.333 0 526.5 C 207 401.5 550.5 617.761 1015 605 C 1561 590 1868.333 303.167 1755 0 C 1778.167 231.667 1352 200 1081 130.5 Z"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -304,
        top: 3853
      }
    }, /*#__PURE__*/React.createElement(Haze, {
      w: 2127,
      h: 1263,
      vb: "0 0 2127.18 1263",
      drift: -drift,
      opacity: 0.45,
      path: "M 193.681 217.5 C 674.681 634.5 996.197 231.375 1384.682 275.5 C 1587.182 298.5 1773.079 237.7 1784.182 0 L 2127.18 597.5 C 2106.68 597.5 1310.182 1098 1138.182 801.5 C 998.718 561.088 274.22 582.767 59.827 957.95 L 4.682 1263 C -10.463 1143.03 11.977 1041.686 59.827 957.95 L 193.681 217.5 Z"
    })), /*#__PURE__*/React.createElement(Bubbles, {
      list: [[180, 1480, 22], [28, 1560, 34], [-14, 1700, 46], [20, 1800, 84], [130, 1890, 52], [1300, 2150, 22], [1360, 2220, 34], [1395, 2320, 50], [1330, 2470, 80], [1240, 2560, 54], [1150, 2640, 30], [150, 3250, 26], [70, 3320, 22], [20, 3400, 50], [70, 3520, 80], [260, 3580, 40], [380, 3560, 22], [440, 3660, 26]]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 167,
        top: 302,
        width: 1106,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 166,
        height: 123,
        background: 'url(jv/teddy.png) center / cover'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...serif(56),
        lineHeight: 1,
        textAlign: 'center',
        whiteSpace: 'nowrap'
      }
    }, "Welcome to Joan Viteri Memorial Clinic"), /*#__PURE__*/React.createElement("span", {
      style: {
        ...t(18),
        width: 754,
        textAlign: 'center'
      }
    }, "Serving the health care needs of uninsured drug users, sex workers, trans folks, and their families regardless of documentation status.")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 24
      }
    }, /*#__PURE__*/React.createElement(Pill, null, "Contact Us"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 200,
        top: 874,
        width: 1040,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 100
      }
    }, /*#__PURE__*/React.createElement(Ribbon, null), /*#__PURE__*/React.createElement("div", {
      style: {
        alignSelf: 'stretch',
        height: 544,
        borderRadius: 20,
        background: '#fff',
        boxShadow: CARD_SHADOW,
        padding: 60,
        boxSizing: 'border-box',
        display: 'flex',
        gap: 40,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 320,
        height: 424,
        borderRadius: 20,
        background: 'url(jv/unbiased.jpg) center / cover',
        boxShadow: '0 0 50px rgba(173,173,173,0.25)',
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: serif(36)
    }, "Unbiased Healthcare"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 32
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: t(18)
    }, "We provide basic medical care and health education in a non-judgmental, accessible way."), /*#__PURE__*/React.createElement("span", {
      style: t(18)
    }, "Offering free primary health care services to the uninsured population in the Oak Park area of Sacramento, CA."), /*#__PURE__*/React.createElement("span", {
      style: t(18)
    }, "Our mission is fulfilled through the service of UC Davis undergraduates, medical, PA, NP students and the generosity of physicians.")))), /*#__PURE__*/React.createElement("div", {
      style: {
        alignSelf: 'stretch',
        height: 503,
        borderRadius: 20,
        background: '#fff',
        boxShadow: CARD_SHADOW,
        padding: 60,
        boxSizing: 'border-box',
        display: 'flex',
        gap: 40,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: serif(36)
    }, "The People We Serve"), /*#__PURE__*/React.createElement("span", {
      style: t(18)
    }, "At JVMC, we welcome everyone, regardless of their life history. No matter who you are, you are welcome."), /*#__PURE__*/React.createElement("span", {
      style: t(18)
    }, "We are known in the community for caring about forgotten populations, in particular: individuals who use intravenous drugs, sex workers, people who identify as transgender, and families.")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 340,
        height: 383,
        borderRadius: 20,
        background: 'url(jv/people.jpg) center / cover',
        boxShadow: '0 0 50px rgba(173,173,173,0.25)',
        flexShrink: 0
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 225,
        top: 2485,
        width: 990,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 80
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...serif(48),
        lineHeight: 1
      }
    }, "Explore Our Clinics!"), /*#__PURE__*/React.createElement("span", {
      style: t(24, 700, INK, {
        lineHeight: 2
      })
    }, "Discover everything JVMC has to offer.")), /*#__PURE__*/React.createElement(Carousel, {
      p: p,
      width: 990,
      height: 661,
      cw: 520,
      ch: 661,
      imgH: 280,
      fs: 1,
      spread: 300
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 20,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(ArrowBtn, {
      dir: -1,
      s: 70
    }), /*#__PURE__*/React.createElement(Dots, {
      p: p,
      w: 284,
      h: 36,
      d: 14,
      gap: 36
    }), /*#__PURE__*/React.createElement(ArrowBtn, {
      dir: 1,
      s: 70,
      press: press
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 205,
        top: 3781,
        width: 1056,
        height: 459,
        display: 'flex',
        gap: 204,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
        width: 373
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: serif(36)
    }, "Come Visit Us!"), /*#__PURE__*/React.createElement("span", {
      style: t(18)
    }, "3647 40th St, Sacramento, CA 95817")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: serif(36)
    }, "Opening Hours"), /*#__PURE__*/React.createElement("span", {
      style: t(18)
    }, "Every Saturday: 1:00pm - 4:00pm")), /*#__PURE__*/React.createElement("span", {
      style: serif(36)
    }, "Contact Us"), /*#__PURE__*/React.createElement("div", {
      style: {
        alignSelf: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(Pill, null, "Ask Us Questions"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 479,
        height: 459,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 25,
        top: 2,
        width: 454,
        height: 457,
        borderRadius: '50%',
        background: 'linear-gradient(141deg, rgb(1,136,122) 65%, rgb(171,220,207) 80%)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 454,
        height: 454,
        borderRadius: '50%',
        background: 'url(jv/visit.jpg) center / cover',
        boxShadow: 'inset 0 0 0 2px rgb(171,220,207), 0 0 50px rgba(171,220,207,0.35)'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -80,
        top: 4400,
        width: 1600,
        height: 331,
        background: '#fff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 100,
        top: 40
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      w: 150,
      h: 113
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 100,
        top: 110,
        display: 'flex',
        gap: 50
      }
    }, ['Home', 'Clinic Schedule', 'Community Partners', 'About Us', 'Volunteer', 'Contact Us'].map(l => /*#__PURE__*/React.createElement("span", {
      key: l,
      style: t(16)
    }, l))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: 1600,
        height: 64,
        background: TEAL,
        display: 'flex',
        alignItems: 'center',
        padding: '0 100px',
        boxSizing: 'border-box',
        ...t(20, 400, '#fff')
      }
    }, "Made with \u2661 by #include at Davis \xA9 2025"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1600,
        height: 142,
        background: '#fff',
        boxShadow: '0 5px 50px rgba(1,136,122,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1236,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      w: 118,
      h: 89
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 50,
        alignItems: 'center'
      }
    }, ['Home', 'Clinic Schedules', 'Community Partners', 'About Us', 'Volunteer'].map(l => /*#__PURE__*/React.createElement("span", {
      key: l,
      style: t(18)
    }, l)), /*#__PURE__*/React.createElement(Pill, null, "Contact Us")))));
  }

  /* ---------------- Mobile page (393 wide) ---------------- */
  function MobilePage({
    scroll,
    p,
    drift
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: BG,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 393,
        height: 4288,
        transform: `translateY(${-scroll}px)`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -397,
        top: 222
      }
    }, /*#__PURE__*/React.createElement(Haze, {
      w: 1160,
      h: 395,
      vb: "0 0 1160 395",
      drift: drift * 0.5,
      blur: 28,
      path: "M 705.119 85.126 C 183.16 -48.739 114.258 235.047 0 343.438 C 135.023 261.9 359.082 402.968 662.069 394.644 C 1018.216 384.859 1218.684 197.757 1144.759 0 C 1159.87 151.117 881.888 130.461 705.119 85.126 Z"
    })), /*#__PURE__*/React.createElement(Bubbles, {
      list: [[-8, 1330, 24], [30, 1400, 16], [-10, 1480, 40], [360, 1520, 46], [300, 1800, 18], [340, 1860, 30], [250, 1950, 24], [40, 2800, 22], [90, 2850, 34], [30, 2930, 18], [140, 2960, 26]]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 236,
        width: 393,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 92,
        height: 68,
        background: 'url(jv/teddy.png) center / cover'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        ...serif(36),
        width: 330,
        textAlign: 'center',
        lineHeight: 1.25
      }
    }, "Welcome to Joan Viteri Memorial Clinic"), /*#__PURE__*/React.createElement("span", {
      style: {
        ...t(16),
        width: 300,
        textAlign: 'center'
      }
    }, "Serving health care needs of uninsured drug users, sex workers, trans folks, and their families."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement(Pill, {
      size: 16,
      pad: "9px 30px"
    }, "Contact Us"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 16,
        top: 738
      }
    }, /*#__PURE__*/React.createElement(Ribbon, {
      scale: 0.53
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 16,
        top: 874,
        width: 361,
        borderRadius: 20,
        background: '#fff',
        boxShadow: CARD_SHADOW,
        padding: 28,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 200,
        borderRadius: 16,
        background: 'url(jv/unbiased_m.jpg) center 40% / cover',
        boxShadow: '0 0 30px rgba(173,173,173,0.25)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: serif(24)
    }, "Unbiased Healthcare"), /*#__PURE__*/React.createElement("span", {
      style: t(15)
    }, "We provide basic medical care and health education in a non-judgmental, accessible way."), /*#__PURE__*/React.createElement("span", {
      style: t(15)
    }, "Offering free primary health care services to the uninsured population in the Oak Park area of Sacramento, CA."), /*#__PURE__*/React.createElement("span", {
      style: t(15)
    }, "Our mission is fulfilled through the service of UC Davis undergraduates, medical, PA, NP students and the generosity of physicians.")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 16,
        top: 1540,
        width: 361,
        borderRadius: 20,
        background: '#fff',
        boxShadow: CARD_SHADOW,
        padding: 28,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 200,
        borderRadius: 16,
        background: 'url(jv/people.jpg) center 30% / cover',
        boxShadow: '0 0 30px rgba(173,173,173,0.25)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: serif(24)
    }, "The People We Serve"), /*#__PURE__*/React.createElement("span", {
      style: t(15)
    }, "At JVMC, we welcome everyone, regardless of their life history. No matter who you are, you are welcome."), /*#__PURE__*/React.createElement("span", {
      style: t(15)
    }, "We are known in the community for caring about forgotten populations: people who use intravenous drugs, sex workers, people who identify as transgender, and families.")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 2250,
        width: 393,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...serif(32),
        lineHeight: 1
      }
    }, "Explore Our Clinics!"), /*#__PURE__*/React.createElement("span", {
      style: t(16, 700)
    }, "Discover everything JVMC has to offer.")), /*#__PURE__*/React.createElement(Carousel, {
      p: p,
      width: 393,
      height: 440,
      cw: 270,
      ch: 430,
      imgH: 180,
      fs: 0.54,
      spread: 215
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(ArrowBtn, {
      dir: -1,
      s: 36
    }), /*#__PURE__*/React.createElement(Dots, {
      p: p,
      w: 150,
      h: 22,
      d: 9,
      gap: 18
    }), /*#__PURE__*/React.createElement(ArrowBtn, {
      dir: 1,
      s: 36
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 3032,
        width: 393,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: 'url(jv/visit.jpg) center / cover',
        boxShadow: `6px 4px 0 ${TEAL}, inset 0 0 0 2px ${MINT}`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        width: 300
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: serif(24)
    }, "Come Visit Us!"), /*#__PURE__*/React.createElement("span", {
      style: t(14)
    }, "3647 40th St, Sacramento, CA 95817")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: serif(24)
    }, "Opening Hours"), /*#__PURE__*/React.createElement("span", {
      style: t(14)
    }, "Every Saturday: 1:00pm - 4:00pm")), /*#__PURE__*/React.createElement("span", {
      style: serif(24)
    }, "Contact Us")), /*#__PURE__*/React.createElement(Pill, {
      size: 16,
      pad: "9px 30px"
    }, "Ask Us Questions"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 393,
        height: 140,
        background: '#fff',
        boxShadow: '0 5px 30px rgba(1,136,122,0.15)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 50,
        top: 18,
        ...t(17, 600, '#000')
      }
    }, "9:41"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 30,
        top: 21,
        display: 'flex',
        gap: 5,
        alignItems: 'flex-end'
      }
    }, [4, 6, 8, 11].map(h => /*#__PURE__*/React.createElement("div", {
      key: h,
      style: {
        width: 3,
        height: h,
        borderRadius: 1,
        background: '#000'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 24,
        height: 12,
        borderRadius: 3.5,
        border: '1px solid rgba(0,0,0,.4)',
        padding: 1.5,
        boxSizing: 'border-box',
        marginLeft: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        background: '#000',
        borderRadius: 2
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 22,
        top: 62
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      w: 82,
      h: 62
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 26,
        top: 84,
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 18,
        height: 2.2,
        borderRadius: 2,
        background: INK
      }
    })))));
  }
  function Cursor({
    x,
    y,
    op,
    down
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: "26",
      height: "34",
      viewBox: "0 0 26 34",
      style: {
        position: 'absolute',
        left: x - 3,
        top: y - 2,
        opacity: op,
        transform: `scale(${down ? 0.9 : 1})`,
        transformOrigin: '3px 2px',
        zIndex: 30,
        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 2v25l6.5-6 4.3 9.8 4-1.8-4.2-9.6H22z",
      fill: "#000",
      stroke: "#fff",
      strokeWidth: "2",
      strokeLinejoin: "round"
    }));
  }
  function Touch({
    T,
    gestures
  }) {
    const g = gestures.find(g => T >= g.t0 - 0.14 && T <= g.t1 + 0.16);
    if (!g) return null;
    const p = MOTION.move(T, g.t0, g.t1);
    const fade = Math.min(prog(T, g.t0 - 0.14, g.t0), 1 - prog(T, g.t1, g.t1 + 0.16));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: mix(g.x0, g.x1, p) - 24,
        top: mix(g.y0, g.y1, p) - 24,
        width: 48,
        height: 48,
        borderRadius: 24,
        background: 'rgba(255,255,255,0.55)',
        border: '2px solid rgba(53,57,53,0.3)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
        boxSizing: 'border-box',
        opacity: fade,
        transform: `scale(${T >= g.t0 && T <= g.t1 ? 0.82 : 1})`,
        zIndex: 50
      }
    });
  }
  function Piece({
    T
  }) {
    const authoredTotal = TOTAL;
    const S = CUES.Story,
      C = CUES.Clinics,
      R = CUES.Return,
      END = authoredTotal;
    const drift = 40 * Math.sin(T / END * Math.PI * 2);

    // desktop
    const dScroll = 900 * MOTION.glide(T, 0.7, 1.9) + 1627 * MOTION.glide(T, S + 0.9, S + 2.1) - 2527 * MOTION.glide(T, R, R + 1.25);
    const click1 = C + 0.85,
      click2 = C + 1.75;
    const dP = 1 + MOTION.move(T, click1 + 0.05, click1 + 0.65) + MOTION.move(T, click2 + 0.05, click2 + 0.65);
    const dPview = T > R + 0.6 ? 1 : dP;
    const press = Math.max(1 - Math.abs(T - click1) / 0.12, 1 - Math.abs(T - click2) / 0.12, 0);
    const cx = mix(1180, 997, MOTION.move(T, C + 0.1, C + 0.75));
    const cy = mix(700, 926, MOTION.move(T, C + 0.1, C + 0.75)) + 120 * MOTION.move(T, R - 0.5, R);
    const cop = prog(T, C - 0.05, C + 0.15) * (1 - prog(T, R - 0.2, R));
    const cdown = press > 0.3;

    // mobile (slightly offset so the two devices don't move in lockstep)
    const o = 0.3;
    const mScroll = 830 * MOTION.glide(T, 0.7 + o, 1.9 + o) + 1400 * MOTION.glide(T, S + 0.9 + o, S + 2.1 + o) - 2230 * MOTION.glide(T, R + o, R + 1.25 + o);
    const sw1 = C + 0.95 + o,
      sw2 = C + 1.85 + o;
    const mP = 1 + MOTION.move(T, sw1 + 0.15, sw1 + 0.7) + MOTION.move(T, sw2 + 0.15, sw2 + 0.7);
    const mPview = T > R + 0.9 ? 1 : mP;
    const gestures = [{
      t0: 0.7 + o,
      t1: 1.3 + o,
      x0: 200,
      y0: 700,
      x1: 200,
      y1: 330
    }, {
      t0: S + 0.9 + o,
      t1: S + 1.5 + o,
      x0: 210,
      y0: 720,
      x1: 210,
      y1: 300
    }, {
      t0: sw1,
      t1: sw1 + 0.35,
      x0: 300,
      y0: 410,
      x1: 110,
      y1: 420
    }, {
      t0: sw2,
      t1: sw2 + 0.35,
      x0: 300,
      y0: 410,
      x1: 110,
      y1: 420
    }, {
      t0: R + o,
      t1: R + 0.5 + o,
      x0: 200,
      y0: 260,
      x1: 200,
      y1: 700
    }];
    const ds = 880 / 1600,
      ms = 236 / 393;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: '#F5F5F4'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 318,
        top: 196
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 912,
        height: 582,
        borderRadius: '22px 22px 6px 6px',
        background: '#0d0d0f',
        boxShadow: 'inset 0 0 0 1.5px #3a3a3e',
        padding: '16px 16px 16px',
        boxSizing: 'border-box',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 880,
        height: 550,
        overflow: 'hidden',
        borderRadius: 4,
        background: BG
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1600,
        height: 1000,
        transform: `scale(${ds})`,
        transformOrigin: '0 0'
      }
    }, /*#__PURE__*/React.createElement(DesktopPage, {
      scroll: dScroll,
      p: dPview,
      drift: drift,
      press: press
    }), /*#__PURE__*/React.createElement(Cursor, {
      x: cx,
      y: cy,
      op: cop,
      down: cdown
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 437,
        top: 5,
        width: 38,
        height: 6,
        borderRadius: 3,
        background: '#222'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        left: -50,
        width: 1012,
        height: 20,
        borderRadius: '2px 2px 14px 14px',
        background: 'linear-gradient(#e6e6e8, #b9b9bd 60%, #8e8e93)',
        boxShadow: '0 22px 40px rgba(20,22,20,0.22)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 436,
        top: 0,
        width: 140,
        height: 7,
        borderRadius: '0 0 8px 8px',
        background: 'linear-gradient(#c4c4c8, #d9d9dc)'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 150,
        top: 378,
        width: 254,
        height: 529,
        borderRadius: 42,
        background: '#111',
        padding: 9,
        boxSizing: 'border-box',
        boxShadow: '0 30px 60px rgba(20,22,20,0.28), inset 0 0 0 1.5px #3a3a3e'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 236,
        height: 511,
        borderRadius: 33,
        overflow: 'hidden',
        background: BG
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 393,
        height: 852,
        transform: `scale(${ms})`,
        transformOrigin: '0 0'
      }
    }, /*#__PURE__*/React.createElement(MobilePage, {
      scroll: mScroll,
      p: mPview,
      drift: drift
    }), /*#__PURE__*/React.createElement(Touch, {
      T: T,
      gestures: gestures
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 136,
        top: 11,
        width: 121,
        height: 35,
        borderRadius: 18,
        background: '#000',
        zIndex: 60
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 130,
        bottom: 8,
        width: 134,
        height: 5,
        borderRadius: 3,
        background: '#000',
        zIndex: 60
      }
    })))));
  }

  /* ── runtime ─────────────────────────────────────────────────────────────
     Sits paused on the first frame until the parent page posts
     {pikspot: 'play'}; {pikspot: 'pause'} freezes it where it is (same
     messages as the Pikspot card, so the home page's .tile__mock script
     drives both). ?autoplay plays straight away; ?t=<seconds> shows one frame. */
  const stage = document.getElementById('stage');
  const root = ReactDOM.createRoot(stage);
  const STAGE_W = 1400,
    STAGE_H = 1000;

  // fill the card: the stage is 7:5 like the tile, so this barely crops
  function fit() {
    const s = Math.max(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  }
  window.addEventListener('resize', fit);
  fit();
  let clock = 0,
    last = 0,
    raf = 0;
  const draw = () => root.render( /*#__PURE__*/React.createElement(Piece, {
    T: Math.min(clock, TOTAL)
  }));
  function tick(now) {
    if (last) clock = (clock + Math.min(now - last, 100) / 1000) % TOTAL;
    last = now;
    draw();
    raf = requestAnimationFrame(tick);
  }
  function play() {
    if (!raf) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  }
  function pause() {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }
  window.addEventListener('message', e => {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.pikspot === 'play') play();
    if (e.data.pikspot === 'pause') pause();
  });

  // warm every image so nothing pops in mid-loop
  ['ghc.jpg', 'logo.png', 'people.jpg', 'rhc.jpg', 'teddy.png', 'unbiased.jpg', 'unbiased_m.jpg', 'visit.jpg', 'volunteer.jpg'].forEach(f => {
    const i = new Image();
    i.src = 'jv/' + f;
  });
  const at = location.search.match(/[?&]t=([\d.]+)/);
  if (at) clock = parseFloat(at[1]) % TOTAL;
  draw();
  if (/[?&]autoplay\b/.test(location.search)) play();
})();