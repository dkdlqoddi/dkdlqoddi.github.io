(function() {
  const canvas = document.querySelector('.galaxy-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let particles = [];
  const maxParticles = 100;
  
  // Mouse tracking
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetX = mouseX;
  let targetY = mouseY;
  
  // Throttle to 30fps
  const fpsInterval = 1000 / 30;
  let then = performance.now();
  let animationId = null;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Fallback if mouse hasn't moved
    if (mouseX === 0 && mouseY === 0) {
      mouseX = width / 2;
      mouseY = height / 2;
      targetX = mouseX;
      targetY = mouseY;
    }
  }

  window.addEventListener('resize', resize);
  
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function initParticles() {
    particles = [];
    const arms = 3;
    const a = 5;
    const b = 0.2;
    for (let i = 0; i < maxParticles; i++) {
      // Angle distribution along arms
      const armIndex = i % arms;
      const angleOffset = (Math.PI * 2 / arms) * armIndex;
      // Exponential distribution for logarithmic spiral
      const t = (i / maxParticles) * 15 + Math.random() * 2;
      
      const r = a * Math.exp(b * t);
      const theta = t + angleOffset;
      
      // Add some random noise
      const noiseX = (Math.random() - 0.5) * 50;
      const noiseY = (Math.random() - 0.5) * 50;
      
      particles.push({
        baseAngle: theta,
        r: r,
        size: Math.random() * 2.5 + 0.5,
        speed: 0.002 + Math.random() * 0.001,
        noiseX: noiseX,
        noiseY: noiseY,
        alpha: Math.random() * 0.5 + 0.3
      });
    }
  }

  function draw(now) {
    animationId = requestAnimationFrame(draw);
    
    // Check reduced motion setting inside loop to catch runtime changes
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cancelAnimationFrame(animationId);
      return; // Stop animation loop but keep the last drawn frame
    }
    
    const elapsed = now - then;
    if (elapsed < fpsInterval) return;
    
    // Adjust 'then' for next frame to maintain steady 30fps
    then = now - (elapsed % fpsInterval);
    
    // Time-based Lerp (independent of exact frame timing)
    const lerpFactor = 1 - Math.pow(0.001, elapsed / 1000); // Frame-rate independent lerp
    mouseX += (targetX - mouseX) * lerpFactor;
    mouseY += (targetY - mouseY) * lerpFactor;

    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.baseAngle += p.speed * (elapsed / 16.66); // Normalize speed by roughly 60fps delta
      
      // Calculate position based on logarithmic spiral
      const x = mouseX + Math.cos(p.baseAngle) * p.r + p.noiseX;
      const y = mouseY + Math.sin(p.baseAngle) * p.r + p.noiseY;
      
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.fill();
    });
  }

  // Initialize
  resize();
  initParticles();
  
  // Initial frame draw, starts loop if motion allowed
  animationId = requestAnimationFrame(draw);

})();
