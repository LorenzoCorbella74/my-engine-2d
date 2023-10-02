import { Filter, DisplayObject, ColorMatrixFilter } from 'pixi.js';
import gsap from 'gsap';

export class FiltersManager {

    // Aggiungi un filtro a un oggetto PIXI
    public addFilter(target: DisplayObject, filter: Filter): void {
        target.filters = target.filters || [];
        target.filters.push(filter);
    }

    // Rimuovi un filtro da un oggetto PIXI
    public removeFilter(target: DisplayObject, filter: Filter): void {
        if (target.filters) {
            target.filters = target.filters.filter((existingFilter) => existingFilter !== filter);
        }
    }

    // Anima l'applicazione di un filtro utilizzando GSAP
    public animateFilter(
        target: DisplayObject,
        filter: Filter,
        duration: number = 1
    ): void {
        // old way  ma deprecato
        /* gsap.to(filter, 2, {blur: 0,}); */
        // new way - https://greensock.com/docs/v3/Plugins/PixiPlugin
        gsap.to(target, {
            duration,
            pixi: { blur: 0 }
        })
        /* 
                gsap.to(image, {duration: 1, pixi:{colorize:"red", colorizeAmount:1}});
                gsap.to(image, {duration: 1, pixi:{saturation:0}});
                gsap.to(image, {duration: 1, pixi:{hue:180}});
                gsap.to(image, {duration: 1, pixi:{brightness:3}});
                gsap.to(image, {duration: 1, pixi:{contrast:3}});
                gsap.to(image, {duration: 1, pixi:{blur:20}});
                gsap.to(image, {duration: 1, pixi:{colorMatrixFilter:null, blur:0}});
                gsap.to(image, {duration: 1, pixi:{brightness:3, combineCMF:true}}); 
                When combineCMF is set to true, the newly applied ColorMatrixFilter will preserve any previously-set 
                "hue", "saturation", "brightness", "contrast", and "colorize" values. So if you desaturate the image 
                and then increase brightness you will get a very bright grayscale image. 
                However, if you desaturate the image and then click "colorize red" or "hue 180" you will not see any 
                color change as the image will still have saturation of 0. combineCMF is false by default. 
        */
    }
}
