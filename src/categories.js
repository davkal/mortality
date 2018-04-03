import * as d3 from 'd3';

// ES6 class
export default class Categories {
  constructor(id, {
    color, data, categories
  }, dispatch) {
    this.id = id;
    this.data = data;
    this.dispatch = dispatch;
    this.selected = [];
    this.hovered = null;

    this.color = color;
    this.el = d3.select(`#${this.id}`);

    this.filters = this.el
      .selectAll('.filter')
      .data(categories)
      .enter()
      .append('div')
      .attr('class', 'filter')
      .on('click', d => this.onMouseClick(d))
      .on('mouseenter', d => this.onMouseEnter(d))
      .on('mouseleave', d => this.onMouseLeave(d));

    this.filters
      .append('span')
      .attr('class', 'filter-dot')
      .style('background-color', d => this.color(d));
    this.filters
      .append('span')
      .attr('class', 'filter-label')
      .text(d => d);

    // this.bindEvents();
    // this.update();
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
    this.dispatch.call('categories', this, {
      hovered: this.hovered,
      selected: this.selected
    });
  }

  // bindEvents() { }

  updateColor(d) {
    if (this.selected.length === 0 || this.selected.indexOf(d) > -1) {
      return this.color(d);
    }
    return '#fff';
  }

  update() {
    this.filters.select('.filter-dot')
      .style('background-color', d => this.updateColor(d));
  }
}
