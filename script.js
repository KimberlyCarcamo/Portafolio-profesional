const hero = document.querySelector('.hero');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const themeLabel = themeToggle.querySelector('.theme-label');
const depthValue = document.getElementById('depthValue');
const sceneStatus = document.getElementById('sceneStatus');
const progressBar = document.getElementById('progressBar');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

let currentScene = 'day';
let hasJumped = false;

function setScene(scene) {
  currentScene = scene;
  hero.classList.toggle('night-scene', scene === 'night');
  hero.classList.toggle('day-scene', scene === 'day');
  themeIcon.textContent = scene === 'day' ? '☾' : '☼';
  themeLabel.textContent = scene === 'day' ? 'Night' : 'Day';
  themeToggle.setAttribute('aria-label', scene === 'day' ? 'Switch to night mode' : 'Switch to day mode');
  sceneStatus.textContent = hasJumped
    ? (scene === 'day' ? 'DAYTIME DIVE' : 'NIGHTTIME DIVE')
    : (scene === 'day' ? 'A DAY TO EXPLORE' : 'A NIGHT TO EXPLORE');
}
themeToggle.addEventListener('click', () => setScene(currentScene === 'day' ? 'night' : 'day'));

function setMenuOpen(open) {
  mainNav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  menuToggle.textContent = open ? '×' : '☰';
}
menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
mainNav.querySelectorAll('a, button').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mainNav.classList.contains('open')) { setMenuOpen(false); menuToggle.focus(); }
});
document.addEventListener('click', event => {
  if (mainNav.classList.contains('open') && !mainNav.contains(event.target) && !menuToggle.contains(event.target)) setMenuOpen(false);
});
window.addEventListener('resize', () => { if (window.innerWidth > 860) setMenuOpen(false); });

let ticking = false;
function updateScrollExperience() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progressBar.style.width = `${progress * 100}%`;

  // El buzo permanece sentado en la escena inicial; la medusa aparece al llegar a About Me.
  const progressPercent = Math.round(progress * 100);
  depthValue.textContent = `${String(Math.round(progress * 180)).padStart(2, '0')} m`;
  if (progressPercent > 94) sceneStatus.textContent = 'DIVE COMPLETED!';
  else sceneStatus.textContent = currentScene === 'day' ? 'A DAY TO EXPLORE' : 'A NIGHT TO EXPLORE';
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollExperience);
    ticking = true;
  }
}, { passive: true });
updateScrollExperience();


