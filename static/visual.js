import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let svg, visualCanvas,players_data;
function setPlayersData(playerData) {
    players_data = playerData;
}

function getPlayersData() {
    return players_data;
}

export function selectVisualData(data, column) {
    let value = data[column];
    svg.selectAll("rect").classed("selected", false); 
    // Highlight the new bar
    svg.select("["+ column+"-attr="+column + value + "]").classed("selected", true);
    
    svg.select(".player-name").text(data.Name);
}


export function showVisual(visualObj, show=true) {
    if (show) {
        updateVisual(visualObj);
        visualCanvas.classed("show",true);
    }
        
    else
        visualCanvas.classed("show", false);
}

function updateHistogram(visualObj) {
    const margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    let playerData = getPlayersData();
    let attributeName = visualObj.attribute;
    // Append the svg object to the body of the page
    svg = visualCanvas
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


    svg.append("text")
    .attr("class", "player-name")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)  // Adjust this as needed
    .attr("text-anchor", "middle")
    .style("font-size", "20px") // Set the style as needed
    .text(""); 

    const x = d3.scaleLinear()
    .domain([30, d3.max(playerData, d => d[attributeName]+1)])  // histogram range
    .range([0, width]);


    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", (width/2)-10)
    .attr("y", height + margin.bottom-5)  // Position below the x-axis
    .text(attributeName)  // Label text
    .attr("fill", "black")  // Text color
    .attr("font-weight", "bold")
    .attr("font-size", "14");


    // Set the parameters for the histogram
    const histogram = d3.histogram()
    .value(d => d.Speed)   // We're binning by speed
    .domain(x.domain())    // Then the domain of the x-axis
    .thresholds(x.ticks(playerData.length));  // Number of bins

    // Apply the histogram function to the data
    const bins = histogram(playerData);

    // Set up the y-axis scale (for count of entries in each bin)
    const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(bins, d => d.length)]); // Use the max count of the bins

    svg.append("g")
    .call(d3.axisLeft(y).tickFormat(d3.format("d")) // Use integer format
    .ticks(d3.max(bins, d => d.length)));

    svg.append("text")
    .attr("text-anchor", "middle")  // Center the text
    .attr("transform", "rotate(-90)")  // Rotate the text
    .attr("x", 0 - (height / 2))  // Position at the center of the height
    .attr("y", 0 - margin.left + 10)  
    .text("# of Players")  // Label text
    .attr("fill", "black")  // Text color
    .attr("font-weight", "bold")
    .attr("font-size", "14"); 

    // Create the bars for the histogram
    svg.selectAll("rect")
    .data(bins)
    .join("rect")
    .attr(attributeName+"-attr", function(d,i) {
        return (height - y(d.length) > 0) ? attributeName+(Math.floor((d.x0+d.x1)/2)) : null;
    
    })
    .attr("x", d => x(d.x0) + 1)
    .attr("y", d => y(d.length))
    .attr("width", d => x(d.x1) - x(d.x0) - 1)
    .attr("height", d => height - y(d.length))
    .attr("fill", "#69b3a2");
}
export function updateVisual(visualObj) {
    if (visualObj.type === "histogram") {
        updateHistogram(visualObj);

    }
         // Append the svg object to the body of the page
    


}
export function addVisual(container, playerData,columns) {

    visualCanvas = d3.select(container)
                    .append("div")
                    .attr("id", "visual");
    setPlayersData(playerData);
    //updateVisual(playerData, columns);
        
}