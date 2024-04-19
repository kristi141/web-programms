import { feedforward } from "./nn.js";

// Создание канваса
let canvas = document.getElementById("neural-drawField");
let context = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
let brushSize = document.getElementById("neural-brushSize");
brushSize.addEventListener('input', (e) => {
    brushSize.style.backgroundSize = (e.target.value - e.target.min) * 100 / (e.target.max - e.target.min) + '% 100%';
    
    context.lineWidth = brushSize.value; 
});

context.lineWidth = brushSize.value;

// устанавливаем начальные координаты
let lastX;
let lastY;

let draw;

// обработчик нажатия мыши
canvas.addEventListener("mousedown", function(e) {
    lastX = e.clientX - canvas.offsetLeft;
    lastY = e.clientY - canvas.offsetTop;
    draw = true;
    context.beginPath();
    context.moveTo(lastX, lastY);
});

// обработчик движения мыши
canvas.addEventListener("mousemove", function(e) {
    if (e.buttons !== 1) {
        return;
    }
    if(draw === true) {

        let currentX = e.clientX - canvas.offsetLeft;
        let currentY = e.clientY - canvas.offsetTop;

        context.lineTo(currentX, currentY);
        context.strokeStyle = "black";
        context.stroke();

        lastX = currentX;
        lastY = currentY;
    }
});

// обработчик отпускания кнопки мыши
canvas.addEventListener("mouseup", function(e) {
    lastX = null;
    lastY = null;
    neuralNetwork();
});

let cnv = document.getElementById('neural-cnv');
let ctx = cnv.getContext("2d");

let imgWidth = canvas.width;
let imgHeight = canvas.height;

function imageCenterig(imgData, image) {
    let test = new Array(imgHeight * imgWidth); 
        for (let i = 3; i < imgData.length; i += 4) {
            test[ Math.floor(i / 4) ] = (imgData[i] / 255);
        }



        // найти границы цифры
        let cropTop = scanY(true, test);
        let cropBottom = scanY(false, test);
        let cropLeft = scanX(true, test);
        let cropRight = scanX(false, test);

        let cropXDiff = cropRight - cropLeft;
        let cropYDiff = cropBottom - cropTop;
        // console.log(cropTop +  " " + cropLeft + " " + cropBottom + " " + cropRight)

        cnv.width = 28;
        cnv.height = 28;

        // Просчитывание паддингов чтобы цифра была не во весь канвас
        let size = Math.floor(Math.max(cropXDiff, cropYDiff) * 0.3) * 2 + Math.max(cropXDiff, cropYDiff);
        let gorizontalPaddings = Math.floor((size - cropXDiff) / 2);
        let verticalPaddings = Math.floor((size - cropYDiff) / 2);

        // Нарисовать итоговое изображение
        ctx.drawImage(image, cropLeft - gorizontalPaddings, cropTop - verticalPaddings, cropXDiff + (gorizontalPaddings * 2), cropYDiff + (verticalPaddings * 2), 0, 0, 28, 28);
        return ctx.getImageData(0, 0, 28, 28).data;
}

// Функция запускающая работу нн
function neuralNetwork() {
    let canvas = document.getElementById('neural-drawField');
    let image = new Image();
    image.src = canvas.toDataURL();

    image.onload = () => {
        // Получить данные с канваса и центрировать изображение
        var imgData = context.getImageData(0, 0, imgWidth, imgHeight).data;
        let scaledImage = imageCenterig(imgData, image);

        // Преобразовать в одноканальную картинку
        let oneChannelImage = new Array(28 ** 2);
        for (let i = 3; i < scaledImage.length; i += 4) {
            oneChannelImage[ Math.floor(i / 4) ] = (scaledImage[i] / 255);
        }

        // console.log('centr ' + centredImage)
        // Запуск прямого прохода и вывод результата
        let resultImage = feedforward(oneChannelImage);
        let max = -1, maxInd = 0;
        for (let i = 0; i < resultImage.length; i++) {
            if (resultImage[i] >= max) {
                max = resultImage[i];
                maxInd = i;
            }
        }
        document.getElementById('neural-answerLabel').textContent = "" + maxInd;
    }
}

function scanX(fromLeft, imgData) {
    var offset = fromLeft? 1 : -1;

    for(var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {
        for(var y = 0; y < imgHeight; y += 4) {
            let index = (y * imgHeight) + x;
            if (imgData[index] != 0) {
                if (fromLeft) {
                    return x;
                } else {
                    return Math.min(x + 1, imgWidth);
                }
            }      
        }
    }
    return null;
};

function scanY(fromTop, imgData) {
    var offset = fromTop ? 1 : -1;

    for(var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {
        for(var x = 0; x < imgWidth; x++) {
            let index = (y * imgHeight) + x;
            if (imgData[index] != 0) {
                if (fromTop) {
                    return y;
                } else {
                    return Math.min(y + 1, imgHeight);
                }
            }
        }
    }
    return null;
 }

 // Очистить канвас
function clearCanvas() {
    context.clearRect(0,0, canvas.width, canvas.height);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    document.getElementById("neural-answerLabel").textContent = "";
}

let clearButton = document.getElementById('neural-clearButton');
clearButton.addEventListener('click', function() { clearCanvas(); });

