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
        new Orbit(200, 0.1, Math.PI / 6, Math.PI / 60, Math.PI / 6,),
        new Orbit(400, 0.5, 0, 0, 0,),
        new Orbit(800, 0.07, -Math.PI / 2, Math.PI / 60, Math.PI * 4 / 3,),
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

        let speed = Math.sqrt(1000 * (2 / this.position.minus(this.parent.position).magnitude() - 1 / this.orbit.semiMajorAxis));

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
        longAscending,
        inclination,
        argPeriapsis,
    ) {
        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;
        this.longAscending = longAscending;
        this.inclination = inclination;
        this.argPeriapsis = argPeriapsis;

        this.apoapsis = this.getPosition(0);
        this.periapsis = this.getPosition(Math.PI);
        this.ascending = this.getPosition(-this.argPeriapsis);
        this.descending = this.getPosition(-this.argPeriapsis + Math.PI);

        this.positions = [];
        for (let i = 0; i <= 2 * Math.PI; i += Math.PI / 180) { this.positions.push(this.getPosition(i)); }
    }

    getPosition(trueAnomaly) {
        let distance = this.semiMajorAxis * (1 - this.eccentricity ** 2) / (1 + this.eccentricity * Math.cos(trueAnomaly));
        let position = new Vector(distance * Math.cos(trueAnomaly), distance * Math.sin(trueAnomaly), 0);

        let position2 = position.timesVector(
            new Vector(Math.cos(this.argPeriapsis), Math.sin(this.argPeriapsis), 0),
            new Vector(-Math.sin(this.argPeriapsis), Math.cos(this.argPeriapsis), 0)
        );
        let position3 = position2.timesVector(
            new Vector(1, 0, 0),
            new Vector(0, Math.cos(this.inclination), Math.sin(this.inclination))
        );
        let position4 = position3.timesVector(
            new Vector(Math.cos(this.longAscending), Math.sin(this.longAscending), 0),
            new Vector(-Math.sin(this.longAscending), Math.cos(this.longAscending), 0)
        );

        return position4;
    }

    draw(camera) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        for (let i = 0; i < this.positions.length - 1; i++) {

            let aProj = Complex.projectFrom3d(this.positions[i], camera);
            let bProj = Complex.projectFrom3d(this.positions[i + 1], camera);

            ctx.beginPath();
            ctx.moveTo(aProj.x, aProj.y);
            ctx.lineTo(bProj.x, bProj.y);
            ctx.stroke();
        }

        let apoProj = Complex.projectFrom3d(this.apoapsis, camera);
        ctx.strokeRect(apoProj.x - 3, apoProj.y - 3, 6, 6);
        ctx.fillRect(apoProj.x - 3, apoProj.y - 3, 6, 6);

        let periProj = Complex.projectFrom3d(this.periapsis, camera);
        ctx.strokeRect(periProj.x - 3, periProj.y - 3, 6, 6);

        let ascProj = Complex.projectFrom3d(this.ascending, camera);
        ctx.beginPath();
        ctx.moveTo(ascProj.x, ascProj.y - 5);
        ctx.lineTo(ascProj.x + 4, ascProj.y + 2);
        ctx.lineTo(ascProj.x - 4, ascProj.y + 2);
        ctx.closePath();
        ctx.stroke();

        let descProj = Complex.projectFrom3d(this.descending, camera);
        ctx.beginPath();
        ctx.moveTo(descProj.x, descProj.y + 5);
        ctx.lineTo(descProj.x + 4, descProj.y - 2);
        ctx.lineTo(descProj.x - 4, descProj.y - 2);
        ctx.closePath();
        ctx.stroke();

        this.ascDescLine = [];
        for (let i = 0; i <= 1; i++) {
            let position = this.descending.minus(this.ascending).over(1).times(i).plus(this.ascending);
            this.ascDescLine.push(position);
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