import Vue from 'vue'
import VueI18n from 'vue-i18n'

import {zh} from './zh'
import {en} from './en'
import {vi} from './vi'

Vue.use(VueI18n)

const messages = {
  zh,
  en,
  vi,
}

export const i18n = new VueI18n({
  locale: 'zh',
  messages,
  silentTranslationWarn: true,
})
