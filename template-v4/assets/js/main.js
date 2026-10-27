/* =========================================================================
   ROTUNDA hero — Velvet template, version 4
   GSAP: wheel build-in, scroll-pinned spin with snapping, drag inertia,
         headline char roll, background word drift, ticker
   Motion: UI springs (box pie, buttons, facts crossfade, toast)
   ========================================================================= */
(() => {
  const { animate, spring } = window.Motion;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ---------------- The eight cakes on today's wheel ---------------- */
  const FLAVOURS = [
    { name: "Burnt Basque", tagline: "caramelised outside, barely set inside", price: 9, notes: "Burnt sugar · vanilla · sea salt", allergens: "Dairy · egg · gluten-free", base: "#E9B86A", crust: "#3E2416", kind: "burnt" },
    { name: "Strawberry Shortcake", tagline: "cloud cream and Jersey strawberries", price: 8, notes: "Strawberry · cream · sponge", allergens: "Dairy · egg · gluten", base: "#FFF4E6", crust: "#F2D3A2", kind: "berries" },
    { name: "Matcha Mille Crêpe", tagline: "twenty paper-thin layers, Uji matcha", price: 9, notes: "Matcha · cream · crêpe", allergens: "Dairy · egg · gluten", base: "#A8C46F", crust: "#E9D9A8", kind: "matcha" },
    { name: "Lemon Meringue", tagline: "sharp curd under a toasted cloud", price: 8, notes: "Lemon · meringue · shortbread", allergens: "Dairy · egg · gluten", base: "#FFE36E", crust: "#D9A55A", kind: "meringue" },
    { name: "Fudge Royale", tagline: "the fudgiest slice in the borough", price: 8, notes: "70% cocoa · fudge · nibs", allergens: "Dairy · egg · gluten · soy", base: "#4A2318", crust: "#2A130C", kind: "fudge" },
    { name: "Pistachio Rose", tagline: "Bronte pistachio, rose, raspberry", price: 9, notes: "Pistachio · rose · raspberry", allergens: "Dairy · egg · pistachio · gluten", base: "#C2D18E", crust: "#8E9B55", kind: "pistachio" },
    { name: "Salted Caramel", tagline: "brown butter sponge, flaky salt", price: 8, notes: "Caramel · brown butter · salt", allergens: "Dairy · egg · gluten", base: "#D9893E", crust: "#7A4520", kind: "caramel" },
    { name: "Black Forest", tagline: "kirsch cherries, dark chocolate, cream", price: 9, notes: "Cherry · cocoa · cream", allergens: "Dairy · egg · gluten · alcohol", base: "#3A1A14", crust: "#1E0D09", kind: "forest" },
  ];
  const N = FLAVOURS.length, STEP = 360 / N, R = 304, CRUST = 20, PULL = 34;
  const rad = (d) => (d * Math.PI) / 180;
  const pol = (r, a) => [r * Math.cos(rad(a)), r * Math.sin(rad(a))];

  /* ---------------- Draw the wedges ---------------- */
  const rotor = $("[data-rotor]");
  const NS = "http://www.w3.org/2000/svg";
  const wedgePath = (r0, r1, a0, a1) => {
    const [x0, y0] = pol(r1, a0), [x1, y1] = pol(r1, a1);
    if (r0 === 0) return `M0 0 L${x0} ${y0} A${r1} ${r1} 0 0 1 ${x1} ${y1}Z`;
    const [x2, y2] = pol(r0, a1), [x3, y3] = pol(r0, a0);
    return `M${x3} ${y3} L${x0} ${y0} A${r1} ${r1} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 0 ${x3} ${y3}Z`;
  };
  // seeded pseudo-random so toppings stay put between reloads
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const inWedge = (a0, rMin = 0.32, rMax = 0.86) => pol(R * (rMin + rnd() * (rMax - rMin)), a0 + 6 + rnd() * (STEP - 12));

  const toppings = (f, a0) => {
    let s = "";
    const n = (k, fn) => { for (let j = 0; j < k; j++) s += fn(...inWedge(a0), j); };
    switch (f.kind) {
      case "burnt":
        s += `<path d="${wedgePath(R * 0.62, R - CRUST, a0, a0 + STEP)}" fill="#8A4B22" opacity=".55"/>`;
        n(14, (x, y) => `<circle cx="${x}" cy="${y}" r="${3 + rnd() * 6}" fill="#3E2416" opacity="${0.25 + rnd() * 0.4}"/>`);
        break;
      case "berries":
        n(5, (x, y) => `<g transform="translate(${x} ${y}) rotate(${rnd() * 360})"><path d="M-11 -4 Q-11 13 0 16 Q11 13 11 -4 Q0 -10 -11 -4Z" fill="#E23A4E"/><path d="M-7 -6 L0 -2 L7 -6 L2 -9 L0 -13 L-2 -9Z" fill="#5E9E4B"/></g>`);
        n(4, (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff"/><circle cx="${x - 2}" cy="${y - 2}" r="4" fill="#F4E4CF"/>`);
        break;
      case "matcha":
        n(60, (x, y) => `<circle cx="${x}" cy="${y}" r="${0.8 + rnd() * 1.6}" fill="#5E7A2E" opacity=".6"/>`);
        n(2, (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="#FFF8EA"/><circle cx="${x}" cy="${y}" r="6" fill="#E9E0C6"/>`);
        break;
      case "meringue":
        n(7, (x, y) => `<g transform="translate(${x} ${y})"><circle r="13" fill="#FFF8EA"/><circle r="7" cx="2" cy="-2" fill="#F2C27A"/><circle r="3" cx="3" cy="-3" fill="#C9813A"/></g>`);
        break;
      case "fudge":
        s += `<path d="${wedgePath(R * 0.3, R * 0.5, a0 + 4, a0 + STEP - 4)}" fill="#7A3E2A" opacity=".5"/>`;
        n(18, (x, y) => `<rect x="${x}" y="${y}" width="${4 + rnd() * 5}" height="${3 + rnd() * 4}" rx="1" fill="#1E0D09" transform="rotate(${rnd() * 180} ${x} ${y})"/>`);
        break;
      case "pistachio":
        n(26, (x, y) => `<circle cx="${x}" cy="${y}" r="${1.5 + rnd() * 2.5}" fill="#6E8B3D"/>`);
        n(5, (x, y) => `<path transform="translate(${x} ${y}) rotate(${rnd() * 360})" d="M0 0 q10 -14 20 0 q-10 8 -20 0z" fill="#E87C93"/>`);
        n(2, (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="#C8243E"/>`);
        break;
      case "caramel":
        n(3, (x, y) => `<path d="M${x - 18} ${y} q9 -14 18 0 t18 0" stroke="#FFE2A8" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>`);
        n(14, (x, y) => `<rect x="${x}" y="${y}" width="4" height="4" fill="#fff" opacity=".85" transform="rotate(${rnd() * 90} ${x} ${y})"/>`);
        break;
      case "forest":
        n(4, (x, y) => `<circle cx="${x}" cy="${y}" r="12" fill="#FFF4E6"/><circle cx="${x}" cy="${y - 3}" r="7" fill="#B1112E"/><circle cx="${x - 2}" cy="${y - 5}" r="2" fill="#fff" opacity=".6"/>`);
        n(16, (x, y) => `<rect x="${x}" y="${y}" width="6" height="2" fill="#1E0D09" transform="rotate(${rnd() * 180} ${x} ${y})"/>`);
        break;
    }
    return s;
  };

  FLAVOURS.forEach((f, i) => {
    const a0 = i * STEP;
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "wedge");
    g.setAttribute("data-i", i);
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", `${f.name}, $${f.price} a slice`);
    g.innerHTML = `<g class="wedge__inner"><path class="wedge__base" d="${wedgePath(0, R, a0, a0 + STEP)}" fill="${f.base}"/>${toppings(f, a0)}<path d="${wedgePath(R - CRUST, R, a0, a0 + STEP)}" fill="${f.crust}"/></g>`;
    rotor.appendChild(g);
  });
  const wedges = $$(".wedge", rotor);

  /* ---------------- Rotation model ---------------- */
  const pointerAngle = () => (window.matchMedia("(max-width: 960px)").matches ? 270 : 180);
  const targetFor = (i, near) => {
    const base = pointerAngle() - STEP / 2 - i * STEP;
    return base + Math.round((near - base) / 360) * 360;
  };
  const indexFor = (rot) => ((Math.round((pointerAngle() - STEP / 2 - rot) / STEP) % N) + N) % N;
  const state = { rot: targetFor(0, 0) };
  let current = -1;

  const setRot = (r) => {
    state.rot = r;
    gsap.set(rotor, { rotation: r, svgOrigin: "0 0" });
    const h = bgHalf() || 1;
    gsap.set("[data-bgword]", { x: -((((r * 4) % h) + h) % h) });
    const i = indexFor(r);
    if (i !== current) select(i);
  };

  /* ---------------- Selection → wedge pull-out + copy roll ---------------- */
  const nameEl = $("[data-name]");
  const idxEl = $("[data-index]");
  const swap = (sel, text) => { const el = $(sel); el.textContent = text; if (!reduced) animate(el, { opacity: [0, 1], y: [8, 0] }, { duration: 0.35 }); };
  let split;
  const select = (i) => {
    const dir = current === -1 ? 1 : ((i - current + N) % N) <= N / 2 ? 1 : -1;
    current = i;
    const f = FLAVOURS[i];
    wedges.forEach((w, k) => {
      const [dx, dy] = pol(k === i ? PULL : 0, k * STEP + STEP / 2);
      gsap.to($(".wedge__inner", w), { x: dx, y: dy, scale: k === i ? 1.04 : 1, transformOrigin: "50% 50%", duration: reduced ? 0 : 0.5, ease: "back.out(2)", overwrite: true });
      w.setAttribute("aria-pressed", String(k === i));
    });
    document.documentElement.style.setProperty("--slice", f.base);
    // index
    idxEl.textContent = String(i + 1).padStart(2, "0");
    if (!reduced) gsap.fromTo(idxEl, { yPercent: 60 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
    // name: chars roll in from below (or above when going back)
    split?.revert();
    nameEl.textContent = f.name;
    if (!reduced) {
      split = SplitText.create(nameEl, { type: "words,chars", wordsClass: "word", charsClass: "char", mask: "chars" });
      gsap.from(split.chars, { yPercent: 105 * dir, duration: 0.6, stagger: 0.018, ease: "expo.out" });
    }
    swap("[data-tagline]", f.tagline);
    swap("[data-price]", `$${f.price}`);
    swap("[data-notes]", f.notes);
    swap("[data-allergens]", f.allergens);
    $("[data-add]").firstChild.textContent = boxFull() ? "Box full · checkout " : `Add ${f.name.split(" ")[0].toLowerCase()} to box `;
  };

  /* ---------------- Background word (horizontal drift with the spin) ---------------- */
  const bg = $("[data-bgword]");
  bg.textContent = (FLAVOURS.map((f) => f.name).join(" · ") + " · ").repeat(2);
  const bgHalf = () => bg.scrollWidth / 2;

  /* ---------------- Box of four ---------------- */
  const box = [];
  const boxFull = () => box.length >= 4;
  const pie = $("[data-box-pie]");
  const renderBox = (popLast) => {
    $$(".box__slice", pie).forEach((n) => n.remove());
    box.forEach((i, k) => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("class", "box__slice");
      p.setAttribute("d", wedgePath(0, 44, -90 + k * 90 + 3, -90 + (k + 1) * 90 - 3));
      p.setAttribute("fill", FLAVOURS[i].base);
      p.setAttribute("stroke", "#2A1A12");
      p.setAttribute("stroke-width", "2");
      pie.appendChild(p);
      if (popLast && k === box.length - 1 && !reduced) gsap.from(p, { scale: 0, svgOrigin: "0 0", duration: 0.6, ease: "back.out(3)" });
    });
    $("[data-box-count]").textContent = `${box.length}/4`;
    $("[data-box-text]").textContent = box.length ? box.map((i) => FLAVOURS[i].name.split(" ")[0]).join(", ") : "Empty box";
  };
  const toastEl = $("[data-toast]");
  let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("is-on"), 2400); };
  $("[data-add]").addEventListener("click", () => {
    if (boxFull()) { toast("Box of four ready — checkout opens your order page"); return; }
    box.push(current);
    renderBox(true);
    if (!reduced) {
      animate("[data-box-count]", { scale: [1, 1.5, 1] }, { type: spring, stiffness: 500, damping: 12 });
      gsap.fromTo($(".wedge__inner", wedges[current]), { scale: 1.04 }, { keyframes: { scale: [1.04, 0.92, 1.08, 1.04] }, duration: 0.5, ease: "none" });
    }
    toast(`${FLAVOURS[current].name} added · ${4 - box.length ? `${4 - box.length} to go` : "box full!"}`);
    $("[data-add]").firstChild.textContent = boxFull() ? "Box full · checkout " : `Add ${FLAVOURS[current].name.split(" ")[0].toLowerCase()} to box `;
  });
  renderBox();

  /* ---------------- Turning: buttons, tap, keys, drag ---------------- */
  let st = null; // desktop scroll trigger (set below)
  let spinTween = null; // the one rotation tween allowed to run at a time
  const goTo = (i, dur = 0.8) => {
    i = ((i % N) + N) % N;
    if (st && st.isActive) {
      // keep scroll and wheel in sync: scroll to that slice's stop
      const p = (((i - st._base) % N) + N) % N / (N - 1);
      window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: reduced ? "auto" : "smooth" });
      return;
    }
    const proxy = { r: state.rot };
    spinTween?.kill();
    spinTween = gsap.to(proxy, { r: targetFor(i, state.rot + (((i - current + N) % N) <= N / 2 ? -1 : 1) * 0.01), duration: reduced ? 0 : dur, ease: "power3.inOut", onUpdate: () => setRot(proxy.r) });
  };
  $("[data-prev]").addEventListener("click", () => goTo(current - 1));
  $("[data-next]").addEventListener("click", () => goTo(current + 1));
  wedges.forEach((w, k) => {
    w.addEventListener("click", () => { if (!dragMoved) goTo(k); });
    w.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goTo(k); } });
  });
  document.addEventListener("keydown", (e) => {
    if (!e.target.closest || e.target.closest("input, textarea")) return;
    if (e.key === "ArrowRight") goTo(current + 1);
    if (e.key === "ArrowLeft") goTo(current - 1);
  });

  const svg = $("[data-wheel]");
  let dragging = false, dragMoved = false, lastA = 0, vel = 0, lastT = 0;
  const angleAt = (e) => { const r = svg.getBoundingClientRect(); return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI; };
  svg.addEventListener("pointerdown", (e) => { dragging = true; dragMoved = false; lastA = angleAt(e); lastT = performance.now(); vel = 0; svg.setPointerCapture(e.pointerId); spinTween?.kill(); });
  svg.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    let a = angleAt(e), d = a - lastA;
    if (d > 180) d -= 360; if (d < -180) d += 360;
    if (Math.abs(d) > 0.5) dragMoved = true;
    const now = performance.now();
    vel = d / Math.max(1, now - lastT);
    lastA = a; lastT = now;
    setRot(state.rot + d);
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    if (!dragMoved) return;
    const fling = reduced ? 0 : vel * 220; // carry momentum, then settle on a slice
    const i = indexFor(state.rot + fling);
    if (st && st.isActive) { goTo(i); return; }
    const proxy = { r: state.rot };
    spinTween = gsap.to(proxy, { r: targetFor(i, state.rot + fling), duration: reduced ? 0 : 0.9, ease: "power3.out", onUpdate: () => setRot(proxy.r) });
    setTimeout(() => (dragMoved = false), 50);
  };
  svg.addEventListener("pointerup", release);
  svg.addEventListener("pointercancel", release);

  setRot(state.rot);

  /* ---------------- Ticker ---------------- */
  const ticker = $("[data-ticker]");
  ticker.innerHTML += ticker.innerHTML;
  let tx = 0;
  if (!reduced) gsap.ticker.add((t, dt) => { tx -= 0.04 * dt; const h = ticker.scrollWidth / 2; if (tx <= -h) tx += h; gsap.set(ticker, { x: tx }); });

  window.addEventListener("resize", () => { if (!st || !st.isActive) setRot(targetFor(current, state.rot)); });

  if (reduced) return;

  /* ---------------- Intro ---------------- */
  document.fonts.ready.then(() => {
    const start = state.rot;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from("[data-plate]", { scale: 0.4, opacity: 0, svgOrigin: "0 0", duration: 1.2 })
      .from(wedges, { scale: 0, rotation: -40, svgOrigin: "0 0", opacity: 0, duration: 0.9, stagger: 0.07, ease: "back.out(1.6)" }, 0.15)
      .fromTo({ r: start - 120 }, { r: start - 120 }, { r: start, duration: 1.6, ease: "power3.out", onUpdate() { setRot(this.targets()[0].r); } }, 0.1)
      .from("[data-pointer]", { x: -60, opacity: 0, duration: 0.8 }, 0.9)
      .from("[data-intro]", { y: 30, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.5)
      .from(".nav", { y: -30, opacity: 0, duration: 0.7 }, 0.2)
      .from(".wheel__ctrl", { y: 20, opacity: 0, duration: 0.6 }, 1.1);

    /* ---------------- Scroll: pin and spin through all eight ---------------- */
    const mm = gsap.matchMedia();
    mm.add("(min-width: 961px)", () => {
      // always map the top of the pin to slice 01, even if the intro spin is still turning the wheel
      const base = 0;
      const startRot = targetFor(base, 0);
      const proxy = { r: startRot };
      st = ScrollTrigger.create({
        trigger: "[data-hero]", start: "top top", end: () => `+=${window.innerHeight * 0.55 * (N - 1)}`, pin: "[data-pin]",
        snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut", delay: 0.05 },
        onUpdate: (s) => {
          if (dragging) return;
          gsap.to(proxy, { r: startRot - s.progress * (N - 1) * STEP, duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: () => setRot(proxy.r) });
        },
      });
      st._base = base;
      return () => { st.kill(); st = null; };
    });
  });
})();
