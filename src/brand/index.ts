export default {
  _brandName: 'byted-',
  createBrandName() {
    return this._brandName;
  },
  setBrandName(brandName) {
    if (brandName) {
      this._brandName = brandName;
    }
  },
};
