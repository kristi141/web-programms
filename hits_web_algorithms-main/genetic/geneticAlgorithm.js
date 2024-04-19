import { POPULATION, CHILDS, MUTPROB } from "./settings.js";

let vertexes = [];        // Массив вершин
var solves = [];          // Решения

// Генерация случайного решения
function getRandomSolve() {
    let size = vertexes.length;
    let solve = [];

    // Генерация упорядоченной перестановки
    for (let i = 0; i < size; i++) {
        solve.push(i);
    }

    // Перемешивание перестановки
    for (let j = 0; j < size; j++) {
        let ind = j + Math.floor(Math.random() * (size - j));

        let temp = solve[j];
        solve[j] = solve[ind];
        solve[ind] = temp;
    }

    return solve;
}

// Нахождение расстояния между вершинами
function getDistance(firstVertex, secondVertex) {
    return Math.sqrt(Math.pow(secondVertex.x - firstVertex.x, 2) + Math.pow(secondVertex.y - firstVertex.y, 2));
}

// Нахождение длины пути решения
function getPathDistance(solve) {
    let distance = 0;

    for (let i = 0; i < solve.length - 1; i++) {
        distance += getDistance(vertexes[solve[i]], vertexes[solve[i + 1]]);
    }

    distance += getDistance(vertexes[solve[0]], vertexes[solve[solve.length - 1]]);

    return distance;
}

// Мутирование
function mutate(child) {
    // Случайный выбор двух генов
    let firstGen = Math.floor(Math.random() * child.length);
    let secondGen = firstGen;

    while (secondGen === firstGen) {
        secondGen = Math.floor(Math.random() * child.length);
    }

    // Смена генов местами
    let temp = child[firstGen];
    child[firstGen] = child[secondGen];
    child[secondGen] = temp;

    return child;
}

// Скрешивание
function cross(firstParent, secondParent) {
    // Разделитель между генами первого и второго родителей
    let divider = Math.floor(Math.random() * firstParent.length);
    let child = [];

    // Гены, доставшиеся от первого родителя
    for (let i = 0; i < divider; i++) {
        child.push(firstParent[i]);
    }

    // Гены, доставшиеся от второго родителя после разделителя
    for (let j = divider; j < firstParent.length; j++) {
        if (!(child.includes(secondParent[j]))) {
            child.push(secondParent[j]);
        }
    }

    // Гены, доставшиеся от второго родителя до разделителя
    for (let k = 0; k < firstParent.length; k++) {
        if (!(child.includes(secondParent[k]))) {
            child.push(secondParent[k]);
        }
    }

    // Мутация ребёнка
    let probability = Math.random() * 100;

    if (probability < MUTPROB) {
        child = mutate(child);
    }

    return child;
}

// Сортировка решений в популяции по возрастанию длины их пути
function sortSolves(distances) {
    for (let i = 0; i < distances.length; i++) {
        for (let j = i + 1; j < distances.length; j++) {
            if (distances[i] > distances[j]) {
                let temp = solves[i];
                solves[i] = solves[j];
                solves[j] = temp;

                temp = distances[i];
                distances[i] = distances[j];
                distances[j] = temp;
            }
        }
    }
}

// Нахождение решений задачи коммивояжёра
export function getSolves(vertexArray, solvesArray) {
    //alert(POPULATION);

    vertexes = vertexArray;
    var distances = [];
    solves = solvesArray;
    
    // Проверка возможности построения пути
    if (vertexArray.length < 2) {
        return solvesArray;
    }

    // Генерация начальной популяции решений
    if (!solves.length) {
        for (let k = 0; k < POPULATION; k++) {
            solves.push(getRandomSolve());
        }
    }   

    // Случайный выбор родителей
    for (let c = 0; c < CHILDS; c++) {
        let firstParent = Math.floor(Math.random() * POPULATION);
        let secondParent = firstParent;

        while (secondParent === firstParent){
            secondParent = Math.floor(Math.random() * POPULATION);
        }

        // Скрещивание родителей
        solves.push(cross(solves[firstParent], solves[secondParent]));
    }

    // Нахождение приспособленности решений (длины пути)
    for (let b = 0; b < POPULATION + CHILDS; b++) {
        distances.push(getPathDistance(solves[b]));
    }

    // Сортировка решений по возрастанию длины их пути
    sortSolves(distances);

    // Удаление лишних решений из популяции
    for (let d = 0; d < CHILDS; d++) {
        solves.pop();
    }

    // Возврат лучшего решения
    return solves;
};