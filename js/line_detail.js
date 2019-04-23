var data = []; // the variable that holds the data from csv file

var events_year = {
  "1946": "UFOs garnered considerable interest during the Cold War, an era associated with a heightened concern for national security.",
  "1968": "Science Fiction Movies Succeeded. (2001: A Space Odyssey)",
  "1974": "The National UFO Reporting Center has provided a 24-hour hotline phone number for people to report UFO activity that has occurred within the last week.",
  "1984": "The Terminator",
}

$(document).ready(function() {
  loadData_line_detail();
});




function loadData_line_detail() {
  //code for Q1 goes here
  d3.csv("./data/yearnum_detail.csv", function(d) {
    data = d;
    data.forEach((item) => {
      item.num = parseInt(item.num)
      item.year = parseInt(item.year)
      //console.log(item.num)
    });
    visualize_line_detail();
    console.log("first");
    drawTextDetail();
  });
}


function visualize_line_detail() {
  // 2. Use the margin convention practice 
  var margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
    width = document.getElementById("linechart").offsetWidth/2; // Use the window's width 
  
    height = 500; // Use the window's height

  // The number of datapoints

  // 5. X scale will use the index of our data
  var xScale = d3.scaleLinear()
    .domain([d3.max(data, (d) => d.num)*2, 0]) // input 
    .range([width, 0]); // output 

  // 6. Y scale will use the randomly generate number 
  var yScale = d3.scaleBand()
    .domain(data.map((d) => d.year)) // input
    .range([0, height]) // output
    .padding(0.1);


  var area = d3.area()
    .x(function(d) { return xScale(d.num); })
    .y0(height)
    .y1(function(d) { return yScale(d.year); });


  // 7. d3's line generator
  var line = d3.line()
    .x(function(d) {
      return xScale(d.num);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale(d.year);
    }) // set the y values for the line generator // apply smoothing to the line


  // 1. Add the SVG to the page and employ #2
  var svg = d3.select("#linechart #line_detail").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id","detail_canvas_line")
    .style("position","relative")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   svg.append("linearGradient")
      .attr("id", "temperature-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", xScale(50)).attr("y1",0)
      .attr("x2", xScale(4000)).attr("y2",0)
    .selectAll("stop")
      .data([
        {offset: "0%", color: "#201941"},
        {offset: "100%", color: "#524BA5"}
      ])
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return d.color; });

  // 3. Call the x axis in a group tag
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).ticks(4)); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale).tickValues(yScale.domain().filter(function(d,i){ return !(i%5)}))); // Create an axis component with d3.axisLeft

  var keyevents = data.filter(function(d) {
    var filter = (d.year == 1946) || (d.year == 1974) || (d.year == 1984) || (d.year == 1968);
    return filter;
  })

  // 9. Append the path, bind the data, and call the line generator 
  svg.append("path")
    .datum(data) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line); // 11. Calls the line generator 

  svg.append("path")
    .datum(data) // 10. Binds data to the line 
    .attr("class", "area") // Assign a class for styling 
    .attr("d", area); // 11. Calls the line generator 
  


    //console.log(keyevents);
  // 12. Appends a circle for each datapoint 
  svg.selectAll(".detail_dot")
    .data(keyevents)
    .enter().append("circle") // Uses the enter().append() method
    .attr("class", "detail_dot") // Assign a class for styling
    .attr("id",function(d) {
      return "d"+d.year
    })
    .attr("cx", function(d) {
      return xScale(d.num)
    })
    .attr("cy", function(d) {
      return yScale(d.year)
    })
    .attr("r", 5)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)

    // svg.selectAll(".event_text")
    // .data(keyevents)
    // .enter().append("text") // Uses the enter().append() method
    // .attr("class", "event_text") // Assign a class for styling
    // .attr("x", function(d) {
    //   return xScale(d.num)+20
    // })
    // .attr("y", function(d) {
    //   return yScale(d.year)
    // })
    // .text(function(d){
    //   var year = String(d.year);
    //   var des = events_year[year];
    //     return year+" : "+des
    //   })



  // Create Event Handlers for mouse
  function handleMouseOver(d, i) { // Add interactivity

    // Specify where to put label of text

    //console.log(1);

    var format = d3.format(",d");

    d3.select(this)
    .transition()
      .duration(200)
      .attr("r", 15);

    d3.select("#num text")
      .transition()
      .duration(200)
      .on("start", function repeat() {
        d3.active(this)
            .tween("text", function() {
              var that = d3.select(this),
                  i = d3.interpolateNumber(that.text().replace(/,/g, ""), d.num);
              return function(t) { that.text(format(i(t))); };
            })
          .transition()
            .delay(1200)
            .on("start", repeat);
      });

      d3.select("#num #intotal").remove()

     
  }

  function handleMouseOut(d, i) {

    var format = d3.format(",d");

    // Use D3 to select element, change color back to normal
     d3.select(this)
     .transition()
      .duration(200)
      .attr("r", 5);

      d3.select("#num text")
      .transition()
      .duration(200)
      .on("start", function repeat() {
        d3.active(this)
            .tween("text", function() {
              var that = d3.select(this),
                  i = d3.interpolateNumber(that.text().replace(/,/g, ""), 65114);
              return function(t) { that.text(format(i(t))); };
            })
          .transition()
            .delay(1200)
            .on("start", repeat);
      });

      d3.select("#num").append("text")
      .attr("id","intotal")
      .style("font-size","12pt")
      .style("color","rgba(255,255,255,0.5)")
      .style("margin-left","10px")
      .text("in total")

  }
}

function drawTextDetail() {
  var dot1946 = document.getElementById("d1946");
  var bodyRect = document.body.getBoundingClientRect(),
    elemRect = dot1946.getBoundingClientRect(),
    topOffset   = elemRect.top - bodyRect.top - 50,
    leftOffset   = elemRect.left - bodyRect.left+80;

  $("#e1946").css("margin-left",leftOffset);
  $("#e1946").css("margin-top",topOffset);

  var dot1968 = document.getElementById("d1968");
  var bodyRect = document.body.getBoundingClientRect(),
    elemRect = dot1968.getBoundingClientRect(),
    topOffset   = elemRect.top - bodyRect.top - 50,
    leftOffset   = elemRect.left - bodyRect.left+50;

  $("#e1968").css("margin-left",leftOffset);
  $("#e1968").css("margin-top",topOffset);


var dot1974 = document.getElementById("d1974");
  var bodyRect = document.body.getBoundingClientRect(),
    elemRect = dot1974.getBoundingClientRect(),
    topOffset   = elemRect.top - bodyRect.top - 30,
    leftOffset   = elemRect.left - bodyRect.left+50;

  $("#e1974").css("margin-left",leftOffset);
  $("#e1974").css("margin-top",topOffset);

var dot1984 = document.getElementById("d1984");
  var bodyRect = document.body.getBoundingClientRect(),
    elemRect = dot1984.getBoundingClientRect(),
    topOffset   = elemRect.top - bodyRect.top - 20,
    leftOffset   = elemRect.left - bodyRect.left+70;

  $("#e1984").css("margin-left",leftOffset);
  $("#e1984").css("margin-top",topOffset);

}

