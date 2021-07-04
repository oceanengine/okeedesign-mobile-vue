export default {
  _brandName: 'o-',
  createBrandName() {
    return this._brandName;
  },
  setBrandName(brandName) {
    if (brandName) {
      this._brandName = brandName;
    }
  },
};
