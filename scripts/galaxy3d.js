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
let phi = Math.PI / 3; // 약간 위에서 내려다보기
const camRadius = 180;

let targetCameraX = camRadius * Math.sin(phi) * Math.sin(theta);
let targetCameraY = camRadius * Math.cos(phi);
let targetCameraZ = camRadius * Math.sin(phi) * Math.cos(theta);

function init() {
  const canvas = document.querySelector('#galaxy-3d-bg');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 100, 150);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  generateGalaxy();

  // 휠 버튼 드래그 시점 전환 (Orbit)
  document.addEventListener('mousedown', (event) => {
    if (event.button === 1) { // 휠(가운데) 버튼
      isDragging = true;
      event.preventDefault(); // 기본 스크롤 방지
    }
  });

  document.addEventListener('mouseup', (event) => {
    if (event.button === 1) {
      isDragging = false;
    }
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

    // 카메라 부드러운 이동 (Lerp)
    camera.position.x += (targetCameraX - camera.position.x) * 0.05;
    camera.position.y += (targetCameraY - camera.position.y) * 0.05;
    camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);

    // 앵커(행성) 스케일 업데이트
    anchors.forEach((anchor, idx) => {
      const targetScale = (hoveredCardIndex === idx) ? 3.5 : 1.0;
      anchor.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
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

  const checkCards = setInterval(() => {
    const domCards = document.querySelectorAll('.card');
    if (domCards.length > 0 && domCards.length !== cards.length) {
      cards = Array.from(domCards);
      assignAnchors();
      setupCardEvents();
    }
  }, 500);
}

function generateGalaxy() {
  if (points !== undefined) {
    scene.remove(points);
    geometry.dispose();
    material.dispose();
  }

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);

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

    // 랜덤하게 팔레트에서 2개 색상을 섞어서 다채로운 느낌 생성
    const color1 = baseColors[Math.floor(Math.random() * baseColors.length)];
    const color2 = baseColors[Math.floor(Math.random() * baseColors.length)];
    const mixedColor = color1.clone().lerp(color2, Math.random());

    // 중심부는 밝고 하얗게
    if (radius < 15) {
      mixedColor.lerp(new THREE.Color('#ffffff'), 1.0 - (radius/15));
    }

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
}

function assignAnchors() {
  // 기존 앵커 지우기
  anchors.forEach(a => {
    scene.remove(a.mesh);
    a.mesh.geometry.dispose();
    a.mesh.material.dispose();
  });
  anchors = [];

  const sphereGeo = new THREE.SphereGeometry(1.5, 16, 16);
  const sphereMat = new THREE.MeshBasicMaterial({ 
    color: 0x00ffff, 
    transparent: true, 
    opacity: 0.9 
  });

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
    
    // 행성 렌더링용 구체
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.copy(basePosition);
    scene.add(mesh);

    anchors.push({
        element: card,
        basePosition: basePosition,
        baseCardPosition: new THREE.Vector3(basePosition.x + 40, basePosition.y + 15, basePosition.z + 10), // 버튼의 3D 공간 상 오프셋
        cardPos: new THREE.Vector3(),
        mesh: mesh
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

  const svgLayer = document.querySelector('#hud-lines');
  if (!svgLayer) return;

  let svgContent = '';

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

    // 카메라 뒤로 넘어간 경우 숨김
    if (tempV.z > 1 || cardV.z > 1) {
      card.style.opacity = '0';
      return;
    }

    const startX = (tempV.x * hw) + hw;
    const startY = -(tempV.y * hh) + hh;

    const endX = (cardV.x * hw) + hw;
    const endY = -(cardV.y * hh) + hh;

    // 카드 실제 위치 적용
    card.style.left = `${endX}px`;
    card.style.top = `${endY}px`;

    // 원근법(Z값)에 따른 버튼 크기 적용 (가까우면 크고 멀면 작음)
    const scale = Math.max(0.3, 1 - cardV.z);
    card.style.zIndex = Math.floor(scale * 100);
    // scale(0.6 ~ 1.0 정도의 비율)
    const targetScale = (0.5 + scale * 0.5).toFixed(3);
    card.style.transform = `translate(-50%, -50%) scale(${targetScale})`;

    // 카드 가시성 처리
    card.style.opacity = '1';

    // SVG Line 생성
    const isHovered = (hoveredCardIndex === i);
    const lineClass = isHovered ? 'hover' : '';
    svgContent += `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" class="${lineClass}" />`;
    
    // 타겟팅 원(행성 위치)
    svgContent += `<circle cx="${startX}" cy="${startY}" r="${isHovered ? 6 : 3}" fill="none" stroke="rgba(0, 255, 255, 0.8)" stroke-width="2" />`;
  });

  svgLayer.innerHTML = svgContent;
}

window.addEventListener('DOMContentLoaded', init);
