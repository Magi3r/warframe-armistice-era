import WarframeArmisticeEraDataModel from "./base-model.mjs";

export default class WarframeArmisticeEraActorBase extends WarframeArmisticeEraDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.name = new fields.StringField({
      required: true,
      initial: "Unnamed",
    });

    schema.health = new fields.SchemaField({
      value: new fields.NumberField({
        ...requiredInteger,
        initial: 100,
        min: 0,
      }),
      max: new fields.NumberField({
        ...requiredInteger,
        initial: 100,
        min: 0,
      }),
    });
    schema.armor = new fields.SchemaField({
      value: new fields.NumberField({
        ...requiredInteger,
        initial: 100,
        min: 0,
      }),
    });
    schema.shields = new fields.SchemaField({
      value: new fields.NumberField({
        ...requiredInteger,
        nullable: true,
        initial: 50,
        min: 0,
      }),
      max: new fields.NumberField({ ...requiredInteger, initial: 50 }),
    });
    schema.biography = new fields.StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields

    return schema;
  }
}
