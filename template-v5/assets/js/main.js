/* =========================================================================
   BLÅBÄR hero — Velvet template, version 5
   Canvas: the mirror-glaze pour (stream → puddle → curtain → drips → pool)
   GSAP: intro, pour progress tweens, scroll pin that runs the drips down,
         horizontal morning timeline
   Motion: UI feedback (chips, stock counter, toast)
   ========================================================================= */
(() => {
  const { animate, spring } = window.Motion;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  /* ---------------- Canvas setup ---------------- */
  const cv = $("[data-pour]");
  const ctx = cv.getContext("2d");
  let W = 0, H = 0;
  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  window.addEventListener("resize", () => { size(); draw(performance.now()); });

  /* ---------------- State ---------------- */
  const readGlaze = (i) => ({ c1: i.dataset.c1, c2: i.dataset.c2, c3: i.dataset.c3 });
  const state = {
    g: reduced ? 1 : 0,          // pour progress of the current glaze, 0..1
    zoom: 1,
    cur: readGlaze($("input[name=glaze]:checked")),
    under: null,                 // previous glaze, already fully poured (shows beneath a re-pour)
    mx: -1,                      // pointer x in canvas px (-1 = none)
  };
  // 22 drips around the visible front of the cake; lengths fixed per drip so it looks hand-poured
  let s = 11;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const drips = Array.from({ length: 22 }, (_, i) => ({ t: -0.96 + (i / 21) * 1.92 + (rnd() - 0.5) * 0.05, len: 0.25 + rnd() * 0.85, w: 0.045 + rnd() * 0.05, pull: 0, ph: rnd() * 6 }));

  /* ---------------- Geometry ---------------- */
  const geo = () => {
    const rx = Math.min(W * 0.3, H * 0.34);
    const ry = rx * 0.27, h = rx * 0.66;
    const cx = W / 2, plateY = H * 0.8;
    const bottomY = plateY - ry * 0.25, topY = bottomY - h;
    return { rx, ry, h, cx, plateY, bottomY, topY };
  };
  const edgeY = (G, t) => G.topY + G.ry * Math.sqrt(Math.max(0, 1 - t * t)); // front edge of the top, t in -1..1

  /* ---------------- Drawing helpers ---------------- */
  const sideGrad = (G, c) => {
    const gr = ctx.createLinearGradient(G.cx - G.rx, 0, G.cx + G.rx, 0);
    gr.addColorStop(0, c.c1); gr.addColorStop(0.28, c.c2); gr.addColorStop(0.36, c.c3); gr.addColorStop(0.46, c.c2); gr.addColorStop(0.85, c.c1); gr.addColorStop(1, c.c1);
    return gr;
  };
  const topGrad = (G, c) => {
    const gr = ctx.createRadialGradient(G.cx - G.rx * 0.3, G.topY - G.ry * 0.4, 2, G.cx, G.topY, G.rx * 1.1);
    gr.addColorStop(0, c.c3); gr.addColorStop(0.35, c.c2); gr.addColorStop(1, c.c1);
    return gr;
  };

  const drawPlate = (G) => {
    const prx = G.rx * 1.42, pry = G.ry * 1.55, py = G.plateY;
    ctx.fillStyle = "rgba(20,32,90,.16)";
    ctx.beginPath(); ctx.ellipse(G.cx, py + pry * 0.55, prx * 1.02, pry * 0.9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#E7ECFA";
    ctx.beginPath(); ctx.ellipse(G.cx, py + 6, prx, pry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath(); ctx.ellipse(G.cx, py, prx, pry, 0, 0, Math.PI * 2); ctx.fill();
    // Delft rim: cobalt ring + dashes
    ctx.strokeStyle = "#1F3FBF"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(G.cx, py, prx * 0.94, pry * 0.9, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([6, 9]); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(G.cx, py, prx * 0.86, pry * 0.8, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawCake = (G) => {
    // mousse sides (pale) + top
    const gr = ctx.createLinearGradient(G.cx - G.rx, 0, G.cx + G.rx, 0);
    gr.addColorStop(0, "#E6DCCB"); gr.addColorStop(0.35, "#FBF6EE"); gr.addColorStop(1, "#DDD1BD");
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(G.cx - G.rx, G.topY);
    ctx.lineTo(G.cx - G.rx, G.bottomY);
    ctx.ellipse(G.cx, G.bottomY, G.rx, G.ry, 0, Math.PI, 0, true);
    ctx.lineTo(G.cx + G.rx, G.topY);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FFF9F1";
    ctx.beginPath(); ctx.ellipse(G.cx, G.topY, G.rx, G.ry, 0, 0, Math.PI * 2); ctx.fill();
  };

  // glaze body for progress g (0..1) in colours c
  const drawGlaze = (G, g, c, time, withStream) => {
    if (g <= 0) return;
    const spread = ease(clamp((g - 0.06) / 0.3));
    const flow = clamp((g - 0.3) / 0.7);
    // --- curtain down the sides
    if (flow > 0) {
      const curtain = G.h * (0.08 + 0.92 * Math.pow(flow, 2.2));
      ctx.fillStyle = sideGrad(G, c);
      ctx.beginPath();
      const N = 48;
      for (let k = 0; k <= N; k++) { const t = -1 + (2 * k) / N; const x = G.cx + G.rx * t; const y = edgeY(G, t) - 1; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      for (let k = N; k >= 0; k--) { const t = -1 + (2 * k) / N; const x = G.cx + G.rx * t; ctx.lineTo(x, Math.min(edgeY(G, t) + curtain, G.bottomY + G.ry * Math.sqrt(1 - t * t))); }
      ctx.closePath(); ctx.fill();
      // --- drips hanging from the curtain's edge
      for (const d of drips) {
        const x = G.cx + G.rx * d.t;
        const near = state.mx >= 0 ? clamp(1 - Math.abs(state.mx - x) / (G.rx * 0.25)) : 0;
        d.pull += ((near * G.h * 0.22) - d.pull) * 0.08;  // pointer tugs nearby drips longer
        const len = Math.pow(flow, 1.3) * G.h * d.len * 0.62 + d.pull * flow + Math.sin(time / 600 + d.ph) * 2 * flow;
        if (len < 2) continue;
        const y0 = Math.min(edgeY(G, d.t) + curtain, G.bottomY + G.ry * Math.sqrt(1 - d.t * d.t)) - 2;
        const maxY = G.plateY + G.ry * 0.9 * Math.sqrt(1 - d.t * d.t);
        const y1 = Math.min(y0 + len, maxY);
        const w = G.rx * d.w;
        ctx.beginPath();
        ctx.moveTo(x - w / 2, y0);
        ctx.lineTo(x - w / 2, y1 - w / 2);
        ctx.arc(x, y1 - w / 2, w / 2 * 1.15, Math.PI, 0, true);
        ctx.lineTo(x + w / 2, y0);
        ctx.closePath(); ctx.fill();
      }
      // --- pool on the plate once the glaze reaches the bottom
      const pool = clamp((flow - 0.72) / 0.28);
      if (pool > 0) {
        ctx.fillStyle = c.c1;
        ctx.beginPath(); ctx.ellipse(G.cx, G.bottomY + G.ry * 0.12, G.rx * (1 + 0.12 * ease(pool)), G.ry * (1 + 0.35 * ease(pool)), 0, 0, Math.PI); ctx.fill();
        ctx.fillStyle = sideGrad(G, c);
        ctx.beginPath(); ctx.moveTo(G.cx - G.rx, G.bottomY - G.h * 0.02); ctx.lineTo(G.cx - G.rx, G.bottomY); ctx.ellipse(G.cx, G.bottomY, G.rx, G.ry, 0, Math.PI, 0, true); ctx.lineTo(G.cx + G.rx, G.bottomY - G.h * 0.02); ctx.closePath(); ctx.fill();
      }
    }
    // --- puddle spreading over the top
    if (spread > 0) {
      ctx.fillStyle = topGrad(G, c);
      ctx.beginPath(); ctx.ellipse(G.cx, G.topY, G.rx * Math.min(1.01, spread * 1.03), G.ry * Math.min(1.01, spread * 1.03), 0, 0, Math.PI * 2); ctx.fill();
      // mirror reflections (a window and a soft streak)
      ctx.save();
      ctx.beginPath(); ctx.ellipse(G.cx, G.topY, G.rx * spread, G.ry * spread, 0, 0, Math.PI * 2); ctx.clip();
      ctx.globalAlpha = 0.35 * spread;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath(); ctx.ellipse(G.cx - G.rx * 0.35, G.topY - G.ry * 0.35, G.rx * 0.32, G.ry * 0.22, -0.15, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.18 * spread;
      ctx.fillRect(G.cx + G.rx * 0.15, G.topY - G.ry, G.rx * 0.08, G.ry * 2);
      ctx.restore();
    }
    // --- the falling stream
    if (withStream && g > 0.01 && g < 0.92) {
      const head = ease(clamp(g / 0.07));          // stream reaching down
      const tail = ease(clamp((g - 0.78) / 0.14)); // stream ending
      const sw = G.rx * 0.07 * (0.7 + 0.3 * Math.sin(time / 120));
      const yTop = tail * G.topY, yBot = head * G.topY;
      if (yBot - yTop > 1) {
        const gr = ctx.createLinearGradient(G.cx - sw, 0, G.cx + sw, 0);
        gr.addColorStop(0, c.c1); gr.addColorStop(0.4, c.c3); gr.addColorStop(1, c.c1);
        ctx.fillStyle = gr;
        ctx.beginPath();
        const wob = Math.sin(time / 90) * 1.5;
        ctx.moveTo(G.cx - sw / 2 + wob, yTop);
        ctx.quadraticCurveTo(G.cx - sw / 2 - wob, (yTop + yBot) / 2, G.cx - sw * 0.8, yBot);
        ctx.lineTo(G.cx + sw * 0.8, yBot);
        ctx.quadraticCurveTo(G.cx + sw / 2 + wob, (yTop + yBot) / 2, G.cx + sw / 2 + wob, yTop);
        ctx.closePath(); ctx.fill();
      }
    }
  };

  const drawDecor = (G, g, c) => {
    const d = ease(clamp((g - 0.9) / 0.1));
    if (d <= 0) return;
    ctx.save();
    ctx.translate(G.cx, G.topY);
    ctx.scale(d, d);
    // white chocolate disc "N°1"
    ctx.fillStyle = "#FFF9F1"; ctx.beginPath(); ctx.ellipse(G.rx * 0.18, -G.ry * 0.05, G.rx * 0.16, G.ry * 0.36, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#14205A"; ctx.font = `600 ${Math.round(G.rx * 0.08)}px "DM Mono", monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.save(); ctx.scale(1, 0.55); ctx.fillText("N°1", G.rx * 0.18, -G.ry * 0.1); ctx.restore();
    // three berries + a gold-ish saffron flake
    [[-0.32, -0.05], [-0.2, 0.18], [-0.42, 0.2]].forEach(([x, y]) => {
      const bx = G.rx * x, by = G.ry * y;
      const r = G.rx * 0.05;
      const gr = ctx.createRadialGradient(bx - r * 0.4, by - r * 0.5, 1, bx, by, r);
      gr.addColorStop(0, c.c3); gr.addColorStop(1, c.c1);
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(bx, by - r * 0.6, r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = "#F2B33D"; ctx.beginPath(); ctx.moveTo(-G.rx * 0.05, -G.ry * 0.5); ctx.lineTo(G.rx * 0.02, -G.ry * 0.62); ctx.lineTo(G.rx * 0.04, -G.ry * 0.42); ctx.closePath(); ctx.fill();
    ctx.restore();
  };

  const draw = (time) => {
    if (!W || !H) return;
    ctx.clearRect(0, 0, W, H);
    const G = geo();
    ctx.save();
    // scroll zoom around the cake top
    ctx.translate(G.cx, G.topY + G.h * 0.4); ctx.scale(state.zoom, state.zoom); ctx.translate(-G.cx, -(G.topY + G.h * 0.4));
    drawPlate(G);
    drawCake(G);
    if (state.under) drawGlaze(G, 1, state.under, time, false);
    drawGlaze(G, state.g, state.cur, time, true);
    drawDecor(G, state.g, state.cur);
    // one-off sheen sweep across the glazed top once the pour is done
    if (state.g >= 0.999 && !reduced) {
      const p = ((time / 3200) % 1);
      ctx.save();
      ctx.beginPath(); ctx.ellipse(G.cx, G.topY, G.rx, G.ry, 0, 0, Math.PI * 2); ctx.clip();
      const x = G.cx - G.rx * 1.6 + p * G.rx * 3.2;
      const gr = ctx.createLinearGradient(x - 40, 0, x + 40, 0);
      gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, "rgba(255,255,255,.28)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gr; ctx.fillRect(x - 40, G.topY - G.ry, 80, G.ry * 2);
      ctx.restore();
    }
    ctx.restore();
  };

  if (reduced) draw(0);
  else gsap.ticker.add(() => draw(performance.now()));

  /* ---------------- Pointer tugs drips ---------------- */
  cv.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); state.mx = e.clientX - r.left; });
  cv.addEventListener("pointerleave", () => (state.mx = -1));

  /* ---------------- Pour control ---------------- */
  let target = 1;                // what the pour settles to (scroll sets this on desktop)
  let pourTween = null;
  const pourTo = (to, dur) => {
    pourTween?.kill();
    if (reduced) { state.g = to; draw(0); return; }
    pourTween = gsap.to(state, { g: to, duration: dur, ease: "none" });
  };
  $("[data-replay]").addEventListener("click", () => {
    state.under = null;
    state.g = 0;
    pourTo(target, reduced ? 0 : 2.6 * target + 0.4);
  });

  /* ---------------- Glaze switcher ---------------- */
  $("[data-glazes]").addEventListener("change", (e) => {
    const i = e.target;
    const next = readGlaze(i);
    state.under = state.g > 0.3 ? { ...state.cur } : state.under;
    state.cur = next;
    document.documentElement.style.setProperty("--glaze", i.dataset.ink); // text-safe shade of the glaze
    $("[data-glaze-name]").textContent = i.dataset.name;
    $("[data-glaze-note]").textContent = i.dataset.note;
    if (!reduced) animate("[data-glaze-name], [data-glaze-note]", { opacity: [0, 1], y: [6, 0] }, { duration: 0.35 });
    state.g = 0;
    pourTo(target, reduced ? 0 : 2.2 * target + 0.3);
    if (reduced) { state.under = null; draw(0); }
  });

  /* ---------------- Reserve + stock ---------------- */
  let left = 14;
  const toastEl = $("[data-toast]");
  let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("is-on"), 2600); };
  $("[data-reserve]").addEventListener("click", () => {
    if (left <= 0) { toast("Sold out today — reserve for tomorrow from 6pm"); return; }
    left--;
    const st = $("[data-stock]");
    st.textContent = `${left} of 40 left today`;
    if (!reduced) animate(st, { opacity: [0.2, 1], x: [-6, 0] }, { type: spring, stiffness: 300, damping: 14 });
    toast(`Reserved: one ${$("input[name=glaze]:checked").value} cake, pickup from 10:00`);
  });

  /* ---------------- "Now" marker on the morning timeline ---------------- */
  const day = $("[data-day]");
  const steps = $$(".step", day);
  const times = steps.map((s) => { const [h, m] = $("b", s).textContent.split(":").map(Number); return h + m / 60; });
  const placeNow = () => {
    const d = new Date(); const h = d.getHours() + d.getMinutes() / 60;
    let x;
    if (h <= times[0]) x = steps[0].offsetLeft;
    else if (h >= times[times.length - 1]) x = steps[steps.length - 1].offsetLeft + steps[steps.length - 1].offsetWidth - 2;
    else {
      const k = times.findIndex((t, j) => h >= t && h < times[j + 1]);
      const f = (h - times[k]) / (times[k + 1] - times[k]);
      x = steps[k].offsetLeft + f * (steps[k + 1].offsetLeft - steps[k].offsetLeft);
    }
    $("[data-now]").style.left = `${x}px`;
    $("[data-now-label]").textContent = `Now ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  document.fonts.ready.then(placeNow);
  setInterval(placeNow, 30000);

  if (reduced) return;

  /* ---------------- Intro ---------------- */
  document.fonts.ready.then(() => {
    const lines = SplitText.create(".title", { type: "lines", mask: "lines" }).lines;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".nav", { y: -20, opacity: 0, duration: 0.8 })
      .from(lines, { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.1)
      .from("[data-intro]", { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.35)
      .from("[data-stage]", { clipPath: "inset(100% 0 0 0)", duration: 1.2, ease: "expo.inOut" }, 0)
      .from("[data-tiles]", { scale: 1.15, duration: 1.8 }, 0.2)
      .from("[data-tag]", { y: -16, opacity: 0, duration: 0.6, stagger: 0.1 }, 1)
      .from(".day", { yPercent: 100, opacity: 0, duration: 1 }, 0.6) // parent, so the scroll tween on the track never cancels it
      .add(() => { state.g = 0; pourTo(target, 2.6 * target + 0.4); }, 0.9);

    /* ---------------- Scroll: pin; the glaze runs down the sides; the morning slides past ---------------- */
    const mm = gsap.matchMedia();
    mm.add("(min-width: 961px)", () => {
      target = 0.5; // the intro pours the top; scrolling finishes the pour
      const st = ScrollTrigger.create({
        trigger: "[data-hero]", start: "top top", end: "+=130%", pin: "[data-pin]", scrub: false,
        onUpdate: (s) => {
          target = 0.5 + 0.5 * s.progress;
          if (!pourTween || !pourTween.isActive() || pourTween.vars.g < target) pourTo(target, 0.6);
          state.zoom = 1 + 0.12 * s.progress;
          gsap.to(day, { x: -s.progress * Math.max(0, day.scrollWidth - day.parentElement.clientWidth), duration: 0.5, overwrite: true });
        },
      });
      return () => { st.kill(); target = 1; };
    });
    mm.add("(max-width: 960px)", () => { target = 1; $(".day").style.overflowX = "auto"; });
  });
})();
