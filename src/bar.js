import * as d3 from 'd3';

const MARGIN = {
  top: 30, right: 20, bottom: 0, left: 0
};
const PADDING = {
  top: 0, right: 20, bottom: 0, left: 0
};

// ES6 class
export default class BarChart {
  constructor(id, { color, data }, dispatch) {
    this.id = id;
    this.data = data;
    this.dispatch = dispatch;
    this.color = color;
    this.el = document.getElementById(id);
    this.svg = d3.select(`#${this.id} svg`);
    this.baseWidth = this.el.clientWidth;
    this.baseHeight = this.el.clientHeight;

    const inner = this.svg.append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`)
      .attr('class', 'inner');

    // Make bars
    // inner.append('g')
    //   .attr('class', 'bars');

    // Make axis
    inner.append('g')
      .attr('class', 'labels');

    // Make axis
    // const axes = inner.append('g')
    //   .attr('class', 'axes');
    // axes.append('g') // x axis
    //   .attr('class', 'axis')
    //   .attr('class', 'xaxis');
    // axes.append('g') // y axis
    //   .attr('class', 'axis')
    //   .attr('class', 'yaxis');

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
  }

  update() {
    // const yScale = this.getYScale();
    // const xScale = this.getXScale();
    // Set bars
    // const bars = this.svg.select('g.inner g.bars')
    //   .selectAll('rect')
    //   .data(this.data);
    // this.setBars(bars.enter().append('rect'), xScale, yScale);

    // Set labels
    const labels = this.svg.select('g.inner g.labels')
      .selectAll('.label')
      .data(d3.keys(this.data));
    labels.enter()
      .append('g')
      .attr('class', 'label')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)
      .each(function (d) {
        const label = d3.select(this);
        label.append('text').text(d);
      });

    // if (doTransition) {
    //   this.setBars(bars.transition(), xScale, yScale);
    //   BarChart.setLabels(labels.transition(), xScale, yScale);
    // } else {
    //   this.setBars(bars, xScale, yScale);
    //   BarChart.setLabels(labels, xScale, yScale);
    // }

    // bars.exit().remove();
    labels.exit().remove();

    // this.setAxes(xScale, yScale);
  }

  setBars(sel, xScale, yScale) {
    sel.attr('x', (d, i) => xScale(i))
      .attr('y', d => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', d => Math.abs(this.getHeight() - yScale(d)))
      .attr('fill', d => `rgb(0, ${Math.min(d * 10, 240)}, 0)`);
  }

  static setLabels(sel, xScale, yScale) {
    sel.text(d => ((d >= 2) ? `${d}` : '')) // eslint-disable-line no-use-before-define
      .attr('x', (d, i) => xScale(i) + (xScale.bandwidth() / 2))
      .attr('y', d => yScale(d) + 20)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '13px')
      .attr('fill', 'white');
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
      .domain([0, d3.max(this.data)])
      .range([this.getHeight(), 0]);
  }

  getXScale() {
    return d3.scaleBand()
      .domain(d3.range(this.data.length))
      .rangeRound([0, this.getWidth()])
      .paddingInner(0.05);
  }
}
