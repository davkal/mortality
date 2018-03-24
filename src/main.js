
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
    y: -Math.log10(d.p)
  }));
  const xScale = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(processed, d => d.x))]);
  const yScale = d3.scaleLinear()
    .domain([-1, Math.ceil(d3.max(processed, d => d.y))]);

  return { data: processed, xScale, yScale };
}

const kernelEpanechnikov = k => (v) => {
  const s = v / k;
  return Math.abs(s) <= 1 ? (0.75 * (1 - (s * s))) / k : 0;
};

const kernelDensityEstimator = (kernel, X) => V =>
  X.map(x => ({ x, y: d3.mean(V, v => kernel(x - v)) }));

function prepareDataFig2aDensity(data) {
  const processed = data.map(d => ({
    ...d,
    x: d.HR,
    y: -Math.log10(d.p)
  }));
  const xScale = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(processed, d => d.y))]);
  const grouped = processed.reduce((acc, d) => {
    const { category } = d;
    if (!acc[category]) acc[category] = [];
    acc[category].push(d.y);
    return acc;
  }, {});
  const categories = Object.keys(grouped);
  const series = Object.values(grouped)
    .map(kernelDensityEstimator(kernelEpanechnikov(7), xScale.ticks(40)));
  series.forEach((s, i) => {
    s.category = categories[i];
  });
  const max = d3.max(series.map(s => d3.max(s, d => d.y)));
  const yScale = d3.scaleLinear()
    .domain([0, max]);

  return {
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
