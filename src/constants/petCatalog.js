import catalog from './petCatalog.json';

export const PET_SPECIES = catalog.species;
export const PET_THEMES = catalog.themes;

const SPECIES_LABELS = {
  bird: 'Bird',
  bunny: 'Bunny',
  cat: 'Cat',
  dog: 'Dog',
  fox: 'Fox',
  bear: 'Bear',
  panda: 'Panda',
  penguin: 'Penguin',
  frog: 'Frog',
  elephant: 'Elephant',
  pig: 'Pig',
  sheep: 'Sheep',
  alien: 'Alien',
  hamster: 'Hamster',
  duck: 'Duck',
  chick: 'Chick',
  seal: 'Seal',
  wolf: 'Wolf',
  snake: 'Snake',
  dragon: 'Dragon',
  scorpion: 'Scorpion',
};

export function getSpeciesLabel(type) {
  if (!type) return 'Companion';
  return SPECIES_LABELS[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

export function getTheme(index) {
  if (index === null || index === undefined) return PET_THEMES[0];
  return PET_THEMES[((index % PET_THEMES.length) + PET_THEMES.length) % PET_THEMES.length];
}

const HUE_NAMES = [
  'Red', 'Orange', 'Amber', 'Yellow', 'Lime', 'Green',
  'Teal', 'Cyan', 'Blue', 'Indigo', 'Violet', 'Magenta', 'Rose',
];

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - chroma / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) { r = chroma; g = x; }
  else if (h < 120) { r = x; g = chroma; }
  else if (h < 180) { g = chroma; b = x; }
  else if (h < 240) { g = x; b = chroma; }
  else if (h < 300) { r = x; b = chroma; }
  else { r = chroma; b = x; }
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

export function lightenColor(hex, amount = 0.35) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (c) => Math.round(c + (255 - c) * amount);
  return `#${mix(r).toString(16).padStart(2, '0')}${mix(g).toString(16).padStart(2, '0')}${mix(b).toString(16).padStart(2, '0')}`;
}

export function darkenColor(hex, amount = 0.35) {
  const { r, g, b } = hexToRgb(hex);
  const dim = (c) => Math.round(c * (1 - amount));
  return `#${dim(r).toString(16).padStart(2, '0')}${dim(g).toString(16).padStart(2, '0')}${dim(b).toString(16).padStart(2, '0')}`;
}

export function getHueName(hue) {
  const index = Math.floor(((hue % 360) + 360) % 360 / 27.7) % HUE_NAMES.length;
  return HUE_NAMES[index];
}

/** Fully random hue — each new pet gets a unique color. */
export function generateRandomColors() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 58 + Math.floor(Math.random() * 32);
  const lightness = 48 + Math.floor(Math.random() * 18);
  const base = hslToHex(hue, saturation, lightness);
  const sick = hslToHex(hue, Math.max(22, saturation - 28), Math.max(30, lightness - 20));
  return { base, sick, name: getHueName(hue) };
}

/** Prefer stored random colors; fall back to theme palette for older pets. */
export function resolvePetColors({ themeIndex, petColor, petColorSick } = {}) {
  if (petColor) {
    return {
      base: petColor,
      sick: petColorSick || petColor,
      name: getHueNameFromHex(petColor),
    };
  }
  return getTheme(themeIndex ?? 0);
}

function getHueNameFromHex(hex) {
  const { r, g, b } = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 'Silver';
  let h = 0;
  const d = max - min;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return getHueName(h);
}

/** Random species + random color (not tied to a fixed palette slot). */
export function pickRandomAppearance() {
  const petType = PET_SPECIES[Math.floor(Math.random() * PET_SPECIES.length)];
  const colors = generateRandomColors();
  return {
    petType,
    themeIndex: Math.floor(Math.random() * PET_THEMES.length),
    petColor: colors.base,
    petColorSick: colors.sick,
    colorName: colors.name,
  };
}

export function formatPetAppearance(petType, themeIndex, petColor, petColorSick) {
  const colors = resolvePetColors({ themeIndex, petColor, petColorSick });
  return `${colors.name} ${getSpeciesLabel(petType)}`;
}
