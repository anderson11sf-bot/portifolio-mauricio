import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, Shield, Truck, Sparkles } from 'lucide-react';

export default function PurchasePanel({ isOpen, onClose, photoData }) {
  const panelRef = useRef(null);
  const overlayRef = useRef(null);
  
  // Opções de Compra Fine Art
  const sizes = [
    { label: 'Studio (40x60 cm)', priceModifier: 0, printOnlyPrice: 450 },
    { label: 'Gallery (60x90 cm)', priceModifier: 250, printOnlyPrice: 700 },
    { label: 'Collector (80x120 cm)', priceModifier: 600, printOnlyPrice: 1050 }
  ];

  const frames = [
    { id: 'none', label: 'Apenas Impressão Fine Art', price: 0 },
    { id: 'black', label: 'Moldura de Madeira Preta Museológica', price: 180 },
    { id: 'natural', label: 'Moldura de Madeira Natural (Freijó)', price: 220 },
    { id: 'oak', label: 'Moldura de Carvalho Escuro Importado', price: 260 }
  ];

  const glasses = [
    { id: 'standard', label: 'Vidro Antirreflexo Comum', price: 80 },
    { id: 'museum', label: 'Vidro Museológico 99% Invisível (UV Protect)', price: 280 }
  ];

  // Estados de seleção do usuário
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedFrame, setSelectedFrame] = useState(frames[0]);
  const [selectedGlass, setSelectedGlass] = useState(glasses[0]);

  // Cálculo de Preço Dinâmico
  const calculateTotal = () => {
    if (!photoData) return 0;
    const basePrice = selectedSize.printOnlyPrice;
    const frameCost = selectedFrame.price;
    const glassCost = selectedFrame.id === 'none' ? 0 : selectedGlass.price; // Sem moldura = sem vidro
    
    return basePrice + frameCost + glassCost;
  };

  useEffect(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;

    if (!panel || !overlay) return;

    if (isOpen) {
      // Bloquear scroll do body ao abrir o drawer
      document.body.classList.add('lenis-stopped');

      const tl = gsap.timeline();
      
      // Animação de Entrada
      tl.set([panel, overlay], { display: 'block' })
        .fromTo(overlay, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.5, ease: 'power2.out' }
        )
        .fromTo(panel, 
          { xPercent: 100 }, 
          { xPercent: 0, duration: 0.8, ease: 'power4.out' }, 
          '-=0.4'
        );
    } else {
      // Animação de Saída
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set([panel, overlay], { display: 'none' });
          document.body.classList.remove('lenis-stopped');
        }
      });

      tl.to(panel, { xPercent: 100, duration: 0.6, ease: 'power4.in' })
        .to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.3');
    }
  }, [isOpen]);

  if (!photoData) return null;

  return (
    <>
      {/* Overlay Escuro */}
      <div 
        ref={overlayRef} 
        className="purchase-overlay" 
        onClick={onClose} 
      />

      {/* Painel Lateral Off-Canvas */}
      <aside ref={panelRef} className="purchase-panel">
        <div className="purchase-panel__wrapper">
          
          {/* Header do Drawer */}
          <div className="purchase-panel__header">
            <div>
              <span className="purchase-panel__edition-tag">Edição Limitada 1/25</span>
              <h2 className="purchase-panel__title">{photoData.title}</h2>
            </div>
            <button 
              className="purchase-panel__close-btn" 
              onClick={onClose} 
              data-cursor="close"
              aria-label="Fechar painel"
            >
              <X size={20} />
            </button>
          </div>

          {/* Conteúdo do Drawer com scrollbar invisível */}
          <div className="purchase-panel__content">
            
            {/* Bloco do Certificado */}
            <div className="purchase-panel__luxury-alert">
              <Sparkles size={16} className="luxury-alert-icon" />
              <p>
                Acompanha Certificado de Autenticidade assinado pelo artista com selo holográfico numerado. Impressão em papel Hahnemühle Photo Rag 308gsm 100% Algodão.
              </p>
            </div>

            {/* Configuração 1: Tamanho da Obra */}
            <div className="purchase-panel__section">
              <h3 className="section-title">1. Tamanho da Obra</h3>
              <div className="options-grid">
                {sizes.map((size, idx) => (
                  <button 
                    key={idx}
                    className={`option-btn ${selectedSize.label === size.label ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    data-cursor="pointer"
                  >
                    <span className="option-btn__label">{size.label}</span>
                    <span className="option-btn__meta">Papel 100% algodão</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuração 2: Moldura */}
            <div className="purchase-panel__section">
              <h3 className="section-title">2. Moldura Artesanal</h3>
              <div className="options-list">
                {frames.map((frame) => (
                  <button 
                    key={frame.id}
                    className={`option-list-item ${selectedFrame.id === frame.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedFrame(frame);
                      // Resetar vidro se escolher sem moldura
                      if (frame.id === 'none') {
                        setSelectedGlass(glasses[0]);
                      }
                    }}
                    data-cursor="pointer"
                  >
                    <span className="option-list-item__label">{frame.label}</span>
                    <span className="option-list-item__price">
                      {frame.price === 0 ? 'Incluso' : `+ R$ ${frame.price}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuração 3: Vidro (Habilitado apenas se houver moldura) */}
            {selectedFrame.id !== 'none' && (
              <div className="purchase-panel__section">
                <h3 className="section-title">3. Vidro Protetor</h3>
                <div className="options-list">
                  {glasses.map((glass) => (
                    <button 
                      key={glass.id}
                      className={`option-list-item ${selectedGlass.id === glass.id ? 'active' : ''}`}
                      onClick={() => setSelectedGlass(glass)}
                      data-cursor="pointer"
                    >
                      <span className="option-list-item__label">{glass.label}</span>
                      <span className="option-list-item__price">
                        {glass.id === 'standard' ? 'Incluso' : `+ R$ ${glass.price - 80}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Informações conceituais de frete e garantia */}
            <div className="purchase-panel__trust">
              <div className="trust-item">
                <Truck size={16} />
                <span>Frete Grátis e Segurado para todo o Brasil em embalagem rígida.</span>
              </div>
              <div className="trust-item">
                <Shield size={16} />
                <span>Garantia de 50 anos contra desbotamento (padrão museológico).</span>
              </div>
            </div>

          </div>

          {/* Footer Fixo do Drawer (Ação de Compra) */}
          <div className="purchase-panel__footer">
            <div className="footer-price-block">
              <span className="footer-price-label">Valor do Investimento</span>
              <span className="footer-price-value">R$ {calculateTotal().toLocaleString('pt-BR')}</span>
            </div>
            <button className="purchase-panel__buy-btn" data-cursor="pointer">
              ADICIONAR AO ACERVO
            </button>
          </div>

        </div>
      </aside>

      <style>{`
        .purchase-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1999;
          display: none;
          opacity: 0;
          backdrop-filter: blur(4px);
          will-change: opacity;
        }

        .purchase-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background-color: #0A0A0A;
          border-left: 1px solid var(--color-border);
          z-index: 2000;
          display: none;
          transform: translateX(100%);
          will-change: transform;
        }

        .purchase-panel__wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }

        /* Header */
        .purchase-panel__header {
          padding: var(--space-md);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .purchase-panel__edition-tag {
          font-family: var(--font-sans);
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: #D4AF37; /* Dourado luxuoso bem discreto */
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .purchase-panel__title {
          font-family: var(--font-serif);
          font-size: var(--fs-h3);
          color: #FFFFFF;
          font-weight: 400;
        }

        .purchase-panel__close-btn {
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }

        .purchase-panel__close-btn:hover {
          color: #FFFFFF;
        }

        /* Conteúdo com scrollbar invisível */
        .purchase-panel__content {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          -webkit-overflow-scrolling: touch;
        }

        /* Alerta de luxo */
        .purchase-panel__luxury-alert {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--color-border);
          padding: var(--space-sm);
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .luxury-alert-icon {
          color: #D4AF37;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .purchase-panel__luxury-alert p {
          font-family: var(--font-sans);
          font-size: 11px;
          line-height: 1.6;
          color: #A0A0A0;
          font-weight: 300;
        }

        /* Seções de Opções */
        .purchase-panel__section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .section-title {
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #707070;
          font-weight: 500;
        }

        /* Options Grid (Tamanhos) */
        .options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }

        .option-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 14px;
          border: 1px solid var(--color-border);
          transition: all 0.4s var(--transition-smooth);
          background-color: transparent;
          text-align: left;
        }

        .option-btn:hover {
          border-color: rgba(255, 255, 255, 0.3);
        }

        .option-btn.active {
          border-color: #FFFFFF;
          background-color: rgba(255, 255, 255, 0.03);
        }

        .option-btn__label {
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          color: #FFFFFF;
          font-weight: 400;
          margin-bottom: 2px;
        }

        .option-btn__meta {
          font-family: var(--font-sans);
          font-size: 9px;
          color: #707070;
        }

        /* Options List (Moldura e Vidro) */
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .option-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px;
          border: 1px solid var(--color-border);
          transition: all 0.4s var(--transition-smooth);
          background-color: transparent;
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          text-align: left;
        }

        .option-list-item:hover {
          border-color: rgba(255, 255, 255, 0.3);
        }

        .option-list-item.active {
          border-color: #FFFFFF;
          background-color: rgba(255, 255, 255, 0.03);
        }

        .option-list-item__label {
          color: #FFFFFF;
          font-weight: 400;
        }

        .option-list-item__price {
          color: #D4AF37;
          font-weight: 300;
        }

        /* Garantias */
        .purchase-panel__trust {
          border-top: 1px solid var(--color-border);
          padding-top: var(--space-sm);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .trust-item {
          display: flex;
          gap: 10px;
          align-items: center;
          font-family: var(--font-sans);
          font-size: 10px;
          color: #707070;
          line-height: 1.4;
        }

        .trust-item svg {
          color: rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        /* Footer Fixo do Drawer */
        .purchase-panel__footer {
          padding: var(--space-md);
          border-top: 1px solid var(--color-border);
          background-color: #080808;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-price-block {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .footer-price-label {
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          color: #707070;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .footer-price-value {
          font-family: var(--font-serif);
          font-size: var(--fs-h2);
          color: #FFFFFF;
          font-weight: 400;
        }

        .purchase-panel__buy-btn {
          width: 100%;
          background-color: #FFFFFF;
          color: #0A0A0A;
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          font-weight: 500;
          letter-spacing: 0.18em;
          padding: 18px 0;
          text-align: center;
          text-transform: uppercase;
          transition: all 0.4s var(--transition-smooth);
        }

        .purchase-panel__buy-btn:hover {
          background-color: #E2E2E2;
          transform: translateY(-2px);
        }

        /* ADAPTAÇÃO TOTAL RESPONSIVA MOBILE (CRÍTICO) */
        @media (max-width: 768px) {
          .purchase-panel {
            width: 100%; /* Ocupa a tela cheia no Mobile */
            border-left: none;
          }
          
          .purchase-panel__header,
          .purchase-panel__content,
          .purchase-panel__footer {
            padding: var(--space-sm);
          }

          .footer-price-value {
            font-size: var(--fs-h3);
          }

          .purchase-panel__buy-btn {
            padding: 15px 0;
          }
        }
      `}</style>
    </>
  );
}
