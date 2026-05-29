import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const textRef = useRef(null);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const textEl = textRef.current;

    if (!cursor || !ring || !dot) return;

    // Configurar estados iniciais usando GSAP para evitar flashes
    gsap.set(cursor, { opacity: 0 });
    gsap.set(ring, { xPercent: -50, yPercent: -50, scale: 1 });
    gsap.set(dot, { xPercent: -50, yPercent: -50 });

    // Otimização de Performance: GSAP quickSetter para atualizar posições X e Y sem re-renders
    const setRingX = gsap.quickSetter(ring, 'x', 'px');
    const setRingY = gsap.quickSetter(ring, 'y', 'px');
    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');

    let mouse = { x: 0, y: 0 };
    let ringPos = { x: 0, y: 0 };
    let isMoving = false;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Mostrar o cursor no primeiro movimento de mouse
      if (!isMoving) {
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
        isMoving = true;
      }

      // O ponto interno (dot) segue o mouse imediatamente (0 delay)
      setDotX(mouse.x);
      setDotY(mouse.y);
    };

    // Animar o anel externo com um lag suave (efeito magnético fluido)
    const renderLoop = () => {
      // Interpolação Linear (Lerp) para atraso elegante e suave do anel
      ringPos.x += (mouse.x - ringPos.x) * 0.15;
      ringPos.y += (mouse.y - ringPos.y) * 0.15;

      setRingX(ringPos.x);
      setRingY(ringPos.y);

      requestAnimationFrame(renderLoop);
    };

    // Detectar hover em elementos com interações especiais
    const onMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (!target) return;

      const cursorType = target.getAttribute('data-cursor');

      if (cursorType === 'view') {
        // Modo "View Print" - Expande e adiciona texto elegante
        setCursorText('VIEW PRINT');
        gsap.to(ring, {
          width: 90,
          height: 90,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: 'transparent',
          duration: 0.4,
          ease: 'power3.out'
        });
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.3 });
        gsap.to(textEl, { opacity: 1, scale: 1, color: '#0A0A0A', duration: 0.4 });
      } else if (cursorType === 'pointer') {
        // Hover básico de botões/links
        gsap.to(ring, {
          scale: 1.5,
          borderColor: '#FFFFFF',
          borderWidth: '1.5px',
          duration: 0.3,
          ease: 'power3.out'
        });
        gsap.to(dot, { scale: 1.5, duration: 0.3 });
      } else if (cursorType === 'close') {
        setCursorText('CLOSE');
        gsap.to(ring, {
          width: 70,
          height: 70,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: '#FFFFFF',
          duration: 0.4,
          ease: 'power3.out'
        });
        gsap.to(dot, { scale: 0, duration: 0.3 });
        gsap.to(textEl, { opacity: 1, scale: 1, color: '#FFFFFF', duration: 0.4 });
      }
    };

    const onMouseOut = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (!target) return;

      // Resetar cursor para o estado original
      gsap.to(ring, {
        width: 40,
        height: 40,
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: '#FFFFFF',
        borderWidth: '1px',
        duration: 0.4,
        ease: 'power3.out'
      });
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(textEl, { opacity: 0, scale: 0.8, duration: 0.3 });
    };

    // Lógica MatchMedia para desativar o cursor inteiramente no Mobile/Tablet
    // Para manter 60fps em touch, desativamos as escutas de eventos.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      // Apenas adiciona os eventos se for Desktop
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseover', onMouseOver);
      window.addEventListener('mouseout', onMouseOut);
      
      const animFrame = requestAnimationFrame(renderLoop);

      return () => {
        // Remover eventos e frames na limpeza do desktop
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseover', onMouseOver);
        window.removeEventListener('mouseout', onMouseOut);
        cancelAnimationFrame(animFrame);
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor">
        <div ref={ringRef} className="custom-cursor__ring">
          <span ref={textRef} className="custom-cursor__text">
            {cursorText}
          </span>
        </div>
        <div ref={dotRef} className="custom-cursor__dot" />
      </div>

      <style>{`
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        }

        .custom-cursor__ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          border: 1px solid #FFFFFF;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform, width, height, background-color, border-color;
        }

        .custom-cursor__dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 6px;
          height: 6px;
          background-color: #FFFFFF;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          will-change: transform;
        }

        .custom-cursor__text {
          font-family: var(--font-sans);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-align: center;
          opacity: 0;
          transform: scale(0.8);
          white-space: nowrap;
          will-change: opacity, transform;
        }

        /* Ocultar em telas touch via Media Query também por segurança */
        @media (max-width: 1024px) {
          .custom-cursor {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
