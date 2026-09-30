"""Synthesize the video's soundtrack locally: a calm background loop plus short
effects placed at the animation events exported by the composition page.

Usage: python3 scripts/video_audio.py EVENTS_JSON OUT_WAV
EVENTS_JSON holds {"total": ms, "sounds": [{"name", "t", "gain", "pan"}], "cards": [...]}.
No samples, services or network: every sound is generated here with numpy/scipy.
"""
import json
import sys
import wave

import numpy as np
from scipy import signal

RATE = 48000
rng = np.random.default_rng(20260930)


def seconds(n):
    return int(round(n * RATE))


def midi(note):
    return 440.0 * 2 ** ((note - 69) / 12)


def env_ad(n, attack, decay):
    """Attack then exponential decay envelope, `n` samples long."""
    t = np.arange(n) / RATE
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - attack, 0) / decay)


def pan_stereo(mono, pan):
    """Equal-power pan, pan in [-1, 1]."""
    angle = (pan + 1) * np.pi / 4
    return np.stack([mono * np.cos(angle), mono * np.sin(angle)], axis=1)


def add(buf, at, sound):
    start = seconds(at)
    if start >= len(buf):
        return
    end = min(len(buf), start + len(sound))
    if start < 0:
        sound = sound[-start:]
        start = 0
    buf[start:end] += sound[: end - start]


def bandpass(x, low, high, order=2):
    sos = signal.butter(order, [low, high], btype='band', fs=RATE, output='sos')
    return signal.sosfilt(sos, x)


def lowpass(x, cutoff, order=2):
    sos = signal.butter(order, cutoff, btype='low', fs=RATE, output='sos')
    return signal.sosfilt(sos, x)


def highpass(x, cutoff, order=2):
    sos = signal.butter(order, cutoff, btype='high', fs=RATE, output='sos')
    return signal.sosfilt(sos, x)


def sweep_noise(duration, f_from, f_to, width=1.0, chunk=0.012):
    """Noise whose band centre glides between two frequencies (overlap-add chunks)."""
    n = seconds(duration)
    noise = rng.standard_normal(n + seconds(chunk) * 2)
    out = np.zeros(n)
    hop = seconds(chunk)
    win = np.hanning(hop * 2)
    for i, start in enumerate(range(0, n, hop)):
        p = start / max(n - 1, 1)
        centre = f_from * (f_to / f_from) ** p
        lo, hi = centre / (1 + width), min(centre * (1 + width), RATE / 2 - 100)
        seg = bandpass(noise[start: start + hop * 2], lo, hi)
        seg = seg[: min(hop * 2, n - start)] * win[: min(hop * 2, n - start)]
        out[start: start + len(seg)] += seg
    return out / (np.max(np.abs(out)) + 1e-9)


def tone(freq, duration, partials=((1, 1.0),), attack=0.004, decay=0.2, glide=None):
    n = seconds(duration)
    t = np.arange(n) / RATE
    if glide:
        f = freq * (glide / freq) ** np.clip(t / duration, 0, 1)
        phase = 2 * np.pi * np.cumsum(f) / RATE
    else:
        phase = 2 * np.pi * freq * t
    wave_ = sum(a * np.sin(phase * k) for k, a in partials)
    return wave_ * env_ad(n, attack, decay)


def bell(freq, duration=1.0, decay=0.45):
    n = seconds(duration)
    t = np.arange(n) / RATE
    parts = [(1.0, 1.0, decay), (2.01, 0.34, decay * 0.6), (3.02, 0.14, decay * 0.4), (4.21, 0.07, decay * 0.25)]
    out = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t / d) for r, a, d in parts)
    return out * np.clip(t / 0.002, 0, 1)


# Effects. Each returns mono audio normalised near 1.0 peak.
def fx_pop(k):
    f = 430 * (1 + 0.08 * ((k * 37) % 5 - 2) / 2)
    body = tone(f, 0.16, ((1, 1.0), (2, 0.22)), attack=0.002, decay=0.055, glide=f * 1.9)
    click = highpass(rng.standard_normal(seconds(0.006)), 2500) * 0.25
    body[: len(click)] += click
    return body


