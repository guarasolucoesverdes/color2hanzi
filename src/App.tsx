import { useState, useRef, useCallback, memo, useEffect } from 'react';
import { ArrowLeft, MousePointerClick } from 'lucide-react';

// Lightweight AdSense - memoized for performance
const AdSlot = memo(({ width, height, slot }: { width: number; height: number; slot: string }) => (
  <div style={{ width: '100%', maxWidth: `${width}px`, height: `${height}px`, margin: '0 auto' }}>
    <div style={{ width: '100%', height: '100%', background: '#f5f5f5', border: '1px dashed #ddd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.85rem' }}>
      AdSense {slot} ({width}×{height})
    </div>
    {/* Replace with your AdSense code:
    <ins className="adsbygoogle"
         style={{display:'block',width:`${width}px`,height:`${height}px`}}
         data-ad-client="ca-pub-XXXXXXXX"
         data-ad-slot="XXXXXXXXXX"></ins>
    */}
  </div>
));
AdSlot.displayName = 'AdSlot';

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

  const syllables = useRef(new Set(
    'a ai an ang ao ba bai ban bang bao bei ben beng bi bian biao bie bin bing bo bu ca cai can cang cao ce cen ceng cha chai chan chang chao che chen cheng chi chong chou chu chua chuai chuan chuang chui chun chuo ci cong cou cu cuan cui cun cuo da dai dan dang dao de dei den deng di dia dian diao die ding diu dong dou du duan dui dun duo e ei en eng er fa fan fang fei fen feng fo fou fu ga gai gan gang gao ge gei gen geng gong gou gu gua guai guan guang gui gun guo ha hai han hang hao he hei hen heng hong hou hu hua huai huan huang hui hun huo ji jia jian jiang jiao jie jin jing jiong jiu ju juan jue jun ka kai kan kang kao ke ken keng kong kou ku kua kuai kuan kuang kui kun kuo la lai lan lang lao le lei leng li lia lian liang liao lie lin ling liu lo long lou lu luan lun luo lv lve ma mai man mang mao me mei men meng mi mian miao mie min ming miu mo mou mu na nai nan nang nao ne nei nen neng ni nian niang niao nie nin ning niu nong nou nu nuan nun nuo nv nve o ou pa pai pan pang pao pei pen peng pi pian piao pie pin ping po pou pu qi qia qian qiang qiao qie qin qing qiong qiu qu quan que qun ran rang rao re ren reng ri rong rou ru ruan rui run ruo sa sai san sang sao se sen seng sha shai shan shang shao she shen sheng shi shou shu shua shuai shuan shuang shui shun shuo si song sou su suan sui sun suo ta tai tan tang tao te teng ti tian tiao tie ting tong tou tu tuan tui tun tuo wa wai wan wang wei wen weng wo wu xi xia xian xiang xiao xie xin xing xiong xiu xu xuan xue xun ya yan yang yao ye yi yin ying yo yong you yu yuan yue yun za zai zan zang zao ze zei zen zeng zha zhai zhan zhang zhao zhe zhen zheng zhi zhong zhou zhu zhua zhuai zhuan zhuang zhui zhun zhuo zi zong zou zu zuan zui zun zuo'.split(' ')
  )).current;

  const toneMap: Record<number, RegExp> = {
    1: /[āēīōūǖ]/i, 2: /[áéíóúǘ]/i, 3: /[ǎěǐǒǔǚ]/i, 4: /[àèìòùǜ]/i
  };

  const normalize = useCallback((p: string) => {
    const m: Record<string, string> = {
      'ā':'a','á':'a','ǎ':'a','à':'a','ē':'e','é':'e','ě':'e','è':'e',
      'ī':'i','í':'i','ǐ':'i','ì':'i','ō':'o','ó':'o','ǒ':'o','ò':'o',
      'ū':'u','ú':'u','ǔ':'u','ù':'u','ǖ':'v','ǘ':'v','ǚ':'v','ǜ':'v','ü':'v'
    };
    return p.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, c => m[c] || c);
  }, []);

  const isLetter = useCallback((c: string) => /[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/.test(c), []);
  
  const getTone = useCallback((t: string): number => {
    for (let i = 1; i <= 4; i++) if (toneMap[i].test(t)) return i;
    const m = t.match(/([1-5])$/);
    return m ? parseInt(m[1]) : 5;
  }, []);

  const esc = useCallback((s: string) => 
    s.replace(/[&<>"']/g, m => ({'&':'&','<':'<','>':'>','"':'&quot;',"'":'&#39;'}[m]||m)), []);

  const segment = useCallback((text: string): Seg[] => {
    const res: Seg[] = [];
    let i = 0, N = text.length;
    
    while (i < N) {
      if (!isLetter(text[i])) {
        if (res.length) res[res.length - 1].sep += text[i];
        i++;
        continue;
      }
      
      let k = i;
      while (k < N && (isLetter(text[k]) || /[1-5]/.test(text[k]))) k++;
      const chunk = text.slice(i, k);
      let h = 0;
      
      while (h < chunk.length) {
        if (!isLetter(chunk[h])) {
          if (res.length) res[res.length - 1].sep += chunk[h];
          h++;
          continue;
        }
        
        let matched: { raw: string; base: string } | null = null;
        for (let end = Math.min(chunk.length, h + 7); end > h; end--) {
          const cand = chunk.slice(h, end);
          const base = cand.replace(/[1-5]$/, '');
          const norm = normalize(base.toLowerCase());
          if (syllables.has(norm)) {
            matched = { raw: cand, base };
            break;
          }
        }
        
        if (!matched) {
          if (res.length) res[res.length - 1].sep += chunk[h];
          h++;
          continue;
        }
        
        res.push({ syll: matched.base, tone: getTone(matched.raw), sep: '' });
        h += matched.raw.length;
      }
      
      i = k;
      while (i < N && !isLetter(text[i])) {
        if (res.length) res[res.length - 1].sep += text[i];
        i++;
      }
    }
    return res;
  }, [isLetter, normalize, getTone, syllables]);

  const renderPin = useCallback((seg: Seg[]) =>
    seg.map(s => `<span class="tone${s.tone}">${esc(s.syll)}</span>${esc(s.sep)}`).join(''), [esc]);

  // ADIÇÃO: classe "hanzi-font" para sincronizar a fonte via CSS var
  const renderHan = useCallback((text: string, tones: number[]) => {
    let i = 0, out = '';
    for (const c of text) {
      if (/[\u4E00-\u9FFF]/.test(c)) {
        out += `<span class="tone${tones[i] || 5} hanzi-font">${esc(c)}</span>`;
        i++;
      } else out += esc(c);
    }
    return out;
  }, [esc]);

  // ADIÇÃO: "hanzi-font" também no Hanzi empilhado
  const renderStacked = useCallback((seg: Seg[], text: string) => {
    const tones = seg.map(s => s.tone);
    let i = 0, out = '';
    for (const c of text) {
      if (/[\u4E00-\u9FFF]/.test(c)) {
        const t = tones[i] || 5;
        const p = esc(seg[i]?.syll || '');
        const h = esc(c);
        const pinHTML = colorPin ? `<span class="tone${t} stack-pinyin">${p}</span>` : `<span class="stack-pinyin">${p}</span>`;
        const hanHTML = colorHan   ? `<span class="tone${t} stack-hanzi hanzi-font">${h}</span>`   : `<span class="stack-hanzi hanzi-font">${h}</span>`;
        out += `<span class="stack">${pinHTML}${hanHTML}</span>`;
        i++;
      } else out += esc(c);
    }
    return out;
  }, [esc, colorPin, colorHan]);

  const process = useCallback(() => {
    const seg = segment(pin);
    const tones = seg.map(s => s.tone);
    setOutPin(renderPin(seg));
    setOutHan(renderHan(han, tones));
    setOutStack(renderStacked(seg, han));
    const hc = (han.match(/[\u4E00-\u9FFF]/g) || []).length;
    setWarn(seg.length !== hc ? `${seg.length} syllable(s) × ${hc} character(s).` : '');
  }, [pin, han, segment, renderPin, renderHan, renderStacked]);

  const copy = useCallback((ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    document.execCommand('copy');
    sel?.removeAllRanges();
    alert('✅ Copied!');
  }, []);

  const saveImg = useCallback(async (ref: React.RefObject<HTMLDivElement>, name: string) => {
    if (!ref.current || typeof window === 'undefined') return;
    const el = ref.current;
    el.style.display = 'inline-block';
    el.style.padding = '8px 8px 12px 8px';
    el.style.borderBottom = '4px solid transparent'; // reserva espaço extra
  
    // @ts-ignore - html2canvas loaded via CDN
    if (!window.html2canvas) {
      alert('Screenshot library not loaded');
      return;
    }
  
    try {
      // pequeno atraso para renderizar completamente antes da captura
      await new Promise(r => setTimeout(r, 120));
  
      // @ts-ignore
      const canvas = await window.html2canvas(el, { backgroundColor: null, scale: 3, useCORS: true });
      const link = document.createElement('a');
      link.download = `${name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
  
      // restaura o estilo original
      el.style.borderBottom = '';
      el.style.padding = '4px 8px';
      alert('✅ Image saved!');
    } catch (e) {
      alert('❌ Could not save image');
    }
  }, []);


  const copyImg = useCallback(async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current || typeof window === 'undefined') return;
    const el = ref.current;
    el.style.display = 'inline-block';
    el.style.padding = '8px 8px 12px 8px';
    el.style.borderBottom = '4px solid transparent';
  
    // @ts-ignore
    if (!window.html2canvas) {
      alert('Screenshot library not loaded');
      return;
    }
  
    try {
      await new Promise(r => setTimeout(r, 120));
  
      // @ts-ignore
      const canvas = await window.html2canvas(el, { backgroundColor: null, scale: 3, useCORS: true });
      el.style.borderBottom = '';
      el.style.padding = '4px 8px';
  
      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) {
          alert('❌ Unable to create image');
          return;
        }
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          alert('✅ Image copied to clipboard!');
        } catch {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'color2hanzi.png';
          link.click();
          alert('⚠️ Clipboard not supported — image downloaded instead');
        }
      });
    } catch (e) {
      alert('❌ Could not copy image');
    }
  }, []);

  const useExample = useCallback(() => {
    setPin('Bǎ zhège wǎngzhàn fēnxiǎng gěi yě xiǎng yòng yánsè xué shēngdiào de péngyǒu ba!\n\nMei3tian1 yi1 dian3dian3!');
    setHan('把这个网站分享给也想用颜色学声调的朋友吧！\n\n每天一点点');
    setTimeout(process, 50);
  }, [process]);

  const clear = useCallback(() => {
    setPin('');
    setHan('');
    setOutPin('');
    setOutHan('');
    setOutStack('');
    setWarn('');
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('https://color2hanzi.com');
      alert('✅ Link copied: https://color2hanzi.com');
    } catch {
      alert('⚠️ Could not copy link automatically');
    }
  }, []);

  const fonts = [
    "'Ma Shan Zheng','Noto Serif SC','Noto Serif Simplified Chinese',serif",
    "'Noto Serif SC','Noto Serif Simplified Chinese',serif",
    "'ZCOOL XiaoWei','Noto Serif SC','Noto Serif Simplified Chinese',serif"
  ];

  // Load html2canvas script
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // SINCRONIZAÇÃO DE FONTE: atualiza var CSS global e re-renderiza
  useEffect(() => {
    document.documentElement.style.setProperty('--hanzi-font', fonts[font]);
    if (pin || han) process();
  }, [font, process, pin, han]);

  return (
    <>
      <title>Color2Hanzi - Colorize Pinyin & Hanzi by Tones | Free Chinese Learning Tool</title>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;700&family=ZCOOL+XiaoWei&display=swap');
        :root{--t1:#FF4B4B;--t2:#FF9F1C;--t3:#2ECC71;--t4:#3498DB;--t5:#777}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.5;background:#fff;color:#222}
        .container{max-width:1100px;margin:0 auto;padding:12px}
        .tone1{color:var(--t1)}.tone2{color:var(--t2)}.tone3{color:var(--t3)}.tone4{color:var(--t4)}.tone5{color:var(--t5)}
        h1{font-size:1.35rem;margin:0 0 12px;font-weight:600}
        .title{font-size:2.2rem;font-weight:700;margin:0 0 24px;text-align:center;letter-spacing:0}
        textarea{width:100%;min-height:120px;padding:12px;border-radius:10px;border:1px solid #ccc;font-size:1rem;resize:vertical;font-family:'Noto Sans','Roboto','Open Sans',sans-serif;white-space:pre-wrap}
        textarea::placeholder{color:#999}
        .btn{display:inline-flex;align-items:center;gap:4px;padding:8px 14px;border-radius:8px;border:0;background:#111;color:#fff;font-weight:600;cursor:pointer;font-size:1rem;transition:background .2s}
        .btn:hover{background:#000}
        .btn-lg{font-size:1.2rem;padding:14px 32px;background:linear-gradient(90deg,#FF4B4B,#FF9F1C,#2ECC71,#3498DB,#777);background-size:300% 100%;box-shadow:0 4px 10px rgba(0,0,0,0.1);transition:all 0.4s ease;border-radius:10px}
        .btn-lg:hover{background-position:right center;transform:scale(1.03);background:linear-gradient(90deg,#FF4B4B,#FF9F1C,#2ECC71,#3498DB,#777);background-size:300% 100%}
        .btn-lg:active{transform:scale(0.97)}
        .btn-sec{background:#f2f2f2;color:#111;font-size:0.9rem;padding:6px 12px}
        .btn-sec:hover{background:#e5e5e5}
        .small{font-size:0.9rem;color:#555;margin-top:8px}
        .warn{background:#fff7e6;border:1px solid #ffe1a6;padding:8px 10px;border-radius:10px;margin:8px 0;color:#8a5a00;font-size:0.9rem}
        .block{border:1px dashed #ccc;border-radius:12px;padding:12px;margin-top:14px}
        .block-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-weight:600;gap:8px;flex-wrap:wrap}
        .out{font-size:1.15rem;line-height:1.9rem;white-space:pre-wrap;display:inline-block;overflow:visible;padding:4px 8px;margin:0;background:transparent}
        #outHan{font-size:1.6rem}
        .stack {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          vertical-align: middle;
          line-height: normal;
          overflow: visible;
          padding-bottom: 4px;
          margin: 0 3px;
        }
        .stack-pinyin {
          font-size: 0.7rem;           /* antes 0.95rem */
          line-height: 0.85rem;        /* antes 1.1rem */
          margin-bottom: 0.2rem;       /* espaço ligeiramente menor */
          font-family:'Inter','Noto Sans',system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif !important;
          letter-spacing:0.25px;
        }
        .stack-hanzi {
          font-size: 1.75rem;
          line-height: 1.35rem;
          margin-top: 0;
        }
        .fontpicker{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
        .fontpicker span{font-weight:600;font-size:0.9rem;margin-right:4px}
        .chip{background:#f7f7f7;color:#222;border:1px solid #ddd;border-radius:999px;padding:6px 10px;font-weight:600;cursor:pointer;transition:all .2s;font-size:0.9rem}
        .chip:hover{background:#eee}
        .chip.active{background:#111;color:#fff;border-color:#111}
        .toggle{position:absolute;top:16px;right:24px;display:flex;align-items:center;gap:8px;font-size:0.9rem}
        .toggle input{cursor:pointer}
        .btn-group{display:flex;gap:8px;flex-wrap:wrap}
        .options{display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap;font-size:0.9rem}
        .options label{display:flex;align-items:center;gap:4px;cursor:pointer}
        .options input{cursor:pointer}
        .grid{display:grid;gap:24px}
        .ad-top{background:#f9f9f9;padding:12px 0;border-bottom:1px solid #e5e5e5;margin-bottom:16px}
        @media(min-width:1024px){.grid{grid-template-columns:1fr 320px}}
        @media(max-width:640px){.title{font-size:1.8rem}.toggle{position:static;margin-bottom:16px}}
      `}</style>

      {/* Top Ad */}
      <div className="ad-top">
        <AdSlot width={728} height={90} slot="top" />
      </div>

      <main className="container">
        {/* Title */}
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
            {/* Pinyin */}
            <section aria-labelledby="pinyin-h">
              <h1 id="pinyin-h" style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                Pinyin
                <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                  <button className="btn-sec" onClick={useExample} aria-label="Use example text">Use Example</button>
                  <button className="btn-sec" onClick={clear} aria-label="Clear all inputs">Clear</button>
                </div>
              </h1>
              <textarea
                id="pin"
                aria-label="Enter Pinyin"
                maxLength={100000}
                placeholder="Example:&#10;Bǎ zhège wǎngzhàn fēnxiǎng gěi yě xiǎng yòng yánsè xué shēngdiào de péngyǒu ba!&#10;&#10;Mei3tian1 yi1 dian3dian3!"
                value={pin}
                onChange={e => setPin(e.target.value)}
              />
            </section>

            {/* Hanzi */}
            <section aria-labelledby="hanzi-h" style={{marginTop:'24px'}}>
              <h1 id="hanzi-h">Hanzi</h1>
              <div className="small">*The Hanzi colors will follow the same order as the Pinyin tones.</div>
              <textarea
                id="han"
                aria-label="Enter Hanzi characters"
                maxLength={100000}
                placeholder="Example:&#10;把这个网站分享给也想用颜色学声调的朋友吧！&#10;&#10;每天一点点"
                value={han}
                onChange={e => setHan(e.target.value)}
                style={{marginTop:'10px'}}
              />
            </section>

            {/* Button */}
            <div style={{marginTop:'20px',textAlign:'center'}}>
              <p style={{color:'#444',fontSize:'0.95rem',marginBottom:'15px'}}>
                Enter your text above and click below to color the tones.
              </p>
              <button className="btn btn-lg" onClick={process} aria-label="Colorize text by tones">
                🎨 <span style={{color:'#fff'}}>Generate</span>
              </button>
            </div>

            {/* Warning */}
            {warn && <div className="warn" role="alert">{warn}</div>}

            {/* Output 1: Pinyin */}
            <section aria-labelledby="out-pin-h">
              <div className="block">
                <div className="block-head">
                  <span id="out-pin-h">Colored Pinyin</span>
                  <div className="btn-group">
                    <button className="btn-sec" onClick={() => copy(pinRef)}>📋 Copy</button>
                    <button className="btn-sec" onClick={() => saveImg(pinRef, 'outPin')}>💾 Save</button>
                    <button className="btn-sec" onClick={() => copyImg(pinRef)}>🖼️ Print</button>
                  </div>
                </div>
                <div id="outPin" className="out" ref={pinRef} dangerouslySetInnerHTML={{__html:outPin}} />
              </div>
            </section>

            {/* Output 2: Hanzi */}
            <section aria-labelledby="out-han-h">
              <div className="block">
                <div className="block-head">
                  <span id="out-han-h">Colored Hanzi</span>
                  <div className="fontpicker" role="group" aria-label="Choose Hanzi font">
                    <span>Change font:</span>
                    {[1,2,3].map(i => (
                      <button
                        key={i}
                        className={`chip ${font===i-1?'active':''}`}
                        onClick={() => setFont(i-1)}
                        aria-label={`Font ${i}`}
                        aria-pressed={font===i-1}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                  <div className="btn-group">
                    <button className="btn-sec" onClick={() => copy(hanRef)}>📋 Copy</button>
                    <button className="btn-sec" onClick={() => saveImg(hanRef, 'outHan')}>💾 Save</button>
                    <button className="btn-sec" onClick={() => copyImg(hanRef)}>🖼️ Print</button>
                  </div>
                </div>
                <div 
                  id="outHan" 
                  className="out hanzi-font" 
                  ref={hanRef}
                  dangerouslySetInnerHTML={{__html:outHan}}
                />
              </div>
            </section>

            {/* Output 3: Stacked */}
            <section aria-labelledby="out-stack-h">
              <div className="block">
                <div className="block-head">
                  <span id="out-stack-h">Pinyin + Hanzi (Stacked)</span>
                  <div className="options">
                    <label>
                      <input type="checkbox" checked={colorPin} onChange={e => { setColorPin(e.target.checked); setTimeout(process, 10); }} />
                      Color Pinyin
                    </label>
                    <label>
                      <input type="checkbox" checked={colorHan} onChange={e => { setColorHan(e.target.checked); setTimeout(process, 10); }} />
                      Color Hanzi
                    </label>
                  </div>
                  <div className="btn-group">
                    <button className="btn-sec" onClick={() => copy(stackRef)}>📋 Copy</button>
                    <button className="btn-sec" onClick={() => saveImg(stackRef, 'outStack')}>💾 Save</button>
                    <button className="btn-sec" onClick={() => copyImg(stackRef)}>🖼️ Print</button>
                  </div>
                </div>
                <div 
                  id="outStack" 
                  className="out hanzi-font" 
                  ref={stackRef}
                  dangerouslySetInnerHTML={{__html:outStack}}
                />
              </div>
            </section>

            {/* Mid Ad */}
            <div style={{margin:'32px 0'}}>
              <AdSlot width={728} height={90} slot="mid" />
            </div>

            {/* Tips */}
            <section aria-labelledby="tips-h">
              <h1 id="tips-h">Best Practices to Get the Most Out of Your Studies</h1>
              <div className="small" style={{lineHeight:'1.8'}}>
                <p><span className="tone1">一</span> Write each Pinyin while trying to recall its tone — this strengthens your active memory.</p>
                <p><span className="tone4">二</span> Compare what you remembered with your course material or previous notes.</p>
                <p><span className="tone1">三</span> Watch out for auto-correct tools — they may change tones or simplify Pinyin incorrectly.</p>
                <p><span className="tone4">四</span> This site is designed for learning; it doesn't correct you — it helps you observe, repeat, and improve.</p>
                <p><span className="tone3">五</span> Hanzi characters are colored in the same order as the Pinyin tones.</p>
                <p><span className="tone4">六</span> Read out loud. Your voice helps your brain consolidate the sound and tone of each syllable.</p>
                <p><span className="tone1">七</span> Repeat the combinations you got wrong — but take your time; progress comes from mindful repetition.</p>
                <p><span className="tone1">八</span> Try making a simple sentence using the words you practiced. Context helps fix learning.</p>
                <p><span className="tone3">九</span> Review the next day, even if just for a few minutes. That's how knowledge becomes long-term memory.</p>
                <p><span className="tone2">十</span> Add this page to your favorites for easier access during your next study session.</p>
                <p style={{marginTop:'30px'}}>
                  ✨ Did learning feel easier? Share this page with your friends!<br /><br />
                  <span id="siteLink">color2hanzi.com</span>
                  <button className="btn" onClick={copyLink} style={{marginLeft:'6px',padding:'4px 10px',fontSize:'0.9rem',borderRadius:'6px'}} aria-label="Copy website link">
                    📋 Copy link
                  </button>
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="sidebar" style={{display:'none'}} aria-label="Advertisements">
            <div style={{position:'sticky',top:'24px'}}>
              <AdSlot width={300} height={600} slot="sidebar-1" />
              <div style={{marginTop:'24px'}}>
                <AdSlot width={300} height={250} slot="sidebar-2" />
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Ad */}
        <div style={{marginTop:'32px'}}>
          <AdSlot width={728} height={90} slot="bottom" />
        </div>

        {/* Mobile Ad */}
        <div style={{marginTop:'24px',display:'block'}} className="mobile-ad">
          <AdSlot width={300} height={250} slot="mobile" />
        </div>

        {/* Footer */}
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
