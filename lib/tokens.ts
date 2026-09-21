import tokens from '@/tokens.json';

/**
 * Tokenit luetaan tokens.json:sta build-aikana, ei kirjoiteta
 * /system-sivulle käsin. Käsin kopioitu lista vanhenee, ja se on
 * juuri se virhe jonka tämä sivusto lupaa ratkaista.
 */
export default tokens;

export const colorNames = Object.keys(tokens.color.light) as (keyof typeof tokens.color.light)[];
export const typeNames = Object.keys(tokens.type) as (keyof typeof tokens.type)[];
export const spaceSteps = Object.entries(tokens.space);
