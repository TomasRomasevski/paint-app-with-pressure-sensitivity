const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.querySelector('input[id="colorPicker"]');
const backgroundColorPicker = document.querySelector('input[id="backgroundColorPicker"]');
const brushSizePicker = document.querySelector('input[id="brushSize"]');
const canvasWidthPicker = document.querySelector('input[id="canvasWidth"]');
const canvasHeightPicker = document.querySelector('input[id="canvasHeight"]');
const shadowSizePicker = document.querySelector('input[id="shadowSize"]');
const colorRandomnesRange = document.querySelector('input[id="colorRandomnesRange"]')
const undo = document.getElementById("undo");
const redo = document.getElementById("redo");
let curX;
let curY;
let painting = false;
let sizeOnPressure;
let history = [];
let historyIndex = -1;
let brushColor = colorPicker.value;
let screenWidth =  window.innerWidth;
window.onresize = () => {
    screenWidth = window.innerWidth;
    curXOffset = (screenWidth > 800) ? 80 : 150;
};
let curXOffset = (screenWidth > 800) ? 80 : 150;
canvas.style.backgroundColor = backgroundColorPicker.value;
canvasWidthPicker.value = canvas.width = window.innerWidth;
canvasHeightPicker.value = canvas.height = window.innerHeight - 84;

window.onload = () => {
    history.push(canvas.toDataURL());
    historyIndex++
};

canvasWidthPicker.oninput = () => canvas.width = canvasWidthPicker.value;
canvasHeightPicker.oninput = ()=> canvas.height = canvasHeightPicker.value;
backgroundColorPicker.oninput = ()=> canvas.style.backgroundColor = backgroundColorPicker.value;
shadowSizePicker.oninput = ()=> ctx.shadowBlur = shadowSizePicker.value;
undo.onclick = () => { if(historyIndex > 0 && history[historyIndex - 1]) {undoHistory()} };
redo.onclick = () => { if((historyIndex + 1) < history.length) {redoHistory()} };
function randomRgbBrush (hex) {
    let r = Math.floor(Math.random() * colorRandomnesRange.value - colorRandomnesRange.value / 2 + parseInt(hex.slice(1, 3), 16));
    r > 255 ? 255 : r;
    r < 0 ? 0 : r;
    const g = Math.floor(Math.random() * colorRandomnesRange.value - colorRandomnesRange.value / 2 + parseInt(hex.slice(3, 5), 16));
    g > 255 ? 255 : g;
    g < 0 ? 0 : g;
    const b = Math.floor(Math.random() * colorRandomnesRange.value - colorRandomnesRange.value / 2 + parseInt(hex.slice(5, 7), 16));
    b > 255 ? 255 : b;
    b < 0 ? 0 : b;
    return `rgba(${r}, ${g}, ${b})`
};
document.addEventListener('pointermove', e => {
    curX = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    curY = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    sizeOnPressure = ((e.pressure <= 0.1) ? 0.1 : e.pressure) * brushSizePicker.value * 4;
});
canvas.addEventListener('pointerdown', (e) => {
    curX = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    curY = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    if((historyIndex + 1) !== history.length){history.splice(historyIndex + 1)};
    brushColor = randomRgbBrush(colorPicker.value); 
    sizeOnPressure = ((e.pressure <= 0.1) ? 0.1 : e.pressure) * brushSizePicker.value * 4;
    painting = true;
    
});
canvas.addEventListener('pointerup', () => {
    if(painting){
        painting = false;
        ctx.beginPath();
        history.push(canvas.toDataURL());
        historyIndex++;
        if(history.length > 30){
            history[historyIndex - 30] = '';
        }
    };
});
canvas.addEventListener('pointerleave', ()=> {
    if(painting){
        painting = false;
        ctx.beginPath();
        history.push(canvas.toDataURL());
        historyIndex++;
        if(history.length > 30){
            history[historyIndex - 30] = '';
        }
    };
});

function draw(){
    if(painting){
        ctx.lineJoin = 'round';
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = sizeOnPressure;
        ctx.lineCap = 'round';
        ctx.shadowColor = brushColor;
        ctx.shadowBlur = shadowSizePicker.value;
        ctx.lineTo(curX, curY - curXOffset);
        //ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(curX, curY - curXOffset);
    }
   requestAnimationFrame(draw);
}

draw();

function undoHistory () {
    historyIndex--;
    let img = document.createElement('img');
    img.setAttribute("src", history[historyIndex]);
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    }
}

function redoHistory () {
    historyIndex++;
    let img = document.createElement('img');
    img.setAttribute("src", history[historyIndex]);
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    }
}

function stepDownSize(id, num){
    id.stepDown(num);
}

function stepUpSize(id, num){
    id.stepUp(num);
}
