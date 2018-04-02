
import * as d3 from 'd3';

// Local imports
import makeLineChart from './line';
import makeScatterChart from './scatter';

require('./main.scss');

const dispatch = d3.dispatch('mousemove');
const color = d3.scaleOrdinal(d3.schemeCategory10);

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
  const yLines = [{ y: -Math.log10(9e-05), id: '9e-05' }];
  const legend = d3.set(processed, d => d.category).values();
  const symbols = [{
    label: 'HR P < 9e-05',
    classes: 'dot'
  }, {
    label: 'HR P < 9e-05',
    classes: 'dot hollow'
  }];

  return {
    color,
    legend,
    symbols,
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
    color,
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
    makeScatterChart('fig2a-scatter', scatterConfig, dispatch);
    const lineConfig = prepareDataFig2aDensity(parsed);
    makeLineChart('fig2a-line', lineConfig, dispatch);
  });
