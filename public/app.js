const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

resize();

function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight - window.innerWidth * 0.06;
}

window.addEventListener("resize", resize);

$(document).ready(function () {
  let mode = "pencil";
  let fill = false;
  let curPos = { x: 0, y: 0 };
  let startPos = { x: 0, y: 0 };
  let tmpCanvas;
  let history = [];
  let step = -1;
  let hasInput = false;

  ctx.lineWidth = 10;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.lineCap = "round";
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  let fontSize = "20";
  let font = "Serif";
  ctx.font = `${fontSize}px ${font}`;
  canvas.style.cursor = `url("./icon/cursor/${mode}.png"), auto`;

  $("#canvas").on("resize", resize);

  $(".tool").on("click", function () {
    $(".tool").removeClass("active");
    $(this).addClass("active");
    mode = $(this).attr("id");
    if (mode == "text") canvas.style.cursor = "text";
    else canvas.style.cursor = `url("./icon/cursor/${mode}.png"), auto`;
    if (mode == "eraser") ctx.globalCompositeOperation = "destination-out";
    else ctx.globalCompositeOperation = "source-over";
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

  $("#fill").on("click", function () {
    if ($(this)[0].className) {
      $(this).removeClass("active");
      fill = false;
    } else {
      $(this).addClass("active");
      fill = true;
    }
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
    const a = document.createElement("a");
    a.download = "myImage.png";
    a.href = img;
    a.click();
  });

  $(canvas).on("mouseenter", setPosition);

  $(canvas).on("mousedown", function (e) {
    tmpCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
    startPos = {
      x: e.clientX,
      y: e.clientY - window.innerWidth * 0.06,
    };
    setPosition(e);
    if (mode == "text") {
      if (hasInput) {
        $("#textInput").remove();
        hasInput = false;
      } else addInput(e.clientX, e.clientY);
    }
  });

  $(canvas).on("mouseup", function () {
    tmpCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);

    state();
  });

  $(canvas).on("mousemove", draw);

  function setPosition(e) {
    curPos.x = e.clientX;
    curPos.y = e.clientY - window.innerWidth * 0.06;
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
    if (mode === "pencil") {
      ctx.beginPath();
      ctx.moveTo(curPos.x, curPos.y + 40);
      setPosition(e);
      ctx.lineTo(curPos.x, curPos.y + 40);
      ctx.stroke();
      ctx.closePath();
    } else if (mode === "eraser") {
      ctx.beginPath();
      ctx.moveTo(curPos.x + 5, curPos.y + 35);
      setPosition(e);
      ctx.lineTo(curPos.x + 5, curPos.y + 35);
      ctx.stroke();
      ctx.closePath();
    } else if (mode === "text") {
    } else if (mode === "circle") {
      ctx.putImageData(tmpCanvas, 0, 0);
      setPosition(e);
      let r = Math.sqrt(Math.pow(curPos.x - startPos.x, 2) + Math.pow(curPos.y - startPos.y, 2));
      ctx.beginPath();
      ctx.arc((curPos.x + startPos.x) / 2, (curPos.y + startPos.y) / 2, r / 2, 0, 2 * Math.PI);
      if (fill) ctx.fill();
      else ctx.stroke();
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
      if (fill) ctx.fill();
      else ctx.stroke();
      ctx.closePath();
    } else if (mode === "rectangle") {
      ctx.putImageData(tmpCanvas, 0, 0);
      ctx.beginPath();
      setPosition(e);
      ctx.rect(startPos.x, startPos.y, curPos.x - startPos.x, curPos.y - startPos.y);
      if (fill) ctx.fill();
      else ctx.stroke();
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

  function addInput(x, y) {
    const input = document.createElement("input");
    input.type = "text";
    input.setAttributeNode(document.createAttribute("Autofocus"));
    input.setAttribute("id", "textInput");
    input.style.position = "fixed";
    input.style.left = x + "px";
    input.style.top = y + "px";
    input.style.fontSize = fontSize + "px";

    input.onkeydown = handleEnter;

    document.body.appendChild(input);

    input.focus();

    hasInput = true;
  }

  function handleEnter(e) {
    const keyCode = e.keyCode;
    if (keyCode === 13) {
      ctx.fillText(this.value, curPos.x, curPos.y);
      document.body.removeChild(this);
      hasInput = false;
      state();
    }
  }
});
