type StoreFactory = (...args: any[]) => any

const storeFactories: Record<string, StoreFactory> = {}

export function registerVuexCompatModules(modules: Record<string, StoreFactory>) {
  Object.assign(storeFactories, modules)
}

function resolveStoreFactory(moduleName) {
  const factory = storeFactories[moduleName]
  if (!factory) {
    throw new Error(`vuex-compat: module "${moduleName}" is not registered`)
  }
  return factory
}

export function mapGetters(moduleName, getterNames) {
  const factory = resolveStoreFactory(moduleName)
  return Object.fromEntries(
    getterNames.map((getterName) => [
      getterName,
      function mappedGetter() {
        return factory()[getterName]
      },
    ]),
  )
}

export function mapActions(moduleName, actionNames) {
  const factory = resolveStoreFactory(moduleName)
  return Object.fromEntries(
    actionNames.map((actionName) => [
      actionName,
      function mappedAction(...args) {
        return factory()[actionName](...args)
      },
    ]),
  )
}
