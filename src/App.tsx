// Removido o componente AdSlot e todas as instâncias dele
import { useState, useRef, useCallback, useEffect, memo } from 'react';

interface Seg { syll: string; tone: number; sep: string; }

export default function App() {
  const [pin, setPin] = useState('');
  const [han, setHan] = useState('');
  const [outPin, setOutPin] = useState('');
  const [outHan, setOutHan] = useState('');
  const [outStack, setOutStack] = useState('');
  const [warn, setWarn] = useState('');
  const [font, setFont] = useState(0);
  const [colorPin, setColorPin] = useState(true);
  const [colorHan, setColorHan] = useState(true);

  const pinRef = useRef<HTMLDivElement>(null);
  const hanRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  // Demais funções (normalize, applyTone, segment, renderPin, etc.) seguem aqui intactas
  // ...

  // Dentro do componente return:
  return (
    <>
      <title>Color2Hanzi - Colorize Pinyin & Hanzi by Tones | Free Chinese Learning Tool</title>

      <main className="container">
        <h1 className="title">
          <span style={{color:'#000'}}>Color2</span>
          <span className="tone1">H</span>
          <span className="tone2">a</span>
          <span className="tone3">n</span>
          <span className="tone4">z</span>
          <span className="tone5">i</span>
        </h1>

        <div className="grid">
          <div>
            {/* Inputs de Pinyin e Hanzi, botões, saídas etc. */}
            {/* Todas as seções de output e ações do usuário */}
          </div>
          {/* REMOVIDO: aside com AdSlot do sidebar */}
        </div>

        {/* REMOVIDO: blocos de AdSlot (top, mid, bottom, mobile) */}

        <footer style={{marginTop:'48px',padding:'24px 0',borderTop:'1px solid #e5e5e5',textAlign:'center',fontSize:'0.85rem',color:'#666'}}>
          <p>© 2025 Color2Hanzi - Free tool for Chinese language learners</p>
          <p style={{marginTop:'8px'}}>Learn Chinese by colorizing Pinyin and Hanzi by tones</p>
        </footer>
      </main>

      <style>{`
        @media(min-width:1024px){
          .sidebar{display:block!important}
          .mobile-ad{display:none!important}
        }
      `}</style>
    </>
  );
}