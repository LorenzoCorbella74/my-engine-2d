import { gsap } from "gsap";

export class AnimationManager {

    /**
     * 
     * @param context the object to animate
     * @param property the property
     * @param amount  the final value of the property
     * @param duration 
     * @param ease 
     * @param onComplete 
     */
    aminateOneObjectProperty<T>(
        context: T,
        property: string,
        amount: number,
        duration: number = 1,
        ease: string | gsap.EaseFunction = "easeInOut",
        onComplete: () => void = () => { }
    ) {
        const tween = gsap.to(context as gsap.TweenTarget, {
            [property]: amount,
            duration,
            ease,
            onComplete: onComplete,
        });
        return tween;
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