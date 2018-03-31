import * as d3 from 'd3';

const MARGIN = {
  top: 40, right: 0, bottom: 60, left: 60
};
const PADDING = {
  top: 30, right: 0, bottom: 30, left: 30
};
const OUTER_WIDTH = 960;
const OUTER_HEIGHT = 500;

// ES6 class
class ScatterChart {
  constructor(id, {
    data, xScale, yScale, yLines, outerWidth, outerHeight, yTitle, xTitle
  }) {
    this.id = id;
    this.data = data;
    this.xScale = xScale;
    this.yScale = yScale;
    this.yLines = yLines;

    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.el = document.getElementById(id);
    this.baseWidth = outerWidth || this.el.clientWidth || OUTER_WIDTH;
    this.baseHeight = outerHeight || this.el.clientHeight || OUTER_HEIGHT;
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

    axes.append('text')
      .attr('transform', `translate(${(this.getWidth() / 2)},${this.getHeight() + PADDING.bottom})`)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(xTitle);

    axes.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - PADDING.left)
      .attr('x', 0 - (this.getHeight() / 2))
      .attr('dy', '-1em')
      .style('text-anchor', 'middle')
      .text(yTitle);

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
      .attr('stroke', d => this.color(d.category))
      .attr('class', d => (d.confidence ? 'dot' : 'dot hollow')), xScale, yScale);

    ScatterChart.setDots(dots, xScale, yScale);
    dots.exit().remove();

    // Set lines
    const yLines = this.svg.select('g.inner g.lines')
      .selectAll('.line')
      .data(this.yLines);
    yLines.enter()
      .append('line')
      .attr('stroke', '#ccc')
      .attr('stroke-dasharray', '5, 5')
      .attr('x1', xScale(xScale.domain()[0]))
      .attr('x2', xScale(xScale.domain()[1]))
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d));

    this.setAxes(xScale, yScale);
  }

  static setDots(sel, xScale, yScale) {
    sel.attr('r', 2.5)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y));
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
  return new ScatterChart(id, data);
}
