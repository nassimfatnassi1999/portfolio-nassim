import React from 'react';

export function RamadanLantern() {
    return (
        <div className="absolute top-0 right-10 lg:right-20 z-20 hidden md:block animate-fade-in-down origin-top" style={{ animationDelay: '0.5s' }}>
            <div className="relative animate-swing origin-top">
                {/* Cord */}
                <div className="w-1 h-24 bg-gradient-to-b from-yellow-700 to-yellow-500 mx-auto" />

                {/* Hook/Ring */}
                <div className="w-4 h-4 border-2 border-yellow-500 rounded-full mx-auto -mt-1" />

                {/* Lantern Top */}
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[20px] border-b-yellow-500 mx-auto" />

                {/* Lantern Upper Body */}
                <div className="w-16 h-12 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center relative shadow-lg">
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 border-2 border-yellow-300 opacity-50 m-1" />
                </div>

                {/* Lantern Middle (Widest part) */}
                <div className="w-24 h-24 mx-auto bg-gradient-to-b from-red-800 to-red-900 clip-hexagon relative flex items-center justify-center shadow-xl">
                    {/* Inner Glow */}
                    <div className="w-16 h-16 bg-yellow-400/20 blur-md rounded-full animate-golden-pulse" />
                    {/* Glass/Light source */}
                    <div className="w-8 h-12 bg-gradient-to-b from-yellow-200 to-orange-400 rounded-full opacity-90 blur-[2px] animate-pulse" />
                </div>

                {/* Lantern Bottom */}
                <div className="w-12 h-8 mx-auto bg-gradient-to-t from-yellow-600 to-yellow-500 mt-[-5px]" />

                {/* Bottom Point */}
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-yellow-500 mx-auto" />

                {/* Particles */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-yellow-300 rounded-full w-1 h-1 animate-particles-up opacity-0"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Outer Glow Effect */}
            <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-500/20 blur-[60px] rounded-full animate-golden-pulse pointer-events-none" />
        </div>
    );
}
