/* ==========================================================================
   Suplavia — institutional site interactions
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Sticky header + floating button ---------- */
  var header = document.getElementById("site-header");
  var fab = document.getElementById("fab");
  var landingHero = document.querySelector(".hero"); // só existe na home
  function onScroll() {
    var y = window.scrollY;
    if (y > 20) header.classList.add("scrolled");
    else if (landingHero) header.classList.remove("scrolled");

    if (fab) {
      // Home: aparece após sair do hero. Subpáginas: sempre visível.
      if (!landingHero || y > 500) fab.classList.add("show");
      else fab.classList.remove("show");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("mobile-menu");

  function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  }
  function openMenu() {
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
  }
  toggle.addEventListener("click", function () {
    if (menu.hidden) openMenu();
    else closeMenu();
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeMenu();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 980) closeMenu();
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Scroll-spy (active nav link) ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var spyTargets = navLinks
    .map(function (a) {
      var id = a.getAttribute("href");
      var sec = id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      return sec ? { link: a, sec: sec } : null;
    })
    .filter(Boolean);

  if (spyTargets.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("active"); });
            var match = spyTargets.filter(function (t) { return t.sec === entry.target; })[0];
            if (match) match.link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    spyTargets.forEach(function (t) { spy.observe(t.sec); });
  }

  /* ---------- Contact form ----------
     Para receber os leads num painel/e-mail sem depender do visitante, crie um
     formulário grátis em https://formspree.io e cole o endpoint abaixo, ex.:
       var FORMSPREE_ENDPOINT = "https://formspree.io/f/xxxxxxx";
     Enquanto estiver vazio, o envio abre o e-mail do visitante (fallback mailto). */
  var FORMSPREE_ENDPOINT = "";

  var form = document.getElementById("contact-form");
  if (form) {
    var note = document.getElementById("form-note");
    var DEST = "atendimento@suplavia.com.br";
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim();
      var empresa = form.empresa.value.trim();
      var email = form.email.value.trim();
      var telefone = form.telefone.value.trim();
      var mensagem = form.mensagem.value.trim();

      // Reset validation state
      [form.nome, form.email].forEach(function (f) { f.classList.remove("invalid"); });

      var errors = [];
      if (!nome) { form.nome.classList.add("invalid"); errors.push("nome"); }
      if (!emailRe.test(email)) { form.email.classList.add("invalid"); errors.push("e-mail"); }

      if (errors.length) {
        note.textContent = "Por favor, preencha corretamente: " + errors.join(" e ") + ".";
        note.className = "form-note err";
        (errors[0] === "nome" ? form.nome : form.email).focus();
        return;
      }

      var payload = {
        nome: nome,
        empresa: empresa,
        email: email,
        telefone: telefone,
        mensagem: mensagem,
        _subject: "Contato pelo site — " + (empresa || nome)
      };

      if (FORMSPREE_ENDPOINT) {
        // Envio real via Formspree (sem sair da página)
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; }
        note.textContent = "Enviando…";
        note.className = "form-note";

        fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            if (!res.ok) throw new Error("bad status");
            form.reset();
            note.textContent = "Mensagem enviada! Em breve um especialista retorna o contato.";
            note.className = "form-note ok";
          })
          .catch(function () {
            note.innerHTML = "Não foi possível enviar agora. Fale pelo WhatsApp " +
              '<a href="https://wa.me/5521996921453" target="_blank" rel="noopener">(21) 99692-1453</a> ' +
              "ou e-mail <a href=\"mailto:" + DEST + "\">" + DEST + "</a>.";
            note.className = "form-note err";
          })
          .then(function () { if (btn) { btn.disabled = false; } });
      } else {
        // Fallback: compõe um e-mail no app do visitante
        var lines = [
          "Nome: " + nome,
          empresa ? "Empresa: " + empresa : null,
          "E-mail: " + email,
          telefone ? "Telefone: " + telefone : null,
          "",
          mensagem || "(sem mensagem)"
        ].filter(function (l) { return l !== null; });

        window.location.href =
          "mailto:" + DEST +
          "?subject=" + encodeURIComponent(payload._subject) +
          "&body=" + encodeURIComponent(lines.join("\n"));
        note.textContent = "Abrindo seu aplicativo de e-mail com a mensagem pronta…";
        note.className = "form-note ok";
      }
    });
  }

  /* ---------- Hero network canvas ---------- */
  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var canvas = document.getElementById("net-canvas");
  if (canvas && !prefersReduced) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [];
    var W = 0, H = 0;
    var raf = null;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    }

    function buildNodes() {
      // density scales with area, capped for performance
      var count = Math.min(72, Math.floor((W * H) / 20000));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.6 + 0.6,
        });
      }
    }

    var LINK = 140; // link distance

    function tick() {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      // links
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = nodes[a].x - nodes[b].x;
          var dy = nodes[a].y - nodes[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK) {
            var op = (1 - dist / LINK) * 0.4;
            ctx.strokeStyle = "rgba(46,155,255," + op + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (var k = 0; k < nodes.length; k++) {
        var p = nodes[k];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(18,224,212,0.9)";
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    // Pause when hero is off-screen to save cycles
    var hero = document.getElementById("hero");
    if ("IntersectionObserver" in window && hero) {
      var heroObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            if (!raf) raf = requestAnimationFrame(tick);
          } else if (raf) {
            cancelAnimationFrame(raf);
            raf = null;
          }
        });
      }, { threshold: 0 });
      heroObs.observe(hero);
    }

    resize();
    raf = requestAnimationFrame(tick);
  }

  /* ---------- Footer year (defensive; content is 2026) ---------- */
})();
