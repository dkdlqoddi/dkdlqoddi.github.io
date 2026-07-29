import re

with open('scripts/galaxy3d.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace shader definition
old_shader = """const planetFragmentShader = `
  uniform float uHover;
  uniform float uSeed;
  uniform float uTime;"""
  
new_shader = """const planetFragmentShader = `
  uniform float uHover;
  uniform float uSeed;
  uniform float uTime;
  uniform float uOpacity;"""

if old_shader in content:
    content = content.replace(old_shader, new_shader)

old_alpha = "float alpha = mix(0.9, 1.0, uHover);"
new_alpha = "float alpha = mix(0.9, 1.0, uHover) * uOpacity;"

if old_alpha in content:
    content = content.replace(old_alpha, new_alpha)

# Replace uniform initialization
old_uniforms = """      uniforms: {
        uHover: { value: 0.0 },
        uSeed: { value: Math.random() * 100.0 },
        uTime: { value: 0.0 }
      },"""
      
new_uniforms = """      uniforms: {
        uHover: { value: 0.0 },
        uSeed: { value: Math.random() * 100.0 },
        uTime: { value: 0.0 },
        uOpacity: { value: 0.0 }
      },"""

if old_uniforms in content:
    content = content.replace(old_uniforms, new_uniforms)
    
# Modify tick loop
old_tick = """      // Shader uniform uHover lerp (0.0 to 1.0)
      if (anchor.mesh.material && anchor.mesh.material.uniforms) {
          const targetHover = isHovered ? 1.0 : 0.0;
          anchor.mesh.material.uniforms.uHover.value += (targetHover - anchor.mesh.material.uniforms.uHover.value) * 0.1;
          anchor.mesh.material.uniforms.uTime.value = elapsedTime;
      }"""
      
new_tick = """      // Shader uniform uHover and uOpacity lerp
      if (anchor.mesh.material && anchor.mesh.material.uniforms) {
          const isScrolled = document.body.classList.contains('scrolled');
          const targetHover = isHovered ? 1.0 : 0.0;
          const targetOpacity = isScrolled ? 1.0 : 0.0;
          anchor.mesh.material.uniforms.uHover.value += (targetHover - anchor.mesh.material.uniforms.uHover.value) * 0.1;
          anchor.mesh.material.uniforms.uOpacity.value += (targetOpacity - anchor.mesh.material.uniforms.uOpacity.value) * 0.1;
          anchor.mesh.material.uniforms.uTime.value = elapsedTime;
      }"""

if old_tick in content:
    content = content.replace(old_tick, new_tick)
    
with open('scripts/galaxy3d.js', 'w', encoding='utf-8') as f:
    f.write(content)
