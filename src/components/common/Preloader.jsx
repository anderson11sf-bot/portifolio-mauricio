import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const counter = counterRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;

    // Bloquear scroll do body enquanto carrega
    document.body.classList.add('lenis-stopped');

    // 1. Animar o contador de progresso de 0 a 100
    const progressVal = { value: 0 };
    
    const tl = gsap.timeline({
      onComplete: () => {
        // Animação de Saída Cinematográfica
        const exitTl = gsap.timeline({
          onComplete: () => {
            // Desbloquear o scroll após o encerramento do preloader
            document.body.classList.remove('lenis-stopped');
            if (onComplete) onComplete();
          }
        });

        exitTl.to([title.querySelectorAll('.char-inner'), subtitle], {
          yPercent: -105,
          duration: 0.8,
          stagger: 0.02,
          ease: 'power4.in'
        })
        .to(counter, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: 'power3.in'
        }, '-=0.4')
        .to(container, {
          yPercent: -100,
          duration: 1.4,
          ease: 'power4.inOut'
        }, '-=0.2');
      }
    });

    // Animação inicial de revelação do título
    tl.to(title.querySelectorAll('.char-inner'), {
      yPercent: 0,
      duration: 1.2,
      stagger: 0.05,
      ease: 'power4.out'
    })
    .to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.6')
    // Simulação rápida e fluida de carregamento
    .to(progressVal, {
      value: 100,
      duration: 3,
      ease: 'power2.out',
      onUpdate: () => {
        const currentVal = Math.floor(progressVal.value);
        setProgress(currentVal);
      }
    }, '-=1');

  }, [onComplete]);

  // Dividir o título em letras para animação de reveal individual
  const titleText = "MAURICIO TAKAHAMA";
  const letters = titleText.split('');

  return (
    <>
      <div ref={containerRef} className="preloader">
        <div className="preloader__content">
          <h1 ref={titleRef} className="preloader__title">
            {letters.map((char, index) => (
              <span key={index} className="char-mask" style={{ marginRight: char === ' ' ? '1.5vw' : '0' }}>
                <span className="char-inner">{char}</span>
              </span>
            ))}
          </h1>
          <p ref={subtitleRef} className="preloader__subtitle">
            FOTOGRAFIA FINE ART & QUADROS COLECIONÁVEIS
          </p>
        </div>

        <div ref={counterRef} className="preloader__counter">
          <span className="preloader__counter-label">loading</span>
          <span className="preloader__counter-number">
            {progress.toString().padStart(3, '0')}
          </span>
        </div>
      </div>

      <style>{`
        .preloader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #0A0A0A;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 99999;
          overflow: hidden;
          will-change: transform;
        }

        .preloader__content {
          text-align: center;
        }

        .preloader__title {
          font-family: var(--font-serif);
          font-size: clamp(2.5rem, 6vw + 0.5rem, 8rem);
          font-weight: 300;
          color: #FFFFFF;
          line-height: 1;
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        .preloader__subtitle {
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          font-weight: 300;
          letter-spacing: 0.3em;
          color: #707070;
          margin-top: 1.5rem;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(15px);
          will-change: opacity, transform;
        }

        .preloader__counter {
          position: absolute;
          bottom: var(--space-md);
          right: var(--space-md);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-family: var(--font-sans);
          color: #FFFFFF;
        }

        .preloader__counter-label {
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #707070;
          margin-bottom: 2px;
        }

        .preloader__counter-number {
          font-size: var(--fs-h3);
          font-weight: 300;
          letter-spacing: -0.02em;
        }

        /* Classes de máscara estendidas */
        .char-mask {
          overflow: hidden;
          display: inline-block;
          vertical-align: bottom;
        }

        .char-inner {
          display: inline-block;
          transform: translateY(105%);
          will-change: transform;
        }

        @media (max-width: 768px) {
          .preloader__counter {
            bottom: var(--space-sm);
            right: var(--space-sm);
          }
        }
      `}</style>
    </>
  );
}
