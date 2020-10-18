import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Arch mage"));
        this.displayName.addColor("#ff6b00", 0);
        this.baseSprite.setScale(1.2);
    }
}

Entity.prototype.animationSetName = "mage";

export default Entity;