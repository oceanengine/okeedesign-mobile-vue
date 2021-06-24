import brand from '../../brand';
import { createBEM } from './bem';
import { createComponent } from './component';
import { createI18N } from './i18n';

type CreateNamespaceReturn = [
  ReturnType<typeof createComponent>,
  ReturnType<typeof createBEM>,
  ReturnType<typeof createI18N>,
];

export function createBrandName() {
  return brand.createBrandName();
}

export function createNamespace(name: string): CreateNamespaceReturn {
  const brandName = createBrandName();
  name = brandName + name;
  return [createComponent(name), createBEM(name), createI18N(name)];
}
