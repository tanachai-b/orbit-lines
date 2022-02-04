'use strict';

class Complex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    magnitude() { return Math.hypot(this.x, this.y) }

    unit() { return new Complex(this.x / this.magnitude(), this.y / this.magnitude()); }

    conjugate() { return new Complex(this.x, -this.y); }

    plus(complex) { return new Complex(this.x + complex.x, this.y + complex.y); }

    minus(complex) { return new Complex(this.x - complex.x, this.y - complex.y); }

    times(complex) { return new Complex(this.x * complex.x - this.y * complex.y, this.x * complex.y + this.y * complex.x); }

    over(complex) { return this.times(complex.conjugate()).times(new Complex(1 / complex.magnitude() / complex.magnitude(), 0)); }

    draw(camera) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        let complex = Complex.projectFrom3d(new Vector(this.x, this.y, 0), camera);

        ctx.beginPath();
        ctx.arc(complex.x, complex.y, 5, 0, 2 * Math.PI);
        ctx.stroke();
    }

    static projectFrom3d(point, camera) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');

        let x0 = point.x - camera.position.x;
        let y0 = point.y - camera.position.y;
        let z0 = point.z - camera.position.z;

        let x1 = x0 * Math.cos(camera.yaw) - y0 * Math.sin(camera.yaw);
        let y1 = y0 * Math.cos(camera.yaw) + x0 * Math.sin(camera.yaw);
        let z1 = z0;

        let x2 = x1;
        let y2 = y1 * Math.cos(camera.pitch) + z1 * Math.sin(camera.pitch);
        let z2 = z1 * Math.cos(camera.pitch) - y1 * Math.sin(camera.pitch);

        let calcX = (x2 / Math.max(y2 + 1000 * 1.001 ** camera.zoom, 0)) * 1000 + canvas.width / 2;
        let calcY = -(z2 / Math.max(y2 + 1000 * 1.001 ** camera.zoom, 0)) * 1000 + canvas.height / 2;

        return new Complex(calcX, calcY);
    }
}

class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    magnitude() { return Math.hypot(this.x, this.y, this.z); }

    unit() { return this.over(this.magnitude()); }

    conjugate() { return new Vector(this.x, -this.y, -this.x); }

    plus(vector) { return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z); }

    minus(vector) { return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z); }

    times(number) { return new Vector(this.x * number, this.y * number, this.z * number); }

    over(number) { return new Vector(this.x / number, this.y / number, this.z / number); }

    timesVector(pointA, pointB) {

        let yaw = Math.atan2(pointA.y, pointA.x);

        let x1 = pointA.x * Math.cos(-yaw) - pointA.y * Math.sin(-yaw);
        let y1 = pointA.y * Math.cos(-yaw) + pointA.x * Math.sin(-yaw);
        let z1 = pointA.z;

        let pitch = Math.atan2(z1, x1);


        let x3 = pointB.x * Math.cos(-yaw) - pointB.y * Math.sin(-yaw);
        let y3 = pointB.y * Math.cos(-yaw) + pointB.x * Math.sin(-yaw);
        let z3 = pointB.z;

        let x4 = x3 * Math.cos(-pitch) - z3 * Math.sin(-pitch);
        let y4 = y3;
        let z4 = z3 * Math.cos(-pitch) + x3 * Math.sin(-pitch);

        let roll = Math.atan2(z4, y4);


        let xx1 = this.x;
        let yy1 = this.y * Math.cos(roll) - this.z * Math.sin(roll);
        let zz1 = this.z * Math.cos(roll) + this.y * Math.sin(roll);

        let xx2 = xx1 * Math.cos(pitch) - zz1 * Math.sin(pitch);
        let yy2 = yy1;
        let zz2 = zz1 * Math.cos(pitch) + xx1 * Math.sin(pitch);

        let xx3 = xx2 * Math.cos(yaw) - yy2 * Math.sin(yaw);
        let yy3 = yy2 * Math.cos(yaw) + xx2 * Math.sin(yaw);
        let zz3 = zz2;

        return new Vector(xx3, yy3, zz3).times(pointA.magnitude());
    }

    overVector(pointA, pointB) {

        let yaw = Math.atan2(pointA.y, pointA.x);

        let x1 = pointA.x * Math.cos(-yaw) - pointA.y * Math.sin(-yaw);
        let y1 = pointA.y * Math.cos(-yaw) + pointA.x * Math.sin(-yaw);
        let z1 = pointA.z;

        let pitch = Math.atan2(z1, x1);


        let x3 = pointB.x * Math.cos(-yaw) - pointB.y * Math.sin(-yaw);
        let y3 = pointB.y * Math.cos(-yaw) + pointB.x * Math.sin(-yaw);
        let z3 = pointB.z;

        let x4 = x3 * Math.cos(-pitch) - z3 * Math.sin(-pitch);
        let y4 = y3;
        let z4 = z3 * Math.cos(-pitch) + x3 * Math.sin(-pitch);

        let roll = Math.atan2(z4, y4);


        let xx1 = this.x * Math.cos(-yaw) - this.y * Math.sin(-yaw);
        let yy1 = this.y * Math.cos(-yaw) + this.x * Math.sin(-yaw);
        let zz1 = this.z;

        let xx2 = xx1 * Math.cos(-pitch) - zz1 * Math.sin(-pitch);
        let yy2 = yy1;
        let zz2 = zz1 * Math.cos(-pitch) + xx1 * Math.sin(-pitch);

        let xx3 = xx2;
        let yy3 = yy2 * Math.cos(-roll) - zz2 * Math.sin(-roll);
        let zz3 = zz2 * Math.cos(-roll) + yy2 * Math.sin(-roll);

        return new Vector(xx3, yy3, zz3).over(pointA.magnitude());
    }

    draw(camera) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        let complex = Complex.projectFrom3d(this, camera);

        ctx.beginPath();
        ctx.arc(complex.x, complex.y, 5, 0, 2 * Math.PI);
        ctx.stroke();
    }
}