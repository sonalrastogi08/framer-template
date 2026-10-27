/* =========================================================================
   SUGARSTACK hero — Velvet template, version 3
   GSAP: intro drop-in, scroll-pinned "exploded cake" view, conveyor belt
   Motion: builder springs (layer squish, chip pops), sticker drag, toasts
   ========================================================================= */
(() => {
  const { animate, spring } = window.Motion;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const root = document.documentElement;
  const cake = $("[data-cake]");
  const layers = $$(".layer", cake);
  const SPREAD = 1.7; // how far layers move apart in the exploded view

  /* ---------------- Toast ---------------- */
  const toastEl = $("[data-toast]");
  let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("is-on"), 2400); };

  /* ---------------- Builder ---------------- */
  const BASE = 48;
  const builder = $("[data-builder]");
  const priceEl = $("[data-price-out]");
  let shownPrice = BASE;
  const priceProxy = { v: BASE };
  const squish = (name) => {
    if (reduced) return;
    const targets = layers.filter((l) => l.dataset.layer === name);
    // GSAP (not Motion) here: these layers also carry the exploded-view transform, which GSAP merges safely
    gsap.to(targets, { keyframes: { scaleY: [1, 0.82, 1.08, 1], scaleX: [1, 1.06, 0.98, 1] }, duration: 0.6, stagger: 0.06, ease: "none" });
    gsap.to(layers.filter((l) => l.dataset.layer === "toppings" || l.dataset.layer === "candle"), { keyframes: { scale: [1, 1.18, 1] }, duration: 0.45, ease: "none" });
  };
  const update = (changed) => {
    let price = BASE;
    $$("input:checked", builder).forEach((i) => {
      price += +i.dataset.price;
      const key = i.name === "frost" ? "frost" : i.name;
      root.style.setProperty(`--${key}`, i.dataset.color);
      const label = $(`[data-name="${key}"]`, cake);
      if (label) label.textContent = i.dataset.label;
    });
    if (shownPrice !== price) {
      shownPrice = price;
      // one proxy + overwrite, so rapid clicks can't let an older count-up finish last
      gsap.to(priceProxy, { v: price, duration: reduced ? 0 : 0.5, ease: "power2.out", overwrite: true, onUpdate: () => (priceEl.textContent = `$${Math.round(priceProxy.v)}`) });
      if (!reduced) animate(priceEl, { scale: [1, 1.18, 1] }, { type: spring, stiffness: 400, damping: 14 });
    }
    if (changed) squish(changed === "frost" ? "frost" : changed);
    const s = $("input[name=sponge]:checked", builder).dataset.label.toLowerCase();
    cake.setAttribute("aria-label", `Your cake: ${s}, ${$("input[name=filling]:checked", builder).dataset.label.toLowerCase()}, ${$("input[name=frost]:checked", builder).dataset.label.toLowerCase()}`);
  };
  builder.addEventListener("change", (e) => {
    update(e.target.name);
    if (!reduced) animate(e.target.nextElementSibling, { rotate: [0, -6, 4, 0] }, { duration: 0.4 });
  });
  update();

  let bag = 0;
  $("[data-add]").addEventListener("click", (e) => {
    bag++;
    const b = $("[data-bag]");
    b.textContent = bag;
    if (!reduced) {
      animate(b, { scale: [1, 1.6, 1] }, { type: spring, stiffness: 500, damping: 10 });
      gsap.to(cake, { keyframes: { rotation: [0, -3, 2, 0] }, duration: 0.6, ease: "none" });
    }
    toast(`Your ${$("input[name=sponge]:checked + span", builder).textContent.trim().toLowerCase()} cake is in the basket`);
  });

  /* ---------------- Stickers: drag anywhere, spring settle ---------------- */
  $$("[data-sticker]").forEach((st) => {
    let sx = 0, sy = 0, ox = 0, oy = 0, drag = false;
    st.addEventListener("pointerdown", (e) => { drag = true; sx = e.clientX - ox; sy = e.clientY - oy; st.setPointerCapture(e.pointerId); if (!reduced) gsap.to(st, { scale: 1.12, duration: 0.2 }); });
    st.addEventListener("pointermove", (e) => { if (!drag) return; ox = e.clientX - sx; oy = e.clientY - sy; st.style.translate = `${ox}px ${oy}px`; });
    const end = () => { if (!drag) return; drag = false; if (!reduced) gsap.to(st, { scale: 1, duration: 0.6, ease: "elastic.out(1, .4)" }); };
    st.addEventListener("pointerup", end); st.addEventListener("pointercancel", end);
  });

  /* ---------------- Exploded view timeline (shared by scroll + button) ---------------- */
  const labels = $("[data-labels]");
  const explode = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut", duration: 1, immediateRender: false } });
  // fromTo with explicit start values: the intro animates these same elements, so the
  // timeline must never record its starting state from a half-finished intro frame.
  layers.forEach((l) => explode.fromTo(l, { y: 0 }, { y: +l.dataset.explode * SPREAD }, 0));
  const labelOffset = { candle: -160, toppings: -130, frost: -96, sponge3: -56, filling2: -30, plate: 70 };
  $$("[data-label-for]", labels).forEach((g) => explode.fromTo(g, { y: 0 }, { y: labelOffset[g.dataset.labelFor] * SPREAD }, 0));
  const stickerRest = [-10, 12, -6];
  explode.fromTo(labels, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.55)
    .fromTo(cake, { scale: 1, y: 0 }, { scale: 0.86, y: 30 }, 0)
    .fromTo("[data-blob]", { rotate: 0, scale: 1, borderRadius: "46% 54% 42% 58% / 52% 44% 56% 48%" }, { rotate: 18, scale: 1.06, borderRadius: "58% 42% 50% 50% / 44% 56% 44% 56%" }, 0)
    .fromTo("[data-sticker]", { y: 0, rotate: (i) => stickerRest[i] }, { y: (i) => [-40, 50, -60][i], rotate: (i) => [-24, 22, 10][i] }, 0);

  const insideBtn = $("[data-inside]");
  const setPressed = (p) => insideBtn.setAttribute("aria-pressed", String(p > 0.5));
  insideBtn.addEventListener("click", () => {
    const target = explode.progress() > 0.5 ? 0 : 1;
    gsap.to(explode, { progress: target, duration: reduced ? 0 : 1.1, ease: "power3.inOut", onUpdate: () => setPressed(explode.progress()) });
  });

  /* ---------------- Conveyor belt ---------------- */
  const belt = $("[data-belt]");
  belt.appendChild($(".belt__set", belt).cloneNode(true)).setAttribute("aria-hidden", "true");
  let bx = 0, boost = 0;
  if (!reduced) {
    gsap.ticker.add((t, dt) => {
      const half = belt.scrollWidth / 2;
      bx -= (0.05 + boost) * dt;
      if (bx <= -half) bx += half;
      gsap.set(belt, { x: bx });
      boost *= 0.93;
    });
  }

  if (reduced) return;

  /* ---------------- Intro ---------------- */
  document.fonts.ready.then(() => {
    const words = $$(".t-word");
    const tl = gsap.timeline({ defaults: { ease: "back.out(1.8)" } });
    tl.from("[data-awning]", { scaleY: 0, duration: 0.9, ease: "elastic.out(1, .5)" })
      .from(".nav", { y: -120, duration: 0.8 }, 0.15)
      .from(words, { yPercent: 120, rotate: (i) => [-14, 10, -8][i], scale: 0.4, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.3)
      .from("[data-intro]", { y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, 0.6)
      .from("[data-blob]", { scale: 0, rotate: -40, duration: 1, ease: "elastic.out(1, .6)" }, 0.2)
      // layers drop in from the bottom up, like stacking a real cake
      .from(layers, { y: -700, opacity: 0, duration: 0.8, stagger: 0.09, ease: "bounce.out" }, 0.45)
      .from("[data-sticker]", { scale: 0, rotate: 90, duration: 0.7, stagger: 0.12 }, 1.3)
      .from(".inside", { y: 30, opacity: 0, duration: 0.5 }, 1.5)
      .from(".belt", { yPercent: 100, duration: 0.8, ease: "power3.out" }, 0.9);

    /* ---------------- Scroll: pin the hero and explode the cake ---------------- */
    const mm = gsap.matchMedia();
    mm.add("(min-width: 961px)", () => {
      const st = ScrollTrigger.create({
        trigger: "[data-hero]", start: "top top", end: "+=120%", pin: "[data-pin]", scrub: false,
        onUpdate: (s) => {
          gsap.to(explode, { progress: s.progress, duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: () => setPressed(explode.progress()) });
          boost = Math.min(Math.abs(s.getVelocity()) / 3000, 1);
        },
      });
      gsap.to(".title", { scale: 0.9, transformOrigin: "0% 50%", ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "+=120%", scrub: true } });
      return () => st.kill();
    });
    mm.add("(max-width: 960px)", () => {
      const st = ScrollTrigger.create({ trigger: "[data-hero]", start: "top bottom", end: "bottom top", onUpdate: (s) => (boost = Math.min(Math.abs(s.getVelocity()) / 3000, 1)) });
      return () => st.kill();
    });
  });
})();
