import {weights, biases } from "./weights.js"

// Сигмоида
function sigmoid(x) {
    return 1 / (1 + Math.exp( -x ));
}

// умножение матриц
function matrixMultiplication(a, b) {
    let result = Array(a.length)
    for (let i = 0; i < a.length; i++) {
        let sum = 0;
        for (let j = 0; j < a[0].length; j++) {
            sum += a[i][j] * b[j]
        }
        result[i] = sum;
    }
    return result;
}

// сложение матриц
function matrixAddition(a, b) {
    let result = Array(a.length)
    for (let i = 0; i < a.length; i++) {
        result[i] = sigmoid(a[i] + b[i][0]);
    }
    return result;
}

export function feedforward(matrix) {
    for (let k = 0; k < biases.length; k++) {
        matrix = matrixAddition(matrixMultiplication(weights[k], matrix), biases[k]);
    }
    return matrix;
}