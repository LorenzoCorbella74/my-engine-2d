# Notes

[V7 migration guide](https://github.com/pixijs/pixijs/wiki/v7-Migration-Guide)

# TODO:

- [x] controllo in matter-js di [width ed height dello sprite component](https://github.com/pixijs/pixijs/wiki/v4-Gotchas) ????)
- [x] aggiunstare la camera della simulazione di matter-js
- [x] update trigger (al primo contatto disabilitare il rigidbody)
- [ ] riorganizzazione componenti (un solo componente per tipo!!!) i figli del container avranno i propri componenti. Vedere esempi dalla libreria ECS [Geotic](https://github.com/ddmills/geotic-example/tree/master)
- [ ] enable/disable components logic dependancies check
- [ ] Camera: ease + movimento solo quando si esce da un rettangolo centrale e non quando siamo agli estremi della scena
- [ ] vedere se è stato deprecato .interactive
- [ ] resize della game area
- [ ] al Component InputController si dovrebbe passare una funzione per gestire l'effetto dell'user input
- [ ] UI: usare [Pixi Layout](https://pixijs.io/layout/) o andare con soluzione custom?? -> meglio HTML?

## NB

- [ ] se ad un container si aggiunge un figlio con n componenti tra cui anche un rigidbody si deve sincronizzare con le coordinate globali del container + quelle locali delcfiglio.
