const isLightColor = require('../utils/is-light-color');

describe('Compute whether a color is light', () => {
  it('should return true for light colors', () => {
    expect(isLightColor('rgb(255, 255, 255)')).toBe(true);
    expect(isLightColor('rgb(225, 239, 254)')).toBe(true);
    expect(isLightColor('rgb(237, 235, 254)')).toBe(true);
  });

  it('should return false for dark colors', () => {
    expect(isLightColor('rgb(0, 0, 0)')).toBe(false);
    expect(isLightColor('rgb(30, 66, 159)')).toBe(false);
    expect(isLightColor('rgb(85, 33, 181)')).toBe(false);
  });
});