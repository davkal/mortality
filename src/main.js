
import * as d3 from 'd3';
import * as science from 'science';

// Local imports
import LineChart from './line';
import ScatterChart from './scatter';
import CategoryFilter from './categories';

require('./main.scss');

const dispatch = d3.dispatch('categories', 'mousemoveFig2a', 'mousemoveFig2b');
const color = d3.scaleOrdinal(d3.schemeCategory10);
const components = {};

function prepareDataFig2Filter(data) {
  const categories = d3.set(data, d => d.category).values();
  return {
    color,
    data,
    categories
  };
}

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
    label: 'HR P > 9e-05',
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
    moveEvent: 'mousemoveFig2a',
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
  ticks.map(t => ([d3.mean(V, v => kernel(t - v)), t]));

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
  const max = d3.max(series.map(s => d3.max(s, d => d[0])));
  const xScale = d3.scaleLinear()
    .domain([0, max]);

  return {
    color,
    xTitle: 'Density',
    data: series,
    moveEvent: 'mousemoveFig2a',
    xScale,
    yScale
  };
}

function prepareDataFig2b(data) {
  const processed = data.map(d => ({
    ...d,
    x: d.r2_age,
    y: d.cindex,
    confidence: d['min_p.value2'] === 'HR P<3.6e-06'
  }));
  const xScale = d3.scaleLog()
    .domain(d3.extent(processed, d => d.x));
  const yScale = d3.scaleLinear()
    .domain(d3.extent(processed, d => d.y));
  const symbols = [{
    label: 'HR P > 3.6e-06',
    classes: 'dot'
  }, {
    label: 'HR P < 3.6e-06',
    classes: 'dot hollow'
  }];

  return {
    color,
    symbols,
    xTitle: 'Association with age and sex (R squared)',
    yTitle: 'C-index including age and sex',
    data: processed,
    moveEvent: 'mousemoveFig2b',
    xScale,
    yScale
  };
}

function prepareDataFig2bDensity(data) {
  const processed = data.map(d => ({
    ...d,
    y: d.cindex
  }));
  const grouped = processed.reduce((acc, d) => {
    const { category } = d;
    if (!acc[category]) acc[category] = [];
    acc[category].push(d.y);
    return acc;
  }, {});
  const yExtent = d3.extent(processed, d => d.y);
  const yScale = d3.scaleLinear()
    .domain(yExtent);
  const ticks = d3.range(yExtent[0], yExtent[1], (yExtent[1] - yExtent[0]) / 100);
  const categories = Object.keys(grouped);
  const series = Object.values(grouped);
  const densities = series.map((s) => {
    const kernel = science.stats.kde().sample(s);
    return kernel.bandwidth(science.stats.bandwidth.nrd0)(ticks);
  });
  densities.forEach((s, i) => {
    s.category = categories[i];
    s.forEach((p, i) => {
      s[i] = [p[1], p[0]];
    });
  });
  const xMax = d3.max(densities.map(s => d3.max(s, d => d[0])));
  const xMin = d3.min(densities.map(s => d3.min(s, d => d[0])));
  const xScale = d3.scaleLinear()
    .domain([xMin, xMax]);

  return {
    color,
    xTitle: 'Density',
    data: densities,
    moveEvent: 'mousemoveFig2b',
    xScale,
    yScale
  };
}


const loadData = url => fetch(url)
  .then(res => res.text())
  .then(text => d3.csvParse(text));

Promise.all(['data/fig2a.csv', 'data/fig2b.csv'].map(loadData))
  .then((results) => {
    const [fig2a, fig2b] = results;
    components.filter2 = new CategoryFilter('fig2-categories', prepareDataFig2Filter(fig2a), dispatch);
    components.fig2aS = new ScatterChart('fig2a-scatter', prepareDataFig2a(fig2a), dispatch);
    components.fig2aL = new LineChart('fig2a-line', prepareDataFig2aDensity(fig2a), dispatch);
    components.fig2bS = new ScatterChart('fig2b-scatter', prepareDataFig2b(fig2b), dispatch);
    components.fig2bL = new LineChart('fig2b-line', prepareDataFig2bDensity(fig2b), dispatch);
  });
