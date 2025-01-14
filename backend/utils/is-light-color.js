
const isLightColor = function(rgbColor) {
  const color = rgbColor.replace(/[^0-9,]/g, '').split(',');
  if (color.length != 3) {
    return null;
  }
  const [r, g, b] = color;
  const luminance = 0.2126*r + 0.7152*g + 0.0722*b;

  // 255 = white, 0 = black
  return luminance > 140;
};

module.exports = isLightColor;