// ===== VERO APP.JS =====

// ===== PAGE ROUTING =====
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) {
    page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Init page-specific charts
    setTimeout(() => initPageCharts(name), 100);
  }
  // Close mobile menu
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}

// ===== WAITLIST MODAL =====
function openWaitlist() {
  const modal = document.getElementById('waitlistModal');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeWaitlist(e) {
  if (e && e.target !== document.getElementById('waitlistModal') && !e.target.classList.contains('modal-close')) return;
  const modal = document.getElementById('waitlistModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function submitWaitlist() {
  const name = document.getElementById('wlName').value;
  const email = document.getElementById('wlEmail').value;
  if (!name || !email) {
    document.getElementById('wlName').style.borderColor = '#555';
    document.getElementById('wlEmail').style.borderColor = '#555';
    return;
  }
  document.querySelector('.modal-form').style.display = 'none';
  document.querySelector('.modal > p').style.display = 'none';
  document.querySelector('.modal-fine').style.display = 'none';
  document.getElementById('waitlistSuccess').style.display = 'block';
}

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 20) {
    nav.style.background = 'rgba(10,10,10,0.96)';
  } else {
    nav.style.background = 'rgba(10,10,10,0.85)';
  }
});

// ===== DEMO TABS =====
function switchDemo(index) {
  document.querySelectorAll('.demo-tab').forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });
  document.querySelectorAll('.demo-panel').forEach((p, i) => {
    p.classList.toggle('active', i === index);
  });
  // Draw chart for that panel
  setTimeout(() => {
    if (index === 0) drawBillReadinessChart();
    if (index === 1) drawShortfallChart();
    if (index === 2) drawEarnMoreChart();
  }, 50);
}

// ===== CANVAS HELPERS =====
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return {r,g,b};
}

