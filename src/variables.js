import * as d3 from 'd3';

// ES6 class
export default class Variables {
  constructor(id, {
    color, data, maxSum
  }, dispatch) {
    this.id = id;
    this.data = data;
    this.dispatch = dispatch;
    this.selectedCategories = [];
    this.hoveredCategory = null;
    this.hovered = null;
    this.selected = [];

    this.color = color;
    this.el = d3.select(`#${this.id}`);

    this.filters = this.el
      .selectAll('.filter')
      .data(d3.keys(data))
      .enter()
      .append('div')
      .attr('class', 'filter')
      .on('click', d => this.onMouseClick(d))
      .on('mouseenter', d => this.onMouseEnter(d))
      .on('mouseleave', d => this.onMouseLeave(d));

    this.filters
      .append('span')
      .attr('class', 'filter-dot')
      .style('background-color', d => this.color(this.data[d].category));

    const wrappers = this.filters
      .append('div')
      .attr('class', 'filter-wrapper');

    wrappers
      .append('span')
      .attr('class', 'filter-label')
      .text(d => d.replace(/_/g, ' '));


    // Min width of 5%
    const barWidth = count => Math.max(5, Math.floor((count / maxSum) * 95));
    wrappers
      .append('div')
      .attr('class', 'filter-bars')
      .selectAll('.filter-bar')
      .data(d => this.data[d])
      .enter()
      .append('span')
      .attr('class', 'filter-bar')
      .style('background-color', d => this.color(d.category))
      .style('width', d => `${barWidth(d.count)}%`)
      .style('opacity', (d, i) => `${(i + 1) / d.valueCount}`);

    this.bindEvents();
    this.update();
  }

  onMouseClick(d) {
    if (this.selected.indexOf(d) > -1) {
      this.selected = this.selected.filter(s => s !== d);
    } else {
      this.selected = [...this.selected, d];
    }
    this.publish();
    this.update();
  }

  onMouseEnter(d) {
    this.hovered = d;
    this.publish();
  }

  onMouseLeave() {
    this.hovered = null;
    this.publish();
  }

  publish() {
    this.dispatch.call('variables', this, {
      hovered: this.hovered,
      selected: this.selected
    });
  }

  bindEvents() {
    if (this.dispatch) {
      this.dispatch.on(`categories.${this.id}`, ({ hovered, selected }) => {
        this.selectedCategories = selected;
        this.hoveredCategory = hovered;
        this.update();
      });
    }
  }

  categoryHidden(category) {
    if (!this.hoveredCategory && this.selectedCategories.length === 0) return false;
    const selected = this.selectedCategories && this.selectedCategories.indexOf(category) > -1;
    const hovered = this.hoveredCategory && this.hoveredCategory === category;
    return !selected && !hovered;
  }

  variableSelected(d) {
    return this.selected && this.selected.indexOf(d) > -1;
  }

  update() {
    this.filters
      .classed('no-display', d => this.categoryHidden(this.data[d].category))
      .classed('selected', d => this.variableSelected(d));
  }
}
