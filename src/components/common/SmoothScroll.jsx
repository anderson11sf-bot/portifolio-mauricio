import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar o plugin ScrollTrigger no GSAP
gsap.registerPlugin(ScrollTrigger);

const SmoothScrollContext = createContext(null);

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Configurações do Lenis adaptadas para Quiet Luxury (Inércia e fluidez premium)
    const lenis = new Lenis({
      duration: 0.65, // Scroll ultra-imediato, leve e reativo
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva exponencial fluida rápida
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothWheel: true,
      // Desativa o scroll suavizado em telas touch por padrão para manter a aceleração nativa (iOS/Android)
      // evitando jankiness e economizando bateria/performance
      smoothTouch: false, 
      touchMultiplier: 4.0, // Altíssima sensibilidade em trackpads de laptops (mínimo deslize)
      wheelMultiplier: 3.2, // Aceleração monumental do scroll (desliza pouquíssimo a rodinha do mouse para avançar)
    });

    lenisRef.current = lenis;

    // Sincronizar o Lenis com o ScrollTrigger do GSAP para atualizações imediatas de triggers de animação
    lenis.on('scroll', ScrollTrigger.update);

    // Integrar o ticker do GSAP com o Loop do Lenis para animações perfeitamente sincronizadas
    const tickerCallback = (time) => {
      lenis.raf(time * 1000); // Sincroniza ticks do GSAP com Lenis
    };
    
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0); // Corrige perda de frames em lags severos

    // Salvar instância global para debugging se necessário
    window.lenis = lenis;

    return () => {
      // Limpeza completa de ouvintes e tickers ao desmontar o componente
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenisRef}>
      <div id="smooth-wrapper" style={{ width: '100%', position: 'relative' }}>
        <div id="smooth-content">
          {children}
        </div>
      </div>
    </SmoothScrollContext.Provider>
  );
}
