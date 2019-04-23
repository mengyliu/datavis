$(document).ready(function() {
  visulization("all");
});

function selectGraph(id) {
  var buttons = document.querySelectorAll(".button");
  buttons.forEach((b) => {
    b.classList.remove("selected")
  })
  var btn = document.getElementById(id)
  btn.classList.add('selected')
  updateGraph(id)
}


function updateGraph(id) {
  $("#map").empty();
  visulization(id);
}
function visulization(id) {
  console.log(id)

  //Width and height of map
  var width = 960;
  var height = 500;

  // D3 Projection
  var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]) // translate to center of screen
    .scale([1000]); // scale things down so see entire US

  // Define path generator
  var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
    .projection(projection); // tell path generator to use albersUsa projection


  // Define linear scale for output
  var color = d3.scaleLinear()
    .range(["white", "rgb(145,208,242)"]);

  var legendText = ["Air Force Base", "UFO Sightings"];

  //Create SVG element and append map to the SVG
  var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var maplayer = svg.append('g');
  var baselayer = svg.append('g');
  var sightinglayer = svg.append('g');

  // Append Div for tooltip to SVG
  var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Load in my states data!
  d3.csv("./data/Population.csv", function(data) {
    // Load GeoJSON data and merge with states data
    d3.json("./data/us-states.json", function(json) {
      // Loop through each state data value in the .csv file
      for (var i = 0; i < data.length; i++) {
        // Grab State Name
        var dataState = data[i].state;
        // Grab data value 
        var dataValue = data[i].respop72010;
        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {
          var jsonState = json.features[j].properties.name;
          if (dataState == jsonState) {
            // Copy the data value into the JSON
            json.features[j].properties.visited = dataValue;
            // Stop looking through the JSON
            break;
          }
        }
      }
        // Bind the data to the SVG and create one path per GeoJSON feature
      maplayer.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "0.2")
        .style("fill", function(d) {
          // Get data value
          if (id === "population" || id === "all") {
            var value = d.properties.visited;
            var colorScale = d3.scaleLog().domain([564483, 37320903]).range(["#141332", "#595499"])
            return colorScale(value)
          }
        })
        .style("fill-opacity", id === "af" ? 0 : 1);
    });


  });


  d3.csv("./data/LaLo.csv", function(data) {
        sightinglayer.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", function(d, i) {
            lon = parseFloat(d.longitude).toFixed(5).toString()
            lat = parseFloat(d.latitude).toFixed(5).toString()
            return projection([lon, lat])[0];
          })
          .attr("cy", function(d) {
            lon = parseFloat(d.longitude).toFixed(5).toString()
            lat = parseFloat(d.latitude).toFixed(5).toString()
            return projection([lon, lat])[1];
          })
          .attr("r", 1)
          .style("fill", "rgb(145,208,242)")
          .style("opacity", 0.55)
      });

      if (id === 'af' || id === "all") {
        d3.csv("./data/airforce.csv", function(af) {
          baselayer.selectAll("circle")
            .data(af)
            .enter()
            .append("circle")
            .attr("cx", function(d, i) {
              lon = parseFloat(d.lon).toFixed(5).toString()
              lat = parseFloat(d.lat).toFixed(5).toString()
              return projection([lon, lat])[0];
            })
            .attr("cy", function(d) {
              lon = parseFloat(d.lon).toFixed(5).toString()
              lat = parseFloat(d.lat).toFixed(5).toString()
              return projection([lon, lat])[1];
            })
            .attr("r", 5)
            .style("fill", "rgb(255,255,255)")
            .style("opacity", 0.85)
            // .on("mouseover", function(d) {
            //   console.log(d)
            //   div.transition()
            //     .duration(200)
            //     .style("opacity", .9);
            //   div.text(af.city)
            //     .style("left", (d3.event.pageX) + "px")
            //     .style("top", (d3.event.pageY - 28) + "px");
            // })

            // // fade out tooltip on mouse out              
            // .on("mouseout", function(d) {
            //   div.transition()
            //     .duration(500)
            //     .style("opacity", 0);
            // });
        });
      }


  

      // var legend = d3.select("#map").append("svg")
      //   .attr("class", "legend")
      //   .attr("width", 140)
      //   .attr("height", 50)
      //   .selectAll("g")
      //   .data(color.domain().slice().reverse())
      //   .enter()
      //   .append("g")
      //   .attr("transform", function(d, i) {
      //     return "translate(0," + i * 20 + ")";
      //   });

      // legend.append("circle")
      //       .attr("cx", 7)
      //       .attr("cy", 7)
      //       .attr("r", 7)
      //       .style("fill", color);

      // legend.append("text")
      //   .data(legendText)
      //   .attr("x", 24)
      //   .attr("y", 9)
      //   .attr("dy", ".35em")
      //   .style("fill", 'white')
      //   .text(function(d) { return d; });
      if (id === "population") {
        $.get('../img/population.svg', function(data){
          if ($('.pop-legend')) {
            $('.pop-legend').empty()
          }
          var $newdiv = $("<div class='pop-legend'></div>")
          var $svg = $(data.documentElement)
          $svg.width("80%");
          $newdiv.append($svg);
          $('#map').append($newdiv);
        })
      }
      else if (id === "all") {
        $.get('../img/all.svg', function(data){
          if ($('.pop-legend')) {
            $('.pop-legend').empty()
          }
          var $newdiv = $("<div class='pop-legend'></div>")
          var $svg = $(data.documentElement)
          $svg.width("80%");
          $newdiv.append($svg);
          $('#map').append($newdiv);
        })
      }
      else if (id === "af") {
        $.get('../img/airforce.svg', function(data){
          if ($('.pop-legend')) {
            $('.pop-legend').empty()
          }
          var $newdiv = $("<div class='pop-legend'></div>")
          var $svg = $(data.documentElement)
          $svg.width("80%");
          $newdiv.append($svg);
          $('#map').append($newdiv);
        })
      }
      
}