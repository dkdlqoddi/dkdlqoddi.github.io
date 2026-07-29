
const planetVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const planetFragmentShader = `
  uniform float uHover;
  uniform float uSeed;
  uniform float uTime;
  uniform float uOpacity;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for(int i=0; i<4; i++){
      f += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return f;
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = dot(normal, viewDir);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 2.0);

    vec2 uv = vUv * 3.0 + vec2(uSeed, uSeed);
    uv.x += uTime * 0.05;
    
    float n = fbm(uv + fbm(uv + uTime * 0.1));
    float band = sin(vUv.y * 10.0 + n * 5.0) * 0.5 + 0.5;
    
    vec3 baseColor = vec3(0.0, 0.5, 1.0);
    vec3 accentColor = vec3(0.0, 1.0, 0.8);
    vec3 darkColor = vec3(0.05, 0.1, 0.3);
    
    float hueShift = fract(uSeed * 0.618);
    baseColor = mix(baseColor, vec3(0.5, 0.0, 1.0), hueShift);
    
    vec3 planetColor = mix(darkColor, baseColor, band);
    planetColor = mix(planetColor, accentColor, n);
    
    vec3 atmosphereColor = mix(vec3(0.0, 1.0, 1.0), vec3(0.5, 0.5, 1.0), hueShift);
    planetColor += atmosphereColor * fresnel * 1.5;
    
    vec3 markerColor = vec3(0.0, 1.0, 1.0);
    vec3 finalColor = mix(markerColor, planetColor, uHover);
    
    float alpha = mix(0.9, 1.0, uHover) * uOpacity;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
// 전역 객체 window.THREE 를 사용 (UMD 라이브러리)

// 은하수 파라미터
const params = {
  count: 50000,
  size: 0.04,
  radius: 120,
  branches: 4,
  spin: 1,
  randomness: 2.5,
  randomnessPower: 3,
  colors: ['#0a192f', '#1b3984', '#00d2ff', '#8a2be2', '#ffffff'] // 다채로운 푸른색/보라색 계열
};

let scene, camera, renderer, points, geometry, material;
let cards = [];
let anchors = [];
let hoveredCardIndex = -1;
let animationFrameId = null;

// 카메라 시점 제어용 변수 (구면 좌표계)
let isDragging = false;
let theta = 0;
let phi = Math.PI * 0.45; // 옆면을 더 바라보도록 각도 조정 (90도에 가깝게)
const camRadius = 180;

let targetCameraX = camRadius * Math.sin(phi) * Math.sin(theta);
let targetCameraY = camRadius * Math.cos(phi);
let targetCameraZ = camRadius * Math.sin(phi) * Math.cos(theta);


// --- Comets ---
let comets = [];
const COMET_COUNT = 5;
function initComets() {
  for (let i = 0; i < COMET_COUNT; i++) {
    createComet();
  }
}

function createComet() {
  const cometGeo = new THREE.BufferGeometry();
  const cometMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
  
  // Trail points
  const points = new Float32Array(15 * 3);
  cometGeo.setAttribute('position', new THREE.BufferAttribute(points, 3));
  
  const comet = new THREE.Line(cometGeo, cometMat);
  
  // Random start position
  const radius = 100 + Math.random() * 50;
  const theta = Math.random() * Math.PI * 2;
  const y = (Math.random() - 0.5) * 50;
  
  scene.add(comet);
  
  comets.push({
    mesh: comet,
    pos: new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius),
    vel: new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 2).normalize().multiplyScalar(0.5 + Math.random() * 1.5),
    history: [],
    life: 0,
    maxLife: 200 + Math.random() * 200
  });
}

function updateComets() {
  for (let i = comets.length - 1; i >= 0; i--) {
    let c = comets[i];
    c.life++;
    c.pos.add(c.vel);
    
    c.history.unshift(c.pos.clone());
    if (c.history.length > 15) c.history.pop();
    
    const positions = c.mesh.geometry.attributes.position.array;
    for (let j = 0; j < c.history.length; j++) {
      positions[j*3] = c.history[j].x;
      positions[j*3+1] = c.history[j].y;
      positions[j*3+2] = c.history[j].z;
    }
    // Fill remainder if history < 15
    for (let j = c.history.length; j < 15; j++) {
      if(c.history.length > 0) {
        positions[j*3] = c.history[c.history.length-1].x;
        positions[j*3+1] = c.history[c.history.length-1].y;
        positions[j*3+2] = c.history[c.history.length-1].z;
      }
    }
    c.mesh.geometry.attributes.position.needsUpdate = true;
    
    // Fade out
    c.mesh.material.opacity = (1.0 - (c.life / c.maxLife)) * 0.8;
    
    if (c.life >= c.maxLife) {
      scene.remove(c.mesh);
      c.mesh.geometry.dispose();
      c.mesh.material.dispose();
      comets.splice(i, 1);
      createComet();
    }
  }
}

function init() {
  const canvas = document.querySelector('#galaxy-3d-bg');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(targetCameraX, targetCameraY, targetCameraZ);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  generateGalaxy();

  // 드래그 시점 전환 (Orbit - 마우스 & 모바일 터치)
  document.addEventListener('mousedown', (event) => {
    if (event.button === 1 || event.button === 0) { // 휠 및 좌클릭 허용
      isDragging = true;
      if (event.button === 1) event.preventDefault(); // 휠 버튼만 텍스트 선택 등 기본 스크롤 방지
    }
  });

  document.addEventListener('mouseup', (event) => {
    if (event.button === 1 || event.button === 0) {
      isDragging = false;
    }
  });

  // 모바일 터치 이벤트 추가
  let lastTouchX = 0;
  let lastTouchY = 0;

  document.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1 && !prefersReducedMotion) {
      isDragging = true;
      lastTouchX = event.touches[0].clientX;
      lastTouchY = event.touches[0].clientY;
    }
  });

  document.addEventListener('touchmove', (event) => {
    if (isDragging && !prefersReducedMotion && event.touches.length === 1) {
      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;
      const movementX = touchX - lastTouchX;
      const movementY = touchY - lastTouchY;
      
      theta -= movementX * 0.005;
      phi -= movementY * 0.005;

      phi = Math.max(0.1, Math.min(Math.PI / 2, phi));

      targetCameraX = camRadius * Math.sin(phi) * Math.sin(theta);
      targetCameraY = camRadius * Math.cos(phi);
      targetCameraZ = camRadius * Math.sin(phi) * Math.cos(theta);
      
      lastTouchX = touchX;
      lastTouchY = touchY;
    }
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging && !prefersReducedMotion) {
      theta -= event.movementX * 0.005;
      phi -= event.movementY * 0.005;

      // phi 각도 제한 (너무 위나 아래로 가지 않도록)
      phi = Math.max(0.1, Math.min(Math.PI / 2, phi));

      targetCameraX = camRadius * Math.sin(phi) * Math.sin(theta);
      targetCameraY = camRadius * Math.cos(phi);
      targetCameraZ = camRadius * Math.sin(phi) * Math.cos(theta);
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();


  function tick() {
    const elapsedTime = clock.getElapsedTime();

    if (!prefersReducedMotion && points) {
      points.rotation.y = elapsedTime * 0.05;
    }
    if (!prefersReducedMotion && clouds) {
      clouds.rotation.y = elapsedTime * 0.04; // slightly slower
    }
    if (!prefersReducedMotion) {
      updateComets();
    }


    // 카메라 부드러운 이동 (Lerp)
    camera.position.x += (targetCameraX - camera.position.x) * 0.05;
    camera.position.y += (targetCameraY - camera.position.y) * 0.05;
    camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);

    // 앵커(행성) 스케일 업데이트 및 셰이더 uniform 업데이트
    anchors.forEach((anchor, idx) => {
      const isHovered = (hoveredCardIndex === idx);
      const targetScale = isHovered ? 3.5 : 1.0;
      anchor.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Shader uniform uHover and uOpacity lerp
      if (anchor.mesh.material && anchor.mesh.material.uniforms) {
          const isScrolled = document.body.classList.contains('scrolled');
          const targetHover = isHovered ? 1.0 : 0.0;
          const targetOpacity = isScrolled ? 1.0 : 0.0;
          anchor.mesh.material.uniforms.uHover.value += (targetHover - anchor.mesh.material.uniforms.uHover.value) * 0.1;
          anchor.mesh.material.uniforms.uOpacity.value += (targetOpacity - anchor.mesh.material.uniforms.uOpacity.value) * 0.1;
          anchor.mesh.material.uniforms.uTime.value = elapsedTime;
      }
      
      // 행성도 은하수와 함께 공전해야 하므로 위치 업데이트
      if (points) {
        anchor.mesh.position.copy(anchor.basePosition);
        anchor.mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), points.rotation.y);

        anchor.cardPos.copy(anchor.baseCardPosition);
        anchor.cardPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), points.rotation.y);
      }
    });

    renderer.render(scene, camera);
    updateLabels();

    animationFrameId = requestAnimationFrame(tick);
  }

  tick();

  document.addEventListener('cards-rendered', () => {
    const domCards = document.querySelectorAll('.card');
    cards = Array.from(domCards);
    assignAnchors();
    setupCardEvents();
  });
}


let clouds;

const galaxyVertexShader = `
  uniform float uTime;
  attribute float aScale;
  attribute vec3 aRandomness;
  varying vec3 vColor;
  
  void main() {
    vColor = color;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Slight rotation over time for individual particles (optional)
    
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    
    // Size attenuation and scale
    gl_PointSize = 2.0 * aScale * (100.0 / -viewPosition.z);
  }