def fx_pop2(k):
    f = 660 * (1 + 0.06 * ((k * 17) % 5 - 2) / 2)
    return tone(f, 0.14, ((1, 1.0), (2, 0.15)), attack=0.002, decay=0.045, glide=f * 1.6) * 0.8


def fx_tick(k):
    return tone(1750 + (k % 3) * 120, 0.05, ((1, 1.0),), attack=0.001, decay=0.012) * 0.6


def fx_swish(k):
    n = sweep_noise(0.2, 700, 3600, width=0.8)
    return n * np.hanning(len(n)) * 0.55


def fx_whoosh(k):
    n = sweep_noise(0.62, 220, 1500, width=0.9)
    shape = np.sin(np.linspace(0, np.pi, len(n))) ** 1.6
    return lowpass(n * shape, 5000) * 0.9


def fx_click(k):
    a = highpass(rng.standard_normal(seconds(0.004)), 3000) * np.linspace(1, 0, seconds(0.004))
    b = tone(1200, 0.03, ((1, 1.0),), attack=0.0005, decay=0.008) * 0.5
    out = np.zeros(seconds(0.05))
    out[: len(a)] += a
    out[seconds(0.008): seconds(0.008) + len(b)] += b
    return out * 0.8


PENTA = [1046.5, 1174.7, 1318.5, 1568.0, 1760.0]


def fx_ding(k):
    return bell(PENTA[k % len(PENTA)], 0.9, 0.32) * 0.6


def fx_key(k):
    n = seconds(0.03)
    burst = highpass(rng.standard_normal(n), 1800) * env_ad(n, 0.0005, 0.006)
    thump = tone(170 + (k % 4) * 12, 0.03, ((1, 1.0),), attack=0.0005, decay=0.01)
    return (burst * 0.5 + thump * 0.35) * (0.8 + 0.2 * ((k * 7) % 3) / 2)


def fx_sparkle(k):
    out = np.zeros(seconds(0.6))
    for i in range(7):
        f = [2093, 2349, 2637, 3136, 3520, 4186][(k + i * 2) % 6]
        s = tone(f, 0.18, ((1, 1.0),), attack=0.002, decay=0.05) * (0.7 - i * 0.07)
        start = seconds(i * 0.045)
        out[start: start + len(s)] += s
    return out * 0.45


def fx_boing(k):
    n = seconds(0.3)
    t = np.arange(n) / RATE
    f = 190 + 150 * np.sin(np.clip(t / 0.3, 0, 1) * np.pi * 0.8) + 12 * np.sin(2 * np.pi * 14 * t) * np.exp(-t / 0.1)
    phase = 2 * np.pi * np.cumsum(f) / RATE
    return np.sin(phase) * env_ad(n, 0.004, 0.09) * 0.6


def fx_chime(k):
    out = np.zeros(seconds(1.6))
    for i, f in enumerate([783.99, 1046.5, 1318.5]):
        b = bell(f, 1.3, 0.5) * (0.5 - i * 0.08)
        s = seconds(i * 0.09)
        out[s: s + len(b)] += b
    return out


def fx_stamp(k):
    thud = tone(120, 0.16, ((1, 1.0), (2, 0.2)), attack=0.001, decay=0.05, glide=70)
    n = seconds(0.03)
    slap = lowpass(rng.standard_normal(n), 2500) * env_ad(n, 0.0005, 0.008)
    thud[:n] += slap * 0.6
    return thud * 0.9


def fx_marker(k):
    n = sweep_noise(0.22, 2600, 3400, width=0.35)
    wobble = 0.75 + 0.25 * np.sin(np.linspace(0, 9 * np.pi, len(n)))
    return n * np.hanning(len(n)) * wobble * 0.35


def fx_rise(k):
    n = seconds(1.6)
    t = np.arange(n) / RATE
    f = 300 * (3.0 ** (t / 1.6))
    phase = 2 * np.pi * np.cumsum(f) / RATE
    trem = 0.8 + 0.2 * np.sin(2 * np.pi * 9 * t)
    return np.sin(phase) * trem * np.sin(np.linspace(0, np.pi, n)) * 0.3


def fx_lock(k):
    out = np.zeros(seconds(0.12))
    for i, f in enumerate([2500, 3700]):
        s = tone(f, 0.05, ((1, 1.0), (1.5, 0.3)), attack=0.0005, decay=0.009) * 0.6
        start = seconds(i * 0.045)
        out[start: start + len(s)] += s
    return out


