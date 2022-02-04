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
    constructor(position, velocity, parent) {
        this.position = position;
        this.velocity = velocity;
        this.parent = parent;
    }

    update() {
        if (this.parent == null) return;
        let acceration = this.parent.position.minus(this.position).over(this.parent.position.minus(this.position).magnitude() ** 3).times(1000);
        this.velocity = this.velocity.plus(acceration);
        this.position = this.position.plus(this.velocity);
    }

    draw(camera) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        let complex = Complex.projectFrom3d(this.position, camera);

        ctx.beginPath();
        ctx.arc(complex.x, complex.y, 5, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

class Orbit {
    constructor(semiMajorAxis, eccentricity) {

        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;

        let positions = [];

        for (let i = 0; i < 2 * Math.PI; i += 2 * Math.PI / 360) {
            let distance = semiMajorAxis * (1 - eccentricity ** 2) / (1 + eccentricity * Math.cos(i));
            let position = new Vector(distance * Math.cos(i), distance * Math.sin(i), 0);
            positions.push(position);
        }

        this.trajectory = new Trajectory(positions);
    }

    draw(camera) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        for (let i = 0; i < this.trajectory.vectors.length - 1; i++) {

            let complexA = Complex.projectFrom3d(this.trajectory.vectors[i], camera);
            let complexB = Complex.projectFrom3d(this.trajectory.vectors[i + 1], camera);

            ctx.beginPath();
            ctx.moveTo(complexA.x, complexA.y);
            ctx.lineTo(complexB.x, complexB.y);
            ctx.stroke();
        }
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



    let sun = new Celestial(
        new Vector(0, 0, 0),
        new Vector(0, 0, 0),
    );
    let earth = new Celestial(
        new Vector(400, 0, 0),
        new Vector(0, 1.58, 0),
        sun,
    );
    let celestials = [sun, earth];



    celestials = celestials.concat([
        new Orbit(400, 0),
    ]);







    setInterval(() => {
        earth.update();

        // camera.position = earth.position;

        draw(() => { celestials.forEach((obj) => { obj.draw(camera); }); });
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
