# Notes

[V7 migration guide](https://github.com/pixijs/pixijs/wiki/v7-Migration-Guide)

# TODO:

- [x] controllo in matter-js di [width ed height dello sprite component](https://github.com/pixijs/pixijs/wiki/v4-Gotchas) ????)
- [x] aggiunstare la camera della simulazione di matter-js
- [x] update trigger (al primo contatto disabilitare il rigidbody)
- [ ] Vedere esempi dalla libreria ECS per query [Geotic](https://github.com/ddmills/geotic-example/tree/master)
- [x] enable/disable components logic dependancies check
- [ ] vedere se è stato deprecato .interactive
- [ ] al Component InputController si dovrebbe passare una funzione per gestire l'effetto dell'user input
- [ ] UI: usare [Pixi Layout](https://pixijs.io/layout/) o andare con soluzione custom?? -> meglio HTML?
- [ ] spostare l'healthComponent fuori dai componenti base e fare eventualmente uno Stats components...

- [ ] Camera: ease + movimento solo quando si esce da un rettangolo centrale e non quando siamo agli estremi della scena
- [ ] resize della game area / dimensioni dei gameObject dinamiche in funzioni delle dimensioni dello schermo?
- [ ] mappa e path finding

- [x] limiting mouse movement to vertical axis, horizonthal axis ed ad un area specifica rettangolare.

## NB

- [ ] se ad un container si aggiunge un figlio con n componenti tra cui anche un rigidbody si deve sincronizzare con le coordinate globali del container + quelle locali del figlio.
