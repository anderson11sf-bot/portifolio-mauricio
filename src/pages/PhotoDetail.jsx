import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Plus, Eye, Award, Camera, Calendar, MapPin } from 'lucide-react';
import PurchasePanel from '../components/portfolio/PurchasePanel';

// Registrar o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function PhotoDetail({ photo, onBack }) {
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const containerRef = useRef(null);
  const stackRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    // Rolar para o topo da página ao montar
    window.scrollTo(0, 0);

    const details = detailsRef.current;
    const images = stackRef.current?.querySelectorAll('.photo-detail__img-box-wrapper');
    const imageBoxes = stackRef.current?.querySelectorAll('.photo-detail__img-box');
    
    // Configurar o estado inicial das imagens para revelação
    gsap.set(images, { opacity: 0, y: 50 });

    const tl = gsap.timeline();

    // Revelação inicial da primeira imagem
    if (images && images.length > 0) {
      tl.to(images[0], {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power4.out'
      });
    }

    // Entrada dos detalhes com stagger
    tl.fromTo(details.querySelectorAll('.animate-fade'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
      '-=0.8'
    );

    // Revelação por scroll para as imagens subsequentes (2 em diante)
    const triggers = [];
    if (images && images.length > 1) {
      const remainingImages = Array.from(images).slice(1);
      
      remainingImages.forEach((imgBox) => {
        const trigger = ScrollTrigger.create({
          trigger: imgBox,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(imgBox, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out'
            });
          },
          once: true // Executa apenas uma vez
        });
        triggers.push(trigger);
      });
    }

    // GATILHO DE ACENDER FOTOS NO MOBILE (CENTRO DA TELA)
    const mm = gsap.matchMedia();
    mm.add("(max-width: 1024px)", () => {
      if (imageBoxes) {
        imageBoxes.forEach((box) => {
          const trigger = ScrollTrigger.create({
            trigger: box,
            start: "top 62%",
            end: "bottom 38%",
            toggleClass: { targets: box, className: "is-centered" }
          });
          triggers.push(trigger);
        });
      }
    });

    return () => {
      tl.kill();
      triggers.forEach(t => t.kill());
      mm.revert();
    };
  }, [photo]);

  if (!photo) return null;

  return (
    <>
      <main ref={containerRef} className="photo-detail">
        
        {/* Botão Voltar */}
        <button 
          className="photo-detail__back-btn animate-fade" 
          onClick={onBack}
          data-cursor="pointer"
        >
          <ArrowLeft size={16} />
          <span>Voltar ao Lobby</span>
        </button>

        <div className="grid-luxury photo-detail__container">
          
          {/* Lado Esquerdo: Protagonismo Supremo das Fotos (Stack Vertical do mesmo local) */}
          <div ref={stackRef} className="photo-detail__img-container">
            {photo.images && photo.images.map((imgUrl, index) => (
              <div 
                key={index} 
                className="photo-detail__img-box-wrapper"
              >
                <div className={`photo-detail__img-box ${photo.aspect === 'portrait' ? 'is-portrait' : 'is-landscape'}`}>
                  <img 
                    src={imgUrl} 
                    alt={`${photo.title} — Registro ${index + 1}`} 
                    className="photo-detail__img" 
                  />
                </div>
                <div className="photo-detail__img-caption">
                  <span>{photo.title}</span>
                  <span>{String(index + 1).padStart(2, '0')} / {String(photo.images.length).padStart(2, '0')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lado Direito: Metadados, Poesia e Ação */}
          <div ref={detailsRef} className="photo-detail__details">
            
            {/* Categoria e Edição */}
            <div className="photo-detail__meta animate-fade">
              <span className="photo-detail__category">{photo.category}</span>
              <span className="photo-detail__separator">•</span>
              <span className="photo-detail__edition">Série Especial 1/25</span>
            </div>

            {/* Título Monumental */}
            <h1 className="photo-detail__title animate-fade">{photo.title}</h1>

            {/* Texto Descritivo Poético */}
            <p className="photo-detail__desc animate-fade">
              Esta obra registra o instante preciso em que a neblina matinal encontrou os primeiros raios de sol, desenhando contornos geométricos etéreos. Uma ode ao minimalismo e à meditação silenciosa da natureza selvagem.
            </p>

            {/* Ficha Técnica Concept (Quiet Luxury) */}
            <div className="photo-detail__technical animate-fade">
              <h3 className="tech-title">Especificações do Disparo</h3>
              
              <div className="tech-grid">
                <div className="tech-item">
                  <Camera size={14} />
                  <div>
                    <span className="tech-label">Equipamento</span>
                    <span className="tech-value">Leica M11, Apo-Summicron 50mm</span>
                  </div>
                </div>

                <div className="tech-item">
                  <Eye size={14} />
                  <div>
                    <span className="tech-label">Ajustes</span>
                    <span className="tech-value">f/2.0, 1/250s, ISO 64</span>
                  </div>
                </div>

                <div className="tech-item">
                  <MapPin size={14} />
                  <div>
                    <span className="tech-label">Localização</span>
                    <span className="tech-value">Planalto Suíço</span>
                  </div>
                </div>

                <div className="tech-item">
                  <Calendar size={14} />
                  <div>
                    <span className="tech-label">Data</span>
                    <span className="tech-value">Novembro, 2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selo de Coleção */}
            <div className="photo-detail__badge animate-fade">
              <Award size={18} className="badge-icon" />
              <div>
                <span className="badge-title">Garantia Museológica Hahnemühle</span>
                <span className="badge-sub">Fibra de algodão natural com padrão de preservação de galeria internacional M. Takahama.</span>
              </div>
            </div>

            {/* Ações Principais: Comprar e Link Externo */}
            <div className="photo-detail__action animate-fade">
              <button 
                className="photo-detail__buy-btn"
                onClick={() => setIsPurchaseOpen(true)}
                data-cursor="pointer"
              >
                <span>CONFIGURAR QUADRO FINE ART</span>
                <Plus size={18} />
              </button>

              {photo.instagramUrl && (
                <a 
                  href={photo.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="photo-detail__instagram-btn"
                  data-cursor="pointer"
                >
                  <span>VER POST NO INSTAGRAM</span>
                </a>
              )}
            </div>

          </div>

        </div>

        {/* Painel Off-Canvas de Compra */}
        <PurchasePanel 
          isOpen={isPurchaseOpen} 
          onClose={() => setIsPurchaseOpen(false)}
          photoData={photo}
        />

      </main>

      <style>{`
        .photo-detail {
          width: 100%;
          min-height: 100vh;
          padding-top: calc(var(--header-height) + 20px);
          padding-bottom: var(--space-xl);
          position: relative;
        }

        /* Botão Voltar */
        .photo-detail__back-btn {
          position: absolute;
          top: calc(var(--header-height) + 20px);
          left: var(--space-md);
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-muted);
          transition: color 0.3s;
          z-index: 10;
        }

        .photo-detail__back-btn:hover {
          color: #FFFFFF;
        }

        /* Container de 12 Colunas */
        .photo-detail__container {
          margin-top: var(--space-md);
        }

        /* Fotos em Stack Vertical (Lado Esquerdo - 7 colunas) */
        .photo-detail__img-container {
          grid-column: 1 / 8;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          will-change: transform;
        }

        .photo-detail__img-box-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .photo-detail__img-box {
          width: 100%;
          overflow: hidden;
          background-color: #121212;
          position: relative;
          border: 1px solid var(--border-dark);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          transition: border-color 0.6s var(--transition-smooth);
        }

        .photo-detail__img-box.is-portrait {
          aspect-ratio: 3 / 4;
        }

        .photo-detail__img-box.is-landscape {
          aspect-ratio: 16 / 10;
        }

        .photo-detail__img-box:hover {
          border-color: rgba(181, 26, 26, 0.3);
        }

        .photo-detail__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%) contrast(1.1); /* P&B cinematográfico */
          transition: filter 0.8s var(--transition-smooth);
        }

        .photo-detail__img-box:hover .photo-detail__img,
        .photo-detail__img-box.is-centered .photo-detail__img {
          filter: grayscale(0%) contrast(1.05); /* Revela cores no hover ou centro */
        }

        .photo-detail__img-caption {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          color: #707070;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0 4px;
        }

        /* Detalhes Técnicos e Botão Sticky (Lado Direito - 4 colunas com 1 de respiro) */
        .photo-detail__details {
          grid-column: 9 / 13;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          position: sticky;
          top: calc(var(--header-height) + 40px);
          height: fit-content;
          align-self: start;
        }

        .photo-detail__meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #707070;
        }

        .photo-detail__separator {
          color: var(--color-border);
        }

        .photo-detail__title {
          font-family: var(--font-serif);
          font-size: var(--fs-h1);
          color: #FFFFFF;
          margin-top: 12px;
          margin-bottom: 24px;
        }

        .photo-detail__desc {
          font-family: var(--font-sans);
          font-size: var(--fs-body);
          color: var(--color-muted);
          line-height: 1.7;
          font-weight: 300;
          margin-bottom: var(--space-md);
        }

        /* Ficha Técnica */
        .photo-detail__technical {
          border-top: 1px solid var(--color-border);
          padding-top: var(--space-sm);
          margin-bottom: var(--space-sm);
        }

        .tech-title {
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #707070;
          margin-bottom: 16px;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .tech-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .tech-item svg {
          color: var(--red-bright);
          margin-top: 3px;
        }

        .tech-label {
          display: block;
          font-family: var(--font-sans);
          font-size: 8px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #707070;
          margin-bottom: 2px;
        }

        .tech-value {
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          color: #FFFFFF;
          font-weight: 400;
        }

        /* Selo Museológico */
        .photo-detail__badge {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--color-border);
          padding: 16px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: var(--space-md);
        }

        .badge-icon {
          color: var(--red-bright);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .badge-title {
          display: block;
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          font-weight: 500;
          color: #FFFFFF;
          margin-bottom: 4px;
        }

        .badge-sub {
          display: block;
          font-family: var(--font-sans);
          font-size: 10px;
          color: #707070;
          line-height: 1.4;
        }

        /* Botões Ação Compra e Redirecionamento */
        .photo-detail__action {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .photo-detail__buy-btn {
          width: 100%;
          background-color: var(--red-deep);
          border: 1.5px solid var(--red-medium);
          color: #FFFFFF;
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          font-weight: 500;
          letter-spacing: 0.18em;
          padding: 18px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.4s var(--transition-smooth);
        }

        .photo-detail__buy-btn:hover {
          background-color: var(--red-medium);
          border-color: var(--red-bright);
          transform: translateY(-2px);
        }

        .photo-detail__instagram-btn {
          width: 100%;
          background-color: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-muted);
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          font-weight: 500;
          letter-spacing: 0.18em;
          padding: 18px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.4s var(--transition-smooth);
        }

        .photo-detail__instagram-btn:hover {
          border-color: #FFFFFF;
          color: #FFFFFF;
        }

        /* Responsividade total Mobile e Tablet */
        @media (max-width: 1024px) {
          .photo-detail__back-btn {
            position: relative;
            top: 0;
            left: 0;
            margin-bottom: var(--space-sm);
            padding-left: var(--space-sm);
          }

          .photo-detail__img-container {
            grid-column: 1 / -1;
          }

          .photo-detail__details {
            grid-column: 1 / -1;
            margin-top: var(--space-md);
            position: relative;
            top: 0;
            height: auto;
          }
        }
      `}</style>
    </>
  );
}
