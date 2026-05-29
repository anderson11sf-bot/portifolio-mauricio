import React, { useState } from 'react';
import Preloader from './components/common/Preloader';
import CustomCursor from './components/common/CustomCursor';
import SmoothScroll from './components/common/SmoothScroll';
import Header from './components/layout/Header';
import Home from './pages/Home';
import PhotoDetail from './pages/PhotoDetail';
import WhatsAppButton from './components/common/WhatsAppButton'; // Botão do WhatsApp de luxo integrado

// Mapeamento dinâmico em lote de todas as fotos reais do portfólio baixadas do MyPortfolio da Adobe
// Eager true carrega os assets diretamente para injeção sem delays de lazy loading no scroll
const ALL_PORTFOLIO_IMAGES = import.meta.glob('./assets/portfolio/**/*.jpg', { eager: true, import: 'default' });

// Configuração estruturada dos 6 projetos oficiais de M. Takahama
const PROJECTS_CONFIG = [
  {
    id: 'takahama-arquitetura',
    title: 'Arquitetura',
    year: '2025',
    category: 'Arquitetura / Minimalista',
    aspect: 'portrait',
    folder: 'arquitetura',
    imageCount: 6,
    instagramUrl: 'https://www.instagram.com/p/DWOP7mGjkA5/'
  },
  {
    id: 'takahama-quadros',
    title: 'Quadros',
    year: '2025',
    category: 'Coleções / Exposições',
    aspect: 'landscape',
    folder: 'quadros',
    imageCount: 6,
    instagramUrl: 'https://www.instagram.com/p/DWh5RFqDp8m/'
  },
  {
    id: 'takahama-paisagens',
    title: 'Paisagens',
    year: '2024',
    category: 'Natureza / Média Formato',
    aspect: 'landscape',
    folder: 'paisagens',
    imageCount: 5,
    instagramUrl: 'https://www.instagram.com/p/DTC4TpFjmO0/'
  },
  {
    id: 'takahama-datalhes',
    title: 'Detalhes',
    year: '2025',
    category: 'Texturas / Luz Natural',
    aspect: 'portrait',
    folder: 'datalhes',
    imageCount: 6,
    instagramUrl: 'https://www.instagram.com/p/DO6-jm0Dqkc/'
  },
  {
    id: 'takahama-caminhos',
    title: 'Caminhos',
    year: '2026',
    category: 'Perspectiva / Documental',
    aspect: 'landscape',
    folder: 'caminhos',
    imageCount: 6,
    instagramUrl: 'https://www.instagram.com/p/B5-qhUMHm7z/'
  },
  {
    id: 'takahama-arvores',
    title: 'Árvores',
    year: '2025',
    category: 'Natureza / Minimalista',
    aspect: 'portrait',
    folder: 'arvores',
    imageCount: 6,
    instagramUrl: 'https://www.instagram.com/p/B6B9o32HII1/'
  }
];

// Gerar a coleção Fine Art dinamicamente vinculando todas as subfotos reais de cada ensaio
const FINE_ART_COLLECTION = PROJECTS_CONFIG.map(proj => {
  const images = [];
  const prefix = `./assets/portfolio/${proj.folder}/`;
  
  // Capturar todas as chaves do glob dinâmico pertencentes a este projeto
  Object.keys(ALL_PORTFOLIO_IMAGES).forEach(key => {
    if (key.startsWith(prefix)) {
      images.push(ALL_PORTFOLIO_IMAGES[key]);
    }
  });

  // Ordenar numericamente para garantir que foto1 venha antes de foto2, etc.
  images.sort((a, b) => {
    const getNum = (url) => {
      const match = url.match(/foto(\d+)\.jpg/);
      return match ? parseInt(match[1], 10) : 0;
    };
    return getNum(a) - getNum(b);
  });
  
  return {
    ...proj,
    imageUrl: images[0] || '', // Foto de Capa (foto1.jpg)
    images: images             // Coleção de fotos reais do mesmo local
  };
});

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <>
      {/* 1. Preloader Cinematográfico */}
      {isLoading && (
        <Preloader onComplete={() => setIsLoading(false)} />
      )}

      {/* 2. Cursor Customizado Ativo apenas após o Preloader (somente Desktop) */}
      {!isLoading && <CustomCursor />}

      {/* 3. Botão do WhatsApp Flutuante no tema Laca Vermelho e Preto */}
      {!isLoading && <WhatsAppButton />}

      {/* 4. Estrutura Principal do Site com Smooth Scroll */}
      {!isLoading && (
        <>
          {/* Vídeo de Fundo Global & Camada de Laca Negra Fosca */}
          <div className="bg-video-container">
            <video 
              className="bg-video" 
              src="/video/bg_video.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
            />
            <div className="bg-video-overlay" />
          </div>

          <SmoothScroll>
            {/* Menu de Navegação Minimalista */}
            <Header />

            {/* Roteamento Fino baseada em Estado para o Boilerplate */}
            {!selectedPhoto ? (
              <Home 
                photos={FINE_ART_COLLECTION} 
                onSelectPhoto={(photo) => setSelectedPhoto(photo)} 
              />
            ) : (
              <PhotoDetail 
                photo={selectedPhoto} 
                onBack={() => setSelectedPhoto(null)} 
              />
            )}

            {/* Rodapé Conceitual Simples de Luxo */}
            <footer className="silent-footer">
              <div className="grid-luxury">
                <div className="silent-footer__content">
                  <span className="silent-footer__brand">M. TAKAHAMA</span>
                  <span className="silent-footer__copy">© 2026 Fine Art Collectibles. Desenvolvido sob Estética Carmim.</span>
                </div>
              </div>
            </footer>
          </SmoothScroll>
        </>
      )}

      <style>{`
        /* Vídeo de Fundo Global & Efeito Fosco (Frosted Glass / Matte) */
        .bg-video-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
          background-color: #050505; /* Fallback de laca negra */
        }

        .bg-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.65; /* Opacidade sutil para o movimento do vídeo no fundo */
          will-change: transform;
        }

        .bg-video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(5, 5, 5, 0.78); /* Laca preta fosca e transparente */
          backdrop-filter: blur(8px); /* Efeito fosco Awwwards de alto padrão */
          -webkit-backdrop-filter: blur(8px);
        }

        .silent-footer {
          border-top: 1px solid rgba(181, 26, 26, 0.15);
          padding: var(--space-md) 0;
          margin-top: 0; /* Alinha diretamente com a seção anterior, sem buracos vazios */
          background-color: rgba(22, 4, 4, 0.88); /* Vermelho escuro fosco transparente */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          position: relative;
          z-index: 10;
        }

        .silent-footer__content {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-sans);
          font-size: var(--fs-ui);
          color: #555555;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .silent-footer__brand {
          font-family: var(--font-serif);
          letter-spacing: 0.15em;
          color: #888888;
        }

        @media (max-width: 768px) {
          .silent-footer__content {
            flex-direction: column;
            gap: 12px;
            text-align: center;
            font-size: 9px;
          }
        }
      `}</style>
    </>
  );
}
