import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GalleryItem({ id, title, year, category, aspect = 'portrait', imageUrl, onClick }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imageRef.current;
    
    if (!container || !img) return;

    const mm = gsap.matchMedia();

    // LÓGICA DE TRANSIÇÃO E PARALLAX RESPONSIVO
    mm.add({
      // Se for desktop, habilita parallax fluido
      isDesktop: "(min-width: 1025px)",
      // Se for mobile, usa scroll natural para salvar bateria e manter 60fps
      isMobile: "(max-width: 1024px)"
    }, (context) => {
      const { isDesktop } = context.conditions;

      if (isDesktop) {
        // Efeito Parallax sutil de alta performance nas fotos (imagem move de Y -10% para +10%)
        gsap.fromTo(img, 
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom', // Quando o topo do container entra na parte inferior da tela
              end: 'bottom top',   // Quando a base do container sai pela parte superior da tela
              scrub: 0.1,           // Reação instantânea e ultra-snappy ao scroll (100ms de lag)
            }
          }
        );
      } else {
        // Garantir reset total em telas menores
        gsap.set(img, { yPercent: 0 });
      }
    });

    // Revelação inercial das fotos ao entrar na tela (Fade-in com elevação suave rápida)
    gsap.fromTo(container,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8, // Fade de entrada muito mais dinâmico
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 95%', // Dispara imediatamente ao apontar na tela
          toggleActions: 'play none none none',
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  // Mapear classes de proporção rígidas
  const aspectClass = 
    aspect === 'portrait' ? 'aspect-portrait' : 
    aspect === 'landscape' ? 'aspect-landscape' : 'aspect-square';

  return (
    <>
      <div 
        ref={containerRef} 
        className={`gallery-item ${aspectClass}`}
        onClick={onClick}
        data-cursor="view"
      >
        <div className="gallery-item__wrapper">
          {/* Seletor sofisticado de imagem sem placeholders genéricos */}
          <div className="gallery-item__placeholder-bg">
            <span className="gallery-item__logo-bg">FINE ART</span>
          </div>
          {imageUrl ? (
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt={title} 
              className="gallery-item__img"
              loading="lazy"
            />
          ) : (
            <div ref={imageRef} className="gallery-item__fallback-img" />
          )}
          
          {/* Overlay de Metadados Conceituais (Quiet Luxury) */}
          <div ref={infoRef} className="gallery-item__info">
            <div className="gallery-item__info-top">
              <span className="gallery-item__category">{category}</span>
              <span className="gallery-item__year">{year}</span>
            </div>
            <h3 className="gallery-item__title">{title}</h3>
          </div>
        </div>
      </div>

      <style>{`
        .gallery-item {
          width: 100%;
          cursor: pointer;
          position: relative;
          background-color: #121212;
          overflow: hidden;
          will-change: transform, opacity;
        }

        .gallery-item__wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .gallery-item__placeholder-bg {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #111111;
          z-index: 1;
          pointer-events: none;
        }

        .gallery-item__logo-bg {
          font-family: var(--font-serif);
          font-size: var(--fs-ui);
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.03);
          text-transform: uppercase;
        }

        .gallery-item__img, .gallery-item__fallback-img {
          width: 100%;
          height: 130%; /* Mais alto para suportar o parallax sem expor as bordas */
          object-fit: cover;
          position: absolute;
          top: -15%;
          left: 0;
          z-index: 2;
          filter: grayscale(100%) contrast(1.15); /* P&B clássico dramático */
          transition: filter var(--duration-normal) var(--transition-smooth);
          will-change: transform;
        }

        .gallery-item__fallback-img {
          background: linear-gradient(180deg, #181818 0%, #0c0c0c 100%);
        }

        /* Hover: A fotografia ganha vida com uma sutil restauração cromática ou suavização */
        .gallery-item:hover .gallery-item__img {
          filter: grayscale(0%) contrast(1.05);
        }

        /* Efeito de Escala suave do Wrapper no Hover */
        .gallery-item:hover .gallery-item__wrapper {
          transform: scale(1.01);
          transition: transform 1.2s var(--transition-smooth);
        }

        /* Overlay Minimalista de Informações */
        .gallery-item__info {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: var(--space-md);
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 6px;
          opacity: 0;
          transform: translateY(15px);
          transition: opacity var(--duration-normal) var(--transition-smooth),
                      transform var(--duration-normal) var(--transition-smooth);
          pointer-events: none;
        }

        .gallery-item:hover .gallery-item__info {
          opacity: 1;
          transform: translateY(0);
        }

        .gallery-item__info-top {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          font-weight: 300;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
        }

        .gallery-item__title {
          font-family: var(--font-serif);
          font-size: var(--fs-h3);
          color: #FFFFFF;
          font-weight: 400;
          letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .gallery-item__info {
            opacity: 1;
            transform: translateY(0);
            padding: var(--space-sm);
            background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
          }
          .gallery-item__title {
            font-size: var(--fs-body);
          }
        }
      `}</style>
    </>
  );
}
