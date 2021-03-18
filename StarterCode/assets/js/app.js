// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data
d3.csv("assets/data/data.csv").then(function(data){

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty)*.95, 
      d3.max(data, d => d.poverty)*1.01])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.healthcare) *.8
      , d3.max(data, d => d.healthcare)*1.01])
      .range([height, 0]);
    
    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
    
    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "skyblue")
    .attr("opacity", ".8");
    
    // Add text for state abbreviations 
    // ==============================
    var textGroup = chartGroup.selectAll("text.abr")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "abr")
    .attr("x", d => xLinearScale(d.poverty)-9)
    .attr("y", d => yLinearScale(d.healthcare)+6)
    .attr("fill", "white")
    .attr("opacity", "1")
    .text(d => d.abbr)
    
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([75, -65])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    circlesGroup.on("click", function (data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function (data, index) {
          toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare %");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty %");
  }).catch(function(error) {
    console.log(error);
});