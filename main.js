'use strict';

function main() {

    let sun = new Celestial(
        'Sun',
        695700,
        1988470
    );

    let mercury = new Celestial(
        'Mercury',
        2439.4,
        0.330103,
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
        4.86731,
        sun,
        new Orbit(
            0.72333566 * 149598073,
            0.00677672,
            Math.PI / 180 * 76.67984255,
            Math.PI / 180 * 3.39467605,
            Math.PI / 180 * 54.92262463
        ),
        Math.PI / 180 * 181.97909950
    );
    let earth = new Celestial(
        'Earth',
        6371.0084,
        5.97217,
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
        0.641691,
        sun,
        new Orbit(
            1.52371034 * 149598073,
            0.09339410,
            Math.PI / 180 * 49.55953891,
            Math.PI / 180 * 1.84969142,
            Math.PI / 180 * -73.5031685
        ),
        Math.PI / 180 * -4.55343205
    );
    let jupiter = new Celestial(
        'Jupiter',
        69911,
        1898.125,
        sun,
        new Orbit(
            5.20288700 * 149598073,
            0.04838624,
            Math.PI / 180 * 100.47390909,
            Math.PI / 180 * 1.30439695,
            Math.PI / 180 * -85.74542926
        ),
        Math.PI / 180 * 34.39644051
    );
    let saturn = new Celestial(
        'Saturn',
        58232,
        568.317,
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
        86.8099,
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
        102.4092,
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
        0.0734767309,
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
        0,
        earth,
        new Orbit(
            9000,
            0.01,
            Math.PI / 180 * -45,
            Math.PI / 180 * 10,
            Math.PI / 180 * -120
        ),
        Math.PI / 180 * 30
    );

    let ship = new Ship(
        'Ship',
        0.01,
        0,
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
        iss,
        ship
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


    let camera = new Camera(ship);


    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById('canvas');
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

        camera.changeCenter(centerTarget ? ship.target : ship);
    });


    let holdedKeys = new Set();
    canvas.addEventListener('keydown', (event) => { holdedKeys.add(event.key.toLowerCase()); });
    canvas.addEventListener('keyup', (event) => { holdedKeys.delete(event.key.toLowerCase()); });


    setInterval(() => {

        let thrust = 0.01;
        if (holdedKeys.has('shift')) thrust = 0.001;
        if (holdedKeys.has('w')) ship.thrust(thrust, 0, 0);
        if (holdedKeys.has('s')) ship.thrust(-thrust, 0, 0);
        if (holdedKeys.has('a')) ship.thrust(0, thrust, 0);
        if (holdedKeys.has('d')) ship.thrust(0, -thrust, 0);
        if (holdedKeys.has('r')) ship.thrust(0, 0, thrust);
        if (holdedKeys.has('f')) ship.thrust(0, 0, -thrust);

        celestials.forEach((celestial) => { celestial.updateVelocity(timeSpeed, sun, earth, moon); });
        celestials.forEach((celestial) => { celestial.updatePosition(timeSpeed); });
        celestials.forEach((celestial) => { celestial.updateOrbit(); });
        celestials.forEach((celestial) => { celestial.updateRelativeOrbit(); });
        celestials.forEach((celestial) => { celestial.updateApproachTrajectory(); });

        camera.update();

        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        celestials.forEach((celestial) => {
            celestial.draw(
                camera,
                celestial.label == ship.target?.label,
                enableApproachTrajectory,
            );
        });


        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px monospace';

        let label = [];
        label.push('         Time Speed [,][.][/] : ' + 'x' + Math.floor(10 ** (timeSpeed / 2)));
        label.push('');
        label.push('    Reference Frame [i][k]    : ' + ship.primary.label);
        label.push('             Target [j][l][;] : ' + ship.target.label);
        label.push('Approach Trajectory [h]       : ' + (enableApproachTrajectory ? 'On' : 'Off'));
        label.push('       Camera Focus [n]       : ' + (centerTarget ? 'Target' : 'Ship'));
        label.push('');
        label.push('');
        label.push('                        Ship\'s Orbit');
        label.push('                     -------------------');
        label.push('                      Primary : ' + ship.primary.label);
        label.push('             Primary\'s Radius : ' + round(ship.primary.radius, 2) + ' km');
        label.push('               Primary\'s Mass : ' + round(ship.primary.mass, 4) + ' x 10^24');
        label.push('');
        label.push('              Semi Major Axis : ' + (ship.orbit.semiMajorAxis > 0 ? (round(ship.orbit.semiMajorAxis, 2) + ' km') : '∞'));
        label.push('                 Eccentricity : ' + round(ship.orbit.eccentricity, 4));
        label.push('  Longitude of Ascending Node : ' + round(ship.orbit.longAscending / Math.PI * 180, 2) + '°');
        label.push('                  Inclination : ' + round(ship.orbit.inclination / Math.PI * 180, 2) + '°');
        label.push('        Argument of Periapsis : ' + round(ship.orbit.argPeriapsis / Math.PI * 180, 2) + '°');
        label.push('');
        label.push('                 True Anomaly : ' + round(ship.trueAnomaly / Math.PI * 180, 2) + '°');
        label.push('                     Distance : ' + round(ship.position.minus(ship.primary.position).magnitude(), 2) + ' km');
        label.push('                Orbital Speed : ' + round(ship.velocity.minus(ship.primary.velocity).magnitude() * 60, 2) + ' km/s');
        label.push('');
        label.push('                    Periapsis : ' + round(ship.orbit.periapsis.magnitude(), 2) + ' km');
        label.push('                     Apoapsis : ' + round(ship.orbit.apoapsis.magnitude(), 2) + ' km');
        label.push('');
        label.push('');
        label.push('                      Relative to Target');
        label.push('                     -------------------');
        label.push('                       Target : ' + ship.target.label);
        label.push('              Target\'s Radius : ' + round(ship.target.radius, 2) + ' km');
        label.push('                Target\'s Mass : ' + round(ship.target.mass, 4) + ' x 10^24');
        label.push('');
        label.push('         Relative Inclination : ' + round(ship.relativeOrbit.inclination / Math.PI * 180, 2) + '°');
        label.push('');
        label.push('                     Distance : ' + round(ship.target.position.minus(ship.position).magnitude(), 2) + ' km');
        label.push('               Relative Speed : ' + round(ship.target.velocity.minus(ship.velocity).magnitude() * 60, 2) + ' km/s');
        label.push('');
        label.push('             Closest Approach : ' + ((ship.target.label != ship.primary.label) ? (round(ship.closestApproach.magnitude(), 2) + ' km') : 'n/a'));
        label.push('               Approach Speed : ' + ((ship.target.label != ship.primary.label) ? (round(ship.approachSpeed * 60, 2) + ' km/s') : 'n/a'));
        label.push('');
        label.push('');
        label.push('');
        label.push('');
        label.push('           Prograde [w]');
        label.push('         Retrograde [s]');
        label.push('          Radial In [a]');
        label.push('         Radial Out [d]');
        label.push('             Normal [r]');
        label.push('        Anti Normal [f]');

        for (let i = 0; i < label.length; i++) { ctx.fillText(label[i], 5, 15 + 15 * i) }

    }, 1000 / 60);
}

function round(number, digit) {
    return (Math.round(number * 10 ** digit) / 10 ** digit).toLocaleString('en-US', { maximumFractionDigits: 9 });
}