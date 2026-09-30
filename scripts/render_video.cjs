/* Render video/agent-tools-antigravity/ to an MP4 without any external service.
   Frames are captured deterministically from the local composition page (every
   animation is seeked to the frame time), encoded with local ffmpeg, and mixed
   with a soundtrack synthesized by scripts/video_audio.py.

   Needs the site served locally (python3 -m http.server 8000) and Playwright
   installed outside the repo. Environment:
     SITE_URL        default http://127.0.0.1:8000
     CHROME_PATH     default /usr/bin/google-chrome
     VIDEO_WORK_DIR  default /tmp/presentation-video (frames never touch the repo)
     VIDEO_OUT_DIR   default video/out (ignored by git)
     VIDEO_WORKERS   parallel capture/encode workers, default 6
     VIDEO_RANGE     optional "from-to" in seconds for a partial preview render */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync, execFileSync } = require('node:child_process');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const base = process.env.SITE_URL || 'http://127.0.0.1:8000';
const chromePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const work = process.env.VIDEO_WORK_DIR || '/tmp/presentation-video';
const outDir = path.resolve(root, process.env.VIDEO_OUT_DIR || 'video/out');
const workers = Math.max(1, Number(process.env.VIDEO_WORKERS) || Math.min(6, Math.floor(os.cpus().length / 3)));
const pageUrl = `${base}/video/agent-tools-antigravity/?render`;
const deckFile = path.join(root, 'slides/agent-tools-antigravity/index.html');
const NAME = 'ai-tools-intro';

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26, ...opts }).toString();

const openPage = async () => {
  const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pageUrl, { waitUntil: 'load' });
  const info = await page.evaluate(() => window.VIDEO.ready);
  if (errors.length) throw new Error(`Composition errors: ${errors.join('; ')}`);
  return { browser, page, info };
};

const stamp = ms => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  const f = Math.floor(ms % 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(f).padStart(3, '0')}`;
};

const encoderArgs = (fps, file) => [
  '-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-framerate', String(fps), '-i', '-',
  '-vf', 'scale=out_color_matrix=bt709:out_range=tv:flags=bicubic,format=yuv420p',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-tune', 'animation', '-profile:v', 'high', '-level:v', '4.2',
  '-g', String(fps * 2), '-keyint_min', String(fps), '-threads', '4',
  '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
  '-movflags', '+faststart', file
];

// One worker: its own browser, a contiguous range of frames, one H.264 segment.
const renderSegment = async (index, first, last, fps, progress) => {
  const { browser, page } = await openPage();
  const file = path.join(work, `segment-${String(index).padStart(2, '0')}.mp4`);
  const ffmpeg = spawn('ffmpeg', encoderArgs(fps, file), { stdio: ['pipe', 'ignore', 'pipe'] });
  let stderr = '';
  ffmpeg.stderr.on('data', chunk => { stderr += chunk; });
  const done = new Promise((resolve, reject) => ffmpeg.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg segment ${index}: ${stderr}`)))));
  try {
    const cdp = await page.context().newCDPSession(page);
    for (let frame = first; frame < last; frame++) {
      await page.evaluate(t => window.VIDEO.seek(t), (frame * 1000) / fps);
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, captureBeyondViewport: false });
      if (!ffmpeg.stdin.write(Buffer.from(data, 'base64'))) await new Promise(resolve => ffmpeg.stdin.once('drain', resolve));
      progress(1);
    }
  } finally {
    ffmpeg.stdin.end();
    await browser.close();
  }
  await done;
  return file;
};

