/**
 * Lightweight Client-Side Device & Canvas Fingerprinter (Zero Dependencies)
 * Modeled directly after the SPOT project (apps/web/src/api/fingerprint.ts).
 */

function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

export function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no_2d';

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Fazley Portfolio Canvas, <fp:1.0> 👾', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Fazley Portfolio Canvas, <fp:1.0> 👾', 4, 17);

    return canvas.toDataURL();
  } catch {
    return 'canvas_err';
  }
}

export function getWebGLInfo(): { vendor: string; renderer: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return { vendor: 'no_webgl', renderer: 'no_webgl' };

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return { vendor: 'generic', renderer: 'generic' };

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
    return { vendor, renderer };
  } catch {
    return { vendor: 'err', renderer: 'err' };
  }
}

export async function getDeviceFingerprint(): Promise<string> {
  if (typeof window === 'undefined') return 'server_render';

  // Check cache
  const cached = localStorage.getItem('portfolio_device_fp');
  if (cached && cached.startsWith('dfp_')) return cached;

  try {
    const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}@${window.devicePixelRatio || 1}`;
    const platformInfo =
      (navigator as any).userAgentData?.platform || navigator.platform || '';
    const navInfo = `${navigator.language || ''}|${(navigator as any).hardwareConcurrency || ''}|${(navigator as any).deviceMemory || ''}|${platformInfo}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const canvasHash = simpleHash(getCanvasFingerprint());
    const webgl = getWebGLInfo();
    const webglHash = simpleHash(`${webgl.vendor}~${webgl.renderer}`);

    const rawString = `${screenInfo}#${navInfo}#${timezone}#${canvasHash}#${webglHash}`;
    const hash1 = simpleHash(rawString);
    const hash2 = simpleHash(rawString.split('').reverse().join(''));
    const fingerprint = `dfp_${hash1}${hash2}`.substring(0, 32);

    localStorage.setItem('portfolio_device_fp', fingerprint);
    return fingerprint;
  } catch {
    const fallback = `dfp_${Math.random().toString(36).substring(2, 18)}`;
    localStorage.setItem('portfolio_device_fp', fallback);
    return fallback;
  }
}

export interface VisitorTelemetry {
  fingerprint: string;
  platform: string;
  language: string;
  languages?: string;
  timezone: string;
  screen: string;
  viewport: string;
  hardware: string;
  referrer: string;
  path: string;
  connection?: string;
}

export async function collectVisitorTelemetry(): Promise<VisitorTelemetry> {
  const fp = await getDeviceFingerprint();
  const nav = navigator as any;

  const width = window.screen?.width || 0;
  const height = window.screen?.height || 0;
  const dpr = window.devicePixelRatio || 1;
  const depth = window.screen?.colorDepth || 24;
  const screenStr = `${width}x${height} (${depth}-bit @ ${dpr}x)`;
  const viewportStr = `${window.innerWidth}x${window.innerHeight}`;

  const cores = nav.hardwareConcurrency ? `${nav.hardwareConcurrency} Cores` : '';
  const memory = nav.deviceMemory ? `${nav.deviceMemory}GB RAM` : '';
  const webgl = getWebGLInfo();
  // Shorten clean GPU name (e.g., "Apple M2 Max" or "NVIDIA GeForce RTX 3080")
  let gpuClean = webgl.renderer
    .replace(/^ANGLE \(/, '')
    .replace(/\)$/, '')
    .replace(/vs_\d+_\d+.*$/, '')
    .trim();
  if (gpuClean.length > 40) gpuClean = gpuClean.slice(0, 40) + '...';

  const hwParts = [cores, memory, gpuClean ? `GPU: ${gpuClean}` : ''].filter(Boolean);
  const hardwareStr = hwParts.join(' • ') || 'Standard';

  const platform = nav.userAgentData?.platform || nav.platform || 'Unknown';
  const language = nav.language || 'en';
  const languages = nav.languages ? nav.languages.slice(0, 3).join(', ') : undefined;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const connection = nav.connection?.effectiveType;

  return {
    fingerprint: fp,
    platform,
    language,
    languages,
    timezone,
    screen: `${screenStr} • Viewport: ${viewportStr}`,
    viewport: viewportStr,
    hardware: hardwareStr,
    referrer: document.referrer || '',
    path: window.location.pathname + window.location.search,
    connection,
    webdriver: Boolean(nav.webdriver || document.documentElement.getAttribute('webdriver')),
  };
}

/**
 * Filter out automated test runners, scrapers, and headless crawlers.
 */
export function isLikelyHuman(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = navigator as any;

  // 1. W3C automation indicator (Puppeteer, Playwright, Selenium)
  if (nav.webdriver === true || document.documentElement.getAttribute('webdriver')) {
    return false;
  }

  // 2. Headless Chrome / Bot User-Agent detection
  const ua = (nav.userAgent || '').toLowerCase();
  const botKeywords = [
    'headless',
    'bot',
    'crawler',
    'spider',
    'scraper',
    'puppeteer',
    'selenium',
    'playwright',
    'phantomjs',
    'lighthouse',
    'postman',
  ];
  if (botKeywords.some((kw) => ua.includes(kw))) {
    return false;
  }

  // 3. Software/Headless WebGL SwiftShader detection
  const webgl = getWebGLInfo();
  if (/swiftshader/i.test(webgl.renderer) || /llvmpipe/i.test(webgl.renderer)) {
    return false;
  }

  return true;
}

