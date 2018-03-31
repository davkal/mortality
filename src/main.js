
import * as d3 from 'd3';

// Local imports
import { createCircleChart } from './circle';
import makeLineChart from './line';
import makeScatterChart from './scatter';

require('./main.scss');

// eslint-disable-next-line no-unused-vars
function buildCircleChart(chartWidth, chartHeight) {
  // Dataset
  const dataset = d3.range(20);

  const svg = d3.select('#viz')
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
    .classed('svg-content-responsive', true);

  // Test module, string interpolation
  return createCircleChart(svg, dataset);
}

// Load data

// Main
// d3.select('#viz').remove();

function prepareDataFig2a(data) {
  const processed = data.map(d => ({
    ...d,
    x: d.HR,
    y: -Math.log10(d.p),
    confidence: d['min_p.value2'] === 'HR P<9e-05'
  }));
  const xScale = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(processed, d => d.x))]);
  const yScale = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(processed, d => d.y))]);
  const yLines = [-Math.log10(9e-05)];
  const legend = d3.set(processed, d => d.category).values();

  return {
    legend,
    xTitle: 'Hazard ratio',
    yTitle: '-log10(p)',
    data: processed,
    xScale,
    yScale,
    yLines
  };
}

const kernelEpanechnikov = k => (v) => {
  const s = v / k;
  return Math.abs(s) <= 1 ? (0.75 * (1 - (s * s))) / k : 0;
};

const kernelDensityEstimator = (kernel, ticks) => V =>
  ticks.map(t => ({ y: t, x: d3.mean(V, v => kernel(t - v)) }));

function prepareDataFig2aDensity(data) {
  const processed = data.map(d => ({
    ...d,
    x: d.HR,
    y: -Math.log10(d.p)
  }));
  const grouped = processed.reduce((acc, d) => {
    const { category } = d;
    if (!acc[category]) acc[category] = [];
    acc[category].push(d.y);
    return acc;
  }, {});
  const yScale = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(processed, d => d.y))]);
  const categories = Object.keys(grouped);
  const series = Object.values(grouped)
    .map(kernelDensityEstimator(kernelEpanechnikov(5), yScale.ticks(40)));
  series.forEach((s, i) => {
    s.category = categories[i];
  });
  const max = d3.max(series.map(s => d3.max(s, d => d.x)));
  const xScale = d3.scaleLinear()
    .domain([0, max]);

  return {
    xTitle: 'Density',
    data: series,
    labels: categories,
    xScale,
    yScale
  };
}

fetch('data/fig2a.csv')
  .then(res => res.text())
  .then(text => d3.csvParse(text))
  .then((parsed) => {
    const scatterConfig = prepareDataFig2a(parsed);
    makeScatterChart('fig2a-scatter', scatterConfig);
    const lineConfig = prepareDataFig2aDensity(parsed);
    makeLineChart('fig2a-line', lineConfig);
  });
// buildCircleChart(chartWidth, chartHeight);
