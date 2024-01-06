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
    svg.select("["+ column+"-attr='" + value + "']").classed("selected", true);
    
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

function updateBarGrap (visualObj) {

    const margin = { top: 25, right: 30, bottom: 30, left: 100 },
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    if (!svg || !visualCanvas.select("svg").empty()) {
        visualCanvas.select("svg").remove();
    }

    const playerData = getPlayersData();
    const playerCountData = {};
    const attribute = visualObj.attribute;
    playerData.forEach(player => {
        playerCountData[player[attribute]] = (playerCountData[player[attribute]] || 0) + 1
    });
    const barData = Object.keys(playerCountData);
    const counts = Object.values(playerCountData);

    svg = visualCanvas
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top-8})`);// margin finessing for labels

    // 3. Scales and Axes
    const x = d3.scaleLinear()
        .domain([0, d3.max(counts)])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(barData)
        .range([0, height])
        .padding(.1);

    svg.selectAll("myRect")
        .data(barData)
        .join("rect")
        .attr(attribute+"-attr", d=> d)
        .attr("x", x(0))
        .attr("y", d => y(d))
        .attr("width", d => x(playerCountData[d]))
        .attr("height", y.bandwidth())
        .attr("fill", "#000dff");

        svg.selectAll(".label")
        .data(barData) 
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", function(d) { 
            return x(playerCountData[d]) + 3; 
        }) 
        .attr("y", function(d) { return y(d) + y.bandwidth() / 2; }) // vertically centered in the bar
        .attr("dy", ".35em") // vertical alignment
        .text(function(d) { return  playerCountData[d]; }); // set the label

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    //X axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width/2)-7)
        .attr("y", height + margin.bottom+2)  // Position below the x-axis
        .text("# of Players")  // Label text
        .attr("fill", "black")  // Text color
        .attr("font-weight", "bold")
        .attr("font-size", "14");

    svg.append("text")
           .attr("class", "player-name")
           .attr("x", width / 2)
           .attr("y", -3)  
           .attr("text-anchor", "middle")
           .style("font-size", "20px") 
           .text("");
     
    
}


function updateHistogram(visualObj) {
    const margin = { top: 35, right: 30, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
     // Check if SVG exists
     if (!svg || !visualCanvas.select("svg").empty()) {
        // If SVG exists, remove it
        visualCanvas.select("svg").remove();
    }


    const playerData = getPlayersData();
    const attribute = visualObj.attribute;
    // Append the svg object to the body of the page
    svg = visualCanvas
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top-10})`);
    

    const min = d3.min(playerData, d => d[attribute]-1);
    const max = d3.max(playerData, d => d[attribute]+1);
    const x = d3.scaleLinear()
                .domain([min,max ])  // histogram range
                .range([0, width]);
 

    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

   


    // Set the parameters for the histogram
    const histogram = d3.histogram()
    .value(d => d[attribute])   // We're binning by attribute given
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

    //X axis label
    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", (width/2)-10)
    .attr("y", height + margin.bottom+5)  // Position below the x-axis
    .text(attribute)  // Label text
    .attr("fill", "black")  // Text color
    .attr("font-weight", "bold")
    .attr("font-size", "14");

    //Y axis label
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
    .attr(attribute+"-attr", function(d) {
        return (height - y(d.length) > 0) ? (Math.floor((d.x0+d.x1)/2)) : null;
    
    })
    .attr("x", d => x(d.x0) + 1)
    .attr("y", d => y(d.length))
    .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
    .attr("height", d => height - y(d.length))
    .attr("fill", "#69b3a2");


    svg.append("text")
    .attr("class", "player-name")
    .attr("x", width / 2)
    .attr("y", (-margin.top/2)+6)    
    .attr("text-anchor", "middle")
    .style("font-size", "20px") // Set the style as needed
    .text("");

}
export function updateVisual(visualObj) {
    if (visualObj.type === "histogram") {
        updateHistogram(visualObj);

    }
    if (visualObj.type === "bar") {
        updateBarGrap(visualObj)
    }

}

export function addVisual(container, playerData,columns) {

    visualCanvas = d3.select(container)
                    .append("div")
                    .attr("id", "visual");
    setPlayersData(playerData);
        
}