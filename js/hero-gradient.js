// Simplified Hero Gradient - Adapted from interactive-liquid-gradient
// Removed UI controls, scoped to Hero section, tracks cursor ball center

class TouchTexture {
  constructor() {
    this.size = 64;
    this.width = this.height = this.size;
    this.maxAge = 64;
    this.radius = 0.25 * this.size;
    this.speed = 1 / this.maxAge;
    this.trail = [];
    this.last = null;
    this.initTexture();
  }

  initTexture() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.texture = new THREE.Texture(this.canvas);
  }

  update() {
    this.clear();
    let speed = this.speed;
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i];
      let f = point.force * speed * (1 - point.age / this.maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      } else {
        this.drawPoint(point);
      }
    }
    this.texture.needsUpdate = true;
  }

  clear() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addTouch(point) {
    let force = 0;
    let vx = 0;
    let vy = 0;
    const last = this.last;
    if (last) {
      const dx = point.x - last.x;
      const dy = point.y - last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      let d = Math.sqrt(dd);
      vx = dx / d;
      vy = dy / d;
      force = Math.min(dd * 20000, 2.0);
    }
    this.last = { x: point.x, y: point.y };
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }

  drawPoint(point) {
    const pos = { x: point.x * this.width, y: (1 - point.y) * this.height };
    let intensity = 1;
    if (point.age < this.maxAge * 0.3) {
      intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
    } else {
      const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
      intensity = -t * (t - 2);
    }
    intensity *= point.force;

    const radius = this.radius;
    let color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
    let offset = this.size * 5;
    this.ctx.shadowOffsetX = offset;
    this.ctx.shadowOffsetY = offset;
    this.ctx.shadowBlur = radius * 1;
    this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,0,0,1)";
    this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE === 'undefined') {
    console.error('Three.js not loaded');
    return;
  }

  const canvas = document.getElementById('heroGradient');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero) {
    console.error('Hero gradient elements not found');
    return;
  }

  // Setup Three.js
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e27);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const clock = new THREE.Clock();
  const touchTexture = new TouchTexture();

  // Uniforms - Scheme 1 settings
  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uColor1: { value: new THREE.Vector3(0.945, 0.353, 0.133) }, // F15A22 - Orange
    uColor2: { value: new THREE.Vector3(0.039, 0.055, 0.153) }, // 0A0E27 - Navy
    uTouchTexture: { value: touchTexture.texture },
    uGrainIntensity: { value: 0.02 }, // Reduced grain
    uSpeed: { value: 1.5 },
    uGradientSize: { value: 0.45 },
    uGradientCount: { value: 12.0 },
    uColor1Weight: { value: 0.5 },
    uColor2Weight: { value: 1.8 }
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform sampler2D uTouchTexture;
      uniform float uGrainIntensity;
      uniform float uSpeed;
      uniform float uGradientSize;
      uniform float uGradientCount;
      uniform float uColor1Weight;
      uniform float uColor2Weight;
      
      varying vec2 vUv;
      
      float grain(vec2 uv, float time) {
        vec2 grainUv = uv * uResolution * 0.5;
        return fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0;
      }
      
      void main() {
        vec2 uv = vUv;
        
        // Touch distortion
        vec4 touchTex = texture2D(uTouchTexture, uv);
        float vx = -(touchTex.r * 2.0 - 1.0);
        float vy = -(touchTex.g * 2.0 - 1.0);
        float intensity = touchTex.b;
        uv.x += vx * 0.8 * intensity;
        uv.y += vy * 0.8 * intensity;
        
        // Animated gradient centers
        float t = uTime *uSpeed * 0.4;
        vec2 c1 = vec2(0.5 + sin(t) * 0.4, 0.5 + cos(t * 0.5) * 0.4);
        vec2 c2 = vec2(0.5 + cos(t * 0.6) * 0.5, 0.5 + sin(t * 0.45) * 0.5);
        vec2 c3 = vec2(0.5 + sin(t * 0.35) * 0.45, 0.5 + cos(t * 0.55) * 0.45);
        
        float d1 = length(uv - c1);
        float d2 = length(uv - c2);
        float d3 = length(uv - c3);
        
        float i1 = 1.0 - smoothstep(0.0, uGradientSize, d1);
        float i2 = 1.0 - smoothstep(0.0, uGradientSize, d2);
        float i3 = 1.0 - smoothstep(0.0, uGradientSize, d3);
        
        vec3 color = vec3(0.039, 0.055, 0.153); // Navy base
        color += uColor1 * i1 * uColor1Weight;
        color += uColor2 * i2 * uColor2Weight;
        color += uColor1 * i3 * uColor1Weight;
        
        // Minimal grain
        float grainValue = grain(uv, uTime);
        color += grainValue * uGrainIntensity;
        
        color = clamp(color, vec3(0.0), vec3(1.0));
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Resize handler
  function resize() {
    const rect = hero.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    uniforms.uResolution.value.set(rect.width, rect.height);
  }

  // Cursor ball tracking
  function trackCursorBall() {
    const cursorBall = document.querySelector('.cursor-ball');
    if (!cursorBall) return;

    const heroRect = hero.getBoundingClientRect();
    const ballRect = cursorBall.getBoundingClientRect();

    // Get cursor ball center position
    const ballCenterX = ballRect.left + ballRect.width / 2;
    const ballCenterY = ballRect.top + ballRect.height / 2;

    // Convert to Hero-relative normalized coordinates
    const x = (ballCenterX - heroRect.left) / heroRect.width;
    const y = 1 - (ballCenterY - heroRect.top) / heroRect.height;

    // Only add touch if cursor is within Hero bounds
    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
      touchTexture.addTouch({ x, y });
    }
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.1);
    uniforms.uTime.value += delta;
    touchTexture.update();
    trackCursorBall(); // Track cursor ball position every frame
    renderer.render(scene, camera);
  }

  // Initialize
  resize();
  window.addEventListener('resize', resize);
  animate();

  console.log('🌊 Hero gradient initialized (tracking cursor ball)');
});