var n = 20, // number of layers
    m = 200, // number of samples per layer
	frame_delta = 20,
    color = d3.interpolateRgb("#aad", "#556");
	
	var animation_length = 1000;
	
	data0 = stream_layers(n, animation_length);
	console.debug(data0);
	
	frames = [];
	_(10).times(function(index) {
			frames.push(_(data0).map(function(element) { 
				return element.slice(index*frame_delta, (index+1)*frame_delta + m);
			}));
	});
	
	data0 = frames[0];
	data0 = d3.layout.stack().offset("wiggle")(data0);

var w = 960,
    h = 500,
    mx = m - 1;
    
animation = [];
_(frames).each(function(frame, index) {
	
	data = d3.layout.stack().offset("wiggle")(frame);
	my = d3.max(data, function(d) {
	      return d3.max(d, function(d) {
	        return d.y0 + d.y;
	      });
	    });
	
	
	animation.push({
		data: data,
		area: d3.svg.area()
		    .x(function(d) { return (d.x - index*frame_delta) * w / mx; })
		    .y0(function(d) { return h - d.y0 * h / my; })
		    .y1(function(d) { return h - (d.y + d.y0) * h / my; })
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
    .data(animation[0]['data'])
  .enter().append("path")
    .style("fill", function() { return color(Math.random()); })
    .attr("d", animation[0]['area']);

var current_frame = 0;
setInterval(transition, 1000);

function transition() {
	current_frame++;
	if (current_frame >= animation.length) {
		current_frame = 0;
	}
	console.debug("showing frame " + current_frame);
	
	d3.selectAll("path")
      .data(function() {
			return animation[current_frame]['data'];
      })
    .transition()
      .duration(1000)
      .attr("d", animation[current_frame]['area']);
}
