import * as TWEEN from '@tweenjs/tween.js';

const box = document.getElementById('box');
const coords = { x: 0, y: 0 };
let tween, tweenChain;

function init() {
    tween = new TWEEN.Tween(coords)
        .to({x: 500, y: 500}, 2000) 
        .easing(TWEEN.Easing.Quadratic.InOut) 
        .delay(1000) 
        .onUpdate(update);

    tweenChain = new TWEEN.Tween(coords)
        .to({x: 0, y: 0}, 3000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(update);
    tween.chain(tweenChain);
    tweenChain.chain(tween);
    tween.start();
}

function animate(time) {
    requestAnimationFrame(animate);
    const result = tween.update(time);   
    if (!result) cancelAnimationFrame(box)
}

function update() {
    box.style.transform = `translate(${coords.x}px, ${coords.y}px)`;
}

init();
animate();