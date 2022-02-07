'use strict';

class Camera {
    constructor(center) {
        this.center = center;


        this.position = center.position;

        this.yaw = -Math.PI / 6;
        this.pitch = -Math.PI / 6;
        this.roll = 0;

        this.zoom = 15;


        this.diffPosition = new Vector(0, 0, 0);

        this.destYaw = this.yaw;
        this.destPitch = this.pitch;
        this.destRoll = this.roll;

        this.destZoom = this.zoom;


        Camera.addMouseListener(
            (event) => {
                this.destYaw += event.movementX / 200;
                this.destPitch -= event.movementY / 200;

                this.destPitch = Math.min(this.destPitch, Math.PI / 2);
                this.destPitch = Math.max(this.destPitch, -Math.PI / 2);

            }, (event) => {
                this.destZoom += Math.sign(event.deltaY);
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

    changeCenter(center) {
        this.center = center;
        this.diffPosition = this.position.minus(this.center.position);
    }

    update() {
        this.diffPosition = this.diffPosition.times(9 / 10);
        this.position = this.center.position.plus(this.diffPosition);

        this.yaw += (this.destYaw - this.yaw) / 10;
        this.pitch += (this.destPitch - this.pitch) / 10;
        this.roll += (this.destRoll - this.roll) / 10;

        this.zoom += (this.destZoom - this.zoom) / 10;
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

        this.angularVelocity = 0;

        this.position = new Vector(0, 0, 0);
        this.velocity = new Vector(0, 0, 0);

        if (this.parent != null) {
            let relPosition = this.orbit.getPosition(this.trueAnomaly);

            let orbitalSpeed = Math.sqrt(this.parent.mass * 10000 * (2 / relPosition.magnitude() - 1 / this.orbit.semiMajorAxis));
            let relVelocity = this.orbit.getPosition(this.trueAnomaly + 0.000001).minus(relPosition).unit().times(orbitalSpeed);

            this.angularVelocity = relVelocity.overVector(relPosition.unit(), relVelocity).y / relPosition.magnitude();

            this.position = relPosition.plus(this.parent.position);
            this.velocity = relVelocity.plus(this.parent.velocity);
        }
    }

    updateVelocity(timeSpeed) {
        if (this.parent == null) return;

        let relPosition = this.orbit.getPosition(this.trueAnomaly);

        let orbitalSpeed = Math.sqrt(this.parent.mass * 10000 * 10 ** timeSpeed * (2 / relPosition.magnitude() - 1 / this.orbit.semiMajorAxis));
        let relVelocity = this.orbit.getPosition(this.trueAnomaly + 0.000001).minus(relPosition).unit().times(orbitalSpeed);
        this.velocity = relVelocity.plus(this.parent.velocity).over(10 ** (timeSpeed / 2));

        this.angularVelocity = relVelocity.overVector(relPosition.unit(), relVelocity).y / relPosition.magnitude();
    }

    updatePosition() {
        if (this.parent == null) return;

        this.trueAnomaly += this.angularVelocity;
        this.position = this.orbit.getPosition(this.trueAnomaly).plus(this.parent.position);
    }

    updateOrbit() { }
    updateRelativeOrbit() { }
    updateRelativeTrajectory() { }

    draw(camera, isShip, isTarget) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.lineWidth = 1;


        let posProj = Complex.projectFrom3d(this.position, camera);

        ctx.strokeRect(posProj.x - 3.5, posProj.y - 3.5, 8, 8);
        ctx.fillText(this.label, posProj.x + 8, posProj.y + 4);


        let circle = Complex.projectSphere(this.radius, this.position, camera);

        for (let i = 0; i < circle.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(circle[i].x, circle[i].y);
            ctx.lineTo(circle[i + 1].x, circle[i + 1].y);
            ctx.stroke();
        }


        if (this.orbit != null && (isShip || isTarget)) {
            this.orbit.draw(camera, false, this.parent.position);
        }
    }
}

class Ship {
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

        if (this.parent != null) {
            let relPosition = this.orbit.getPosition(this.trueAnomaly);
            this.position = relPosition.plus(this.parent.position);

            let orbitalSpeed = Math.sqrt(this.parent.mass * 10000 * (2 / relPosition.magnitude() - 1 / this.orbit.semiMajorAxis));
            let orbitalDirection = this.orbit.getPosition(this.trueAnomaly + 0.000001).minus(relPosition).unit();
            this.velocity = orbitalDirection.times(orbitalSpeed).plus(this.parent.velocity);
        }

        this.target = null;
        this.relativeOrbit = null;

        this.traj = [];
    }

    setTarget(target) {
        this.target = target;
    }

    updateVelocity(timeSpeed, sun, moon) {
        if (this.parent == null) return;

        let relPosition = this.parent.position.minus(this.position);
        let acceleration = relPosition.over(relPosition.magnitude() ** 3).times(this.parent.mass * 10000 * 10 ** (timeSpeed / 2));

        let sunDist = sun.position.minus(this.position);
        let sunGrav = sunDist.over(sunDist.magnitude() ** 3).times(sun.mass * 10000 * 10 ** (timeSpeed / 2));
        acceleration = acceleration.plus(sunGrav);

        let moonDist = moon.position.minus(this.position);
        let moonGrav = moonDist.over(moonDist.magnitude() ** 3).times(moon.mass * 10000 * 10 ** (timeSpeed / 2));
        acceleration = acceleration.plus(moonGrav);

        this.velocity = this.velocity.plus(acceleration);
    }

    updatePosition(timeSpeed) {
        if (this.parent == null) return;

        this.position = this.position.plus(this.velocity.times(10 ** (timeSpeed / 2)));
    }

    updateOrbit() {
        if (this.parent == null) return;

        let relPosition = this.position.minus(this.parent.position);
        let relVelocity = this.velocity.minus(this.parent.velocity);
        let perpenVelocity = relVelocity.overVector(relPosition.unit(), relVelocity).y;

        let distance = relPosition.magnitude();
        let speed = relVelocity.magnitude();
        let semiMajorAxis = 1 / (2 / distance - speed ** 2 / (this.parent.mass * 10000));

        let orbitalEnergy = -(this.parent.mass * 10000 / (2 * semiMajorAxis));
        let angularMomentum = relPosition.magnitude() * perpenVelocity;
        let eccentricity = Math.sqrt(1 + (2 * orbitalEnergy * angularMomentum ** 2 / (this.parent.mass * 10000) ** 2));

        let normal = new Vector(0, 0, 1).timesVector(relPosition.unit(), relVelocity);
        let ascNode = new Vector(0, 0, 1).timesVector(new Vector(0, 0, 1), normal);
        let longAscending = Math.acos(ascNode.x);
        if (ascNode.y < 0) longAscending = 2 * Math.PI - longAscending;

        let inclination = Math.acos(normal.z);

        let eccenVector = new Vector(0, 0, angularMomentum).timesVector(relVelocity, normal).over(this.parent.mass * 10000).minus(relPosition.unit());
        let eccenOnAscNode = eccenVector.overVector(ascNode, new Vector(0, 0, 1).timesVector(normal, ascNode));
        let argPeriapsis = Math.atan2(eccenOnAscNode.y, eccenOnAscNode.x);

        let posOnEccenVector = relPosition.overVector(eccenVector.unit(), new Vector(0, 0, 1).timesVector(normal, eccenVector));
        this.trueAnomaly = Math.atan2(posOnEccenVector.y, posOnEccenVector.x);


        this.orbit = new Orbit(
            semiMajorAxis,
            eccentricity,
            longAscending,
            inclination,
            argPeriapsis
        );
    }

    updateRelativeOrbit() {
        if (this.target == null) return;


        let relPosition = this.position.minus(this.parent.position);
        let relVelocity = this.velocity.minus(this.parent.velocity);


        let yawDiff = -this.target.orbit.longAscending;
        let rollDiff = -this.target.orbit.inclination;

        let yaw = new Vector(Math.cos(yawDiff), Math.sin(yawDiff), 0);
        let roll = new Vector(0, Math.cos(rollDiff), Math.sin(rollDiff));

        relPosition = relPosition.timesVector(yaw, new Vector(-yaw.y, yaw.x, 0));
        relVelocity = relVelocity.timesVector(yaw, new Vector(-yaw.y, yaw.x, 0));

        relPosition = relPosition.timesVector(new Vector(1, 0, 0), roll);
        relVelocity = relVelocity.timesVector(new Vector(1, 0, 0), roll);


        this.relOrbYaw = new Vector(Math.cos(yawDiff), -Math.sin(yawDiff), 0);
        this.relOrbRoll = new Vector(0, Math.cos(rollDiff), -Math.sin(rollDiff));
        this.relOrbRoll = this.relOrbRoll.timesVector(this.relOrbYaw, new Vector(-this.relOrbYaw.y, this.relOrbYaw.x, 0));



        let perpenVelocity = relVelocity.overVector(relPosition.unit(), relVelocity).y;

        let distance = relPosition.magnitude();
        let speed = relVelocity.magnitude();
        let semiMajorAxis = 1 / (2 / distance - speed ** 2 / (this.parent.mass * 10000));

        let orbitalEnergy = -(this.parent.mass * 10000 / (2 * semiMajorAxis));
        let angularMomentum = relPosition.magnitude() * perpenVelocity;
        let eccentricity = Math.sqrt(1 + (2 * orbitalEnergy * angularMomentum ** 2 / (this.parent.mass * 10000) ** 2));

        let normal = new Vector(0, 0, 1).timesVector(relPosition.unit(), relVelocity);
        let ascNode = new Vector(0, 0, 1).timesVector(new Vector(0, 0, 1), normal);
        let longAscending = Math.acos(ascNode.x);
        if (ascNode.y < 0) longAscending = 2 * Math.PI - longAscending;

        let inclination = Math.acos(normal.z);

        let eccenVector = new Vector(0, 0, angularMomentum).timesVector(relVelocity, normal).over(this.parent.mass * 10000).minus(relPosition.unit());
        let eccenOnAscNode = eccenVector.overVector(ascNode, new Vector(0, 0, 1).timesVector(normal, ascNode));
        let argPeriapsis = Math.atan2(eccenOnAscNode.y, eccenOnAscNode.x);

        // let posOnEccenVector = relPosition.overVector(eccenVector.unit(), new Vector(0, 0, 1).timesVector(normal, eccenVector));
        // this.trueAnomaly = Math.atan2(posOnEccenVector.y, posOnEccenVector.x);


        this.relativeOrbit = new Orbit(
            semiMajorAxis,
            eccentricity,
            longAscending,
            inclination,
            argPeriapsis
        );
    }

    updateRelativeTrajectory() {
        if (this.target == null) return;

        let shipOrbit = this.orbit;
        let targetOrbit = this.target.orbit;

        let shipPeriod = 2 * Math.PI * Math.sqrt(shipOrbit.semiMajorAxis ** 3 / this.parent.mass);
        // let targetPeriod = 2 * Math.PI * Math.sqrt(targetOrbit.semiMajorAxis ** 3 / this.parent.mass);


        this.traj = [];

        let shipAnomaly = this.trueAnomaly;
        let targetAnomaly = this.target.trueAnomaly;

        while (shipAnomaly <= 2 * Math.PI && this.traj.length < 1000) {

            let shipPosition = shipOrbit.getPosition(shipAnomaly);
            let targetPosition = targetOrbit.getPosition(targetAnomaly);

            let diffPos = shipPosition.minus(targetPosition);
            this.traj.push(diffPos);


            let shipSpeed = Math.sqrt(this.parent.mass * 10000 * shipPeriod / 10 * (2 / shipPosition.magnitude() - 1 / shipOrbit.semiMajorAxis));
            let shipVelocity = shipOrbit.getPosition(shipAnomaly + 0.000001).minus(shipPosition).unit().times(shipSpeed);
            let shipAngular = shipVelocity.overVector(shipPosition.unit(), shipVelocity).y / shipPosition.magnitude();

            let targetSpeed = Math.sqrt(this.parent.mass * 10000 * shipPeriod / 10 * (2 / targetPosition.magnitude() - 1 / targetOrbit.semiMajorAxis));
            let targetVelocity = targetOrbit.getPosition(targetAnomaly + 0.000001).minus(targetPosition).unit().times(targetSpeed);
            let targetAngular = targetVelocity.overVector(targetPosition.unit(), targetVelocity).y / targetPosition.magnitude();


            shipAnomaly += shipAngular;
            targetAnomaly += targetAngular;
        }
    }

    draw(camera, isShip, isTarget, turnOnRelTraj) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.lineWidth = 1;


        let posProj = Complex.projectFrom3d(this.position, camera);

        ctx.strokeRect(posProj.x - 3.5, posProj.y - 3.5, 8, 8);
        ctx.fillText(this.label, posProj.x + 8, posProj.y + 4);


        let circle = Complex.projectSphere(this.radius, this.position, camera);

        for (let i = 0; i < circle.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(circle[i].x, circle[i].y);
            ctx.lineTo(circle[i + 1].x, circle[i + 1].y);
            ctx.stroke();
        }


        if (this.orbit != null && (isShip || isTarget) && this.target == null) {
            this.orbit.draw(camera, true, this.parent.position);
        }

        if (this.relativeOrbit != null && (isShip || isTarget) && this.target != null) {
            this.relativeOrbit.draw(camera, true, this.parent.position, this.relOrbYaw, this.relOrbRoll);
        }













        if (this.target != null && turnOnRelTraj) {
            for (let i = 0; i < this.traj.length - 1; i++) {

                let trajProj1 = Complex.projectFrom3d(this.traj[i].plus(this.target.position), camera);
                let trajProj2 = Complex.projectFrom3d(this.traj[i + 1].plus(this.target.position), camera);

                ctx.beginPath();
                ctx.moveTo(trajProj1.x, trajProj1.y);
                ctx.lineTo(trajProj2.x, trajProj2.y);
                ctx.stroke();
            }
        }

    }

