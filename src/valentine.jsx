import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import './valentine.css';

export default function Valentine() {
  const [accepted, setAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState(null);
  const [fireworks, setFireworks] = useState([]);

  const handleMouseMove = (e) => {
    if (accepted) return;
    if (!noButtonPos) return;

    const noButton = document.getElementById('no-button');
    const container = document.querySelector('.min-h-screen');
    if (!noButton || !container) return;

    const rect = noButton.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // mouse relative to container
    const relMouseX = mouseX - cRect.left;
    const relMouseY = mouseY - cRect.top;

    // current button center relative to container
    const btnCenterX = (rect.left - cRect.left) + rect.width / 2;
    const btnCenterY = (rect.top - cRect.top) + rect.height / 2;

    const dx = btnCenterX - relMouseX;
    const dy = btnCenterY - relMouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const threshold = 140; // distance to start avoiding
    if (dist < threshold) {
      const nx = dist === 0 ? (Math.random() > 0.5 ? 1 : -1) : dx / dist;
      const ny = dist === 0 ? (Math.random() > 0.5 ? 1 : -1) : dy / dist;

      const maxMove = 110; // don't move too far
      const minMove = 20;
      const move = minMove + (1 - dist / threshold) * (maxMove - minMove);

      // current absolute left/top (relative to container)
      const curLeft = rect.left - cRect.left;
      const curTop = rect.top - cRect.top;

      // propose new position
      let newLeft = curLeft + nx * move + (Math.random() - 0.5) * 12 * (1 - dist / threshold);
      let newTop = curTop + ny * move + (Math.random() - 0.5) * 12 * (1 - dist / threshold);

      // clamp inside container with small padding
      const padding = 12;
      const maxLeft = cRect.width - rect.width - padding;
      const maxTop = cRect.height - rect.height - padding;

      newLeft = Math.max(padding, Math.min(maxLeft, newLeft));
      newTop = Math.max(padding, Math.min(maxTop, newTop));

      setNoButtonPos({ x: newLeft, y: newTop });
    }
  };

  const handleYesClick = () => {
    setAccepted(true);
    createFireworks();
  };

  const createFireworks = () => {
    const colors = ['#ff69b4', '#ff1493', '#ff85c1', '#ffc0cb', '#ff6b9d'];
    const newFireworks = [];

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const firework = {
          id: Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4
        };
        setFireworks(prev => [...prev, firework]);
        
        setTimeout(() => {
          setFireworks(prev => prev.filter(f => f.id !== firework.id));
        }, 1000);
      }, i * 50);
    }
  };

  useEffect(() => {
    if (accepted) {
      const interval = setInterval(createFireworks, 2000);
      return () => clearInterval(interval);
    }
  }, [accepted]);

  // initialize button absolute position (relative to container)
  useEffect(() => {
    const noButton = document.getElementById('no-button');
    const container = document.querySelector('.min-h-screen');
    if (noButton && container && !noButtonPos) {
      const bRect = noButton.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      setNoButtonPos({ x: bRect.left - cRect.left, y: bRect.top - cRect.top });
    }
  }, [noButtonPos]);

  // keep button inside container on resize
  useEffect(() => {
    const handleResize = () => {
      const noButton = document.getElementById('no-button');
      const container = document.querySelector('.min-h-screen');
      if (!noButton || !container || !noButtonPos) return;
      const rect = noButton.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();

      const padding = 12;
      const maxLeft = cRect.width - rect.width - padding;
      const maxTop = cRect.height - rect.height - padding;

      const clampedX = Math.max(padding, Math.min(maxLeft, noButtonPos.x));
      const clampedY = Math.max(padding, Math.min(maxTop, noButtonPos.y));
      if (clampedX !== noButtonPos.x || clampedY !== noButtonPos.y) {
        setNoButtonPos({ x: clampedX, y: clampedY });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [noButtonPos]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: accepted ? '#ffc0cb' : '#ffffff' }}
      onMouseMove={handleMouseMove}
    >
      {/* Feux d'artifice */}
      {fireworks.map(firework => (
        <div
          key={firework.id}
          className="absolute animate-ping"
          style={{
            left: firework.x,
            top: firework.y,
            width: firework.size,
            height: firework.size,
            backgroundColor: firework.color,
            borderRadius: '50%',
          }}
        />
      ))}

      <div className="text-center z-10">
        {/* Hello Kitty Logo */}
        <div className="hello-icon">
          <div className="kitty-container">
            <div className="ear left" />
            <div className="ear right" />

            <div className="face">
              <div className="eyes">
                <div className="eye" />
                <div className="eye" />
              </div>
              <div className="nose" />
              <div className="whiskers left">
                <span />
                <span />
              </div>
              <div className="whiskers right">
                <span />
                <span />
              </div>
            </div>

            <div className="bow">
              <Heart className="heart-svg" />
            </div>
          </div>
        </div>

        {/* Texte */}
        <h1 className="text-4xl font-bold mb-12">
          {accepted ? (
            <span className="text-pink-500 animate-pulse">Youpi !!! Je t'aime!!!!!!!!</span>
          ) : (
            <>
              <span className="text-black">Veux-tu être ma </span>
              <span className="text-pink-500">valentine</span>
              <span className="text-black"> ?</span>
            </>
          )}
        </h1>

        {/* Boutons */}
        {!accepted && (
          <div className="flex gap-8 justify-center items-center">
            {/* Bouton Oui */}
            <button
              onClick={handleYesClick}
              className="bg-pink-500 text-white px-12 py-4 rounded-lg text-xl font-semibold hover:bg-pink-600 transition-all transform hover:scale-110 shadow-lg"
            >
              Oui
            </button>

            {/* Bouton Non */}
            <button
              id="no-button"
              className="bg-white text-black px-12 py-4 rounded-lg text-xl font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all shadow-lg absolute"
              style={
                noButtonPos
                  ? {
                      left: `${noButtonPos.x}px`,
                      top: `${noButtonPos.y}px`,
                      transition: 'left 0.25s ease-out, top 0.25s ease-out'
                    }
                  : { visibility: 'hidden' }
              }
            >
              Non
            </button>
          </div>
        )}

        {accepted && (
          <div className="mt-8 flex justify-center gap-4">
            <Heart className="w-12 h-12 fill-pink-500 text-pink-500 animate-bounce" />
            <Heart className="w-12 h-12 fill-red-500 text-red-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <Heart className="w-12 h-12 fill-pink-400 text-pink-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        )}
      </div>
    </div>
  );
}
