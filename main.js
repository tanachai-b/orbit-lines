'use strict';



function main() {

    let ra = 0 - Math.PI / 6;
    let rb = 0 - Math.PI / 6;
    let rc = 0;

    addMouseListener((event) => {
        ra += event.movementX / 200;
        rb -= event.movementY / 200;
    });





    let sunPos = new Point(0, 0, 0);

    let venusPos = new Point(100 * Math.cos(Math.PI * 0), 100 * Math.sin(Math.PI * 0), 0);
    let venusV = new Point(-1.32265 * Math.sin(Math.PI * 0), 1.32265 * Math.cos(Math.PI * 0), 0);
    let venusA = new Point(0, 0, 0);

    let earthPos = new Point(200 * Math.cos(Math.PI * 0 / 6), 200 * Math.sin(Math.PI * 0 / 6), 0);
    let earthV = new Point(-0.8658 * Math.sin(Math.PI * 0 / 6), 0.8658 * Math.cos(Math.PI * 0 / 6), 0);
    let earthA = new Point(0, 0, 0);

    let marsPos = new Point(400 * Math.cos(Math.PI * 0 / 6), 400 * Math.sin(Math.PI * 0 / 6), 0);
    let marsV = new Point(-0.5 * Math.sin(Math.PI * 0 / 6), 0.5 * Math.cos(Math.PI * 0 / 6), 0);
    let marsA = new Point(0, 0, 0);


    let shipPos = new Point(341.222498 * Math.cos(Math.PI * 0), 341.222498 * Math.sin(Math.PI * 0), 5);
    let shipV = new Point(-0.45 * Math.sin(Math.PI * 0), 0.45 * Math.cos(Math.PI * 0), 0);
    let shipA = new Point(0, 0, 0);




    let sun = sunPos.copy();

    let venus = venusPos.copy();
    let earth = earthPos.copy();
    let mars = marsPos.copy();
    // let ship = shipPos.copy();

    let venusPoses = [venusPos];
    let earthPoses = [earthPos];
    let marsPoses = [marsPos];
    // let shipPoses = [shipPos];

    let marsShipPoses = [];
    let marsVs = [marsV];


    let log = new Point(0, 0, 0);
    let logPoses = [];
    let log2 = new Point(0, 0, 0);
    let logPoses2 = [];
    let log3 = new Point(0, 0, 0);
    let logPoses3 = [];


    for (let i = 0; i < 5000; i++) {

        venusA = sunPos.minus(venusPos).over(Math.pow(sunPos.minus(venusPos).magnitude(), 3)).times(100);
        venusV = venusV.plus(venusA);
        venusPos = venusPos.plus(venusV);
        venusPoses.push(venusPos);

        earthA = sunPos.minus(earthPos).over(Math.pow(sunPos.minus(earthPos).magnitude(), 3)).times(100);
        earthV = earthV.plus(earthA);
        earthPos = earthPos.plus(earthV);
        earthPoses.push(earthPos);

        marsA = sunPos.minus(marsPos).over(Math.pow(sunPos.minus(marsPos).magnitude(), 3)).times(100);
        marsV = marsV.plus(marsA);
        marsPos = marsPos.plus(marsV);
        marsPoses.push(marsPos);

        // shipA = sunPos.minus(shipPos).unit().divide(Math.pow(sunPos.minus(shipPos).mag(), 2)).times(100);
        // // shipA = shipA.plus(venusPos.minus(shipPos).unit().divide(Math.pow(venusPos.minus(shipPos).mag(), 2)).times(1));
        // // shipA = shipA.plus(earthPos.minus(shipPos).unit().divide(Math.pow(earthPos.minus(shipPos).mag(), 2)).times(1));
        // shipA = shipA.plus(marsPos.minus(shipPos).unit().divide(Math.pow(marsPos.minus(shipPos).mag(), 2)).times(1));
        // shipV = shipV.plus(shipA);
        // shipPos = shipPos.plus(shipV);
        // shipPoses.push(shipPos);


        // let marsShipPos = shipPos.minus(marsPos);
        // marsShipPos = marsShipPos.dividePoint(marsPos.unit(), marsV);
        // marsShipPoses.push(marsShipPos);
        // marsVs.push(marsV);


        let logPos = new Point(venusV.magnitude() * venusPos.magnitude(), 0, 0);
        logPoses.push(logPos);
        let logPos2 = new Point(earthV.magnitude() * earthPos.magnitude(), 20, 0);
        logPoses2.push(logPos2);
        let logPos3 = new Point(marsV.magnitude() * marsPos.magnitude(), 40, 0);
        logPoses3.push(logPos3);
    }

    let venusTraj = new Line(venusPoses);
    let earthTraj = new Line(earthPoses);
    let marsTraj = new Line(marsPoses);
    // let shipTraj = new Line(shipPoses);

    // let marsShipTraj = new Line(marsShipPoses);









    let objs = [];




    // let box = [];
    // let size = 400;
    // for (let x = -size / 2; x <= size / 2; x += size) {
    //     for (let y = -size / 2; y <= size / 2; y += size) {
    //         for (let z = -size / 2; z <= size / 2; z += size) {
    //             box.push(new Point(x, y, z));
    //         }
    //     }
    // }
    // objs = objs.concat(box);






    objs.push(sun);

    objs.push(venus);
    objs.push(earth);
    objs.push(mars);
    // objs.push(ship);

    objs.push(venusTraj);
    objs.push(earthTraj);
    objs.push(marsTraj);


    // objs.push(shipTraj);
    // objs.push(marsShipTraj);

    objs.push(log);
    objs.push(log2);
    objs.push(log3);




    objs.push(new Complex(200, 100));
    objs.push(new Complex(200, 100).over(new Complex(10, 10)));



    let frame = 0;
    setInterval(() => {

        venus.set(venusPoses[frame]);
        earth.set(earthPoses[frame]);
        mars.set(marsPoses[frame]);
        // ship.set(shipPoses[frame]);


        // let cadiz = [];
        // for (let i = 0; i < marsShipPoses.length; i++) {
        //     // cadiz.push(marsShipPoses[i].plus(marsPoses[frame]));
        //     cadiz.push(marsShipPoses[i].timesPoint(marsPoses[frame].unit(), marsVs[frame]).plus(marsPoses[frame]));
        // }
        // marsShipTraj.set(cadiz);

        log.set(logPoses[frame]);
        log2.set(logPoses2[frame]);
        log3.set(logPoses3[frame]);



        /** @type {HTMLCanvasElement} */
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        objs.forEach((obj) => { obj.draw(ra, rb, rc); });

        frame += 10;
        frame %= 5000;
    }, 10);
}

function addMouseListener(onMove) {

    let mButtons = 0;

    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', (event) => { mButtons = event.buttons; });
    canvas.addEventListener('mouseup', (event) => { mButtons = event.buttons; });
    canvas.addEventListener('mouseleave', (event) => { mButtons = event.buttons; });
    canvas.addEventListener('mouseenter', (event) => { mButtons = event.buttons; });
    canvas.addEventListener('mousemove', (event) => { if (mButtons == 1) onMove(event); });
}