    thrust(prograde, radialIn, normal) {

        let relPosition = this.position.minus(this.parent.position);
        let relVelocity = this.velocity.minus(this.parent.velocity);

        let thrust = new Vector(prograde, radialIn, normal).timesVector(relVelocity.unit(), relPosition.times(-1));

        this.velocity = this.velocity.plus(thrust);
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

        this.periapsis = this.getPosition(0);
        this.apoapsis = this.getPosition(Math.PI);
        this.ascending = this.getPosition(-this.argPeriapsis);
        this.descending = this.getPosition(-this.argPeriapsis + Math.PI);
    }

    getPosition(trueAnomaly, ifLeftOfPeriapsis) {
        let distance = this.semiMajorAxis * (1 - this.eccentricity ** 2) / (1 + this.eccentricity * Math.cos(trueAnomaly));
        let position = new Vector(distance * Math.cos(trueAnomaly), distance * Math.sin(trueAnomaly), 0);

        let maxRight = this.semiMajorAxis * (1 - this.eccentricity ** 2) / (1 + this.eccentricity);

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

        if (ifLeftOfPeriapsis != null && position.x < maxRight) ifLeftOfPeriapsis(position4);
        return position4;
    }

    isLeftOfPeri(trueAnomaly) {
        let distance = this.semiMajorAxis * (1 - this.eccentricity ** 2) / (1 + this.eccentricity * Math.cos(trueAnomaly));
        let maxRight = this.semiMajorAxis * (1 - this.eccentricity ** 2) / (1 + this.eccentricity);

        return distance * Math.cos(trueAnomaly) <= maxRight;
    }

