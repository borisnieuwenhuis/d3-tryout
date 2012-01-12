var n = 20, // number of layers
    m = 200, // number of samples per layer
	frame_offset = 10;
	animation_length = 1000;
    data = stream_layers(n, animation_length);
	
	console.debug(data);
	
	var animation = [];
	_((animation_length-2*m)/frame_offset).times(function(frame_index) {
		animation.push(_.map(data, function(element) {
			return element.slice(frame_index*m, (frame_index+1)*m)
		}));
		/*var frame_keys = keys.slice(frame_index*m, (frame_index+1)*m)
		console.debug(frame_keys);

		var frame = {};
		frame_keys.each(function(element, index) {
			frame[index] = values[element];
		});
		animation.push(frame);*/
	});
	console.debug(animation);
	
	var animation_data = _(animation).map(function(element) {
		return d3.layout.stack().offset("wiggle")(element);
	});
	
	data0 = animation_data[0];
    color = d3.interpolateRgb("#aad", "#556");
	
	var reduced_data = _.reduce(animation_data, function(memo, element) { return memo.concat(element) }, []);
	console.debug(data0);
	
var w = 960,
    h = 500,
    mx = m - 1,
    my = d3.max(data0, function(d) {
      return d3.max(d, function(d) {
        return d.y0 + d.y;
      });
    });

var area = d3.svg.area()
    .x(function(d) { return d.x * w / mx; })
    .y0(function(d) { return h - d.y0 * h / my; })
    .y1(function(d) { return h - (d.y + d.y0) * h / my; });

var vis = d3.select("#chart")
  .append("svg")
    .attr("width", w)
    .attr("height", h);

vis.selectAll("path")
    .data(data0)
  .enter().append("path")
    .style("fill", function() { return color(Math.random()); })
    .attr("d", area);

function transition() {
  d3.selectAll("path")
      .data(function() {
        var d = data1;
        data1 = data0;
        return data0 = d;
      })
    .transition()
      .duration(2500)
      .attr("d", area);
}
