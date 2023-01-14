// Class: Player
// Contains the location of the player character and drawing function
class Player {
    constructor(location) {
        this.location = location;
    }

    draw(c) {
        drawRegularPolygon(c, this.location, 5, 3, "#00FF00", -Math.PI/2);
    }
}
