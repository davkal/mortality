import * as d3 from 'd3';
import fisheye from './fisheye';

const MARGIN = {
  top: 30, right: 0, bottom: 15, left: 70
};
const PADDING = {
  top: 30, right: 0, bottom: 30, left: 40
};

// ES6 class
export default class ScatterChart {
  constructor(id, {
    color, data, xScale, yScale, yLines, yTitle, xTitle, symbols, moveEvent
  }, dispatch) {
    this.id = id;
    this.data = data;
    this.xScale = fisheye.scale(xScale).distortion(0);
    this.yScale = fisheye.scale(yScale).distortion(0);
    this.yLines = yLines;
    this.dispatch = dispatch;
    this.color = color;
    this.selectedCategories = [];
    this.hoveredCategory = null;
    this.selectedDots = [];
    this.moveEvent = moveEvent;
    this.highlightedLabel = null;

    this.makeDot = this.makeDot.bind(this);

    this.el = document.getElementById(id);
    this.svg = d3.select(`#${this.id} svg`);
    this.baseWidth = this.el.clientWidth;
    this.baseHeight = this.el.clientHeight;

    this.inner = this.svg.append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`)
      .attr('class', 'inner');

    // Background rect for mousemove
    this.background = this.inner.append('rect')
      .attr('class', 'background')
      .attr('transform', `translate(${-PADDING.left}, ${-PADDING.top})`);

    // Make lines
    this.inner.append('g')
      .attr('class', 'lines');

    // Make dots
    this.inner.append('g')
      .attr('class', 'dots');

    // Make symbols
    const legendSymbols = this.inner.append('g')
      .attr('class', 'symbols')
      .selectAll('.symbol')
      .data(symbols)
      .enter()
      .append('g')
      .attr('class', d => `${d.classes}  symbol`)
      .attr('transform', (d, i) => `translate(20,${((i * 20) + 10)})`);
    legendSymbols.append('text')
      .text(d => d.label)
      .attr('dx', '1em')
      .attr('dy', '5px');
    legendSymbols.append('circle')
      .attr('class', 'point')
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

    // Make tooltip
    this.tooltip = d3.select('body')
      .append('div')
      .classed('tooltip', true);
    this.tooltipHeader = this.tooltip.append('div')
      .attr('class', 'tooltip-header');
    this.tooltipBody = this.tooltip.append('div')
      .attr('class', 'tooltip-body');

    this.bindEvents();
    this.updateGraph();
    this.update();
  }

  onEnterLabel(label) {
    this.selectedCategory = label;
    this.update();
  }

  onLeaveLabel() {
    this.selectedCategory = null;
    this.update();
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
      this.dispatch.on(`categories.${this.id}`, ({ hovered, selected }) => {
        this.selectedCategories = selected;
        this.hoveredCategory = hovered;
        this.update();
      });
      this.dispatch.on(`variables.${this.id}`, ({ hovered, selected }) => {
        this.highlightedDot = hovered;
        this.selectedDots = selected;
        this.update();
      });
    }

    this.background.on('mousemove', () => this.onMouseMove());
    this.inner.on('mouseleave', () => {
      this.getXScale().distortion(0);
      this.getYScale().distortion(0);
      this.update(true);
      if (this.dispatch) this.dispatch.call(this.moveEvent, this, { mouse: null });
    });
  }

  onMouseMove() {
    const xScale = this.getXScale();
    const yScale = this.getYScale();
    const mouse = d3.mouse(this.background.node());

    xScale.distortion(2).focus(mouse[0]);
    yScale.distortion(2).focus(mouse[1]);
    this.update();

    if (this.dispatch) this.dispatch.call(this.moveEvent, this, { mouse });
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
    this.background
      .attr('width', this.getWidth() + PADDING.left + PADDING.right)
      .attr('height', this.getHeight() + PADDING.top + PADDING.bottom);
    this.xAxisLabel
      .attr('transform', `translate(${(this.getWidth() / 2)},${this.getHeight() + PADDING.bottom})`);
    this.yAxisLabel
      .attr('x', 0 - (this.getHeight() / 2));
  }

  update(animate) {
    const yScale = this.getYScale();
    const xScale = this.getXScale();
    // Set dots
    const dots = this.svg.select('g.inner g.dots')
      .selectAll('.dot')
      .data(this.data);
    this.setDots(dots.enter().append('g').call(s => this.makeDot(s)), xScale, yScale);

    this.setDots(dots, xScale, yScale, animate);
    dots.exit().remove();

    // Set lines
    if (this.yLines) {
      const yLines = this.svg.select('g.inner g.lines')
        .selectAll('.line')
        .data(this.yLines, d => d.id);
      ScatterChart.setYLines(yLines.enter()
        .append('line')
        .attr('class', 'line')
        .attr('stroke', '#ccc')
        .attr('stroke-dasharray', '5, 5'), xScale, yScale);
      ScatterChart.setYLines(yLines, xScale, yScale);
    }

    this.setAxes(xScale, yScale);
  }

  makeDot(sel) {
    sel
      .attr('class', 'dot')
      .classed('hollow', d => !d.confidence)
      .on('mouseover', d => this.onMouseoverDot(d))
      .on('mouseout', d => this.onMouseoutDot(d));
    sel.append('circle')
      .attr('class', 'outer')
      .attr('r', 10)
      .attr('fill', 'none')
      .attr('stroke', d => this.color(d.category));
    sel.append('circle')
      .attr('class', 'point')
      .attr('r', 3)
      .attr('fill', d => this.color(d.category))
      .attr('stroke', d => this.color(d.category));
  }

  static setYLines(sel, xScale, yScale) {
    sel
      .attr('x1', xScale(xScale.domain()[0]))
      .attr('x2', xScale(xScale.domain()[1]))
      .attr('y1', d => yScale(d.y))
      .attr('y2', d => yScale(d.y));
  }

  setDots(sel, xScale, yScale) {
    sel
      .classed('hide', d => this.categoryHidden(d.category))
      .classed('highlighted', d => this.dotHighlighted(d))
      .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`);
    sel.select('.point')
      .attr('r', d => (this.dotHighlighted(d) ? 6 : 3));
  }

  dotHighlighted(d) {
    return this.highlightedDot === d.exposure || this.selectedDots.indexOf(d.exposure) > -1;
  }

  categoryHidden(category) {
    if (!this.hoveredCategory && this.selectedCategories.length === 0) return false;
    const selected = this.selectedCategories && this.selectedCategories.indexOf(category) > -1;
    const hovered = this.hoveredCategory && this.hoveredCategory === category;
    return !selected && !hovered;
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
