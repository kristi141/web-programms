import {getSolves} from './geneticAlgorithm.js';
import { drawFullGraph, drawLines } from './settings.js';

// Поле для расстановки вершин графа
let canv = document.getElementById("genetic-canvas");

export let vertexes = [];       // Массив вершин
export let solves = [];         // Решения
let interval = null;            // Интервал работы алгоритма
const RADIUS = 12;              // Радиус вершины
let iterations = 0;             // Кол-во итераций

// Отображение всех вершин графа
export function drawVertexes() {
    let ctx = canv.getContext('2d');
    let index = 0;

    vertexes.forEach(element => {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(element.x, element.y, RADIUS, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(index, element.x, element.y + 5);
        index++;
    });
}

// Сброс текущего решения
export function resetSolve() {
    // Очиста поля
    iterations = 0;
    let ctx = canv.getContext('2d');
    ctx.reset();

    // Обновление текущего решения
    solves = [];

    // Обображение всех вершин графа
    drawVertexes();
}

// Нахождение расстояния между точками
function findDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

const MAXVALUE = 999999;

// Нахождение ближайшей к текущей позиции вершины
function findNearestPointIndex(x, y) {
    let minDistance = MAXVALUE;
    let index = MAXVALUE;

    for (let i = 0; i < vertexes.length; i++) {
        let distance = findDistance(vertexes[i].x, vertexes[i].y, x, y);

        if (distance < minDistance) {
            index = i;
            minDistance = distance;
        }
    }

    return index;
}

// Проверка наложения точек и их выхода за пределы поля
function drawPossibility(x, y) {
    let index = findNearestPointIndex(x, y);

    return (index === MAXVALUE || 
        findDistance(vertexes[index].x, vertexes[index].y, x, y) > 2 * RADIUS + 2 &&
        x > RADIUS && x < canv.clientWidth - RADIUS && y > RADIUS && y < canv.clientHeight - RADIUS);
}

let deleteVertexButton = document.getElementById("deleteVertexButton");
let deleteMode = false;

// Переключение режима добавления/удаления вершины
deleteVertexButton.addEventListener('click', (e) => {
    if (!deleteMode) {
        deleteVertexButton.innerHTML = "Удаление вершин: ВКЛ"
        deleteMode = true;
    }
    else {
        deleteVertexButton.innerHTML = "Удаление вершин: ВЫКЛ"
        deleteMode = false;
    }
})


// Удаление вершины
function deleteVertex(e) {
    // Нахождение положения курсора
    let xPos = e.clientX - canv.getBoundingClientRect().left;
    let yPos = e.clientY - canv.getBoundingClientRect().top;

    // Нахождение ближайшей к курсору вершины
    let nearestVertex = findNearestPointIndex(xPos, yPos);

    // Удаление выбранной вершины
    if (Math.abs(vertexes[nearestVertex].x - xPos) <= RADIUS &&
    Math.abs(vertexes[nearestVertex].y - yPos) <= RADIUS) {
        vertexes.splice(nearestVertex, 1);

        // Завершение работы алгоритма
        iterations = 0;
        clearInterval(interval);
        interval = null;

        // Сброс текущего решения
        resetSolve();

        // Отображение полного графа
        if (drawFullGraph) {
            drawLines();
        }
    }
}

// Создание новой вершины
canv.addEventListener('click', (e) => {
    if (deleteMode) {
        return;
    }

    if (vertexes.length === 60)
    {
        alert("Слишком много!");
        return;
    }

    // Завершение работы алгоритма
    iterations = 0;
    clearInterval(interval);
    interval = null;

    // Нахождение положения новой вершины
    let xPos = e.clientX - canv.getBoundingClientRect().left;
    let yPos = e.clientY - canv.getBoundingClientRect().top;

    // Отображение новой вершины
    if (drawPossibility(xPos, yPos)) {
        
        // Сброс текущего решения
        resetSolve();

        // Отображение новой вершины графа
        let ctx = canv.getContext('2d');
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(xPos, yPos, RADIUS, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(vertexes.length, xPos, yPos + 5);

        // Добавление в массив вершин
        vertexes.push({x: xPos, y: yPos});

        // Отображение полного графа
        if (drawFullGraph) {
            drawLines();
        }
        
        drawVertexes();
    }
});

// Удаление вершин по зажатию мыши
let mouseIsDown = false;

// Удаление вершины по нажатию
canv.addEventListener('mousedown', (e) => {
    // Завершение работы алгоритма
    clearInterval(interval);
    interval = null;

    if (deleteMode) {
        deleteVertex(e);
        mouseIsDown = true;
    }
});

// Удаление вершины при движении мыши
canv.addEventListener('mousemove', (e) => {
    if (mouseIsDown && deleteMode) {
        deleteVertex(e);
    }
});

// Остановка удаления вершин при разжатии мыши
canv.addEventListener('mouseup', (e) => {
    mouseIsDown = false;
});

// Отображение найденного решения
export function showSolve(solve) {
    // Обновление поля
    let ctx = canv.getContext('2d');
   
    // Проведение ребёр в найденном маршруте
    for (let i = 0; i < solve.length - 1; i++) {
        ctx.moveTo(vertexes[solve[i]].x, vertexes[solve[i]].y);
        ctx.lineTo(vertexes[solve[i + 1]].x, vertexes[solve[i + 1]].y);
        
        if (iterations < 100) {
            ctx.strokeStyle = "white";
        }
        else {
            ctx.strokeStyle = "#20b9e5";
        }
//lemonchiffon
//lightgoldenrodyellow
//linen
        ctx.lineWidth = "4";
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.beginPath();
    }

    // Соединение начальной и конечной вершин в маршруте
    ctx.moveTo(vertexes[solve[solve.length - 1]].x, vertexes[solve[solve.length - 1]].y);
    ctx.lineTo(vertexes[solve[0]].x, vertexes[solve[0]].y);
    if (iterations < 100) {
        ctx.strokeStyle = "white";
    }
    else {
        ctx.strokeStyle = "#20b9e5";

        clearInterval(interval);
        interval = null;
    }
    ctx.lineWidth = "4";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.beginPath();

    // Обображение всех вершин графа
    drawVertexes();
}

let findPathButton = document.getElementById("findPathButton");
let timeout = 10;

// Запуск генетического алгоритма
function getPath() {
    // Сброс работы алгоритма
    clearInterval(interval);
    interval = null;

    // Запуск работы алгоритма
    interval = setInterval(function() {
        // Обновление поля
        let ctx = canv.getContext('2d');
        ctx.reset();

        // Обображение всех вершин графа
        drawVertexes();

        // Проведение всех рёбер в графе 
        if (drawFullGraph) {
            drawLines();
        }
        
        // Вывод текущего решения
        let prevSolve = solves[0];

        solves = getSolves(vertexes, solves);
        showSolve(solves[0]);

        if (prevSolve !== solves[0]){
            iterations = 0;
        }

        iterations++;
    }, timeout);
}

// Перезапуск алгоритма нажатием кнопки Найти путь
findPathButton.addEventListener('click', (e) => {
    solves = [];
    iterations = 0;
    getPath();
});

let clearButton = document.getElementById("genetic-clearButton");

// Очистка поля
clearButton.addEventListener('click', (e) => {
    // Удаление вешин с поля
    iterations = 0;
    let ctx = canv.getContext('2d');
    ctx.reset();

    // Удаление вершин из массива
    vertexes = [];
    solves = [];

    // Завершение работы алгоритма
    clearInterval(interval);
    interval = null;
})

let inputRange = document.getElementById("genetic-inputRange");

// Изменение задержки работы алгоритма
inputRange.addEventListener('input', (e) => {
    inputRange.style.backgroundSize = (e.target.value - e.target.min) * 100 / (e.target.max - e.target.min) + '% 100%';

    let counter = document.getElementById("genetic-counter");
    counter.innerHTML = inputRange.value + "%";
    timeout = 510 - inputRange.value * 5;

    // Изменение скорости выполнения текущего запущенного алгоритма
    if (interval) {
        clearInterval(interval);
        interval = null;

        getPath();
    }
});