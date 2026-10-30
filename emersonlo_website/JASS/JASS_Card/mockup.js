/* JASS MacBook + iPhone mockup for the home page card.
   Built from jass-piece.jsx (the handoff, in this folder): same pages and
   choreography, with a small built-in clock instead of the handoff's
   video engine and no playback bar.
   Source: src/mockup.jsx, compiled to mockup.js (plain React.createElement). */
(function () {
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const Easing = {
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
  };

  // scenes play at their authored length, so the clock is the timeline
  const SCENES = [{
    name: 'Intro',
    dur: 2.0
  }, {
    name: 'About',
    dur: 2.4
  }, {
    name: 'Events',
    dur: 3.0
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
  const NAVY = 'rgb(44,56,104)',
    PINK = 'rgb(244,127,143)',
    YEL = 'rgb(255,212,32)',
    INK = 'rgb(64,68,71)',
    BG = 'rgb(248,248,249)';
  const GAEGU = 'Gaegu, "Comic Sans MS", cursive',
    HEL = '"Helvetica Neue", Helvetica, Arial, sans-serif';
  const SH = '0 5px 50px rgba(228,225,231,0.4)';
  const prog = (T, a, b) => clamp((T - a) / (b - a), 0, 1);
  const move = (T, a, b) => Easing.easeInOutCubic(prog(T, a, b));
  const glide = (T, a, b) => Easing.easeInOutQuart(prog(T, a, b));
  const mix = (a, b, p) => a + (b - a) * p;
  const g = (size, weight, color, extra) => ({
    fontFamily: GAEGU,
    fontSize: size,
    fontWeight: weight || 400,
    color: color || INK,
    lineHeight: 1.2,
    letterSpacing: '0.05em',
    ...extra
  });
  const EN = 'The Japanese American Student Society or JASS (est. 1982) is a student organization at the University of California, Davis with an eye to service, social, and cultural happenings. We deal primarily with the Japanese American community, but that doesn’t mean you have to be Japanese to join; anyone with an interest in Japanese culture and community can join our group! Everyone is welcome! Check us out at our general meetings every Thursday at 7pm to find out about upcoming events, partake in fun activities, and meet new people!';
  const JP = '私たち Japanese American Student Society（通称JASS）は1982年に設立された、日系コミュニティーを中心に活動する生徒達の集まりです。日本人、日系人、日本の文化等に興味のある方、どんな方でも大歓迎です！是非ミーティングやイベントに足を運んでみてください';
  const EVENTS = [{
    img: 'jass/b.jpg',
    title: 'General Meetings',
    body: 'Every Thursday at 7pm we have fun activities, slices of Japanese culture, and information about upcoming events!'
  }, {
    img: 'jass/c.jpg',
    title: 'Service & Social Events',
    body: 'Find opportunities to help the community as well as taking part in fun group events!'
  }, {
    img: 'jass/d.jpg',
    title: 'Big/Little System',
    body: 'Take part in our Big/Little program and Family System to create even closer friendships'
  }];
  const Logo = ({
    s
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      width: s,
      height: s,
      borderRadius: '50%',
      background: 'url(jass/logo.jpg) center / 104% no-repeat',
      flexShrink: 0
    }
  });
  const Pill = ({
    children,
    size = 24,
    pad = '12px 24px',
    bg = PINK,
    color = NAVY,
    font = GAEGU,
    press = 0,
    w
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: pad,
      width: w,
      boxSizing: 'border-box',
      borderRadius: 100,
      background: bg,
      textAlign: 'center',
      ...g(size, 700, color, {
        fontFamily: font,
        letterSpacing: font === HEL ? 0 : '0.05em',
        whiteSpace: 'nowrap'
      }),
      transform: `scale(${1 - press * 0.06})`,
      boxShadow: press ? `0 0 0 ${6 * press}px rgba(255,212,32,0.35)` : 'none'
    }
  }, children);
  function EventCard({
    e,
    w,
    h,
    imgH,
    fs,
    lift = 0,
    press = 0
  }) {
    return (
      /*#__PURE__*/
      /* the height is a minimum: a title that wraps to two lines (Service & Social
         Events) grows its card, and the row stretches the others to match, so the
         RSVP button always sits inside the card, level across all three */
      React.createElement("div", {
        style: {
          width: w,
          minHeight: h,
          borderRadius: 15,
          background: '#fff',
          boxShadow: lift ? `0 ${5 + 14 * lift}px ${50 + 20 * lift}px rgba(44,56,104,${0.06 + 0.1 * lift})` : SH,
          padding: 16 * fs,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 16 * fs,
          transform: `translateY(${-10 * lift}px)`
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: imgH,
          borderRadius: 10,
          overflow: 'hidden',
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          height: '100%',
          background: `url(${e.img}) center / cover`,
          transform: `scale(${1 + 0.05 * lift})`
        }
      })), /*#__PURE__*/React.createElement("span", {
        style: g(32 * fs, 700, NAVY)
      }, e.title), /*#__PURE__*/React.createElement("span", {
        style: g(18 * fs * (fs < 1 ? 1.25 : 1), 400, INK, {
          lineHeight: 1.5
        })
      }, e.body), fs === 1 && /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 'auto',
          alignSelf: 'flex-start'
        }
      }, /*#__PURE__*/React.createElement(Pill, {
        size: 18,
        pad: "12px 56px",
        bg: YEL,
        color: "rgb(20,21,20)",
        font: HEL,
        press: press
      }, "RSVP")))
    );
  }
  function Footer({
    w,
    mobile
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        background: NAVY,
        display: 'flex',
        flexDirection: 'column'
      }
    }, mobile ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '50px 30px 70px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      s: 70
    }), /*#__PURE__*/React.createElement("span", {
      style: g(18, 400, '#fff')
    }, "jassofficers@ucdavis.edu"), /*#__PURE__*/React.createElement("div", {
      style: {
        alignSelf: 'stretch',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        rowGap: 20
      }
    }, ['Home', 'Media', 'Calendar', 'Youtube', 'Meet Us', 'Google Photos', 'Join Our Cabinet', '', 'Contact', ''].map((l, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: g(24, i < 2 ? 700 : 400, '#fff')
    }, l)))) : /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '50px 90px 60px',
        display: 'flex',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      s: 100
    }), /*#__PURE__*/React.createElement("span", {
      style: g(18, 700, '#fff')
    }, "JASS at UC Davis"), /*#__PURE__*/React.createElement("span", {
      style: g(18, 400, '#fff')
    }, "jassofficers@ucdavis.edu")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 100
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, ['Home', 'Calendar', 'Meet Us', 'Join Our Cabinet', 'Contact'].map((l, i) => /*#__PURE__*/React.createElement("span", {
      key: l,
      style: g(24, i ? 400 : 700, '#fff')
    }, l))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, ['Media', 'Youtube', 'Google Photos'].map((l, i) => /*#__PURE__*/React.createElement("span", {
      key: l,
      style: g(24, i ? 400 : 700, '#fff')
    }, l))))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 64,
        background: PINK,
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        ...g(18, 400, NAVY)
      }
    }, "Made with \u2661 by #include at Davis \xA9 2024"));
  }

  /* Desktop page — 1440 wide */
  function DesktopPage({
    scroll,
    lifts,
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
        left: 0,
        top: 0,
        width: 1440,
        transform: `translateY(${-scroll}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 160
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1216,
        height: 400,
        borderRadius: 15,
        background: 'linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.15)), url(jass/hero.jpg) 50% 81.161% / 100% 202.691% no-repeat'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: g(72, 700, NAVY)
    }, "JASS @ UC Davis"), /*#__PURE__*/React.createElement("span", {
      style: g(24)
    }, "Meet friendly and open people through events, games, and more!"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 40
      }
    }, /*#__PURE__*/React.createElement(Pill, null, "Join JASS"))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 80,
        width: 1216,
        height: 620,
        borderRadius: 15,
        background: '#fff',
        boxShadow: SH,
        padding: '60px 72px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: g(54, 700, NAVY)
    }, "Who We Are"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 56
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...g(18, 400, INK, {
          lineHeight: 1.6
        }),
        flex: 1
      }
    }, EN), /*#__PURE__*/React.createElement("span", {
      style: {
        ...g(24, 400, INK, {
          lineHeight: 1.45,
          letterSpacing: 0
        }),
        flex: 1
      }
    }, JP)), /*#__PURE__*/React.createElement(Pill, null, "Download our Constitution")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 80,
        width: 1216,
        display: 'flex',
        flexDirection: 'column',
        gap: 32
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: g(64, 700, NAVY)
    }, "Join us for our..."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 32
      }
    }, EVENTS.map((e, i) => /*#__PURE__*/React.createElement(EventCard, {
      key: i,
      e: e,
      w: 384,
      h: 592,
      imgH: 352,
      fs: 1,
      lift: lifts[i],
      press: i === 2 ? press : 0
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 80
      }
    }, /*#__PURE__*/React.createElement(Footer, {
      w: 1440
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1440,
        height: 120,
        background: NAVY,
        boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 30px 0 28px',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      s: 72
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        display: 'flex',
        gap: 62,
        alignItems: 'center'
      }
    }, ['Home', 'Calendar', 'Meet Us', 'Join Our Cabinet', 'Contact'].map(l => /*#__PURE__*/React.createElement("span", {
      key: l,
      style: g(26, 400, '#fff')
    }, l)), /*#__PURE__*/React.createElement(Pill, {
      size: 22,
      pad: "14px 24px"
    }, "Join JASS"))));
  }

  /* Mobile page — 390 wide; aP / eP are fractional carousel indices */
  function Slides({
    p,
    n,
    w,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        transform: `translateX(${-p * (w + 16)}px)`
      }
    }, children));
  }
  const MDots = ({
    p,
    n
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      justifyContent: 'center'
    }
  }, Array.from({
    length: n
  }).map((_, i) => {
    const on = 1 - clamp(Math.abs(i - p), 0, 1);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 6,
        height: 6,
        borderRadius: 3,
        background: on > 0.5 ? '#000' : 'rgb(201,201,201)'
      }
    });
  }));
  function MobilePage({
    scroll,
    aP,
    eP
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
        width: 390,
        transform: `translateY(${-scroll}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 184
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 358,
        height: 120,
        borderRadius: 7.65,
        background: 'linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.15)), url(jass/hero.jpg) 50% 82.523% / 100% 199.313% no-repeat'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...g(64, 700, NAVY),
        textAlign: 'center'
      }
    }, "JASS", /*#__PURE__*/React.createElement("br", null), "@ UC Davis"), /*#__PURE__*/React.createElement("span", {
      style: {
        ...g(18),
        textAlign: 'center',
        width: 320
      }
    }, "Meet friendly and open people through events, games, and more!")), /*#__PURE__*/React.createElement("span", {
      style: {
        marginTop: 80,
        ...g(40, 700, NAVY)
      }
    }, "Who We Are"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 32
      }
    }, /*#__PURE__*/React.createElement(Slides, {
      p: aP,
      w: 358
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 358,
        height: 446,
        flexShrink: 0,
        borderRadius: 15,
        background: '#fff',
        boxShadow: SH,
        padding: '40px 40px',
        boxSizing: 'border-box',
        ...g(18, 400, INK, {
          lineHeight: 1.3
        })
      }
    }, EN), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 358,
        height: 446,
        flexShrink: 0,
        borderRadius: 15,
        background: '#fff',
        boxShadow: SH,
        padding: '40px 40px',
        boxSizing: 'border-box',
        ...g(22, 400, INK, {
          lineHeight: 1.6,
          letterSpacing: 0
        })
      }
    }, JP))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 40
      }
    }, /*#__PURE__*/React.createElement(MDots, {
      p: aP,
      n: 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 30
      }
    }, /*#__PURE__*/React.createElement(Pill, {
      w: 310,
      pad: "14px 0"
    }, "Download our Constitution")), /*#__PURE__*/React.createElement("span", {
      style: {
        marginTop: 80,
        ...g(40, 700, NAVY)
      }
    }, "Join us for our..."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 40
      }
    }, /*#__PURE__*/React.createElement(Slides, {
      p: eP,
      w: 358
    }, EVENTS.map((e, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(EventCard, {
      e: e,
      w: 358,
      h: 510,
      imgH: 320,
      fs: 0.8
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22,
        marginBottom: 30
      }
    }, /*#__PURE__*/React.createElement(MDots, {
      p: eP,
      n: 3
    })), /*#__PURE__*/React.createElement(Footer, {
      w: 390,
      mobile: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 390,
        height: 44,
        background: '#fff',
        zIndex: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 30,
        top: 13,
        fontFamily: HEL,
        fontSize: 16,
        fontWeight: 600,
        color: '#000'
      }
    }, "9:41"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 26,
        top: 16,
        display: 'flex',
        gap: 3,
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
        marginLeft: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        background: '#000',
        borderRadius: 2
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 44,
        width: 390,
        height: 112,
        background: NAVY,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px 0 22px',
        boxSizing: 'border-box',
        zIndex: 5
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      s: 70
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        marginRight: 22
      }
    }, /*#__PURE__*/React.createElement(Pill, {
      size: 22,
      pad: "12px 22px"
    }, "Join JASS")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 38,
        height: 5,
        borderRadius: 3,
        background: PINK
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
    const gs = gestures.find(q => T >= q.t0 - 0.14 && T <= q.t1 + 0.16);
    if (!gs) return null;
    const p = move(T, gs.t0, gs.t1);
    const fade = Math.min(prog(T, gs.t0 - 0.14, gs.t0), 1 - prog(T, gs.t1, gs.t1 + 0.16));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: mix(gs.x0, gs.x1, p) - 24,
        top: mix(gs.y0, gs.y1, p) - 24,
        width: 48,
        height: 48,
        borderRadius: 24,
        background: 'rgba(255,255,255,0.55)',
        border: '2px solid rgba(44,56,104,0.3)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
        boxSizing: 'border-box',
        opacity: fade,
        transform: `scale(${T >= gs.t0 && T <= gs.t1 ? 0.82 : 1})`,
        zIndex: 50
      }
    });
  }
  function Piece({
    T
  }) {
    const S = CUES.About,
      E = CUES.Events,
      R = CUES.Return;

    // desktop: hero → Who We Are → event cards (hover each, click RSVP) → top
    const dScroll = 860 * glide(T, 0.7, 1.9) + 680 * glide(T, S + 1.0, S + 2.1) - 1540 * glide(T, R, R + 1.25);
    const pts = [[1040, 700], [250, 560], [660, 560], [1070, 520], [1032, 662]];
    const legs = [E - 0.1, E + 0.35, E + 0.95, E + 1.55, E + 2.15];
    let cx = pts[0][0],
      cy = pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      const p = move(T, legs[i - 1], legs[i - 1] + 0.45);
      cx = mix(cx, pts[i][0], p);
      cy = mix(cy, pts[i][1], p);
    }
    cy += 140 * move(T, R - 0.45, R);
    const cop = prog(T, E - 0.2, E) * (1 - prog(T, R - 0.15, R + 0.05));
    const near = (x0, x1) => clamp(1 - Math.max(x0 - cx, cx - x1, 0) / 40, 0, 1) * (cy > 300 ? 1 : 0) * cop;
    const lifts = [near(112, 496), near(528, 912), near(944, 1328)];
    const clickT = E + 2.45;
    const press = Math.max(0, 1 - Math.abs(T - clickT) / 0.14);

    // mobile: offset 0.3s
    const o = 0.3;
    const mScroll = 690 * glide(T, 0.7 + o, 1.9 + o) + 690 * glide(T, S + 1.0 + o, S + 2.1 + o) - 1380 * glide(T, R + o, R + 1.25 + o);
    const a1 = S + 0.2 + o;
    const aP = move(T, a1 + 0.1, a1 + 0.6) - move(T, R + o + 0.6, R + o + 1.1);
    const e1 = E + 0.4 + o,
      e2 = E + 1.4 + o;
    const eP = move(T, e1 + 0.1, e1 + 0.6) + move(T, e2 + 0.1, e2 + 0.6) - 2 * move(T, R + o + 0.6, R + o + 1.1);
    const gestures = [{
      t0: 0.7 + o,
      t1: 1.3 + o,
      x0: 200,
      y0: 720,
      x1: 200,
      y1: 330
    }, {
      t0: a1,
      t1: a1 + 0.35,
      x0: 300,
      y0: 560,
      x1: 100,
      y1: 570
    }, {
      t0: S + 1.0 + o,
      t1: S + 1.6 + o,
      x0: 210,
      y0: 720,
      x1: 210,
      y1: 320
    }, {
      t0: e1,
      t1: e1 + 0.35,
      x0: 300,
      y0: 450,
      x1: 100,
      y1: 460
    }, {
      t0: e2,
      t1: e2 + 0.35,
      x0: 300,
      y0: 450,
      x1: 100,
      y1: 460
    }, {
      t0: R + o,
      t1: R + 0.5 + o,
      x0: 200,
      y0: 300,
      x1: 200,
      y1: 720
    }];
    const ds = 880 / 1440,
      ms = 236 / 390;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: '#F5F5F4'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 150,
        top: 196
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 912,
        height: 582,
        borderRadius: '22px 22px 6px 6px',
        background: '#0d0d0f',
        boxShadow: 'inset 0 0 0 1.5px #3a3a3e',
        padding: 16,
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
        width: 1440,
        height: 900,
        transform: `scale(${ds})`,
        transformOrigin: '0 0'
      }
    }, /*#__PURE__*/React.createElement(DesktopPage, {
      scroll: dScroll,
      lifts: lifts,
      press: press
    }), /*#__PURE__*/React.createElement(Cursor, {
      x: cx,
      y: cy,
      op: cop,
      down: press > 0.3
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
        left: 996,
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
        width: 390,
        height: 844,
        transform: `scale(${ms})`,
        transformOrigin: '0 0'
      }
    }, /*#__PURE__*/React.createElement(MobilePage, {
      scroll: mScroll,
      aP: aP,
      eP: eP
    }), /*#__PURE__*/React.createElement(Touch, {
      T: T,
      gestures: gestures
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 135,
        top: 10,
        width: 120,
        height: 34,
        borderRadius: 17,
        background: '#000',
        zIndex: 60
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 128,
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
  ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'hero.jpg', 'logo.jpg'].forEach(f => {
    const i = new Image();
    i.src = 'jass/' + f;
  });
  const at = location.search.match(/[?&]t=([\d.]+)/);
  if (at) clock = parseFloat(at[1]) % TOTAL;
  draw();
  if (/[?&]autoplay\b/.test(location.search)) play();
})();
