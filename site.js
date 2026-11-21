/* Charbel's Apps: the swipe deck and the two playable demos. No dependencies, no network calls, nothing stored. */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var wideQuery = window.matchMedia ? window.matchMedia('(min-width: 900px)') : { matches: false };
  var reduced = function () { return reduceQuery.matches; };
  var shuffle = function (a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  var buzz = function (ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* not available */ } };

  /* ------------------------------------------------------------------ deck */
  var deck = $('#deck');
  var stages = $$('.stage', deck);
  var tabs = $$('.tab');
  var current = 0;

  function setActive(i) {
    current = i;
    tabs.forEach(function (t, k) { t.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    stages.forEach(function (s, k) { s.classList.toggle('is-active', wideQuery.matches || k === i); });
  }

  function progress() {
    var max = deck.scrollWidth - deck.clientWidth;
    var p = !wideQuery.matches && max > 0 ? Math.min(1, Math.max(0, deck.scrollLeft / max)) : 0;
    root.style.setProperty('--p', p.toFixed(3));
    var i = p > 0.5 ? 1 : 0;
    if (!wideQuery.matches && i !== current) {
      setActive(i);
      try { history.replaceState(null, '', '#' + stages[i].id); } catch (e) { /* file:// or sandboxed */ }
    }
  }

  function go(i, instant) {
    if (wideQuery.matches) {
      stages[i].scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }
    var left = i * deck.clientWidth;
    if (instant || reduced() || typeof deck.scrollTo !== 'function') deck.scrollLeft = left;
    else deck.scrollTo({ left: left, behavior: 'smooth' });
  }

  var ticking = false;
  deck.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; progress(); });
  }, { passive: true });

  $$('[data-go]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      go(parseInt(el.getAttribute('data-go'), 10));
    });
  });

  tabs.forEach(function (tab, i) {
    tab.addEventListener('keydown', function (e) {
      var to = e.key === 'ArrowRight' ? Math.min(1, i + 1) : e.key === 'ArrowLeft' ? Math.max(0, i - 1) : -1;
      if (to < 0) return;
      e.preventDefault();
      tabs[to].focus();
      go(to);
    });
  });

  function fromHash(instant) {
    var i = stages.map(function (s) { return s.id; }).indexOf(location.hash.slice(1));
    if (i >= 0) { go(i, instant); setActive(i); }
  }
  window.addEventListener('hashchange', function () { fromHash(false); });
  window.addEventListener('resize', function () { if (!wideQuery.matches) deck.scrollLeft = current * deck.clientWidth; setActive(current); });

  setActive(0);
  fromHash(true);
  progress();

  /* ------------------------------------------------------------ Kezbe Bayda */
  (function kezbe() {
    var panel = $('#kb-panel');
    if (!panel) return;
    var opts = $('#kb-opts');
    var blank = $('#kb-blank');
    var result = $('#kb-result');
    var scoreEl = $('#kb-score');
    var scoreBox = scoreEl.parentNode;
    var confetti = $('#kb-confetti');
    var dock = $('.kb .dock');
    var BLANK = '<span class="sr-only">blank</span>';
    var HINT = '<p class="hint">Five friends lied. One answer is true. Tap the one you trust.</p>';
    var score = 0;
    var timer = 0;

    function arrange() { shuffle($$('.opt', opts)).forEach(function (b) { opts.appendChild(b); }); }

    function pick(btn) {
      if (panel.getAttribute('data-state') !== 'ready') return;
      panel.setAttribute('data-state', 'pending');
      btn.classList.add('is-picked');
      blank.textContent = btn.textContent;
      blank.className = 'blank is-guess';
      result.innerHTML = '<p class="hint">Locked in&hellip;</p>';
      buzz(12);
      timer = setTimeout(reveal.bind(null, btn), reduced() ? 250 : 950);
    }

    function reveal(btn) {
      panel.setAttribute('data-state', 'done');
      var truth = btn.getAttribute('data-kind') === 'truth';
      $$('.opt', opts).forEach(function (o) {
        var isTruth = o.getAttribute('data-kind') === 'truth';
        o.classList.add(isTruth ? 'is-truth' : 'is-lie');
        var by = document.createElement('span');
        by.className = 'by';
        by.textContent = isTruth ? 'the truth' : o.getAttribute('data-by') + "'s lie";
        o.appendChild(by);
      });
      blank.textContent = $('.opt.is-truth', opts).firstChild.textContent;
      blank.className = 'blank is-truth';

      var who = btn.getAttribute('data-by');
      result.innerHTML = truth
        ? '<p class="verdict"><span class="tile">+1000</span><span>You found the truth!</span></p>'
        : '<p class="verdict"><span class="tile fooled">Fooled!</span><span>' + who + ' got you: +500 for ' + who + '.</span></p>';
      var again = document.createElement('button');
      again.type = 'button';
      again.className = 'again';
      again.textContent = 'Play again';
      again.addEventListener('click', reset);
      result.appendChild(again);

      if (truth) {
        score += 1000;
        scoreEl.textContent = score;
        scoreBox.classList.remove('bump');
        void scoreBox.offsetWidth;
        scoreBox.classList.add('bump');
        burst();
        buzz([20, 40, 20]);
      } else {
        buzz(40);
      }
      if (dock) dock.classList.add('nudge');
    }

    function reset() {
      clearTimeout(timer);
      panel.setAttribute('data-state', 'ready');
      $$('.opt', opts).forEach(function (o) {
        o.classList.remove('is-picked', 'is-truth', 'is-lie');
        var by = $('.by', o);
        if (by) o.removeChild(by);
      });
      arrange();
      blank.className = 'blank';
      blank.innerHTML = BLANK;
      result.innerHTML = HINT;
    }

    function burst() {
      if (reduced() || !confetti.animate) return;
      var colors = ['#FFC83D', '#FFF1D6', '#9BD64B', '#FF6F91', '#4CC3B5', '#FFE49A'];
      for (var n = 0; n < 30; n++) {
        var bit = document.createElement('i');
        var w = 6 + Math.random() * 6;
        bit.style.cssText = 'left:' + (8 + Math.random() * 84) + '%;width:' + w + 'px;height:' + (w * 1.7) + 'px;background:' + colors[n % colors.length];
        confetti.appendChild(bit);
        var dx = (Math.random() - 0.5) * 220;
        var rot = (Math.random() - 0.5) * 900;
        var anim = bit.animate([
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + dx * 0.6 + 'px,-70px) rotate(' + rot * 0.4 + 'deg)', opacity: 1, offset: 0.25 },
          { transform: 'translate(' + dx + 'px,260px) rotate(' + rot + 'deg)', opacity: 0 }
        ], { duration: 1100 + Math.random() * 700, easing: 'cubic-bezier(.25,.6,.5,1)', fill: 'forwards' });
        anim.onfinish = (function (el) { return function () { if (el.parentNode) el.parentNode.removeChild(el); }; })(bit);
      }
    }

    $$('.opt', opts).forEach(function (b) { b.addEventListener('click', function () { pick(b); }); });
    arrange();
  })();

  /* ---------------------------------------------------------------- Massela */
  (function massela() {
    var phone = $('#ms-phone');
    if (!phone) return;
    var game = phone.parentNode;
    var wrap = $('#ms-wrap');
    var wordEl = $('#ms-word');
    var arEl = $('#ms-ar');
    var catEl = $('#ms-cat');
    var timerEl = $('#ms-timer');
    var countEl = $('#ms-count');
    var flash = $('#ms-flash');
    var done = $('#ms-done');
    var finalEl = $('#ms-final');
    var bar = $('#ms-bar');
    var how = $('#ms-how');
    var live = $('#ms-live');
    var dock = $('.ms .dock');

    // Real entries from the app's packs: category, Lebanese (Latin letters), Arabic.
    var WORDS = [
      ['Animals', '7san', 'حصان'], ['Food & Drinks', 'Be2lewa', 'بقلاوة'], ['Places', 'Baalbak', 'بعلبك'],
      ['Brands', 'Anghami', 'أنغامي'], ['Items', 'Chargeur', 'شارجور'], ['Animals', 'Dalfin', 'دلفين'],
      ['Food & Drinks', 'Battikh', 'بطّيخ'], ['Places', 'Beirut', 'بيروت'], ['Jobs & Titles', 'Dekkanjeh', 'دكّنجي'],
      ['Brands', 'Bonjus', 'بونجوس'], ['Animals', 'Batrik', 'بطريق'], ['Food & Drinks', '7ommos', 'حمّص'],
      ['Sayings', '3anjad', 'عنجد'], ['Items', 'Barrad', 'برّاد'], ['Places', 'Arez', 'أرز'], ['Food & Drinks', 'Bouza', 'بوظة']
    ];
    var ROUND = 30;       // seconds
    var THRESHOLD = 64;   // px of drag that counts as a decision
    var MAX_DRAG = 150;

    var order = [];
    var idx = 0;
    var score = 0;
    var state = 'idle';   // idle | running | done
    var busy = false;
    var deadline = 0;
    var tick = 0;
    var holdTimer = 0;

    function show(i) {
      var w = order[i % order.length];
      catEl.textContent = w[0];
      wordEl.textContent = w[1];
      arEl.textContent = w[2];
    }

    function fmt(ms) {
      var s = Math.ceil(Math.max(0, ms) / 1000);
      return '0:' + (s < 10 ? '0' : '') + s;
    }

    function newRound() {
      clearInterval(tick);
      clearTimeout(holdTimer);
      order = shuffle(WORDS.slice());
      idx = 0; score = 0; state = 'idle'; busy = false;
      countEl.textContent = '0';
      timerEl.textContent = fmt(ROUND * 1000);
      phone.setAttribute('data-state', 'idle');
      phone.removeAttribute('data-low');
      game.removeAttribute('data-run');
      done.hidden = true;
      flash.style.opacity = '0';
      bar.style.transition = 'none';
      bar.style.transform = 'scaleX(1)';
      paint(0);
      show(0);
      how.textContent = 'Drag the card down when you guess it, up to pass. Your ' + ROUND + ' seconds start on the first move.';
    }

    function start() {
      state = 'running';
      phone.setAttribute('data-state', 'running');
      game.setAttribute('data-run', '1');
      deadline = Date.now() + ROUND * 1000;
      void bar.offsetWidth;
      bar.style.transition = reduced() ? 'none' : 'transform ' + ROUND + 's linear';
      bar.style.transform = reduced() ? 'scaleX(.5)' : 'scaleX(0)';
      how.textContent = 'Go go go!';
      tick = setInterval(function () {
        var left = deadline - Date.now();
        timerEl.textContent = fmt(left);
        if (left <= 5000) phone.setAttribute('data-low', '1');
        if (left <= 0) finish();
      }, 200);
    }

    function finish() {
      clearInterval(tick);
      clearTimeout(holdTimer);
      state = 'done';
      busy = false;
      phone.setAttribute('data-state', 'done');
      phone.removeAttribute('data-low');
      timerEl.textContent = '0:00';
      flash.style.opacity = '0';
      paint(0);
      var rating = score === 0 ? 'Warming up' : score < 4 ? 'Nice start' : score < 7 ? 'Party material' : 'Massela master';
      finalEl.textContent = score + ' correct. ' + rating + '!';
      done.hidden = false;
      how.textContent = 'Like it? Get the full game with hundreds more words.';
      live.textContent = 'Time is up. ' + score + ' correct.';
      if (dock) dock.classList.add('nudge');
      buzz([30, 50, 30]);
    }

    function paint(dy) {
      phone.style.transform = dy ? 'translateY(' + (dy * 0.5).toFixed(1) + 'px) rotateX(' + (-dy * 0.14).toFixed(2) + 'deg)' : '';
      if (!dy) return;
      var a = Math.min(1, Math.abs(dy) / THRESHOLD);
      flash.className = 'flash ' + (dy > 0 ? 'ok' : 'pass');
      flash.textContent = dy > 0 ? 'Correct!' : 'Pass';
      flash.style.opacity = (a * 0.92).toFixed(2);
    }

    function commit(kind) {
      if (busy || state === 'done') return;
      if (state === 'idle') start();
      busy = true;
      if (kind === 'ok') { score++; countEl.textContent = score; }
      flash.className = 'flash ' + kind;
      flash.textContent = kind === 'ok' ? 'Correct!' : 'Pass';
      flash.style.opacity = '1';
      phone.style.transform = '';
      live.textContent = (kind === 'ok' ? 'Correct. ' : 'Pass. ') + score + ' so far.';
      buzz(kind === 'ok' ? 18 : 10);
      holdTimer = setTimeout(function () {
        if (state === 'done') return;
        idx++;
        show(idx);
        wrap.classList.remove('swap');
        void wrap.offsetWidth;
        wrap.classList.add('swap');
        flash.style.opacity = '0';
        busy = false;
      }, reduced() ? 150 : 380);
    }

    // Drag the card: down = correct, up = pass. Horizontal pans are left to the browser so the deck still swipes.
    var drag = null;
    phone.addEventListener('pointerdown', function (e) {
      if (state === 'done' || busy || (e.button !== undefined && e.button > 0)) return;
      if (e.target.closest && e.target.closest('button')) return;
      drag = { id: e.pointerId, y: e.clientY, dy: 0 };
      phone.classList.add('is-drag');
      try { phone.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    phone.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      drag.dy = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, e.clientY - drag.y));
      paint(drag.dy);
    });
    function release(e, cancelled) {
      if (!drag || e.pointerId !== drag.id) return;
      var dy = drag.dy;
      drag = null;
      phone.classList.remove('is-drag');
      if (!cancelled && Math.abs(dy) >= THRESHOLD) commit(dy > 0 ? 'ok' : 'pass');
      else { paint(0); flash.style.opacity = '0'; }
    }
    phone.addEventListener('pointerup', function (e) { release(e, false); });
    phone.addEventListener('pointercancel', function (e) { release(e, true); });

    $('#ms-ok').addEventListener('click', function () { commit('ok'); });
    $('#ms-pass').addEventListener('click', function () { commit('pass'); });
    $('#ms-again').addEventListener('click', newRound);

    newRound();
  })();
})();
