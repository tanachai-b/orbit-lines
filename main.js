'use strict';

function main() {

    let sun = new Celestial(
        'Sun',
        695700,
        1988470 * 10 ** 24
    );

    let mercury = new Celestial(
        'Mercury',
        2439.4,
        0.330103 * 10 ** 24,
        sun,
        new Orbit(
            0.38709927 * 149598073,
            0.20563593,
            Math.PI / 180 * 48.33076593,
            Math.PI / 180 * 7.00497902,
            Math.PI / 180 * 29.12703035
        ),
        Math.PI / 180 * 252.25032350
    );
    let venus = new Celestial(
        'Venus',
        6051.8,
        4.86731 * 10 ** 24,
        sun,
        new Orbit(
            0.72333566 * 149598073,
            0.00677672,
            Math.PI / 180 * 76.67984255,
            Math.PI / 180 * 3.39467605,
            Math.PI / 180 * 54.92262463
        ),
        Math.PI / 180 * (181.97909950 + 210)
    );
    let earth = new Celestial(
        'Earth',
        6371.0084,
        5.97217 * 10 ** 24,
        sun,
        new Orbit(
            1.00000261 * 149598073,
            0.01671123,
            Math.PI / 180 * 0.0,
            Math.PI / 180 * -0.00001531,
            Math.PI / 180 * 102.9376819
        ),
        Math.PI / 180 * 100.46457166
    );
    let mars = new Celestial(
        'Mars',
        3389.50,
        0.641691 * 10 ** 24,
        sun,
        new Orbit(
            1.52371034 * 149598073,
            0.09339410,
            Math.PI / 180 * 49.55953891,
            Math.PI / 180 * 1.84969142,
            Math.PI / 180 * -73.5031685
        ),
        Math.PI / 180 * (-4.55343205 + 90)
    );
    let jupiter = new Celestial(
        'Jupiter',
        69911,
        1898.125 * 10 ** 24,
        sun,
        new Orbit(
            5.20288700 * 149598073,
            0.04838624,
            Math.PI / 180 * 100.47390909,
            Math.PI / 180 * 1.30439695,
            Math.PI / 180 * -85.74542926
        ),
        Math.PI / 180 * (34.39644051 + 90)
    );
    let saturn = new Celestial(
        'Saturn',
        58232,
        568.317 * 10 ** 24,
        sun,
        new Orbit(
            9.53667594 * 149598073,
            0.05386179,
            Math.PI / 180 * 113.66242448,
            Math.PI / 180 * 2.48599187,
            -21.06354617
        ),
        Math.PI / 180 * 49.95424423
    );
    let uranus = new Celestial(
        'Uranus',
        25362,
        86.8099 * 10 ** 24,
        sun,
        new Orbit(
            19.18916464 * 149598073,
            0.04725744,
            Math.PI / 180 * 74.01692503,
            Math.PI / 180 * 0.77263783,
            96.93735127
        ),
        Math.PI / 180 * 313.23810451
    );
    let neptune = new Celestial(
        'Neptune',
        24622,
        102.4092 * 10 ** 24,
        sun,
        new Orbit(
            30.06992276 * 149598073,
            0.00859048,
            Math.PI / 180 * 131.78422574,
            Math.PI / 180 * 1.77004347,
            -86.81946347
        ),
        Math.PI / 180 * -55.12002969
    );

    let moon = new Celestial(
        'Moon',
        1737.4,
        0.0734767309 * 10 ** 24,
        earth,
        new Orbit(
            0.00256955529 * 149598073,
            0.0554,
            Math.PI / 180 * 125.08,
            Math.PI / 180 * 5.16,
            Math.PI / 180 * 318.15
        ),
        Math.PI / 180 * 135.27
    );
    let iss = new Celestial(
        'ISS',
        0.01,
        417289,
        earth,
        new Orbit(
            6738,
            0.0005712,
            Math.PI / 180 * 251.0393,
            Math.PI / 180 * 51.6418,
            Math.PI / 180 * 111.8962
        ),
        Math.PI / 180 * 350.5311
    );

    let ship = new Ship(
        'Ship',
        0.005,
        7120,
        earth,
        new Orbit(
            8000,
            0.05,
            Math.PI / 180 * 15,
            Math.PI / 180 * 10,
            Math.PI / 180 * -45
        ),
        Math.PI / 180 * 90
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
        iss
    ];

    sun.satellites.push(mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);
    earth.satellites.push(iss, moon);


    let timeSpeed = 0;

    ship.setFrame(earth);

    let targets = earth.satellites;
    let targetIndex = 0;
    ship.setTarget(earth);

    let enableApproachTrajectory = false;
    let centerTarget = false;


    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById('canvas');

    let camera1 = new Camera(
        ship.primary,
        0, -Math.PI / 2, 0,
        0, 0, canvas.width / 2, canvas.height / 2
    );
    let camera2 = new Camera(
        ship.primary,
        -Math.PI / 2, 0, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2
    );
    let camera3 = new Camera(
        ship.primary,
        0, 0, 0,
        0, canvas.height / 2, canvas.width / 2, canvas.height / 2
    );


    canvas.focus();
    canvas.addEventListener('keypress', (event) => {

        switch (event.key) {
            case ',': timeSpeed--; break;
            case '.': timeSpeed++; break;
            case '/': timeSpeed = 0; break;

            case 'i':
                if (ship.primary.primary != null) {
                    for (let i = 0; i < ship.primary.primary.satellites.length; i++) {
                        if (ship.primary.label == ship.primary.primary.satellites[i].label) { targetIndex = i; }
                    }
                    ship.setFrame(ship.primary.primary);
                    targets = ship.primary.satellites;
                }
                break;
            case 'k':
                ship.setFrame(ship.target);
                targets = ship.primary.satellites;
                break;

            case 'j': targetIndex--; break;
            case 'l': targetIndex++; break;
            case ';': targetIndex = 0; break;

            case 'h': enableApproachTrajectory = !enableApproachTrajectory; break;
            case 'n': centerTarget = !centerTarget; break;
        }

        timeSpeed = Math.max(timeSpeed, 0);

        targetIndex += targets.length;
        targetIndex %= targets.length;
        ship.setTarget(targets[targetIndex]);

        camera1.changeCenter(centerTarget ? ship.target : ship.primary);
        camera2.changeCenter(centerTarget ? ship.target : ship.primary);
        camera3.changeCenter(centerTarget ? ship.target : ship.primary);
    });


    let holdedKeys = new Set();
    canvas.addEventListener('keydown', (event) => { holdedKeys.add(event.key.toLowerCase()); });
    canvas.addEventListener('keyup', (event) => { holdedKeys.delete(event.key.toLowerCase()); });


    let timeElapsed = 0;

    setInterval(() => {

        let thrust = 0.0001;
        if (holdedKeys.has('shift')) thrust *= 0.1;
        if (holdedKeys.has('w')) ship.thrust(thrust, 0, 0);
        if (holdedKeys.has('s')) ship.thrust(-thrust, 0, 0);
        if (holdedKeys.has('a')) ship.thrust(0, thrust, 0);
        if (holdedKeys.has('d')) ship.thrust(0, -thrust, 0);
        if (holdedKeys.has('r')) ship.thrust(0, 0, thrust);
        if (holdedKeys.has('f')) ship.thrust(0, 0, -thrust);

        celestials.forEach((celestial) => { celestial.updateVelocity(timeSpeed); });
        ship.updateVelocity(timeSpeed, celestials);

        celestials.forEach((celestial) => { celestial.updatePosition(timeSpeed); });
        ship.updatePosition(timeSpeed);
        ship.updateOrbit();
        ship.updateRelativeOrbit();
        ship.updateApproachTrajectory();

        camera1.update();
        camera2.update();
        camera3.update();


        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ship.draw([camera1, camera2, camera3], enableApproachTrajectory);
        celestials.forEach((celestial) => {
            celestial.draw(
                [camera1, camera2, camera3],
                celestial.label == ship.target.label,
                celestial.label == ship.primary.label
            );
        });


        ctx.strokeStyle = '#888888';
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 + 0.5, 0);
        ctx.lineTo(canvas.width / 2 + 0.5, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2 + 0.5);
        ctx.lineTo(canvas.width, canvas.height / 2 + 0.5);
        ctx.stroke();


        ctx.fillStyle = '#888888';
        ctx.font = '12px monospace';

        let leftHUD = [];
        leftHUD.push(`               Time Elapsed : ${time(timeElapsed)}`);
        leftHUD.push('');
        leftHUD.push('');
        leftHUD.push(`       Time Speed [,][.][/] : x 10^${timeSpeed / 2}`);
        leftHUD.push('');
        leftHUD.push(`  Reference Frame [i][k]    : ${ship.primary.label}`);
        leftHUD.push(`           Target [j][l][;] : ${ship.target.label}`);
        leftHUD.push('');
        leftHUD.push('');
        leftHUD.push('                      Ship\'s Orbit');
        leftHUD.push('                   -------------------');
        leftHUD.push(`                    Primary : ${ship.primary.label}`);
        leftHUD.push(`           Primary\'s Radius : ${round(ship.primary.radius, 2)} km`);
        leftHUD.push(`             Primary\'s Mass : ${round(ship.primary.mass / 10 ** 24, 4)} x 10^24 kg`);
        leftHUD.push('');
        leftHUD.push(`            Semi Major Axis : ${ship.orbit.semiMajorAxis > 0 ? (round(ship.orbit.semiMajorAxis, 2) + ' km') : '∞'}`);
        leftHUD.push(`               Eccentricity : ${round(ship.orbit.eccentricity, 4)}`);
        leftHUD.push(`Longitude of Ascending Node : ${round(ship.orbit.longAscending / Math.PI * 180, 2)}°`);
        leftHUD.push(`                Inclination : ${round(ship.orbit.inclination / Math.PI * 180, 2)}°`);
        leftHUD.push(`      Argument of Periapsis : ${round(ship.orbit.argPeriapsis / Math.PI * 180, 2)}°`);
        leftHUD.push('');
        leftHUD.push(`             Orbital Period : ${time(ship.period)}`);
        leftHUD.push(`                  Periapsis : ${round(ship.orbit.periapsis.magnitude(), 2)} km`);
        leftHUD.push(`                   Apoapsis : ${round(ship.orbit.apoapsis.magnitude(), 2)} km`);
        leftHUD.push('');
        leftHUD.push(`               True Anomaly : ${round(ship.trueAnomaly / Math.PI * 180, 2)}°`);
        leftHUD.push(`                   Distance : ${round(ship.position.minus(ship.primary.position).magnitude(), 2)} km`);
        leftHUD.push(`              Orbital Speed : ${round(ship.velocity.minus(ship.primary.velocity).magnitude() * 60, 2)} km/s`);
        leftHUD.push('');
        leftHUD.push('');
        leftHUD.push('                    Relative to Target');
        leftHUD.push('                   -------------------');
        leftHUD.push(`                     Target : ${ship.target.label}`);
        leftHUD.push(`            Target\'s Radius : ${round(ship.target.radius, 2)} km`);
        leftHUD.push(`              Target\'s Mass : ${round(ship.target.mass / 10 ** 24, 4)} x 10^24 kg`);
        leftHUD.push('');
        leftHUD.push(`       Relative Inclination : ${(ship.target.orbit != null) ? (round(ship.relativeOrbit.inclination / Math.PI * 180, 2) + '°') : 'n/a'}`);
        leftHUD.push('');
        leftHUD.push(`                   Distance : ${(ship.target.label != ship.primary.label) ? (round(ship.target.position.minus(ship.position).magnitude(), 2) + ' km') : 'n/a'}`);
        leftHUD.push(`             Relative Speed : ${(ship.target.label != ship.primary.label) ? (round(ship.target.velocity.minus(ship.velocity).magnitude() * 60, 2) + ' km/s') : 'n/a'}`);
        leftHUD.push('');
        leftHUD.push(`           Closest Approach : ${(ship.target.label != ship.primary.label) ? (round(ship.closestApproach.magnitude(), 2) + ' km') : 'n/a'}`);
        leftHUD.push(`             Approach Speed : ${(ship.target.label != ship.primary.label) ? (round(ship.approachSpeed * 60, 2) + ' km/s') : 'n/a'}`);
        leftHUD.push(` Estimated Time to Approach : ${(ship.target.label != ship.primary.label) ? (time(ship.approachTime)) : 'n/a'}`);
        leftHUD.push('');
        leftHUD.push('');
        leftHUD.push('');
        leftHUD.push('');
        leftHUD.push(`    Approach Trajectory [h] : ${enableApproachTrajectory ? 'On' : 'Off'}`);
        leftHUD.push(`           Camera Focus [n] : ${centerTarget ? 'Target' : 'Ship'}`);
        leftHUD.push('');
        leftHUD.push('               Prograde [w]');
        leftHUD.push('             Retrograde [s]');
        leftHUD.push('              Radial In [a]');
        leftHUD.push('             Radial Out [d]');
        leftHUD.push('                 Normal [r]');
        leftHUD.push('            Anti Normal [f]');
        for (let i = 0; i < leftHUD.length; i++) { ctx.fillText(leftHUD[i], 10, 20 + 15 * i) }

        let rightHUD = [];
        rightHUD.push(`                      ${getChevronText('Sun')}`);
        rightHUD.push(`                        ${getChevronText('Mercury')}`);
        rightHUD.push(`                        ${getChevronText('Venus')}`);
        rightHUD.push(`                        ${getChevronText('Earth')}`);
        rightHUD.push(`                          ${getChevronText('ISS')}`);
        rightHUD.push(`                          ${getChevronText('Moon')}`);
        rightHUD.push(`                        ${getChevronText('Mars')}`);
        rightHUD.push(`                        ${getChevronText('Jupiter')}`);
        rightHUD.push(`                        ${getChevronText('Saturn')}`);
        rightHUD.push(`                        ${getChevronText('Uranus')}`);
        rightHUD.push(`                        ${getChevronText('Neptune')}`);
        for (let i = 0; i < rightHUD.length; i++) { ctx.fillText(rightHUD[i], 1600, 20 + 15 * i) }


        timeElapsed += (1 / 60) * 10 ** (timeSpeed / 2);

    }, 1000 / 60);

    function getChevronText(blody) {
        return `${(ship.primary.label == blody) ? '>>' : (ship.target.label == blody) ? ' >' : '  '} ${blody}`;
    }
}

function round(number, digit) {
    return (Math.round(number * 10 ** digit) / 10 ** digit).toLocaleString('en-US', { maximumFractionDigits: 9 });
}

function time(time) {

    let second = 1;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let year = day * 365;

    let years = `${Math.floor(time / year)}`.padStart(0);
    let days = `${Math.floor((time % year) / day)}`.padStart(3);
    let hours = `${Math.floor((time % day) / hour)}`.padStart(2);
    let minutes = `${Math.floor((time % hour) / minute)}`.padStart(2);
    let seconds = `${Math.floor((time % minute) / second)}`.padStart(2);

    let result = '';
    if (years > 0) result += `${years}y `;
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (true) result += `${seconds}s `;

    return result.trim();
}