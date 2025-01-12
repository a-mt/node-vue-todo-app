
const isLightColor = function(rgbColor) {
  const color = rgbColor.replace(/[^0-9,]/g, '').split(',');
  if (color.length != 3) {
    return null;
  }
  const [r, g, b] = color;
  const lightness = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // 255 = white, 0 = black
  return lightness > 127.5;
};

module.exports = isLightColor;