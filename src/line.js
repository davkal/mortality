import * as d3 from 'd3';
import fisheye from './fisheye';

const MARGIN = {
  top: 30, right: 30, bottom: 15, left: 30
};
const PADDING = {
  top: 30, right: 0, bottom: 30, left: 0
};

// ES6 class
export default class LineChart {
  constructor(id, {
    color, data, moveEvent, xScale, yScale, yTitle, xTitle
  }, dispatch) {
    this.id = id;
    this.data = data;
    this.xScale = xScale;
    this.yScale = fisheye.scale(yScale).distortion(0);
    this.dispatch = dispatch;
    this.color = color;
    this.selectedCategories = [];
    this.hoveredCategory = null;
    this.moveEvent = moveEvent;

    this.el = document.getElementById(id);
    this.svg = d3.select(`#${this.id} svg`);
    this.baseWidth = this.el.clientWidth;
    this.baseHeight = this.el.clientHeight;

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

    this.xAxisLabel = axes.append('text')
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(xTitle);

    this.yAxisLabel = axes.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - PADDING.left)
      .attr('dy', '-1em')
      .style('text-anchor', 'middle')
      .text(yTitle);

    this.bindEvents();
    this.updateGraph();
    this.update();
  }

  getWidth() {
    const innerWidth = this.baseWidth - MARGIN.left - MARGIN.right;
    const width = innerWidth - PADDING.left - PADDING.right;
    return width;
  }

  getHeight() {
    const innerHeight = this.baseHeight - MARGIN.top - MARGIN.bottom;
    const height = innerHeight - PADDING.top - PADDING.bottom;
    return height;
  }

  bindEvents() {
    d3.select(window).on(`resize.${this.id}`, () => this.onResize());

    if (this.dispatch) {
      this.dispatch.on(`${this.moveEvent}.${this.id}`, ({ mouse }) => {
        const yScale = this.getYScale();
        if (mouse) {
          yScale.distortion(2.5).focus(mouse[1]);
          this.update();
        } else {
          yScale.distortion(0);
          this.update(true);
        }
      });
      this.dispatch.on(`categories.${this.id}`, ({ hovered, selected }) => {
        this.selectedCategories = selected;
        this.hoveredCategory = hovered;
        this.update();
      });
    }
  }

  onResize() {
    this.baseWidth = this.el.clientWidth;
    this.baseHeight = this.el.clientHeight;
    this.updateGraph();
    this.update();
  }

  updateGraph() {
    this.svg
      .attr('width', this.baseWidth)
      .attr('height', this.baseHeight);
    this.xAxisLabel
      .attr('transform', `translate(${(this.getWidth() / 2)},${this.getHeight() + PADDING.bottom})`);
    this.yAxisLabel
      .attr('x', 0 - (this.getHeight() / 2));
  }

  update(animate) {
    const yScale = this.getYScale();
    const xScale = this.getXScale();
    // Set lines
    const lines = this.svg.select('g.inner g.lines')
      .selectAll('.line')
      .data(this.data);
    this.setLines(lines.enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', d => this.color(d.category))
      .attr('stroke-width', 1.5)
      .attr('class', 'line'), xScale, yScale);

    this.setLines(lines, xScale, yScale, animate);

    lines.exit().remove();

    this.setAxes(xScale, yScale);
  }

  setLines(sel, xScale, yScale, animate) {
    sel.classed('hide', d => this.categoryHidden(d.category));
    const line = d3.line()
      .curve(d3.curveBasis)
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));
    const selection = animate ? sel.transition() : sel;
    selection
      .attr('d', line);
  }

  categoryHidden(category) {
    if (!this.hoveredCategory && this.selectedCategories.length === 0) return false;
    const selected = this.selectedCategories && this.selectedCategories.indexOf(category) > -1;
    const hovered = this.hoveredCategory && this.hoveredCategory === category;
    return !selected && !hovered;
  }

  setAxes(xScale) {
    // const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale).ticks(3);

    this.svg.select('g.inner g.axes g.xaxis')
      .attr('transform', `translate(0, ${this.getHeight()})`)
      .call(xAxis);
    // this.svg.select('g.inner g.axes g.yaxis')
    //   .call(yAxis);
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
