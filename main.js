'use strict';



function main() {

    let camA = 0 - Math.PI / 6;
    let camB = 0 - Math.PI / 6;
    let camC = 0;
    let camZ = 0;

    addMouseListener((event) => {
        camA += event.movementX / 200;
        camB -= event.movementY / 200;
    }, (event) => {
        camZ += event.deltaY;
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



        let scretVenusV = venusV.overPoint(venusPos.unit(), venusV);
        let scretEarthV = earthV.overPoint(earthPos.unit(), earthV);
        let scretMarsV = marsV.overPoint(marsPos.unit(), marsV);

        scretVenusV = new Point(scretVenusV.x * 0, scretVenusV.y * 1, scretVenusV.z * 0);
        scretEarthV = new Point(scretEarthV.x * 0, scretEarthV.y * 1, scretEarthV.z * 0);
        scretMarsV = new Point(scretMarsV.x * 0, scretMarsV.y * 1, scretMarsV.z * 0);



        let scretVV = Math.sqrt(100 * (2 / venusPos.magnitude() - 1 / 400));
        // scretVV = scretVV.overPoint(venusPos.unit(),scretVV);

        let least = Math.sqrt(100 * (2 / 100 - 1 / 400));
        let most = Math.sqrt(100 * (2 / 300 - 1 / 400));



        let logPos2x = new Point((least + (most - least) * -Math.cos(i / 5000 * 2 * Math.PI)) * 400, (Math.atan2(venusPos.y, venusPos.x) / Math.PI * 400 + 800) % 800 - 400, 0);
        logPoses2.push(logPos2x);


        let logPos = new Point(venusPos.magnitude() * 0 + 40000 * scretVenusV.magnitude() / venusPos.magnitude(), (Math.atan2(venusPos.y, venusPos.x) / Math.PI * 400 + 800) % 800 - 400, -100);
        logPoses.push(logPos);
        // let logPos2 = new Point(earthPos.magnitude() *0+40000* earthV.magnitude()/earthPos.magnitude(), (Math.atan2(earthPos.y, earthPos.x) / Math.PI * 400 + 800) % 800 - 400, 0);
        // logPoses2.push(logPos2);
        let logPos3 = new Point(marsPos.magnitude() * 0 + 40000 * marsV.magnitude() / marsPos.magnitude(), (Math.atan2(marsPos.y, marsPos.x) / Math.PI * 400 + 800) % 800 - 400, 100);
        logPoses3.push(logPos3);
    }

    let venusTraj = new Line(venusPoses);
    let earthTraj = new Line(earthPoses);
    let marsTraj = new Line(marsPoses);

    // let shipTraj = new Line(shipPoses);
    // let marsShipTraj = new Line(marsShipPoses);

    let logTraj = new Line(logPoses);
    let logTraj2 = new Line(logPoses2);
    let logTraj3 = new Line(logPoses3);









    let objs = [];




    // let box = [];
    // let size = 1000;
    // for (let x = -size / 2; x <= size / 2; x += size / 1) {
    //     for (let y = -size / 2; y <= size / 2; y += size / 1) {
    //         for (let z = -size / 2; z <= size / 2; z += size / 1) {
    //             if (x < size / 2) box.push(new Line([new Point(x, y, z), new Point(x + size / 1, y, z)]));
    //             if (y < size / 2) box.push(new Line([new Point(x, y, z), new Point(x, y + size / 1, z)]));
    //             if (z < size / 2) box.push(new Line([new Point(x, y, z), new Point(x, y, z + size / 1)]));
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

    objs.push(logTraj);
    objs.push(logTraj2);
    objs.push(logTraj3);





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
        objs.forEach((obj) => { obj.draw(camA, camB, camC, camZ); });

        frame += 20;
        frame %= 5000;
    }, 10);
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
