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
  insideColor: '#ff6030',
  outsideColor: '#1b3984'
};

let scene, camera, renderer, points, geometry, material;
const cardAnchors = [];
let cards = [];
let animationFrameId = null;

function init() {
  const canvas = document.querySelector('#galaxy-3d-bg');
  if (!canvas) return;

  // Reduced motion 체크
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  scene = new THREE.Scene();

  // 대각선 위에서 내려다보는 뷰 (Isometric 느낌)
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

  // 리사이즈 이벤트
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 애니메이션 루프
  const clock = new THREE.Clock();

  function tick() {
    const elapsedTime = clock.getElapsedTime();

    // 모션 저감이 켜져 있으면 회전 멈춤
    if (!prefersReducedMotion && points) {
      points.rotation.y = elapsedTime * 0.05;
    }

    renderer.render(scene, camera);
    updateLabels();

    animationFrameId = requestAnimationFrame(tick);
  }

  tick();

  // DOM 로딩 완료 및 main.js 데이터 fetch 이후 카드들이 생성되었는지 주기적으로 확인
  const checkCards = setInterval(() => {
    const domCards = document.querySelectorAll('.card');
    if (domCards.length > 0 && domCards.length !== cards.length) {
      cards = Array.from(domCards);
      assignAnchors();
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

  const colorInside = new THREE.Color(params.insideColor);
  const colorOutside = new THREE.Color(params.outsideColor);

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;

    // 위치
    const radius = Math.random() * params.radius;
    const spinAngle = radius * params.spin;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

    const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
    const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius * 0.5; // 납작하게
    const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // 색상
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / params.radius);

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

// 각 카드에 매핑될 주요 항성(Anchor) 생성
function assignAnchors() {
  cardAnchors.length = 0;
  
  // 나선팔의 궤적을 따라 적당한 간격으로 별 위치를 선정
  cards.forEach((card, index) => {
    // 인덱스에 따라 은하 중심에서 바깥으로 퍼지게 배치
    const step = (index + 1) / cards.length;
    const radius = 20 + step * (params.radius - 30);
    const branchAngle = ((index % params.branches) / params.branches) * Math.PI * 2;
    const spinAngle = radius * params.spin;
    
    // 약간의 랜덤성
    const offsetAngle = (Math.random() - 0.5) * 0.5;
    
    const x = Math.cos(branchAngle + spinAngle + offsetAngle) * radius;
    const y = (Math.random() - 0.5) * 10; // 높이 약간 띄움
    const z = Math.sin(branchAngle + spinAngle + offsetAngle) * radius;

    const anchorVector = new THREE.Vector3(x, y, z);
    cardAnchors.push(anchorVector);
  });
}

function updateLabels() {
  if (cards.length === 0 || cardAnchors.length === 0 || !points) return;

  const tempV = new THREE.Vector3();
  const hw = window.innerWidth / 2;
  const hh = window.innerHeight / 2;

  cards.forEach((card, i) => {
    const anchor = cardAnchors[i];
    if (!anchor) return;

    // 점 객체의 로컬 좌표를 월드 좌표를 거쳐 투영
    tempV.copy(anchor);
    tempV.applyMatrix4(points.matrixWorld);
    tempV.project(camera);

    // 카메라 뒤쪽인지 확인
    if (tempV.z > 1) {
      card.style.display = 'none';
      return;
    }

    const x = (tempV.x * hw) + hw;
    const y = -(tempV.y * hh) + hh;

    card.style.display = 'block';
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
    
    // 원근법: 카메라에서 멀어지면 투명도를 낮추거나 z-index 처리
    const scale = Math.max(0.3, 1 - tempV.z);
    card.style.zIndex = Math.floor(scale * 100);
    card.style.scale = (0.7 + scale * 0.3).toFixed(3);
  });
}

window.addEventListener('DOMContentLoaded', init);
