// app.tsx (versão funcional sem blocos de anúncios, com SEO e recomendações de estudo)
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

  const syllables = useRef(new Set('a ai an ang ao ba bai ban bang bao bei ben beng bi bian biao bie bin bing bo bu ca cai can cang cao ce cen ceng cha chai chan chang chao che chen cheng chi chong chou chu chua chuai chuan chuang chui chun chuo ci cong cou cu cuan cui cun cuo da dai dan dang dao de dei den deng di dia dian diao die ding diu dong dou du duan dui dun duo e ei en eng er fa fan fang fei fen feng fo fou fu ga gai gan gang gao ge gei gen geng gong gou gu gua guai guan guang gui gun guo ha hai han hang hao he hei hen heng hong hou hu hua huai huan huang hui hun huo ji jia jian jiang jiao jie jin jing jiong jiu ju juan jue jun ka kai kan kang kao ke ken keng kong kou ku kua kuai kuan kuang kui kun kuo la lai lan lang lao le lei leng li lia lian liang liao lie lin ling liu lo long lou lu luan lun luo lv lve ma mai man mang mao me mei men meng mi mian miao mie min ming miu mo mou mu na nai nan nang nao ne nei nen neng ni nian niang niao nie nin ning niu nong nou nu nuan nun nuo nv nve o ou pa pai pan pang pao pei pen peng pi pian piao pie pin ping po pou pu qi qia qian qiang qiao qie qin qing qiong qiu qu quan que qun ran rang rao re ren reng ri rong rou ru ruan rui run ruo sa sai san sang sao se sen seng sha shai shan shang shao she shen sheng shi shou shu shua shuai shuan shuang shui shun shuo si song sou su suan sui sun suo ta tai tan tang tao te teng ti tian tiao tie ting tong tou tu tuan tui tun tuo wa wai wan wang wei wen weng wo wu xi xia xian xiang xiao xie xin xing xiong xiu xu xuan xue xun ya yan yang yao ye yi yin ying yo yong you yu yuan yue yun za zai zan zang zao ze zei zen zeng zha zhai zhan zhang zhao zhe zhen zheng zhi zhong zhou zhu zhua zhuai zhuan zhuang zhui zhun zhuo zi zong zou zu zuan zui zun zuo'.split(' '))).current;

  const toneMap: Record<number, RegExp> = {
    1: /[āēīōūǖ]/i,
    2: /[áéíóúǘ]/i,
    3: /[ǎěǐǒǔǚ]/i,
    4: /[àèìòùǜ]/i
  };

  const normalize = useCallback((p: string) => {
    const m: Record<string, string> = {
      'ā': 'a','á': 'a','ǎ': 'a','à': 'a','ē': 'e','é': 'e','ě': 'e','è': 'e',
      'ī': 'i','í': 'i','ǐ': 'i','ì': 'i','ō': 'o','ó': 'o','ǒ': 'o','ò': 'o',
      'ū': 'u','ú': 'u','ǔ': 'u','ù': 'u','ǖ': 'v','ǘ': 'v','ǚ': 'v','ǜ': 'v','ü': 'v'
    };
    return p.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, c => m[c] || c);
  }, []);

  const applyTone = useCallback((base: string, tone: number): string => {
    if (tone === 5 || tone === 0) return base.replace(/v/g, 'ü');
    const lower = normalize(base).toLowerCase();
    const vowels = Array.from(lower).map((c, i) => ({ c, i })).filter(o => 'aeiouv'.includes(o.c));
    let idx = lower.indexOf('a');
    if (idx < 0) idx = lower.indexOf('e');
    if (idx < 0 && lower.includes('ou')) idx = lower.indexOf('o');
    if (idx < 0 && vowels.length) idx = vowels[vowels.length - 1].i;
    const chars = Array.from(lower);
    const accentMap: Record<string, string[]> = {
      a: ['ā','á','ǎ','à'], e: ['ē','é','ě','è'], i: ['ī','í','ǐ','ì'],
      o: ['ō','ó','ǒ','ò'], u: ['ū','ú','ǔ','ù'], v: ['ǖ','ǘ','ǚ','ǜ'],
    };
    const mark = accentMap[chars[idx]]?.[tone - 1] || chars[idx];
    chars[idx] = mark;
    return chars.join('').replace(/v/g, 'ü');
  }, [normalize]);

  const getTone = useCallback((s: string): number => {
    for (let i = 1; i <= 4; i++) if (toneMap[i].test(s)) return i;
    const m = s.match(/([1-5])$/);
    return m ? parseInt(m[1]) : 5;
  }, []);

  const segment = useCallback((text: string): Seg[] => {
    const res: Seg[] = [];
    let i = 0;
    while (i < text.length) {
      if (!/[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/.test(text[i])) {
        if (res.length) res[res.length - 1].sep += text[i];
        i++;
        continue;
      }
      let k = i;
      while (k < text.length && /[A-Za-z1-5āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/.test(text[k])) k++;
      const chunk = text.slice(i, k);
      const tone = getTone(chunk);
      const base = normalize(chunk.replace(/[1-5]$/, ''));
      if (syllables.has(base)) res.push({ syll: base, tone, sep: '' });
      else if (res.length) res[res.length - 1].sep += chunk;
      i = k;
    }
    return res;
  }, [getTone, normalize, syllables]);

  const esc = (s: string) => s.replace(/[&<>"]+/g, m => ({ '&': '&', '<': '<', '>': '>', '"': '&quot;' }[m]!);

  const renderPin = useCallback((seg: Seg[]) => seg.map(s => `<span class="tone${s.tone}">${esc(applyTone(s.syll, s.tone))}</span>${esc(s.sep)}`).join(''), [applyTone]);
  const renderHan = useCallback((txt: string, tones: number[]) => {
    let i = 0;
    return Array.from(txt).map(c => /[一-鿿]/.test(c) ? `<span class="tone${tones[i++] || 5} hanzi-font">${esc(c)}</span>` : esc(c)).join('');
  }, []);

  const renderStacked = useCallback((seg: Seg[], txt: string) => {
    const tones = seg.map(s => s.tone);
    let i = 0;
    return Array.from(txt).map(c => {
      if (/[一-鿿]/.test(c)) {
        const p = applyTone(seg[i]?.syll || '', tones[i] || 5);
        const h = esc(c);
        const tone = tones[i] || 5;
        i++;
        return `<span class="stack"><span class="tone${tone} stack-pinyin">${esc(p)}</span><span class="tone${tone} stack-hanzi hanzi-font">${h}</span></span>`;
      }
      return esc(c);
    }).join('');
  }, [applyTone]);

  const process = useCallback(() => {
    const seg = segment(pin);
    const tones = seg.map(s => s.tone);
    setOutPin(renderPin(seg));
    setOutHan(renderHan(han, tones));
    setOutStack(renderStacked(seg, han));
    const hc = (han.match(/[一-鿿]/g) || []).length;
    setWarn(seg.length !== hc ? `${seg.length} syllable(s) × ${hc} character(s).` : '');
  }, [pin, han, segment, renderPin, renderHan, renderStacked]);

  const useExample = () => {
    setPin('Bǎ zhège wǎngzhàn fēnxiǎng gěi yě xiǎng yòng yánsè xué shēngdiào de péngyǒu ba!\nMei3tian1 yi1 dian3dian3!');
    setHan('把这个网站分享给也想用颜色学声调的朋友吧!\n每天一点点');
    setTimeout(process, 50);
  };

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

        {/* Inputs e botões */}
        {/* Outputs: outPin, outHan, outStack */}

        <section aria-labelledby="tips-h">
          <h1 id="tips-h">Best Practices to Get the Most Out of Your Studies</h1>
          <ul style={{lineHeight:'1.8', fontSize: '0.95rem'}}>
            <li>Write each Pinyin while trying to recall its tone — this strengthens your active memory.</li>
            <li>Compare what you remembered with your course material or previous notes.</li>
            <li>Watch out for auto-correct tools — they may change tones or simplify Pinyin incorrectly.</li>
            <li>This site is designed for learning; it doesn't correct you — it helps you observe, repeat, and improve.</li>
            <li>Hanzi characters are colored in the same order as the Pinyin tones.</li>
            <li>Read out loud. Your voice helps your brain consolidate the sound and tone of each syllable.</li>
            <li>Repeat the combinations you got wrong — but take your time; progress comes from mindful repetition.</li>
            <li>Try making a simple sentence using the words you practiced. Context helps fix learning.</li>
            <li>Review the next day, even if just for a few minutes. That's how knowledge becomes long-term memory.</li>
            <li>Add this page to your favorites for easier access during your next study session.</li>
          </ul>
        </section>

        <footer style={{marginTop:'48px',padding:'24px 0',borderTop:'1px solid #e5e5e5',textAlign:'center',fontSize:'0.85rem',color:'#666'}}>
          <p>© 2025 Color2Hanzi - Free tool for Chinese language learners</p>
          <p style={{marginTop:'8px'}}>Learn Chinese by colorizing Pinyin and Hanzi by tones</p>
        </footer>
      </main>
    </>
  );
}