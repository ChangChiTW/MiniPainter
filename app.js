const canvas = document.querySelector("#canvas");
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
  let history = [];
  let step = -1;

  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  let fontSize = "20";
  let font = "Serif";
  ctx.font = `${fontSize}px ${font}`;

  $("#canvas").on("resize", resize);

  $(".tool").on("click", function () {
    $(".tool").removeClass("active");
    $(this).addClass("active");
    mode = $(this).attr("id");
    if (mode == "text") canvas.style.cursor = "text";
  });

  $("#color").on("input", function () {
    ctx.fillStyle = $(this)[0].value;
    ctx.strokeStyle = $(this)[0].value;
  });

  $("#fonts").on("input", function () {
    font = $(this)[0].value;
    ctx.font = `${fontSize}px ${font}`;
  });

  $("#fontSize").on("input", function () {
    fontSize = $(this)[0].value;
    ctx.font = `${fontSize}px ${font}`;
  });

  $("#brushSize").on("input", function () {
    ctx.lineWidth = $(this)[0].value;
  });

  $("#undo").on("click", function () {
    if (step > 0) {
      step--;
      ctx.putImageData(history[step], 0, 0);
    }
  });

  $("#redo").on("click", function () {
    if (step < history.length - 1) {
      step++;
      ctx.putImageData(history[step], 0, 0);
    }
  });

  $("#clear").on("click", function () {
    state();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  $("#upload").on("change", function (e) {
    if (e.target.files) {
      let imageFile = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = function (e) {
        var myImage = new Image();
        myImage.src = e.target.result;
        myImage.onload = function () {
          ctx.drawImage(myImage, 0, 0);
        };
      };
    }
  });

  $("#download").on("click", function () {
    const img = canvas.toDataURL("image/png");
    const download = document.querySelector(".download");
    download.setAttribute("href", img);
  });

  $(canvas).on("mouseenter", setPosition);

  $(canvas).on("mousedown", function (e) {
    tmpCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
    startPos = {
      x: e.clientX,
      y: e.clientY - 100,
    };
    setPosition(e);
  });

  $(canvas).on("mouseup", function () {
    if (mode == "text") canvas.style.cursor = "text";
    else canvas.style.cursor = "default";

    tmpCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);

    state();
  });

  $(canvas).on("mousemove", draw);

  function setPosition(e) {
    curPos.x = e.clientX;
    curPos.y = e.clientY - 100;
  }

  function state() {
    step++;
    if (step < history.length) {
      history.length = step;
    }
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }

  function draw(e) {
    if (e.buttons !== 1) return;
    canvas.style.cursor = "crosshair";
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
      let r = Math.sqrt(Math.pow(curPos.x - startPos.x, 2) + Math.pow(curPos.y - startPos.y, 2));
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
    } else if (mode === "rectangle") {
      ctx.putImageData(tmpCanvas, 0, 0);
      ctx.beginPath();
      setPosition(e);
      ctx.rect(startPos.x, startPos.y, curPos.x - startPos.x, curPos.y - startPos.y);
      ctx.stroke();
      ctx.closePath();
    } else if (mode === "line") {
      ctx.putImageData(tmpCanvas, 0, 0);
      ctx.beginPath();
      setPosition(e);
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(curPos.x, curPos.y);
      ctx.stroke();
      ctx.closePath();
    }
  }
});
