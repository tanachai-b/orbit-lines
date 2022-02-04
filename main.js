'use strict';

class Camera {
    constructor() {
        this.position = new Vector(0, 0, 0);
        this.yaw = 0 - Math.PI / 6;
        this.pitch = 0 - Math.PI / 6;
        this.roll = 0;
        this.zoom = 0;
    }
}

class Celestial {
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





    let xsun = new Celestial(new Vector(0, 0, 0), new Vector(0, 0, 0));





    let sunPos = new Vector(0, 0, 0);

    let earthPos = new Vector(200 * Math.cos(Math.PI * 0 / 6), 200 * Math.sin(Math.PI * 0 / 6), 0);
    let earthV = new Vector(-0.8658 * Math.sin(Math.PI * 0 / 6), 0.8658 * Math.cos(Math.PI * 0 / 6), 0);
    let earthA = new Vector(0, 0, 0);



    let sun = sunPos.copy();
    let earth = earthPos.copy();


    let earthPoses = [earthPos];

    for (let i = 0; i < 5000; i++) {
        earthA = sunPos.minus(earthPos).over(sunPos.minus(earthPos).magnitude() ** 3).times(100);
        earthV = earthV.plus(earthA);
        earthPos = earthPos.plus(earthV);
        earthPoses.push(earthPos);
    }

    let earthTraj = new Trajectory(earthPoses);







    let objs = [];
    objs.push(sun);
    objs.push(earth);
    objs.push(earthTraj);




    let frame = 0;
    setInterval(() => {

        earth.set(earthPoses[frame]);

        draw(() => { objs.forEach((obj) => { obj.draw(camera); }); });

        frame += 20;
        frame %= 5000;
    }, 10);
}

function draw(onDraw) {
    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onDraw();
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
