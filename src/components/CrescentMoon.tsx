import { useEffect, useState } from 'react';

export function CrescentMoon() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        setMounted(true);
    }, []);

    return (
        <div className="absolute -top-10 -left-10 w-[180px] h-[180px] opacity-15 pointer-events-none z-[-1] hidden lg:block select-none">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>
                </defs>

                <path
                    d="M60 10 C 25 10 5 35 5 65 C 5 95 30 110 55 110 C 35 110 20 90 20 65 C 20 35 35 10 60 10 Z"
                    stroke="url(#moonGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="transparent"
                    className={mounted ? "animate-draw-stroke" : ""}
                    strokeDasharray="300"
                    strokeDashoffset="300"
                    style={{
                        filter: "drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))"
                    }}
                />

                {/* Twinkling Stars appearing after moon */}
                <circle cx="70" cy="30" r="1" fill="#FFD700" className="animate-fade-in-star opacity-0" style={{ animationDelay: '2.2s' }} />
                <circle cx="80" cy="50" r="0.8" fill="#FFD700" className="animate-fade-in-star opacity-0" style={{ animationDelay: '2.5s' }} />
                <circle cx="65" cy="80" r="1.2" fill="#FFD700" className="animate-fade-in-star opacity-0" style={{ animationDelay: '2.8s' }} />
                <circle cx="45" cy="95" r="0.6" fill="#FFD700" className="animate-fade-in-star opacity-0" style={{ animationDelay: '3.0s' }} />
            </svg>
        </div>
    );
}
