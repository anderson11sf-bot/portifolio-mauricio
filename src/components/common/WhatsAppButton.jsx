import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MessageSquare } from 'lucide-react'; // Ícone minimalista premium de chat, mais sofisticado que o ícone tradicional do whats

export default function WhatsAppButton() {
  const buttonRef = useRef(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    // Micro-animação contínua e inercial de respiração (pulse) muito suave (Quiet Luxury Style)
    gsap.fromTo(btn,
      { scale: 1 },
      {
        scale: 1.06,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      }
    );

    // Revelação inercial na montagem do app
    gsap.fromTo(btn,
      { opacity: 0, y: 30, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power4.out',
        delay: 2.5 // Revela bem depois do preloader
      }
    );
  }, []);

  const handleClick = () => {
    // URL oficial do WhatsApp com mensagem de luxo pré-formatada
    const phone = "5512981550281";
    const text = encodeURIComponent("Olá, M. Takahama. Gostaria de receber informações sobre a disponibilidade de impressões Fine Art e quadros colecionáveis.");
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button 
        ref={buttonRef} 
        className="whatsapp-btn"
        onClick={handleClick}
        data-cursor="pointer"
        aria-label="Falar no WhatsApp"
      >
        <div className="whatsapp-btn__circle">
          <MessageSquare size={18} className="whatsapp-btn__icon" />
          <span className="whatsapp-btn__pulse" />
        </div>
      </button>

      <style>{`
        .whatsapp-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1800; /* Fica abaixo do purchase overlay mas acima das galerias */
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          will-change: transform, opacity;
        }

        .whatsapp-btn__circle {
          width: 52px;
          height: 52px;
          background-color: var(--red-deep); /* Vermelho laca escuro japonês */
          border: 1.5px solid rgba(181, 26, 26, 0.4); /* Vermelho brilhante translúcido */
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          transition: background-color var(--duration-normal) var(--transition-smooth),
                      border-color var(--duration-normal) var(--transition-smooth);
        }

        .whatsapp-btn__icon {
          z-index: 2;
          transition: transform 0.4s var(--transition-smooth);
        }

        /* Efeito de pulso discreto de luxo no background */
        .whatsapp-btn__pulse {
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          border: 1px solid var(--red-bright);
          opacity: 0;
          z-index: 1;
          pointer-events: none;
          animation: luxuryPulse 3.5s infinite;
        }

        .whatsapp-btn:hover .whatsapp-btn__circle {
          background-color: var(--red-medium);
          border-color: var(--red-bright);
        }

        .whatsapp-btn:hover .whatsapp-btn__icon {
          transform: scale(1.1) rotate(-5deg);
        }

        @keyframes luxuryPulse {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.25);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        /* Responsividade para telas menores */
        @media (max-width: 768px) {
          .whatsapp-btn {
            bottom: 20px;
            right: 20px;
          }
          .whatsapp-btn__circle {
            width: 46px;
            height: 46px;
          }
        }
      `}</style>
    </>
  );
}
