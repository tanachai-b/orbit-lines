'use strict';

class Camera {
    constructor() {
        this.position = new Vector(0, 0, 0);
        this.yaw = 0 - Math.PI / 6;
        this.pitch = 0 - Math.PI / 6;
        this.roll = 0;
        this.zoom = -8000;

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
    constructor(
        label,
        radius,
        mass,
        parent,
        orbit,
        trueAnomaly,
    ) {
        this.label = label;
        this.radius = radius;
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

        let orbitalSpeed = Math.sqrt(this.parent.mass / 1000000000000 * 1 * (2 / truePosition.magnitude() - 1 / this.orbit.semiMajorAxis));
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
        ctx.fillStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        let posProj = Complex.projectFrom3d(this.position, camera);
        let radiusProj = Complex.projectRadius(this.radius / 149598073 * 100, this.position, camera);

        ctx.beginPath();
        ctx.arc(posProj.x, posProj.y, radiusProj, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.strokeRect(posProj.x - 4, posProj.y - 4, 8, 8);
        ctx.fillText(this.label, posProj.x + 8, posProj.y + 4);

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
        ctx.beginPath();
        ctx.arc(apoProj.x, apoProj.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        let periProj = Complex.projectFrom3d(this.periapsis.plus(position), camera);
        ctx.beginPath();
        ctx.arc(periProj.x, periProj.y, 3, 0, 2 * Math.PI);
        ctx.stroke();

        let ascProj = Complex.projectFrom3d(this.ascending.plus(position), camera);
        ctx.beginPath();
        ctx.moveTo(ascProj.x, ascProj.y - 4);
        ctx.lineTo(ascProj.x + 3, ascProj.y + 2);
        ctx.lineTo(ascProj.x - 3, ascProj.y + 2);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        let descProj = Complex.projectFrom3d(this.descending.plus(position), camera);
        ctx.beginPath();
        ctx.moveTo(descProj.x, descProj.y + 4);
        ctx.lineTo(descProj.x + 3, descProj.y - 2);
        ctx.lineTo(descProj.x - 3, descProj.y - 2);
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