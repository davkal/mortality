import * as d3 from 'd3';

const MARGIN = {
  top: 20, right: 30, bottom: 20, left: 30
};
const PADDING = {
  top: 60, right: 60, bottom: 60, left: 60
};
const OUTER_WIDTH = 960;
const OUTER_HEIGHT = 500;

// ES6 class
class ScatterChart {
  constructor(id, data, outerWidth, outerHeight) {
    this.id = id;
    this.data = data;

    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    this.baseWidth = outerWidth;
    this.baseHeight = outerHeight;
    this.svg = d3.select(`#${this.id} svg`)
      .attr('width', this.baseWidth)
      .attr('height', this.baseHeight);

    // If empty create element
    if (this.svg.empty()) {
      this.svg = d3.select('body')
        .insert('div')
        .attr('id', this.id)
        .append('svg')
        .attr('width', this.baseWidth)
        .attr('height', this.baseHeight);
    }

    const inner = this.svg.append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`)
      .attr('class', 'inner');
    // Make dots
    inner.append('g')
      .attr('class', 'dots');

    // Make axis
    inner.append('g')
      .attr('class', 'labels');

    // Make axis
    const axes = inner.append('g')
      .attr('class', 'axes');
    axes.append('g') // x axis
      .attr('class', 'axis')
      .attr('class', 'xaxis');
    axes.append('g') // y axis
      .attr('class', 'axis')
      .attr('class', 'yaxis');

    this.bindEvents();
    this.render();
    // this.generateData();
  }

  getWidth() {
    const outerWidth = parseInt(this.svg.style('width'), 10);
    const innerWidth = outerWidth - MARGIN.left - MARGIN.right;
    const width = innerWidth - PADDING.left - PADDING.right;

    return width;
  }

  getHeight() {
    const outerHeight = parseInt(this.svg.style('height'), 10);
    const innerHeight = outerHeight - MARGIN.top - MARGIN.bottom;
    const height = innerHeight - PADDING.top - PADDING.bottom;

    return height;
  }

  bindEvents() {
    d3.select(window).on('resize', () => {
      this.resized();
      this.render();
    });
  }

  resized() {
    const width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    const outerWidth = Math.min(this.baseWidth, width);
    this.svg.attr('width', outerWidth);

    const height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    const outerHeight = Math.min(this.baseHeight, height);
    this.svg.attr('height', outerHeight);
  }

  render() {
    const yScale = this.getYScale();
    const xScale = this.getXScale();
    // Set dots
    const dots = this.svg.select('g.inner g.dots')
      .selectAll('.dot')
      .data(this.data);
    ScatterChart.setDots(dots.enter()
      .append('circle')
      .attr('fill', d => this.color(d.category))
      .attr('class', 'dot'), xScale, yScale);

    ScatterChart.setDots(dots, xScale, yScale);

    dots.exit().remove();

    this.setAxes(xScale, yScale);
  }

  static setDots(sel, xScale, yScale) {
    sel.attr('r', 3.5)
      .attr('cx', d => xScale(d.HR))
      .attr('cy', d => yScale(d.logP));
  }

  setAxes(xScale, yScale) {
    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    this.svg.select('g.inner g.axes g.xaxis')
      .attr('transform', `translate(0, ${this.getHeight()})`)
      .call(xAxis);
    this.svg.select('g.inner g.axes g.yaxis')
      .call(yAxis);
  }

  getYScale() {
    return d3.scaleLinear()
      .domain([-1, Math.ceil(d3.max(this.data, d => d.logP))])
      .range([this.getHeight(), 0])
      .nice();
  }

  getXScale() {
    return d3.scaleLinear()
      .domain([0, Math.ceil(d3.max(this.data, d => d.HR))])
      .rangeRound([0, this.getWidth()])
      .nice();
  }
}

// Make bar chart factory function
// defaut export, defaut params
export default function (
  id = 'viz', data = d3.range(10),
  width = OUTER_WIDTH, height = OUTER_HEIGHT
) {
  return new ScatterChart(id, data, width, height);
}
