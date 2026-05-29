import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logoImg from '../../assets/logo.png'; // Importação local de luxo

gsap.registerPlugin(ScrollTrigger);

export default function Header() {
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    // Lógica "Show on Scroll Up, Hide on Scroll Down" clássica de Awwwards
    // Desta forma, mantemos a interface 100% limpa enquanto o usuário navega pelas obras
    const showAnim = gsap.from(header, {
      yPercent: -100,
      paused: true,
      duration: 0.4,
      ease: 'power2.out'
    }).progress(1); // Inicia já visível

    ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        // Se scrollar para baixo, esconde o header. Se scrollar para cima, mostra.
        if (self.direction === 1) {
          showAnim.reverse();
        } else {
          showAnim.play();
        }
      }
    });

    return () => {
      // Limpeza dos gatilhos do ScrollTrigger
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.start === 'top top' && t.vars.end === 'max') {
          t.kill();
        }
      });
    };
  }, []);

  return (
    <>
      <header ref={headerRef} className="header">
        <div className="header__container">
          <a href="#" className="header__logo-wrapper" data-cursor="pointer">
            <img 
              src={logoImg} 
              alt="M. Takahama Logo" 
              className="header__logo-img" 
            />
          </a>
          
          <nav className="header__nav">
            <a href="#collections" className="header__link" data-cursor="pointer">
              Coleções
            </a>
            <a href="#services-photographer" className="header__link" data-cursor="pointer">
              Serviços
            </a>
            <a href="#services-quadros" className="header__link" data-cursor="pointer">
              Encomendas
            </a>
            <a 
              href="https://wa.me/5512981550281" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="header__link" 
              data-cursor="pointer"
            >
              Contato
            </a>
          </nav>
        </div>
      </header>

      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: var(--header-height);
          display: flex;
          align-items: center;
          z-index: 1000;
          mix-blend-mode: difference; /* Efeito premium que inverte cores conforme o fundo */
          will-change: transform;
        }

        .header__container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 var(--space-md);
        }

        .header__logo-wrapper {
          display: flex;
          align-items: center;
          height: 100%;
        }

        .header__logo-img {
          height: 38px; /* Altura ideal e sutil de luxo */
          width: auto;
          object-fit: contain;
          transition: transform 0.4s var(--transition-smooth);
        }

        .header__logo-wrapper:hover .header__logo-img {
          transform: scale(1.05);
        }

        .header__nav {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .header__link {
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          font-weight: 400;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          position: relative;
          padding: 5px 0;
        }

        /* Micro-animação Underline do Zero ao Centro */
        .header__link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 1px;
          background-color: #FFFFFF;
          transition: width var(--duration-normal) var(--transition-smooth),
                      left var(--duration-normal) var(--transition-smooth);
        }

        .header__link:hover::after {
          width: 100%;
          left: 0;
        }

        @media (max-width: 768px) {
          .header__container {
            padding: 0 var(--space-sm);
          }
          .header__link {
            font-size: 10px;
            letter-spacing: 0.1em;
          }
          .header__nav {
            gap: var(--space-sm);
          }
        }
      `}</style>
    </>
  );
}
