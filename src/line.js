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
class LineChart {
  constructor(id, {
    data, xScale, yScale, outerWidth, outerHeight
  }) {
    this.id = id;
    this.data = data;
    this.xScale = xScale;
    this.yScale = yScale;

    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.el = document.getElementById(id);
    this.baseWidth = outerWidth || this.el.outerWidth || OUTER_WIDTH;
    this.baseHeight = outerHeight || this.el.outerHeight || OUTER_HEIGHT;
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
    // Make lines
    inner.append('g')
      .attr('class', 'lines');

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
    // Set lines
    const lines = this.svg.select('g.inner g.lines')
      .selectAll('.line')
      .data(this.data);
    LineChart.setLines(lines.enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', d => this.color(d.category))
      .attr('stroke-width', 1.5)
      .attr('class', 'line'), xScale, yScale);

    LineChart.setLines(lines, xScale, yScale);

    lines.exit().remove();

    this.setAxes(xScale, yScale);
  }

  static setLines(sel, xScale, yScale) {
    sel
      .attr('d', d3.line()
        .curve(d3.curveBasis)
        .x(d => xScale(d.x))
        .y(d => yScale(d.y)));
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
    return this.yScale
      .range([this.getHeight(), 0])
      .nice();
  }

  getXScale() {
    return this.xScale
      .rangeRound([0, this.getWidth()])
      .nice();
  }
}

// Make bar chart factory function
// defaut export, defaut params
export default function (id = 'viz', data = d3.range(10)) {
  return new LineChart(id, data);
}
