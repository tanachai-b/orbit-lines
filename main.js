'use strict';

function main() {

    let sun = new Celestial(1000);

    let mercury = new Celestial(
        1,
        sun,
        new Orbit(
            20 * 0.38709927,
            0.20563593,
            Math.PI / 180 * 48.33076593,
            Math.PI / 180 * 7.00497902,
            Math.PI / 180 * 29.12703035,
        ),
        0
    );
    let venus = new Celestial(
        1,
        sun,
        new Orbit(
            20 * 0.72333566,
            0.00677672,
            Math.PI / 180 * 76.67984255,
            Math.PI / 180 * 3.39467605,
            Math.PI / 180 * 54.92262463,
        ),
        0
    );
    let earth = new Celestial(
        1,
        sun,
        new Orbit(
            20 * 1.00000261,
            0.01671123,
            Math.PI / 180 * 0.0,
            Math.PI / 180 * -0.00001531,
            Math.PI / 180 * 102.9376819,
        ),
        0
    );
    let mars = new Celestial(
        1,
        sun,
        new Orbit(
            20 * 1.52371034,
            0.09339410,
            Math.PI / 180 * 49.55953891,
            Math.PI / 180 * 1.84969142,
            Math.PI / 180 * -73.5031685,
        ),
        0
    );
    let jupiter = new Celestial(
        1,
        sun,
        new Orbit(
            20 * 5.20288700,
            0.04838624,
            Math.PI / 180 * 100.47390909,
            Math.PI / 180 * 1.30439695,
            Math.PI / 180 * -85.74542926,
        ),
        0
    );
    let saturn = new Celestial(
        1,
        sun,
        new Orbit(
            20 * 9.53667594,
            0.05386179,
            Math.PI / 180 * 113.66242448,
            Math.PI / 180 * 2.48599187,
            -21.06354617,
        ),
        0
    );
    let uranus = new Celestial(
        1,
        sun,
        new Orbit(
            20 * 19.18916464,
            0.04725744,
            Math.PI / 180 * 74.01692503,
            Math.PI / 180 * 0.77263783,
            96.93735127,
        ),
        0
    );
    let neptune = new Celestial(
        1,
        sun,
        new Orbit(
            20 * 30.06992276,
            0.00859048,
            Math.PI / 180 * 131.78422574,
            Math.PI / 180 * 1.77004347,
            -86.81946347,
        ),
        0
    );

    let moon = new Celestial(
        1,
        earth,
        new Orbit(
            20 * 0.00256955529,
            0.0554,
            Math.PI / 180 *125.08,
            Math.PI / 180 * 5.16,
            Math.PI / 180 * 318.15,
        ),
        0
    );

    let celestials = [
        sun,
        mercury,
        venus,
        earth,
        mars,
        jupiter,
        saturn,
        uranus,
        neptune,

        moon,
    ];

    let camera = new Camera();

    setInterval(() => {
        camera.position = earth.position;
        draw(() => { celestials.forEach((obj) => { obj.draw(camera); }); });
        celestials.forEach((celestial) => { celestial.updateVelocity(); });
        celestials.forEach((celestial) => { celestial.updatePosition(); });
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
    constructor(mass, parent, orbit, trueAnomaly) {
        this.mass = mass;
        this.parent = parent;
        this.orbit = orbit;
        this.trueAnomaly = trueAnomaly;

        this.position = new Vector(0, 0, 0);
        this.velocity = new Vector(0, 0, 0);
        this.angularVelocity = 0;

        if (this.parent != null) {
            this.position = this.orbit.getPosition(this.trueAnomaly).plus(this.parent.position);
        }
    }

    updateVelocity() {
        if (this.parent == null) return;

        let relativePosition = this.position.minus(this.parent.position);

        let apoapsis = this.orbit.apoapsis;
        let orbitDirection = this.orbit.getPosition(1).minus(apoapsis);

        let position2 = relativePosition.overVector(apoapsis.unit(), orbitDirection);
        this.trueAnomaly = Math.atan2(position2.y, position2.x);
        let truePosition = this.orbit.getPosition(this.trueAnomaly);

        let orbitalSpeed = Math.sqrt(this.parent.mass / 100000000 * (2 / truePosition.magnitude() - 1 / this.orbit.semiMajorAxis));
        this.velocity = this.orbit.getPosition(this.trueAnomaly + 0.000001).minus(truePosition).unit().times(orbitalSpeed);

        this.angularVelocity = this.velocity.overVector(truePosition.unit(), this.velocity).y / truePosition.magnitude();
    }

    updatePosition() {
        if (this.parent == null) return;

        this.position = this.orbit.getPosition(this.trueAnomaly + this.angularVelocity).plus(this.parent.position);
    }

    draw(camera) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        let posProj = Complex.projectFrom3d(this.position, camera);

        ctx.beginPath();
        ctx.arc(posProj.x, posProj.y, 5, 0, 2 * Math.PI);
        ctx.stroke();

        if (this.orbit != null) { this.orbit.draw(camera, this.parent.position); }
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

    update() {

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

    draw(camera, position) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        for (let i = 0; i < this.positions.length - 1; i++) {
            let aProj = Complex.projectFrom3d(this.positions[i].plus(position), camera);
            let bProj = Complex.projectFrom3d(this.positions[i + 1].plus(position), camera);

            ctx.beginPath();
            ctx.moveTo(aProj.x, aProj.y);
            ctx.lineTo(bProj.x, bProj.y);
            ctx.stroke();
        }

        let apoProj = Complex.projectFrom3d(this.apoapsis.plus(position), camera);
        ctx.strokeRect(apoProj.x - 3, apoProj.y - 3, 6, 6);
        ctx.fillRect(apoProj.x - 3, apoProj.y - 3, 6, 6);

        let periProj = Complex.projectFrom3d(this.periapsis.plus(position), camera);
        ctx.strokeRect(periProj.x - 3, periProj.y - 3, 6, 6);

        let ascProj = Complex.projectFrom3d(this.ascending.plus(position), camera);
        ctx.beginPath();
        ctx.moveTo(ascProj.x, ascProj.y - 5);
        ctx.lineTo(ascProj.x + 4, ascProj.y + 2);
        ctx.lineTo(ascProj.x - 4, ascProj.y + 2);
        ctx.closePath();
        ctx.stroke();

        let descProj = Complex.projectFrom3d(this.descending.plus(position), camera);
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
            let start = Complex.projectFrom3d(this.ascDescLine[i].plus(position), camera);
            let end = Complex.projectFrom3d(this.ascDescLine[i + 1].plus(position), camera);

            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.setLineDash([2, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}