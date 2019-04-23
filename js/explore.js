var explore_data = [];
var explore_data_day = [];
var explore_data_loc = [];

var Mon_abre = {
	"jan" : "January",
	"feb" : "February",
	"mar" : "March",
	"apr" : "April",
	"may" : "May",
	"jun" : "June",
	"jul" : "July",
	"aug" : "August",
	"sep" : "September",
	"oct" : "October",
	"nov" : "November",
	"dec" : "December",
}


$(document).ready(function() {
  loadExploreData_line();
});

function selectMonGraph(id) {
  var buttons = document.querySelectorAll(".mon_button");
  buttons.forEach((b) => {
    b.classList.remove("selected")
  })
  var btn = document.getElementById(id)
  btn.classList.add('selected')
  $("#explore #explore1").empty();
  $("#explore #explore2").empty();
  $("#explore #explore3").empty();
  //console.log(Mon_abre[id]);
  $("#best_month").html(Mon_abre[id]);
  $("#best_day").html(findBestDay(Mon_abre[id]));
  $("#best_hour").html(findBestHour(Mon_abre[id])+":00");
  $("#best_loc").html(findBestLoc(Mon_abre[id]));

  visualize_Exploreline_1(groupbyMonth(String(Mon_abre[id])));
  visualize_Exploreline_2(groupbyDay(String(Mon_abre[id])));
  visualize_Exploreline_3(groupLoc(String(Mon_abre[id])));
}


function loadExploreData_line() {
  //code for Q1 goes here
  d3.csv("./data/EveryMonth.csv", function(d) {
    explore_data = d;
    explore_data.forEach((item) => {
      item.Day = parseInt(item.Day)
      item.Month = String(item.Month)
      item.Num = parseInt(item.Num)
      //console.log(item.Day)
    });
    visualize_Exploreline_1(groupbyMonth("January"));
    $("#best_month").html("January");
    $("#best_day").html(findBestDay("January"));
  });

  d3.csv("./data/datetime.csv", function(d) {
  	explore_data_day = d;
  	explore_data_day.forEach((item) => {
  		item.Day = parseInt(item.Day)
  		item.Hour = parseInt(item.Hour)
  		item.Records = parseInt(item.Records)
  	});
  	visualize_Exploreline_2(groupbyDay("January"));
  	$("#best_hour").html(findBestHour("January")+":00");
  })

  d3.csv("./data/Shape_State_Max.csv", function(d) {
  	explore_data_loc = d;
  	explore_data_loc.forEach((item) => {
  		item.Day = parseInt(item.Day)
  		item.Records_x = parseInt(item.Records_x)
  	});
  	visualize_Exploreline_3(groupLoc("January"));
  	$("#best_loc").html(findBestLoc("January"));
  })
  
  
}

function findBestDay(mon) {
	var best_day;
	explore_data_day.forEach((item) => {
		if(item.Month == mon) {
			best_day = item.Day;
		}
	})
	//console.log(best_day)
	return best_day;
}

function findBestHour(mon) {
	var max = 0;
	var key;
	var dataset = groupbyDay(mon);
	dataset.forEach((item) => {
		if(item.Records > max) {
			max = item.Records;
			key = item.Hour;
		}
	})

	return key;
}

function findBestLoc(mon) {
	var max = 0;
	var key;
	var dataset = groupLoc(mon);
	dataset.forEach((item) => {
		if(item.Records_x > max) {
			max = item.Records_x;
			key = item.State;
		}
	})
	//console.log(dataset)
	return key;
}

function groupbyMonth(mon) {
	var item = explore_data.filter(function(d) {
		if(d.Month == mon) 
			return true;
		else
			return false;
	})
	//console.log(mon == "February");
	//console.log(item);
	return item;
}

function groupbyDay(mon) {
	var item = explore_data_day.filter(function(d) {
		if(d.Month == mon) 
			return true;
		else
			return false;
	})
	return item;
}

function groupLoc(mon) {
	var best_day = findBestDay(mon);
	var item = explore_data_loc.filter(function(d) {
		if(d.Month == mon && d.Day == best_day) 
			return true;
		else
			return false;
	})
	return item;
}

