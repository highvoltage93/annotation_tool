const LINE_COLOR = "#18d2a8";
const RECTANGLE_COLOR = "#18d2a8"

const canvas = document.getElementById("canvas");
const svg_container = document.getElementById("svg_container");
const ctx = canvas.getContext("2d");
const crosshairCanvas = document.getElementById("crosshairCanvas");
const crosshairCtx = crosshairCanvas.getContext("2d");
crosshairCanvas.width = 1600;
crosshairCanvas.height = 900;

const img = new Image();
img.src = "./file.jpg";
canvas.width = 1600;
canvas.height = 900;
svg_container.style.width = 1600;
svg_container.style.height = 900;
svg_container.style.position = "absolute";
svg_container.style.top = 0;
svg_container.style.left = 0;

let isMouseDown = false;
let startX, startY;
let rect;
let width, height;
let currentCircle;


function createCircle(x, y) {
    var svgns = "http://www.w3.org/2000/svg";
    var circle = document.createElementNS(svgns, "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("fill", RECTANGLE_COLOR);
    circle.setAttribute("r", 5);
    circle.setAttribute("stroke", RECTANGLE_COLOR);
    svg_container.appendChild(circle);
}

function createRectangle(x, y) {
    var svgns = "http://www.w3.org/2000/svg";
    rect = document.createElementNS(svgns, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("height", 0);
    rect.setAttribute("width", 0);
    rect.setAttribute("fill", "transparent");
    rect.setAttribute("stroke", RECTANGLE_COLOR);
    svg_container.appendChild(rect);
}
function updateRectangle(x, y) {
    width = Math.abs(x - startX);
    height = Math.abs(y - startY);

    rect.setAttribute("x", Math.min(x, startX));
    rect.setAttribute("y", Math.min(y, startY));
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
}

svg_container.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    const bounds = svg_container.getBoundingClientRect();
    startX = e.clientX - bounds.left;
    startY = e.clientY - bounds.top;
    createRectangle(startX, startY);
});

svg_container.addEventListener("mousemove", (e) => {
    // Очистите холст перекрестия
    crosshairCtx.clearRect(0, 0, crosshairCanvas.width, crosshairCanvas.height);

    // Получите координаты мыши
    const bounds = svg_container.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    // Рисуйте горизонтальную и вертикальную линии
    crosshairCtx.beginPath();
    crosshairCtx.moveTo(0, mouseY);
    crosshairCtx.lineTo(crosshairCanvas.width, mouseY);
    crosshairCtx.moveTo(mouseX, 0);
    crosshairCtx.lineTo(mouseX, crosshairCanvas.height);
    crosshairCtx.strokeStyle = LINE_COLOR;
    crosshairCtx.lineWidth = 0.5
    crosshairCtx.stroke();

    if (isMouseDown) {
        svg_container.style.cursor = "crosshair";
        const bounds = svg_container.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        updateRectangle(mouseX, mouseY);
    }
});

svg_container.addEventListener("mouseup", () => {
    isMouseDown = false;
    svg_container.style.cursor = "auto";
    rect.setAttribute("class", "hoverable-rect");

    createCircle(startX, startY); // Верхний левый угол
    createCircle(startX + width, startY); // Верхний правый угол
    createCircle(startX, startY + height); // Нижний левый угол
    createCircle(startX + width, startY + height); // Нижний правый угол
});
img.onload = () => {
    ctx.scale(1, 1);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};
