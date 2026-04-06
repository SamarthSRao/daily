import { useEffect, useRef } from "react";

export default function CursorCat() {
  const catRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 100, y: 100 });
  const catPos = useRef({ x: 100, y: 100 });
  const isMoving = useRef(false);
  const isFlipped = useRef(false);
  const frame = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        targetPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    let animationId: number;
    let lastTick = 0;

    const moveCat = (timestamp: number) => {
      const dx = targetPos.current.x - catPos.current.x - 25;
      const dy = targetPos.current.y - catPos.current.y - 25;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        isMoving.current = true;
        isFlipped.current = dx < 0;
        const speed = 0.08;
        catPos.current.x += dx * speed;
        catPos.current.y += dy * speed;
      } else {
        isMoving.current = false;
      }

      // Update frame every 100ms
      if (timestamp - lastTick > 100) {
        if (isMoving.current) {
          frame.current = (frame.current + 1) % 4;
        }
        lastTick = timestamp;
      }

      if (catRef.current) {
        const bounce = isMoving.current ? (frame.current % 2 === 0 ? -4 : 0) : 0;
        const spriteX = isMoving.current ? (frame.current % 2) * 100 : 0;
        
        catRef.current.style.transform = `translate3d(${catPos.current.x}px, ${catPos.current.y}px, 0) scaleX(${isFlipped.current ? -1 : 1}) translateY(${bounce}px)`;
        catRef.current.style.backgroundPosition = `${spriteX}% 0%`;
      }

      animationId = requestAnimationFrame(moveCat);
    };

    animationId = requestAnimationFrame(moveCat);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div 
      ref={catRef}
      className="cursor-cat"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '50px',
        height: '50px',
        pointerEvents: 'none',
        zIndex: 99999,
        imageRendering: 'pixelated',
        backgroundImage: 'url(/cat-sprite.png)',
        backgroundSize: '200% 100%',
        backgroundRepeat: 'no-repeat',
        willChange: 'transform',
      }}
    />
  );
}