def fx_success(k):
    out = np.zeros(seconds(1.5))
    for i, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
        b = bell(f, 1.0, 0.35) * (0.45 - i * 0.05)
        s = seconds(i * 0.075)
        out[s: s + len(b)] += b
    return out


EFFECTS = {
    'pop': (fx_pop, 0.32), 'pop2': (fx_pop2, 0.28), 'tick': (fx_tick, 0.22), 'swish': (fx_swish, 0.2),
    'whoosh': (fx_whoosh, 0.3), 'click': (fx_click, 0.36), 'ding': (fx_ding, 0.3), 'key': (fx_key, 0.2),
    'sparkle': (fx_sparkle, 0.22), 'boing': (fx_boing, 0.2), 'chime': (fx_chime, 0.32), 'stamp': (fx_stamp, 0.34),
    'marker': (fx_marker, 0.22), 'rise': (fx_rise, 0.26), 'lock': (fx_lock, 0.3), 'success': (fx_success, 0.34),
}


def effects_track(events, n):
    buf = np.zeros((n, 2))
    last = {}
    for k, ev in enumerate(sorted(events, key=lambda e: e['t'])):
        name = ev['name']
        if name not in EFFECTS:
            raise SystemExit(f'Unknown sound: {name}')
        # Thin out same-sound bursts so staggered entrances don't machine-gun.
        gap = ev['t'] - last.get(name, -1e9)
        if gap < 60:
            continue
        soften = 0.6 if gap < 160 else 1.0
        last[name] = ev['t']
        make, level = EFFECTS[name]
        mono = make(k) * level * ev.get('gain', 1) * soften
        add(buf, ev['t'] / 1000, pan_stereo(mono, ev.get('pan', 0)))
    return buf


# Music: warm electric-piano arpeggios over a soft pad, bass and brushed groove.
BPM = 88
BEAT = 60 / BPM
BAR = 4 * BEAT
PROGRESSION = [
    ('Fmaj7', 41, [53, 57, 60, 64]), ('Dm7', 38, [50, 57, 60, 65]),
    ('Bbmaj7', 46, [53, 57, 58, 62]), ('Csus', 48, [55, 60, 65, 67]),
    ('Fmaj7', 41, [53, 57, 60, 64]), ('Am7', 45, [52, 55, 60, 64]),
    ('Gm7', 43, [53, 58, 62, 65]), ('Csus', 48, [55, 60, 65, 67]),
]


def ep_note(freq, duration, velocity):
    n = seconds(duration)
    t = np.arange(n) / RATE
    index = 1.1 * np.exp(-t / 0.25)
    modulator = np.sin(2 * np.pi * freq * t)
    carrier = np.sin(2 * np.pi * freq * t + index * modulator)
    body = carrier * np.exp(-t / 0.55) + 0.25 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / 0.18)
    return body * np.clip(t / 0.004, 0, 1) * velocity


def pad_chord(notes, duration):
    n = seconds(duration)
    t = np.arange(n) / RATE
    out = np.zeros(n)
    for note in notes:
        f = midi(note)
        for detune in (-0.0017, 0.0017):
            ff = f * (1 + detune)
            out += np.sin(2 * np.pi * ff * t) + 0.22 * np.sin(2 * np.pi * ff * 2 * t) + 0.07 * np.sin(2 * np.pi * ff * 3 * t)
    attack = np.clip(t / 0.45, 0, 1)
    release = np.clip((duration - t) / 0.6, 0, 1)
    swell = 0.85 + 0.15 * np.sin(2 * np.pi * t / duration)
    return out * attack * release * swell / (len(notes) * 2)


def bass_note(freq, duration):
    n = seconds(duration)
    t = np.arange(n) / RATE
    body = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * freq * 2 * t) + 0.08 * np.sin(2 * np.pi * freq * 3 * t)
    return body * env_ad(n, 0.008, 0.45) * np.clip((duration - t) / 0.05, 0, 1)


def kick():
    return tone(110, 0.22, ((1, 1.0),), attack=0.002, decay=0.07, glide=45)


