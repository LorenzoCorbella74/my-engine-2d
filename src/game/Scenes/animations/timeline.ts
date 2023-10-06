import { gsap } from "gsap";
import { MyEngine2D as engine } from './../../../engine/Engine';
import { Sprite } from "pixi.js";

export function createTimelineAnimation(context: Sprite): GSAPTimeline {

    const timeline = gsap.timeline({ repeat: -1, });

    // Animazione di scaling, posizione e rotazione usando GSAP
    timeline.to(context, {
        x: engine.app.view.width / 2,
        y: engine.app.view.height / 2,
        rotation: Math.PI * 2,
        // scaleX: 4,
        // scaleY: 4,
        pixi: { scaleX: 1.25, scaleY: 1.25 },
        duration: 2,
        ease: 'power1.inOut',
        onUpdate: () => {
            console.log('Updating!');
        },
        onComplete: () => {
            // Questa funzione verrà chiamata al termine dell'animazione
            console.log('Animazione UNO completata!', context);
        },
    });

    // Animazione di fade-in e fade-out
    timeline.to(context, {
        alpha: 0,
        duration: 0.5,
        delay: 0.5,
        pixi: { scale: 1 },
        onComplete: () => {
            context.alpha = 1; // Reset dell'opacità
            // context.scale.set(1); // Reset del scaling
            context.rotation = 0; // Reset della rotazione
            context.position.set(engine.app.view.width / 2, engine.app.view.height / 2); // Reset della posizione 
            engine.log('Animazione DUE completata!', context);
            // Test timer
            engine.time.after(5, () => {
                engine.log('Testing timer After 5 seconds')
            })
        },
    });

    return timeline;
}

/*
    FOR EASING in V3: https://greensock.com/docs/v3/Eases
*/


/* gsap.to(this, {  // this è bunny
    x: this.engine.app.view.width / 2,   // Posizione finale x
    y: this.y,   // Posizione finale y
    alpha: 0, // Valore di opacità finale
    duration: 2,         // in  secondi
    rotation: Math.PI * 2,
    // scale: 2, FA SCOPPIARE TUTTO !!!!
    // repeat: -1, yoyo: true,
    // ease: 'power1.inOut',
    onComplete: () => {
        // Questa funzione verrà chiamata al termine dell'animazione
        console.log('Animazione completata!', this);
    },
}); */
