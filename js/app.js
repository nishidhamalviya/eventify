/* ==========================================================
   Eventify – Application logic (vanilla JavaScript)
   Modules: helpers, state, rendering, filtering, modals,
   validation, registration (Local Storage), theme, UI effects
   ========================================================== */
(function () {
  "use strict";

  /* ---------- Constants & state ---------- */
  const STORAGE_KEY = "eventify-registrations";
  const THEME_KEY = "eventify-theme";
  const MAX_TICKETS = 5;

  const state = {
    category: "All",
    query: "",
    sort: "date",
    lastFocus: null
  };

  /* ---------- DOM helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const els = {
    header: $("#header"),
    menuBtn: $("#menuBtn"),
    navLinks: $("#navLinks"),
    themeToggle: $("#themeToggle"),
    nextCard: $("#nextEventCard"),
    featuredGrid: $("#featuredGrid"),
    eventsGrid: $("#eventsGrid"),
    filters: $("#filters"),
    search: $("#searchInput"),
    sort: $("#sortSelect"),
    count: $("#resultCount"),
    empty: $("#emptyState"),
    clear: $("#clearFilters"),
    regList: $("#regList"),
    regBadge: $("#regBadge"),
    detailModal: $("#detailModal"),
    detailContent: $("#detailContent"),
    regModal: $("#regModal"),
    regFormWrap: $("#regFormWrap"),
    regSuccess: $("#regSuccess"),
    regForm: $("#regForm"),
    regEvent: $("#regEvent"),
    successMsg: $("#successMsg"),
    ticketBox: $("#ticketBox"),
    successDone: $("#successDone"),
    toast: $("#toast"),
    toTop: $("#toTop")
  };

  /* ---------- Utility functions ---------- */
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  const eventById = (id) => EVENTS.find((e) => e.id === Number(id));
  const isPast = (ev) => new Date(ev.date).getTime() <= Date.now();

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }
  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  }
  function formatPrice(p) {
    return p === 0 ? "Free" : "₹" + p.toLocaleString("en-IN");
  }

  let toastTimer;
  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 3000);
  }

  /* ---------- Local Storage (registrations) ---------- */
  function loadRegistrations() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }
  function saveRegistrations(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }
  function seatsLeft(ev) {
    const booked = loadRegistrations()
      .filter((r) => r.eventId === ev.id)
      .reduce((sum, r) => sum + r.tickets, 0);
    return Math.max(ev.seats - booked, 0);
  }
  function isRegistered(ev) {
    return loadRegistrations().some((r) => r.eventId === ev.id);
  }

  /* ---------- Rendering: cover images with graceful fallback ---------- */
  function coverMarkup(ev) {
    // If the remote image fails, the gradient + emoji underneath remains visible
    return `<img src="${ev.image}" alt="${escapeHTML(ev.title)}" loading="lazy" onerror="this.remove()" />`;
  }

  function cardTemplate(ev, index) {
    const left = seatsLeft(ev);
    const past = isPast(ev);
    const soldOut = left === 0;
    let btnLabel = "Register";
    if (past) btnLabel = "Event ended";
    else if (soldOut) btnLabel = "Sold out";

    return `
    <article class="card ${isRegistered(ev) ? "registered" : ""}" style="animation-delay:${Math.min(index * 60, 400)}ms" data-id="${ev.id}">
      <div class="card-img" style="background:${ev.gradient}">
        <span aria-hidden="true">${ev.emoji}</span>
        ${coverMarkup(ev)}
        <span class="cat">${escapeHTML(ev.category)}</span>
        <span class="price ${ev.price === 0 ? "free" : ""}">${formatPrice(ev.price)}</span>
      </div>
      <div class="card-body">
        <h3>${escapeHTML(ev.title)}</h3>
        <ul class="card-meta">
          <li>📅 <span>${formatDate(ev.date)} · ${formatTime(ev.date)}</span></li>
          <li>📍 <span>${escapeHTML(ev.venue)}, ${escapeHTML(ev.city)}</span></li>
          <li class="seats ${left < 30 ? "low" : ""}">🎟️ ${past ? "Closed" : left === 0 ? "No seats left" : left + " seats left"}</li>
        </ul>
        <p class="card-desc">${escapeHTML(ev.short)}</p>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" data-action="details" data-id="${ev.id}">View details</button>
          <button class="btn btn-primary btn-sm" data-action="register" data-id="${ev.id}" ${past || soldOut ? "disabled" : ""}>${btnLabel}</button>
        </div>
      </div>
    </article>`;
  }

  function renderFeatured() {
    const featured = EVENTS.filter((e) => e.featured && !isPast(e)).sort((a, b) => new Date(a.date) - new Date(b.date));
    els.featuredGrid.innerHTML = featured.map(cardTemplate).join("");
  }

  function getFilteredEvents() {
    const q = state.query.trim().toLowerCase();
    let list = EVENTS.filter((ev) => {
      const matchCat = state.category === "All" || ev.category === state.category;
      const haystack = [ev.title, ev.venue, ev.city, ev.category, ev.short].join(" ").toLowerCase();
      return matchCat && (!q || haystack.includes(q));
    });

    switch (state.sort) {
      case "date-desc": list.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case "price": list.sort((a, b) => a.price - b.price); break;
      case "name": list.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: list.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return list;
  }

  function renderEvents() {
    const list = getFilteredEvents();
    els.eventsGrid.innerHTML = list.map(cardTemplate).join("");
    els.empty.hidden = list.length > 0;
    els.count.textContent = list.length === 0 ? "" : `Showing ${list.length} of ${EVENTS.length} events`;
  }

  function renderFilters() {
    const cats = ["All", ...new Set(EVENTS.map((e) => e.category))];
    els.filters.innerHTML = cats
      .map((c) => `<button class="chip ${c === state.category ? "active" : ""}" role="tab" aria-selected="${c === state.category}" data-cat="${c}">${c}</button>`)
      .join("");
  }

  function renderRegistrations() {
    const regs = loadRegistrations();
    els.regBadge.textContent = regs.length;
    els.regBadge.hidden = regs.length === 0;

    if (regs.length === 0) {
      els.regList.innerHTML = `<div class="reg-empty">You haven't registered for any events yet. Pick one above to get started! 🎟️</div>`;
      return;
    }
    els.regList.innerHTML = regs
      .slice()
      .reverse()
      .map((r) => {
        const ev = eventById(r.eventId);
        return `
        <div class="reg-item">
          <div>
            <h4>${escapeHTML(ev ? ev.title : "Event")}</h4>
            <p>${escapeHTML(r.name)} · ${r.tickets} ticket${r.tickets > 1 ? "s" : ""} · ${ev ? formatDate(ev.date) : ""}</p>
            <p>Booking ID: <span class="reg-id">${escapeHTML(r.id)}</span></p>
          </div>
          <button class="btn btn-danger-ghost btn-sm" data-action="cancel" data-reg="${escapeHTML(r.id)}">Cancel</button>
        </div>`;
      })
      .join("");
  }

  function refreshAll() {
    renderFeatured();
    renderEvents();
    renderRegistrations();
    renderNextEvent();
  }

  /* ---------- Hero: next event with live countdown ---------- */
  function getNextEvent() {
    return EVENTS.filter((e) => !isPast(e)).sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  }

  function countdownParts(iso) {
    const diff = Math.max(new Date(iso).getTime() - Date.now(), 0);
    return {
      diff,
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000)
    };
  }
  const pad = (n) => String(n).padStart(2, "0");

  function countdownMarkup(iso) {
    const t = countdownParts(iso);
    if (t.diff === 0) return `<p class="cd-live">🔴 Happening now!</p>`;
    return `
      <div class="countdown" data-countdown="${iso}" aria-label="Countdown to event">
        <div class="cd-box"><strong data-u="d">${pad(t.d)}</strong><span>Days</span></div>
        <div class="cd-box"><strong data-u="h">${pad(t.h)}</strong><span>Hours</span></div>
        <div class="cd-box"><strong data-u="m">${pad(t.m)}</strong><span>Mins</span></div>
        <div class="cd-box"><strong data-u="s">${pad(t.s)}</strong><span>Secs</span></div>
      </div>`;
  }

  function renderNextEvent() {
    const ev = getNextEvent();
    if (!ev) {
      els.nextCard.innerHTML = `<div class="hc-body"><h3>No upcoming events</h3><p class="meta">Check back soon!</p></div>`;
      return;
    }
    els.nextCard.innerHTML = `
      <div class="hc-cover" style="background:${ev.gradient}">
        <span aria-hidden="true">${ev.emoji}</span>
        ${coverMarkup(ev)}
        <span class="hc-tag">⏳ Next up</span>
      </div>
      <div class="hc-body">
        <h3>${escapeHTML(ev.title)}</h3>
        <p class="meta">📅 ${formatDate(ev.date)} · 📍 ${escapeHTML(ev.city)}</p>
        ${countdownMarkup(ev.date)}
        <button class="btn btn-primary btn-block" data-action="details" data-id="${ev.id}">View details</button>
      </div>`;
  }

  function tickCountdowns() {
    $$("[data-countdown]").forEach((box) => {
      const t = countdownParts(box.dataset.countdown);
      const set = (u, v) => { const n = $(`[data-u="${u}"]`, box); if (n) n.textContent = pad(v); };
      set("d", t.d); set("h", t.h); set("m", t.m); set("s", t.s);
    });
  }

  /* ---------- Modals ---------- */
  function openModal(modal) {
    state.lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    const first = $("button, input, select", modal.querySelector(".modal-panel"));
    setTimeout(() => first && first.focus(), 50);
  }
  function closeModal(modal) {
    modal.hidden = true;
    if ($$(".modal").every((m) => m.hidden)) document.body.classList.remove("no-scroll");
    if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
  }

  function openDetails(id) {
    const ev = eventById(id);
    if (!ev) return;
    const left = seatsLeft(ev);
    const past = isPast(ev);
    const disabled = past || left === 0;

    els.detailContent.innerHTML = `
      <div class="d-cover" style="background:${ev.gradient}">
        <span aria-hidden="true">${ev.emoji}</span>
        ${coverMarkup(ev)}
        <div class="d-title">
          <span class="cat">${escapeHTML(ev.category)}</span>
          <h2 id="detailTitle">${escapeHTML(ev.title)}</h2>
        </div>
      </div>
      <div class="d-body">
        <div class="d-info">
          <div><small>Date</small><strong>${formatDate(ev.date)}</strong></div>
          <div><small>Time</small><strong>${formatTime(ev.date)}</strong></div>
          <div><small>Venue</small><strong>${escapeHTML(ev.venue)}, ${escapeHTML(ev.city)}</strong></div>
          <div><small>Price</small><strong>${formatPrice(ev.price)}</strong></div>
          <div><small>Seats left</small><strong>${past ? "—" : left + " / " + ev.seats}</strong></div>
        </div>
        ${past ? `<p class="cd-live" style="color:var(--muted)">This event has ended.</p>` : countdownMarkup(ev.date)}
        <div>
          <h4>About this event</h4>
          <p>${escapeHTML(ev.description)}</p>
        </div>
        <div>
          <h4>Schedule</h4>
          <ul class="timeline">${ev.schedule.map((s) => `<li>${escapeHTML(s)}</li>`).join("")}</ul>
        </div>
        <button class="btn btn-primary btn-block" data-action="register" data-id="${ev.id}" ${disabled ? "disabled" : ""}>
          ${past ? "Event ended" : left === 0 ? "Sold out" : "Register now"}
        </button>
      </div>`;
    openModal(els.detailModal);
  }

  function openRegister(id) {
    // Populate the event dropdown with all open events
    const open = EVENTS.filter((e) => !isPast(e) && seatsLeft(e) > 0);
    els.regEvent.innerHTML =
      `<option value="">-- Select an event --</option>` +
      open.map((e) => `<option value="${e.id}">${escapeHTML(e.title)} (${formatDate(e.date)})</option>`).join("");
    if (id) els.regEvent.value = String(id);

    els.regForm.reset();
    if (id) els.regEvent.value = String(id);
    $$(".field").forEach((f) => f.classList.remove("valid", "invalid"));
    $$(".error").forEach((e) => (e.textContent = ""));
    els.regFormWrap.hidden = false;
    els.regSuccess.hidden = true;

    closeModal(els.detailModal);
    openModal(els.regModal);
  }

  /* ---------- Form validation ---------- */
  const validators = {
    event(v) {
      if (!v) return "Please select an event.";
      const ev = eventById(v);
      if (!ev || isPast(ev)) return "This event is no longer available.";
      return "";
    },
    name(v) {
      v = v.trim();
      if (!v) return "Full name is required.";
      if (v.length < 3) return "Name must be at least 3 characters.";
      if (!/^[A-Za-z][A-Za-z\s.'-]*$/.test(v)) return "Name can only contain letters and spaces.";
      return "";
    },
    email(v) {
      v = v.trim();
      if (!v) return "Email address is required.";
      if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v)) return "Enter a valid email, e.g. you@example.com.";
      return "";
    },
    phone(v) {
      const digits = v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)/, "");
      if (!v.trim()) return "Phone number is required.";
      if (!/^\d+$/.test(digits)) return "Phone number can contain digits only.";
      if (!/^[6-9]\d{9}$/.test(digits)) return "Enter a valid 10-digit Indian mobile number.";
      return "";
    },
    tickets(v) {
      const n = Number(v);
      if (!v) return "Enter the number of tickets.";
      if (!Number.isInteger(n) || n < 1) return "At least 1 ticket is required.";
      if (n > MAX_TICKETS) return `You can book up to ${MAX_TICKETS} tickets at once.`;
      const ev = eventById(els.regEvent.value);
      if (ev && n > seatsLeft(ev)) return `Only ${seatsLeft(ev)} seat(s) left.`;
      return "";
    }
  };

  function setFieldState(name, message) {
    const input = $(`#reg${name.charAt(0).toUpperCase() + name.slice(1)}`);
    const err = $(`#err-${name}`);
    if (!input || !err) return;
    const field = input.closest(".field");
    err.textContent = message;
    field.classList.toggle("invalid", Boolean(message));
    field.classList.toggle("valid", !message && input.value !== "");
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(name) {
    const input = $(`#reg${name.charAt(0).toUpperCase() + name.slice(1)}`);
    const msg = validators[name](input.value);
    setFieldState(name, msg);
    return !msg;
  }

  function validateTerms() {
    const box = $("#regTerms");
    const err = $("#err-terms");
    err.textContent = box.checked ? "" : "You must accept the terms to continue.";
    return box.checked;
  }

  function validateForm() {
    const results = Object.keys(validators).map(validateField);
    results.push(validateTerms());
    return results.every(Boolean);
  }

  /* ---------- Registration submit ---------- */
  function generateBookingId() {
    return "EVT-" + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase();
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      els.regForm.classList.remove("shake");
      void els.regForm.offsetWidth; // restart animation
      els.regForm.classList.add("shake");
      const firstBad = $(".field.invalid input, .field.invalid select", els.regForm);
      if (firstBad) firstBad.focus();
      return;
    }

    const ev = eventById(els.regEvent.value);
    const email = $("#regEmail").value.trim().toLowerCase();
    const regs = loadRegistrations();

    // Prevent duplicate registrations for the same email + event
    if (regs.some((r) => r.eventId === ev.id && r.email === email)) {
      setFieldState("email", "This email is already registered for this event.");
      $("#regEmail").focus();
      return;
    }

    const digits = $("#regPhone").value.replace(/[\s-]/g, "").replace(/^(\+91|91|0)/, "");
    const record = {
      id: generateBookingId(),
      eventId: ev.id,
      name: $("#regName").value.trim().replace(/\s+/g, " "),
      email,
      phone: digits,
      tickets: Number($("#regTickets").value),
      registeredAt: new Date().toISOString()
    };

    regs.push(record);
    if (!saveRegistrations(regs)) {
      showToast("⚠️ Could not save registration (storage unavailable).");
      return;
    }

    // Show confirmation
    const total = ev.price * record.tickets;
    els.successMsg.textContent = `Thanks ${record.name.split(" ")[0]}! Your seat${record.tickets > 1 ? "s are" : " is"} confirmed. A confirmation has been saved to My Registrations.`;
    els.ticketBox.innerHTML = `
      <div><b>Booking ID:</b> <span class="reg-id">${escapeHTML(record.id)}</span></div>
      <div><b>Event:</b> ${escapeHTML(ev.title)}</div>
      <div><b>Date:</b> ${formatDate(ev.date)} · ${formatTime(ev.date)}</div>
      <div><b>Venue:</b> ${escapeHTML(ev.venue)}, ${escapeHTML(ev.city)}</div>
      <div><b>Tickets:</b> ${record.tickets} &nbsp; <b>Total:</b> ${total === 0 ? "Free" : "₹" + total.toLocaleString("en-IN")}</div>`;
    els.regFormWrap.hidden = true;
    els.regSuccess.hidden = false;

    refreshAll();
  }

  function cancelRegistration(regId) {
    const regs = loadRegistrations();
    const next = regs.filter((r) => r.id !== regId);
    if (next.length === regs.length) return;
    if (!window.confirm("Cancel this registration?")) return;
    saveRegistrations(next);
    refreshAll();
    showToast("Registration cancelled.");
  }

  /* ---------- Theme ---------- */
  function toggleTheme() {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
  }

  /* ---------- UI effects ---------- */
  function setupReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      }),
      { threshold: 0.12 }
    );
    items.forEach((i) => io.observe(i));
  }

  function animateCounters() {
    $$("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count);
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased).toLocaleString("en-IN") + (p === 1 ? "+" : "");
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  function setupScrollSpy() {
    const links = $$(".nav-links a");
    const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
    const onScroll = () => {
      els.header.classList.toggle("scrolled", window.scrollY > 10);
      els.toTop.hidden = window.scrollY < 600;
      let current = sections[0];
      sections.forEach((s) => { if (s.getBoundingClientRect().top <= 120) current = s; });
      links.forEach((a) => a.classList.toggle("active", current && a.getAttribute("href") === "#" + current.id));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Event wiring ---------- */
  function bindEvents() {
    // Delegated clicks for cards, detail modal and registrations
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (btn && !btn.disabled) {
        const { action, id, reg } = btn.dataset;
        if (action === "details") openDetails(id);
        if (action === "register") openRegister(id);
        if (action === "cancel") cancelRegistration(reg);
        return;
      }
      if (e.target.closest("[data-close]")) {
        const modal = e.target.closest(".modal");
        if (modal) closeModal(modal);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        $$(".modal").filter((m) => !m.hidden).forEach(closeModal);
        els.navLinks.classList.remove("open");
        els.menuBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Category filter chips
    els.filters.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      state.category = chip.dataset.cat;
      renderFilters();
      renderEvents();
    });

    // Search (debounced)
    let t;
    els.search.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => { state.query = els.search.value; renderEvents(); }, 200);
    });

    els.sort.addEventListener("change", () => { state.sort = els.sort.value; renderEvents(); });

    els.clear.addEventListener("click", () => {
      state.category = "All"; state.query = ""; state.sort = "date";
      els.search.value = ""; els.sort.value = "date";
      renderFilters(); renderEvents();
    });

    // Mobile menu
    els.menuBtn.addEventListener("click", () => {
      const open = els.navLinks.classList.toggle("open");
      els.menuBtn.setAttribute("aria-expanded", String(open));
    });
    els.navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        els.navLinks.classList.remove("open");
        els.menuBtn.setAttribute("aria-expanded", "false");
      }
    });

    els.themeToggle.addEventListener("click", toggleTheme);
    els.toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    // Form: live validation
    els.regForm.addEventListener("submit", handleSubmit);
    ["event", "name", "email", "phone", "tickets"].forEach((f) => {
      const input = $(`#reg${f.charAt(0).toUpperCase() + f.slice(1)}`);
      input.addEventListener("blur", () => validateField(f));
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("invalid")) validateField(f);
      });
    });
    els.regEvent.addEventListener("change", () => { validateField("event"); if ($("#regTickets").value) validateField("tickets"); });
    $("#regTerms").addEventListener("change", validateTerms);

    // Phone: allow only digits, +, spaces and dashes while typing
    $("#regPhone").addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^\d+\s-]/g, "");
    });

    els.successDone.addEventListener("click", () => {
      closeModal(els.regModal);
      $("#my-registrations").scrollIntoView({ behavior: "smooth" });
    });

    // Sync across tabs
    window.addEventListener("storage", (e) => { if (e.key === STORAGE_KEY) refreshAll(); });
  }

  /* ---------- Init ---------- */
  function init() {
    $("#year").textContent = new Date().getFullYear();
    renderFilters();
    refreshAll();
    bindEvents();
    setupReveal();
    setupScrollSpy();
    animateCounters();
    setInterval(tickCountdowns, 1000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
