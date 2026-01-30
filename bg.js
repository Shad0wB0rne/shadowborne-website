const canvas = document.getElementById('cyber-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];


const CONFIG = {
    particleCount: 150,
    connectionDist: 100,
    mouseDist: 180,
    baseSpeed: 0.8,
    colorBase: 'rgba(50, 50, 50, 0.4)',  // Dark Grey (Idle nodes)
    colorSafe: 'rgba(0, 243, 255, ',     // Cyan (Safe connections)
    colorWarn: 'rgba(255, 0, 60, '       // Crimson (Active/Danger)
};


function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * CONFIG.baseSpeed;
        this.vy = (Math.random() - 0.5) * CONFIG.baseSpeed;
        this.size = Math.random() * 2 + 0.5;


        this.glitchChance = 0.005;
    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        // Wall bounce
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;


        if (Math.random() < this.glitchChance) {
            this.x += (Math.random() - 0.5) * 20;
            this.y += (Math.random() - 0.5) * 20;
        }
    }

    draw() {
        ctx.fillStyle = CONFIG.colorBase;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}


let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

function init() {
    resize();
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
        p.update();
        p.draw();


        for (let j = index; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.connectionDist) {

                let opacity = 1 - (dist / CONFIG.connectionDist);
                let color = CONFIG.colorBase;


                if (mouse.x) {
                    const mouseDx = p.x - mouse.x;
                    const mouseDy = p.y - mouse.y;
                    const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

                    if (mouseDist < CONFIG.mouseDist) {
                        ctx.lineWidth = 1.5;
                        ctx.strokeStyle = CONFIG.colorWarn + (opacity * 0.8) + ')';
                    } else {

                        ctx.lineWidth = 0.5;
                        ctx.strokeStyle = 'rgba(50, 50, 50, ' + (opacity * 0.1) + ')';
                    }
                } else {

                    ctx.lineWidth = 0.5;
                    ctx.strokeStyle = 'rgba(50, 50, 50, ' + (opacity * 0.1) + ')';
                }

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resize();
    particles = [];
    init();
});

init();
animate();