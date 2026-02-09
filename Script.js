let currentPage = 0;

/* =========================
   Signature Canvas
========================= */
let canvas, ctx;
let drawing = false;

window.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById('sig-canvas');
  if (canvas) {
    ctx = canvas.getContext('2d');
    prepareCanvas();

    canvas.addEventListener('mousedown', () => drawing = true);

    window.addEventListener('mouseup', () => {
      drawing = false;
      ctx.beginPath();
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!drawing) return;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#333';
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });
  }

  updateNavIcon();
});

/* =========================
   Screen Navigation
========================= */
function next(sNum) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`s${sNum + 1}`).classList.add('active');

  if (sNum === 1) startLoading();
  if (sNum === 2) prepareCanvas();
}

function startLoading() {
  const bar = document.getElementById('bar');
  const per = document.getElementById('percent');
  let w = 0;

  const iv = setInterval(() => {
    if (w >= 99) {
      clearInterval(iv);
      setTimeout(() => next(2), 800);
    } else {
      w++;
      bar.style.width = w + '%';
      per.innerText = w + '%';
    }
  }, 45);
}

/* =========================
   Tic Tac Toe
========================= */
let board = ["", "", "", "", "", "", "", "", ""];
let gameLocked = false;

function play(idx) {
  if (gameLocked || board[idx] !== "") return;

  board[idx] = "❤️";
  document.getElementsByClassName('cell')[idx].innerText = "❤️";

  if (checkWin("❤️")) {
    gameLocked = true;
    document.getElementById('win-overlay').classList.add('show');
    return;
  }
  setTimeout(computerMove, 350);
}

function checkWin(p) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return lines.some(l => l.every(i => board[i] === p));
}

function computerMove() {
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  if (!empty.length) return;
  const move = empty[Math.floor(Math.random()*empty.length)];
  board[move] = "X";
  document.getElementsByClassName('cell')[move].innerText = "X";
}

function closeOverlay() {
  document.getElementById('win-overlay').classList.remove('show');
  board = ["","","","","","","","",""];
  gameLocked = false;
  Array.from(document.getElementsByClassName('cell')).forEach(c => c.innerText = "");
  next(4);
}

/* =========================
   Runaway No Button
========================= */
function moveNo() {
  const btn = document.getElementById('no-btn');
  btn.style.position = "fixed";

  const pad = 80;
  const x = Math.random() * (window.innerWidth - btn.offsetWidth - pad*2) + pad;
  const y = Math.random() * (window.innerHeight - btn.offsetHeight - pad*2) + pad;

  btn.style.left = x + 'px';
  btn.style.top = y + 'px';
}

/* =========================
   Countdown → Finale
========================= */
function startCountdownTransition() {
  next(6);
  let t = 3;
  const cEl = document.getElementById('count');
  cEl.innerText = t;

  const iv = setInterval(() => {
    t--;
    cEl.innerText = t;
    if (t <= 0) {
      clearInterval(iv);
      document.getElementById('s7').classList.remove('active');
      document.getElementById('s8').classList.add('active');
    }
  }, 1000);
}

/* =========================
   Scrapbook Logic
========================= */
function showPage(pageNum) {
  [1,2,3].forEach(n => {
    const el = document.getElementById(`page${n}`);
    if (el) el.classList.remove('active-page');
  });

  setTimeout(() => {
    const next = document.getElementById(`page${pageNum}`);
    if (next) next.classList.add('active-page');
  }, 120);
}

function revealFirstPage() {
  if (currentPage !== 0) return;

  document.getElementById('finale-title').classList.add('at-top');

  setTimeout(() => {
    showPage(1);
    document.getElementById('nav-env').classList.remove('hidden-at-start');
    currentPage = 1;
    updateNavIcon();
  }, 600);
}

function cyclePages() {
  if (currentPage === 0) return;
  currentPage = (currentPage % 3) + 1;
  showPage(currentPage);
  updateNavIcon();
}

/* =========================
   Envelope / Bouquet Logic
========================= */
function updateNavIcon() {
  const icon = document.getElementById('nav-icon');
  const label = document.getElementById('nav-label');
  if (!icon || !label) return;

  if (currentPage === 1) {
    icon.textContent = "✉️";
    label.textContent = "Open";
  } 
  else if (currentPage === 2) {
    icon.textContent = "💐";
    label.textContent = "Next";
  } 
  else if (currentPage === 3) {
    icon.textContent = "✉️";
    label.textContent = "Back";
  }
}

/* =========================
   Canvas Helpers
========================= */
function prepareCanvas() {
  if (!ctx) return;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
}

function clearCanvas() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  prepareCanvas();
}
