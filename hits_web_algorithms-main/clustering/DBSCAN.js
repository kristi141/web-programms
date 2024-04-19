export { dbscan };
import { nowDistance } from "./main.js";

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

function findNeighbors(point, pointCoordinates, eps) { 
    let neighbors = [];

    for (let i = 0; i < pointCoordinates.length; i++) { 
        if (point === pointCoordinates[i]) {
            continue;
        }
        let distance = findDistance(point, pointCoordinates[i]);
        if (distance < eps) {
            neighbors.push(pointCoordinates[i]);
        }
    }
    return neighbors;
}

function dbscan(pointCoordinates, eps, minPoints) {
    let clusters = [];
    let visited = new Set();
    let noise = new Set();

    for (let i = 0; i < pointCoordinates.length; i++) { 
        const nowPoint = pointCoordinates[i];
        if (visited.has(nowPoint)){
            continue;
        }

        visited.add(nowPoint);
        const neighbors = findNeighbors(nowPoint, pointCoordinates, eps);

        if (neighbors.length < minPoints) { 
            noise.add(nowPoint);
            continue;
        }
        const cluster = [nowPoint];
        clusters.push(cluster);

        let checks = new Set(neighbors);
        while (checks.size > 0) { 
            const checkPoint = checks.values().next().value;
            visited.add(checkPoint);

            const checkPointNeighbors = findNeighbors(checkPoint, pointCoordinates, eps);

            if (checkPointNeighbors.length >= minPoints){
                checkPointNeighbors.forEach(j =>{
                    if (!visited.has(j)) {
                        checks.add(j);
                        visited.add(j);
                    }
                });
            }

            if (!noise.has(checkPoint)) {
                cluster.push(checkPoint);
            }
            checks.delete(checkPoint);
        }
    }
    return clusters;
}