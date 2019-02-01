class Car {
    constructor(x, y, angle, width) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.width = width;
        this.vleft = 0;
        this.vright = 0;
        // Controls
        this.controlLeft = 0;
        this.controlRight = 0;
        // Parameters
        this.vmax = 300;
    }
    nextStep(timedelta) {
        this.nextSpeed(timedelta);
        this.nextPosition(timedelta);
    }
    nextSpeed(timedelta) {
        this.vleft = this.vmax * this.controlLeft;
        this.vright = this.vmax * this.controlRight;
    }
    nextPosition(timedelta) {
        let delta_angle = 0;
        let delta_y = 0;
        let delta_x = 0;
        let speed = (Math.abs(this.vleft) + Math.abs(this.vright)) / 2;
        let perimeter = speed * timedelta;
        let radius = Infinity;
        let direction = 0;
        if (this.vleft + this.vright == 0) {
            direction = this.vleft > this.vright ? 1 : -1;
            radius = this.width / 2;
            delta_angle = speed * timedelta / radius * direction;
        } else if (this.vleft == this.vright) {
            radius = Infinity;
            direction = this.vleft > 0 ? -1 : 1;
            delta_angle = 0;
            delta_y = speed * timedelta * direction;
            delta_x = 0;
        } else if (this.vleft == 0 || this.vright == 0) {
            if (this.vleft > 0) {
                direction = [1,-1];
            } else if (this.vleft < 0) {
                direction = [1,1];
            } else if (this.vright > 0) {
                direction = [-1,-1];
            } else if (this.vright < 0) {
                direction = [-1,-1];
            }
            radius = this.width;
            delta_angle = speed * timedelta / radius * direction[0] * direction[1];
            delta_y = radius * Math.sin(delta_angle) * direction[1];
            delta_x = radius * (1-Math.cos(delta_angle)) * direction[0];
        } else {
            radius = (this.width / ((this.vleft/this.vright) - 1)) + (this.width / 2);
            delta_angle = speed * timedelta / radius * direction;
            delta_y = radius * Math.sin(delta_angle) * direction;
            delta_x = (perimeter*perimeter) / (delta_y*delta_y) * direction;
        }
        this.x += delta_x * Math.cos(-this.angle) + delta_y * Math.sin(-this.angle);
        this.y += delta_y * Math.cos(-this.angle) + delta_x * Math.sin(-this.angle);
        this.angle += delta_angle;
        console.log(`${speed}:${radius}:${delta_angle}:${delta_x}:${delta_y}`);
    }
}