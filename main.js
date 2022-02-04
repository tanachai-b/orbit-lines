'use strict';


class celestial {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }
}

function main() {

    let camera = new Camera();

    addMouseListener((event) => {
        camera.yaw += event.movementX / 200;
        camera.pitch -= event.movementY / 200;
    }, (event) => {
        camera.zoom += event.deltaY;
    });




    let xsun = new celestial(new Point(0, 0, 0), new Point(0, 0, 0));


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

    let venusPoses = [venusPos];
    let earthPoses = [earthPos];
    let marsPoses = [marsPos];



    for (let i = 0; i < 5000; i++) {

        venusA = sunPos.minus(venusPos).over(sunPos.minus(venusPos).magnitude() ** 3).times(100);
        venusV = venusV.plus(venusA);
        venusPos = venusPos.plus(venusV);
        venusPoses.push(venusPos);

        earthA = sunPos.minus(earthPos).over(sunPos.minus(earthPos).magnitude() ** 3).times(100);
        earthV = earthV.plus(earthA);
        earthPos = earthPos.plus(earthV);
        earthPoses.push(earthPos);

        marsA = sunPos.minus(marsPos).over(sunPos.minus(marsPos).magnitude() ** 3).times(100);
        marsV = marsV.plus(marsA);
        marsPos = marsPos.plus(marsV);
        marsPoses.push(marsPos);
    }

        
    let venusTraj = new Line(venusPoses);
    let earthTraj = new Line(earthPoses);
    let marsTraj = new Line(marsPoses);






    let objs = [];




    objs.push(sun);

    objs.push(venus);
    objs.push(earth);
    objs.push(mars);

    objs.push(venusTraj);
    objs.push(earthTraj);
    objs.push(marsTraj);




    camera.position = venus;

    let frame = 0;
    setInterval(() => {

        venus.set(venusPoses[frame]);
        earth.set(earthPoses[frame]);
        mars.set(marsPoses[frame]);


        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        objs.forEach((obj) => { obj.draw(camera); });

        frame += 20;
        frame %= 5000;
    }, 10);
}

function addMouseListener(onMove, onWheel) {

    let mButtons = 0;

    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', (event) => { mButtons = event.buttons; });
    canvas.addEventListener('mouseup', (event) => { mButtons = event.buttons; });
    canvas.addEventListener('mouseleave', (event) => { mButtons = event.buttons; });
    canvas.addEventListener('mouseenter', (event) => { mButtons = event.buttons; });
    canvas.addEventListener('mousemove', (event) => { if (mButtons == 1) onMove(event); });
    canvas.addEventListener('wheel', (event) => { onWheel(event); });
}

class Camera {
    constructor() {
        this.position = new Point(0, 0, 0);
        this.yaw = 0 - Math.PI / 6;
        this.pitch = 0 - Math.PI / 6;
        this.roll = 0;
        this.zoom = 0;
    }
}