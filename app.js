const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

resize();

function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight * 0.9;
}

window.addEventListener("resize", resize);

$(document).ready(function () {
  let mode = "pencil";
  let pos = { x: 0, y: 0 };
  const lineCap = ["butt", "round", "square"];

  $(".toggle").on("click", function () {
    $(".toggle").removeClass("active");
    $(this).addClass("active");
  });

  $("button").on("click", function () {
    console.log($(this).attr("id"));
    mode = $(this).attr("id");
  });

  document.addEventListener("mousedown", setPosition);
  document.addEventListener("mouseenter", setPosition);

  document.addEventListener("mousemove", draw);

  document.getElementById("clear").addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  function setPosition(e) {
    pos.x = e.clientX;
    pos.y = e.clientY - window.innerHeight * 0.1;
  }

  function draw(e) {
    if (e.buttons !== 1) return;
    if (mode === "pencil") {
      // const color = document.getElementById("hex").value;
      // const lineWidth = document.getElementById("lineWidth").value;
      // const lineShape = document.getElementById("lineShape").value;

      ctx.beginPath();

      ctx.lineWidth = 10;
      ctx.lineCap = lineCap[1];
      // ctx.strokeStyle = color;

      ctx.moveTo(pos.x, pos.y);
      setPosition(e);
      ctx.lineTo(pos.x, pos.y);

      ctx.stroke();
    }
  }
});
