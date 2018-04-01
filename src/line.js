import * as d3 from 'd3';
import fisheye from './fisheye';

const MARGIN = {
  top: 40, right: 30, bottom: 60, left: 30
};
const PADDING = {
  top: 30, right: 0, bottom: 30, left: 0
};
const OUTER_WIDTH = 960;
const OUTER_HEIGHT = 500;

// ES6 class
class LineChart {
  constructor(id, {
    data, xScale, yScale, outerWidth, outerHeight, yTitle, xTitle
  }, dispatch) {
    this.id = id;
    this.data = data;
    this.xScale = xScale;
    this.yScale = fisheye.scale(yScale).distortion(0);
    this.dispatch = dispatch;

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

    // Make axis
    inner.append('g')
      .attr('class', 'labels');

    // Make axis
    const axes = inner.append('g')
      .attr('class', 'axes');
    axes.append('g') // x axis
      .attr('class', 'axis')
      .attr('class', 'xaxis');
    // axes.append('g') // y axis
    //   .attr('class', 'axis')
    //   .attr('class', 'yaxis');

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

    if (this.dispatch) {
      this.dispatch.on('mousemove.line', ({ mouse }) => {
        const yScale = this.getYScale();
        yScale.distortion(2.5).focus(mouse[1]);
        this.render();
      });
    }
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
    this.yScale
      .range([this.getHeight(), 0])
      .nice();
    return this.yScale;
  }

  getXScale() {
    this.xScale
      .range([0, this.getWidth()])
      .nice();
    return this.xScale;
  }
}

// Make bar chart factory function
// defaut export, defaut params
export default function (id = 'viz', config, dispatch) {
  return new LineChart(id, config, dispatch);
}
