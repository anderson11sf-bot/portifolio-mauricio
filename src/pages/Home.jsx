import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GalleryItem from '../components/portfolio/GalleryItem';
import takahamaImg from '../assets/takahama.jpg'; // Foto oficial do fotógrafo integrada

// Registrar o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function Home({ onSelectPhoto, photos }) {
  const heroTextRef = useRef(null);
  const infoTextRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const tl = gsap.timeline();

    // 1. Animação de Entrada Estilo Peter Lindbergh (Obys Agency)
    // Usamos revelação vertical (y) para evitar conflitos horizontais e garantir visibilidade 100% íntegra no lobby
    tl.fromTo('.hero-center-portrait',
      { clipPath: 'inset(100% 0 0 0)', scale: 1.25 },
      { 
        clipPath: 'inset(0% 0 0 0)', 
        scale: 1, 
        duration: 1.6, 
        ease: 'power4.inOut',
        delay: 0.2
      }
    )
    .fromTo('.top-title',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out' },
      '-=1.2'
    )
    .fromTo('.bottom-title',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out' },
      '-=1.2'
    )
    .fromTo('.animate-meta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' },
      '-=0.8'
    );

    // 2. Parallax de Scroll Responsivo (GSAP matchMedia)
    mm.add({
      isDesktop: "(min-width: 769px)",
      isMobile: "(max-width: 768px)"
    }, (context) => {
      const { isDesktop } = context.conditions;

      if (isDesktop) {
        // Desktop: Parallax Horizontal Sutil de 12%
        gsap.to('.top-title', {
          xPercent: -12,
          scrollTrigger: {
            trigger: '.hero-split',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        gsap.to('.bottom-title', {
          xPercent: 12,
          scrollTrigger: {
            trigger: '.hero-split',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        // Desktop: Parallax Vertical de 15% e Escala
        gsap.to('.hero-center-portrait', {
          yPercent: 15,
          scale: 0.95,
          scrollTrigger: {
            trigger: '.hero-split',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      } else {
        // Mobile: Parallax Horizontal Sutil (Sem cortar as letras e mantendo dinamismo!)
        gsap.to('.top-title', {
          xPercent: -7,
          scrollTrigger: {
            trigger: '.hero-split',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        gsap.to('.bottom-title', {
          xPercent: 7,
          scrollTrigger: {
            trigger: '.hero-split',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        // Mobile: Parallax Vertical muito suave e estável (sem escala para evitar GPU stutters)
        gsap.to('.hero-center-portrait', {
          yPercent: 6,
          scrollTrigger: {
            trigger: '.hero-split',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        // GATILHO DE CENTRO DA TELA PARA AS OUTRAS FOTOS DA HOME (MOBILE)
        // 1. Retrato do Hero
        ScrollTrigger.create({
          trigger: '.hero-portrait-box',
          start: 'top 62%',
          end: 'bottom 38%',
          toggleClass: { targets: '.hero-portrait-box', className: 'is-centered' }
        });

        // 2. Imagem de Serviços 1
        ScrollTrigger.create({
          trigger: '.service-image-box',
          start: 'top 62%',
          end: 'bottom 38%',
          toggleClass: { targets: '.service-image-box', className: 'is-centered' }
        });

        // 3. Imagem de Serviços 2 (Moldura Flutuante)
        ScrollTrigger.create({
          trigger: '.service-image-box-float',
          start: 'top 62%',
          end: 'bottom 38%',
          toggleClass: { targets: '.service-image-box-float', className: 'is-centered' }
        });
      }
    });

    // Animações para as novas Seções de Landing Page Fullscreen
    // Seção 1: Photographer Services
    const serviceContent = document.querySelector('.col-service-content');
    const serviceImage = document.querySelector('.service-image-box');

    if (serviceContent && serviceImage) {
      gsap.fromTo(serviceContent.querySelectorAll('span, h2, p, button'),
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: serviceContent,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo(serviceImage,
        { clipPath: 'inset(100% 0 0 0)', scale: 1.1 },
        {
          clipPath: 'inset(0% 0 0 0)',
          scale: 1,
          duration: 1.6,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: serviceImage,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Seção 2: Fine Art Commissions
    const commissionContent = document.querySelector('.col-service-content.animate-split-reveal-right');
    const commissionImage = document.querySelector('.service-image-box-float');
    const pillars = document.querySelectorAll('.pillar-item');

    if (commissionContent && commissionImage) {
      gsap.fromTo(commissionContent.querySelectorAll('.service-label-gold, h2, button'),
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: commissionContent,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo(pillars,
        { opacity: 0, y: 30, rotateX: 20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: commissionContent,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo(commissionImage,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: commissionImage,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    return () => {
      mm.revert();
    };
  }, [photos]);

  return (
    <>
      <main className="home-lobby">
        
        {/* SECTION: HERO / APRESENTAÇÃO SPLIT ESTILO PETER LINDBERGH */}
        <section className="hero-split">
          
          {/* Metadata Superior Esquerda */}
          <div className="hero-meta top-left animate-meta">
            <span className="meta-brand">M. TAKAHAMA</span>
            <span className="meta-title">Mauricio Takahama</span>
            <span className="meta-subtitle">Fotógrafo(a) Fine Art</span>
          </div>

          {/* Metadata Superior Direita */}
          <div className="hero-meta top-right animate-meta">
            <span className="meta-item">🌿 Nature</span>
            <span className="meta-item">🥾 Adventure</span>
          </div>

          {/* O Retrato Centralizado que se expande */}
          <div className="hero-center-portrait">
            <div className="hero-portrait-box">
              <img 
                src={takahamaImg} 
                alt="Fotógrafo Mauricio Takahama" 
                className="hero-portrait-img" 
              />
            </div>
          </div>

          {/* Os Títulos Monumentais Divididos */}
          <div className="hero-title-container">
            <h1 className="hero-split-title top-title font-serif">MAURICIO</h1>
            <h1 className="hero-split-title bottom-title font-serif">TAKAHAMA</h1>
          </div>

          {/* Metadata Inferior Esquerda */}
          <div className="hero-meta bottom-left animate-meta">
            <span className="meta-desc">🖼 Quadros personalizados com edições limitadas</span>
            <span className="meta-desc">🖼 Fotos de natureza para decoração</span>
          </div>

          {/* Indicador de Scroll Inferior Direito */}
          <div className="hero-scroll-indicator animate-meta">
            <span>ROLE PARA EXPLORAR</span>
            <div className="scroll-indicator-line" />
          </div>

        </section>

        {/* SECTION: GALERIA DE OBRAS (LOBBY ASSIMÉTRICO COM OS 6 PROJETOS REAIS) */}
        <section id="collections" className="gallery-section">
          
          {/* Par de Imagens 1 (Arquitetura) */}
          <div className="grid-luxury gallery-row">
            <div className="col-left-5">
              <GalleryItem 
                {...photos[0]}
                onClick={() => onSelectPhoto(photos[0])}
              />
            </div>
            <div className="col-right-5-desc">
              <span className="row-number">01 / COLEÇÃO</span>
              <h3 className="row-heading">Arquitetura Sagrada</h3>
              <p className="row-text">
                Uma busca poética pelas linhas cruas e geometrias de concreto sob as sombras e o contraste do preto e branco japonês.
              </p>
            </div>
          </div>

          {/* Imagem Única 2 (Quadros - Horizontal Monumental) */}
          <div className="grid-luxury gallery-row">
            <div className="col-center-10">
              <GalleryItem 
                {...photos[1]}
                onClick={() => onSelectPhoto(photos[1])}
              />
            </div>
          </div>

          {/* Par de Imagens 3 (Paisagens e Detalhes desalinhados) */}
          <div className="grid-luxury gallery-row flex-row-reverse">
            <div className="col-right-6">
              <GalleryItem 
                {...photos[2]}
                onClick={() => onSelectPhoto(photos[2])}
              />
            </div>
            <div className="col-left-4" style={{ marginTop: 'var(--space-lg)' }}>
              <GalleryItem 
                {...photos[3]}
                onClick={() => onSelectPhoto(photos[3])}
              />
            </div>
          </div>

          {/* Par de Imagens 4 (Caminhos) */}
          <div className="grid-luxury gallery-row">
            <div className="col-left-6">
              <GalleryItem 
                {...photos[4]}
                onClick={() => onSelectPhoto(photos[4])}
              />
            </div>
            <div className="col-right-5-desc" style={{ marginTop: 'var(--space-md)' }}>
              <span className="row-number">02 / ACERVO</span>
              <h3 className="row-heading">Perspectiva & Caminhos</h3>
              <p className="row-text">
                O registro poético de vias silenciosas e contornos de profundidade, capturando a solidão e a meditação do espaço urbano.
              </p>
            </div>
          </div>

          {/* Imagem Única 5 (Árvores - Retrato Monumental Centralizado) */}
          <div className="grid-luxury gallery-row">
            <div className="col-center-8">
              <GalleryItem 
                {...photos[5]}
                onClick={() => onSelectPhoto(photos[5])}
              />
            </div>
          </div>

        </section>

        {/* FULLSCREEN SECTION 1: SERVIÇOS DE FOTOGRAFIA (FOTÓGRAFO) */}
        <section id="services-photographer" className="fullscreen-service-page theme-dark">
          <div className="grid-luxury fullscreen-service__grid">
            
            {/* Lado Esquerdo: Conteúdo Editorial sutil */}
            <div className="col-service-content">
              <span className="service-label-carmim">Curadoria & Atribuição</span>
              <h2 className="service-title-monumental font-serif">
                A Poética <br />do Espaço
              </h2>
              <p className="service-text-luxury">
                Mauricio Takahama atua sob encomenda dedicada para registrar empreendimentos arquitetônicos de alto padrão, ensaios editoriais Fine Art e projetos autorais conceituais em base internacional. 
              </p>
              <p className="service-text-luxury">
                Uma colaboração meticulosa para curadores, designers de interiores e marcas de luxo que buscam traduzir o espaço tridimensional em silêncio visual, com precisão geométrica rígida e alta fidelidade tonal.
              </p>
              <button 
                onClick={() => window.open('https://wa.me/5512981550281', '_blank')} 
                className="btn-luxury-carmim-arrow"
                data-cursor="pointer"
              >
                Solicitar Conceito & Projetos <span>→</span>
              </button>
            </div>

            {/* Lado Direito: Uma grande e majestosa foto artística em parallax */}
            <div className="col-service-image-showcase">
              <div className="service-image-box">
                {photos[0]?.images[1] ? (
                  <img 
                    src={photos[0].images[1]} 
                    alt="Arquitetura Minimalista - M. Takahama" 
                    className="service-image-parallax"
                  />
                ) : (
                  <div className="service-image-fallback">
                    <span>FINE ART PRINT</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* FULLSCREEN SECTION 2: ENCOMENDA DE QUADROS FINE ART */}
        <section id="services-quadros" className="fullscreen-service-page theme-carmim-deep">
          <div className="grid-luxury fullscreen-service__grid">
            
            {/* Lado Esquerdo: Imagem flutuante ou grid assimétrico de mockup */}
            <div className="col-service-image-showcase flex-center">
              <div className="service-image-box-float">
                {photos[1]?.imageUrl ? (
                  <img 
                    src={photos[1].imageUrl} 
                    alt="Fine Art Print Framed - M. Takahama" 
                    className="service-image-float"
                  />
                ) : (
                  <div className="service-image-fallback">
                    <span>ACERVO FINE ART</span>
                  </div>
                )}
                <div className="service-image-float-label">
                  <span>Edição Limitada 1/25</span>
                  <span>Papel Algodão Hahnemühle</span>
                </div>
              </div>
            </div>

            {/* Lado Direito: Copy de Encomendas de Quadros */}
            <div className="col-service-content animate-split-reveal-right">
              <span className="service-label-gold">Acervo Museológico</span>
              <h2 className="service-title-monumental font-serif">
                O Acervo <br />do Silêncio
              </h2>
              
              <div className="pillars-list">
                <div className="pillar-item">
                  <span className="pillar-num">01</span>
                  <div>
                    <h4 className="pillar-title">Qualidade Museológica</h4>
                    <p className="pillar-text">Impressão em papel de fibra natural de algodão Hahnemühle com pigmentos minerais de altíssima durabilidade e conservação.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <span className="pillar-num">02</span>
                  <div>
                    <h4 className="pillar-title">Molduraria Nobre</h4>
                    <p className="pillar-text">Madeiras nobres certificadas com cortes de alta precisão e vidros antirreflexo museológicos invisíveis.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <span className="pillar-num">03</span>
                  <div>
                    <h4 className="pillar-title">Selo Holográfico</h4>
                    <p className="pillar-text">Cada obra é acompanhada por um selo de autenticidade holográfico numerado e assinado digitalmente pelo fotógrafo.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => window.open('https://wa.me/5512981550281', '_blank')} 
                className="btn-luxury-gold-arrow"
                data-cursor="pointer"
              >
                Solicitar Catálogo de Acervo <span>→</span>
              </button>
            </div>

          </div>
        </section>

      </main>

      <style>{`
        .home-lobby {
          width: 100%;
          min-height: 100vh;
          padding-top: var(--header-height);
        }

        /* Hero com Split Estilo Peter Lindbergh / Obys Agency */
        .hero-split {
          width: 100%;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background-color: transparent; /* Made transparent for background video visibility */
          overflow: hidden;
        }

        .hero-title-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: var(--space-md) var(--space-md);
          z-index: 5;
        }

        .hero-split-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 6.8vw, 8rem); /* Reduzido para não cobrir o retrato central */
          font-weight: 900; /* Peso extra bold / black para evitar falhas em linhas horizontais finas */
          white-space: nowrap;
          line-height: 0.85;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: -0.04em;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          font-optical-sizing: auto;
          will-change: transform;
        }

        .hero-split-title.top-title {
          align-self: flex-start;
          margin-top: calc(var(--header-height) - 20px);
        }

        .hero-split-title.bottom-title {
          align-self: flex-end;
          margin-bottom: 20px;
        }

        /* Retrato Centralizado Peter Lindbergh style */
        .hero-center-portrait {
          width: 25vw;
          min-width: 250px;
          aspect-ratio: 3 / 4;
          z-index: 3;
          position: relative;
          will-change: transform, clip-path;
        }

        .hero-portrait-box {
          width: 100%;
          height: 100%;
          overflow: hidden;
          border: 1.5px solid var(--border-dark);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);
          background-color: #121212;
        }

        .hero-portrait-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%) contrast(1.1); /* Início P&B dramático */
          transition: filter 0.8s var(--transition-smooth);
        }

        .hero-portrait-box:hover .hero-portrait-img {
          filter: grayscale(0%) contrast(1.05); /* Ganha cor no hover */
        }

        /* Suporte a acender no mobile quando centralizado */
        .hero-portrait-box.is-centered .hero-portrait-img {
          filter: grayscale(0%) contrast(1.05); /* Ganha cor no mobile */
        }

        /* Estilo para Metadata do Hero */
        .hero-meta {
          position: absolute;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          color: var(--color-muted);
          letter-spacing: 0.12em;
          z-index: 4;
          text-transform: uppercase;
          will-change: opacity, transform;
        }

        @media (min-width: 769px) {
          .hero-meta.top-left {
            top: 50%;
            transform: translateY(-50%);
            left: var(--space-md);
          }

          .hero-meta.top-right {
            top: 50%;
            transform: translateY(-50%);
            right: var(--space-md);
            align-items: flex-end;
          }

          .hero-meta.bottom-left {
            bottom: var(--space-md);
            left: var(--space-md);
          }
        }

        .hero-meta span {
          display: block;
        }

        .meta-brand {
          font-weight: 600;
          color: #FFFFFF;
        }

        .meta-title {
          font-weight: 400;
          color: var(--red-bright);
        }

        .meta-subtitle {
          color: #707070;
          font-size: 10px;
        }

        .meta-item {
          font-weight: 500;
          color: #FFFFFF;
        }

        .meta-desc {
          color: #888888;
          font-size: 10px;
        }

        /* Indicador de Scroll */
        .hero-scroll-indicator {
          position: absolute;
          bottom: var(--space-md);
          right: var(--space-md);
          display: flex;
          align-items: center;
          gap: 15px;
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          letter-spacing: 0.15em;
          color: #707070;
          z-index: 4;
        }

        .scroll-indicator-line {
          width: 50px;
          height: 1px;
          background-color: var(--color-border);
        }

        /* Responsividade para o Hero Split */
        @media (max-width: 1024px) {
          .hero-center-portrait {
            width: 40vw;
          }

          .hero-split-title {
            font-size: clamp(2rem, 7.2vw, 6.8rem); /* Reduzido responsivamente */
          }
        }

        @media (max-width: 768px) {
          .hero-center-portrait {
            width: 60vw;
            min-width: 200px;
            margin-top: 0; /* Centralização limpa no centro vertical */
          }

          .hero-split-title {
            font-size: clamp(1.6rem, 8.2vw, 3.2rem) !important; /* Mais compacto para não cobrir o retrato no mobile */
          }

          .hero-title-container {
            padding: var(--space-sm) var(--space-sm);
            display: flex;
            flex-direction: column;
            justify-content: center; /* Centraliza a caixa de títulos */
            align-items: center;
            height: 100%;
          }

          /* Títulos fixos e estáveis em relação ao centro vertical (50% do viewport) */
          .hero-split-title.top-title {
            margin-top: 0 !important;
            position: absolute;
            top: calc(50% - 175px);
            left: var(--space-sm);
            align-self: flex-start;
          }

          .hero-split-title.bottom-title {
            margin-bottom: 0 !important;
            position: absolute;
            bottom: calc(50% - 175px);
            right: var(--space-sm);
            align-self: flex-end;
          }

          /* Estilização e posicionamento das descrições restauradas nas laterais livres no mobile */
          .hero-meta {
            font-size: 8.5px;
            letter-spacing: 0.1em;
            display: flex;
            flex-direction: column;
            position: absolute;
            z-index: 6;
          }

          .hero-meta.top-left {
            top: calc(var(--header-height) + 15px);
            left: var(--space-sm);
            bottom: auto;
            align-items: flex-start;
            text-align: left;
            width: auto;
            gap: 4px;
          }

          .hero-meta.top-left .meta-brand {
            font-size: 9.5px;
            color: #FFFFFF;
            font-weight: 600;
            letter-spacing: 0.12em;
          }

          .hero-meta.top-left .meta-title {
            display: block;
            font-size: 9.5px;
            font-weight: 400;
            color: var(--red-bright);
            letter-spacing: 0.1em;
          }

          .hero-meta.top-left .meta-subtitle {
            font-size: 8.5px;
            color: #aaaaaa;
            letter-spacing: 0.08em;
          }

          .hero-meta.top-right {
            top: calc(var(--header-height) + 15px);
            right: var(--space-sm);
            bottom: auto;
            align-items: flex-end;
            text-align: right;
            display: flex;
            gap: 4px;
            width: auto;
          }

          .hero-meta.top-right .meta-item {
            font-size: 9.5px;
            color: #FFFFFF;
            letter-spacing: 0.1em;
          }

          .hero-meta.bottom-left {
            bottom: 25px;
            left: var(--space-sm);
            display: flex;
            gap: 4px;
            width: auto;
            align-items: flex-start;
          }

          .hero-meta.bottom-left .meta-desc {
            font-size: 8px;
            color: #888888;
            letter-spacing: 0.05em;
          }

          /* Indicador de scroll centralizado e legível no mobile */
          .hero-scroll-indicator {
            position: absolute;
            bottom: 25px;
            right: var(--space-sm);
            left: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 8.5px;
            letter-spacing: 0.12em;
            color: #707070;
            white-space: nowrap;
            z-index: 6;
          }

          .scroll-indicator-line {
            display: none; /* Oculta a linha longa no mobile */
          }
        }

        /* Galeria e Grids Assimétricos */
        .gallery-section {
          background-color: rgba(6, 6, 6, 0.88); /* Preto escuro fosco transparente */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: var(--space-xl);
          position: relative;
          z-index: 10;
        }

        .gallery-row {
          margin-top: var(--space-xl);
          align-items: center;
        }

        /* Colunas do Layout Assimétrico Awwwards */
        .col-left-5 {
          grid-column: 1 / 6;
        }

        .col-right-5-desc {
          grid-column: 8 / 13;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-left: var(--space-md);
        }

        .row-number {
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: #D4AF37;
        }

        .row-heading {
          font-family: var(--font-serif);
          font-size: var(--fs-h2);
          color: #FFFFFF;
        }

        .row-text {
          font-family: var(--font-sans);
          font-size: var(--fs-body);
          color: var(--color-muted);
          line-height: 1.6;
          font-weight: 300;
        }

        .col-center-10 {
          grid-column: 2 / 12;
        }

        .col-center-8 {
          grid-column: 3 / 11;
        }

        .col-right-6 {
          grid-column: 7 / 13;
        }

        .col-left-4 {
          grid-column: 2 / 6;
          margin-top: var(--space-lg); /* Desalinhamento */
        }

        /* Footer da Galeria */
        .gallery-footer {
          margin-top: var(--space-xl);
          text-align: center;
        }

        .col-center-6 {
          grid-column: 4 / 10;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .gallery-footer__heading {
          font-family: var(--font-serif);
          font-size: var(--fs-h1);
          color: #FFFFFF;
        }

        .gallery-footer__text {
          font-family: var(--font-sans);
          font-size: var(--fs-body);
          color: var(--color-muted);
          line-height: 1.7;
          font-weight: 300;
        }

        /* Seções de Landing Page Fullscreen ("Mais duas páginas na mesma") */
        .fullscreen-service-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: var(--space-xl) 0;
        }

        .fullscreen-service-page.theme-dark {
          background-color: rgba(22, 4, 4, 0.88); /* Vermelho escuro fosco transparente */
          backdrop-filter: blur(15px); /* Efeito vidro fosco */
          -webkit-backdrop-filter: blur(15px);
          border-top: 1px solid rgba(181, 26, 26, 0.15);
          border-bottom: 1px solid rgba(181, 26, 26, 0.15);
          position: relative;
          z-index: 10;
        }

        .fullscreen-service-page.theme-carmim-deep {
          background-color: rgba(6, 6, 6, 0.9); /* Preto escuro fosco transparente */
          backdrop-filter: blur(15px); /* Efeito vidro fosco */
          -webkit-backdrop-filter: blur(15px);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          position: relative;
          z-index: 10;
        }

        .fullscreen-service__grid {
          align-items: center;
          width: 100%;
        }

        .col-service-content {
          grid-column: 1 / 6;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: var(--space-sm);
        }

        #services-quadros .col-service-content {
          grid-column: 8 / 13;
        }

        .service-label-carmim {
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          color: var(--red-bright);
          text-transform: uppercase;
        }

        .service-label-gold {
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          color: #D4AF37;
          text-transform: uppercase;
        }

        .service-title-monumental {
          font-family: var(--font-serif);
          font-size: var(--fs-h1);
          color: #FFFFFF;
          line-height: 0.95;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .service-text-luxury {
          font-family: var(--font-sans);
          font-size: var(--fs-body);
          color: var(--color-muted);
          line-height: 1.8;
          font-weight: 300;
        }

        /* Botões com micro-animações premium */
        .btn-luxury-carmim-arrow, .btn-luxury-gold-arrow {
          background: none;
          border: 1px solid var(--red-medium);
          color: #FFFFFF;
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 18px 32px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          align-self: flex-start;
          transition: all 0.4s var(--transition-smooth);
          cursor: pointer;
          margin-top: 10px;
        }

        .btn-luxury-carmim-arrow:hover {
          background-color: var(--red-medium);
          border-color: var(--red-bright);
          transform: translateX(6px);
        }

        .btn-luxury-gold-arrow {
          border-color: rgba(212, 175, 55, 0.3);
        }

        .btn-luxury-gold-arrow:hover {
          background-color: #D4AF37;
          color: #050505;
          border-color: #FFFFFF;
          transform: translateX(6px);
        }

        /* Contêiner de Imagem com Parallax / Clip-path reveal */
        .col-service-image-showcase {
          grid-column: 7 / 13;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        #services-quadros .col-service-image-showcase {
          grid-column: 1 / 7;
        }

        .flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .service-image-box {
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          border: 1px solid var(--border-dark);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
          background-color: #121212;
          position: relative;
          will-change: clip-path;
        }

        .service-image-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #181818 0%, #0a0a0a 100%);
          font-family: var(--font-serif);
          font-size: var(--fs-h3);
          color: rgba(255,255,255,0.05);
          letter-spacing: 0.2em;
        }

        .service-image-parallax {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%) contrast(1.1);
          transition: filter 0.8s var(--transition-smooth);
        }

        .service-image-box:hover .service-image-parallax,
        .service-image-box.is-centered .service-image-parallax {
          filter: grayscale(0%) contrast(1.05);
        }

        /* Moldura Flutuante de Quadro Fine Art */
        .service-image-box-float {
          width: 75%;
          aspect-ratio: 4 / 5;
          position: relative;
          border: 1.5px solid var(--border-dark);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);
          background-color: #121212;
          padding: 24px;
          border-radius: 2px;
          will-change: transform;
        }

        .service-image-float {
          width: 100%;
          height: calc(100% - 24px);
          object-fit: cover;
          filter: grayscale(100%) contrast(1.1);
          transition: filter 0.8s var(--transition-smooth);
          border: 1px solid rgba(0, 0, 0, 0.3);
        }

        .service-image-box-float:hover .service-image-float,
        .service-image-box-float.is-centered .service-image-float {
          filter: grayscale(0%) contrast(1.05);
        }

        .service-image-float-label {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-sans);
          font-size: 8px;
          color: #606060;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 14px;
        }

        /* Lista de Pilares do Acervo Fine Art */
        .pillars-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          margin-top: var(--space-sm);
          margin-bottom: var(--space-sm);
        }

        .pillar-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 16px;
          will-change: transform, opacity;
        }

        .pillar-item:last-child {
          border-bottom: none;
        }

        .pillar-num {
          font-family: var(--font-serif);
          font-size: var(--fs-h2);
          color: #D4AF37;
          line-height: 1;
        }

        .pillar-title {
          font-family: var(--font-sans);
          font-size: var(--fs-body);
          font-weight: 500;
          color: #FFFFFF;
          margin-bottom: 4px;
        }

        .pillar-text {
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          color: var(--color-muted);
          line-height: 1.5;
          font-weight: 300;
        }

        /* Colunas adicionais do Grid Parallax Acelerado */
        .col-left-6 {
          grid-column: 1 / 7;
        }

        /* Responsividade Tablets e Mobile */
        @media (max-width: 1024px) {
          .col-hero-title, .col-hero-profile, .col-service-content, .col-service-image-showcase {
            grid-column: 1 / -1 !important;
          }
          
          .col-hero-profile {
            margin-top: var(--space-md);
          }

          .fullscreen-service-page {
            min-height: auto;
            padding: var(--space-lg) 0;
          }

          .col-service-image-showcase {
            margin-top: var(--space-md);
            order: 2;
          }

          #services-quadros .col-service-image-showcase {
            order: 2;
          }

          .service-image-box-float {
            width: 100%;
          }
        }

        @media (max-width: 1024px) {
          .col-left-5, .col-center-10, .col-center-8, .col-right-6, .col-left-4 {
            grid-column: 1 / -1; /* Stack total de colunas para scroll natural no tablet/mobile */
          }

          .col-right-5-desc {
            grid-column: 1 / -1;
            padding-left: 0;
            margin-top: var(--space-sm);
          }

          .col-left-4 {
            margin-top: 0;
          }

          .flex-row-reverse {
            display: flex;
            flex-direction: column; /* Evita quebra na ordem de leitura */
            gap: var(--space-md);
          }

          .col-center-6 {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </>
  );
}
