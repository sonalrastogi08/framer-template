/* =========================================================================
   VELVET — interactions & motion
   GSAP + ScrollTrigger + SplitText  → scroll-driven effects
       (hero intro, horizontal scroll, zoom reveal, text highlight, marquee,
        gallery zoom, process line, parallax, footer wordmark)
   Motion (motion.dev, the vanilla build of Framer Motion)
       → UI micro-interactions (stagger-in, springs, tilt, magnetic, toasts)
   Every effect has a matching Framer recipe in docs/ANIMATION-SPEC.md.
   ========================================================================= */
(() => {
  const { animate, inView, stagger, spring } = window.Motion;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const isDesktop = () => window.matchMedia("(min-width: 861px)").matches;

  gsap.registerPlugin(ScrollTrigger, SplitText);
  if (reduced) document.documentElement.classList.add("reduced");

  /* ---------------- Header: hide on scroll down, glass when scrolled ---------------- */
  const header = $("[data-header]");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    header.classList.toggle("is-hidden", y > 400 && y > lastY);
    lastY = y;
  }, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  const menu = $("[data-menu]");
  const openBtn = $("[data-menu-open]");
  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    openBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open && !reduced) animate($$("nav a", menu), { opacity: [0, 1], y: [40, 0] }, { delay: stagger(0.06, { startDelay: 0.25 }), duration: 0.6, ease: [0.22, 1, 0.36, 1] });
  };
  openBtn?.addEventListener("click", () => setMenu(true));
  $("[data-menu-close]")?.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* ---------------- Toast + basket ---------------- */
  const toastEl = $("[data-toast]");
  let toastTimer;
  const toast = (msg) => {
    toastEl.innerHTML = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 2600);
  };
  let cart = 0;
  const cartCount = $("[data-cart-count]");
  const addToCart = (n = 1, label = "Added to your basket") => {
    cart += n;
    cartCount.textContent = cart;
    animate(cartCount, { scale: [1, 1.6, 1] }, { type: spring, stiffness: 500, damping: 12 });
    toast(`🧁 ${label}`);
  };
  $$("[data-add]").forEach((b) => b.addEventListener("click", () => {
    animate(b, { scale: [1, 0.8, 1] }, { duration: 0.35 });
    addToCart(1);
  }));

  /* ---------------- Size chips update price ---------------- */
  $$("[data-sizes]").forEach((group) => {
    const out = group.closest(".card, .pdp__info")?.querySelector("[data-price-out]");
    group.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      $$("button", group).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      if (out && btn.dataset.price) {
        out.textContent = `$${btn.dataset.price}`;
        animate(out, { y: [8, 0], opacity: [0, 1] }, { duration: 0.35 });
      }
    });
  });

  /* ---------------- Favourite hearts ---------------- */
  $$(".card__fav").forEach((b) => b.addEventListener("click", () => {
    b.classList.toggle("is-on");
    animate(b, { scale: [1, 1.35, 1] }, { type: spring, stiffness: 400, damping: 10 });
  }));

  /* ---------------- Order-mode selector (sliding pill, Motion spring) ---------------- */
  $$("[data-order-modes]").forEach((wrap) => {
    const ind = $("[data-ind]", wrap);
    const note = $("[data-order-note]", wrap.parentElement);
    const tabs = $$("button", wrap);
    const move = (btn, instant) => {
      const opts = instant || reduced ? { duration: 0 } : { type: spring, stiffness: 380, damping: 30 };
      animate(ind, { x: btn.offsetLeft - 6, width: btn.offsetWidth }, opts);
    };
    tabs.forEach((btn) => btn.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === btn)));
      move(btn);
      if (note) {
        note.innerHTML = btn.dataset.note;
        animate(note, { opacity: [0, 1], y: [6, 0] }, { duration: 0.3 });
      }
    }));
    const sync = () => move(tabs.find((t) => t.getAttribute("aria-selected") === "true"), true);
    document.fonts.ready.then(sync);
    window.addEventListener("resize", sync);
  });

  /* ---------------- Magnetic buttons ---------------- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        animate(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35 }, { duration: 0.3 });
      });
      el.addEventListener("pointerleave", () => animate(el, { x: 0, y: 0 }, { type: spring, stiffness: 300, damping: 15 }));
    });

    /* Hover tilt (occasion tiles) */
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        animate(el, { rotateY: px * 12, rotateX: -py * 12, transformPerspective: 800 }, { duration: 0.3 });
      });
      el.addEventListener("pointerleave", () => animate(el, { rotateY: 0, rotateX: 0 }, { type: spring, stiffness: 200, damping: 14 }));
    });
  }

  /* ---------------- Live clock + open-now ---------------- */
  const clock = $("[data-clock]");
  const tick = () => {
    const d = new Date();
    if (clock) clock.textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    $$("[data-open-now]").forEach((p) => {
      const h = d.getHours() + d.getMinutes() / 60;
      const open = h >= +p.dataset.open && h < +p.dataset.close;
      p.className = `pill ${open ? "pill--fresh" : ""}`;
      p.innerHTML = `<span class="dot"></span>${open ? "Open now" : `Opens ${String(p.dataset.open).padStart(2, "0")}:00`}`;
    });
  };
  tick();
  setInterval(tick, 30000);

  /* ---------------- Location mini-maps (decorative SVG) ---------------- */
  $$("[data-map]").forEach((m, i) => {
    const roads = Array.from({ length: 7 }, (_, k) => `<path d="M${-20 + k * 70 + i * 13} -10 L${40 + k * 60 - i * 9} 260" stroke="#fff" stroke-width="${k % 3 ? 4 : 9}"/>`).join("");
    const cross = Array.from({ length: 4 }, (_, k) => `<path d="M-10 ${30 + k * 60 + i * 7} L420 ${10 + k * 64}" stroke="#fff" stroke-width="${k % 2 ? 4 : 7}"/>`).join("");
    m.innerHTML = `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="250" fill="#EFE3D1"/><path d="M0 190 Q120 150 220 210 T400 180 V250 H0Z" fill="#CFE0C3"/>${roads}${cross}<g transform="translate(200 120)"><circle r="26" fill="var(--pin)" opacity=".2"><animate attributeName="r" values="14;34;14" dur="2.4s" repeatCount="indefinite"/></circle><path d="M0 8 C-14 -6 -14 -26 0 -26 C14 -26 14 -6 0 8Z" fill="var(--pin)"/><circle cy="-15" r="5" fill="#fff"/></g></svg>`;
  });

  /* ---------------- Newsletter ---------------- */
  $$("[data-newsletter]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    f.reset();
    toast("💌 You're in the Crumb Club!");
  }));

  /* ---------------- Build-a-box ---------------- */
  const box = $("[data-box]");
  if (box) {
    let size = 6;
    const flavours = $$("[data-flavours] .flavour");
    const counts = flavours.map(() => 0);
    const slots = $("[data-box-slots]");
    const render = () => {
      const total = counts.reduce((a, b) => a + b, 0);
      slots.style.gridTemplateColumns = `repeat(${size === 6 ? 3 : 4}, 1fr)`;
      const colors = counts.flatMap((c, i) => Array(c).fill(getComputedStyle($("i", flavours[i])).backgroundColor));
      const prev = $$(".box-slot.is-filled", slots).length;
      slots.innerHTML = Array.from({ length: size }, (_, i) => `<div class="box-slot ${colors[i] ? "is-filled" : ""}" style="${colors[i] ? `background:${colors[i]}` : ""}"></div>`).join("");
      if (total > prev && !reduced) animate($$(".box-slot", slots)[total - 1], { scale: [0, 1.15, 1] }, { type: spring, stiffness: 500, damping: 14 });
      $("[data-box-count]").textContent = `${total} / ${size}`;
      $("[data-box-progress]").style.width = `${(total / size) * 100}%`;
      flavours.forEach((f, i) => ($("output", f).textContent = counts[i]));
      const add = $("[data-box-add]");
      const full = total === size;
      add.disabled = !full;
      add.style.opacity = full ? 1 : 0.5;
      add.innerHTML = full ? `Add box to basket <span class="arrow">→</span>` : `Add ${size - total} more to fill your box`;
    };
    flavours.forEach((f, i) => {
      $("[data-inc]", f).addEventListener("click", () => { if (counts.reduce((a, b) => a + b, 0) < size) { counts[i]++; render(); } });
      $("[data-dec]", f).addEventListener("click", () => { if (counts[i] > 0) { counts[i]--; render(); } });
    });
    $$("[data-box-size]", box).forEach((b) => b.addEventListener("click", () => {
      size = +b.dataset.boxSize;
      $$("[data-box-size]", box).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      let over = counts.reduce((a, c) => a + c, 0) - size;
      for (let i = counts.length - 1; over > 0 && i >= 0; i--) { const d = Math.min(counts[i], over); counts[i] -= d; over -= d; }
      render();
    }));
    $("[data-box-add]").addEventListener("click", () => { addToCart(1, `Box of ${size} added`); counts.fill(0); render(); });
    render();
  }

  /* ---------------- Tabs (product page) ---------------- */
  $$("[data-tabs]").forEach((t) => {
    const btns = $$("[role=tab]", t);
    const panels = $$("[role=tabpanel]", t);
    btns.forEach((b, i) => b.addEventListener("click", () => {
      btns.forEach((x, j) => x.setAttribute("aria-selected", String(i === j)));
      panels.forEach((p, j) => (p.hidden = i !== j));
      animate(panels[i], { opacity: [0, 1], y: [10, 0] }, { duration: 0.35 });
    }));
  });

  /* ---------------- Character counter ---------------- */
  $$("[data-count-chars]").forEach((input) => {
    const out = $(`[data-counter="${input.id}"]`);
    const upd = () => (out.textContent = `${input.value.length} / ${input.maxLength}`);
    input.addEventListener("input", upd); upd();
  });

  /* ---------------- Product gallery thumbs ---------------- */
  $$("[data-thumbs]").forEach((wrap) => {
    const main = $("[data-main-img]");
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      $$("button", wrap).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      main.parentElement.style.background = b.dataset.bg;
      animate(main, { opacity: [1, 0], scale: [1, 0.9] }, { duration: 0.18 }).then(() => {
        main.src = $("img", b).src;
        animate(main, { opacity: [0, 1], scale: [0.9, 1] }, { type: spring, stiffness: 260, damping: 20 });
      });
    });
  });

  /* ---------------- Shop filters ---------------- */
  const grid = $("[data-products]");
  if (grid) {
    const state = { cat: "all", occ: "all", diet: new Set() };
    const items = $$(".card", grid);
    const countEl = $("[data-result-count]");
    const apply = () => {
      let shown = 0;
      items.forEach((c) => {
        const ok = (state.cat === "all" || c.dataset.cat === state.cat)
          && (state.occ === "all" || c.dataset.occ.split(" ").includes(state.occ))
          && [...state.diet].every((d) => c.dataset.diet.split(" ").includes(d));
        c.hidden = !ok;
        if (ok) shown++;
      });
      countEl.textContent = `${shown} ${shown === 1 ? "bake" : "bakes"}`;
      $("[data-empty]").style.display = shown ? "none" : "block";
      if (!reduced) animate(items.filter((c) => !c.hidden), { opacity: [0, 1], y: [20, 0] }, { delay: stagger(0.04), duration: 0.45 });
      ScrollTrigger.refresh();
    };
    $$("[data-filter]").forEach((group) => group.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      const key = group.dataset.filter;
      if (key === "diet") {
        const on = chip.getAttribute("aria-pressed") !== "true";
        chip.setAttribute("aria-pressed", String(on));
        on ? state.diet.add(chip.dataset.value) : state.diet.delete(chip.dataset.value);
      } else {
        $$(".chip", group).forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
        state[key] = chip.dataset.value;
      }
      apply();
    }));
    $("[data-sort]")?.addEventListener("change", (e) => {
      const v = e.target.value;
      const sorted = [...items].sort((a, b) => v === "low" ? a.dataset.price - b.dataset.price : v === "high" ? b.dataset.price - a.dataset.price : a.dataset.order - b.dataset.order);
      sorted.forEach((c) => grid.appendChild(c));
      apply();
    });
    // deep links like shop.html#birthday
    const fromHash = () => {
      const hash = location.hash.slice(1);
      const preset = hash && $(`[data-filter] .chip[data-value="${hash}"]`);
      if (preset) preset.click(); else apply();
    };
    window.addEventListener("hashchange", fromHash);
    fromHash();
  }

  /* ---------------- Multi-step enquiry form ---------------- */
  $$("[data-stepper-form]").forEach((form) => {
    const steps = $$(".form-step", form);
    const dots = $$("[data-dots] span", form);
    const label = $("[data-step-label]", form);
    let i = 0;
    const show = (n) => {
      steps[i].classList.remove("is-active");
      i = n;
      steps[i].classList.add("is-active");
      dots.forEach((d, k) => d.classList.toggle("is-done", k <= i));
      label.textContent = `Step ${i + 1} of ${steps.length}`;
      const last = i === steps.length - 1;
      $("[data-prev]", form).style.visibility = i ? "visible" : "hidden";
      $("[data-next]", form).hidden = last;
      $("[type=submit]", form).hidden = !last;
      if (!reduced) animate(steps[i], { opacity: [0, 1], x: [30, 0] }, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });
    };
    form.addEventListener("click", (e) => {
      if (e.target.closest("[data-next]")) {
        const invalid = $$("input, select, textarea", steps[i]).find((f) => !f.checkValidity());
        if (invalid) { invalid.reportValidity(); return; }
        if (i < steps.length - 1) show(i + 1);
      }
      if (e.target.closest("[data-prev]") && i > 0) show(i - 1);
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.querySelector(".stepper-form__body").hidden = true;
      const done = $(".form-success", form);
      done.classList.add("is-active");
      animate(done, { opacity: [0, 1], scale: [0.95, 1] }, { type: spring, stiffness: 200, damping: 18 });
    });
    show(0);
  });

  $$("[data-wobble]").forEach((el) => !reduced && animate(el, { rotate: [-8, 8, -8], y: [0, -14, 0] }, { duration: 3, repeat: Infinity, ease: "easeInOut" }));

  $$("[data-contact-form]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault(); f.reset(); toast("📨 Thanks! We reply within one working day.");
  }));

  /* =====================================================================
     SCROLL-DRIVEN EFFECTS (GSAP)
     ===================================================================== */
  if (reduced) {
    $$("[data-zoom-title], [data-zoom-caption], [data-gallery-label]").forEach((el) => (el.style.opacity = 1));
    $$("[data-count]").forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")));
    $$("[data-highlight] .word, [data-highlight]").forEach((w) => (w.style.opacity = 1));
    return;
  }

  /* Generic reveal + stagger (Motion inView) */
  $$("[data-reveal]").forEach((el) => inView(el, () => {
    animate(el, { opacity: [0, 1], y: [40, 0] }, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
  }, { margin: "0px 0px -10% 0px" }));
  $$("[data-stagger]").forEach((wrap) => {
    const kids = [...wrap.children];
    kids.forEach((k) => (k.style.opacity = 0));
    inView(wrap, () => {
      animate(kids, { opacity: [0, 1], y: [50, 0] }, { delay: stagger(0.08), duration: 0.8, ease: [0.22, 1, 0.36, 1] });
    }, { margin: "0px 0px -15% 0px" });
  });

  /* Count-up stats */
  $$("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const dec = +(el.dataset.decimals || 0);
    const suf = el.dataset.suffix || "";
    ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 2, ease: "power3.out", onUpdate: () => (el.textContent = o.v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf) });
      },
    });
  });

  document.fonts.ready.then(() => {
    /* ---- Split-text headings: masked line/char rise (motionsites-style) ---- */
    $$("[data-split]").forEach((el) => {
      const split = SplitText.create(el, { type: "words,chars", mask: "words" });
      const isHero = el.closest(".hero");
      gsap.from(split.chars, {
        yPercent: 110, rotate: 6, duration: 1, ease: "expo.out", stagger: 0.022,
        delay: isHero ? 0.5 : 0,
        scrollTrigger: isHero ? undefined : { trigger: el, start: "top 85%" },
      });
    });
    $$(".section h2, .page-hero h1, .hscroll h2").forEach((el) => {
      if (el.hasAttribute("data-split") || el.closest("[data-zoom]") || el.closest("[data-gallery]")) return;
      const split = SplitText.create(el, { type: "lines", mask: "lines" });
      gsap.from(split.lines, { yPercent: 105, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 88%" } });
    });

    /* ---- Hero intro timeline ---- */
    const word = $("[data-hero-word]");
    if (word) {
      const chars = SplitText.create(word, { type: "chars", charsClass: "char" }).chars;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(chars, { yPercent: 100, opacity: 0, duration: 1.4, stagger: 0.06 })
        .from("[data-hero-cake]", { y: 160, scale: 0.75, rotate: -8, opacity: 0, duration: 1.6 }, 0.15)
        .from("[data-float]", { scale: 0, opacity: 0, rotate: -40, duration: 1.2, stagger: 0.12, ease: "back.out(2)" }, 0.6)
        .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 0.7)
        .from("[data-hero-badge]", { scale: 0, rotate: -90, duration: 1.2, ease: "back.out(1.8)" }, 0.9)
        .from("[data-hero-script]", { clipPath: "inset(0 100% 0 0)", duration: 1.4, ease: "power2.inOut" }, 1.1);

      // scroll: cake zooms & tilts, word drifts, floats parallax
      gsap.to("[data-hero-cake]", { yPercent: 18, scale: 1.12, rotate: 6, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(word, { yPercent: -30, letterSpacing: "0.02em", ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      $$("[data-float]").forEach((f) => gsap.to(f, { y: +f.dataset.float * 3, rotate: +f.dataset.float / 3, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } }));
    }

    /* ---- Page-hero image float (inner pages) ---- */
    $$(".page-hero__img").forEach((img) => {
      gsap.from(img, { y: 120, rotate: -10, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.2 });
      gsap.to(img, { yPercent: 25, rotate: 8, ease: "none", scrollTrigger: { trigger: img.closest("section"), start: "top top", end: "bottom top", scrub: true } });
    });

    /* ---- Velocity marquee: auto-scroll + skew & speed from scroll velocity ---- */
    $$("[data-marquee]").forEach((m) => {
      const track = $(".marquee__track", m);
      let x = 0, dir = -1, boost = 0;
      const half = () => track.scrollWidth / 2;
      gsap.ticker.add((t, dt) => {
        x += dir * (0.06 + boost) * dt;
        if (x <= -half()) x += half();
        if (x > 0) x -= half();
        gsap.set(track, { x });
        boost *= 0.92;
      });
      ScrollTrigger.create({
        trigger: m, start: "top bottom", end: "bottom top",
        onUpdate: (s) => {
          dir = s.direction === 1 ? -1 : 1;
          boost = Math.min(Math.abs(s.getVelocity()) / 4000, 0.8);
          gsap.to(track, { skewX: -s.getVelocity() / 400, duration: 0.4, overwrite: true, onComplete: () => gsap.to(track, { skewX: 0, duration: 0.6 }) });
        },
      });
    });

    /* ---- Scroll-scrubbed word highlight ---- */
    $$("[data-highlight]").forEach((el) => {
      const words = SplitText.create(el, { type: "words", wordsClass: "word" }).words;
      gsap.to(words, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } });
    });

    /* ---- Horizontal scroll sections (pinned) ---- */
    const mm = gsap.matchMedia();
    mm.add("(min-width: 861px)", () => {
      $$("[data-hscroll]").forEach((sec) => {
        const track = $("[data-hscroll-track]", sec);
        const bar = $("[data-hscroll-progress]", sec);
        const dist = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -dist(), ease: "none",
          scrollTrigger: { trigger: sec, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
            onUpdate: (s) => bar && gsap.set(bar, { scaleX: s.progress }) },
        });
        // cards rise & tilt as they enter from the right
        $$(".card, .p-item, .t-item", track).forEach((c) => {
          gsap.from(c, { y: 80, rotate: 4, opacity: 0.2, ease: "none",
            scrollTrigger: { trigger: c, containerAnimation: tween, start: "left 100%", end: "left 60%", scrub: true } });
        });
      });
    });
    mm.add("(max-width: 860px)", () => {
      $$("[data-hscroll-track]").forEach((t) => { t.style.overflowX = "auto"; t.style.width = "auto"; t.style.scrollSnapType = "x mandatory"; t.style.paddingBottom = "12px"; $$(":scope > *", t).forEach((c) => (c.style.scrollSnapAlign = "start")); });
    });

    /* ---- Signature zoom reveal (pinned) ---- */
    $$("[data-zoom]").forEach((sec) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: "top top", end: "bottom bottom", scrub: 1 } });
      tl.to("[data-zoom-frame]", { width: "100vw", height: "100vh", borderRadius: 0, ease: "power2.inOut", duration: 1 }, 0)
        .to("[data-zoom-img]", { scale: 1.25, y: "8vh", duration: 1 }, 0)
        .to("[data-zoom-side='-1']", { xPercent: -120, opacity: 0, duration: 0.6 }, 0)
        .to("[data-zoom-side='1']", { xPercent: 120, opacity: 0, duration: 0.6 }, 0)
        .fromTo("[data-zoom-title]", { opacity: 0, y: 60, scale: 0.9 }, { opacity: 1, y: "-22vh", scale: 1, duration: 0.5 }, 0.55)
        .to("[data-zoom-caption]", { opacity: 1, duration: 0.3 }, 0.8);
    });

    /* ---- Process line draw ---- */
    $$("[data-process]").forEach((p) => {
      const line = $("[data-process-line]", p);
      const vertical = !isDesktop() || window.innerWidth <= 1080;
      gsap.to(line, { [vertical ? "scaleY" : "scaleX"]: 1, ease: "none", scrollTrigger: { trigger: p, start: "top 75%", end: "bottom 60%", scrub: true } });
      gsap.from($$(".step", p), { y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 75%" } });
    });

    /* ---- Generic parallax ---- */
    $$("[data-parallax]").forEach((el) => gsap.to(el, { y: +el.dataset.parallax * 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }));

    /* ---- Reviews: two rows drifting in opposite directions on scroll ---- */
    $$("[data-reviews]").forEach((row) => {
      const d = +row.dataset.reviews;
      gsap.fromTo(row, { xPercent: d > 0 ? 0 : -25 }, { xPercent: d > 0 ? -25 : 0, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
    });

    /* ---- Gallery: grid zooms out from the centre tile ---- */
    $$("[data-gallery]").forEach((g) => {
      const grid = $("[data-gallery-grid]", g);
      const center = $("[data-gallery-center]", g);
      const scaleUp = () => Math.max(window.innerWidth / center.offsetWidth, window.innerHeight / center.offsetHeight) * 1.05;
      const tl = gsap.timeline({ scrollTrigger: { trigger: g, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true } });
      tl.fromTo(grid, { scale: scaleUp }, { scale: 1, ease: "power2.inOut", duration: 1 })
        .from($$(":scope > div:not([data-gallery-center])", grid), { opacity: 0, scale: 0.6, stagger: { each: 0.02, from: "center" }, duration: 0.5 }, 0.2)
        .to("[data-gallery-label]", { opacity: 1, duration: 0.3 }, 0.75)
        .to(center, { opacity: 0.25, duration: 0.3 }, 0.75);
    });

    /* ---- Footer wordmark: chars rise from below ---- */
    $$("[data-footer-word]").forEach((w) => {
      const chars = SplitText.create(w, { type: "chars", charsClass: "char" }).chars;
      gsap.from(chars, { yPercent: 80, opacity: 0, stagger: 0.05, ease: "expo.out", duration: 1.2, scrollTrigger: { trigger: w, start: "top 95%" } });
    });

    ScrollTrigger.refresh();
  });
})();

