const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

resize();

function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight - 100;
}

window.addEventListener("resize", resize);

$(document).ready(function () {
  let mode = "pencil";
  let curPos = { x: 0, y: 0 };
  let startPos = { x: 0, y: 0 };
  let tmpCanvas;
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";

  $(".toggle").on("click", function () {
    $(".toggle").removeClass("active");
    $(this).addClass("active");
  });

  $("button").on("click", function () {
    mode = $(this).attr("id");
  });

  document.addEventListener("mousemove", draw);
  document.addEventListener("mousedown", function (e) {
    tmpCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
    startPos = {
      x: e.clientX,
      y: e.clientY - 100,
    };
    setPosition(e);
  });
  document.addEventListener("mouseenter", setPosition);
  document.addEventListener("mouseup", function () {
    tmpCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
  });

  document.getElementById("clear").addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  function setPosition(e) {
    curPos.x = e.clientX;
    curPos.y = e.clientY - 100;
  }

  function cal_radius(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  function draw(e) {
    if (e.buttons !== 1) return;

    if (mode === "pencil") {
      ctx.beginPath();
      ctx.moveTo(curPos.x, curPos.y);
      setPosition(e);
      ctx.lineTo(curPos.x, curPos.y);
      ctx.stroke();
      ctx.closePath();
    } else if (mode === "eraser") {
      setPosition(e);
      ctx.clearRect(curPos.x, curPos.y, ctx.lineWidth * 1.5, ctx.lineWidth * 1.5);
    } else if (mode === "text") {
    } else if (mode === "circle") {
      ctx.putImageData(tmpCanvas, 0, 0);
      setPosition(e);
      let r = cal_radius(curPos.x - startPos.x, curPos.y - startPos.y);
      ctx.beginPath();
      ctx.arc((curPos.x + startPos.x) / 2, (curPos.y + startPos.y) / 2, r / 2, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    } else if (mode === "triangle") {
      ctx.putImageData(tmpCanvas, 0, 0);
      ctx.beginPath();
      setPosition(e);
      ctx.moveTo(curPos.x, curPos.y);
      ctx.lineTo(curPos.x, curPos.y);
      ctx.lineTo(2 * startPos.x - curPos.x, curPos.y);
      ctx.lineTo(startPos.x, startPos.y);
      ctx.lineTo(curPos.x, curPos.y);
      ctx.stroke();
      ctx.closePath();
    }
  }
});
