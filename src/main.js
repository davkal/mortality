
import * as d3 from 'd3';

// Local imports
import { createCircleChart } from './circle';
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
  return data.map(d => ({
    ...d,
    logP: -Math.log10(d.p)
  }));
}

fetch('data/fig2a.csv')
  .then(res => res.text())
  .then(text => d3.csvParse(text))
  .then((data) => {
    const vizDiv = document.getElementById('viz');

    const chartWidth = vizDiv.clientWidth;
    const chartHeight = vizDiv.clientHeight;

    makeScatterChart('viz', prepareDataFig2a(data), chartWidth, chartHeight)
  });
// buildCircleChart(chartWidth, chartHeight);
