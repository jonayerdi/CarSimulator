class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    angleRelative(center) {
        let diffX = this.x - center.x;
        let diffY = this.y - center.y;
        return Math.atan2(diffY, diffX);
    }
    rotateAround(center, perimeter, direction) {
        /* direction 1 = clockwise; -1 = counterclockwise */
        let diffX = this.x - center.x;
        let diffY = this.y - center.y;
        let radius = Math.sqrt(diffX*diffX + diffY*diffY);
        let angle = this.angleRelative(center) + direction * (perimeter / radius);
        if(angle != NaN && angle != Infinity && angle != -Infinity) {
            this.x = center.x + radius * Math.cos(angle);
            this.y = center.y + radius * Math.sin(angle);
        }
    }
}
class Car {
    constructor(x, y, angle, width) {
        this.center = new Position(x, y);
        this.angle = angle;
        this.width = width;
        this.vleft = 0;
        this.vright = 0;
        // Parameters
        this.vmax = 300;
    }
    nextStep(timedelta) {
        
    }
}