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

    let ship = new Ship(
        'Ship',
        0.01,
        0,
        earth,
        new Orbit(
            8000,
            0.05,
            Math.PI / 180 * 15,
            Math.PI / 180 * 1,
            Math.PI / 180 * -45
        ),
        Math.PI / 180 * 90
    );

    let iss = new Celestial(
        'ISS',
        0.01,
        0,
        earth,
        new Orbit(
            10000,
            0.01,
            Math.PI / 180 * -45,
            Math.PI / 180 * 1,
            Math.PI / 180 * -120
        ),
        Math.PI / 180 * 30
    );

    let celestials = [
        sun,
        mercury,
        venus,
        earth,
        ship,
        iss,
        moon,
        mars,
        jupiter,
        saturn,
        uranus,
        neptune,
    ];


    let timeSpeed = 0;

    let camera = new Camera(ship);
    let focusIndex = 4;


    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById('canvas');
    canvas.focus();
    canvas.addEventListener('keypress', (event) => {
        switch (event.key) {
            case '[': focusIndex--; break;
            case ']': focusIndex++; break;
            case '\\': focusIndex = 4; break;
            case ',': timeSpeed--; break;
            case '.': timeSpeed++; break;
            case '/': timeSpeed = 0; break;
        }

        timeSpeed = Math.max(timeSpeed, 0);

        focusIndex += celestials.length;
        focusIndex %= celestials.length;
        camera.changeFocus(celestials[focusIndex]);
    });


    let keys = new Set();
    canvas.addEventListener('keydown', (event) => { keys.add(event.key.toLowerCase()); });
    canvas.addEventListener('keyup', (event) => { keys.delete(event.key.toLowerCase()); });


    setInterval(() => {

        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        celestials.forEach((celestial) => { celestial.draw(camera, camera.focus.label == celestial.label); });


        celestials.forEach((celestial) => { celestial.updateVelocity(timeSpeed); });
        celestials.forEach((celestial) => { celestial.updatePosition(timeSpeed); });
        celestials.forEach((celestial) => { celestial.updateOrbit(); });

        camera.update();

        if (keys.has('shift')) {
            if (keys.has('w')) ship.thrust(0.001, 0, 0);
            if (keys.has('s')) ship.thrust(-0.001, 0, 0);
            if (keys.has('a')) ship.thrust(0, 0.001, 0);
            if (keys.has('d')) ship.thrust(0, -0.001, 0);
            if (keys.has('r')) ship.thrust(0, 0, -0.001);
            if (keys.has('f')) ship.thrust(0, 0, 0.001);
        } else {
            if (keys.has('w')) ship.thrust(0.01, 0, 0);
            if (keys.has('s')) ship.thrust(-0.01, 0, 0);
            if (keys.has('a')) ship.thrust(0, 0.01, 0);
            if (keys.has('d')) ship.thrust(0, -0.01, 0);
            if (keys.has('r')) ship.thrust(0, 0, -0.01);
            if (keys.has('f')) ship.thrust(0, 0, 0.01);
        }

    }, 1000 / 60);
}