!function(t){function e(e){for(var r,s,o=e[0],l=e[1],c=e[2],h=0,d=[];h<o.length;h++)s=o[h],i[s]&&d.push(i[s][0]),i[s]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(t[r]=l[r]);for(u&&u(e);d.length;)d.shift()();return a.push.apply(a,c||[]),n()}function n(){for(var t,e=0;e<a.length;e++){for(var n=a[e],r=!0,o=1;o<n.length;o++){var l=n[o];0!==i[l]&&(r=!1)}r&&(a.splice(e--,1),t=s(s.s=n[0]))}return t}var r={},i={1:0},a=[];function s(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=t,s.c=r,s.d=function(t,e,n){s.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},s.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/";var o=window.webpackJsonp=window.webpackJsonp||[],l=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var u=l;a.push([8,0]),n()}([,function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n(0));e.default={scale:function(t){return function t(e,n,i){function a(t){var a=e(t),s=a<i,o=r.extent(e.range()),l=o[0],c=o[1],u=s?i-l:c-i;return 0==u&&(u=c-l),(s?-1:1)*u*(n+1)/(n+u/Math.abs(a-i))+i}a.distortion=function(t){return arguments.length?(n=+t,a):n};a.focus=function(t){return arguments.length?(i=+t,a):i};a.copy=function(){return t(e.copy(),n,i)};a.nice=e.nice;a.ticks=e.ticks;a.tickFormat=e.tickFormat;a.domain=function(){var t=e.domain.apply(e,arguments);return t===e?a:t};a.range=function(){var t=e.range.apply(e,arguments);return t===e?a:t};return a}(t,3,0)},circular:function(){var t,e,n=200,r=2,i=[0,0];function a(r){var a=r.x-i[0],s=r.y-i[1],o=Math.sqrt(a*a+s*s);if(!o||o>=n)return{x:r.x,y:r.y,z:o>=n?1:10};var l=t*(1-Math.exp(-o*e))/o*.75+.25;return{x:i[0]+a*l,y:i[1]+s*l,z:Math.min(l,10)}}function s(){return t=(t=Math.exp(r))/(t-1)*n,e=r/n,a}return a.radius=function(t){return arguments.length?(n=+t,s()):n},a.distortion=function(t){return arguments.length?(r=+t,s()):r},a.focus=function(t){return arguments.length?(i=t,a):i},s()}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n(0));var a=function(){function t(e,n,r){var a=this,s=n.color,o=n.data,l=n.maxSum;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.id=e,this.data=o,this.dispatch=r,this.selectedCategories=[],this.hoveredCategory=null,this.hovered=null,this.selected=[],this.color=s,this.el=i.select("#"+this.id),this.filters=this.el.selectAll(".filter").data(i.keys(o)).enter().append("div").attr("class","filter").on("click",function(t){return a.onMouseClick(t)}).on("mouseenter",function(t){return a.onMouseEnter(t)}).on("mouseleave",function(t){return a.onMouseLeave(t)}),this.filters.append("span").attr("class","filter-dot").style("background-color",function(t){return a.color(a.data[t].category)});var c=this.filters.append("div").attr("class","filter-wrapper");c.append("span").attr("class","filter-label").text(function(t){return t.replace(/_/g," ")});c.append("div").attr("class","filter-bars").selectAll(".filter-bar").data(function(t){return a.data[t]}).enter().append("span").attr("class","filter-bar").style("background-color",function(t){return a.color(t.category)}).style("width",function(t){return e=t.count,Math.max(5,Math.floor(e/l*95))+"%";var e}).style("opacity",function(t,e){return""+(e+1)/t.valueCount}),this.bindEvents(),this.update()}return r(t,[{key:"onMouseClick",value:function(t){this.selected.indexOf(t)>-1?this.selected=this.selected.filter(function(e){return e!==t}):this.selected=[].concat(function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}(this.selected),[t]),this.publish(),this.update()}},{key:"onMouseEnter",value:function(t){this.hovered=t,this.publish()}},{key:"onMouseLeave",value:function(){this.hovered=null,this.publish()}},{key:"publish",value:function(){this.dispatch.call("variables",this,{hovered:this.hovered,selected:this.selected})}},{key:"bindEvents",value:function(){var t=this;this.dispatch&&this.dispatch.on("categories."+this.id,function(e){var n=e.hovered,r=e.selected;t.selectedCategories=r,t.hoveredCategory=n,t.update()})}},{key:"categoryHidden",value:function(t){if(!this.hoveredCategory&&0===this.selectedCategories.length)return!1;var e=this.selectedCategories&&this.selectedCategories.indexOf(t)>-1,n=this.hoveredCategory&&this.hoveredCategory===t;return!e&&!n}},{key:"variableSelected",value:function(t){return this.selected&&this.selected.indexOf(t)>-1}},{key:"update",value:function(){var t=this;this.filters.classed("no-display",function(e){return t.categoryHidden(t.data[e].category)}).classed("selected",function(e){return t.variableSelected(e)})}}]),t}();e.default=a},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n(0));var a=function(){function t(e,n,r){var a=this,s=n.color,o=n.data,l=n.categories;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.id=e,this.data=o,this.dispatch=r,this.selected=[],this.hovered=null,this.color=s,this.el=i.select("#"+this.id),this.filters=this.el.selectAll(".filter").data(l).enter().append("div").attr("class","filter").on("click",function(t){return a.onMouseClick(t)}).on("mouseenter",function(t){return a.onMouseEnter(t)}).on("mouseleave",function(t){return a.onMouseLeave(t)}),this.filters.append("span").attr("class","filter-dot").style("background-color",function(t){return a.color(t)}),this.filters.append("span").attr("class","filter-label").text(function(t){return t})}return r(t,[{key:"onMouseClick",value:function(t){this.selected.indexOf(t)>-1?this.selected=this.selected.filter(function(e){return e!==t}):this.selected=[].concat(function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}(this.selected),[t]),this.publish(),this.update()}},{key:"onMouseEnter",value:function(t){this.hovered=t,this.publish()}},{key:"onMouseLeave",value:function(){this.hovered=null,this.publish()}},{key:"publish",value:function(){this.dispatch.call("categories",this,{hovered:this.hovered,selected:this.selected})}},{key:"updateColor",value:function(t){return 0===this.selected.length||this.selected.indexOf(t)>-1?this.color(t):"#fff"}},{key:"update",value:function(){var t=this;this.filters.select(".filter-dot").style("background-color",function(e){return t.updateColor(e)})}}]),t}();e.default=a},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r,i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),a=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n(0)),s=n(1),o=(r=s)&&r.__esModule?r:{default:r};var l={top:30,right:0,bottom:15,left:70},c={top:30,right:0,bottom:30,left:40},u=function(){function t(e,n,r){var i=n.color,s=n.data,u=n.xScale,h=n.yScale,d=n.yLines,f=n.yTitle,p=n.xTitle,v=n.symbols,g=n.moveEvent;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.id=e,this.data=s,this.xScale=o.default.scale(u).distortion(0),this.yScale=o.default.scale(h).distortion(0),this.yLines=d,this.dispatch=r,this.color=i,this.selectedCategories=[],this.hoveredCategory=null,this.selectedDots=[],this.moveEvent=g,this.highlightedLabel=null,this.makeDot=this.makeDot.bind(this),this.el=document.getElementById(e),this.svg=a.select("#"+this.id+" svg"),this.baseWidth=this.el.clientWidth,this.baseHeight=this.el.clientHeight,this.inner=this.svg.append("g").attr("transform","translate("+l.left+", "+l.top+")").attr("class","inner"),this.background=this.inner.append("rect").attr("class","background").attr("transform","translate("+-c.left+", "+-c.top+")"),this.inner.append("g").attr("class","lines"),this.inner.append("g").attr("class","dots");var y=this.inner.append("g").attr("class","symbols").selectAll(".symbol").data(v).enter().append("g").attr("class",function(t){return t.classes+"  symbol"}).attr("transform",function(t,e){return"translate(20,"+(20*e+10)+")"});y.append("text").text(function(t){return t.label}).attr("dx","1em").attr("dy","5px"),y.append("circle").attr("class","point").attr("stroke","#aaa").attr("fill","#aaa").attr("r",4);var m=this.inner.append("g").attr("class","axes");m.append("g").attr("class","axis").attr("class","xaxis"),m.append("g").attr("class","axis").attr("class","yaxis"),this.xAxisLabel=m.append("text").attr("dy","1em").style("text-anchor","middle").text(p),this.yAxisLabel=m.append("text").attr("transform","rotate(-90)").attr("y",0-c.left).attr("dy","-1em").style("text-anchor","middle").text(f),this.tooltip=a.select("body").append("div").classed("tooltip",!0),this.tooltipHeader=this.tooltip.append("div").attr("class","tooltip-header"),this.tooltipBody=this.tooltip.append("div").attr("class","tooltip-body"),this.bindEvents(),this.updateGraph(),this.update()}return i(t,[{key:"onEnterLabel",value:function(t){this.selectedCategory=t,this.update()}},{key:"onLeaveLabel",value:function(){this.selectedCategory=null,this.update()}},{key:"onMouseoverDot",value:function(t){var e=a.event.pageX,n=a.event.pageY;this.tooltipHeader.html(t.category).style("border-top-color",this.color(t.category)),this.tooltipBody.html(t.exposure.replace(/_/g," ")),this.tooltip.style("transform","translate("+(e+10).toFixed(2)+"px,"+n.toFixed(2)+"px)").style("opacity",1)}},{key:"onMouseoutDot",value:function(){this.tooltip.style("opacity",0)}},{key:"getWidth",value:function(){return this.baseWidth-l.left-l.right-c.left-c.right}},{key:"getHeight",value:function(){return this.baseHeight-l.top-l.bottom-c.top-c.bottom}},{key:"bindEvents",value:function(){var t=this;a.select(window).on("resize."+this.id,function(){return t.onResize()}),this.dispatch&&(this.dispatch.on("categories."+this.id,function(e){var n=e.hovered,r=e.selected;t.selectedCategories=r,t.hoveredCategory=n,t.update()}),this.dispatch.on("variables."+this.id,function(e){var n=e.hovered,r=e.selected;t.highlightedDot=n,t.selectedDots=r,t.update()})),this.background.on("mousemove",function(){return t.onMouseMove()}),this.inner.on("mouseleave",function(){t.getXScale().distortion(0),t.getYScale().distortion(0),t.update(!0),t.dispatch&&t.dispatch.call(t.moveEvent,t,{mouse:null})})}},{key:"onMouseMove",value:function(){var t=this.getXScale(),e=this.getYScale(),n=a.mouse(this.background.node());t.distortion(2).focus(n[0]),e.distortion(2).focus(n[1]),this.update(),this.dispatch&&this.dispatch.call(this.moveEvent,this,{mouse:n})}},{key:"onResize",value:function(){this.baseWidth=this.el.clientWidth,this.baseHeight=this.el.clientHeight,this.updateGraph(),this.update()}},{key:"updateGraph",value:function(){this.svg.attr("width",this.baseWidth).attr("height",this.baseHeight),this.background.attr("width",this.getWidth()+c.left+c.right).attr("height",this.getHeight()+c.top+c.bottom),this.xAxisLabel.attr("transform","translate("+this.getWidth()/2+","+(this.getHeight()+c.bottom)+")"),this.yAxisLabel.attr("x",0-this.getHeight()/2)}},{key:"update",value:function(e){var n=this,r=this.getYScale(),i=this.getXScale(),a=this.svg.select("g.inner g.dots").selectAll(".dot").data(this.data);if(this.setDots(a.enter().append("g").call(function(t){return n.makeDot(t)}),i,r),this.setDots(a,i,r,e),a.exit().remove(),this.yLines){var s=this.svg.select("g.inner g.lines").selectAll(".line").data(this.yLines,function(t){return t.id});t.setYLines(s.enter().append("line").attr("class","line").attr("stroke","#ccc").attr("stroke-dasharray","5, 5"),i,r),t.setYLines(s,i,r)}this.setAxes(i,r)}},{key:"makeDot",value:function(t){var e=this;t.attr("class","dot").classed("hollow",function(t){return!t.confidence}).on("mouseover",function(t){return e.onMouseoverDot(t)}).on("mouseout",function(t){return e.onMouseoutDot(t)}),t.append("circle").attr("class","outer").attr("r",10).attr("fill","none").attr("stroke",function(t){return e.color(t.category)}),t.append("circle").attr("class","point").attr("r",3).attr("fill",function(t){return e.color(t.category)}).attr("stroke",function(t){return e.color(t.category)})}},{key:"setDots",value:function(t,e,n){var r=this;t.classed("hide",function(t){return r.categoryHidden(t.category)}).classed("highlighted",function(t){return r.dotHighlighted(t)}).attr("transform",function(t){return"translate("+e(t.x)+","+n(t.y)+")"}),t.select(".point").attr("r",function(t){return r.dotHighlighted(t)?6:3})}},{key:"dotHighlighted",value:function(t){return this.highlightedDot===t.exposure||this.selectedDots.indexOf(t.exposure)>-1}},{key:"categoryHidden",value:function(t){if(!this.hoveredCategory&&0===this.selectedCategories.length)return!1;var e=this.selectedCategories&&this.selectedCategories.indexOf(t)>-1,n=this.hoveredCategory&&this.hoveredCategory===t;return!e&&!n}},{key:"setAxes",value:function(t,e){var n=a.axisLeft(e),r=a.axisBottom(t);this.svg.select("g.inner g.axes g.xaxis").attr("transform","translate(0, "+this.getHeight()+")").call(r),this.svg.select("g.inner g.axes g.yaxis").call(n)}},{key:"getYScale",value:function(){return this.yScale.range([this.getHeight(),0]).nice(),this.yScale}},{key:"getXScale",value:function(){return this.xScale.range([0,this.getWidth()]).nice(),this.xScale}}],[{key:"setYLines",value:function(t,e,n){t.attr("x1",e(e.domain()[0])).attr("x2",e(e.domain()[1])).attr("y1",function(t){return n(t.y)}).attr("y2",function(t){return n(t.y)})}}]),t}();e.default=u},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r,i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),a=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n(0)),s=n(1),o=(r=s)&&r.__esModule?r:{default:r};var l={top:30,right:30,bottom:15,left:30},c={top:30,right:0,bottom:30,left:0},u=function(){function t(e,n,r){var i=n.color,s=n.data,u=n.moveEvent,h=n.xScale,d=n.yScale,f=n.yTitle,p=n.xTitle;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.id=e,this.data=s,this.xScale=h,this.yScale=o.default.scale(d).distortion(0),this.dispatch=r,this.color=i,this.selectedCategories=[],this.hoveredCategory=null,this.moveEvent=u,this.el=document.getElementById(e),this.svg=a.select("#"+this.id+" svg"),this.baseWidth=this.el.clientWidth,this.baseHeight=this.el.clientHeight;var v=this.svg.append("g").attr("transform","translate("+l.left+", "+l.top+")").attr("class","inner");v.append("g").attr("class","lines"),v.append("g").attr("class","labels");var g=v.append("g").attr("class","axes");g.append("g").attr("class","axis").attr("class","xaxis"),this.xAxisLabel=g.append("text").attr("dy","1em").style("text-anchor","middle").text(p),this.yAxisLabel=g.append("text").attr("transform","rotate(-90)").attr("y",0-c.left).attr("dy","-1em").style("text-anchor","middle").text(f),this.bindEvents(),this.updateGraph(),this.update()}return i(t,[{key:"getWidth",value:function(){return this.baseWidth-l.left-l.right-c.left-c.right}},{key:"getHeight",value:function(){return this.baseHeight-l.top-l.bottom-c.top-c.bottom}},{key:"bindEvents",value:function(){var t=this;a.select(window).on("resize."+this.id,function(){return t.onResize()}),this.dispatch&&(this.dispatch.on(this.moveEvent+"."+this.id,function(e){var n=e.mouse,r=t.getYScale();n?(r.distortion(2.5).focus(n[1]),t.update()):(r.distortion(0),t.update(!0))}),this.dispatch.on("categories."+this.id,function(e){var n=e.hovered,r=e.selected;t.selectedCategories=r,t.hoveredCategory=n,t.update()}))}},{key:"onResize",value:function(){this.baseWidth=this.el.clientWidth,this.baseHeight=this.el.clientHeight,this.updateGraph(),this.update()}},{key:"updateGraph",value:function(){this.svg.attr("width",this.baseWidth).attr("height",this.baseHeight),this.xAxisLabel.attr("transform","translate("+this.getWidth()/2+","+(this.getHeight()+c.bottom)+")"),this.yAxisLabel.attr("x",0-this.getHeight()/2)}},{key:"update",value:function(t){var e=this,n=this.getYScale(),r=this.getXScale(),i=this.svg.select("g.inner g.lines").selectAll(".line").data(this.data);this.setLines(i.enter().append("path").attr("fill","none").attr("stroke",function(t){return e.color(t.category)}).attr("stroke-width",1.5).attr("class","line"),r,n),this.setLines(i,r,n,t),i.exit().remove(),this.setAxes(r,n)}},{key:"setLines",value:function(t,e,n,r){var i=this;t.classed("hide",function(t){return i.categoryHidden(t.category)});var s=a.line().curve(a.curveBasis).x(function(t){return e(t[0])}).y(function(t){return n(t[1])});(r?t.transition():t).attr("d",s)}},{key:"categoryHidden",value:function(t){if(!this.hoveredCategory&&0===this.selectedCategories.length)return!1;var e=this.selectedCategories&&this.selectedCategories.indexOf(t)>-1,n=this.hoveredCategory&&this.hoveredCategory===t;return!e&&!n}},{key:"setAxes",value:function(t){var e=a.axisBottom(t).ticks(3);this.svg.select("g.inner g.axes g.xaxis").attr("transform","translate(0, "+this.getHeight()+")").call(e)}},{key:"getYScale",value:function(){return this.yScale.range([this.getHeight(),0]).nice(),this.yScale}},{key:"getXScale",value:function(){return this.xScale.range([0,this.getWidth()]).nice(),this.xScale}}]),t}();e.default=u},,,function(t,e,n){"use strict";var r=function(){return function(t,e){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return function(t,e){var n=[],r=!0,i=!1,a=void 0;try{for(var s,o=t[Symbol.iterator]();!(r=(s=o.next()).done)&&(n.push(s.value),!e||n.length!==e);r=!0);}catch(t){i=!0,a=t}finally{try{!r&&o.return&&o.return()}finally{if(i)throw a}}return n}(t,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},a=d(n(0)),s=d(n(7)),o=h(n(5)),l=h(n(4)),c=h(n(3)),u=h(n(2));function h(t){return t&&t.__esModule?t:{default:t}}function d(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}n(13);var f=a.dispatch("categories","mousemoveFig2a","mousemoveFig2b","variables"),p=a.scaleOrdinal(a.schemeCategory10),v={};var g=function(t){return function(e){var n=e/t;return Math.abs(n)<=1?.75*(1-n*n)/t:0}},y=function(t,e){return function(n){return e.map(function(e){return[a.mean(n,function(n){return t(e-n)}),e]})}};Promise.all(["data/fig1e.csv","data/fig2a.csv","data/fig2b.csv"].map(function(t){return fetch(t).then(function(t){return t.text()}).then(function(t){return a.csvParse(t)})})).then(function(t){var e,n,h=r(t,3),d=h[0],m=h[1],b=h[2];v.fig1eB=new u.default("fig1e",function(t){var e=t.reduce(function(t,e){var n=e.variable;return t[n]||(t[n]=[]),e.category=e.Category,t[n].push(e),t[n].category=e.category,t},{});Object.keys(e).forEach(function(t){e[t].sum=a.sum(e[t],function(t){return t.count}),e[t].forEach(function(n){n.valueCount=e[t].length})});var n=a.max(Object.values(e),function(t){return t.sum});return{color:p,data:e,maxSum:n}}(d),f),v.filter2=new c.default("fig2-categories",(e=m,n=a.set(e,function(t){return t.category}).values(),{color:p,data:e,categories:n}),f),v.fig2aS=new l.default("fig2a-scatter",function(t){var e=t.map(function(t){return i({},t,{x:t.HR,y:-Math.log10(t.p),confidence:"HR P<9e-05"===t["min_p.value2"]})}),n=a.scaleLinear().domain([0,Math.ceil(a.max(e,function(t){return t.x}))]),r=a.scaleLinear().domain([0,Math.ceil(a.max(e,function(t){return t.y}))]),s=[{y:-Math.log10(9e-5),id:"9e-05"}],o=a.set(e,function(t){return t.category}).values();return{color:p,legend:o,symbols:[{label:"HR P > 9e-05",classes:"dot"},{label:"HR P < 9e-05",classes:"dot hollow"}],xTitle:"Hazard ratio",yTitle:"-log10(p)",data:e,moveEvent:"mousemoveFig2a",xScale:n,yScale:r,yLines:s}}(m),f),v.fig2aL=new o.default("fig2a-line",function(t){var e=t.map(function(t){return i({},t,{x:t.HR,y:-Math.log10(t.p)})}),n=e.reduce(function(t,e){var n=e.category;return t[n]||(t[n]=[]),t[n].push(e.y),t},{}),r=a.scaleLinear().domain([0,Math.ceil(a.max(e,function(t){return t.y}))]),s=Object.keys(n),o=Object.values(n).map(y(g(5),r.ticks(40)));o.forEach(function(t,e){t.category=s[e]});var l=a.max(o.map(function(t){return a.max(t,function(t){return t[0]})})),c=a.scaleLinear().domain([0,l]);return{color:p,xTitle:"Density",data:o,moveEvent:"mousemoveFig2a",xScale:c,yScale:r}}(m),f),v.fig2bS=new l.default("fig2b-scatter",function(t){var e=t.map(function(t){return i({},t,{x:t.r2_age,y:t.cindex,confidence:"HR P<3.6e-06"===t["min_p.value2"]})}),n=a.scaleLog().domain(a.extent(e,function(t){return t.x})),r=a.scaleLinear().domain(a.extent(e,function(t){return t.y}));return{color:p,symbols:[{label:"HR P > 3.6e-06",classes:"dot"},{label:"HR P < 3.6e-06",classes:"dot hollow"}],xTitle:"Association with age and sex (R squared)",yTitle:"C-index including age and sex",data:e,moveEvent:"mousemoveFig2b",xScale:n,yScale:r}}(b),f),v.fig2bL=new o.default("fig2b-line",function(t){var e=t.map(function(t){return i({},t,{y:t.cindex})}),n=e.reduce(function(t,e){var n=e.category;return t[n]||(t[n]=[]),t[n].push(e.y),t},{}),r=a.extent(e,function(t){return t.y}),o=a.scaleLinear().domain(r),l=a.range(r[0],r[1],(r[1]-r[0])/100),c=Object.keys(n),u=Object.values(n).map(function(t){return s.stats.kde().sample(t).bandwidth(s.stats.bandwidth.nrd0)(l)});u.forEach(function(t,e){t.category=c[e],t.forEach(function(e,n){t[n]=[e[1],e[0]]})});var h=a.max(u.map(function(t){return a.max(t,function(t){return t[0]})})),d=a.min(u.map(function(t){return a.min(t,function(t){return t[0]})})),f=a.scaleLinear().domain([d,h]);return{color:p,xTitle:"Density",data:u,moveEvent:"mousemoveFig2b",xScale:f,yScale:o}}(b),f)})},,,,,function(t,e){}]);