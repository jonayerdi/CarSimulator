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
        // direction: 1 = clockwise; -1 = counterclockwise
        let diffX = this.x - center.x;
        let diffY = this.y - center.y;
        let radius = Math.sqrt(diffX*diffX + diffY*diffY);
        if (radius != 0) {
            let diffAngle = direction * (perimeter / radius);
            let angle = this.angleRelative(center) + diffAngle;
            if(angle != NaN && angle != Infinity && angle != -Infinity) {
                this.x = center.x + radius * Math.cos(angle);
                this.y = center.y + radius * Math.sin(angle);
            }
        }
    }
}
class Car {
    constructor(x, y, angle, width) {
        this.center = new Position(x, y);
        this.angle = angle;
        this.width = width;
        // Wheels
        this.left = new Position(NaN, NaN);
        this.right = new Position(NaN, NaN);
        this.updateWheelsFromCenter();
        // Speed
        this.vleft = 0;
        this.vright = 0;
        // Parameters
        this.vmax = 200;
    }
    updateWheelsFromCenter() {
        this.left.x = this.center.x - this.width/2 * Math.cos(this.angle);
        this.left.y = this.center.y - this.width/2 * Math.sin(this.angle);
        this.right.x = this.center.x + this.width/2 * Math.cos(this.angle);
        this.right.y = this.center.y + this.width/2 * Math.sin(this.angle);
    }
    updateCenterFromWheels() {
        this.center.x = (this.left.x + this.right.x) / 2;
        this.center.y = (this.left.y + this.right.y) / 2;
    }
    updateAngleFromWheels() {
        this.angle = this.right.angleRelative(this.left);
    }
    nextStep(timedelta) {
        let leftPerimeter = this.vleft * timedelta;
        let rightPerimeter = this.vright * timedelta;
        let leftPerimeterAbs = Math.abs(leftPerimeter);
        let rightPerimeterAbs = Math.abs(rightPerimeter);
        // No rotation
        if (leftPerimeter == rightPerimeter) {
            this.center.x += leftPerimeter * Math.sin(this.angle);
            this.center.y -= leftPerimeter * Math.cos(this.angle);
            this.updateWheelsFromCenter();
            return;
        }
        // With positive speed, left wheel rotates clockwise, right wheel rotates counterclockwise
        let leftDirection = this.vleft == 0 ? 0 : (this.vleft > 0 ? 1 : -1)
        let rightDirection = this.vright == 0 ? 0 : (this.vright > 0 ? -1 : 1)
        // Calculate rotation center
        let rotationCenter = undefined;
        // Wheels can rotate in same or different directions
        if (leftDirection == rightDirection) {
            // Both wheels clockwise or conterclockwise, rotation center between the wheels
            let rotationCenterX = (this.left.x * rightPerimeterAbs + this.right.x * leftPerimeterAbs) / (leftPerimeterAbs + rightPerimeterAbs);
            let rotationCenterY = (this.left.y * rightPerimeterAbs + this.right.y * leftPerimeterAbs) / (leftPerimeterAbs + rightPerimeterAbs);
            rotationCenter = new Position(rotationCenterX, rotationCenterY);
        } else {
            // Both wheels moving forwards or backwards, rotation center left or right of the car
            // Special cases, only one wheel moving
            if (leftPerimeter == 0) {
                rotationCenter = this.left;
            } else if(rightPerimeter == 0) {
                rotationCenter = this.right;
            } else {
                // Rotation center somewhere left or right of the car
                if(leftPerimeterAbs > rightPerimeterAbs) {
                    // Left wheel is faster
                    let rotationDistance = this.width / (leftPerimeterAbs/rightPerimeterAbs - 1);
                    let rotationCenterX = this.right.x + rotationDistance * Math.cos(this.angle);
                    let rotationCenterY = this.right.y + rotationDistance * Math.sin(this.angle);
                    rotationCenter = new Position(rotationCenterX, rotationCenterY);
                    // Left wheel direction is dominant
                    rightDirection = leftDirection;
                } else {
                    // Right wheel is faster
                    let rotationDistance = this.width / (rightPerimeterAbs/leftPerimeterAbs - 1);
                    let rotationCenterX = this.left.x - rotationDistance * Math.cos(this.angle);
                    let rotationCenterY = this.left.y - rotationDistance * Math.sin(this.angle);
                    rotationCenter = new Position(rotationCenterX, rotationCenterY);
                    // Right wheel direction is dominant
                    leftDirection = rightDirection;
                }
            }
        }
        this.left.rotateAround(rotationCenter, leftPerimeterAbs, leftDirection);
        this.right.rotateAround(rotationCenter, rightPerimeterAbs, rightDirection);
        this.updateCenterFromWheels();
        this.updateAngleFromWheels();
    }
}
