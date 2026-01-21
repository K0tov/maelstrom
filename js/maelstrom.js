// Maelstrom Vortex Effect
// Ported from React/SVG to Vanilla JS/Canvas 2D
// Replicates the exact "Suction", "Spiral", and "Tilt" logic.

class Maelstrom {
    constructor() {
        this.canvas = document.getElementById('maelstromCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 350;

        this.width = 0;
        this.height = 0;
        this.scale = 1; // Scaling factor for the relative units

        // Time tracking
        this.lastTime = 0;

        // Tilt logic
        this.targetTilt = { x: 0, y: 0 };
        this.currentTilt = { x: 0, y: 0 };

        this.init();
        this.bindEvents();
        requestAnimationFrame((t) => this.animate(t));
    }

    init() {
        this.resize();
        this.createParticles();
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        // Track mouse on the hero section or window
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    resize() {
        this.width = this.canvas.parentElement.offsetWidth; // Use parent width (col-6)
        this.height = this.canvas.parentElement.offsetHeight;

        // Handle high DPI
        const dpr = Math.min(window.devicePixelRatio, 2);
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';

        // Scale: User logic uses radius ~60 as max.
        // We want radius 60 to fit in the container.
        // Let's say 60 units = 40% of the min dimension?
        const minDim = Math.min(this.width, this.height);
        this.scale = minDim / 120; // 60 radius * 2 = 120 diameter
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.resetParticle({}, true));
        }
    }

    resetParticle(p, initial = false) {
        return {
            id: p.id || Math.random(),
            angle: Math.random() * Math.PI * 2,
            // Initial spawn favored outer, reset spawns outer edge
            radius: initial ? 10 + Math.random() * 50 : 55 + Math.random() * 5,
            speed: 0.2 + Math.random() * 0.5,
            size: 0.2 + Math.random() * 0.8,
            length: 1.5 + Math.random() * 5,
            opacityBase: 0.1 + Math.random() * 0.6,
        };
    }

    handleMouseMove(e) {
        // Calculate tilt based on center of screen/hero
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalize -0.5 to 0.5
        const x = (e.clientX - centerX) / window.innerWidth;
        const y = (e.clientY - centerY) / window.innerHeight;

        this.targetTilt = { x: x * 20, y: y * 20 };
    }

    animate(time) {
        if (!this.lastTime) this.lastTime = time;
        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        const dt = Math.min(deltaTime, 50) / 16.67; // Normalize to ~60fps

        // 1. Tilt Camera (Inertia)
        // Apply CSS transform to the canvas element to match the React code's style
        // style={{ transform: perspective(800px) rotateX(...) rotateY(...) }}
        this.currentTilt.x += (this.targetTilt.x - this.currentTilt.x) * 0.05 * dt; // slightly faster than 0.02 for responsiveness
        this.currentTilt.y += (this.targetTilt.y - this.currentTilt.y) * 0.05 * dt;

        this.canvas.style.transform = `perspective(800px) rotateX(${-this.currentTilt.y}deg) rotateY(${this.currentTilt.x}deg)`;


        // 2. Clear Canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Center drawing context
        this.ctx.save();
        this.ctx.translate(this.width / 2, this.height / 2);

        // 3. Update & Draw Particles
        this.particles.forEach(p => {
            // --- PHYSICS ---

            // Drift (Suction)
            const suctionSpeed = 0.05 + (p.radius / 100);
            p.radius -= (suctionSpeed * p.speed * dt);

            // Respawn
            if (p.radius < 2) {
                Object.assign(p, this.resetParticle(p));
            }

            // Angular Velocity
            const angularSpeed = (0.01 + (1.5 / (p.radius + 10))) * p.speed * dt;
            p.angle += angularSpeed;

            // --- DRAWING ---

            // Calculate Loop Offset for visual spiraling
            // +1.57 (90deg) is perpendicular. -0.26 (15deg) is the inward spiral offset.
            const spiralOffset = 15 * (Math.PI / 180);
            const rotationRad = p.angle + (Math.PI / 2) - spiralOffset;

            // Stretch logic
            const stretchFactor = p.length * (1 + (50 - p.radius) / 20);

            // Opacity logic
            let opacity = p.opacityBase;
            if (p.radius > 45) opacity *= (55 - p.radius) / 10; // Fade out at edge
            if (p.radius < 10) opacity *= p.radius / 10;       // Fade out at center

            // Converting logical units to screen pixels
            const screenX = Math.cos(p.angle) * p.radius * this.scale;
            const screenY = Math.sin(p.angle) * p.radius * this.scale;

            const sizeX = p.size * 0.8 * this.scale;
            const sizeY = p.size * stretchFactor * this.scale;

            this.ctx.save();
            this.ctx.translate(screenX, screenY);
            this.ctx.rotate(rotationRad);

            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, sizeX, sizeY, 0, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, opacity)})`;
            // Using logic: mixBlendMode: 'screen' (can set on ctx globalCompositeOperation but might differ)
            this.ctx.fill();
            this.ctx.restore();
        });

        this.ctx.restore();

        requestAnimationFrame((t) => this.animate(t));
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Skip on mobile devices for performance
    if (window.innerWidth < 768) {
        console.log('🌀 Maelstrom animation skipped on mobile');
        const canvas = document.getElementById('maelstromCanvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
        return;
    }

    new Maelstrom();
    console.log('🌀 Maelstrom animation initialized');
});
