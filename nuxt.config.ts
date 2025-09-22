// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['nuxt-echarts', '@nuxtjs/tailwindcss'],
  echarts: {
    charts: ['LineChart', 'ScatterChart'],
    components: ['TitleComponent', 'TooltipComponent', 'LegendComponent', 'GridComponent'],
  }
})