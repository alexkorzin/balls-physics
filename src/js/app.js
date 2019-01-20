import Mouse from './Mouse'
import Ball from './Ball';
import {playSound} from './sound';

// ======Canvas======
let screen = {
    height: window.innerHeight,
    width: window.innerWidth
}
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.height = screen.height;
canvas.width = screen.width;

console.log(canvas.height)

// ======Control Vars======
let mouseBallRadius = 50;
let conter = document.querySelector('.count');
let count = 0;
let mouseBallColor = '#00adb5';
let ballsColor = '#f8b500';
let ballsCount = 100;

// ======Get random number function======
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// ======Each ball colision function======
function ballsColision(ballCurrent, ball) {
    for (let j = 0; j < balls.length; j++) {
        if (j !== ballCurrent) {
            let is = ball.phys(balls[j], mouse);
            if (is) {
                count++;
                conter.innerHTML= count;
                playSound('bulk', {volume: .1})
            } 
        }
        else {
            continue
        }
    }
}

// ======Mouse ball======
let mouse = new Mouse(canvas);
let mouseBall = new Ball({
    x: mouse.x,
    y: mouse.y,
    radius: mouseBallRadius,
    color: mouseBallColor
});

// ======Create little balls======
let balls = [];
for (let i = 0; i < ballsCount; i++) {
    let radius = getRandomArbitrary(5, 20);
    let newBallCoords = {};
    newBallCoords = {
        x: getRandomArbitrary(radius, window.innerWidth - radius),
        y: getRandomArbitrary(radius, window.innerHeight - radius),
    }
    // ======Check if balls overlaping======
    if (i != 0) {
        for (let j = 0; j < balls.length; j++) {
            if (balls[0].getDistance(newBallCoords, balls[j]) < balls[j].radius + radius) {
                newBallCoords.x = getRandomArbitrary(radius, window.innerWidth - radius);
                newBallCoords.y = getRandomArbitrary(radius, window.innerHeight - radius);
                j = -1;
            }
        }
    }
    balls.push(new Ball({
        color: ballsColor,
        radius: radius,
        x: newBallCoords.x,
        y: newBallCoords.y
    }));
}

function Render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mouseBall.updatePos(mouse.x, mouse.y);
    mouseBall.draw(ctx, 'fill')

    balls.forEach((ball, ballCurrent) => {

        ballsColision(ballCurrent, ball);
        ball.phys(mouseBall, mouse);
        ball.speed();
        ball.sideColision(canvas);
        ball.frict();

        ball.draw(ctx, 'fill');
    })
    window.requestAnimationFrame(Render);
}

Render();
