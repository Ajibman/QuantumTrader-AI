
```js
// core/moduleRegistry.js

const moduleList = [
  "Module01", "Module02", "Module03", "Module04", "Module05",
  "Module06", "Module07", "Module08", "Module09", "Module10",
  "Module11", "Module12", "Module13", "Module14", "Module15"
];

export const moduleRegistry = moduleList.map((module, index) => ({
  name: module,
  id: index + 1,
  status: "inactive",
  initialized: false,
  version: "1.0.0",
}));

export function updateModuleStatus(moduleName, newStatus) {
  const mod = moduleRegistry.find(m => m.name === moduleName);
  if (mod) mod.status = newStatus;
}
```

---
