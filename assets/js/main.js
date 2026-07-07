/* ===================================================================
   Maria's Bar & Grill — interactions
   =================================================================== */
(function () {})();
  'use strict';

  /* ---------- year ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- header shrink on scroll ---------- */
  var header = document.getElementById('site-header');
  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('hamburger');
  var drawer = document.getElementById('mobile-menu');
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }

  /* ---------- active nav link via scroll spy ---------- */
  var sections = ['home', 'early-bird', 'lunch-specials', 'happy-hour', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  function setActive() {
    var pos = window.scrollY + (window.innerHeight * 0.35);
    var current = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec.id;
    });
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      a.classList.toggle('active', href === '#' + current);
    });
  }
  window.addEventListener('scroll', setActive);
  window.addEventListener('load', setActive);

  /* ---------- sliders ---------- */
  function visibleCount(base) {
    var w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 1024) return Math.min(2, base);
    return base;
  }

  function initSlider(root) {
    var base = parseInt(root.getAttribute('data-visible'), 10) || 3;
    var track = root.querySelector('.slider-track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));
    var prev = root.querySelector('.prev');
    var next = root.querySelector('.next');
    var index = 0;

    function maxIndex(v) { return Math.max(0, slides.length - v); }

    function render() {
      var v = visibleCount(base);
      var w = (100 / v);
      root.style.setProperty('--slide-w', w + '%');
      if (index > maxIndex(v)) index = maxIndex(v);
      track.style.transform = 'translateX(-' + (index * w) + '%)';
      if (prev) prev.disabled = index <= 0;
      if (next) next.disabled = index >= maxIndex(v);
    }

    if (prev) prev.addEventListener('click', function () { index = Math.max(0, index - 1); render(); });
    if (next) next.addEventListener('click', function () {
      index = Math.min(maxIndex(visibleCount(base)), index + 1); render();
    });
    window.addEventListener('resize', render);
    render();
  }
  document.querySelectorAll('.slider').forEach(initSlider);

  /* ---------- modals ---------- */
  var modal = document.getElementById('modal');
  var modalImg = document.getElementById('modal-img');
  var modalTitle = document.getElementById('modal-title');
  var modalContent = document.getElementById('modal-content');

  var HH = {
    'happy-hour': '<p><strong>Monday &ndash; Friday</strong></p>' +
      '<p>12&ndash;2 PM &amp; 5&ndash;7 PM</p>' +
      '<p class="price">Glass</p>' +
      '<ul><li>Domestic &mdash; <span class="gold">$3.50</span></li>' +
      '<li>Import &mdash; <span class="gold">$4.50</span></li></ul>',
    'crunchy-taco': '<p class="price">$2.50</p>' +
      '<ul><li>Chicken</li><li>Ground Beef</li><li>Shredded Chicken</li></ul>',
    'tacorona': '<p class="price">$9.99</p>' +
      '<ul><li>3 Street Tacos with Rice &amp; Beans</li>' +
      '<li>Street Taco &mdash; <span class="gold">$1.99</span> each</li>' +
      '<li>Corona Extra &mdash; <span class="gold">$3.59</span></li></ul>'
  };

function openModal(name, img, html) {
  modalTitle.textContent = name;
  modalImg.style.backgroundImage = "url('" + img + "')";
  modalContent.innerHTML = html;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.dish-card.clickable').forEach(function (card) {
  card.addEventListener('click', function () {
    var name = card.getAttribute('data-name');
    var img = card.getAttribute('data-img');

    var category = card.getAttribute('data-category') || '';
    var price = card.getAttribute('data-price') || '';
    var time = card.getAttribute('data-time') || '';
    var note = card.getAttribute('data-note') || '';

    var html = '';
    html += '<p><strong>' + category + '</strong> &mdash; <span class="price">' + price + '</span></p>';
    html += '<p>' + time + '</p>';
    html += '<p class="mini">' + note + '</p>';

    openModal(name, img, html);
  });
});

var modalClose = document.querySelector('.modal-close');

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

modal.addEventListener('click', function (e) {
  if (e.target === modal) {
    closeModal();
  }
});
