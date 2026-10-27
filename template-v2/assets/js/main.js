/* =========================================================================
   CERISE — motion & interactions (Velvet template, version 2)
   GSAP + ScrollTrigger + SplitText → preloader, scroll-split hero, kinetic
     type, pinned exhibit, text-mask zoom, stacking cards, 3D coffret carousel
   Motion (vanilla Framer Motion) → cursor, previews, springs, form steps
   Framer recipes for every effect: docs/v2/ANIMATION-SPEC.md
   ========================================================================= */
(() => {
  const { animate, inView, stagger, spring } = window.Motion;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ---------------- Nav ---------------- */
  const nav = $("[data-nav]");
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 30);
    nav.classList.toggle("is-hidden", y > 500 && y > lastY);
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const drawer = $("[data-drawer]");
  const openBtn = $("[data-open]");
  const setDrawer = (open) => {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    openBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open && !reduced) animate($$("nav a", drawer), { opacity: [0, 1], y: [60, 0] }, { delay: stagger(0.07, { startDelay: 0.35 }), duration: 0.8, ease: [0.16, 1, 0.3, 1] });
  };
  openBtn?.addEventListener("click", () => setDrawer(true));
  $("[data-close]")?.addEventListener("click", () => setDrawer(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setDrawer(false));

  /* ---------------- Cursor dot ---------------- */
  const cursor = $("[data-cursor]");
  if (fine && !reduced && cursor) {
    const cx = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3" });
    const cy = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3" });
    window.addEventListener("pointermove", (e) => { cursor.style.opacity = 1; cx(e.clientX); cy(e.clientY); });
    document.addEventListener("pointerover", (e) => cursor.classList.toggle("is-big", !!e.target.closest("a, button, label, .row, [data-drag]")));
  }

  /* ---------------- Toast + bag ---------------- */
  const toastEl = $("[data-toast]");
  let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("is-on"), 2800); };
  let bag = 0;
  const bagEl = $("[data-bag]");
  const addToBag = (name) => {
    bag++;
    bagEl.textContent = pad(bag);
    animate(bagEl, { y: [-12, 0], opacity: [0, 1] }, { type: spring, stiffness: 400, damping: 18 });
    toast(`${name} — added to your bag`);
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (!b) return;
    e.preventDefault();
    animate(b, { scale: [1, 0.94, 1] }, { duration: 0.3 });
    addToBag(b.dataset.add || "Piece");
  });

  /* ---------------- Forms that only confirm ---------------- */
  $$("[data-club]").forEach((f) => f.addEventListener("submit", (e) => { e.preventDefault(); f.reset(); toast("Bienvenue au Club de Nuit"); }));
  $$("[data-contact]").forEach((f) => f.addEventListener("submit", (e) => { e.preventDefault(); f.reset(); toast("Message sent — we reply within a day"); }));

  /* ---------------- Footer gold shine follows pointer ---------------- */
  $$("[data-shine]").forEach((w) => {
    w.parentElement.addEventListener("pointermove", (e) => {
      const r = w.getBoundingClientRect();
      w.style.setProperty("--shine", `${Math.max(0, Math.min(86, ((e.clientX - r.left) / r.width) * 100))}%`);
    });
  });

  /* ---------------- Crumbs canvas (hero / 404) ---------------- */
  $$("[data-crumbs]").forEach((cv) => {
    if (reduced) return;
    const ctx = cv.getContext("2d");
    let w, h, dpr;
    const colors = ["#C2213F", "#7A0C1F", "#E7A3A8", "#D8B46A"];
    const parts = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), s: 1.5 + Math.random() * 4, v: 0.02 + Math.random() * 0.06, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.04, c: colors[(Math.random() * colors.length) | 0], d: Math.random() }));
    const size = () => { dpr = Math.min(window.devicePixelRatio || 1, 2); w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); window.addEventListener("resize", size);
    let mx = 0.5;
    window.addEventListener("pointermove", (e) => (mx = e.clientX / window.innerWidth));
    gsap.ticker.add((t, dt) => {
      if (cv.getBoundingClientRect().bottom < 0) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y += (p.v * dt) / 1000 * (0.6 + p.d);
        p.x += Math.sin(t + p.r) * 0.0004 + (mx - 0.5) * 0.0006 * p.d;
        p.r += p.vr;
        if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
        ctx.save(); ctx.translate(p.x * w, p.y * h); ctx.rotate(p.r); ctx.globalAlpha = 0.35 + p.d * 0.55; ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.8); ctx.restore();
      }
    });
  });

  /* ---------------- Hero beam follows pointer ---------------- */
  const hero = $("[data-hero]");
  if (hero && fine && !reduced) {
    const beam = $("[data-beam]");
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      gsap.to(beam, { "--mx": `${((e.clientX - r.left) / r.width) * 100}%`, "--my": `${((e.clientY - r.top) / r.height) * 100}%`, duration: 1.2, ease: "power3" });
    });
  }

  /* ---------------- Exhibit (switches by scroll on desktop, ticks everywhere) ---------------- */
  const exhibit = $("[data-exhibit]");
  let exGo = () => {};
  if (exhibit) {
    const items = $$("[data-ex-item]", exhibit);
    const panels = $$("[data-ex-panel]", exhibit);
    const ticks = $$("[data-ex-ticks] i", exhibit);
    const noEl = $("[data-ex-no]", exhibit);
    let cur = -1;
    gsap.set(items, { opacity: 0, scale: 0.7, rotate: 20 });
    gsap.set(panels, { opacity: 0, y: 30, pointerEvents: "none" });
    exGo = (i) => {
      if (i === cur) return;
      const dir = i > cur ? 1 : -1;
      const d = reduced ? 0 : 1;
      if (cur >= 0) {
        gsap.to(items[cur], { opacity: 0, scale: 0.7, rotate: -20 * dir, filter: "blur(8px)", duration: 0.7 * d, ease: "power3.inOut" });
        gsap.to(panels[cur], { opacity: 0, y: -30 * dir, pointerEvents: "none", duration: 0.4 * d });
      }
      gsap.fromTo(items[i], { opacity: 0, scale: 1.25, rotate: 20 * dir, filter: "blur(8px)" }, { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)", duration: 1 * d, ease: "expo.out" });
      gsap.fromTo(panels[i], { opacity: 0, y: 30 * dir }, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.7 * d, delay: 0.15 * d, ease: "expo.out" });
      const span = document.createElement("span");
      span.textContent = pad(i + 1);
      const old = noEl.firstElementChild;
      noEl.appendChild(span);
      gsap.fromTo(span, { yPercent: 100 * dir }, { yPercent: 0, duration: 0.8 * d, ease: "expo.out" });
      if (old) { gsap.set(old, { position: "absolute" }); gsap.to(old, { yPercent: -100 * dir, duration: 0.8 * d, ease: "expo.out", onComplete: () => old.remove() }); }
      ticks.forEach((t, k) => t.classList.toggle("is-on", k === i));
      cur = i;
    };
    exGo(0);
    ticks.forEach((t, k) => { t.style.cursor = "pointer"; t.addEventListener("click", () => exGo(k)); });
  }

  /* ---------------- La carte: tabs + cursor preview ---------------- */
  const carte = $("[data-carte]");
  if (carte) {
    const rows = $$(".row", carte);
    $$("[data-carte-tabs] button").forEach((b, _, all) => b.addEventListener("click", () => {
      all.forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      rows.forEach((r) => (r.hidden = r.dataset.cat !== b.dataset.cat));
      if (!reduced) animate(rows.filter((r) => !r.hidden), { opacity: [0, 1], x: [-40, 0] }, { delay: stagger(0.06), duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    }));
    const pv = $("[data-preview]");
    const pvImg = $("[data-preview-img]");
    if (pv && fine && !reduced) {
      const px = gsap.quickTo(pv, "x", { duration: 0.6, ease: "power3" });
      const py = gsap.quickTo(pv, "y", { duration: 0.6, ease: "power3" });
      let lastX = 0;
      carte.addEventListener("pointermove", (e) => {
        px(e.clientX - 150); py(e.clientY - 180);
        gsap.to(pv, { rotate: Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.6)), duration: 0.5 });
        lastX = e.clientX;
      });
      rows.forEach((r) => {
        r.addEventListener("pointerenter", () => {
          if (pvImg.getAttribute("src") !== r.dataset.img) {
            pvImg.src = r.dataset.img;
            gsap.fromTo(pvImg, { scale: 0.6, rotate: -15 }, { scale: 1, rotate: 0, duration: 0.7, ease: "expo.out" });
          }
          gsap.to(pv, { opacity: 1, scale: 1, duration: 0.4 });
        });
      });
      carte.addEventListener("pointerleave", () => gsap.to(pv, { opacity: 0, scale: 0.8, duration: 0.4 }));
    }
  }

  /* ---------------- Order ticket + live cut-off countdown ---------------- */
  const MODES = {
    delivery: { label: "Same-day cut-off in", target: 12, note: "Order before 12:00 for delivery 18:00 – 23:00", copy: "Manhattan & Brooklyn, by our own couriers in insulated boxes. Choose an evening window at checkout.", f: [["$12", "Delivery fee"], ["$150", "Free over"], ["18–23h", "Evening windows"]], cta: "Order for tonight" },
    pickup: { label: "Pickup tonight — kitchen closes in", target: 22, note: "Collect from any boutique, 30-minute slots", copy: "Reserve your piece and collect it from Orchard Street or Williamsburg. We hold orders until closing.", f: [["Free", "Pickup"], ["30 min", "Slots"], ["2", "Boutiques"]], cta: "Reserve a pickup" },
    ship: { label: "This week's shipping closes in", target: 15, note: "Ships Mon–Wed, arrives frozen in 2 days", copy: "Entremets travel frozen in recyclable insulation. Thaw in the fridge for 6 hours before serving.", f: [["$24", "Shipping"], ["48", "States"], ["2 days", "Transit"]], cta: "Ship a gift" },
    apps: { label: "Available now on", target: null, note: "Uber Eats · DoorDash · Caviar", copy: "Prefer an app? A smaller evening menu is live on the major delivery apps until 23:00.", f: [["3", "Apps"], ["23:00", "Last orders"], ["Menu", "Partial"]], cta: "Open delivery apps" },
  };
  const ticket = $("[data-ticket]");
  if (ticket) {
    let mode = "delivery";
    const cd = $("[data-countdown]");
    const render = () => {
      const m = MODES[mode];
      if (m.target === null) { cd.innerHTML = `3 apps<small>${m.note}</small>`; return; }
      const now = new Date();
      const t = new Date(now); t.setHours(m.target, 0, 0, 0);
      let label = m.label;
      if (t <= now) { t.setDate(t.getDate() + 1); label = label.replace("Same-day", "Next-day").replace("tonight", "tomorrow"); }
      const s = Math.floor((t - now) / 1000);
      $("[data-mode-label]").textContent = label;
      cd.innerHTML = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}<small>${m.note}</small>`;
    };
    $$("[data-modes] button").forEach((b, _, all) => b.addEventListener("click", () => {
      all.forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      mode = b.dataset.mode;
      const m = MODES[mode];
      $("[data-mode-label]").textContent = m.label;
      $("[data-mode-copy]").textContent = m.copy;
      ["1", "2", "3"].forEach((k, i) => { $(`[data-f${k}]`).textContent = m.f[i][0]; $(`[data-f${k}l]`).textContent = m.f[i][1]; });
      $("[data-mode-cta]").firstChild.textContent = m.cta + " ";
      render();
      if (!reduced) animate($$("[data-mode-panel] > *"), { opacity: [0, 1], y: [16, 0] }, { delay: stagger(0.05), duration: 0.5 });
    }));
    render(); setInterval(render, 1000);
  }

  /* ---------------- Quotes autoplay ---------------- */
  const quotes = $("[data-quotes]");
  if (quotes) {
    const items = $$(".quote__item", quotes);
    const bars = $$("[data-quote-bars] button", quotes);
    let qi = 0, anim;
    const show = (i) => {
      items.forEach((it, k) => { it.classList.toggle("is-on", k === i); if (k !== i) { it.style.opacity = 0; it.setAttribute("aria-hidden", "true"); } else it.removeAttribute("aria-hidden"); });
      if (!reduced) animate(items[i], { opacity: [0, 1], y: [24, 0], filter: ["blur(6px)", "blur(0px)"] }, { duration: 0.9 });
      bars.forEach((b, k) => { $("span", b).style.transform = `scaleX(${k < i ? 1 : 0})`; });
      anim?.stop();
      anim = animate($("span", bars[i]), { scaleX: [0, 1] }, { duration: reduced ? 0 : 6, ease: "linear" });
      anim.then?.(() => { if (!reduced) { qi = (i + 1) % items.length; show(qi); } });
      qi = i;
    };
    bars.forEach((b, k) => b.addEventListener("click", () => show(k)));
    show(0);
  }

  /* ---------------- Boutiques: live status card ---------------- */
  const bwrap = $("[data-boutiques]");
  if (bwrap) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let data;
    const fmt = (h) => (h === 24 ? "00:00" : `${pad(h)}:00`);
    const upd = () => {
      const now = new Date();
      const d = now.getDay();
      const h = now.getHours() + now.getMinutes() / 60;
      const today = data.open[d];
      const open = today && h >= today[0] && h < today[1];
      const st = $("[data-b-status]");
      st.classList.toggle("is-open", !!open);
      $("span", st).textContent = open ? `Open now · closes ${fmt(today[1])}` : today && h < today[0] ? `Opens today ${fmt(today[0])}` : "Closed now";
      $("[data-b-clock]").textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    };
    const pick = (btn) => {
      $$(".bitem", bwrap).forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
      data = JSON.parse(btn.dataset.b);
      $("[data-b-name]").textContent = data.name;
      $("[data-b-addr]").textContent = data.addr;
      const order = [1, 2, 3, 4, 5, 6, 0];
      const today = new Date().getDay();
      $("[data-b-hours]").innerHTML = order.map((k) => `<dt class="${k === today ? "today" : ""}">${days[k]}</dt><dd class="${k === today ? "today" : ""}">${data.open[k] ? `${fmt(data.open[k][0])} – ${fmt(data.open[k][1])}` : "Closed"}</dd>`).join("");
      upd();
      if (!reduced) animate($$(".bcard > *", bwrap), { opacity: [0, 1], y: [12, 0] }, { delay: stagger(0.04), duration: 0.5 });
    };
    $$(".bitem", bwrap).forEach((b) => b.addEventListener("click", () => pick(b)));
    pick($(".bitem", bwrap));
    setInterval(upd, 20000);
  }

  /* ---------------- Collection: filters, view toggle, spotlight ---------------- */
  const gal = $("[data-gallery]");
  if (gal) {
    const tiles = $$(".tile", gal);
    const st = { cat: "all", diet: new Set() };
    const count = $("[data-count]");
    const apply = () => {
      let n = 0;
      tiles.forEach((t) => {
        const ok = (st.cat === "all" || t.dataset.cat === st.cat) && [...st.diet].every((d) => t.dataset.diet.split(" ").includes(d));
        t.hidden = !ok; if (ok) n++;
      });
      count.textContent = `${pad(n)} pieces`;
      $("[data-none]").style.display = n ? "none" : "block";
      if (!reduced) animate(tiles.filter((t) => !t.hidden), { opacity: [0, 1], y: [30, 0] }, { delay: stagger(0.05), duration: 0.6, ease: [0.16, 1, 0.3, 1] });
      ScrollTrigger.refresh();
    };
    $$("[data-seg] button").forEach((b, _, all) => b.addEventListener("click", () => { all.forEach((x) => x.setAttribute("aria-pressed", String(x === b))); st.cat = b.dataset.v; apply(); }));
    $$("[data-diet] button").forEach((b) => b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", String(on));
      on ? st.diet.add(b.dataset.v) : st.diet.delete(b.dataset.v);
      apply();
    }));
    $$("[data-view] button").forEach((b, _, all) => b.addEventListener("click", () => {
      all.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      gal.classList.toggle("is-list", b.dataset.v === "list");
      if (!reduced) animate(tiles.filter((t) => !t.hidden), { opacity: [0, 1] }, { delay: stagger(0.02), duration: 0.4 });
    }));
    tiles.forEach((t) => t.addEventListener("pointermove", (e) => {
      const r = t.getBoundingClientRect();
      t.style.setProperty("--x", `${e.clientX - r.left}px`); t.style.setProperty("--y", `${e.clientY - r.top}px`);
    }));
    const fromHash = () => { const b = $(`[data-seg] button[data-v="${location.hash.slice(1)}"]`); b ? b.click() : apply(); };
    window.addEventListener("hashchange", fromHash);
    fromHash();
  }

  /* ---------------- Product: drag to turn, sizes, counter ---------------- */
  const stage = $("[data-drag]");
  if (stage) {
    const img = $("img", stage);
    let down = false, sx = 0, rot = 0;
    stage.addEventListener("pointerdown", (e) => { down = true; sx = e.clientX; stage.setPointerCapture(e.pointerId); });
    stage.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - sx; sx = e.clientX; rot += dx * 0.4;
      gsap.to(img, { rotateY: rot, rotate: Math.max(-10, Math.min(10, dx)), duration: 0.6, ease: "power3", transformPerspective: 900 });
    });
    const up = () => { if (!down) return; down = false; rot = Math.round(rot / 360) * 360; gsap.to(img, { rotateY: rot, rotate: 0, duration: 1.4, ease: "elastic.out(1, .5)" }); };
    stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    if (!reduced) gsap.to(img, { y: -16, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
  }
  $$("[data-sizes]").forEach((g) => g.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", g).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const out = $("[data-price]");
    if (out) { out.textContent = `$${b.dataset.price}`; animate(out, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4 }); }
  }));
  $$("[data-chars]").forEach((i) => { const o = $(`[data-chars-out="${i.id}"]`); const u = () => (o.textContent = `${i.value.length} / ${i.maxLength}`); i.addEventListener("input", u); u(); });

  /* ---------------- Atelier: price calculator ---------------- */
  const calc = $("[data-calc]");
  if (calc) {
    const range = $("#guests", calc);
    const out = $("[data-calc-out]", calc);
    const gOut = $("[data-calc-guests]", calc);
    let shown = 0;
    const run = () => {
      const g = +range.value;
      const per = +($("input[name=finish]:checked", calc)?.value || 9);
      const tiers = g <= 30 ? 1 : g <= 80 ? 2 : g <= 150 ? 3 : 4;
      const total = Math.max(180, g * per);
      gOut.textContent = `${g} guests · ${tiers} ${tiers === 1 ? "tier" : "tiers"}`;
      const o = { v: shown };
      gsap.to(o, { v: total, duration: reduced ? 0 : 0.6, ease: "power3.out", onUpdate: () => (out.firstChild.textContent = `$${Math.round(o.v).toLocaleString("en-US")}`) });
      shown = total;
      range.style.background = `linear-gradient(90deg, var(--cherry) ${((g - +range.min) / (+range.max - +range.min)) * 100}%, rgba(26,15,15,.2) 0)`;
    };
    calc.addEventListener("input", run); run();
  }

  /* ---------------- Atelier: conversational enquiry ---------------- */
  const convo = $("[data-convo]");
  if (convo) {
    const qs = $$(".q", convo);
    const prog = $("[data-convo-prog]", convo);
    const stepEl = $("[data-convo-step]", convo);
    let i = 0;
    const show = (n, dir = 1) => {
      qs[i].classList.remove("is-on"); i = n; qs[i].classList.add("is-on");
      prog.style.width = `${((i + 1) / qs.length) * 100}%`;
      stepEl.textContent = `${pad(i + 1)} / ${pad(qs.length)}`;
      $("[data-convo-back]", convo).style.visibility = i ? "visible" : "hidden";
      $("[data-convo-next]", convo).hidden = i === qs.length - 1;
      $("[data-convo-send]", convo).hidden = i !== qs.length - 1;
      if (!reduced) animate($$(":scope > *", qs[i]), { opacity: [0, 1], y: [40 * dir, 0] }, { delay: stagger(0.06), duration: 0.7, ease: [0.16, 1, 0.3, 1] });
      const f = $("input:not([type=radio]):not([type=checkbox]), textarea, select", qs[i]);
      if (f && fine) setTimeout(() => f.focus({ preventScroll: true }), 300);
    };
    const valid = () => {
      const bad = $$("input, textarea, select", qs[i]).find((f) => !f.checkValidity());
      if (bad) { bad.reportValidity(); animate(qs[i], { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.4 }); return false; }
      return true;
    };
    const next = () => { if (valid() && i < qs.length - 1) show(i + 1, 1); };
    $("[data-convo-next]", convo).addEventListener("click", next);
    $("[data-convo-back]", convo).addEventListener("click", () => i > 0 && show(i - 1, -1));
    convo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") { e.preventDefault(); i === qs.length - 1 ? convo.requestSubmit() : next(); }
      const k = e.key.toUpperCase();
      if (/^[A-F]$/.test(k) && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || (/^[A-F]$/.test(k) && e.target.type === "radio")) {
        const opt = $$(".opts input", qs[i])[k.charCodeAt(0) - 65];
        if (opt) { opt.checked = opt.type === "checkbox" ? !opt.checked : true; opt.dispatchEvent(new Event("change", { bubbles: true })); }
      }
    });
    convo.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!valid()) return;
      $("[data-convo-body]", convo).hidden = true;
      const done = $(".convo__done", convo);
      done.classList.add("is-on");
      prog.style.width = "100%";
      if (!reduced) animate($$(":scope > *", done), { opacity: [0, 1], y: [40, 0] }, { delay: stagger(0.08), duration: 0.8 });
    });
    show(0);
  }

  /* =====================================================================
     SCROLL EFFECTS — skipped entirely with reduced motion
     ===================================================================== */
  const loader = $("[data-loader]");
  if (reduced) {
    loader?.classList.add("is-done");
    $$("[data-mz-after]").forEach((el) => (el.style.opacity = 1));
    $$("[data-mz-word], [data-mz-cap]").forEach((el) => (el.style.display = "none"));
    $$("[data-mz-fill]").forEach((el) => (el.style.opacity = 1));
    $$(".maskzoom").forEach((el) => (el.style.height = "100svh"));
    $$(".manifesto .w").forEach((w) => (w.style.opacity = 1));
    return;
  }

  const intro = () => {
    if (!hero) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    $$("[data-w]", hero).forEach((w, k) => {
      const chars = SplitText.create(w, { type: "chars", mask: "chars" }).chars;
      tl.from(chars, { yPercent: 110, duration: 1.3, stagger: 0.035 }, k * 0.12);
    });
    tl.from("[data-slice]", { y: -260, rotate: -40, scale: 0.6, opacity: 0, duration: 1.8, ease: "elastic.out(1, .7)" }, 0.2)
      .from("[data-hero-foot] > div", { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, 0.6)
      .from("[data-beam]", { opacity: 0, duration: 2 }, 0);
    gsap.to("[data-slice]", { y: -18, rotate: 3, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
  };

  /* ---- Preloader: counter, then curtain lifts ---- */
  let seen = false;
  try { seen = sessionStorage.getItem("cerise-loaded") === "1"; sessionStorage.setItem("cerise-loaded", "1"); } catch (e) { /* storage blocked */ }
  if (loader && !seen) {
    const o = { v: 0 };
    const cnt = $("[data-loader-count]");
    gsap.timeline()
      .to(o, { v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => (cnt.textContent = pad(Math.round(o.v), 3)) })
      .to("[data-loader-bar]", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
      .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut", onComplete: () => loader.classList.add("is-done") }, "+=.15")
      .add(intro, "-=.6");
  } else { loader?.classList.add("is-done"); intro(); }

  document.fonts.ready.then(() => {
    /* ---- Heading reveals: masked lines ---- */
    $$(".head h2, .phero h1, .q h3, .chapter h3").forEach((el) => {
      if (el.closest(".q")) return;
      const s = SplitText.create(el, { type: "lines", mask: "lines" });
      gsap.from(s.lines, { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: el.closest(".phero") ? undefined : { trigger: el, start: "top 88%" }, delay: el.closest(".phero") ? 0.2 : 0 });
    });
    $$("[data-reveal]").forEach((el) => gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
    $$("[data-stagger]").forEach((el) => gsap.from(el.children, { y: 50, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 85%" } }));

    /* ---- Hero: words split apart, slice zooms toward you ---- */
    if (hero) {
      const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      $$("[data-w]", hero).forEach((w) => gsap.to(w, { xPercent: 28 * +w.dataset.w, opacity: 0.15, ease: "none", scrollTrigger: st }));
      gsap.to("[data-slice]", { scale: 1.9, yPercent: 40, rotate: 25, opacity: 0, ease: "none", scrollTrigger: st });
      gsap.to("[data-beam]", { opacity: 0, ease: "none", scrollTrigger: st });
    }
    $$(".phero__art").forEach((a) => {
      gsap.from(a, { y: 120, rotate: -20, opacity: 0, duration: 1.6, ease: "expo.out", delay: 0.3 });
      gsap.to(a, { yPercent: 30, rotate: 12, ease: "none", scrollTrigger: { trigger: a.closest("section"), start: "top top", end: "bottom top", scrub: true } });
    });

    /* ---- Kinetic rows: horizontal scroll-scrub in opposite directions ---- */
    $$("[data-kinetic]").forEach((r) => {
      const d = +r.dataset.kinetic;
      gsap.fromTo(r, { xPercent: d < 0 ? 0 : -30 }, { xPercent: d < 0 ? -30 : 0, ease: "none", scrollTrigger: { trigger: r, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    });

    /* ---- Exhibit pin (desktop) ---- */
    const mm = gsap.matchMedia();
    mm.add("(min-width: 861px)", () => {
      if (!exhibit) return;
      const n = $$("[data-ex-item]", exhibit).length;
      ScrollTrigger.create({
        trigger: exhibit, start: "top top", end: () => `+=${window.innerHeight * (n - 0.4)}`, pin: "[data-exhibit-stage]", pinSpacing: true,
        onUpdate: (s) => exGo(Math.min(n - 1, Math.floor(s.progress * n))),
      });
    });
    mm.add("(max-width: 860px)", () => {
      if (!exhibit) return;
      const n = $$("[data-ex-item]", exhibit).length;
      let k = 0;
      const id = setInterval(() => { k = (k + 1) % n; exGo(k); }, 4500);
      return () => clearInterval(id);
    });

    /* ---- Text-mask zoom: fly through the word ---- */
    $$("[data-maskzoom]").forEach((sec) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: "top top", end: "bottom bottom", scrub: 1 } });
      tl.fromTo("[data-mz-word]", { scale: 0.7 }, { scale: 1, duration: 0.15, ease: "none" })
        .to("[data-mz-cap]", { opacity: 0, duration: 0.1 }, 0.1)
        .to("[data-mz-word]", { scale: 70, duration: 0.6, ease: "power3.in" }, 0.15)
        .to("[data-mz-fill]", { opacity: 1, duration: 0.15 }, 0.6)
        .to("[data-mz-word]", { opacity: 0, duration: 0.05 }, 0.72)
        .fromTo("[data-mz-after]", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.2 }, 0.78);
    });

    /* ---- La carte rows stagger in ---- */
    $$("[data-carte]").forEach((c) => gsap.from($$(".row:not([hidden])", c), { opacity: 0, x: -60, duration: 1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 80%" } }));

    /* ---- Order ticket: tears in ---- */
    $$("[data-ticket]").forEach((t) => {
      gsap.from(t.children[0], { xPercent: -8, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 80%" } });
      gsap.from(t.children[1], { xPercent: 8, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 80%" } });
    });

    /* ---- Stacking cards: each card sinks back as the next one lands ---- */
    mm.add("(min-width: 861px)", () => $$("[data-stack]").forEach((s) => {
      const cards = $$(".scard", s);
      cards.forEach((c, k) => {
        if (k === cards.length - 1) return;
        gsap.to(c, { scale: 0.92 + k * 0.015, filter: "brightness(.7)", ease: "none", scrollTrigger: { trigger: cards[k + 1], start: "top 70%", end: "top 25%", scrub: true } });
      });
    }));

    /* ---- Coffrets: pinned horizontal track with 3D card turn ---- */
    mm.add("(min-width: 861px)", () => {
      $$("[data-coffrets]").forEach((sec) => {
        const track = $("[data-coffrets-track]", sec);
        const cards = $$(".coffret", track);
        const dist = () => track.scrollWidth - window.innerWidth;
        const turn = () => {
          const mid = window.innerWidth / 2;
          cards.forEach((c) => {
            const r = c.getBoundingClientRect();
            const off = (r.left + r.width / 2 - mid) / mid;
            gsap.set(c, { rotateY: off * -28, z: -Math.abs(off) * 160, opacity: 1 - Math.min(Math.abs(off) * 0.45, 0.6) });
          });
        };
        gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: sec, start: "top top", end: () => `+=${dist()}`, pin: "[data-coffrets-pin]", scrub: 1, invalidateOnRefresh: true, onUpdate: turn, onRefresh: turn } });
        turn();
      });
    });

    /* ---- Manifesto: words light up ---- */
    $$("[data-manifesto]").forEach((m) => {
      const words = SplitText.create(m, { type: "words", wordsClass: "w" }).words;
      gsap.to(words, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: m, start: "top 80%", end: "bottom 50%", scrub: true } });
    });

    /* ---- Chapters: sticky year flips as each chapter passes ---- */
    $$("[data-chapters]").forEach((c) => {
      const year = $("[data-year]", c);
      let curY = year.textContent.trim();
      $$("[data-chapter]", c).forEach((ch) => ScrollTrigger.create({
        trigger: ch, start: "top 55%", end: "bottom 55%",
        onToggle: (s) => {
          if (!s.isActive) return;
          const y = ch.dataset.chapter;
          if (y === curY) return;
          const dir = s.direction;
          const span = document.createElement("span"); span.textContent = y;
          const old = year.firstElementChild;
          year.appendChild(span);
          gsap.fromTo(span, { yPercent: 100 * dir }, { yPercent: 0, duration: 0.8, ease: "expo.out" });
          gsap.set(old, { position: "absolute" });
          gsap.to(old, { yPercent: -100 * dir, duration: 0.8, ease: "expo.out", onComplete: () => old.remove() });
          curY = y;
        },
      }));
    });

    /* ---- Footer word rises ---- */
    $$("[data-shine]").forEach((w) => gsap.from(w, { yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: w, start: "top 95%" } }));

    ScrollTrigger.refresh();
  });
})();
