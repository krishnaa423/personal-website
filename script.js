const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");
let w = 0;
let h = 0;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  w = canvas.clientWidth;
  h = canvas.clientHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw(time) {
  ctx.clearRect(0, 0, w, h);
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#eef4ea");
  grad.addColorStop(0.55, "#f7f8f4");
  grad.addColorStop(1, "#f2ead7");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.lineWidth = 1;
  for (let y = -40; y < h + 40; y += 28) {
    ctx.beginPath();
    for (let x = -20; x < w + 20; x += 16) {
      const phase = 0.0012 * time + x * 0.012 + y * 0.018;
      const yy = y + Math.sin(phase) * 9 + Math.cos(phase * 0.7) * 5;
      if (x === -20) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.strokeStyle = "rgba(29, 95, 122, 0.13)";
    ctx.stroke();
  }

  const nodes = 42;
  const pts = [];
  for (let i = 0; i < nodes; i += 1) {
    const a = i * 2.399;
    const r = Math.sqrt(i / nodes);
    pts.push([
      w * (0.58 + 0.34 * r * Math.cos(a + time * 0.00012)),
      h * (0.42 + 0.42 * r * Math.sin(a + time * 0.00016)),
    ]);
  }
  ctx.strokeStyle = "rgba(55, 109, 74, 0.22)";
  for (let i = 0; i < pts.length; i += 1) {
    for (let j = i + 1; j < pts.length; j += 1) {
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      if (dx * dx + dy * dy < 8200) {
        ctx.beginPath();
        ctx.moveTo(pts[i][0], pts[i][1]);
        ctx.lineTo(pts[j][0], pts[j][1]);
        ctx.stroke();
      }
    }
  }
  ctx.fillStyle = "rgba(166, 66, 50, 0.72)";
  for (const [x, y] of pts) {
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".project").forEach((card) => {
      const show = filter === "all" || card.dataset.tags.split(" ").includes(filter);
      card.style.display = show ? "" : "none";
    });
  });
});

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(draw);
