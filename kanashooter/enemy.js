// Class: Enemy
// These are the enemies falling down
class Enemy {
    constructor(location, velocity, INCLUDE_YOUON, INCLUDE_ALL) {
        this.location = location;
        this.oldLocation = subtractVectors(location, velocity);
        this.kana = pickRandomCharacter(CURRENT_CHARSET, INCLUDE_YOUON, INCLUDE_ALL);
        this.radius = 20;
        this.sides = 4;

        this.destroyed = false;
        this.hitTaken = false;

    }

    draw(c) {
        let ctx = c.getContext("2d");
        ctx.font = "35px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        
        ctx.fillText(`${this.kana.jp}`, this.location[0], this.location[1]);
    }

    playHitSound() {
        // Play destroyed sound when... destroyed.
        let destroyedSound = new Audio("pepSound5.mp3");
            destroyedSound.loop = false;
            destroyedSound.play();
    }
}

// Pick a random character from the given charset array
function pickRandomCharacter(kana, INCLUDE_YOUON, INCLUDE_ALL) {
    console.log(remainingCharacters.length)
    if(remainingCharacters.length === 0) {
        const resetted = []
        for(const kanaChar of kana){
            if(!INCLUDE_YOUON && kanaChar.type === "youon") {
                continue;
            }
            resetted.push(kanaChar)
        }
        if(remainingCharacters.length === 0) {
            let resetSound = new Audio("zapThreeToneDown.mp3");
            resetSound.loop = false;
            resetSound.play();
            remainingCharacters = resetted;
            SCORE += FULL_PACK_SCORE
        }
    }
    for(var i = 1;;i++){
        const index = Math.floor(Math.random() * remainingCharacters.length)
        const selectedChar = remainingCharacters[index];
        if(INCLUDE_ALL) remainingCharacters.splice(index, 1);
        return selectedChar;
    }
    return "";
}