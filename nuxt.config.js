import { version } from './package.json'
import colors from 'vuetify/es5/util/colors'
const webpack = require('webpack')
const fa = require('./locales/vuetifyjs.fa.json')

export default {
  ssr: false,
  target: 'static',
  telemetry: false,
  head: {
    title: 'کارتابل پرسنل',
    titleTemplate: '%s',
    htmlAttrs: {
      lang: 'fa',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'stylesheet', href: '/css/app.css' },
      { rel: 'stylesheet', href: '/css/fonts.css' },
      { rel: 'stylesheet', href: '/css/mobile.css' },
      { rel: 'stylesheet', href: '/css/google_font.css' },
      { rel: 'icon', type: 'image/x-icon/svg/png', href: '/favicon.ico' }
    ],
  },
  plugins: [
    '~/plugins/base',
    '~/plugins/axios',
    '~/plugins/helper',
    { src: '~/plugins/other.js', ssr: false },
    { src: '~/plugins/vue-persian-datetime-picker', ssr: false },
    { src: '~/plugins/leaflet', ssr: false },
    { src: '~/plugins/html_editor.js', ssr: false },
  ],
  buildModules: ['@nuxtjs/toast', '@nuxtjs/moment', '@nuxtjs/vuetify'],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  toast: {
    duration: 3000,
    position: 'bottom-left',
  },
  // moment: {
  //   defaultTimezone: 'Asia/Tehran'
  // },
  vuetify: {
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.orange,
          accent: colors.grey.darken3,
          secondary: colors.orange.darken4,
          light_purple: colors.orange.darken4,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          info: '#00ABE1',
          error: '#ff0000',
          accent: '#1A2238',
          success: '#169e1a',
          warning: '#ffbb00',
          primary: '#fd5800',
          darkpurple: '#2f1753',
          secondary: '#0649dc',
          background: '#EC407A',
          light_purple: '#EC407A',
          btn_color: '#66CDAA',
          gray: '#cccccc',
        }
      },
    },
    rtl: true,
    lang: {
      locales: { fa },
      current: 'fa',
    },
    icons: {
      iconfont: 'md',
    },
    defaultAssets: false,
    materialIcons: false,
  },
  router: {
    mode: 'hash'
  },
  publicRuntimeConfig: {
    version: version,
  },
  build: {
    transpile: [/^vue-trumbowyg($|\/)/],
    vendor: ['jquery'],
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
    ],
  }
}
