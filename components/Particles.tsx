'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  style: {
    width: string;
    height: string;
    left: string;
    top: string;
    boxShadow: string;
    animation: string;
    animationDelay: string;
  };
}

export function Particles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Solo generar partículas en el cliente
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      style: {
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        boxShadow: `0 0 ${Math.random() * 10 + 5}px ${
          Math.random() > 0.5 ? '#05d9e8' : '#ff2a6d'
        }`,
        animation: 'float 8s linear infinite',
        animationDelay: `${Math.random() * 5}s`,
      },
    }));
    
    setParticles(newParticles);
  }, []);

  if (!isClient) {
    return null; // No renderizar nada en el servidor
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-cyber-neonCyan/10"
          style={particle.style}
        />
      ))}
    </div>
  );
}
