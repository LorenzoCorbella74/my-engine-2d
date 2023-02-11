export class InputManager {
    private keys: { [key: string]: boolean } = {};
    // private keyMapping: { [key: string]: string };
    private mouseX = 0;
    private mouseY = 0;
    private mouseWheel = 0;
    private mouseButton1 = false;
    private mouseButton2 = false;
    private mouseButton3 = false;
    private mouseButton4 = false;
    private ctrlKey = false;
    private shiftKey = false;

    constructor(private keyMapping : { [key: string]: string }) {

        document.addEventListener('keydown', e => {
            this.keys[e.key] = true;
            if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
                this.ctrlKey = true;
            } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.shiftKey = true;
            }
        });

        document.addEventListener('keyup', e => {
            this.keys[e.key] = false;
            if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
                this.ctrlKey = false;
            } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.shiftKey = false;
            }
        });

        document.addEventListener('mousemove', e => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        document.addEventListener('mousewheel', e => {
            // this.mouseWheel = e.deltaY ;
        });

        document.addEventListener('pointerdown', e => {
            if (e.button === 0) {
                this.mouseButton1 = true;
            } else if (e.button === 1) {
                this.mouseButton2 = true;
            } else if (e.button === 2) {
                e.preventDefault();  // TODO: apre il menu ...
                this.mouseButton3 = true;
            } else if (e.button === 3) {
                this.mouseButton4 = true;
            }
        });

        document.addEventListener('mouseup', e => {
            if (e.button === 0) {
                this.mouseButton1 = false;
            } else if (e.button === 1) {
                this.mouseButton2 = false;
            } else if (e.button === 2) {
                this.mouseButton3 = false;
            } else if (e.button === 3) {
                this.mouseButton4 = false;
            }
        });
    }

    isKeyDown(keyName: string) {
        return this.keys[this.keyMapping[keyName]] === true;
    }

    /**
     * Define the association between the action name and the relative key
     * @param keyName Set 
     * @param keyCode 
     */
    setKeyMapping(keyName: string, keyCode: string) {
        this.keyMapping[keyName] = keyCode;
      }

    getMouseX() {
        return this.mouseX;
    }

    getMouseY() {
        return this.mouseY;
    }

    getMouseWheel() {
        return this.mouseWheel;
    }

    isMouseButton1Down() {
        return this.mouseButton1;
    }

    isMouseButton2Down() {
        return this.mouseButton2;
    }

    isMouseButton3Down() {
        return this.mouseButton3;
    }

    isMouseButton4Down() {
        return this.mouseButton4;
    }
}
