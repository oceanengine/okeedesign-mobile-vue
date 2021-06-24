import _ from 'lodash';

export function setCSSVariable(element, property, value) {
  const cssVariableKey = `--${_.kebabCase(property)}`;
  element.style.setProperty(cssVariableKey, value);
}

export function setCSSVariableObject(element, obj, setFunc = setCSSVariable) {
  Object.keys(obj).forEach(cssVariableKey => {
    const value = obj[cssVariableKey];
    if (value && value.length) {
      setFunc(element, cssVariableKey, value[0]);
      value.slice(1).forEach((splitValue, index) => {
        setFunc(element, `${cssVariableKey}${index + 1}`, splitValue);
      });
    } else {
      setFunc(element, cssVariableKey, value);
    }
  });
}

export function downloadObjectAsJson(exportObj, exportName) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
