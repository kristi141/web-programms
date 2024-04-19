export { kMeans };
import { Point } from "./pointClass.js";
import { pointCoordinates, nowDistance } from "./main.js";

const MAXVALUE = 100000000;

function findDistance(point1, point2) {
    if (nowDistance === 2) { 
        return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
    }
    
    else if (nowDistance === 3){
        return Math.max(Math.abs(point1.x - point2.x), Math.abs(point1.y - point2.y));
    }

    else {
        let x = point1.x - point2.x;
        let y = point1.y - point2.y;
        return Math.sqrt(x * x + y * y);
    }
}

function generateStartCentroids(countClusters) {
    //Выбрать первый центроид из точек рандомно
    let centroids = [pointCoordinates[Math.floor(Math.random() * pointCoordinates.length)]];

    // Выбрать оставшиеся центроиды с помощью алгоритма Kmeans++
    for (let i = 1; i < countClusters; i++) {
        let distances = new Array(pointCoordinates.length);
        let sum = 0;

        for (let j = 0; j < pointCoordinates.length; j++) {
            let point = pointCoordinates[j];
            let minDistance = MAXVALUE;

            for (let k = 0; k < centroids.length; k++) {
                let distance = findDistance(point, centroids[k]); //считаем расстояние между точкой и центроидом
                minDistance = Math.min(minDistance, distance);
            }
            distances[j] = minDistance;
            sum += minDistance;
        }

        //выбираем случайное число из диапазона суммы
        let rand = Math.random() * sum;
        sum = 0;
        let nextCentroid;
        for (let j = 0; j < pointCoordinates.length; j++) {
            sum += distances[j];
            if (sum >= rand) {
                nextCentroid = pointCoordinates[j];
                break;
            }
        }
        centroids.push(nextCentroid);
    }
    return centroids;
}

function updateCentroids(centroids, clusters) { 
    let newCentroids = [];
    for (let i = 0; i < clusters.length; i++) {
        let cluster = clusters[i];
        if (cluster.length === 0) {
            newCentroids.push(centroids[i]);
        } else {
            let sumX = 0;
            let sumY = 0;
            for (let j = 0; j < cluster.length; j++) {
                sumX += cluster[j].x;
                sumY += cluster[j].y;
            }
            newCentroids.push(new Point(sumX / cluster.length, sumY / cluster.length));
        }
    }
    return newCentroids;
}


function getPointsToNearestCentroids (centroids, clusters) { 
    for (let i = 0; i < pointCoordinates.length; i++) {

        let point = pointCoordinates[i];
        let minDistance = MAXVALUE;
        let closestCentroid;

        for (let j = 0; j < centroids.length; j++) {
            let distance = findDistance(point, centroids[j]);

            if (distance < minDistance) {
                minDistance = distance;
                closestCentroid = centroids[j];
            }
        }

        clusters[centroids.indexOf(closestCentroid)].push(point);
    }
}


function kMeans(countClusters) {
    let clusters = new Array(countClusters).fill().map(() => []);
    let centroids = generateStartCentroids(countClusters);
    let converged = false;

    while (!converged) {
        //Очистка массивов кластеров
        for (let i = 0; i < clusters.length; i++) {
            clusters[i] = [];
        }
        //Назначение точек к ближайшим центроидам
        getPointsToNearestCentroids(centroids, clusters);
        //Обновление координат центроидов
        let newCentroids = updateCentroids(centroids, clusters);
        //Проверка сходимости
        converged = true;
        for (let i = 0; i < centroids.length; i++) {
            if (findDistance(centroids[i], newCentroids[i]) > 0.001) {
                converged = false;
                break;
            }
        }
        //Обновление координат центроидов
        centroids = newCentroids;
    }
    return { clusters: clusters, centroids: centroids};
}
