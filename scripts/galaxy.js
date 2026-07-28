(function() {
  const canvas = document.querySelector('.galaxy-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  
  // Throttle to 30fps
  const fpsInterval = 1000 / 30;
  let then = performance.now();
  let animationId = null;

  // Galaxies config
  const numGalaxies = 5;
  const particlesPerGalaxy = 20;
  let galaxies = [];

  // Mouse tracking (normalized offset from center)
  // (-1.0 to 1.0 depending on mouse position)
  let mouseTargetX = 0;
  let mouseTargetY = 0;
  let mouseLerpX = 0;
  let mouseLerpY = 0;
  
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // On resize, we want to redraw once if reduced motion is on to prevent black screen
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(performance.now(), true);
    }
  }

  window.addEventListener('resize', resize);
  
  function handlePointer(clientX, clientY) {
    if (width === 0 || height === 0) return;
    // Calculate relative to center: -1.0 to 1.0
    // To prevent galaxies from flying completely off-screen on ultra-wides,
    // we clamp the offset.
    const offsetX = (clientX - width / 2) / (width / 2);
    const offsetY = (clientY - height / 2) / (height / 2);
    
    mouseTargetX = Math.max(-1, Math.min(1, offsetX));
    mouseTargetY = Math.max(-1, Math.min(1, offsetY));
  }

  window.addEventListener('mousemove', (e) => {
    handlePointer(e.clientX, e.clientY);
  });
  
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      // Immediately set lerp to target to prevent jump on touch
      mouseLerpX = mouseTargetX;
      mouseLerpY = mouseTargetY;
    }
  }, { passive: true });

  function initGalaxies() {
    galaxies = [];
    const arms = 3;
    const a = 4;
    const b = 0.2;
    
    // Spread 5 galaxies across the screen using ratios [0.1, 0.9]
    const positions = [
      { rx: 0.2, ry: 0.2, depth: 1.2, scale: 0.8 },
      { rx: 0.8, ry: 0.3, depth: 0.5, scale: 0.5 },
      { rx: 0.5, ry: 0.5, depth: 0.8, scale: 1.0 },
      { rx: 0.15, ry: 0.7, depth: 0.3, scale: 0.4 },
      { rx: 0.75, ry: 0.8, depth: 1.0, scale: 0.7 }
    ];

    for (let g = 0; g < numGalaxies; g++) {
      let particles = [];
      const pos = positions[g];
      
      for (let i = 0; i < particlesPerGalaxy; i++) {
        const armIndex = i % arms;
        const angleOffset = (Math.PI * 2 / arms) * armIndex;
        const t = (i / particlesPerGalaxy) * 15 + Math.random() * 2;
        
        const r = a * Math.exp(b * t) * pos.scale;
        const theta = t + angleOffset;
        
        const noiseX = (Math.random() - 0.5) * 30 * pos.scale;
        const noiseY = (Math.random() - 0.5) * 30 * pos.scale;
        
        particles.push({
          baseAngle: theta,
          r: r,
          size: (Math.random() * 2.5 + 0.5) * pos.scale,
          speed: (0.002 + Math.random() * 0.001) / pos.scale, // smaller galaxies spin slightly faster
          noiseX: noiseX,
          noiseY: noiseY,
          alpha: Math.random() * 0.5 + 0.3
        });
      }
      
      galaxies.push({
        ratioX: pos.rx,
        ratioY: pos.ry,
        depth: pos.depth,
        particles: particles
      });
    }
  }

  function draw(now, forceRender = false) {
    if (!forceRender) {
      animationId = requestAnimationFrame(draw);
    }
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !forceRender) {
      if (animationId) cancelAnimationFrame(animationId);
      // Let it draw one last time to not be blank
      forceRender = true;
      if (!now) now = performance.now();
    }
    
    if (!forceRender) {
      const elapsed = now - then;
      if (elapsed < fpsInterval) return;
      then = now - (elapsed % fpsInterval);
    }

    // Time-based Lerp (independent of exact frame timing) for parallax
    // Default lerp for forced render (1.0 means instant)
    let lerpFactor = 1.0;
    if (!forceRender) {
      const elapsedForLerp = now - then;
      lerpFactor = 1 - Math.pow(0.001, Math.max(16, elapsedForLerp) / 1000); 
    }
    
    mouseLerpX += (mouseTargetX - mouseLerpX) * lerpFactor;
    mouseLerpY += (mouseTargetY - mouseLerpY) * lerpFactor;

    ctx.clearRect(0, 0, width, height);

    // Render each galaxy
    galaxies.forEach(galaxy => {
      // Calculate fixed base position based on screen ratio
      const baseX = width * galaxy.ratioX;
      const baseY = height * galaxy.ratioY;
      
      // Calculate parallax offset based on depth (max offset is depth * 200px roughly)
      const maxOffset = 200; 
      const cx = baseX + (mouseLerpX * maxOffset * galaxy.depth);
      const cy = baseY + (mouseLerpY * maxOffset * galaxy.depth);
      
      galaxy.particles.forEach(p => {
        if (!forceRender) {
          p.baseAngle += p.speed * 1.0; // Assume rough ~30fps delta for speed
        }
        
        const x = cx + Math.cos(p.baseAngle) * p.r + p.noiseX;
        const y = cy + Math.sin(p.baseAngle) * p.r + p.noiseY;
        
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      });
    });
  }

  // Initialize
  resize();
  initGalaxies();
  
  animationId = requestAnimationFrame(draw);

})();
