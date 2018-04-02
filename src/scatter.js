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
    color, data, legend, xScale, yScale, yLines, outerWidth, outerHeight, yTitle, xTitle, symbols
  }, dispatch) {
    this.id = id;
    this.data = data;
    this.xScale = fisheye.scale(xScale).distortion(0);
    this.yScale = fisheye.scale(yScale).distortion(0);
    this.yLines = yLines;
    this.dispatch = dispatch;
    this.color = color;

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
    this.background = this.inner.append('rect')
      .attr('class', 'background')
      .attr('transform', `translate(${-PADDING.left}, ${-PADDING.top})`)
      .attr('width', this.getWidth() + PADDING.left + PADDING.right)
      .attr('height', this.getHeight() + PADDING.top + PADDING.bottom);

    // Make lines
    this.inner.append('g')
      .attr('class', 'lines');

    // Make dots
    this.inner.append('g')
      .attr('class', 'dots');

    // Make labels
    this.labels = this.inner.append('g')
      .attr('class', 'labels')
      .selectAll('.label')
      .data(legend)
      .enter()
      .append('g')
      .attr('class', 'label')
      .attr('transform', (d, i) => `translate(30,${i * 25})`)
      .on('mouseenter', d => this.onEnterLabel(d))
      .on('mouseleave', d => this.onLeaveLabel(d));
    this.labels.append('text')
      .text(d => d)
      .attr('dx', '1em')
      .attr('dy', '5px');
    this.labels.append('circle')
      .attr('fill', d => this.color(d))
      .attr('r', 4);

    // Make symbols
    const offsetSymbols = (legend.length + 1) * 25;
    const legendSymbols = this.inner.append('g')
      .attr('class', 'symbols')
      .selectAll('.symbol')
      .data(symbols)
      .enter()
      .append('g')
      .attr('class', 'symbol')
      .attr('transform', (d, i) => `translate(30,${(i * 25) + offsetSymbols})`);
    legendSymbols.append('text')
      .text(d => d.label)
      .attr('dx', '1em')
      .attr('dy', '5px');
    legendSymbols.append('circle')
      .attr('class', d => d.classes)
      .attr('stroke', '#aaa')
      .attr('fill', '#aaa')
      .attr('r', 4);


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

    // Make tooltip
    this.tooltip = d3.select('body')
      .append('div')
      .classed('tooltip', true)
    this.tooltipHeader = this.tooltip.append('div')
      .attr('class', 'tooltip-header');
    this.tooltipBody = this.tooltip.append('div')
      .attr('class', 'tooltip-body');

    this.bindEvents();
    this.render();
    // this.generateData();
  }

  onEnterLabel(label) {
    this.selectedCategory = label;
    this.render();
  }

  onLeaveLabel() {
    this.selectedCategory = null;
    this.render();
  }

  onMouseoverDot(d) {
    const x = d3.event.pageX;
    const y = d3.event.pageY;
    this.tooltipHeader
      .html(d.category)
      .style('border-top-color', this.color(d.category));
    this.tooltipBody.html(d.exposure.replace(/_/g, ' '));
    this.tooltip
      .style('transform', `translate(${(x + 10).toFixed(2)}px,${(y).toFixed(2)}px)`)
      .style('opacity', 1);
  }

  onMouseoutDot() {
    this.tooltip
      .style('opacity', 0);
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
    this.background.on('mousemove', function () {
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
    this.setDots(dots.enter()
      .append('circle')
      .attr('fill', d => this.color(d.category))
      .attr('stroke', d => this.color(d.category))
      .attr('class', d => (d.confidence ? 'dot' : 'dot hollow'))
      .on('mouseover', d => this.onMouseoverDot(d))
      .on('mouseout', d => this.onMouseoutDot(d)), xScale, yScale);

    this.setDots(dots, xScale, yScale);
    dots.exit().remove();

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

  setDots(sel, xScale, yScale) {
    sel.attr('r', 3)
      .classed('hide', d => (this.selectedCategory ? d.category !== this.selectedCategory : false))
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