function visualize_Exploreline_1(dataset) {
  // 2. Use the margin convention practice 
  var margin = {
      top: 50,
      right: 0,
      bottom: 50,
      left: 50,
    },
    width = document.getElementById("explore").offsetWidth - margin.left ;
  
    height = 300; // Use the window's height

  // The number of datapoints




  var xScale = d3.scaleBand()
    .domain(dataset.map((d) => d.Day)) // input
    .range([0, width]) // output
    .padding(0.1);

  var yScale = d3.scaleLinear()
    .domain([d3.max(dataset, (d) => d.Num)+50, 0]) // input 
    .range([0, height]); // output 

  var area = d3.area()
    .x(function(d) { return xScale(d.Day); })
    .y0(height)
    .y1(function(d) { return yScale(d.Num); });


  // 7. d3's line generator
  var line = d3.line()
    .x(function(d) {
      return xScale(d.Day);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale(d.Num);
    }) // set the y values for the line generator // apply smoothing to the line


  // 1. Add the SVG to the page and employ #2
  var svg = d3.select("#explore #explore1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id","canvas_line")
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
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft


  // 9. Append the path, bind the data, and call the line generator 
  svg.append("path")
    .datum(dataset) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line); // 11. Calls the line generator 

  svg.append("path")
    .datum(dataset) // 10. Binds data to the line 
    .attr("class", "area") // Assign a class for styling 
    .attr("d", area); // 11. Calls the line generator 


    var bestDay = findBestDay(dataset[0].Month)

  svg.append("line")
    .attr("x1", xScale(bestDay))  //<<== change your code here
    .attr("y1", 0)
    .attr("x2",xScale(bestDay))  //<<== and here
    .attr("y2", height)
    .attr("class","best_line")
    .style("stroke-width", 3)
    .style("stroke", "#9BCFF0")
    .style("opacity", "0.5")
    .style("fill", "none");

  
}


function visualize_Exploreline_2(dataset) {
  // 2. Use the margin convention practice 
  var margin = {
      top: 50,
      right: 0,
      bottom: 50,
      left: 50,
    },
    width = document.getElementById("explore").offsetWidth/2.3 - margin.left; // Use the window's width 
  
    height = 300; // Use the window's height

  // The number of datapoints


  //console.log(dataset);


  var xScale = d3.scaleBand()
    .domain(dataset.map((d) => d.Hour)) // input
    .range([0, width]) // output
    .padding(0.1);

  var yScale = d3.scaleLinear()
    .domain([d3.max(dataset, (d) => d.Records)+50, 0]) // input 
    .range([0, height]); // output 

  var area = d3.area()
    .x(function(d) { return xScale(d.Hour); })
    .y0(height)
    .y1(function(d) { return yScale(d.Records); });


  // 7. d3's line generator
  var line = d3.line()
    .x(function(d) {
      return xScale(d.Hour);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale(d.Records);
    }) // set the y values for the line generator // apply smoothing to the line


  // 1. Add the SVG to the page and employ #2
  var svg = d3.select("#explore #explore2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id","canvas_line")
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
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft


  // 9. Append the path, bind the data, and call the line generator 
  svg.append("path")
    .datum(dataset) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line); // 11. Calls the line generator 

  svg.append("path")
    .datum(dataset) // 10. Binds data to the line 
    .attr("class", "area") // Assign a class for styling 
    .attr("d", area); // 11. Calls the line generator 



  var bestHour = findBestHour(dataset[0].Month)
  svg.append("line")
    .attr("x1", xScale(bestHour))  //<<== change your code here
    .attr("y1", 0)
    .attr("x2",xScale(bestHour))  //<<== and here
    .attr("y2", height)
    .attr("class","best_line")
    .style("stroke-width", 3)
    .style("stroke", "#9BCFF0")
    .style("opacity", "0.5")
    .style("fill", "none");


}

function visualize_Exploreline_3(dataset) {
  // 2. Use the margin convention practice 
  var margin = {
      top: 50,
      right: 0,
      bottom: 50,
      left: 50,
    },
    width = document.getElementById("explore").offsetWidth/2.3 - margin.left; // Use the window's width 
  
    height = 300; // Use the window's height

  // The number of datapoints


  //console.log(dataset);


  var xScale = d3.scaleBand()
    .domain(dataset.map(function(d) { return d.State; })) // input
    .range([0, width]) // output
    .padding(0.5);

  var yScale = d3.scaleLinear()
    .domain([d3.max(dataset, (d) => d.Records_x)+50, 0]) // input 
    .range([0, height]); // output 


  // 1. Add the SVG to the page and employ #2
  var svg = d3.select("#explore #explore3").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     svg.selectAll(".bar")
      .data(dataset)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("fill","#9BCFF0")
      .attr("x", function(d) { return xScale(d.State); })
      .attr("width", xScale.bandwidth())
      .attr("y", function(d) { return yScale(d.Records_x); })
      .attr("height", function(d) { return height - yScale(d.Records_x); });

  // 3. Call the x axis in a group tag
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft


}