import * as THREE from 'three'
import { gsap } from 'gsap'

const premiumTransitionFragment = `
#ifdef GL_ES
precision highp float;
#endif

uniform float progress;
uniform vec3 baseColor;
uniform vec3 transitionColor;
uniform float time;
uniform vec2 resolution;
uniform vec2 mousePos;

varying vec2 vUv;

// Optimized simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

// Improved fluid dynamics with velocity
vec2 fluidFlow(vec2 uv, float time) {
    vec2 flow = vec2(0.0);
    float scale = 4.0;
    float weight = 1.0;
    
    for(int i = 0; i < 4; i++) {
        vec2 noise = vec2(
            snoise(uv * scale + vec2(time * 0.3, time * 0.4)),
            snoise(uv * scale + vec2(time * 0.5, time * 0.6) + 100.0)
        );
        flow += noise * weight * 0.08;
        scale *= 2.2;
        weight *= 0.6;
    }
    
    // Add mouse interaction
    vec2 mouseDelta = (mousePos - 0.5) * 0.5;
    flow += mouseDelta * smoothstep(0.0, 0.3, progress);
    
    return flow;
}

// Enhanced color processing
vec3 chromaticTransition(float t, vec3 colorA, vec3 colorB) {
    vec3 color = mix(colorA, colorB, smoothstep(0.2, 0.8, t));
    
    // Subtle chromatic aberration
    float chromaStrength = 0.015 * (1.0 - abs(t - 0.5) * 2.0);
    return vec3(
        mix(color.r, snoise(vec2(t * 20.0, time)) * chromaStrength + color.r, t),
        color.g,
        mix(color.b, snoise(vec2(t * 20.0 + 100.0, time)) * chromaStrength + color.b, t)
    );
}

// Dynamic particle system
float energyParticles(vec2 uv, float time) {
    float particles = 0.0;
    float speed = 1.5;
    
    for(int i = 0; i < 16; i++) {
        float fi = float(i);
        vec2 offset = vec2(
            sin(fi * 1.2 + time * speed) * 0.4,
            cos(fi * 0.8 + time * speed) * 0.4
        );
        
        vec2 p = uv - offset;
        float size = mix(0.02, 0.08, sin(fi * 3.14159 * 0.25));
        float fade = smoothstep(0.3, 0.0, length(p));
        
        particles += fade * size * 40.0 * (1.0 - progress);
    }
    
    return clamp(particles, 0.0, 1.0);
}

void main() {
    vec2 uv = vUv;
    vec2 st = uv - 0.5;
    st.x *= resolution.x / resolution.y;
    
    // Dynamic flow calculation
    vec2 flow = fluidFlow(uv * 1.2 + vec2(time * 0.1), time);
    vec2 distortedUV = uv + flow * smoothstep(0.0, 0.5, progress);
    
    // Core transition effect
    float wave = smoothstep(0.4, 0.6, 
        length(st * 1.2) + 
        snoise(distortedUV * 8.0 + time * 2.0) * 0.2 -
        progress * 1.4
    );
    
    // Particle effects
    float particles = energyParticles(distortedUV, time * 1.5);
    
    // Final color composition
    vec3 color = chromaticTransition(wave, baseColor, transitionColor);
    color = mix(color, transitionColor, particles * 0.8);
    
    // Edge glow effect
    float edge = pow(1.0 - wave, 4.0) * 2.0;
    color += transitionColor * edge * smoothstep(0.7, 1.0, progress);
    
    // Alpha composition
    float alpha = smoothstep(0.3, 0.7, wave + particles * 0.3);
    
    gl_FragColor = vec4(color, alpha * 0.98);
}`;

export function createMosaicTransition() {
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      progress: { value: 0 },
      time: { value: 0 },
      baseColor: { value: new THREE.Color('#2C1810') },
      transitionColor: { value: new THREE.Color('#FFD700') },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      mousePos: { value: new THREE.Vector2(0.5, 0.5) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: premiumTransitionFragment,
    transparent: true,
    depthTest: false,
    depthWrite: false
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 9999;
  mesh.frustumCulled = false;

  // Smooth animation loop
  let lastTime = performance.now();
  const animate = () => {
    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    material.uniforms.time.value += delta;
    lastTime = now;
    requestAnimationFrame(animate);
  };
  animate();

  // Mouse interaction
  const handleMouseMove = (e) => {
    material.uniforms.mousePos.value.set(
      e.clientX / window.innerWidth,
      1 - e.clientY / window.innerHeight
    );
  };
  window.addEventListener('mousemove', handleMouseMove);

  return { 
    mesh, 
    material,
    dispose: () => window.removeEventListener('mousemove', handleMouseMove)
  };
}

export function animateTransition(material, onComplete) {
  material.uniforms.progress.value = 0;
  material.uniforms.transitionColor.value.set('#FFD700');
  
  const timeline = gsap.timeline({
    defaults: { ease: "expo.inOut", duration: 2.0 },
    onComplete
  });

  timeline
    .to(material.uniforms.progress, {
      value: 1,
      duration: 2.2,
      ease: "expo.inOut",
      onStart: () => {
        gsap.to(material.uniforms.transitionColor.value, {
          r: 0.9,
          g: 0.75,
          b: 0.3,
          duration: 2.5,
          ease: "sine.inOut"
        });
      }
    })
    .to(material.uniforms.progress, {
      value: 0,
      duration: 1.8,
      ease: "power4.out",
      delay: 0.3
    }, "+=0.3");
}