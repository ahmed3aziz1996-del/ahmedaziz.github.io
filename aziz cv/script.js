/* ---------- Utilities ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Simple contact handler (placeholder) ---------- */
function handleContact(e){
  e.preventDefault();
  // replace with your real submission logic (email, netlify form, API...)
  alert("Thanks! Message submitted (demo). Replace handleContact with real backend.");
}

/* ---------- Background slideshow ---------- */
(function slideshow(){
  const images = document.querySelectorAll('.background-wrapper img');
  if (!images.length) return;
  let current = 0;
  setInterval(()=>{
    images[current].classList.remove('active');
    current = (current + 1) % images.length;
    images[current].classList.add('active');
  }, 8000);
})();

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});


/* ---------- Cursor & magnetic button interactions ---------- */
(function cursorAndMagnet(){
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mouseX = 0, mouseY = 0;

  // track mouse and position cursor elements
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    ring.style.left = mouseX + 'px';
    ring.style.top = mouseY + 'px';
  });

  // hover effects for interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .magnetic, .project, .btn');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
      ring.style.borderColor = 'rgba(255,47,166,0.18)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(0,240,223,0.12)';
      ring.style.transition = 'transform .12s ease, border-color .12s ease';
    });
  });

  // magnetic button effect
  const magnets = document.querySelectorAll('.magnetic');
  magnets.forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width/2;
      const relY = e.clientY - rect.top - rect.height/2;
      btn.style.transform = `translate(${relX * 0.12}px, ${relY * 0.08}px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', ()=>{
      btn.style.transform = '';
    });
  });
})();

/* ---------- Typing effect for About bio ---------- */
(function typingBio(){
  const bioText = "Hello! I'm a passionate web developer with a keen eye for design. I specialize in creating responsive, user-friendly websites and immersive 3D experiences.";
  const el = document.getElementById('typed-bio');
  if (!el) return;
  let i = 0;
  function step(){
    if (i < bioText.length){
      el.textContent += bioText.charAt(i++);
      setTimeout(step, 28);
    }
  }
  window.addEventListener('load', () => setTimeout(step, 500));
})();

/* ---------- Terminal intro typing (short) ---------- */
(function terminalIntro(){
  const term = document.getElementById('term-line');
  if (!term) return;
  const text = ">> initializing… loading 3D scene · optimizing shaders · ready";
  let p = 0;
  function tick(){
    if (p < text.length) {
      term.textContent += text.charAt(p++);
      setTimeout(tick, 28);
    } else {
      // small cursor blink
      term.textContent += ' ';
    }
  }
  setTimeout(tick, 800);
})();

/* ---------- Skills bars animate on scroll ---------- */
(function skillBars(){
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        const bar = entry.target;
        const val = bar.getAttribute('data-value') || 70;
        const span = bar.querySelector('span');
        span.style.width = val + '%';
        obs.unobserve(bar);
      }
    });
  },{threshold:0.35});
  bars.forEach(b => obs.observe(b));
})();

/* ---------- THREE.JS HERO SCENE (simple, performant) ---------- */
(function threeScene(){
  const container = document.getElementById('bg-scene');
  if (!container || !window.THREE) return;

  // create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // scene and camera
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020205, 0.002);
  const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 1000);
  camera.position.set(0, 18, 48);

  // lights
  const cyan = new THREE.PointLight(0x00f0df, 0.9, 200);
  cyan.position.set(-30, 30, 20);
  scene.add(cyan);
  const magenta = new THREE.PointLight(0xff2fa6, 0.8, 200);
  magenta.position.set(32, 18, 30);
  scene.add(magenta);
  scene.add(new THREE.AmbientLight(0xffffff, 0.12));

  // ground mesh (wire grid)
  const geometry = new THREE.PlaneGeometry(80, 80, 140, 44);
  geometry.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color: 0x00fff0, wireframe: true, opacity: 0.12, transparent: true });
  const ground = new THREE.Mesh(geometry, mat);
  ground.position.y = -6.5;
  scene.add(ground);

  const lineMat = new THREE.LineBasicMaterial({ color: 0xff2fa6, transparent: true, opacity: 0.06 });
  const groundLines = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), lineMat);
  groundLines.position.y = -6.5;
  scene.add(groundLines);

  // floating sphere as "avatar / model" (simple—replace with glTF importer if you want an actual model)
  const sphereGeo = new THREE.SphereGeometry(4.2, 40, 30);
  const sphereMat = new THREE.MeshStandardMaterial({ color: 0x223344, metalness: 0.6, roughness: 0.25, emissive: 0x101010 });
  const holo = new THREE.Mesh(sphereGeo, sphereMat);
  holo.position.set(18, -2, -12);
  scene.add(holo);

  // particle cloud
  const particlesGeo = new THREE.BufferGeometry();
  const count = 240;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++){
    positions[i*3] = (Math.random() - 0.5) * 120;
    positions[i*3+1] = Math.random()*30 - 8;
    positions[i*3+2] = (Math.random() - 0.5) * 120 - 20;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({ size: 0.9, color: 0xff4fb0, transparent: true, opacity: 0.12 });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // canvas sizing helpers
  function resize(){
    const rect = document.querySelector('.hero-outer').getBoundingClientRect();
    const w = rect.width, h = rect.height;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // match container to hero area
    container.style.width = rect.width + 'px';
    container.style.height = rect.height + 'px';
    container.style.left = rect.left + 'px';
    container.style.top = rect.top + 'px';
    container.style.position = 'absolute';
  }
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', resize);
  resize();

  // animate vertices (wavy ground)
  const pos = geometry.attributes.position;
  const vertexCount = pos.count;
  const initial = new Float32Array(pos.array);
  let t = 0, mX = 0, mY = 0;

  window.addEventListener('mousemove', (e) => {
    const w = window.innerWidth, h = window.innerHeight;
    mX = (e.clientX - w/2) / w;
    mY = (e.clientY - h/2) / h;
  });

  function animate(){
    t += 0.006;
    for (let i = 0; i < vertexCount; i++){
      const ix = i * 3;
      const x0 = initial[ix];
      const z0 = initial[ix + 2];
      const noise = Math.sin((x0 + t * 6) * 0.55) * 0.6 + Math.cos((z0 - t * 3.5) * 0.4) * 0.4;
      pos.array[ix + 1] = initial[ix + 1] + noise * 0.95;
    }
    pos.needsUpdate = true;
    // rotate and bob
    particles.rotation.y += 0.0009;
    particles.rotation.x = Math.sin(t * 0.04) * 0.02;
    holo.rotation.y += 0.004;
    holo.rotation.x = Math.sin(t * 0.03) * 0.02;

    camera.position.x += (mX * 8 - camera.position.x) * 0.04;
    camera.position.y += (mY * 6 - camera.position.y) * 0.03;
    camera.position.z = 40 + Math.cos(t * 0.12) * 6;
    camera.lookAt(0, -4, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();
