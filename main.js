'use strict';

function main() {

    let ra = 0 - Math.PI / 6;
    let rb = 0 - Math.PI / 6;
    let rc = 0;

    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById('canvas');

    let mButtons = 0;
    canvas.addEventListener('mousedown', (event) => { mButtons = event.buttons; });
    canvas.addEventListener('mouseup', (event) => { mButtons = event.buttons; });
    canvas.addEventListener('mouseleave', (event) => { mButtons = event.buttons; });
    canvas.addEventListener('mouseenter', (event) => { mButtons = event.buttons; });
    canvas.addEventListener('mousemove', (event) => {
        if (mButtons == 1) {
            ra += event.movementX / 200;
            rb -= event.movementY / 200;
        };
    });

    let objs = [];

    let cadiz = [];
    let size = 800;
    for (let x = -size / 2; x <= size / 2; x += size) {
        for (let y = -size / 2; y <= size / 2; y += size) {
            for (let z = -size / 2; z <= size / 2; z += size) {
                cadiz.push(new Point(x, y, z));
            }
        }
    }

    let sun = new Point(0, 0, 0);
    let earth = new Point(1000, 0, 0);

    let line = new Line(new Point(0, 0, 0), new Point(100, 0, 0));

    objs = objs.concat(cadiz);
    objs.push(sun,earth,line);

console.log(objs);

    setInterval(() => {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        objs.forEach((obj) => {
            obj.draw(ra, rb, rc);
        });

        // sun.draw(ra,rb,rc);
        // earth.draw(ra,rb,rc);

        // line.draw(ra, rb, rc);
    }, 10);
}

class Point2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static get2dPoint(point, ra, rb, rc) {

        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');

        let x1 = point.x * Math.cos(ra) - point.z * Math.sin(ra);
        let y1 = point.y;
        let z1 = point.z * Math.cos(ra) + point.x * Math.sin(ra);

        let x2 = x1;
        let y2 = y1 * Math.cos(rb) - z1 * Math.sin(rb);
        let z2 = z1 * Math.cos(rb) + y1 * Math.sin(rb);

        let calcX = Math.atan2(x2, (z2 + 1000)) * 1000 + canvas.width / 2;
        let calcY = -Math.atan2(y2, (z2 + 1000)) * 1000 + canvas.height / 2;

        return new Point2d(calcX, calcY);
    }
}

class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    draw(ra, rb, rc) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        let point2d = Point2d.get2dPoint(this, ra, rb, rc);

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(point2d.x, point2d.y, 5, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

class Line {
    constructor(pointA, pointB) {
        this.pointA = pointA;
        this.pointB = pointB;
    }

    draw(ra, rb, rc) {

        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        let point2dA = Point2d.get2dPoint(this.pointA, ra, rb, rc);
        let point2dB = Point2d.get2dPoint(this.pointB, ra, rb, rc);

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        // ctx.beginPath();
        // ctx.arc(point2dA.x, point2dA.y, 5, 0, 2 * Math.PI);
        // ctx.stroke();

        // ctx.beginPath();
        // ctx.arc(point2dB.x, point2dB.y, 5, 0, 2 * Math.PI);
        // ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(point2dA.x, point2dA.y);
        ctx.lineTo(point2dB.x, point2dB.y);
        ctx.stroke();
    }
}