// Interactive sea elements respond with a subtle animation.
document.querySelectorAll('.sea-creature').forEach(creature => {
  creature.addEventListener('click', () => {
    creature.classList.remove('touched');
    void creature.offsetWidth;
    creature.classList.add('touched');
    setTimeout(() => creature.classList.remove('touched'), 700);
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.section-kicker, .about-heading, .about-text, .project-card, .contact-panel, .final-phrase, .dive-finale').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

const photo = document.getElementById('profilePhoto');
const fallback = document.getElementById('photoFallback');
photo.addEventListener('load', () => fallback.style.display = 'none');
photo.addEventListener('error', () => {
  photo.style.display = 'none';
  fallback.style.display = 'flex';
});

document.getElementById('year').textContent = new Date().getFullYear();

const projectLinks = {
  homepage: 'https://serene-eclair-cf9d87.netlify.app/',
  bakery: 'https://extraordinary-twilight-9a6b0d.netlify.app/',
  collagee: 'https://resilient-sprite-c5e26f.netlify.app/',
  recrea: 'https://delightful-valkyrie-7d5b23.netlify.app/',
  linkedin: 'https://www.linkedin.com/in/kimberly-c%C3%A1rcamo1/',
  github: 'https://github.com/KimberlyCarcamo'
};
document.querySelectorAll('[data-link]').forEach(link => {
  const key = link.dataset.link;
  link.href = projectLinks[key] || '#';
  if (link.href !== '#' && link.href.startsWith('http')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
});

const myEmail = 'kimberly.carcamo2009@gmail.com';
document.getElementById('emailButton').href = `mailto:${myEmail}`;
document.getElementById('emailLink').href = `mailto:${myEmail}`;
document.querySelector('#emailLink span:nth-child(2)').lastChild.textContent = myEmail;






// Three interactive fish appear only in the final section.
(() => {
  const school = document.getElementById('playfulFishSchool');
  if (!school) return;

  const palettes = [
    ['#a987ff', '#e6d8ff', '#6548bd'],
    ['#4dbbff', '#d7f3ff', '#2874ba'],
    ['#ff8fc9', '#ffe0f0', '#c34e91']
  ];
  const TOTAL_FISH = 3;
  const fish = [];

  for (let i = 0; i < TOTAL_FISH; i++) {
    const isGrumpy = i === 2;
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `depth-fish ${isGrumpy ? 'secret-grumpy' : 'secret-sweet'}`;
    el.setAttribute('aria-label', 'Curious fish');
    el.title = 'Click to reveal its personality';

    const palette = palettes[i % palettes.length];
    el.style.setProperty('--fish-color', palette[0]);
    el.style.setProperty('--fish-light', palette[1]);
    el.style.setProperty('--fish-shadow', palette[2]);
    el.style.left = `${8 + ((i * 37) % 82)}%`;
    el.style.top = `${16 + ((i * 41) % 70)}%`;
    el.style.setProperty('--swim-time', `${13 + (i % 5) * 2}s`);
    el.style.setProperty('--swim-delay', `${-((i * 2.1) % 12)}s`);
    el.style.setProperty('--fish-scale', `${0.88 + ((i * 3) % 4) * 0.08}`);

    // Misma apariencia tranquila antes de tocar; sin rayas.
    el.innerHTML = `
      <span class="fish-tail"></span>
      <span class="fish-body"></span>
      <span class="fish-eye fish-eye-left"></span>
      <span class="fish-eye fish-eye-right"></span>
      <span class="fish-brow"></span>
      <span class="fish-cheek"></span>
      <span class="fish-mouth"></span>
    `;
    school.appendChild(el);
    fish.push(el);

    el.addEventListener('click', (event) => {
      event.preventDefault();
      el.classList.remove('is-pressed', 'revealed-sweet', 'revealed-grumpy');
      void el.offsetWidth;
      el.classList.add('is-pressed');

      if (el.classList.contains('secret-grumpy')) {
        el.classList.add('revealed-grumpy');
        el.setAttribute('aria-label', 'This little fish is grumpy!');
      } else {
        el.classList.add('revealed-sweet');
        el.setAttribute('aria-label', 'This little fish is friendly!');
        const rect = el.getBoundingClientRect();
        ['♥', '♡', '♥', '💕'].forEach((symbol, index) => {
          const heart = document.createElement('span');
          heart.className = 'floating-fish-heart';
          heart.textContent = symbol;
          heart.style.left = `${rect.left + rect.width * (0.25 + index * 0.16)}px`;
          heart.style.top = `${rect.top + 8}px`;
          heart.style.setProperty('--heart-side', `${(index - 1.5) * 22}px`);
          heart.style.animationDelay = `${index * 75}ms`;
          school.appendChild(heart);
          window.setTimeout(() => heart.remove(), 1600);
        });
      }

      window.setTimeout(() => {
        el.classList.remove('is-pressed', 'revealed-sweet', 'revealed-grumpy');
        el.setAttribute('aria-label', 'Curious fish');
      }, 1600);
    });
  }

  // The three fish appear only near the end of the page. When returning to the top,
  // todos los peces desaparecen del cielo y la superficie.
  let pending = false;
  function updateFishDepth() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const depth = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    const hasDived = document.documentElement.classList.contains('has-dived') ||
                     document.body.classList.contains('has-dived') ||
                     !!document.querySelector('.hero.has-dived');
    const visibleCount = hasDived && depth >= 0.94 ? TOTAL_FISH : 0;

    fish.forEach((el, index) => {
      const visible = index < visibleCount;
      el.classList.toggle('is-visible', visible);
      el.tabIndex = visible ? 0 : -1;
      el.setAttribute('aria-hidden', visible ? 'false' : 'true');
    });
    school.classList.toggle('fish-ocean-active', hasDived);
    pending = false;
  }

  function scheduleUpdate() {
    if (!pending) {
      pending = true;
      window.requestAnimationFrame(updateFishDepth);
    }
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);

  // Synchronize exactly when the existing diver jump toggles the hero class.
  const hero = document.querySelector('.hero');
  if (hero) {
    new MutationObserver(scheduleUpdate).observe(hero, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
  updateFishDepth();
})();



// The jellyfish accompanies the visitor and gently changes position while scrolling.
const floatingJelly = document.querySelector('.octopus-companion');
const jellyColorFilters = {
  violet: 'none',
  pink: 'hue-rotate(105deg) saturate(1.08)',
  blue: 'hue-rotate(35deg) saturate(1.2)',
  mint: 'hue-rotate(220deg) saturate(.9)',
  gold: 'hue-rotate(155deg) saturate(1.18)'
};
const savedJellyColor = localStorage.getItem('kimberlyJellyColor') || 'violet';
if (floatingJelly) {
  const companionImage = floatingJelly.querySelector('img');
  if (companionImage) companionImage.style.filter = jellyColorFilters[savedJellyColor] || 'none';
}
function moveJellyWithPage() {
  if (!floatingJelly) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  const isMobile = window.matchMedia('(max-width: 680px)').matches;
  // On phones, keep the jellyfish below the opening headline; it still travels as the page scrolls.
  const y = isMobile ? 50 + progress * 36 : 18 + progress * 62;
  floatingJelly.style.top = `${y}vh`;
  floatingJelly.classList.toggle('jelly-left-side', Math.floor(progress * 5) % 2 === 1);
}
window.addEventListener('scroll', moveJellyWithPage, { passive: true });
window.addEventListener('resize', moveJellyWithPage);
moveJellyWithPage();
