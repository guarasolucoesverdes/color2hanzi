import { useState, useRef, useCallback, useEffect } from 'react';

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

  const accentMap: Record<string, string[]> = {
    'a': ['ā','á','ǎ','à'],
    'e': ['ē','é','ě','è'],
    'i': ['ī','í','ǐ','ì'],
    'o': ['ō','ó','ǒ','ò'],
    'u': ['ū','ú','ǔ','ù'],
    'v': ['ǖ','ǘ','ǚ','ǜ'],
    'ü': ['ǖ','ǘ','ǚ','ǜ'],
  };

  const isLetter = useCallback((c: string) => /[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/.test(c), []);
  const getTone = useCallback((t: string): number => {
    for (let i = 1; i <= 4; i++) if (toneMap[i].test(t)) return i;
    const m = t.match(/([1-5])$/);
    return m ? parseInt(m[1]) : 5;
  }, []);

  const esc = useCallback((s: string) => 
    s.replace(/[&<>"']/g, m => ({'&':'&','<':'<','>':'>','"':'&quot;',"'":'&#39;'}[m]||m)), []);

  const applyTone = useCallback((syllBase: string, tone: number): string => {
    if (tone === 5 || tone === 0) return syllBase.replace(/v/g, 'ü');
    const lower = normalize(syllBase).toLowerCase();
    const vowels = Array.from(lower).map((ch, idx) => ({ ch, idx })).filter(o => 'aeiouv'.includes(o.ch));
    if (vowels.length === 0) return syllBase.replace(/v/g, 'ü');
    let targetIndex = lower.includes('a') ? lower.indexOf('a')
      : lower.includes('e') ? lower.indexOf('e')
      : lower.includes('ou') ? lower.indexOf('o')
      : vowels[vowels.length - 1].idx;
    const chars = Array.from(lower);
    const v = chars[targetIndex];
    const table = accentMap[v];
    if (!table) return syllBase.replace(/v/g, 'ü');
    chars[targetIndex] = table[tone - 1] || v;
    const out = chars.join('').replace(/v/g, 'ü');
    if (/^[A-Z]/.test(syllBase)) return out.charAt(0).toUpperCase() + out.slice(1);
    return out;
  }, [normalize]);

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
        const tone = getTone(matched.raw);
        res.push({ syll: normalize(matched.base), tone, sep: '' });
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
    seg.map(s => `<span class="tone${s.tone}">${esc(applyTone(s.syll, s.tone))}</span>${esc(s.sep)}`).join(''),
    [esc, applyTone]
  );

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

  const renderStacked = useCallback((seg: Seg[], text: string) => {
    const tones = seg.map(s => s.tone);
    let i = 0, out = '';
    for (const c of text) {
      if (/[\u4E00-\u9FFF]/.test(c)) {
        const t = tones[i] || 5;
        const p = esc(applyTone(seg[i]?.syll || '', t));
        const h = esc(c);
        const pinHTML = colorPin ? `<span class="tone${t} stack-pinyin">${p}</span>` : `<span class="stack-pinyin">${p}</span>`;
        const hanHTML = colorHan ? `<span class="tone${t} stack-hanzi hanzi-font">${h}</span>` : `<span className="stack-hanzi hanzi-font">${h}</span>`;
        out += `<span class="stack">${pinHTML}${hanHTML}</span>`;
        i++;
      } else out += esc(c);
    }
    return out;
  }, [esc, colorPin, colorHan, applyTone]);

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

  const useExample = useCallback(() => {
    setPin('Bǎ zhège wǎngzhàn fēnxiǎng gěi yě xiǎng yòng yánsè xué shēngdiào de péngyǒu ba!\nMei3tian1 yi1 dian3dian3!');
    setHan('把这个网站分享给也想用颜色学声调的朋友吧!\n每天一点点');
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

  const fonts = [
    "'Ma Shan Zheng','Noto Serif SC','Noto Serif Simplified Chinese',serif",
    "'Noto Serif SC','Noto Serif Simplified Chinese',serif",
    "'ZCOOL XiaoWei','Noto Serif SC','Noto Serif Simplified Chinese',serif"
  ];

  // === Novo useEffect com html2canvas + AdSense Auto Ads ===
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // html2canvas script existente
    const scriptCanvas = document.createElement('script');
    scriptCanvas.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    scriptCanvas.async = true;
    document.head.appendChild(scriptCanvas);

    // AdSense Auto Ads script
    const scriptAds = document.createElement('script');
    scriptAds.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    scriptAds.async = true;
    scriptAds.setAttribute('data-ad-client', 'ca-pub-YOUR_ID_HERE');
    document.head.appendChild(scriptAds);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--hanzi-font', fonts[font]);
  }, [font]);

  return (
    <>
      <title>Color2Hanzi - Colorize Pinyin & Hanzi by Tones</title>
      {/* O restante do JSX segue igual */}
      {/* ... */}
    </>
  );
}
