import { useState, useEffect } from "react";

export default function CursorCat() {
  const [catPos, setCatPos] = useState({ x: 100, y: 100 });
  const [targetPos, setTargetPos] = useState({ x: 100, y: 100 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        setTargetPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const moveCat = () => {
      setCatPos(prev => {
        const dx = targetPos.x - prev.x - 25; // center offset
        const dy = targetPos.y - prev.y - 25;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
          setIsMoving(false);
          return prev;
        }

        setIsMoving(true);
        setIsFlipped(dx < 0);

        const speed = 0.08; // smooth chasing factor
        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed,
        };
      });
      
      if (isMoving) {
        setFrame(f => (f + 1) % 4);
      }
      
      requestAnimationFrame(moveCat);
    };

    const animationId = requestAnimationFrame(moveCat);
    return () => cancelAnimationFrame(animationId);
  }, [targetPos, isMoving]);

  return (
    <div 
      className="cursor-cat"
      style={{
        position: 'fixed',
        left: catPos.x,
        top: catPos.y,
        width: '50px',
        height: '50px',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `scaleX(${isFlipped ? -1 : 1}) translateY(${isMoving ? (frame % 2 === 0 ? '-4px' : '0px') : '0px'})`,
        transition: 'transform 0.1s linear',
        imageRendering: 'pixelated',
        backgroundImage: 'url(/cat-sprite.png)',
        backgroundSize: '200% 100%', // Assume simple 2-frame sprite sheet
        backgroundPosition: isMoving ? `${(frame % 2) * 100}% 0%` : '0% 0%',
      }}
    />
  );
}
