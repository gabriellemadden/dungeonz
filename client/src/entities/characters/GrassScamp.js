import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Grass scamp"));
        this.baseSprite.setScale(0.8);
    }
}

Entity.prototype.animationSetName = "grass-scamp";

export default Entity;