    draw(camera, isDrawNodes, translation, yawPitch, roll) {
        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.lineWidth = 1;


        if (yawPitch == null) { yawPitch = new Vector(1, 0, 0); }
        if (roll == null) { roll = new Vector(0, 1, 0); }


        this.positions = [];
        for (let i = -Math.PI; i <= Math.PI; i += Math.PI / 180) {
            this.getPosition(i, (position) => { this.positions.push(position); });
        }

        for (let i = 0; i < this.positions.length - 1; i++) {
            let aProj = Complex.projectFrom3d(this.positions[i].timesVector(yawPitch, roll).plus(translation), camera);
            let bProj = Complex.projectFrom3d(this.positions[i + 1].timesVector(yawPitch, roll).plus(translation), camera);

            ctx.beginPath();
            ctx.moveTo(aProj.x, aProj.y);
            ctx.lineTo(bProj.x, bProj.y);
            ctx.stroke();
        }


        let periProj = Complex.projectFrom3d(this.periapsis.timesVector(yawPitch, roll).plus(translation), camera);
        ctx.beginPath();
        ctx.moveTo(periProj.x - 4, periProj.y);
        ctx.lineTo(periProj.x, periProj.y + 4);
        ctx.lineTo(periProj.x + 4, periProj.y);
        ctx.lineTo(periProj.x, periProj.y - 4);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        if (this.isLeftOfPeri(Math.PI)) {
            let apoProj = Complex.projectFrom3d(this.apoapsis.timesVector(yawPitch, roll).plus(translation), camera);
            ctx.beginPath();
            ctx.moveTo(apoProj.x - 4, apoProj.y);
            ctx.lineTo(apoProj.x, apoProj.y + 4);
            ctx.lineTo(apoProj.x + 4, apoProj.y);
            ctx.lineTo(apoProj.x, apoProj.y - 4);
            ctx.closePath();
            ctx.stroke();
        }


        if (isDrawNodes) {

            if (this.isLeftOfPeri(-this.argPeriapsis)) {
                let ascProj = Complex.projectFrom3d(this.ascending.timesVector(yawPitch, roll).plus(translation), camera);
                ctx.beginPath();
                ctx.moveTo(ascProj.x, ascProj.y - 4);
                ctx.lineTo(ascProj.x + 3, ascProj.y + 2);
                ctx.lineTo(ascProj.x - 3, ascProj.y + 2);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }

            if (this.isLeftOfPeri(-this.argPeriapsis + Math.PI)) {
                let descProj = Complex.projectFrom3d(this.descending.timesVector(yawPitch, roll).plus(translation), camera);
                ctx.beginPath();
                ctx.moveTo(descProj.x, descProj.y + 4);
                ctx.lineTo(descProj.x + 3, descProj.y - 2);
                ctx.lineTo(descProj.x - 3, descProj.y - 2);
                ctx.closePath();
                ctx.stroke();
            }


            let lineStart = this.ascending;
            let lineEnd = this.descending;
            if (!this.isLeftOfPeri(-this.argPeriapsis)) lineStart = new Vector(0, 0, 0);
            if (!this.isLeftOfPeri(-this.argPeriapsis + Math.PI)) lineEnd = new Vector(0, 0, 0);

            this.ascDescLine = [];
            for (let i = 0; i <= 100; i++) {
                let position = lineEnd.minus(lineStart).over(100).times(i).plus(lineStart);
                this.ascDescLine.push(position);
            }

            ctx.setLineDash([1, 10]);
            for (let i = 0; i < this.ascDescLine.length - 1; i++) {
                let start = Complex.projectFrom3d(this.ascDescLine[i].timesVector(yawPitch, roll).plus(translation), camera);
                let end = Complex.projectFrom3d(this.ascDescLine[i + 1].timesVector(yawPitch, roll).plus(translation), camera);

                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
            }
            ctx.setLineDash([]);
        }
    }
}