/* =========================================================================
   VERSION 6 additions
   - Slice wheel (from v4): spin by scroll (pinned, snapping), drag with
     momentum, arrows, tap or keys; box of four
   - Flavour words (from v2): two rows sliding opposite ways on scroll
   ========================================================================= */
(() => {
  const sec = document.querySelector("[data-wheelsec]");
  const { animate, spring } = window.Motion;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------------- Flavour words ---------------- */
  if (!reduced) document.fonts.ready.then(() => {
    $$("[data-kinetic]").forEach((r) => {
      const d = +r.dataset.kinetic;
      gsap.fromTo(r, { xPercent: d < 0 ? 0 : -30 }, { xPercent: d < 0 ? -30 : 0, ease: "none", scrollTrigger: { trigger: r.parentElement, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    });
  });

  if (!sec) return;

  /* ---------------- The eight slices ---------------- */
  const FLAVOURS = [
    { name: "Pistachio Rose", tagline: "our signature, since day one", price: 9, notes: "Pistachio · rose · strawberry", allergens: "Dairy · egg · pistachio · gluten", base: "#C9D79A", crust: "#8E9B55", kind: "pistachio" },
    { name: "Midnight Ganache", tagline: "dangerously dark, salted caramel heart", price: 8, notes: "70% cocoa · caramel · nibs", allergens: "Dairy · egg · gluten · soy", base: "#4A2318", crust: "#2A130C", kind: "fudge" },
    { name: "Raspberry Silk", tagline: "pink, light and a little bit tart", price: 9, notes: "Raspberry · white chocolate · cream", allergens: "Dairy · egg · gluten", base: "#F3B6BE", crust: "#D98F99", kind: "raspberry" },
    { name: "Strawberry Shortcake", tagline: "cloud cream, Jersey strawberries", price: 8, notes: "Strawberry · cream · sponge", allergens: "Dairy · egg · gluten", base: "#FFF4E6", crust: "#F2D3A2", kind: "berries" },
    { name: "Classic Red Velvet", tagline: "cream cheese frosting, always", price: 8, notes: "Cocoa · buttermilk · cream cheese", allergens: "Dairy · egg · gluten", base: "#FFF3E2", crust: "#8E1C26", kind: "crumbs" },
    { name: "Lemon Meringue", tagline: "sharp curd under a toasted cloud", price: 8, notes: "Lemon · meringue · shortbread", allergens: "Dairy · egg · gluten", base: "#FFE36E", crust: "#D9A55A", kind: "meringue" },
    { name: "Salted Caramel", tagline: "brown butter sponge, flaky salt", price: 8, notes: "Caramel · brown butter · salt", allergens: "Dairy · egg · gluten", base: "#D9893E", crust: "#7A4520", kind: "caramel" },
    { name: "Black Forest", tagline: "kirsch cherries, cocoa and cream", price: 9, notes: "Cherry · cocoa · cream", allergens: "Dairy · egg · gluten · alcohol", base: "#3A1A14", crust: "#1E0D09", kind: "forest" },
  ];
  const N = FLAVOURS.length, STEP = 360 / N, R = 304, CRUST = 20, PULL = 34;
  const rad = (d) => (d * Math.PI) / 180;
  const pol = (r, a) => [r * Math.cos(rad(a)), r * Math.sin(rad(a))];
  const NS = "http://www.w3.org/2000/svg";
  const wedgePath = (r0, r1, a0, a1) => {
    const [x0, y0] = pol(r1, a0), [x1, y1] = pol(r1, a1);
    if (r0 === 0) return `M0 0 L${x0} ${y0} A${r1} ${r1} 0 0 1 ${x1} ${y1}Z`;
    const [x2, y2] = pol(r0, a1), [x3, y3] = pol(r0, a0);
    return `M${x3} ${y3} L${x0} ${y0} A${r1} ${r1} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 0 ${x3} ${y3}Z`;
  };
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const inWedge = (a0) => pol(R * (0.32 + rnd() * 0.54), a0 + 6 + rnd() * (STEP - 12));
  const strawberry = (x, y, s = 1, fill = "#E23A4E") => `<g transform="translate(${x} ${y}) rotate(${rnd() * 360}) scale(${s})"><path d="M-11 -4 Q-11 13 0 16 Q11 13 11 -4 Q0 -10 -11 -4Z" fill="${fill}"/><path d="M-7 -6 L0 -2 L7 -6 L2 -9 L0 -13 L-2 -9Z" fill="#5E9E4B"/></g>`;
  const toppings = (f, a0) => {
    let s = "";
    const n = (k, fn) => { for (let j = 0; j < k; j++) s += fn(...inWedge(a0)); };
    switch (f.kind) {
      case "pistachio":
        n(26, (x, y) => `<circle cx="${x}" cy="${y}" r="${1.5 + rnd() * 2.5}" fill="#6E8B3D"/>`);
        n(4, (x, y) => `<path transform="translate(${x} ${y}) rotate(${rnd() * 360})" d="M0 0 q10 -14 20 0 q-10 8 -20 0z" fill="#E87C93"/>`);
        n(2, (x, y) => strawberry(x, y));
        break;
      case "fudge":
        s += `<path d="${wedgePath(R * 0.3, R * 0.5, a0 + 4, a0 + STEP - 4)}" fill="#7A3E2A" opacity=".5"/>`;
        n(16, (x, y) => `<rect x="${x}" y="${y}" width="${4 + rnd() * 5}" height="${3 + rnd() * 4}" rx="1" fill="#1E0D09" transform="rotate(${rnd() * 180} ${x} ${y})"/>`);
        n(1, (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="#C9A15B"/>`);
        break;
      case "raspberry":
        n(6, (x, y) => `<g transform="translate(${x} ${y})">${[[-4, -3], [4, -3], [0, 3], [-4, 4], [4, 4], [0, -6]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3.6" fill="#C8243E"/>`).join("")}</g>`);
        n(3, (x, y) => `<circle cx="${x}" cy="${y}" r="8" fill="#FFFDF8"/>`);
        break;
      case "berries":
        n(5, (x, y) => strawberry(x, y));
        n(4, (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff"/><circle cx="${x - 2}" cy="${y - 2}" r="4" fill="#F4E4CF"/>`);
        break;
      case "crumbs":
        n(36, (x, y) => `<rect x="${x}" y="${y}" width="${3 + rnd() * 4}" height="${3 + rnd() * 3}" fill="#8E1C26" opacity="${0.6 + rnd() * 0.4}" transform="rotate(${rnd() * 90} ${x} ${y})"/>`);
        break;
      case "meringue":
        n(7, (x, y) => `<g transform="translate(${x} ${y})"><circle r="13" fill="#FFF8EA"/><circle r="7" cx="2" cy="-2" fill="#F2C27A"/><circle r="3" cx="3" cy="-3" fill="#C9813A"/></g>`);
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

  const rotor = $("[data-w-rotor]", sec);
  FLAVOURS.forEach((f, i) => {
    const a0 = i * STEP;
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "wedge");
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", `${f.name}, $${f.price} a slice`);
    g.innerHTML = `<g class="wedge__inner"><path class="wedge__base" d="${wedgePath(0, R, a0, a0 + STEP)}" fill="${f.base}"/>${toppings(f, a0)}<path d="${wedgePath(R - CRUST, R, a0, a0 + STEP)}" fill="${f.crust}"/></g>`;
    rotor.appendChild(g);
  });
  const wedges = $$(".wedge", rotor);

  /* ---------------- Rotation model ---------------- */
  const pointerAngle = () => (window.matchMedia("(max-width: 960px)").matches ? 270 : 180);
  const targetFor = (i, near) => { const base = pointerAngle() - STEP / 2 - i * STEP; return base + Math.round((near - base) / 360) * 360; };
  const indexFor = (rot) => ((Math.round((pointerAngle() - STEP / 2 - rot) / STEP) % N) + N) % N;
  const state = { rot: targetFor(0, 0) };
  let current = -1, split = null, spinTween = null, st = null;

  const swap = (sel, text) => { const el = $(sel, sec); el.textContent = text; if (!reduced) animate(el, { opacity: [0, 1], y: [8, 0] }, { duration: 0.35 }); };
  const box = [];
  const boxFull = () => box.length >= 4;
  const addLabel = () => { $("[data-w-add]", sec).firstChild.textContent = boxFull() ? "Box full · checkout " : "Add slice to box "; };

  const select = (i) => {
    const dir = current === -1 ? 1 : ((i - current + N) % N) <= N / 2 ? 1 : -1;
    current = i;
    const f = FLAVOURS[i];
    wedges.forEach((w, k) => {
      const [dx, dy] = pol(k === i ? PULL : 0, k * STEP + STEP / 2);
      gsap.to($(".wedge__inner", w), { x: dx, y: dy, scale: k === i ? 1.04 : 1, transformOrigin: "50% 50%", duration: reduced ? 0 : 0.5, ease: "back.out(2)", overwrite: true });
      w.setAttribute("aria-pressed", String(k === i));
    });
    const idx = $("[data-w-index]", sec);
    idx.textContent = String(i + 1).padStart(2, "0");
    if (!reduced) gsap.fromTo(idx, { yPercent: 60 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
    const nameEl = $("[data-w-name]", sec);
    split?.revert();
    nameEl.textContent = f.name;
    if (!reduced) {
      split = SplitText.create(nameEl, { type: "words,chars", wordsClass: "word", charsClass: "char", mask: "chars" });
      gsap.from(split.chars, { yPercent: 105 * dir, duration: 0.6, stagger: 0.016, ease: "expo.out" });
    }
    swap("[data-w-tagline]", f.tagline);
    swap("[data-w-price]", `$${f.price}`);
    swap("[data-w-notes]", f.notes);
    swap("[data-w-allergens]", f.allergens);
  };
  const setRot = (r) => {
    state.rot = r;
    gsap.set(rotor, { rotation: r, svgOrigin: "0 0" });
    const i = indexFor(r);
    if (i !== current) select(i);
  };

  /* ---------------- Box of four ---------------- */
  const pie = $("[data-w-pie]", sec);
  const toastEl = document.querySelector("[data-toast]");
  let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("is-on"), 2400); };
  const renderBox = (popLast) => {
    $$(".box__slice", pie).forEach((n) => n.remove());
    box.forEach((i, k) => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("class", "box__slice");
      p.setAttribute("d", wedgePath(0, 44, -90 + k * 90 + 3, -90 + (k + 1) * 90 - 3));
      p.setAttribute("fill", FLAVOURS[i].base);
      p.setAttribute("stroke", "#2B1611");
      p.setAttribute("stroke-width", "2");
      pie.appendChild(p);
      if (popLast && k === box.length - 1 && !reduced) gsap.from(p, { scale: 0, svgOrigin: "0 0", duration: 0.6, ease: "back.out(3)" });
    });
    $("[data-w-boxtext]", sec).textContent = box.length ? box.map((i) => FLAVOURS[i].name.split(" ").pop()).join(", ") : "Empty box";
  };
  $("[data-w-add]", sec).addEventListener("click", () => {
    if (boxFull()) { toast("Your box of four is ready for checkout"); return; }
    box.push(current);
    renderBox(true);
    // shares the basket counter in the header with the rest of the page
    const cc = document.querySelector("[data-cart-count]");
    if (cc) { cc.textContent = +cc.textContent + 1; if (!reduced) animate(cc, { scale: [1, 1.6, 1] }, { type: spring, stiffness: 500, damping: 12 }); }
    if (!reduced) gsap.fromTo($(".wedge__inner", wedges[current]), { scale: 1.04 }, { keyframes: { scale: [1.04, 0.92, 1.08, 1.04] }, duration: 0.5, ease: "none" });
    toast(`${FLAVOURS[current].name} added · ${4 - box.length ? `${4 - box.length} to go` : "box full!"}`);
    addLabel();
  });
  renderBox();

  /* ---------------- Turning ---------------- */
  const goTo = (i) => {
    i = ((i % N) + N) % N;
    if (st && st.isActive) {
      const p = i / (N - 1);
      window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: reduced ? "auto" : "smooth" });
      return;
    }
    const proxy = { r: state.rot };
    spinTween?.kill();
    spinTween = gsap.to(proxy, { r: targetFor(i, state.rot + (((i - current + N) % N) <= N / 2 ? -1 : 1) * 0.01), duration: reduced ? 0 : 0.8, ease: "power3.inOut", onUpdate: () => setRot(proxy.r) });
  };
  $("[data-w-prev]", sec).addEventListener("click", () => goTo(current - 1));
  $("[data-w-next]", sec).addEventListener("click", () => goTo(current + 1));
  let dragging = false, dragMoved = false, lastA = 0, vel = 0, lastT = 0;
  wedges.forEach((w, k) => {
    w.addEventListener("click", () => { if (!dragMoved) goTo(k); });
    w.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goTo(k); }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); goTo(current - 1); }
    });
  });
  const svg = $("[data-w-svg]", sec);
  const angleAt = (e) => { const r = svg.getBoundingClientRect(); return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI; };
  svg.addEventListener("pointerdown", (e) => { dragging = true; dragMoved = false; lastA = angleAt(e); lastT = performance.now(); vel = 0; svg.setPointerCapture(e.pointerId); spinTween?.kill(); });
  svg.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    let d = angleAt(e) - lastA;
    if (d > 180) d -= 360; if (d < -180) d += 360;
    if (Math.abs(d) > 0.5) dragMoved = true;
    const now = performance.now();
    vel = d / Math.max(1, now - lastT);
    lastA += d; lastT = now;
    setRot(state.rot + d);
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    if (!dragMoved) return;
    const fling = reduced ? 0 : vel * 220;
    const i = indexFor(state.rot + fling);
    setTimeout(() => (dragMoved = false), 50);
    if (st && st.isActive) { goTo(i); return; }
    const proxy = { r: state.rot };
    spinTween = gsap.to(proxy, { r: targetFor(i, state.rot + fling), duration: reduced ? 0 : 0.9, ease: "power3.out", onUpdate: () => setRot(proxy.r) });
  };
  svg.addEventListener("pointerup", release);
  svg.addEventListener("pointercancel", release);
  window.addEventListener("resize", () => { if (!st || !st.isActive) setRot(targetFor(current, state.rot)); });
  setRot(state.rot);

  if (reduced) return;

  /* ---------------- Entrance + scroll spin ---------------- */
  document.fonts.ready.then(() => {
    gsap.from(wedges, { scale: 0, rotation: -40, svgOrigin: "0 0", opacity: 0, duration: 0.9, stagger: 0.07, ease: "back.out(1.6)", scrollTrigger: { trigger: sec, start: "top 70%" } });
    const mm = gsap.matchMedia();
    mm.add("(min-width: 961px)", () => {
      const startRot = targetFor(0, 0);
      const proxy = { r: startRot };
      st = ScrollTrigger.create({
        trigger: sec, start: "top top", end: () => `+=${window.innerHeight * 0.5 * (N - 1)}`, pin: "[data-wheel-pin]",
        snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut", delay: 0.05 },
        onUpdate: (s) => {
          if (dragging) return;
          gsap.to(proxy, { r: startRot - s.progress * (N - 1) * STEP, duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: () => setRot(proxy.r) });
        },
      });
      return () => { st.kill(); st = null; };
    });
    // pins were created in two scripts; put them back in page order before measuring
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
})();
