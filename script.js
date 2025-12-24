document.addEventListener("DOMContentLoaded", () => {
  (function entranceTypewriter() {
    const target = document.getElementById('enterText');
    if (!target) return;
    const text = "Click to enter";
    target.textContent = "";
    let i = 0;
    const speed = 70;
    function typeChar() {
      if (i >= text.length) return;
      target.textContent += text.charAt(i++);
      setTimeout(typeChar, speed + (Math.random() * 40 - 20));
    }
    setTimeout(typeChar, 150);
  })();

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (!isTouchDevice) {
    const cards = document.querySelectorAll(".card, .music-card");

    cards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = `
          rotateX(0deg)
          rotateY(0deg)
        `;
      });
    });
  }

  const entrance = document.getElementById('entrance');
  const audio = document.getElementById('player');
  const progress = document.getElementById('progress');
  const volumeSlider = document.getElementById('volume');
  const nameEl = document.querySelector('.music-name');
  const timeEl = document.querySelector('.music-min');

  if (!audio || !entrance) {
    return;
  }

  const volumeIcon = document.querySelector('.volume-icon');
  const volumeIconBtn = document.querySelector('.volume-icon-btn');
  
  const volumeIconSVG = '<svg class="volume-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="https://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/></svg>';
  const mutedIconSVG = '<svg class="volume-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="https://www.w3.org/2000/svg" aria-hidden="true"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/></svg>';

  function updateVolumeIcon(volume) {
    if (!volumeIconBtn) return;
    if (volume === 0) {
      volumeIconBtn.innerHTML = mutedIconSVG;
    } else {
      volumeIconBtn.innerHTML = volumeIconSVG;
    }
    volumeIconBtn.offsetHeight;
  }

  if (volumeSlider) {
    audio.volume = volumeSlider.value / 100;
    volumeSlider.style.setProperty('--v', `${volumeSlider.value}%`);
    updateVolumeIcon(volumeSlider.value);
    
    volumeSlider.addEventListener('input', (e) => {
      const vol = Number(e.target.value);
      audio.volume = vol / 100;
      volumeSlider.style.setProperty('--v', `${vol}%`);
      updateVolumeIcon(vol);
    });

    volumeSlider.addEventListener('mousedown', () => {
      volumeSlider.classList.add('active');
    });

    volumeSlider.addEventListener('mouseup', () => {
      volumeSlider.classList.remove('active');
    });

    volumeSlider.addEventListener('focus', () => {
      volumeSlider.classList.add('active');
    });

    volumeSlider.addEventListener('blur', () => {
      volumeSlider.classList.remove('active');
    });
  }

  function formatTime(sec = 0) {
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2,'0')}`;
  }

  audio.addEventListener('loadedmetadata', () => {
    const dur = isFinite(audio.duration) ? audio.duration : 0;
    if (timeEl) timeEl.textContent = `${formatTime(0)} / ${formatTime(dur)}`;
    if (progress) progress.style.setProperty('--p', `${progress.value}%`);
  });

  audio.addEventListener('timeupdate', () => {
    const dur = audio.duration || 0;
    const cur = audio.currentTime || 0;
    if (progress) {
      progress.value = dur > 0 ? (cur / dur) * 100 : 0;
      progress.style.setProperty('--p', `${progress.value}%`);
    }
    if (timeEl) {
      timeEl.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
    }
  });

  let seeking = false;
  if (progress) {
    progress.addEventListener('input', (e) => {
      if (!audio.duration) return;
      const pct = Number(e.target.value) / 100;
      audio.currentTime = pct * audio.duration;
      progress.style.setProperty('--p', `${progress.value}%`);
    });
  }

  const backBtn = document.getElementById('backBtn');
  const playBtn = document.getElementById('playBtn');
  const fwdBtn = document.getElementById('fwdBtn');

  const playSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3v18l15-9L5 3z" fill="currentColor"/></svg>';
  const pauseSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor"/></svg>';

  function updatePlayIcon() {
    if (!playBtn) return;
    if (audio.paused) {
      playBtn.innerHTML = playSVG;
      playBtn.setAttribute('aria-label', 'Play');
    } else {
      playBtn.innerHTML = pauseSVG;
      playBtn.setAttribute('aria-label', 'Pause');
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      try {
        if (audio.paused) {
          await audio.play();
        } else {
          audio.pause();
        }
      } catch (e) {
        try { audio.load(); await audio.play(); } catch (err) { console.warn(err); }
      }
      updatePlayIcon();
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      audio.currentTime = Math.max(0, (audio.currentTime || 0) - 10);
    });
  }

  if (fwdBtn) {
    fwdBtn.addEventListener('click', () => {
      const dur = audio.duration || 0;
      audio.currentTime = Math.min(dur, (audio.currentTime || 0) + 10);
    });
  }

  audio.addEventListener('play', updatePlayIcon);
  audio.addEventListener('pause', updatePlayIcon);

  entrance.addEventListener('click', async (e) => {
    e.preventDefault();
    const title = (audio.dataset && audio.dataset.title) || (audio.src ? decodeURIComponent(audio.src.split('/').pop()) : 'Unknown');
    if (nameEl) nameEl.textContent = title;
    if (entrance.disabled) return;
    entrance.disabled = true;
    try {
      audio.currentTime = 0;
      await audio.play();
      entrance.style.display = 'none';
      entrance.disabled = false;
      updatePlayIcon();
      return;
    } catch (err) {
      console.warn('Initial play() rejected, will retry after load():', err);
    }
    try {
      audio.load();
      await audio.play();
      entrance.style.display = 'none';
      entrance.disabled = false;
      updatePlayIcon();
      return;
    } catch (err2) {
      console.error('Playback failed after retry:', err2);
      entrance.disabled = false;
      entrance.style.display = '';
    }
  });

  audio.addEventListener('play', () => {
    if (!entrance) return;
    if (entrance.style.display !== 'none') {
      entrance.style.display = 'none';
    }
  });
});

const titles = ["kai", "always", "lurking"];
let index = 0;

setInterval(() => {
  document.title = titles[index % titles.length];
  index++;
}, 2000);
