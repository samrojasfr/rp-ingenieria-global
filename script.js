(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const WA = 'https://wa.me/573192362412';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cop = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  const ease = 'cubic-bezier(.22,1,.36,1)';
  const icon = (k) => $(`[data-${k}]`, $('#icons').content).innerHTML;
  const once = (els, cb, opts) => {
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); cb(e.target); } }), opts);
    els.forEach(el => io.observe(el));
  };
  const anim = (el, from, to, o = {}) => el.animate([from, to], { duration: 700, easing: ease, fill: 'both', ...o });

  /* ---------- Header / fondo ---------- */
  const header = $('.header');
  const bg = $('.background-photo');
  const onScroll = () => {
    header.classList.toggle('header-scrolled', scrollY > 32);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (!reduce) bg.style.transform = `translateY(${(max > 0 ? scrollY / max : 0) * 12}%)`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Navegación activa ---------- */
  const navLinks = $$('.nav-link');
  const mobLinks = $$('.mobile-nav a');
  let active = 'inicio';
  const setActive = (id) => {
    active = id;
    navLinks.forEach(a => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      a.textContent = on ? `[ ${a.dataset.label} ]` : a.dataset.label;
    });
    mobLinks.forEach(a => {
      const on = a.getAttribute('href') === '#' + id;
      a.lastChild.textContent = on ? `[ ${a.dataset.label} ]` : a.dataset.label;
    });
  };
  const spy = new IntersectionObserver((es) => {
    const t = es.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (t && t.target.id) setActive(t.target.id);
  }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .1, .25] });
  $$('[data-nav-section]').forEach(s => spy.observe(s));

  /* ---------- Menú móvil ---------- */
  const menu = $('.mobile-menu');
  const lockScroll = () => { document.body.style.overflow = (!menu.hidden || !drawer.hidden) ? 'hidden' : ''; };
  $('[data-open-menu]').addEventListener('click', () => {
    menu.hidden = false; lockScroll();
    anim(menu, { clipPath: 'circle(0% at 91% 6%)' }, { clipPath: 'circle(150% at 91% 6%)' }, { duration: 650, easing: 'cubic-bezier(.76,0,.24,1)' });
  });
  const closeMenu = () => {
    const a = anim(menu, { clipPath: 'circle(150% at 91% 6%)' }, { clipPath: 'circle(0% at 91% 6%)' }, { duration: 500, easing: 'cubic-bezier(.76,0,.24,1)' });
    a.onfinish = () => { menu.hidden = true; lockScroll(); };
  };
  $('[data-close-menu]').addEventListener('click', closeMenu);
  mobLinks.forEach(a => a.addEventListener('click', () => { setActive(a.getAttribute('href').slice(1)); closeMenu(); }));

  /* ---------- Título del hero (letra por letra) ---------- */
  const h1 = $('.hero-title');
  const words = h1.dataset.text.split(' ');
  h1.textContent = '';
  words.forEach((w, t) => {
    const word = document.createElement('span');
    word.className = 'word'; word.setAttribute('aria-hidden', 'true');
    [...w].forEach((ch, n) => {
      const mask = document.createElement('span'); mask.className = 'letter-mask';
      const l = document.createElement('span'); if (t === 2) l.className = 'accent-letter'; l.textContent = ch;
      mask.appendChild(l); word.appendChild(mask);
      if (!reduce) anim(l, { transform: 'translateY(110%) rotate(4deg)' }, { transform: 'translateY(0) rotate(0)' }, { duration: 720, delay: 580 + (t * 7 + n) * 35 });
    });
    h1.appendChild(word);
  });

  /* ---------- Entradas animadas ---------- */
  if (!reduce) {
    anim($('.header'), { transform: 'translateY(-100px)' }, { transform: 'translateY(0)' }, { duration: 750 });
    anim($('.eyebrow'), { opacity: 0, transform: 'translateX(-30px)' }, { opacity: 1, transform: 'none' }, { delay: 450 });
    anim($('.hero-intro'), { opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }, { delay: 1050 });
    anim($('.edition-stamp'), { opacity: 0, transform: 'scale(.7) rotate(-18deg)' }, { opacity: 1, transform: 'scale(1) rotate(-8deg)' }, { delay: 1350, duration: 900 });
    $$('.social-rail a').forEach((a, i) => anim(a, { opacity: 0, transform: 'translateX(-20px)' }, { opacity: 1, transform: 'none' }, { delay: 700 + i * 80 }));
    $$('.stat').forEach(s => anim(s, { opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }, { delay: 1250 }));
    // Máscaras de títulos
    // Se observa el contenedor (la máscara), no el h2, porque el h2 queda recortado fuera de la máscara
    $$('.section-title-mask h2, .calculator-title-mask h2').forEach(h => h.style.transform = 'translateY(110%)');
    once($$('.section-title-mask, .calculator-title-mask'), m => anim($('h2', m), { transform: 'translateY(110%) rotate(2deg)' }, { transform: 'translateY(0) rotate(0)' }, { duration: 900 }), { threshold: .5 });
    // Elementos que aparecen al hacer scroll
    const reveal = (sel, from, o = {}) => once($$(sel), el => anim(el, from, { opacity: 1, transform: 'none' }, o), { threshold: .2 });
    const hide = (sel, from) => $$(sel).forEach(el => { el.style.opacity = 0; });
    ['.section-kicker', '.products-heading p', '.product-filters', '.about-copy article', '.contact-form', '.contact-aside', '.calculator-shell'].forEach(s => hide(s));
    reveal('.section-kicker', { opacity: 0, transform: 'translateX(-30px)' });
    reveal('.products-heading p', { opacity: 0, transform: 'translateY(20px)' }, { delay: 200 });
    reveal('.product-filters', { opacity: 0, transform: 'translateY(20px)' }, { delay: 250 });
    reveal('.about-copy article', { opacity: 0, transform: 'translateY(35px)' });
    reveal('.contact-form', { opacity: 0, transform: 'translateX(-40px)' });
    reveal('.contact-aside', { opacity: 0, transform: 'translateX(40px)' }, { delay: 100 });
    reveal('.calculator-shell', { opacity: 0, transform: 'translateY(50px)' }, { duration: 800 });
    const cards = (els) => once(els, el => anim(el, { opacity: 0, transform: 'translateY(55px) scale(.96)' }, { opacity: 1, transform: 'none' }, { duration: 650, delay: (+el.dataset.i || 0) * 100 }), { threshold: .08 });
    $$('.product-card').forEach((c, i) => { c.dataset.i = i % 3; c.style.opacity = 0; });
    cards($$('.product-card'));
    $$('.about-benefits article').forEach((a, i) => { a.style.opacity = 0; a.dataset.i = i; });
    once($$('.about-benefits article'), el => anim(el, { opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }, { delay: (+el.dataset.i) * 120, duration: 650 }), { threshold: .25 });

    // Sol, partículas, marquee
    $('.sun-orb').animate([
      { transform: 'translate(-15vw, 8vh)' }, { transform: 'translate(50vw, 32vh)' }, { transform: 'translate(115vw, 15vh)' }
    ], { duration: 24000, iterations: Infinity, easing: 'linear' });
    $('.sun-ray').animate([{ transform: 'scale(.9)', opacity: .22 }, { transform: 'scale(1.16)', opacity: .5 }, { transform: 'scale(.9)', opacity: .22 }], { duration: 3000, iterations: Infinity });
    $$('.light-particle').forEach(p => p.animate([
      { transform: 'translateY(0) scale(1)', opacity: .15 }, { transform: 'translateY(-24px) scale(1.8)', opacity: .95 }, { transform: 'translateY(0) scale(1)', opacity: .15 }
    ], { duration: 4500, delay: +p.dataset.delay * 1000, iterations: Infinity }));
    $('.marquee-track').animate([{ transform: 'translateX(0%)' }, { transform: 'translateX(-50%)' }], { duration: 18000, iterations: Infinity, easing: 'linear' });
    $('.scroll-cue div').animate([{ transform: 'translateY(0)' }, { transform: 'translateY(8px)' }, { transform: 'translateY(0)' }], { duration: 1400, iterations: Infinity });
    $('.whatsapp-float').animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 2000, iterations: Infinity });
  }

  /* ---------- Contadores ---------- */
  once($$('[data-count]'), el => {
    const end = +el.dataset.count, pre = el.dataset.prefix, suf = el.dataset.suffix, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1800), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + v + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    if (!reduce) requestAnimationFrame(tick);
  }, { threshold: .5 });

  /* ---------- Filtros de productos ---------- */
  const filters = $$('.product-filters button');
  const productCards = $$('.product-card');
  filters.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach(b => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
      $('.filter-background', b)?.remove();
      $('span:last-child', b)?.remove();
      if (on) { const bgs = document.createElement('span'); bgs.className = 'filter-background'; b.appendChild(bgs); }
      const label = document.createElement('span'); label.textContent = on ? `[ ${b.dataset.filter} ]` : b.dataset.filter; b.appendChild(label);
    });
    let n = 0;
    productCards.forEach(c => {
      const show = f === 'TODOS' || c.dataset.category === f;
      c.hidden = !show;
      if (show) { n++; if (!reduce) anim(c, { opacity: 0, transform: 'translateY(40px) scale(.96)' }, { opacity: 1, transform: 'none' }, { duration: 600, delay: n * 70 }); }
    });
    $('[data-products-count]').textContent = `${String(n).padStart(2, '0')} PRODUCTOS`;
  }));

  // Enlaces de WhatsApp por producto
  productCards.forEach(c => {
    const msg = `Hola, quiero pedir ${c.dataset.name} por ${cop(+c.dataset.price)}. ¿Me pueden dar más información?`;
    $('[data-wa-product]', c).href = `${WA}?text=${encodeURIComponent(msg)}`;
  });

  /* ---------- Cotizador ---------- */
  const drawer = $('.quote-drawer');
  const backdrop = $('.quote-backdrop');
  const itemsBox = $('.quote-items');
  const waBtn = $('[data-quote-wa]');
  let cart = [];
  const openCart = () => {
    drawer.hidden = false; backdrop.hidden = false; lockScroll();
    anim(drawer, { transform: 'translateX(100%)' }, { transform: 'translateX(0)' }, { duration: 450 });
    anim(backdrop, { opacity: 0 }, { opacity: 1 }, { duration: 300 });
  };
  const closeCart = () => {
    anim(backdrop, { opacity: 1 }, { opacity: 0 }, { duration: 250 });
    const a = anim(drawer, { transform: 'translateX(0)' }, { transform: 'translateX(100%)' }, { duration: 350 });
    a.onfinish = () => { drawer.hidden = true; backdrop.hidden = true; lockScroll(); };
  };
  $$('[data-open-cart]').forEach(b => b.addEventListener('click', openCart));
  $$('[data-close-cart]').forEach(b => b.addEventListener('click', closeCart));

  const renderCart = () => {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    $('[data-cart-count]').textContent = count;
    $('.cart-toggle').setAttribute('aria-label', `Abrir cotizador, ${count} productos`);
    $('[data-quote-title]').textContent = `COTIZADOR / ${String(cart.length).padStart(2, '0')}`;
    $('[data-quote-total]').textContent = cop(total);
    itemsBox.innerHTML = '';
    if (!cart.length) {
      itemsBox.innerHTML = `<div class="quote-empty">${icon('cart')}<strong>TU COTIZACIÓN ESTÁ VACÍA</strong><p>Agrega productos del catálogo para empezar.</p><button type="button">EXPLORAR PRODUCTOS →</button></div>`;
      $('button', itemsBox).addEventListener('click', closeCart);
    }
    cart.forEach(i => {
      const el = document.createElement('article');
      el.className = 'quote-item';
      el.innerHTML = `<img src="${i.image}" alt=""><div class="quote-item-info"><span>${i.power}</span><h3>${i.name}</h3><strong>${cop(i.price * i.qty)}</strong>
        <div class="quantity-control"><button type="button" data-d="-1" aria-label="Restar una unidad de ${i.name}">${icon('minus')}</button><span>${i.qty}</span><button type="button" data-d="1" aria-label="Sumar una unidad de ${i.name}">${icon('plus')}</button></div></div>
        <button type="button" class="quote-remove" aria-label="Eliminar ${i.name}">${icon('trash')}</button>`;
      $$('[data-d]', el).forEach(b => b.addEventListener('click', () => { i.qty += +b.dataset.d; cart = cart.filter(x => x.qty > 0); renderCart(); }));
      $('.quote-remove', el).addEventListener('click', () => { cart = cart.filter(x => x.id !== i.id); renderCart(); });
      itemsBox.appendChild(el);
    });
    if (cart.length) {
      const msg = ['Hola, quiero solicitar una cotización:', '', ...cart.map(i => `• ${i.qty} x ${i.name} — ${cop(i.price * i.qty)}`), '', `TOTAL ESTIMADO: ${cop(total)}`, '', 'Quedo atento a la asesoría.'].join('\n');
      waBtn.href = `${WA}?text=${encodeURIComponent(msg)}`;
      waBtn.classList.remove('is-disabled'); waBtn.setAttribute('aria-disabled', 'false');
    } else {
      waBtn.removeAttribute('href'); waBtn.classList.add('is-disabled'); waBtn.setAttribute('aria-disabled', 'true');
    }
  };
  productCards.forEach(c => $('[data-add]', c).addEventListener('click', () => {
    const id = +c.dataset.id, found = cart.find(i => i.id === id);
    if (found) found.qty++;
    else cart.push({ id, name: c.dataset.name, price: +c.dataset.price, power: c.dataset.power, image: c.dataset.image, qty: 1 });
    renderCart(); openCart();
  }));
  renderCart();
  addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) closeCart(); });

  /* ---------- Simulador ---------- */
  const bill = $('#monthly-bill'), range = $('#bill-range');
  let eff = .78, city = 'Bogotá';
  const calc = (v) => {
    const e = Math.min(5e6, Math.max(1e5, v || 1e5));
    const month = Math.round(e * eff), year = month * 12;
    const panels = Math.max(2, Math.ceil(e / 135000));
    const roi = Math.max(3.2, Math.min(6.8, 6.4 - eff * 2.2 - e / 2.5e6));
    $('#r-month').textContent = cop(month);
    $('#r-year').textContent = cop(year);
    $('#r-panels').textContent = panels;
    $('#r-roi').textContent = roi.toFixed(1).replace('.', ',');
    const msg = ['Hola, quiero recibir una cotización solar personalizada.', '', `Ciudad: ${city}`, `Factura mensual: ${cop(e)}`, `Ahorro mensual estimado: ${cop(month)}`, `Ahorro anual estimado: ${cop(year)}`, `Paneles recomendados: ${panels}`, `Retorno estimado: ${roi.toFixed(1)} años`].join('\n');
    $('#r-wa').href = `${WA}?text=${encodeURIComponent(msg)}`;
    const pct = (e - 1e5) / 4.9e6 * 100;
    range.style.setProperty('--range-progress', pct + '%');
  };
  bill.addEventListener('input', () => { range.value = bill.value; calc(+bill.value); });
  range.addEventListener('input', () => { bill.value = range.value; calc(+range.value); });
  $$('.city-options button').forEach(b => b.addEventListener('click', () => {
    $$('.city-options button').forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', x === b); });
    eff = +b.dataset.eff; city = b.dataset.city; calc(+bill.value);
  }));
  calc(+bill.value);

  /* ---------- Formulario de contacto ---------- */
  const form = $('.contact-form');
  const setErr = (name, msg) => {
    const f = form.elements[name], s = f.parentElement.querySelector('small');
    s.textContent = msg || ''; s.hidden = !msg; f.setAttribute('aria-invalid', !!msg);
  };
  ['name', 'city', 'phone', 'project', 'message'].forEach(n => {
    form.elements[n].addEventListener('input', () => { if (n !== 'message') setErr(n, ''); $('.form-success').hidden = true; });
  });
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const v = Object.fromEntries(new FormData(form));
    const err = {};
    if (!v.name.trim()) err.name = 'Ingresa tu nombre.';
    if (!v.city.trim()) err.city = 'Ingresa tu ciudad.';
    if (!/^[+\d\s()-]{7,}$/.test(v.phone.trim())) err.phone = 'Ingresa un teléfono válido.';
    if (!v.project) err.project = 'Selecciona el tipo de proyecto.';
    ['name', 'city', 'phone', 'project'].forEach(n => setErr(n, err[n]));
    if (Object.keys(err).length) return;
    const msg = ['Hola, quiero solicitar una asesoría solar.', '', `Nombre: ${v.name}`, `Ciudad: ${v.city}`, `Teléfono: ${v.phone}`, `Tipo de proyecto: ${v.project}`, `Mensaje: ${v.message || 'Sin mensaje adicional'}`].join('\n');
    window.open(`${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    $('.form-success').hidden = false;
  });
})();