(async () => {
  fs.mkdirSync(work, { recursive: true });
  fs.mkdirSync(outDir, { recursive: true });

  const probe = await openPage();
  const { info } = probe;
  await probe.browser.close();

  // The video mirrors the deck: same sections, same order.
  const deckIds = [...fs.readFileSync(deckFile, 'utf8').matchAll(/<section id="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(info.scenes.map(s => s.id), deckIds, 'Video scenes must match the deck sections');
  assert.ok(info.animations > 500, 'Composition built too few animations');

  const fps = info.fps;
  const [fromS, toS] = (process.env.VIDEO_RANGE || '').split('-').map(Number);
  const partial = Number.isFinite(fromS) && Number.isFinite(toS);
  const firstFrame = partial ? Math.round(fromS * fps) : 0;
  const lastFrame = partial ? Math.min(info.frames, Math.round(toS * fps)) : info.frames;
  const count = lastFrame - firstFrame;
  console.log(`Composition: ${(info.total / 1000).toFixed(1)}s, ${info.scenes.length} scenes, ${info.captions.length} captions, ${info.sounds.length} sounds, ${info.animations} animations`);
  console.log(`Rendering frames ${firstFrame}–${lastFrame} (${count}) at ${fps} fps with ${workers} workers`);

  // Captions as SRT for players and uploads; the video also shows them on screen.
  const srt = info.captions.map((c, i) => `${i + 1}\n${stamp(c.t0)} --> ${stamp(c.t1)}\n${c.text}\n`).join('\n');
  const eventsFile = path.join(work, 'events.json');
  fs.writeFileSync(eventsFile, JSON.stringify({ total: info.total, sounds: info.sounds, cards: info.cards }));

  let finished = 0;
  const started = Date.now();
  let lastLog = 0;
  const progress = n => {
    finished += n;
    const now = Date.now();
    if (now - lastLog > 15000 || finished === count) {
      lastLog = now;
      const rate = finished / ((now - started) / 1000);
      console.log(`  ${finished}/${count} frames · ${rate.toFixed(1)} fps · ETA ${Math.round((count - finished) / rate)}s`);
    }
  };
  const size = Math.ceil(count / workers);
  const jobs = [];
  for (let i = 0; i < workers; i++) {
    const a = firstFrame + i * size;
    const b = Math.min(lastFrame, a + size);
    if (a < b) jobs.push(renderSegment(i, a, b, fps, progress));
  }
  const segments = await Promise.all(jobs);

  const list = path.join(work, 'segments.txt');
  fs.writeFileSync(list, segments.map(f => `file '${f}'`).join('\n'));
  const silent = path.join(work, 'video-only.mp4');
  run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);

  const audio = path.join(work, 'audio.wav');
  console.log(run('python3', [path.join(__dirname, 'video_audio.py'), eventsFile, audio]).trim());

  // Two-pass loudness normalisation to a calm -18 LUFS with -1.5 dBTP headroom.
  const measure = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', audio, '-af', 'loudnorm=I=-18:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 26 }).stderr;
  const stats = JSON.parse(measure.slice(measure.lastIndexOf('{')));
  const loudnorm = `loudnorm=I=-18:TP=-1.5:LRA=11:measured_I=${stats.input_i}:measured_TP=${stats.input_tp}:measured_LRA=${stats.input_lra}:measured_thresh=${stats.input_thresh}:offset=${stats.target_offset}:linear=true`;

  const suffix = partial ? `-preview-${fromS}-${toS}` : '';
  const target = path.join(outDir, `${NAME}${suffix}.mp4`);
  const audioArgs = partial ? ['-ss', String(firstFrame / fps), '-t', String(count / fps)] : [];
  run('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, ...audioArgs, '-i', audio, '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy', '-af', loudnorm, '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-shortest',
    '-metadata', 'title=AI, 한 걸음 더', '-metadata', 'comment=dkdlqoddi.github.io · 공식 문서 기준 2026-09-20 · 화면은 학습용 모형',
    '-movflags', '+faststart', target]);
  if (!partial) {
    fs.writeFileSync(path.join(outDir, `${NAME}.srt`), srt);
    // Poster frame: the finished cover, before the first chapter card.
    const cover = info.scenes[0];
    run('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String((cover.t1 - 2500) / 1000), '-i', target, '-frames:v', '1', path.join(outDir, `${NAME}.png`)]);
  }

  // Verify the result instead of trusting the pipeline.
  const probeOut = JSON.parse(run('ffprobe', ['-v', 'error', '-count_packets', '-show_entries', 'stream=codec_type,codec_name,width,height,r_frame_rate,nb_read_packets,color_space:format=duration,size', '-of', 'json', target]));
  const video = probeOut.streams.find(s => s.codec_type === 'video');
  const sound = probeOut.streams.find(s => s.codec_type === 'audio');
  assert.equal(video.width, 1920);
  assert.equal(video.height, 1080);
  assert.equal(Number(video.nb_read_packets), count, 'Every rendered frame is in the file');
  assert.ok(sound && sound.codec_name === 'aac', 'Audio track present');
  const seconds = Number(probeOut.format.duration);
  console.log(`Saved ${path.relative(root, target)}: ${seconds.toFixed(1)}s, ${(Number(probeOut.format.size) / 1048576).toFixed(1)} MiB, ${video.width}x${video.height} ${video.r_frame_rate} ${video.color_space}, ${video.nb_read_packets} frames, audio ${sound.codec_name}`);
  console.log(`Render time ${Math.round((Date.now() - started) / 1000)}s`);
})().catch(error => { console.error(error); process.exitCode = 1; });
