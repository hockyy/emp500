// Class: Bullet
// These are the bullets the player fires
class Bullet {
    constructor(location, velocity) {
        this.location = location;
        this.oldLocation = subtractVectors(location, velocity);
        this.destroyed = false;
        this.fired = false; // If the bullet is fired, set to true. We want to hear the laser sound only once
    }

    draw(c) {
        drawBullet(c, this.location, subtractVectors(this.location, this.oldLocation));

        // Play firing sound once when drawn
        if (!this.fired) {
            let laserSound = new Audio("laser3.mp3");
            laserSound.loop = false;

            laserSound.play();

            this.fired = true;
        }
        
    }

    checkForHit(enemy) {
        return calculateDistance(enemy.location, this.location) <= enemy.radius;
    }
}