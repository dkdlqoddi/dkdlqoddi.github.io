import re

with open('scripts/galaxy3d.js', 'r', encoding='utf-8') as f:
    content = f.read()

shader_code = """
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
    
    float alpha = mix(0.9, 1.0, uHover);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
"""

if "planetVertexShader" not in content:
    content = shader_code + content

# Replace sphereMat creation in assignAnchors
old_assign = """  const sphereMat = new THREE.MeshBasicMaterial({ 
    color: 0x00ffff, 
    transparent: true, 
    opacity: 0.9 
  });"""
  
if old_assign in content:
    content = content.replace(old_assign, "")

old_mesh_creation = """    // 행성 렌더링용 구체
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.copy(basePosition);
    scene.add(mesh);"""

new_mesh_creation = """    // 행성 렌더링용 구체 (ShaderMaterial 적용)
    const planetMat = new THREE.ShaderMaterial({
      vertexShader: planetVertexShader,
      fragmentShader: planetFragmentShader,
      uniforms: {
        uHover: { value: 0.0 },
        uSeed: { value: Math.random() * 100.0 },
        uTime: { value: 0.0 }
      },
      transparent: true,
      blending: THREE.NormalBlending
    });
    const mesh = new THREE.Mesh(sphereGeo, planetMat);
    mesh.position.copy(basePosition);
    scene.add(mesh);"""

if old_mesh_creation in content:
    content = content.replace(old_mesh_creation, new_mesh_creation)


# Modifying tick
old_tick_update = """    // 앵커(행성) 스케일 업데이트
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
    });"""

new_tick_update = """    // 앵커(행성) 스케일 업데이트 및 셰이더 uniform 업데이트
    anchors.forEach((anchor, idx) => {
      const isHovered = (hoveredCardIndex === idx);
      const targetScale = isHovered ? 3.5 : 1.0;
      anchor.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Shader uniform uHover lerp (0.0 to 1.0)
      if (anchor.mesh.material && anchor.mesh.material.uniforms) {
          const targetHover = isHovered ? 1.0 : 0.0;
          anchor.mesh.material.uniforms.uHover.value += (targetHover - anchor.mesh.material.uniforms.uHover.value) * 0.1;
          anchor.mesh.material.uniforms.uTime.value = elapsedTime;
      }
      
      // 행성도 은하수와 함께 공전해야 하므로 위치 업데이트
      if (points) {
        anchor.mesh.position.copy(anchor.basePosition);
        anchor.mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), points.rotation.y);

        anchor.cardPos.copy(anchor.baseCardPosition);
        anchor.cardPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), points.rotation.y);
      }
    });"""

if old_tick_update in content:
    content = content.replace(old_tick_update, new_tick_update)

with open('scripts/galaxy3d.js', 'w', encoding='utf-8') as f:
    f.write(content)
