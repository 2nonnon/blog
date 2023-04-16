const dictionaries = {
  en: () => import('./en.json').then(module => module.default),
  zh: () => import('./zh.json').then(module => module.default),
}

type PromiseValue<T> = T extends Promise<infer V> ? V : T

export type Dictionaries = {
  [K in keyof typeof dictionaries]: PromiseValue<ReturnType<(typeof dictionaries)[K]>>
}

export type Dictionary = Dictionaries['en']

export type LocaleType = keyof typeof dictionaries

export const getDictionary = async (locale: LocaleType) => dictionaries[locale]()
