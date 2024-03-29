import { gsap } from "gsap";

export class AnimationManager {


    /**
     * Animates a single property of an object using GSAP.
     * 
     * @template T - The type of the object.
     * @param {string} id - The ID of the animation.
     * @param {T} context - The object to animate.
     * @param {Object} change - The property changes to apply.
     * @param {number} [duration=1] - The duration of the animation in seconds.
     * @param {string | gsap.EaseFunction} [ease="easeInOut"] - The easing function to use.
     * @param {() => void} [onComplete=() => {}] - The callback function to execute when the animation completes.
     * @returns {gsap.Tween} - The GSAP tween object.
     */
    aminateOneObjectProperty<T>(
        id: string,
        context: T,
        change: { [key: string]: number },
        duration: number = 1,
        ease: string | gsap.EaseFunction = "easeInOut",
        onComplete: () => void = () => { }
    ) {
        const tween = gsap.to(context as gsap.TweenTarget, {
            id,
            ...change,
            duration,
            ease,
            onComplete: onComplete,
        });
        return tween;

        /* 
        
            gsap.isTweening(context) per vedere se sul contesto è attivo un tween 
            tween.isActive() per vedere se il tween è attivo
            
            gsap.killTweensOf(context, 'prop1.prop2') per killare il tween o solo certe properità
            gsap.getTweensOf(context, ) per ottenere tutti i tween sul contesto
            gsap.getById(id) per ottenere un tween per id

            gsap.kill() per killare tutti i tween
            gsap.kill(null, 'prop1.prop2') per killare solo certe prop di tutti i tween
        
        */
    }
}


/*
    PIXI PLUGINS: https://gsap.com/docs/v3/Plugins/PixiPlugin
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