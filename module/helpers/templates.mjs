/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    'systems/warframe-armistice-era/templates/actor/parts/actor-features.hbs',
    'systems/warframe-armistice-era/templates/actor/parts/actor-items.hbs',
    'systems/warframe-armistice-era/templates/actor/parts/actor-spells.hbs',
    'systems/warframe-armistice-era/templates/actor/parts/actor-effects.hbs',
    // Item partials
    'systems/warframe-armistice-era/templates/item/parts/item-effects.hbs',
  ]);
};
