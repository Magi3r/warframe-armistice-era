import WarframeArmisticeEraItemBase from "./base-item.mjs";

export default class WarframeArmisticeEraWeapon extends WarframeArmisticeEraItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.attackWith = new fields.StringField({ initial: "weaponsFirearm" });

    schema.accuracy = new fields.NumberField({
      ...requiredInteger,
      initial: 50,
    });

    schema.range = new fields.NumberField({
      ...requiredInteger,
      initial: 21,
    });

    schema.magazineSize = new fields.NumberField({
      ...requiredInteger,
      initial: 3,
      min: 0,
    });

    schema.damageTypes = new fields.SchemaField({
      primary: new fields.ArrayField(string),
      secondary: new fields.ArrayField(string),
    });

    // Break down roll formula into three independent fields
    schema.roll = new fields.SchemaField({
      diceNum: new fields.NumberField({
        ...requiredInteger,
        initial: 1,
        min: 1,
      }),
      diceSize: new fields.StringField({ initial: "d20" }),
      flatBonus: new fields.NumberField({
        initial: 20,
      }),
    });

    schema.formula = new fields.StringField({ blank: true });

    return schema;
  }

  prepareDerivedData() {
    // Build the formula dynamically using string interpolation
    const roll = this.roll;

    this.formula = `${roll.diceNum}${roll.diceSize}+${roll.flatBonus}`;
  }
}
