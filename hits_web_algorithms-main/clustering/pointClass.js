import { ctx, ctx2, ctx3 } from "./main.js";

export class Point {

    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    drawAndCopy(color = 'rgb(0, 0, 0)', radiusOffset = 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + radiusOffset, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        ctx2.beginPath();
        ctx2.arc(this.x, this.y, this.radius + radiusOffset, 0, Math.PI * 2);
        ctx2.closePath();
        ctx2.fillStyle = color;
        ctx2.fill();

        ctx3.beginPath();
        ctx3.arc(this.x, this.y, this.radius + radiusOffset, 0, Math.PI * 2);
        ctx3.closePath();
        ctx3.fillStyle = color;
        ctx3.fill();
    }

    drawKMeans(color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    drawDBSCAN(color) {
        ctx2.beginPath();
        ctx2.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx2.closePath();
        ctx2.fillStyle = color;
        ctx2.fill();
    }

    drawHierarchical(color) {
        ctx3.beginPath();
        ctx3.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx3.closePath();
        ctx3.fillStyle = color;
        ctx3.fill();
    }
}