// Shared spin-the-wheel engine. Every picker page reuses this.
// Usage: const w = new Wheel(canvas, { colors, onResult }); w.setItems([...]); w.spin();
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class Wheel {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.colors = opts.colors || ['#FF4F86', '#FFC93C', '#22B8A7', '#FFF4E2'];
      this.textColors = opts.textColors || ['#2B1342'];
      this.onResult = opts.onResult || function () {};
      this.labelFn = opts.labelFn || ((item) => item);
      this.items = [];
      this.angle = 0; // radians
      this.spinning = false;
      this.resize = this.resize.bind(this);
      window.addEventListener('resize', this.resize);
      this.resize();
    }

    setItems(items) {
      this.items = items.filter(Boolean);
      this.draw();
    }

    resize() {
      const size = this.canvas.clientWidth || 320;
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = size * dpr;
      this.canvas.height = size * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.size = size;
      this.draw();
    }

    draw() {
      const { ctx, size, items } = this;
      if (!size) return;
      const r = size / 2;
      ctx.clearRect(0, 0, size, size);
      if (!items.length) {
        ctx.beginPath();
        ctx.arc(r, r, r - 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,244,226,0.12)';
        ctx.fill();
        return;
      }
      const slice = (Math.PI * 2) / items.length;
      const fontSize = Math.max(11, Math.min(18, size / (items.length > 16 ? 30 : 22)));
      items.forEach((item, i) => {
        const start = this.angle + i * slice;
        ctx.beginPath();
        ctx.moveTo(r, r);
        ctx.arc(r, r, r - 4, start, start + slice);
        ctx.closePath();
        // Avoid two neighbours with the same color when the count isn't divisible.
        let ci = i % this.colors.length;
        if (i === items.length - 1 && ci === 0 && items.length > 1) ci = 1;
        ctx.fillStyle = this.colors[ci];
        ctx.fill();
        ctx.strokeStyle = '#2B1342';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(r, r);
        ctx.rotate(start + slice / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#2B1342';
        ctx.font = `600 ${fontSize}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
        const maxW = r * 0.7;
        const full = this.labelFn(item);
        let label = full;
        while (ctx.measureText(label).width > maxW && label.length > 4) {
          label = label.slice(0, -2);
        }
        if (label !== full) label = label.trimEnd() + '…';
        ctx.fillText(label, r - 16, 0);
        ctx.restore();
      });
      // hub
      ctx.beginPath();
      ctx.arc(r, r, r * 0.09, 0, Math.PI * 2);
      ctx.fillStyle = '#2B1342';
      ctx.fill();
    }

    // Index of the slice under the pointer at the top (12 o'clock).
    currentIndex() {
      const slice = (Math.PI * 2) / this.items.length;
      const pointer = -Math.PI / 2;
      let a = (pointer - this.angle) % (Math.PI * 2);
      if (a < 0) a += Math.PI * 2;
      return Math.floor(a / slice) % this.items.length;
    }

    // Show a known result without spinning (used for shared results).
    land(index) {
      if (!(index >= 0 && index < this.items.length)) return false;
      const slice = (Math.PI * 2) / this.items.length;
      this.angle = (-Math.PI / 2) - (index + 0.5) * slice;
      this.draw();
      this.lastSpin = { items: this.items.slice(), index };
      this.onResult(this.items[index], index);
      return true;
    }

    spin() {
      if (this.spinning || this.items.length < 2) return false;
      this.spinning = true;
      // Pick the winner fairly first, then animate to it.
      const rand = new Uint32Array(1);
      crypto.getRandomValues(rand);
      const winner = rand[0] % this.items.length;
      const slice = (Math.PI * 2) / this.items.length;
      const jitter = (Math.random() * 0.7 + 0.15) * slice;
      const pointer = -Math.PI / 2;
      let target = pointer - (winner * slice + jitter);
      const turns = reduceMotion ? 0 : 5 + Math.floor(Math.random() * 3);
      // Make target strictly ahead of the current angle.
      while (target <= this.angle) target += Math.PI * 2;
      target += turns * Math.PI * 2;

      const finish = () => {
        this.angle = target % (Math.PI * 2);
        this.draw();
        this.spinning = false;
        this.lastSpin = { items: this.items.slice(), index: winner };
        this.onResult(this.items[winner], winner);
      };

      // Reduced motion: no animation, but still finish after the page's click handler runs
      // (finishing synchronously let the handler overwrite the result with "Spinning…").
      if (reduceMotion) { setTimeout(finish, 50); return true; }

      const start = this.angle;
      const duration = 4200;
      const t0 = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 4);
      const step = (now) => {
        const t = Math.min(1, (now - t0) / duration);
        this.angle = start + (target - start) * ease(t);
        this.draw();
        if (t < 1) requestAnimationFrame(step); else finish();
      };
      requestAnimationFrame(step);
      return true;
    }
  }

  window.Wheel = Wheel;
})();