def snare():
    n = seconds(0.12)
    return bandpass(rng.standard_normal(n), 900, 5000) * env_ad(n, 0.001, 0.035)


def shaker():
    n = seconds(0.05)
    return highpass(rng.standard_normal(n), 6000) * env_ad(n, 0.004, 0.012)


def music_track(total_s, quiet_spans):
    n = seconds(total_s)
    buf = np.zeros((n, 2))
    bars = int(total_s / BAR) + 2
    arp_pattern = [0, 2, 1, 3, 2, 1, 3, 2]
    for bar in range(bars):
        t0 = bar * BAR
        name, root, notes = PROGRESSION[bar % len(PROGRESSION)]
        phrase = bar // 16
        groove = bar >= 2 and not (bar % 16 in (12, 13))
        # Pad (slightly wider than the bar so chords blend).
        pad = pad_chord(notes, BAR + 0.5) * 0.5
        add(buf, t0, pan_stereo(pad, -0.1))
        add(buf, t0, pan_stereo(pad * 0.8, 0.15))
        # Electric piano arpeggio in eighths, an octave up; lighter on the offbeats.
        upper = [x + 12 for x in notes]
        for step in range(8):
            if bar < 1 and step % 2:
                continue
            note = upper[arp_pattern[(step + phrase) % 8] % len(upper)]
            swing = 0.06 * BEAT if step % 2 else 0.0
            velocity = (0.62 if step % 2 == 0 else 0.42) * (1.05 if step == 0 else 1.0)
            ep = ep_note(midi(note), 1.1, velocity) * 0.36
            add(buf, t0 + step * BEAT / 2 + swing, pan_stereo(ep, -0.35 + 0.1 * (step % 4)))
        # Bass: root on 1, a gentle push before 3, root again on 3.
        if bar >= 1:
            f = midi(root)
            add(buf, t0, pan_stereo(bass_note(f, BEAT * 1.4) * 0.5, 0))
            add(buf, t0 + BEAT * 2, pan_stereo(bass_note(f, BEAT * 1.2) * 0.42, 0))
            add(buf, t0 + BEAT * 3.5, pan_stereo(bass_note(f * 1.5, BEAT * 0.45) * 0.3, 0))
        if groove:
            for beat in range(4):
                bt = t0 + beat * BEAT
                if beat in (0, 2):
                    add(buf, bt, pan_stereo(kick() * 0.42, 0))
                else:
                    add(buf, bt, pan_stereo(snare() * 0.13, 0.1))
                for half in (0.5,):
                    add(buf, bt + half * BEAT + 0.05 * BEAT, pan_stereo(shaker() * 0.11, 0.3))
    # Soften the groove under chapter cards so their chime reads clearly.
    for start, end in quiet_spans:
        a, b = seconds(start), seconds(end)
        buf[a:b] *= 0.7
    # Warmth and a gentle fade in / out.
    for ch in range(2):
        buf[:, ch] = lowpass(buf[:, ch], 7500)
    fade_in = seconds(2.5)
    buf[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
    fade_out = seconds(4.0)
    buf[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None] ** 1.5
    return buf


def loudness_rms(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)


def main():
    events_path, out_path = sys.argv[1], sys.argv[2]
    data = json.loads(open(events_path, encoding='utf-8').read())
    total_s = data['total'] / 1000 + 0.5
    n = seconds(total_s)
    quiet = [((c['t0'] - 400) / 1000, (c['t1']) / 1000) for c in data.get('cards', [])]
    music = music_track(total_s, quiet)
    music *= 10 ** ((-27 - loudness_rms(music)) / 20)
    fx = effects_track(data['sounds'], n)
    mix = music + fx
    # Soft clip for safety, then peak-normalise below -1 dBFS.
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    peak = np.max(np.abs(mix))
    if peak > 0.89:
        mix *= 0.89 / peak
    pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
    with wave.open(out_path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(pcm.tobytes())
    print(f'audio {out_path}: {total_s:.1f}s music RMS {loudness_rms(music):.1f} dBFS, mix RMS {loudness_rms(mix):.1f} dBFS, peak {20 * np.log10(np.max(np.abs(mix)) + 1e-12):.1f} dBFS, effects {len(data["sounds"])}')


if __name__ == '__main__':
    main()