`;

const galaxyFragmentShader = `
  varying vec3 vColor;
  void main() {
    // Disc shape
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 3.0); // Make it a sharp point
    
    vec3 finalColor = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const cloudVertexShader = `
  uniform float uTime;
  attribute float aScale;
  varying vec3 vColor;
  varying vec2 vUv;
  void main() {
    vColor = color;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = 40.0 * aScale * (100.0 / -viewPosition.z);
  }
`;

const cloudFragmentShader = `
  varying vec3 vColor;
  void main() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 1.5); // Softer edge
    gl_FragColor = vec4(vColor, strength * 0.15); // Low opacity
  }
`;

function generateGalaxy() {
  if (points !== undefined) {
    scene.remove(points);
    geometry.dispose();
    material.dispose();
  }
  if (clouds !== undefined) {
    scene.remove(clouds);
    clouds.geometry.dispose();
    clouds.material.dispose();
  }

  // 1. Stars (Giant and normal)
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);
  const scales = new Float32Array(params.count);

  const baseColors = params.colors.map(c => new THREE.Color(c));

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * params.radius;
    const spinAngle = radius * params.spin;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

    const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
    const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius * 0.5;
    const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const color1 = baseColors[Math.floor(Math.random() * baseColors.length)];
    const color2 = baseColors[Math.floor(Math.random() * baseColors.length)];
    const mixedColor = color1.clone().lerp(color2, Math.random());

    if (radius < 15) {
      mixedColor.lerp(new THREE.Color('#ffffff'), 1.0 - (radius/15));
    }

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
    
    // Add giant stars randomly (1% chance to be 5x larger, 5% to be 2x)
    let s = Math.random();
    if (s < 0.01) {
      scales[i] = 5.0 + Math.random() * 3.0; // Giant
    } else if (s < 0.05) {
      scales[i] = 2.0 + Math.random() * 2.0; // Bright
    } else {
      scales[i] = 0.5 + Math.random(); // Normal
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: galaxyVertexShader,
    fragmentShader: galaxyFragmentShader,
    transparent: true
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
  
  // 2. Milky Way Dust Clouds
  const cloudCount = 2000; // dense particles
  const cloudGeo = new THREE.BufferGeometry();
  const cPositions = new Float32Array(cloudCount * 3);
  const cColors = new Float32Array(cloudCount * 3);
  const cScales = new Float32Array(cloudCount);
  
  for(let i=0; i<cloudCount; i++){
    const i3 = i * 3;
    const radius = Math.random() * params.radius * 0.8;
    const spinAngle = radius * params.spin;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

    const randomX = (Math.random() - 0.5) * 30;
    const randomY = (Math.random() - 0.5) * 15;
    const randomZ = (Math.random() - 0.5) * 30;

    cPositions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    cPositions[i3 + 1] = randomY;
    cPositions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    
    const color = baseColors[Math.floor(Math.random() * baseColors.length)].clone();
    cColors[i3] = color.r;
    cColors[i3+1] = color.g;
    cColors[i3+2] = color.b;
    
    cScales[i] = 1.0 + Math.random() * 2.0;
  }
  cloudGeo.setAttribute('position', new THREE.BufferAttribute(cPositions, 3));
  cloudGeo.setAttribute('color', new THREE.BufferAttribute(cColors, 3));
  cloudGeo.setAttribute('aScale', new THREE.BufferAttribute(cScales, 1));
  
  const cloudMat = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: cloudVertexShader,
    fragmentShader: cloudFragmentShader,
    transparent: true
  });
  
  clouds = new THREE.Points(cloudGeo, cloudMat);
  scene.add(clouds);
  
  initComets();
}
function assignAnchors() {
  // 기존 앵커 지우기
  anchors.forEach(a => {
    scene.remove(a.mesh);
    a.mesh.geometry.dispose();
    a.mesh.material.dispose();
  });
  anchors = [];
  const svgLayer = document.querySelector('#hud-lines');
  if (svgLayer) svgLayer.innerHTML = '';

  const sphereGeo = new THREE.SphereGeometry(1.5, 16, 16);


  cards.forEach((card, index) => {
    const step = (index + 1) / cards.length;
    const radius = 25 + step * (params.radius - 40);
    const branchAngle = ((index % params.branches) / params.branches) * Math.PI * 2;
    const spinAngle = radius * params.spin;
    
    const offsetAngle = (Math.random() - 0.5) * 0.5;
    
    const x = Math.cos(branchAngle + spinAngle + offsetAngle) * radius;
    const y = (Math.random() - 0.5) * 10;
    const z = Math.sin(branchAngle + spinAngle + offsetAngle) * radius;

    const basePosition = new THREE.Vector3(x, y, z);
    
    // 행성 렌더링용 구체 (ShaderMaterial 적용)
    const planetMat = new THREE.ShaderMaterial({
      vertexShader: planetVertexShader,
      fragmentShader: planetFragmentShader,
      uniforms: {
        uHover: { value: 0.0 },
        uSeed: { value: Math.random() * 100.0 },
        uTime: { value: 0.0 },
        uOpacity: { value: 0.0 }
      },
      transparent: true,
      blending: THREE.NormalBlending
    });
    const mesh = new THREE.Mesh(sphereGeo, planetMat);
    mesh.position.copy(basePosition);
    scene.add(mesh);

    
    let svgLine = null;
    let svgCircle = null;
    if (svgLayer) {
        svgLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        svgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        svgCircle.setAttribute('fill', 'none');
        svgCircle.setAttribute('stroke', 'rgba(0, 255, 255, 0.8)');
        svgCircle.setAttribute('stroke-width', '2');
        svgLayer.appendChild(svgLine);
        svgLayer.appendChild(svgCircle);
    }

    anchors.push({
        element: card,
        basePosition: basePosition,
        baseCardPosition: new THREE.Vector3(basePosition.x + 40, basePosition.y + 15, basePosition.z + 10),
        cardPos: new THREE.Vector3(),
        mesh: mesh,
        svgLine: svgLine,
        svgCircle: svgCircle
      });
  });
}

