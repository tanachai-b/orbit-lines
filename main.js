'use strict';

function main() {

    let sun = new Celestial(
        new Vector(0, 0, 0),
        new Vector(0, 0, 0),
    );
    let earth = new Celestial(
        new Vector(200, 0, 0),
        new Vector(0, 2.74, 0),
        sun,
    );
    let earth2 = new Celestial(
        new Vector(200, 0, 0),
        new Vector(0, 2.3, 0),
        sun,
        new Orbit(400, 0.5, 0, 0, 0,),
    );
    let celestials = [sun, earth, earth2];

    celestials = celestials.concat([
        // new Orbit(200, 0.1, Math.PI / 6, Math.PI / 60, Math.PI / 6,),
        new Orbit(400, 0.5, 0, 0, 0,),
        // new Orbit(800, 0.07, -Math.PI / 2, Math.PI / 60, Math.PI * 4 / 3,),
    ]);

    let camera = new Camera();

    setInterval(() => {
        draw(() => { celestials.forEach((obj) => { obj.draw(camera); }); });

        earth.update();
        earth2.update();

        // camera.position = earth.position;


    }, 1000 / 60);
}

function draw(onDraw) {
    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onDraw();
}


class Camera {
    constructor() {
        this.position = new Vector(0, 0, 0);
        this.yaw = 0 - Math.PI / 6;
        this.pitch = 0 - Math.PI / 6;
        this.roll = 0;
        this.zoom = 0;

        Camera.addMouseListener(
            (event) => {
                this.yaw += event.movementX / 200;
                this.pitch -= event.movementY / 200;
            }, (event) => {
                this.zoom += event.deltaY;
            },
        );
    }

    static addMouseListener(onMove, onWheel) {
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
}

class Celestial {
    constructor(position, velocity, parent, orbit) {
        this.position = position;
        this.velocity = velocity;
        this.parent = parent;
        this.orbit = orbit;
    }

    update() {
        if (this.parent == null) return;

        let acceration = this.parent.position.minus(this.position).over(this.parent.position.minus(this.position).magnitude() ** 3).times(1000);
        this.velocity = this.velocity.plus(acceration);
        this.position = this.position.plus(this.velocity);

        if (this.orbit == null) return;

        // let speed = Math.sqrt(1000 * (2 / this.position.minus(this.parent.position).magnitude() - 1 / this.orbit.semiMajorAxis));
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
    constructor(
        semiMajorAxis,
        eccentricity,
        ascendingNode,
        inclination,
        argPeriapsis,
    ) {
        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;
        this.ascendingNode = ascendingNode;
        this.inclination = inclination;
        this.argPeriapsis = argPeriapsis;

        this.positions = [];

        for (let i = 0; i <= 2 * Math.PI; i += Math.PI / 180) {
            let distance = semiMajorAxis * (1 - eccentricity ** 2) / (1 + eccentricity * Math.cos(i));
            let position = new Vector(distance * Math.cos(i), distance * Math.sin(i), 0);
            let position2 = position.timesVector(new Vector(Math.cos(argPeriapsis), Math.sin(argPeriapsis), 0), new Vector(-Math.sin(argPeriapsis), Math.cos(argPeriapsis), 0));
            let position3 = position2.timesVector(new Vector(1, 0, 0), new Vector(0, Math.cos(inclination), Math.sin(inclination)));
            let position4 = position3.timesVector(new Vector(Math.cos(ascendingNode), Math.sin(ascendingNode), 0), new Vector(-Math.sin(ascendingNode), Math.cos(ascendingNode), 0));

            this.positions.push(position4);
        }


        let asc = this.positions[Math.round((-this.argPeriapsis / Math.PI * 180 + 360) % 360)];
        let desc = this.positions[Math.round((-this.argPeriapsis / Math.PI * 180 + 360 + 180) % 360)];

        this.ascDescLine = [];

        for (let i = 0; i <= 1; i++) {
            let position = desc.minus(asc).over(1).times(i).plus(asc);
            this.ascDescLine.push(position);
        }
    }

    draw(camera) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        for (let i = 0; i < this.positions.length - 1; i++) {

            let complexA = Complex.projectFrom3d(this.positions[i], camera);
            let complexB = Complex.projectFrom3d(this.positions[i + 1], camera);

            ctx.beginPath();
            ctx.moveTo(complexA.x, complexA.y);
            ctx.lineTo(complexB.x, complexB.y);
            ctx.stroke();

            if (i == 0) {
                ctx.strokeRect(complexA.x - 3, complexA.y - 3, 6, 6);
                ctx.fillRect(complexA.x - 3, complexA.y - 3, 6, 6);
            }

            if (i == 180) {
                ctx.strokeRect(complexA.x - 3, complexA.y - 3, 6, 6);
            }

            if (i == Math.round((-this.argPeriapsis / Math.PI * 180 + 360) % 360)) {
                ctx.beginPath();
                ctx.moveTo(complexA.x, complexA.y - 5);
                ctx.lineTo(complexA.x + 4, complexA.y + 2);
                ctx.lineTo(complexA.x - 4, complexA.y + 2);
                ctx.closePath();
                ctx.stroke();
            }


            if (i == Math.round((-this.argPeriapsis / Math.PI * 180 + 360 + 180) % 360)) {
                ctx.beginPath();
                ctx.moveTo(complexA.x, complexA.y + 5);
                ctx.lineTo(complexA.x + 4, complexA.y - 2);
                ctx.lineTo(complexA.x - 4, complexA.y - 2);
                ctx.closePath();
                ctx.stroke();
            }
        }


        for (let i = 0; i < this.ascDescLine.length - 1; i++) {
            let start = Complex.projectFrom3d(this.ascDescLine[i], camera);
            let end = Complex.projectFrom3d(this.ascDescLine[i + 1], camera);

            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.setLineDash([2, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}