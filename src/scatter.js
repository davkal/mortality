import * as d3 from 'd3';
import fisheye from './fisheye';

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
    data, legend, xScale, yScale, yLines, outerWidth, outerHeight, yTitle, xTitle
  }, dispatch) {
    this.id = id;
    this.data = data;
    this.xScale = fisheye.scale(xScale).distortion(0);
    this.yScale = fisheye.scale(yScale).distortion(0);
    this.yLines = yLines;
    this.legend = legend;
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

    this.inner = this.svg.append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`)
      .attr('class', 'inner');

    // Background rect for mousemove
    this.inner.append('rect')
      .attr('class', 'background')
      .attr('width', this.getWidth())
      .attr('height', this.getHeight());

    // Make lines
    this.inner.append('g')
      .attr('class', 'lines');

    // Make dots
    this.inner.append('g')
      .attr('class', 'dots');

    // Make labels
    this.inner.append('g')
      .attr('class', 'labels');

    // Make axis
    const axes = this.inner.append('g')
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

    const self = this;
    this.inner.on('mousemove', function () {
      const xScale = self.getXScale();
      const yScale = self.getYScale();
      const mouse = d3.mouse(this);

      xScale.distortion(2.5).focus(mouse[0]);
      yScale.distortion(2.5).focus(mouse[1]);
      self.render();

      if (self.dispatch) self.dispatch.call('mousemove', self, { mouse });
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

    // Set labels
    const labels = this.svg.select('g.inner g.labels')
      .selectAll('.label')
      .data(this.legend)
      .enter()
      .append('g')
      .attr('class', 'label');
    labels.append('text')
      .text(d => d)
      .attr('dx', '1em')
      .attr('dy', '5px');
    labels.append('circle')
      .attr('fill', d => this.color(d))
      .attr('r', 4);
    ScatterChart.setLabels(labels);

    // Set lines
    const yLines = this.svg.select('g.inner g.lines')
      .selectAll('.line')
      .data(this.yLines, d => d.id);
    ScatterChart.setYLines(yLines.enter()
      .append('line')
      .attr('class', 'line')
      .attr('stroke', '#ccc')
      .attr('stroke-dasharray', '5, 5'), xScale, yScale);
    ScatterChart.setYLines(yLines, xScale, yScale);
    this.setAxes(xScale, yScale);
  }

  static setYLines(sel, xScale, yScale) {
    sel
      .attr('x1', xScale(xScale.domain()[0]))
      .attr('x2', xScale(xScale.domain()[1]))
      .attr('y1', d => yScale(d.y))
      .attr('y2', d => yScale(d.y));
  }

  static setDots(sel, xScale, yScale) {
    sel.attr('r', 3)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y));
  }

  static setLabels(sel) {
    sel
      .attr('transform', (d, i) => `translate(30,${i * 30})`);
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
  return new ScatterChart(id, config, dispatch);
}