function setupCardEvents() {
  cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      hoveredCardIndex = index;
    });
    card.addEventListener('mouseleave', () => {
      if (hoveredCardIndex === index) {
        hoveredCardIndex = -1;
      }
    });
  });
}

function updateLabels() {
  if (cards.length === 0 || anchors.length === 0 || !points) return;

  const tempV = new THREE.Vector3();
  const cardV = new THREE.Vector3();
  const hw = window.innerWidth / 2;
  const hh = window.innerHeight / 2;

  anchors.forEach((anchor, i) => {
    const card = anchor.element;
    
    // 행성(별)의 화면 투영 좌표
    tempV.copy(anchor.mesh.position);
    tempV.project(camera);

    // 버튼(카드)의 화면 투영 좌표
    cardV.copy(anchor.cardPos);
    cardV.project(camera);

    // 카메라 뒤로 넘어간 경우 숨김 (접근성 향상: visibility hidden)
    if (tempV.z > 1 || cardV.z > 1) {
      card.style.opacity = '0';
      card.style.visibility = 'hidden';
      if (anchor.svgLine) anchor.svgLine.style.display = 'none';
      if (anchor.svgCircle) anchor.svgCircle.style.display = 'none';
      return;
    }

    const startX = (tempV.x * hw) + hw;
    const startY = -(tempV.y * hh) + hh;

    const endX = (cardV.x * hw) + hw;
    const endY = -(cardV.y * hh) + hh;

    // 카드 실제 위치 적용
    card.style.left = `${endX}px`;
    card.style.top = `${endY}px`;

    // 원근법(Z값)에 따른 버튼 크기 적용
    const scale = Math.max(0.3, 1 - cardV.z);
    card.style.zIndex = Math.floor(scale * 100);
    const targetScale = (0.5 + scale * 0.5).toFixed(3);
    card.style.transform = `translate(-50%, -50%) scale(${targetScale})`;

    // 카드 가시성 처리
    card.style.opacity = '1';
    card.style.visibility = 'visible';

    // SVG Line/Circle 개별 DOM 속성 직접 업데이트 (Layout Thrashing 방지)
    if (anchor.svgLine && anchor.svgCircle) {
      anchor.svgLine.style.display = '';
      anchor.svgCircle.style.display = '';
      
      anchor.svgLine.setAttribute('x1', startX);
      anchor.svgLine.setAttribute('y1', startY);
      anchor.svgLine.setAttribute('x2', endX);
      anchor.svgLine.setAttribute('y2', endY);
      
      const isHovered = (hoveredCardIndex === i);
      anchor.svgLine.setAttribute('class', isHovered ? 'hover' : '');
      
      anchor.svgCircle.setAttribute('cx', startX);
      anchor.svgCircle.setAttribute('cy', startY);
      anchor.svgCircle.setAttribute('r', isHovered ? "6" : "3");
    }
  });
}

window.addEventListener('DOMContentLoaded', init);
