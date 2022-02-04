
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

    copy() { return new Complex(this.x, this.y); }

    draw(camera) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        let complex = Complex.get2dPoint(new Point(this.x, this.y, 0), camera);

        ctx.beginPath();
        ctx.arc(complex.x, complex.y, 5, 0, 2 * Math.PI);
        ctx.stroke();
    }

    static get2dPoint(point, camera) {

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

class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    magnitude() { return Math.hypot(this.x, this.y, this.z); }

    unit() { return this.over(this.magnitude()); }

    conjugate() { return new Point(this.x, -this.y, -this.x); }

    plus(point) { return new Point(this.x + point.x, this.y + point.y, this.z + point.z); }

    minus(point) { return new Point(this.x - point.x, this.y - point.y, this.z - point.z); }

    times(number) { return new Point(this.x * number, this.y * number, this.z * number); }

    over(number) { return new Point(this.x / number, this.y / number, this.z / number); }

    timesPoint(pointA, pointB) {

        let ra = Math.atan2(pointA.y, pointA.x);

        let x1 = pointA.x * Math.cos(-ra) - pointA.y * Math.sin(-ra);
        let y1 = pointA.y * Math.cos(-ra) + pointA.x * Math.sin(-ra);
        let z1 = pointA.z;

        let rb = Math.atan2(z1, x1);


        let x3 = pointB.x * Math.cos(-ra) - pointB.y * Math.sin(-ra);
        let y3 = pointB.y * Math.cos(-ra) + pointB.x * Math.sin(-ra);
        let z3 = pointB.z;

        let x4 = x3 * Math.cos(-rb) - z3 * Math.sin(-rb);
        let y4 = y3;
        let z4 = z3 * Math.cos(-rb) + x3 * Math.sin(-rb);

        let rc = Math.atan2(z4, y4);


        let xx1 = this.x;
        let yy1 = this.y * Math.cos(rc) - this.z * Math.sin(rc);
        let zz1 = this.z * Math.cos(rc) + this.y * Math.sin(rc);

        let xx2 = xx1 * Math.cos(rb) - zz1 * Math.sin(rb);
        let yy2 = yy1;
        let zz2 = zz1 * Math.cos(rb) + xx1 * Math.sin(rb);

        let xx3 = xx2 * Math.cos(ra) - yy2 * Math.sin(ra);
        let yy3 = yy2 * Math.cos(ra) + xx2 * Math.sin(ra);
        let zz3 = zz2;

        return new Point(xx3, yy3, zz3).times(pointA.magnitude());
    }

    overPoint(pointA, pointB) {

        let ra = Math.atan2(pointA.y, pointA.x);

        let x1 = pointA.x * Math.cos(-ra) - pointA.y * Math.sin(-ra);
        let y1 = pointA.y * Math.cos(-ra) + pointA.x * Math.sin(-ra);
        let z1 = pointA.z;

        let rb = Math.atan2(z1, x1);


        let x3 = pointB.x * Math.cos(-ra) - pointB.y * Math.sin(-ra);
        let y3 = pointB.y * Math.cos(-ra) + pointB.x * Math.sin(-ra);
        let z3 = pointB.z;

        let x4 = x3 * Math.cos(-rb) - z3 * Math.sin(-rb);
        let y4 = y3;
        let z4 = z3 * Math.cos(-rb) + x3 * Math.sin(-rb);

        let rc = Math.atan2(z4, y4);


        let xx1 = this.x * Math.cos(-ra) - this.y * Math.sin(-ra);
        let yy1 = this.y * Math.cos(-ra) + this.x * Math.sin(-ra);
        let zz1 = this.z;

        let xx2 = xx1 * Math.cos(-rb) - zz1 * Math.sin(-rb);
        let yy2 = yy1;
        let zz2 = zz1 * Math.cos(-rb) + xx1 * Math.sin(-rb);

        let xx3 = xx2;
        let yy3 = yy2 * Math.cos(-rc) - zz2 * Math.sin(-rc);
        let zz3 = zz2 * Math.cos(-rc) + yy2 * Math.sin(-rc);

        return new Point(xx3, yy3, zz3).over(pointA.magnitude());
    }

    copy() { return new Point(this.x, this.y, this.z); }

    set(point) {
        this.x = point.x;
        this.y = point.y;
        this.z = point.z;
    }

    draw(camera) {

        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        let complex = Complex.get2dPoint(this, camera);

        ctx.beginPath();
        ctx.arc(complex.x, complex.y, 5, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

class Line {
    constructor(points) {
        this.points = points;
    }

    set(points) { this.points = points; }

    draw(camera) {

        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        for (let i = 0; i < this.points.length - 1; i++) {

            let complexA = Complex.get2dPoint(this.points[i], camera);
            let complexB = Complex.get2dPoint(this.points[i + 1], camera);

            ctx.beginPath();
            ctx.moveTo(complexA.x, complexA.y);
            ctx.lineTo(complexB.x, complexB.y);
            ctx.stroke();
        }
    }
}
