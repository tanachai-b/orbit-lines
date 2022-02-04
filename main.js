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







    let sunPos = new Point(0, 0, 0);

    let venusPos = new Point(100 * Math.cos(Math.PI * 0), 100 * Math.sin(Math.PI * 0), 0);
    let venusV = new Point(-1.32265 * Math.sin(Math.PI * 0), 1.32265 * Math.cos(Math.PI * 0), 0);
    let venusA = new Point(0, 0, 0);

    let earthPos = new Point(200 * Math.cos(Math.PI * 0 / 6), 200 * Math.sin(Math.PI * 0 / 6), 0);
    let earthV = new Point(-0.8658 * Math.sin(Math.PI * 0 / 6), 0.8658 * Math.cos(Math.PI * 0 / 6), 0);
    let earthA = new Point(0, 0, 0);

    let marsPos = new Point(400 * Math.cos(Math.PI * 0 / 6), 400 * Math.sin(Math.PI * 0 / 6), 0);
    let marsV = new Point(-0.5 * Math.sin(Math.PI * 0 / 6), 0.5 * Math.cos(Math.PI * 0 / 6), 0);
    let marsA = new Point(0, 0, 0);


    let shipPos = new Point(341.222498 * Math.cos(Math.PI * 0), 341.222498 * Math.sin(Math.PI * 0), 5);
    let shipV = new Point(-0.45 * Math.sin(Math.PI * 0), 0.45 * Math.cos(Math.PI * 0), 0);
    let shipA = new Point(0, 0, 0);




    let sun = sunPos.copy();

    let venus = venusPos.copy();
    let earth = earthPos.copy();
    let mars = marsPos.copy();
    // let ship = shipPos.copy();

    let venusPoses = [venusPos];
    let earthPoses = [earthPos];
    let marsPoses = [marsPos];
    // let shipPoses = [shipPos];

    let marsShipPoses = [];
    let marsVs = [marsV];


    let log = new Point(0, 0, 0);
    let logPoses = [];
    let log2 = new Point(0, 0, 0);
    let logPoses2 = [];
    let log3 = new Point(0, 0, 0);
    let logPoses3 = [];


    for (let i = 0; i < 5000; i++) {

        venusA = sunPos.minus(venusPos).over(Math.pow(sunPos.minus(venusPos).magnitude(), 3)).times(100);
        venusV = venusV.plus(venusA);
        venusPos = venusPos.plus(venusV);
        venusPoses.push(venusPos);

        earthA = sunPos.minus(earthPos).over(Math.pow(sunPos.minus(earthPos).magnitude(), 3)).times(100);
        earthV = earthV.plus(earthA);
        earthPos = earthPos.plus(earthV);
        earthPoses.push(earthPos);

        marsA = sunPos.minus(marsPos).over(Math.pow(sunPos.minus(marsPos).magnitude(), 3)).times(100);
        marsV = marsV.plus(marsA);
        marsPos = marsPos.plus(marsV);
        marsPoses.push(marsPos);

        // shipA = sunPos.minus(shipPos).unit().divide(Math.pow(sunPos.minus(shipPos).mag(), 2)).times(100);
        // // shipA = shipA.plus(venusPos.minus(shipPos).unit().divide(Math.pow(venusPos.minus(shipPos).mag(), 2)).times(1));
        // // shipA = shipA.plus(earthPos.minus(shipPos).unit().divide(Math.pow(earthPos.minus(shipPos).mag(), 2)).times(1));
        // shipA = shipA.plus(marsPos.minus(shipPos).unit().divide(Math.pow(marsPos.minus(shipPos).mag(), 2)).times(1));
        // shipV = shipV.plus(shipA);
        // shipPos = shipPos.plus(shipV);
        // shipPoses.push(shipPos);


        // let marsShipPos = shipPos.minus(marsPos);
        // marsShipPos = marsShipPos.dividePoint(marsPos.unit(), marsV);
        // marsShipPoses.push(marsShipPos);
        // marsVs.push(marsV);


        let logPos = new Point(venusV.magnitude() * venusPos.magnitude(), 0, 0);
        logPoses.push(logPos);
        let logPos2 = new Point(earthV.magnitude() * earthPos.magnitude(), 20, 0);
        logPoses2.push(logPos2);
        let logPos3 = new Point(marsV.magnitude() * marsPos.magnitude(), 40, 0);
        logPoses3.push(logPos3);
    }

    let venusTraj = new Line(venusPoses);
    let earthTraj = new Line(earthPoses);
    let marsTraj = new Line(marsPoses);
    // let shipTraj = new Line(shipPoses);

    // let marsShipTraj = new Line(marsShipPoses);









    let objs = [];




    // let box = [];
    // let size = 400;
    // for (let x = -size / 2; x <= size / 2; x += size) {
    //     for (let y = -size / 2; y <= size / 2; y += size) {
    //         for (let z = -size / 2; z <= size / 2; z += size) {
    //             box.push(new Point(x, y, z));
    //         }
    //     }
    // }
    // objs = objs.concat(box);






    objs.push(sun);

    objs.push(venus);
    objs.push(earth);
    objs.push(mars);
    // objs.push(ship);

    objs.push(venusTraj);
    objs.push(earthTraj);
    objs.push(marsTraj);


    // objs.push(shipTraj);
    // objs.push(marsShipTraj);

    objs.push(log);
    objs.push(log2);
    objs.push(log3);




    objs.push(new Complex(200, 100));
    objs.push(new Complex(200, 100).over(new Complex(10, 10)));



    let frame = 0;

    setInterval(() => {

        venus.set(venusPoses[frame]);
        earth.set(earthPoses[frame]);
        mars.set(marsPoses[frame]);
        // ship.set(shipPoses[frame]);


        // let cadiz = [];
        // for (let i = 0; i < marsShipPoses.length; i++) {
        //     // cadiz.push(marsShipPoses[i].plus(marsPoses[frame]));
        //     cadiz.push(marsShipPoses[i].timesPoint(marsPoses[frame].unit(), marsVs[frame]).plus(marsPoses[frame]));
        // }
        // marsShipTraj.set(cadiz);

        log.set(logPoses[frame]);
        log2.set(logPoses2[frame]);
        log3.set(logPoses3[frame]);

        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        objs.forEach((obj) => {
            obj.draw(ra, rb, rc);
        });

        frame += 10;
        frame %= 5000;
    }, 10);
}

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

    draw(ra, rb, rc) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        let complex = Complex.get2dPoint(new Point(this.x, this.y, 0), ra, rb, rc);

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(complex.x, complex.y, 5, 0, 2 * Math.PI);
        ctx.stroke();
    }

    static get2dPoint(point, ra, rb, rc) {

        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');

        let x1 = point.x * Math.cos(ra) - point.y * Math.sin(ra);
        let y1 = point.y * Math.cos(ra) + point.x * Math.sin(ra);
        let z1 = point.z;

        let x2 = x1;
        let y2 = y1 * Math.cos(rb) + z1 * Math.sin(rb);
        let z2 = z1 * Math.cos(rb) - y1 * Math.sin(rb);

        let calcX = (x2 / Math.max(y2 + 1000, 0)) * 1000 + canvas.width / 2;
        let calcY = -(z2 / Math.max(y2 + 1000, 0)) * 1000 + canvas.height / 2;

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

        return new Point(xx3, yy3, zz3).times(pointA.mag());
    }

    dividePoint(pointA, pointB) {

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

        return new Point(xx3, yy3, zz3).over(pointA.mag());
    }

    copy() { return new Point(this.x, this.y, this.z); }

    set(point) {
        this.x = point.x;
        this.y = point.y;
        this.z = point.z;
    }

    draw(ra, rb, rc) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        let complex = Complex.get2dPoint(this, ra, rb, rc);

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(complex.x, complex.y, 5, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

class Line {
    constructor(points) {
        this.points = points;
    }

    set(points) {
        this.points = points;
    }

    draw(ra, rb, rc) {

        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        for (let i = 0; i < this.points.length - 1; i++) {

            let complexA = Complex.get2dPoint(this.points[i], ra, rb, rc);
            let complexB = Complex.get2dPoint(this.points[i + 1], ra, rb, rc);

            ctx.beginPath();
            ctx.moveTo(complexA.x, complexA.y);
            ctx.lineTo(complexB.x, complexB.y);
            ctx.stroke();
        }
    }
}
