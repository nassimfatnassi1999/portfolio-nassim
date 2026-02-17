import { useEffect, useRef } from 'react';

type Star = {
    x: number;
    y: number;
    radius: number;
    opacity: number;
};

type ShootingStar = {
    x: number;
    y: number;
    length: number;
    speed: number;
    opacity: number;
    active: boolean;
};

export function NightSky() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let stars: Star[] = [];
        let shootingStar: ShootingStar | null = null;
        let width = 0;
        let height = 0;

        const initStars = () => {
            stars = [];
            const numStars = Math.floor((width * height) / 4000); // Density
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5,
                    opacity: Math.random() * 0.3 + 0.1, // 0.1 to 0.4
                });
            }
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initStars();
        };

        const createShootingStar = () => {
            const startX = Math.random() * width;
            const startY = Math.random() * (height / 2); // Start in top half
            shootingStar = {
                x: startX,
                y: startY,
                length: Math.random() * 80 + 20,
                speed: Math.random() * 10 + 5,
                opacity: 1,
                active: true,
            };
        };

        // Initialize
        resize();
        window.addEventListener('resize', resize);

        // Shooting star timer
        const scheduleShootingStar = () => {
            const delay = Math.random() * 2000 + 8000; // 8-10s
            setTimeout(() => {
                createShootingStar();
                scheduleShootingStar();
            }, delay);
        };
        scheduleShootingStar();

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw Gradient Background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#0a0a23');
            gradient.addColorStop(1, '#1a1a2e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Draw Static Stars
            stars.forEach((star) => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();
            });

            // Update and Draw Shooting Star
            if (shootingStar && shootingStar.active) {
                shootingStar.x += shootingStar.speed;
                shootingStar.y += shootingStar.speed; // Diagonal movement
                shootingStar.opacity -= 0.01;

                if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
                    shootingStar.active = false;
                } else {
                    const tailX = shootingStar.x - shootingStar.length;
                    const tailY = shootingStar.y - shootingStar.length;

                    const gradient = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                    ctx.beginPath();
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 2;
                    ctx.moveTo(tailX, tailY);
                    ctx.lineTo(shootingStar.x, shootingStar.y);
                    ctx.stroke();
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ width: '100%', height: '100%' }}
        />
    );
}
