
/**
 * Checks if the color is light or dark
 * @param {string} rgbColor - "rgb(R,G,B)"
 * @returns boolean
 */
const isLightColor = function(rgbColor) {

  // Extract the RGB values
  const color = rgbColor.replace(/[^0-9,]/g, '').split(',');
  if (color.length != 3) {
    return null;
  }
  const [r, g, b] = color;

  // Calculate the luminance (255 = white, 0 = black)
  const luminance = 0.2126*r + 0.7152*g + 0.0722*b;
  return luminance > 140;
};

module.exports = isLightColor;