// ===== EARNINGS PULSE (HERO) =====
function drawEarningsPulse() {
  const canvas = document.getElementById('earningsPulse');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let t = 0;

  function frame() {
    ctx.clearRect(0, 0, W, H);
    t += 0.02;

    // Draw multiple waves representing different platforms
    const waves = [
      { amp: 40, freq: 0.015, phase: 0, color: 'rgba(255,255,255,0.8)' },
      { amp: 25, freq: 0.022, phase: 1.2, color: 'rgba(255,255,255,0.4)' },
      { amp: 18, freq: 0.03, phase: 2.4, color: 'rgba(255,255,255,0.2)' },
    ];

    waves.forEach(wave => {
      ctx.beginPath();
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = 1.5;
      for (let x = 0; x < W; x++) {
        const y = H/2 + wave.amp * Math.sin(x * wave.freq + t + wave.phase)
                     + (wave.amp * 0.4) * Math.sin(x * wave.freq * 2.3 + t * 1.3 + wave.phase);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    requestAnimationFrame(frame);
  }
  frame();
}

// ===== FLYWHEEL CHART =====
function drawFlywheelChart() {
  const canvas = document.getElementById('flywheelChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2;
  let t = 0;

  const nodes = [
    { label: 'Gig Platform\nData', angle: -Math.PI/2 },
    { label: 'Spending\nHistory', angle: -Math.PI/2 + (2*Math.PI/4) },
    { label: 'Volatility\nScore', angle: -Math.PI/2 + (4*Math.PI/4) },
    { label: 'AI\nInsights', angle: -Math.PI/2 + (6*Math.PI/4) },
  ];
  const R = 130;

  function frame() {
    ctx.clearRect(0, 0, W, H);
    t += 0.008;

    // Draw rotating connecting arcs
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.3);

    for (let i = 0; i < nodes.length; i++) {
      const next = nodes[(i+1) % nodes.length];
      const x1 = Math.cos(nodes[i].angle) * R;
      const y1 = Math.sin(nodes[i].angle) * R;
      const x2 = Math.cos(next.angle) * R;
      const y2 = Math.sin(next.angle) * R;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(0, 0, x2, y2);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    // Draw nodes
    nodes.forEach((node, i) => {
      const x = cx + Math.cos(node.angle + t * 0.1) * R;
      const y = cy + Math.sin(node.angle + t * 0.1) * R;

      // Pulse ring
      const pulse = Math.sin(t * 2 + i) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, 28 + pulse * 8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${0.05 + pulse * 0.05})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Node
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#1A1A1A';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#ABABAB';
      ctx.font = '10px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const lines = node.label.split('\n');
      lines.forEach((line, li) => {
        ctx.fillText(line, x, y + (li - (lines.length-1)/2) * 12);
      });
    });

    // Center
    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px DM Serif Display, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('V', cx, cy);

    requestAnimationFrame(frame);
  }
  frame();
}

// ===== BILL READINESS CHART =====
function drawBillReadinessChart() {
  const canvas = document.getElementById('billReadinessChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Days 1-14, earnings vs required
  const days = Array.from({length: 14}, (_,i) => i+1);
  const earned = [0, 186, 186, 310, 310, 496, 496, 682, 682, 868, 868, 1054, 1054, 1240];
  const required = Array(14).fill(632);

  const pad = { l: 10, r: 10, t: 20, b: 30 };
  const gW = W - pad.l - pad.r;
  const gH = H - pad.t - pad.b;

  // Background
  ctx.fillStyle = 'transparent';

  // Grid lines
  ctx.strokeStyle = '#2A2A2A';
  ctx.lineWidth = 1;
  [0, 0.33, 0.66, 1].forEach(v => {
    const y = pad.t + gH * (1 - v);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(pad.l + gW, y);
    ctx.stroke();
  });

  const xScale = i => pad.l + (i / 13) * gW;
  const yScale = v => pad.t + gH * (1 - v / 1300);

  // Required line
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1.5;
  ctx.moveTo(xScale(0), yScale(required[0]));
  ctx.lineTo(xScale(13), yScale(required[13]));
  ctx.stroke();
  ctx.setLineDash([]);

  // Earnings area fill
  ctx.beginPath();
  earned.forEach((v, i) => {
    if (i === 0) ctx.moveTo(xScale(i), yScale(v));
    else ctx.lineTo(xScale(i), yScale(v));
  });
  ctx.lineTo(xScale(13), pad.t + gH);
  ctx.lineTo(xScale(0), pad.t + gH);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fill();

  // Earnings line
  ctx.beginPath();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  earned.forEach((v, i) => {
    if (i === 0) ctx.moveTo(xScale(i), yScale(v));
    else ctx.lineTo(xScale(i), yScale(v));
  });
  ctx.stroke();

  // Today dot
  ctx.beginPath();
  ctx.arc(xScale(7), yScale(earned[7]), 4, 0, Math.PI*2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
}

// ===== SHORTFALL CHART =====
function drawShortfallChart() {
  const canvas = document.getElementById('shortfallChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const pad = { l: 10, r: 10, t: 20, b: 30 };
  const gW = W - pad.l - pad.r;
  const gH = H - pad.t - pad.b;

  // Bars showing current vs needed
  const bars = [
    { label: 'Current', val: 1558, max: 1850 },
    { label: 'Needed', val: 1850, max: 1850 },
  ];

  bars.forEach((bar, i) => {
    const x = pad.l + (i * gW / 2) + 20;
    const bW = gW/2 - 40;
    const fullH = gH;

    // Track
    ctx.fillStyle = '#2A2A2A';
    ctx.fillRect(x, pad.t, bW, fullH);

    // Fill
    const fillH = fullH * (bar.val / bar.max);
    const grad = ctx.createLinearGradient(0, pad.t + fullH - fillH, 0, pad.t + fullH);
    grad.addColorStop(0, i === 0 ? 'rgba(171,171,171,0.8)' : 'rgba(255,255,255,0.9)');
    grad.addColorStop(1, i === 0 ? 'rgba(107,107,107,0.8)' : 'rgba(200,200,200,0.9)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, pad.t + fullH - fillH, bW, fillH);

    // Label
    ctx.fillStyle = '#6B6B6B';
    ctx.font = '11px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(bar.label, x + bW/2, pad.t + gH + 18);

    // Value
    ctx.fillStyle = '#ABABAB';
    ctx.font = '11px DM Sans, sans-serif';
    ctx.fillText('$' + bar.val.toLocaleString(), x + bW/2, pad.t + fullH - fillH - 6);
  });

  // Gap line
  const y1 = pad.t + gH * (1 - 1558/1850);
  ctx.beginPath();
  ctx.setLineDash([3,3]);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.moveTo(pad.l, y1);
  ctx.lineTo(pad.l + gW, y1);
  ctx.stroke();
  ctx.setLineDash([]);
}

// ===== EARN MORE CHART =====
function drawEarnMoreChart() {
  const canvas = document.getElementById('earnMoreChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const hours = ['8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm'];
  const uber = [12, 14, 16, 18, 22, 20, 19, 17, 21, 24];
  const doordash = [10, 13, 15, 22, 26, 24, 22, 18, 20, 23];

  const pad = { l: 10, r: 10, t: 20, b: 30 };
  const gW = W - pad.l - pad.r;
  const gH = H - pad.t - pad.b;
  const maxVal = 28;

  const xScale = i => pad.l + (i / (hours.length-1)) * gW;
  const yScale = v => pad.t + gH * (1 - v / maxVal);

  // Grid
  ctx.strokeStyle = '#2A2A2A';
  ctx.lineWidth = 1;
  [0, 0.5, 1].forEach(v => {
    const y = pad.t + gH * (1-v);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(pad.l+gW, y);
    ctx.stroke();
  });

  // Uber line
  ctx.beginPath();
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  uber.forEach((v,i) => {
    if (i===0) ctx.moveTo(xScale(i), yScale(v));
    else ctx.lineTo(xScale(i), yScale(v));
  });
  ctx.stroke();

  // DoorDash line (highlighted)
  ctx.beginPath();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  doordash.forEach((v,i) => {
    if (i===0) ctx.moveTo(xScale(i), yScale(v));
    else ctx.lineTo(xScale(i), yScale(v));
  });
  ctx.stroke();

  // Peak window highlight
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillRect(xScale(3), pad.t, xScale(6) - xScale(3), gH);

  // Time labels (sparse)
  ctx.fillStyle = '#555';
  ctx.font = '9px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  [0, 4, 9].forEach(i => {
    ctx.fillText(hours[i], xScale(i), H - 4);
  });
}

// ===== VOLATILITY GAUGE =====
function drawVolatilityGauge() {
  const canvas = document.getElementById('volatilityGauge');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2 + 20;
  const R = 110;
  let progress = 0;
  const targetScore = 79;

  function frame() {
    ctx.clearRect(0, 0, W, H);
    progress = Math.min(progress + 2, targetScore);

    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.25;
    const range = endAngle - startAngle;

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, R, startAngle, endAngle);
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Fill
    const fillEnd = startAngle + range * (progress / 100);
    const grad = ctx.createLinearGradient(cx-R, cy, cx+R, cy);
    grad.addColorStop(0, '#555');
    grad.addColorStop(1, '#FFF');
    ctx.beginPath();
    ctx.arc(cx, cy, R, startAngle, fillEnd);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Tick marks
    for (let i = 0; i <= 10; i++) {
      const angle = startAngle + range * (i/10);
      const inner = R - 18;
      const outer = R - 8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle)*inner, cy + Math.sin(angle)*inner);
      ctx.lineTo(cx + Math.cos(angle)*outer, cy + Math.sin(angle)*outer);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (progress < targetScore) requestAnimationFrame(frame);
  }
  frame();
}

// ===== WEEK EARNINGS CHART =====
function drawWeekEarnings() {
  const canvas = document.getElementById('weekEarningsChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const vals  = [0, 62, 124, 56, 86, 65, 0];
  const maxV = 130;

  days.forEach((d, i) => {
    const x = (i / 7) * W + (W/7)*0.15;
    const bW = (W/7) * 0.7;
    const fillH = (vals[i] / maxV) * (H - 20);

    // Track
    ctx.fillStyle = '#2A2A2A';
    ctx.roundRect(x, 0, bW, H-16, 3);
    ctx.fill();

    // Fill
    if (vals[i] > 0) {
      ctx.fillStyle = i === 6 ? '#444' : '#FFFFFF';
      ctx.roundRect(x, H - 16 - fillH, bW, fillH, 3);
      ctx.fill();
    }

    // Label
    ctx.fillStyle = '#555';
    ctx.font = '9px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d, x + bW/2, H - 2);
  });
}

// ===== MONTHLY CHART =====
function drawMonthlyChart() {
  const canvas = document.getElementById('monthlyChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const months = ['Sep','Oct','Nov','Dec','Jan','Feb'];
  const vals = [1820, 2140, 1960, 2380, 2650, 2847];
  const maxV = 3000;

  const xScale = i => (i / (months.length-1)) * (W-20) + 10;
  const yScale = v => H - 20 - (v/maxV) * (H-30);

  // Fill area
  ctx.beginPath();
  vals.forEach((v,i) => {
    if (i===0) ctx.moveTo(xScale(i), yScale(v));
    else ctx.lineTo(xScale(i), yScale(v));
  });
  ctx.lineTo(xScale(5), H-20);
  ctx.lineTo(xScale(0), H-20);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(255,255,255,0.1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  vals.forEach((v,i) => {
    if (i===0) ctx.moveTo(xScale(i), yScale(v));
    else ctx.lineTo(xScale(i), yScale(v));
  });
  ctx.stroke();

  // Labels
  ctx.fillStyle = '#555';
  ctx.font = '9px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  months.forEach((m,i) => ctx.fillText(m, xScale(i), H - 4));
}

// ===== CASHFLOW CHART =====
function drawCashflowChart() {
  const canvas = document.getElementById('cashflowChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const days = Array.from({length: 28}, (_,i) => i+1);
  // Simulate earnings (spiky) and bills (periodic)
  const earnings = days.map(d => {
    const base = [0,186,0,124,0,0,83,0,210,0,140,0,0,196,0,84,0,173,0,0,145,0,218,0,96,0,0,192];
    return base[d-1] || 0;
  });
  const bills = days.map(d => {
    if (d === 1) return -85;
    if (d === 14) return -632;
    if (d === 15) return -1850;
    if (d === 22) return -280;
    return 0;
  });

  const pad = { l: 10, r: 10, t: 20, b: 30 };
  const gW = W - pad.l - pad.r;
  const gH = H - pad.t - pad.b;
  const maxV = 2100;

  // Grid
  ctx.strokeStyle = '#2A2A2A';
  ctx.lineWidth = 1;
  [0, 0.5, 1].forEach(v => {
    const y = pad.t + gH * (1 - v);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(pad.l+gW, y);
    ctx.stroke();
  });

  const bW = gW / 28 - 2;

  days.forEach((d, i) => {
    const x = pad.l + i * (gW / 28);

    if (earnings[i] > 0) {
      const h = (earnings[i] / maxV) * gH;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(x + 1, pad.t + gH - h, bW, h);
    }

    if (bills[i] < 0) {
      const h = (Math.abs(bills[i]) / maxV) * gH;
      ctx.fillStyle = 'rgba(171,171,171,0.3)';
      ctx.fillRect(x + 1, pad.t + gH - h, bW, h);
    }

    // Day label
    if (d % 7 === 1) {
      ctx.fillStyle = '#555';
      ctx.font = '9px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Feb ${d}`, x + bW/2, H - 4);
    }
  });
}

// ===== SPEND DONUT CHART =====
function drawSpendChart() {
  const canvas = document.getElementById('spendChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const cx = W/2, cy = H/2, R = 140, innerR = 90;
  const segments = [
    { val: 680, color: '#FFFFFF' },
    { val: 310, color: '#ABABAB' },
    { val: 85, color: '#6B6B6B' },
    { val: 265, color: '#3E3E3E' },
    { val: 850, color: '#2A2A2A' },
  ];

  const total = segments.reduce((s,x) => s + x.val, 0);
  let angle = -Math.PI/2;
  let prog = 0;

  function frame() {
    ctx.clearRect(0, 0, W, H);
    prog = Math.min(prog + 0.06, 1);
    let a = -Math.PI/2;

    segments.forEach(seg => {
      const slice = (seg.val / total) * Math.PI * 2 * prog;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, a, a + slice);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      a += slice;
    });

    // Donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI*2);
    ctx.fillStyle = '#0A0A0A';
    ctx.fill();

    if (prog < 1) requestAnimationFrame(frame);
  }
  frame();
}

// ===== MARKET CHART =====
function drawMarketChart() {
  const canvas = document.getElementById('marketChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const data = [
    { year: '2020', val: 310 },
    { year: '2021', val: 385 },
    { year: '2022', val: 420 },
    { year: '2023', val: 468 },
    { year: '2024', val: 698 },
    { year: '2025*', val: 700 },
  ];

  const pad = { l: 40, r: 20, t: 30, b: 40 };
  const gW = W - pad.l - pad.r;
  const gH = H - pad.t - pad.b;
  const maxV = 800;

  // Grid
  ctx.strokeStyle = '#2A2A2A';
  ctx.lineWidth = 1;
  [0, 0.25, 0.5, 0.75, 1].forEach(v => {
    const y = pad.t + gH * (1-v);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(pad.l+gW, y);
    ctx.stroke();

    ctx.fillStyle = '#555';
    ctx.font = '11px DM Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText((v * maxV).toFixed(0) + 'K', pad.l - 6, y + 4);
  });

  const xScale = i => pad.l + (i / (data.length-1)) * gW;
  const yScale = v => pad.t + gH * (1 - v / maxV);

  // Area fill
  ctx.beginPath();
  data.forEach((d,i) => {
    if (i===0) ctx.moveTo(xScale(i), yScale(d.val));
    else ctx.lineTo(xScale(i), yScale(d.val));
  });
  ctx.lineTo(xScale(data.length-1), pad.t+gH);
  ctx.lineTo(xScale(0), pad.t+gH);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t+gH);
  grad.addColorStop(0, 'rgba(255,255,255,0.12)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  data.forEach((d,i) => {
    if (i===0) ctx.moveTo(xScale(i), yScale(d.val));
    else ctx.lineTo(xScale(i), yScale(d.val));
  });
  ctx.stroke();

  // Dots and labels
  data.forEach((d,i) => {
    ctx.beginPath();
    ctx.arc(xScale(i), yScale(d.val), 4, 0, Math.PI*2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.fillStyle = '#6B6B6B';
    ctx.font = '11px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.year, xScale(i), pad.t + gH + 20);

    ctx.fillStyle = '#ABABAB';
    ctx.font = '10px DM Sans, sans-serif';
    ctx.fillText(d.val + 'K', xScale(i), yScale(d.val) - 10);
  });
}

// ===== INIT PAGE CHARTS =====
function initPageCharts(page) {
  if (page === 'home') {
    drawEarningsPulse();
    drawFlywheelChart();
  }
  if (page === 'ai') {
    drawBillReadinessChart();
    drawVolatilityGauge();
  }
  if (page === 'app') {
    drawWeekEarnings();
    drawMonthlyChart();
  }
  if (page === 'deposit') {
    drawCashflowChart();
  }
  if (page === 'card') {
    drawSpendChart();
  }
  if (page === 'about') {
    drawMarketChart();
  }
}

// ===== INTERSECTION OBSERVER for animations =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

function observeElements() {
  document.querySelectorAll(
    '.solution-card, .problem-item, .budget-card, .testimonial, .feature-row, .credit-feat-card, .roadmap-item'
  ).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
  observeElements();

  // Redraw on resize
  window.addEventListener('resize', () => {
    const activePage = document.querySelector('.page.active');
    if (activePage) {
      const name = activePage.id.replace('page-', '');
      initPageCharts(name);
    }
  });
});
