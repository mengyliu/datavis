var data = []
var innerRadius
var outerRadius
var color = d3.interpolateRgb(1, 2);

var category_colors = {
  "triangle": "rgba(82,76,124,0.8)",
  "sphere": "rgba(82,76,124,0.8)",
  "oval": "rgba(82,76,124,0.8)",
  "light": "rgba(82,76,124,0.8)",
  "formation": "rgba(82,76,124,0.8)",
  "fireball": "rgba(82,76,124,0.8)",
  "disk": "rgba(82,76,124,0.8)",
  "circle": "rgba(82,76,124,0.8)",
  "cigar": "rgba(82,76,124,0.8)",
  "changing": "rgba(82,76,124,0.8)",
  "total": "rgba(82,76,124,0)",
}; // JSON object with colors assigned to each category.



$(document).ready(function() {
  loadData_shape();
});


function loadData_shape() {
  visualize_shape();
}



function visualize_shape() {
  d3.csv("../data/DayTimeShapeTop10.csv", function(d) {
    data = d;
    data.forEach((d) => {
      d.hour = parseInt(d.hour);
      d.percent = parseFloat(d.percent);
      // console.log("Hour: " + d.hour)
      // console.log("Percent: " + d.percent)
      // console.log("Shape: " + d.shape)
    });
    draw_canvas_shape();
    drawline("triangle");
    drawline("sphere");
    drawline("oval");
    drawline("light");
    drawline("formation");
    drawline("fireball");
    drawline("disk");
    drawline("circle");
    drawline("cigar");
    drawline("changing");
    draw_decoline("deco");
    drawline("total");
  })
}

function draw_canvas_shape() {

  var margin = {
    top: 20,
    right: 10,
    bottom: 20,
    left: 10
  };

  var width = 1000,
    height = 900 - margin.top - margin.bottom;

  var svg = d3.select("#shape").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .attr("id", "canvas_shape");

  innerRadius = 100,
    outerRadius = Math.min(width, height) / 2 - 6;


}

function drawline(shape) {
  var g = d3.select("#canvas_shape");

  dataitem = data.filter(function(d) {
    return d.shape == shape;
  })

  var x = d3.scaleLinear()
    .range([-1 / 2 * Math.PI, 1 / 2 * Math.PI]);

  var y = d3.scaleRadial()
    .range([innerRadius, outerRadius]);

  var line = d3.lineRadial()
    .angle(function(d) {
      return x(d.hour);
    })
    .radius(function(d) {
      return y(d.percent);
    });

  x.domain(d3.extent(data, function(d) {
    return d.hour;
  }));
  y.domain(d3.extent(data, function(d) {
    return d.percent;
  }));

  var yAxis = g.append("g")
    .attr("text-anchor", "middle");

  var yTick = yAxis
    .selectAll("g")
    .data(y.ticks(5))
    .enter().append("g");


  var linePlot = g.append("path")
    .datum(dataitem)
    .attr("fill", "none")
    .attr("stroke-width", "3")
    .attr("stroke", (d) => category_colors[shape])
    .attr("d", line);


  var lineLength = linePlot.node().getTotalLength();

  linePlot
    .attr("stroke-dasharray", lineLength + " " + lineLength)
    .attr("stroke-dashoffset", -lineLength)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

}

function draw_decoline(shape) {
  var g = d3.select("#canvas_shape");

  dataitem = data.filter(function(d) {
    return d.shape == shape;
  })

  var x = d3.scaleLinear()
    .range([-1 / 2 * Math.PI, 1 / 2 * Math.PI]);

  var y = d3.scaleRadial()
    .range([innerRadius, outerRadius]);

  var line = d3.lineRadial()
    .angle(function(d) {
      return x(d.hour);
    })
    .radius(function(d) {
      return y(d.percent);
    });

  x.domain(d3.extent(data, function(d) {
    return d.hour;
  }));
  y.domain(d3.extent(data, function(d) {
    return d.percent;
  }));

  var yAxis = g.append("g")
    .attr("text-anchor", "middle");

  var yTick = yAxis
    .selectAll("g")
    .data(y.ticks(5))
    .enter().append("g");


  var colorScale = d3.scaleLinear().domain([0, 1, 2, 3])
    .range(["#9BCFEF","#9BCFEF", "#9BCFEF", "#9BCFEF"])

  var linearGradient = d3.select("#canvas_shape").append("defs")
            .append("linearGradient")
            .attr("id", "linear-gradient")


        linearGradient.append("stop")
            .attr("offset", "15%")
            .attr("stop-color", colorScale(0));

        linearGradient.append("stop")
            .attr("offset", "21%")
            .attr("stop-color", colorScale(1));

        linearGradient.append("stop")
            .attr("offset", "79%")
            .attr("stop-color", colorScale(2));

        linearGradient.append("stop")
            .attr("offset", "85%")
            .attr("stop-color", colorScale(3));

  
  var linePlot = d3.select("#canvas_shape").selectAll("path")
    .data(dataitem)
    .enter().append("path")
    .attr("d", line(dataitem))
    .attr("fill", "none")
    .attr("stroke-width", "50")
    .attr("stroke", "url(#linear-gradient)");


  

//   var lineLength = linePlot.node().getTotalLength();

//   linePlot
//     .attr("stroke-dasharray", lineLength + " " + lineLength)
//     .attr("stroke-dashoffset", -lineLength)
//     .transition()
//     .duration(2000)
//     .ease(d3.easeLinear)
//     .attr("stroke-dashoffset", 0);

}