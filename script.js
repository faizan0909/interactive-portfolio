// AUDIO SYNTHESIZER FOR SUBTLE CINEMATIC USER INTERACTION SOUNDS
    class StudioSynth {
      constructor() {
        this.audioCtx = null;
        this.isMuted = true;
      }

      init() {
        if (!this.audioCtx) {
          this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
      }

      playWhoosh() {
        if (this.isMuted) return;
        this.init();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(15, this.audioCtx.currentTime + 0.6);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, this.audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.6);

        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.65);
      }

      playClick() {
        if (this.isMuted) return;
        this.init();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
        osc.frequency.setValueAtTime(400, this.audioCtx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.12);
      }

      playSynthHum() {
        if (this.isMuted) return;
        this.init();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(55, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.55);
      }
    }

    const synth = new StudioSynth();

    // Audio Toggle Controller
    const bgAudio = new Audio('assets/Nebula.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.5;

    const synthSoundBtn = document.getElementById('synthSoundBtn');
    synthSoundBtn.addEventListener('click', () => {
      synth.isMuted = !synth.isMuted;
      if (synth.isMuted) {
        synthSoundBtn.classList.add('muted');
        synthSoundBtn.classList.remove('active');
        bgAudio.pause();
      } else {
        synthSoundBtn.classList.remove('muted');
        synthSoundBtn.classList.add('active');
        synth.playSynthHum();
        bgAudio.play().catch(e => console.log('Audio play failed:', e));
      }
    });


    // CURSOR SPRING INTERACTION
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    function animateRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Dynamic Hover states for custom cursor
    const cursorInteractiveSelectors = 'a, button, .service-card, .equip-item, .software-pill, .estimator-item, .lut-btn, .hud-btn, .tool-btn, .estimator-range';
    document.querySelectorAll(cursorInteractiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '48px';
        ring.style.height = '48px';
        ring.style.borderColor = 'rgba(var(--accent-rgb), 0.9)';
        ring.style.background = 'rgba(var(--accent-rgb), 0.05)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(var(--accent-rgb), 0.5)';
        ring.style.background = 'transparent';
      });
      el.addEventListener('click', () => {
        synth.playClick();
      });
    });


    // LIVE WEBSITE GRADIENT "LUT" (THEME) CONTROLLER
    const lutBtns = document.querySelectorAll('.lut-btn');
    const bodyEl = document.body;
    const lutLabel = document.getElementById('lutLabel');

    lutBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lutVal = btn.getAttribute('data-lut-val');

        // Update buttons
        lutBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Set attribute on body to trigger specific CSS variables
        if (lutVal === 'classic') {
          bodyEl.removeAttribute('data-lut');
          lutLabel.textContent = 'CINEMATIC';
        } else {
          bodyEl.setAttribute('data-lut', lutVal);
          lutLabel.textContent = lutVal.toUpperCase();
        }

        synth.playWhoosh();
      });
    });


    // FILM STRIP AUTOMATED GENERATION
    function fillFilm(el) {
      const count = Math.ceil(window.innerHeight / 24) + 6;
      el.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'film-perf';
        el.appendChild(p);
      }
    }

    const filmLeft = document.getElementById('filmLeft');
    const filmRight = document.getElementById('filmRight');

    fillFilm(filmLeft);
    fillFilm(filmRight);

    // Re-generate film strip on screen size shifts
    window.addEventListener('resize', () => {
      fillFilm(filmLeft);
      fillFilm(filmRight);
    });


    // PROPOSAL CALCULATOR & BRIEF GENERATOR LOGIC
    const estimatorItems = document.querySelectorAll('.estimator-item');
    const invoiceEntries = document.getElementById('invoiceEntries');
    const invoiceTotalValue = document.getElementById('invoiceTotalValue');

    // Multiplier specific definitions
    const shortMinRange = document.getElementById('shortMinRange');
    const shortMinLabel = document.getElementById('shortMinLabel');
    const longMinRange = document.getElementById('longMinRange');
    const longMinLabel = document.getElementById('longMinLabel');
    const videoEventHoursRange = document.getElementById('videoEventHoursRange');
    const videoEventHoursLabel = document.getElementById('videoEventHoursLabel');
    const gradeLevelRange = document.getElementById('gradeLevelRange');
    const gradeLevelLabel = document.getElementById('gradeLevelLabel');

    function calculateActiveProposal() {
      let activeEntries = [];
      let cumulativeSum = 0;

      estimatorItems.forEach(item => {
        if (!item.classList.contains('selected')) return;

        const itemId = item.id;
        let calculatedItemCost = 0;
        let displayLabel = '';

        if (itemId === 'estShort') {
          const mins = parseInt(shortMinRange.value);
          shortMinLabel.textContent = `${mins} Minute${mins > 1 ? 's' : ''}`;
          calculatedItemCost = parseInt(item.getAttribute('data-price-base')) * mins;
          displayLabel = `Short-Form Editing (${mins} mins)`;
        }
        else if (itemId === 'estLong') {
          const mins = parseInt(longMinRange.value);
          longMinLabel.textContent = `${mins} Minute${mins > 1 ? 's' : ''}`;
          calculatedItemCost = parseInt(item.getAttribute('data-price-base')) * mins;
          displayLabel = `YouTube Video Editing (${mins} mins)`;
        }
        else if (itemId === 'estMusicVideo') {
          calculatedItemCost = parseInt(item.getAttribute('data-price-fixed'));
          displayLabel = `Music Video Package (Complete Cycle)`;
        }
        else if (itemId === 'estVideoEvent') {
          const hours = parseInt(videoEventHoursRange.value);
          videoEventHoursLabel.textContent = `${hours} Hour${hours > 1 ? 's' : ''}`;

          // Base rate is 10k for up to 8 hrs, + 1k/hr thereafter
          const baseCoveragePrice = parseInt(item.getAttribute('data-price-base'));
          if (hours <= 8) {
            calculatedItemCost = baseCoveragePrice;
          } else {
            calculatedItemCost = baseCoveragePrice + ((hours - 8) * 1000);
          }
          displayLabel = `Event Videography Coverage (${hours} hrs)`;
        }
        else if (itemId === 'estGrading') {
          const tier = parseInt(gradeLevelRange.value);
          let tierLabelText = 'Basic Look';
          let gradingMultiplier = 1;

          if (tier === 1) {
            tierLabelText = 'Basic Look & Balance';
            gradingMultiplier = 0.5;
          } else if (tier === 2) {
            tierLabelText = 'Professional LUT Match';
            gradingMultiplier = 1.0;
          } else if (tier === 3) {
            tierLabelText = 'Cinematic Master Grade';
            gradingMultiplier = 2.5;
          }

          gradeLevelLabel.textContent = tierLabelText;
          calculatedItemCost = Math.round(parseInt(item.getAttribute('data-price-base')) * gradingMultiplier);
          displayLabel = `Standalone Grading (${tierLabelText})`;
        }

        cumulativeSum += calculatedItemCost;
        activeEntries.push({ label: displayLabel, cost: calculatedItemCost });
      });

      // Redraw table rows dynamically
      invoiceEntries.innerHTML = '';

      if (activeEntries.length === 0) {
        invoiceEntries.innerHTML = `<tr class="invoice-row"><td colspan="2" class="invoice-label" style="text-align: center; padding: 2rem 0;">No services selected yet.</td></tr>`;
        invoiceTotalValue.textContent = `₹0`;
      } else {
        activeEntries.forEach(entry => {
          const row = document.createElement('tr');
          row.className = 'invoice-row';
          row.innerHTML = `
          <td class="invoice-label">${entry.label}</td>
          <td class="invoice-price">₹${entry.cost.toLocaleString('en-IN')}</td>
        `;
          invoiceEntries.appendChild(row);
        });
        invoiceTotalValue.textContent = `₹${cumulativeSum.toLocaleString('en-IN')}`;
      }
    }

    // Multiplier item click toggles selection
    estimatorItems.forEach(item => {
      // Detect item header clicks
      const head = item.querySelector('.estimator-head') || item;
      head.addEventListener('click', (e) => {
        // Prevent click triggers from range slider dragging
        if (e.target.tagName === 'INPUT') return;

        item.classList.toggle('selected');
        calculateActiveProposal();
        synth.playClick();
      });
    });

    // Track slide movements
    const sliders = [shortMinRange, longMinRange, videoEventHoursRange, gradeLevelRange];
    sliders.forEach(slider => {
      slider.addEventListener('input', () => {
        calculateActiveProposal();
      });
    });


    // PROJECT BRIEF POPUP COMPILER
    const generateBriefBtn = document.getElementById('generateBriefBtn');
    const briefOverlay = document.getElementById('briefOverlay');
    const briefModal = document.getElementById('briefModal');
    const briefTextOutput = document.getElementById('briefTextOutput');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCopyBtn = document.getElementById('modalCopyBtn');

    generateBriefBtn.addEventListener('click', () => {
      let currentInquirySummary = 'PROJECT BRIEF ENQUIRY — FAIZAN VISUALS\n';
      currentInquirySummary += '=============================================\n\n';
      currentInquirySummary += 'Hello Faizan,\n';
      currentInquirySummary += 'I have built a custom proposal package through your online workstation.\n';
      currentInquirySummary += 'Here are the services I am interested in:\n\n';

      let selectedAny = false;
      let totalPrice = 0;

      estimatorItems.forEach(item => {
        if (!item.classList.contains('selected')) return;
        selectedAny = true;

        const itemId = item.id;
        if (itemId === 'estShort') {
          const mins = shortMinRange.value;
          const price = parseInt(item.getAttribute('data-price-base')) * mins;
          totalPrice += price;
          currentInquirySummary += `• Short-Form Video Editing (${mins} mins) — Est: ₹${price.toLocaleString('en-IN')}\n`;
        }
        else if (itemId === 'estLong') {
          const mins = longMinRange.value;
          const price = parseInt(item.getAttribute('data-price-base')) * mins;
          totalPrice += price;
          currentInquirySummary += `• YouTube Video Editing (${mins} mins) — Est: ₹${price.toLocaleString('en-IN')}\n`;
        }
        else if (itemId === 'estMusicVideo') {
          const price = parseInt(item.getAttribute('data-price-fixed'));
          totalPrice += price;
          currentInquirySummary += `• Music Video Production Package — Est: ₹${price.toLocaleString('en-IN')}\n`;
        }
        else if (itemId === 'estVideoEvent') {
          const hours = videoEventHoursRange.value;
          let price = 10000;
          if (hours > 8) price += (hours - 8) * 1000;
          totalPrice += price;
          currentInquirySummary += `• Event Videography Coverage (${hours} hrs) — Est: ₹${price.toLocaleString('en-IN')}\n`;
        }
        else if (itemId === 'estGrading') {
          const tier = gradeLevelRange.value;
          let tierText = tier == 1 ? 'Basic' : tier == 2 ? 'Standard' : 'Cinematic';
          let price = Math.round(parseInt(item.getAttribute('data-price-base')) * (tier == 1 ? 0.5 : tier == 2 ? 1.0 : 2.5));
          totalPrice += price;
          currentInquirySummary += `• Standalone Color Grading (Tier: ${tierText}) — Est: ₹${price.toLocaleString('en-IN')}\n`;
        }
      });

      if (!selectedAny) {
        currentInquirySummary += 'No specific standalone packages selected. I would like a custom creative workflow consultation.\n';
      } else {
        currentInquirySummary += `\nESTIMATED COMBINED QUOTE: ₹${totalPrice.toLocaleString('en-IN')}\n`;
      }

      currentInquirySummary += '\nLet me know your availability to discuss scheduling, artistic brief adjustments, and timeline steps!\n\n';
      currentInquirySummary += 'Thank you!';

      briefTextOutput.value = currentInquirySummary;

      // Show modal pop-up overlay
      briefOverlay.classList.add('active');
      briefModal.classList.add('active');
      synth.playWhoosh();
    });

    const closeModal = () => {
      briefOverlay.classList.remove('active');
      briefModal.classList.remove('active');
      synth.playClick();
    };

    modalCloseBtn.addEventListener('click', closeModal);
    briefOverlay.addEventListener('click', closeModal);

    modalCopyBtn.addEventListener('click', () => {
      briefTextOutput.select();
      document.execCommand('copy');

      modalCopyBtn.textContent = 'Copied Successfully!';
      modalCopyBtn.style.background = '#4caf7a';
      modalCopyBtn.style.color = '#fff';

      setTimeout(() => {
        modalCopyBtn.textContent = 'Copy to Clipboard';
        modalCopyBtn.style.background = 'var(--accent)';
        modalCopyBtn.style.color = '#000';
        closeModal();
      }, 1500);
    });


    // SCROLL REVEAL (FADE-IN ANIMATION)
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));