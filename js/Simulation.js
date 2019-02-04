class Simulation {
    constructor(context, width, height, leftControl, rightControl) {
        // Configuration
        this.width = 1000;
        this.height = 1000;
        this.keybindings = {
            left_forward: 65, // a
            left_backward: 90, // z
            right_forward: 75, // k
            right_backward: 77, // m
        }
        this.leftControl = document.getElementById(leftControl);
        this.rightControl = document.getElementById(rightControl);
        this.imagesRoot = 'img/';
        this.imageFiles = [
            {name: 'car', src: 'car.png', width: 80, height: 50},
        ];
        // Initialization
        this.context = context;
        this.keyupFunction = (evt) => this.onKeyup(evt);
        this.keydownFunction = (evt) => this.onKeydown(evt);
        this.context.scale(width/this.width, height/this.height);
        // Parameters
        this.timedelta = 10;
    }
    load() {
        return new Promise((resolve, reject) => {
            if(this.images) {
                resolve();
            } else {
                Promise.all(this.imageFiles.map(imageFile => new Promise((resolve, reject) => {
                    let src = this.imagesRoot + imageFile.src;
                    let img = new Image();
                    img.onload = () => resolve({name: imageFile.name, img: img});
                    img.onerror = () => reject(`Could not load ${src}`);
                    img.src = src;
                })))
                .then((loadedImages) => {
                    this.images = (() => {
                        let result = new Map();
                        this.imageFiles.forEach((element) => {
                            result.set(element.name, {
                                width: element.width,
                                height: element.height
                            });
                        });
                        return result;
                    })();
                    loadedImages.forEach((image) => {
                        this.images.get(image.name).img = image.img;
                    });
                    // Init simulation
                    this.init();
                    resolve();
                })
                .catch((reason) => reject(reason));
            }
        });
    }
    start() {
        if(this.leftControl && this.rightControl) {
            this.leftControl.oninput = () => this.onLeftControlUpdate();
            this.rightControl.oninput = () => this.onRightControlUpdate();
        } else {
            document.addEventListener('keyup', this.keyupFunction);
		    document.addEventListener('keydown', this.keydownFunction);
        }
		this.intervalID = setInterval(() => {this.nextFrame(); this.renderFrame();}, this.timedelta);
    }
    stop() {
        if(this.leftControl && this.rightControl) {
            this.leftControl.oninput = null;
            this.rightControl.oninput = null;
        } else {
            document.removeEventListener('keyup', this.keyupFunction);
            document.removeEventListener('keydown', this.keydownFunction);
        }
        clearInterval(this.intervalID);
    }
    init() {
        this.frame = 0;
        this.car = new Car(this.width/2, this.height/2, 0, this.images.get('car').width);
    }
    nextFrame() {
        this.car.nextStep(this.timedelta/1000);
    }
    renderFrame() {
        // Background
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.width, this.height);
        // Car
        let carimg = this.images.get('car');
        this.context.translate(this.car.center.x, this.car.center.y);
        context.rotate(this.car.angle);
        this.context.drawImage(carimg.img, -carimg.width/2, -carimg.height/2, carimg.width, carimg.height);
        context.rotate(-this.car.angle);
        this.context.translate(-this.car.center.x, -this.car.center.y);
        // Car center + wheels
        this.context.fillStyle = 'white';
        this.context.fillRect(this.car.left.x - 3, this.car.left.y - 3, 6, 6);
        this.context.fillStyle = 'red';
        this.context.fillRect(this.car.center.x - 3, this.car.center.y - 3, 6, 6);
        this.context.fillStyle = 'yellow';
        this.context.fillRect(this.car.right.x - 3, this.car.right.y - 3, 6, 6);
    }
    onLeftControlUpdate() {
        this.car.vleft = this.car.vmax * this.leftControl.value / 100;
    }
    onRightControlUpdate() {
        this.car.vright = this.car.vmax * this.rightControl.value / 100;
    }
    onKeydown(evt) {
        switch(evt.keyCode) {
            case this.keybindings.left_forward:
                this.car.vleft = this.car.vmax;
                break;
            case this.keybindings.left_backward:
                this.car.vleft = -this.car.vmax;
				break;
            case this.keybindings.right_forward:
                this.car.vright = this.car.vmax;
                break;
            case this.keybindings.right_backward:
                this.car.vright = -this.car.vmax;
                break;
        }
    }
    onKeyup(evt) {
        switch(evt.keyCode) {
            case this.keybindings.left_forward:
                if(this.car.vleft > 0)
                    this.car.vleft = 0
                break;
            case this.keybindings.left_backward:
                if(this.car.vleft < 0)
                    this.car.vleft = 0
				break;
            case this.keybindings.right_forward:
                if(this.car.vright > 0)
                    this.car.vright = 0
                break;
            case this.keybindings.right_backward:
                if(this.car.vright < 0)
                    this.car.vright = 0
                break;
        }
    }
}
