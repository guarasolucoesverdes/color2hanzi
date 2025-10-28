import { useState, useRef, useCallback, memo, useEffect } from 'react';

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

  // === Load html2canvas + Auto Ads ===
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // html2canvas
    const scriptCanvas = document.createElement('script');
    scriptCanvas.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    scriptCanvas.async = true;
    document.head.appendChild(scriptCanvas);

    // Google Auto Ads
    const scriptAds = document.createElement('script');
    scriptAds.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    scriptAds.async = true;
    scriptAds.setAttribute('data-ad-client', 'ca-pub-9753698333518224');
    scriptAds.crossOrigin = 'anonymous';
    document.head.appendChild(scriptAds);
  }, []);

  // --- Core logic ---
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

  const accentMap: Record<string, string[]> = {
    a: ['ā','á','ǎ','à'],
    e: ['ē','é','ě','è'],
    i: ['ī','í','ǐ','ì'],
    o: ['ō','ó','ǒ','ò'],
    u: ['ū','ú','ǔ','ù'],
    v: ['ǖ','ǘ','ǚ','ǜ'],
    ü: ['ǖ','ǘ','ǚ','ǜ'],
  };

  const esc = useCallback((s: string) => s.replace(/[&<>"']/g, m => ({'&':'&','<':'<','>':'>','"':'&quot;',"'":'&#39;'}[m]||m)), []);

  const applyTone = useCallback((syllBase: string, tone: number): string => {
    if (tone === 5 || tone === 0) return syllBase.replace(/v/g, 'ü');
    const lower = normalize(syllBase).toLowerCase();
    const vowels = Array.from(lower).map((ch, idx) => ({ ch, idx })).filter(o => 'aeiouv'.includes(o.ch));
    if (!vowels.length) return syllBase.replace(/v/g, 'ü');
    let targetIndex = lower.includes('a') ? lower.indexOf('a') :
                      lower.includes('e') ? lower.indexOf('e') :
                      lower.includes('ou') ? lower.indexOf('o') :
                      vowels[vowels.length - 1].idx;
    const chars = Array.from(lower);
    const v = chars[targetIndex];
    const table = accentMap[v];
    if (!table) return syllBase.replace(/v/g, 'ü');
    chars[targetIndex] = table[tone - 1] || v;
    const out = chars.join('').replace(/v/g, 'ü');
    return /^[A-Z]/.test(syllBase) ? out.charAt(0).toUpperCase() + out.slice(1) : out;
  }, [normalize]);

  const isLetter = (c: string) => /[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/.test(c);
  const getTone = (t: string): number => {
    for (let i = 1; i <= 4; i++) if (toneMap[i].test(t)) return i;
    const m = t.match(/([1-5])$/);
    return m ? parseInt(m[1]) : 5;
  };

  const syllables = useRef(new Set(
    'a ai an ang ao ba bai ban bang bao bei ben beng bi bian biao bie bin bing bo bu ca cai can cang cao ce cen ceng cha chai chan chang chao che chen cheng chi chong chou chu chua chuai chuan chuang chui chun chuo ci cong cou cu cuan cui cun cuo da dai dan dang dao de dei den deng di dia dian diao die ding diu dong dou du duan dui dun duo e ei en eng er fa fan fang fei fen feng fo fou fu ga gai gan gang gao ge gei gen geng gong gou gu gua guai guan guang gui gun guo ha hai han hang hao he hei hen heng hong hou hu hua huai huan huang hui hun huo ji jia jian jiang jiao jie jin jing jiong jiu ju juan jue jun ka kai kan kang kao ke ken keng kong kou ku kua kuai kuan kuang kui kun kuo la lai lan lang lao le lei leng li lia lian liang liao lie lin ling liu lo long lou lu luan lun luo lv lve ma mai man mang mao me mei men meng mi mian miao mie min ming miu mo mou mu na nai nan nang nao ne nei nen neng ni nian niang niao nie nin ning niu nong nou nu nuan nun nuo nv nve o ou pa pai pan pang pao pei pen peng pi pian piao pie pin ping po pou pu qi qia qian qiang qiao qie qin qing qiong qiu qu quan que qun ran rang rao re ren reng ri rong rou ru ruan rui run ruo sa sai san sang sao se sen seng sha shai shan shang shao she shen sheng shi shou shu shua shuai shuan shuang shui shun shuo si song sou su suan sui sun suo ta tai tan tang tao te teng ti tian tiao tie ting tong tou tu tuan tui tun tuo wa wai wan wang wei wen weng wo wu xi xia xian xiang xiao xie xin xing xiong xiu xu xuan xue xun ya yan yang yao ye yi yin ying yo yong you yu yuan yue yun za zai zan zang zao ze zei zen zeng zha zhai zhan zhang zhao zhe zhen zheng zhi zhong zhou zhu zhua zhuai zhuan zhuang zhui zhun zhuo zi zong zou zu zuan zui zun zuo'.split(' ')
  )).current;

  const segment = (text: string) => {
    const res: Seg[] = [];
    let i = 0;
    while (i < text.length) {
      if (!isLetter(text[i])) { if (res.length) res[res.length - 1].sep += text[i]; i++; continue; }
      let k = i;
      while (k < text.length && (isLetter(text[k]) || /[1-5]/.test(text[k]))) k++;
      const chunk = text.slice(i, k);
      let matched = null;
      for (let end = Math.min(chunk.length, i + 7); end > i; end--) {
        const cand = chunk.slice(i, end);
        const base = cand.replace(/[1-5]$/, '');
        const norm = normalize(base.toLowerCase());
        if (syllables.has(norm)) { matched = { base, tone: getTone(cand) }; break; }
      }
      if (matched) res.push({ syll: matched.base, tone: matched.tone, sep: '' });
      i = k;
    }
    return res;
  };

  const renderPin = (seg: Seg[]) => seg.map(s => `<span class="tone${s.tone}">${esc(applyTone(s.syll, s.tone))}</span>${esc(s.sep)}`).join('');
  const renderHan = (text: string, tones: number[]) => Array.from(text).map((c, i) => /[\u4E00-\u9FFF]/.test(c) ? `<span class="tone${tones[i] || 5} hanzi-font">${esc(c)}</span>` : esc(c)).join('');
  const renderStacked = (seg: Seg[], text: string) => {
    const tones = seg.map(s => s.tone);
    let i = 0;
    return Array.from(text).map(c => {
      if (/[\u4E00-\u9FFF]/.test(c)) {
        const t = tones[i] || 5;
        const p = esc(applyTone(seg[i]?.syll || '', t));
        const h = esc(c);
        i++;
        return `<span class="stack">${colorPin ? `<span class="tone${t} stack-pinyin">${p}</span>` : `<span class="stack-pinyin">${p}</span>`}${colorHan ? `<span class="tone${t} stack-hanzi hanzi-font">${h}</span>` : `<span class="stack-hanzi hanzi-font">${h}</span>`}</span>`;
      }
      return esc(c);
    }).join('');
  };

  const process = () => {
    const seg = segment(pin);
    const tones = seg.map(s => s.tone);
    setOutPin(renderPin(seg));
    setOutHan(renderHan(han, tones));
    setOutStack(renderStacked(seg, han));
    const hc = (han.match(/[\u4E00-\u9FFF]/g) || []).length;
    setWarn(seg.length !== hc ? `${seg.length} syllable(s) × ${hc} character(s).` : '');
  };

  const copy = (ref: any) => {
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    document.execCommand('copy');
    sel?.removeAllRanges();
    alert('✅ Copied!');
  };

  const saveImg = async (ref: React.RefObject<HTMLDivElement>, name: string) => {
    if (!ref.current || typeof window === 'undefined') return;
    // @ts-ignore
    if (!window.html2canvas) return alert('html2canvas not loaded');
    // @ts-ignore
    const canvas = await window.html2canvas(ref.current, { backgroundColor: null, scale: 3, useCORS: true });
    const link = document.createElement('a');
    link.download = `${name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const useExample = () => {
    setPin('Bǎ zhège wǎngzhàn fēnxiǎng gěi yě xiǎng yòng yánsè xué shēngdiào de péngyǒu ba!\nMei3tian1 yi1 dian3dian3!');
    setHan('把这个网站分享给也想用颜色学声调的朋友吧!\n每天一点点');
    setTimeout(process, 50);
  };

  const clear = () => {
    setPin(''); setHan(''); setOutPin(''); setOutHan(''); setOutStack(''); setWarn('');
  };

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
        .title{font-size:2.2rem;font-weight:700;margin:0 0 24px;text-align:center}
        textarea{width:100%;min-height:120px;padding:12px;border-radius:10px;border:1px solid #ccc;font-size:1rem;resize:vertical;font-family:'Noto Sans','Roboto','Open Sans',sans-serif;white-space:pre-wrap}
        textarea::placeholder{color:#999}
        .btn{display:inline-flex;align-items:center;gap:4px;padding:8px 14px;border-radius:8px;border:0;background:#111;color:#fff;font-weight:600;cursor:pointer;font-size:1rem;transition:background .2s}
        .btn:hover{background:#000}
        .btn-lg{font-size:1.2rem;padding:14px 32px;background:linear-gradient(90deg,#FF4B4B,#FF9F1C,#2ECC71,#3498DB,#777);background-size:300% 100%;box-shadow:0 4px 10px rgba(0,0,0,0.1);transition:all 0.4s ease;border-radius:10px}
        .btn-lg:hover{background-position:right center;transform:scale(1.03)}
        .btn-sec{background:#f2f2f2;color:#111;font-size:0.9rem;padding:6px 12px}
        .btn-sec:hover{background:#e5e5e5}
        .block{border:1px dashed #ccc;border-radius:12px;padding:12px;margin-top:14px}
        .block-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-weight:600;gap:8px;flex-wrap:wrap}
        .out{font-size:1.15rem;line-height:2.6rem;white-space:pre-wrap;display:block;padding:4px 8px;background:transparent;text-align:left}
        .ad-top{background:#f9f9f9;padding:12px 0;border-bottom:1px solid #e5e5e5;margin-bottom:16px}
      `}</style>

      <div className="ad-top">
        <AdSlot width={728} height={90} slot="top" />
      </div>

      <main className="container">
        <h1 className="title">
          <span style={{color:'#000'}}>Color2</span>
          <span className="tone1">H</span>
          <span className="tone2">a</span>
          <span className="tone3">n</span>
          <span className="tone4">z</span>
          <span className="tone5">i</span>
        </h1>

        <section>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginBottom:'12px'}}>
            <button className="btn-sec" onClick={useExample}>Use Example</button>
            <button className="btn-sec" onClick={clear}>Clear</button>
          </div>
          <textarea placeholder="Enter Pinyin..." value={pin} onChange={e => setPin(e.target.value)} />
          <textarea placeholder="Enter Hanzi..." value={han} onChange={e => setHan(e.target.value)} />
          <div style={{textAlign:'center',marginTop:'20px'}}>
            <button className="btn btn-lg" onClick={process}>Generate</button>
          </div>
          {warn && <div className="warn">{warn}</div>}
        </section>

        <section>
          <div className="block">
            <div className="block-head">
              <span>Colored Pinyin</span>
              <div className="btn-group">
                <button className="btn-sec" onClick={() => copy(pinRef)}>📋 Copy</button>
                <button className="btn-sec" onClick={() => saveImg(pinRef, 'outPin')}>💾 Save</button>
              </div>
            </div>
            <div ref={pinRef} className="out" dangerouslySetInnerHTML={{__html:outPin}} />
          </div>

          <div className="block">
            <div className="block-head">
              <span>Colored Hanzi</span>
              <div className="btn-group">
                <button className="btn-sec" onClick={() => copy(hanRef)}>📋 Copy</button>
                <button className="btn-sec" onClick={() => saveImg(hanRef, 'outHan')}>💾 Save</button>
              </div>
            </div>
            <div ref={hanRef} className="out hanzi-font" dangerouslySetInnerHTML={{__html:outHan}} />
          </div>

          <div style={{margin:'32px 0'}}>
            <AdSlot width={728} height={90} slot="mid" />
          </div>

          <div className="block">
            <div className="block-head">
              <span>Stacked</span>
              <div className="btn-group">
                <button className="btn-sec" onClick={() => copy(stackRef)}>📋 Copy</button>
                <button className="btn-sec" onClick={() => saveImg(stackRef, 'outStack')}>💾 Save</button>
              </div>
            </div>
            <div ref={stackRef} className="out hanzi-font" dangerouslySetInnerHTML={{__html:outStack}} />
          </div>
        </section>

        <div style={{marginTop:'32px'}}>
          <AdSlot width={728} height={90} slot="bottom" />
        </div>
      </main>
    </>
  );
}
