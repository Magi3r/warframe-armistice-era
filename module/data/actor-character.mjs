import WarframeArmisticeEraActorBase from "./base-actor.mjs";

export default class WarframeArmisticeEraCharacter extends WarframeArmisticeEraActorBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.class = new fields.StringField({
      required: false,
      initial: "Classless",
    });

    schema.faction = new fields.StringField({
      required: false,
      initial: "Factionless",
    });

    schema.health = new fields.NumberField({
      ...requiredInteger,
      initial: 100,
      min: 0,
      max: 100
    });

    schema.shields = new fields.NumberField({
      ...requiredInteger,
      initial: 100,
      min: 0,
      max: 100
    });

    // schema.attributes = new fields.SchemaField({
    //   level: new fields.SchemaField({
    //     value: new fields.NumberField({ ...requiredInteger, initial: 1 }),
    //   }),
    // });

    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(
      Object.keys(CONFIG.WARFRAME_ARMISTICE_ERA.abilities).reduce(
        (obj, ability) => {
          obj[ability] = new fields.SchemaField({
            value: new fields.NumberField({
              ...requiredInteger,
              initial: 10,
              min: 0,
            }),
          });
          return obj;
        },
        {},
      ),
    );

    // Iterate over skill names and create a new SchemaField for each.
    schema.skills = new fields.SchemaField(
      Object.keys(CONFIG.WARFRAME_ARMISTICE_ERA.skills).reduce(
        (obj, skill) => {
          obj[skill] = new fields.SchemaField({
            value: new fields.NumberField({
              ...requiredInteger,
              nullable: true,
              initial: null,
              min: 0,
            }),
            relatedAttribute: new fields.StringField({
              required: true,
              initial: CONFIG.WARFRAME_ARMISTICE_ERA.skillRelatedAttributes[skill]
            }),
            formula: new fields.StringField({
              required: true,
              initial: `d100`
            }),
          });
          return obj;
        },
        {},
      ),
    );

    return schema;
  }

  prepareDerivedData() {
    // Loop through combat skills, and add their derived values to our sheet output.
    for (const key in this.combatSkills) {
      switch (key) {
        case "initiative":
          // 1d20 + dex/10
          this.combatSkills[key].value = Math.floor(
            this.attributes.dex.value / 10,
          );
          break;
        case "fortitude":
          // 1d4 + 1d4 per 25 Con/Instinct -> CON+WIS, as Instinct does not exist anymore
          this.combatSkills[key].value =
            1 +
            Math.floor(
              this.attributes.con.value / 25 + this.attributes.wis.value / 25,
            );
          break;
        case "dodge":
          // 1d4 + 1d4 per 25 WIS/Agility
          this.combatSkills[key].value =
            1 +
            Math.floor(
              this.attributes.wis.value / 25 + this.skills.agility.value / 25,
            );
          break;
        case "grappleOther":
          // 1d4 + 1d4 per 25 STR/Muscle
          this.combatSkills[key].value =
            1 +
            Math.floor(
              this.attributes.str.value / 25 + this.skills.muscle.value / 25,
            );
          break;
        case "grappleResist":
          // 1d4 + 1d4 per 25 STR/Athletics
          this.combatSkills[key].value =
            1 +
            Math.floor(
              this.attributes.str.value / 25 + this.skills.athletics.value / 25,
            );
          break;
        case "will":
          // 1d4 + 1d4 per 25 Int/Perception
          this.combatSkills[key].value =
            1 +
            Math.floor(
              this.attributes.int.value / 25 +
              this.skills.perception.value / 25,
            );
          break;
      }
      this.health

      // Handle ability label localization.
      this.combatSkills[key].label =
        game.i18n.localize(CONFIG.WARFRAME_ARMISTICE_ERA.CombatSkills[key]) ??
        key;
    }
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (this.abilities) {
      for (let [k, v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v.value);
      }
    }
    if (this.combatSkills) {
      for (let [k, v] of Object.entries(this.combatSkills)) {
        data[k] = foundry.utils.deepClone(v.value);
      }
    }
    if (this.skills) {
      for (let [k, v] of Object.entries(this.skills)) {
        data[k] = foundry.utils.deepClone(v.value);
      }
    }

    return data;
  }
}
