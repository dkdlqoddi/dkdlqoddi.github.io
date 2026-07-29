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
  
  function initGalaxies() {
    galaxies = [];
    const arms = 3;
    const a = 4;
    const b = 0.2;
    
    // Spread 5 galaxies across the screen using ratios [0.1, 0.9]
    const positions = [
      { rx: 0.2, ry: 0.2, scale: 0.8 },
      { rx: 0.8, ry: 0.3, scale: 0.5 },
      { rx: 0.5, ry: 0.5, scale: 1.0 },
      { rx: 0.15, ry: 0.7, scale: 0.4 },
      { rx: 0.75, ry: 0.8, scale: 0.7 }
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

    ctx.clearRect(0, 0, width, height);

    // Render each galaxy
    galaxies.forEach(galaxy => {
      // Calculate fixed base position based on screen ratio
      const cx = width * galaxy.ratioX;
      const cy = height * galaxy.ratioY;
      
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
