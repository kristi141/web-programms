import { drawer, startDrawing, stopDrawing, getAllPointsBlack, returnToOriginalStage, changeAddButton, changeDeleteButton, startAllAlgorithms, resetSolve} from "./drawFunctions.js";
export { pointCoordinates, ctx, ctx2, ctx3, canvasKMeans };

export let nowButton = 1;
changeAddButton();
export let nowDistance = 1;
export let countClusters = 3;
export let countClustersHierarchical = 3;
export let searchRadius = 26;
export let pointsCount = 4;

const canvasKMeans = document.getElementById('canvasKMeans');
const ctx = canvasKMeans.getContext('2d');
const canvasDBSCAN = document.getElementById('canvasDBSCAN');
const ctx2 = canvasDBSCAN.getContext('2d');
const canvas3 = document.getElementById('canvas3');
const ctx3 = canvas3.getContext('2d');

document.getElementById('rangeValue').textContent = "Количество кластеров: 3";
document.getElementById('radiusValue').textContent = "Радиус поиска точек: 26";
document.getElementById('pointsValue').textContent = "Количество точек в округе: 4";
document.getElementById('rangeValueHierarchical').textContent = "Количество кластеров: 3";

canvasKMeans.width = 400;
canvasKMeans.height = 400;

canvasDBSCAN.width = 400;
canvasDBSCAN.height = 400;

canvas3.width = 400;
canvas3.height = 400;

let pointCoordinates = [];

document.getElementById('canvasKMeans').addEventListener('click', (e) => { drawer(e) });
document.getElementById('canvas3').addEventListener('click', (e) => { drawer(e) });
document.getElementById('canvasDBSCAN').addEventListener('click', (e) => { drawer(e) });

function handleRange(parameter) {
    const numberInput = document.getElementById(parameter);
    const number = parseInt(numberInput.value);
    if (isNaN(number)) {
        alert("Ты дурак? Введи норм число");
        return;
    }
    if (parameter === 'rangeKMeans') { 
        countClusters = number;
    }
    else if (parameter === 'rangeRadius'){
        searchRadius = number;
    }
    else if (parameter === 'rangePoints') { 
        pointsCount = number;
    }
    else if (parameter === 'rangeHierarchical') {
        countClustersHierarchical = number;
    }
}

document.getElementById('startAlgorithms').addEventListener('click', (e) => {
    nowButton = 0;
    returnToOriginalStage();
    startAllAlgorithms();
});


document.getElementById('rangeKMeans').addEventListener('input', (e) => {
    handleRange('rangeKMeans');
    rangeKMeans.style.backgroundSize = (e.target.value - e.target.min) * 100 / (e.target.max - e.target.min) + '% 100%';
    document.getElementById('rangeValue').textContent = "Количество кластеров: " + document.getElementById('rangeKMeans').value;
});

document.getElementById('rangeRadius').addEventListener('input', (e) => {
    handleRange('rangeRadius');
    rangeRadius.style.backgroundSize = (e.target.value - e.target.min) * 100 / (e.target.max - e.target.min) + '% 100%';
    document.getElementById('radiusValue').textContent = "Радиус поиска точек: " + document.getElementById('rangeRadius').value;
});

document.getElementById('rangePoints').addEventListener('input', (e) => {
    handleRange('rangePoints');
    rangePoints.style.backgroundSize = (e.target.value - e.target.min) * 100 / (e.target.max - e.target.min) + '% 100%';
    document.getElementById('pointsValue').textContent = "Количество точек в округе: " + document.getElementById('rangePoints').value;
});

document.getElementById('rangeHierarchical').addEventListener('input', (e) => {
    handleRange('rangeHierarchical');
    rangeHierarchical.style.backgroundSize = (e.target.value - e.target.min) * 100 / (e.target.max - e.target.min) + '% 100%';
    document.getElementById('rangeValueHierarchical').textContent = "Количество кластеров: " + document.getElementById('rangeHierarchical').value;
});

document.getElementById('doAllPointsBlack').addEventListener('click', (e) => {
    nowButton = 0;
    returnToOriginalStage();
    getAllPointsBlack();
});


document.getElementById('addPointButton').addEventListener('click', (e) => {
    if (nowButton === 0 || nowButton === 2) {
        nowButton = 1;
        changeAddButton();
    }
    else if (nowButton === 1) {
        nowButton = 0;
        returnToOriginalStage();
    }
});

document.getElementById('removePointButton').addEventListener('click', (e) => {
    if (nowButton === 0 || nowButton === 1) {
        nowButton = 2;
        changeDeleteButton();
    }
    else if (nowButton === 2) {
        nowButton = 0;
        returnToOriginalStage();
    }
});

document.getElementById('clearButton').addEventListener('click', () => {
    nowButton = 0;
    returnToOriginalStage();
    ctx.reset();
    ctx2.reset();
    ctx3.reset();
    pointCoordinates = [];
});

document.getElementById('distanceBox').addEventListener('change', (event) => {
    nowDistance = parseInt(event.target.value);
});


document.getElementById('canvasKMeans').addEventListener('mousedown', startDrawing);
document.getElementById('canvasKMeans').addEventListener('mouseup', stopDrawing);
document.getElementById('canvasKMeans').addEventListener('mouseleave', stopDrawing);

document.getElementById('canvas3').addEventListener('mousedown', startDrawing);
document.getElementById('canvas3').addEventListener('mouseup', stopDrawing);
document.getElementById('canvas3').addEventListener('mouseleave', stopDrawing);

document.getElementById('canvasDBSCAN').addEventListener('mousedown', startDrawing);
document.getElementById('canvasDBSCAN').addEventListener('mouseup', stopDrawing);
document.getElementById('canvasDBSCAN').addEventListener('mouseleave', stopDrawing);