export default defineNuxtPlugin(async () => {
  const Plotly = (await import("plotly.js-dist")).default;
  return {
    provide: {
      plotly: Plotly
    }
  };
});
