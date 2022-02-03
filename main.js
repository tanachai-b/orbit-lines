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
    let venusV = new Point(-1 * Math.sin(Math.PI * 0), 1 * Math.cos(Math.PI * 0), 0);
    let venusA = new Point(0, 0, 0);

    let earthPos = new Point(200 * Math.cos(Math.PI * 2 / 6), 200 * Math.sin(Math.PI * 2 / 6), 0);
    let earthV = new Point(-0.7 * Math.sin(Math.PI * 2 / 6), 0.7 * Math.cos(Math.PI * 2 / 6), 0);
    let earthA = new Point(0, 0, 0);

    let marsPos = new Point(400 * Math.cos(Math.PI * -5 / 6), 400 * Math.sin(Math.PI * -5 / 6), 0);
    let marsV = new Point(-0.5 * Math.sin(Math.PI * -5 / 6), 0.5 * Math.cos(Math.PI * -5 / 6), 0);
    let marsA = new Point(0, 0, 0);


    let shipPos = new Point(110 * Math.cos(Math.PI * 0), 110 * Math.sin(Math.PI * 0), 0);
    let shipV = new Point(-1.4 * Math.sin(Math.PI * 0), 1.4 * Math.cos(Math.PI * 0), 0);
    let shipA = new Point(0, 0, 0);




    let sun = sunPos.copy();

    let venus = venusPos.copy();
    let earth = earthPos.copy();
    let mars = marsPos.copy();
    let ship = shipPos.copy();

    let venusPoses = [venusPos];
    let earthPoses = [earthPos];
    let marsPoses = [marsPos];
    let shipPoses = [shipPos];


    for (let i = 0; i < 5000; i++) {

        venusA = sunPos.minus(venusPos).unit().divide(Math.pow(sunPos.minus(venusPos).mag(), 2)).times(100);
        venusV = venusV.plus(venusA);
        venusPos = venusPos.plus(venusV);
        venusPoses.push(venusPos);

        earthA = sunPos.minus(earthPos).unit().divide(Math.pow(sunPos.minus(earthPos).mag(), 2)).times(100);
        earthV = earthV.plus(earthA);
        earthPos = earthPos.plus(earthV);
        earthPoses.push(earthPos);

        marsA = sunPos.minus(marsPos).unit().divide(Math.pow(sunPos.minus(marsPos).mag(), 2)).times(100);
        marsV = marsV.plus(marsA);
        marsPos = marsPos.plus(marsV);
        marsPoses.push(marsPos);

        shipA = sunPos.minus(shipPos).unit().divide(Math.pow(sunPos.minus(shipPos).mag(), 2)).times(100);
        shipA = shipA.plus(venusPos.minus(shipPos).unit().divide(Math.pow(venusPos.minus(shipPos).mag(), 2)).times(1));
        shipA = shipA.plus(marsPos.minus(shipPos).unit().divide(Math.pow(marsPos.minus(shipPos).mag(), 2)).times(1));
        shipA = shipA.plus(earthPos.minus(shipPos).unit().divide(Math.pow(earthPos.minus(shipPos).mag(), 2)).times(1));
        shipV = shipV.plus(shipA);
        shipPos = shipPos.plus(shipV);
        shipPoses.push(shipPos);
    }

    let venusTraj = new Line(venusPoses);
    let earthTraj = new Line(earthPoses);
    let marsTraj = new Line(marsPoses);
    let shipTraj = new Line(shipPoses);





    let marsShipPoses = [];

    for (let i = 0; i < marsPoses.length; i++) {
        let marsShipPos = shipPoses[i].minus(marsPoses[i]);
        marsShipPoses.push(marsShipPos);
    }

    let marsShipTraj = new Line(marsShipPoses);











    let objs = [];

    let frame = [];
    let size = 800;
    for (let x = -size / 2; x <= size / 2; x += size) {
        for (let y = -size / 2; y <= size / 2; y += size) {
            for (let z = -size / 2; z <= size / 2; z += size) {
                frame.push(new Point(x, y, z));
            }
        }
    }
    // objs = objs.concat(frame);









    objs.push(sun);

    objs.push(venus);
    objs.push(earth);
    objs.push(mars);
    objs.push(ship);

    objs.push(venusTraj);
    objs.push(earthTraj);
    objs.push(marsTraj);
    objs.push(shipTraj);


    // objs.push(marsShipTraj);








    frame = 0;

    setInterval(() => {

        venus.set(venusPoses[frame]);
        earth.set(earthPoses[frame]);
        mars.set(marsPoses[frame]);
        ship.set(shipPoses[frame]);


        let cadiz = [];
        for (let i = 0; i < marsShipPoses.length; i++) {
            cadiz.push(marsShipPoses[i].plus(marsPoses[frame]));
        }
        marsShipTraj.set(cadiz);


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

class Point2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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

        let calcX = (x2 / (y2 + 1000)) * 1000 + canvas.width / 2;
        let calcY = -(z2 / (y2 + 1000)) * 1000 + canvas.height / 2;

        return new Point2d(calcX, calcY);
    }
}

class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }


    copy() {
        return new Point(this.x, this.y, this.z);
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    times(number) {
        return new Point(this.x * number, this.y * number, this.z * number);
    }

    divide(number) {
        return new Point(this.x / number, this.y / number, this.z / number);
    }

    unit() {
        return this.divide(this.mag());
    }

    plus(point) {
        return new Point(this.x + point.x, this.y + point.y, this.z + point.z);
    }

    minus(point) {
        return new Point(this.x - point.x, this.y - point.y, this.z - point.z);
    }


    set(point) {
        this.x = point.x;
        this.y = point.y;
        this.z = point.z;
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

            let point2dA = Point2d.get2dPoint(this.points[i], ra, rb, rc);
            let point2dB = Point2d.get2dPoint(this.points[i + 1], ra, rb, rc);

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
}
