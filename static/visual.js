import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let svg, visualCanvas,players_data;
function setPlayersData(playerData) {
    players_data = playerData;
}

function getPlayersData() {
    return players_data;
}

export function selectVisualData(data, visualObject) {
    const uniqueProp = visualObject.uniqueProp;
    const value = data[uniqueProp]
    const visualData = visualObject.type !== 'scatter' ? 'rect': 'circle';
    svg.selectAll(visualData).classed("selected", false); 
    // Highlight the new bar
    svg.select("["+ uniqueProp+"-attr='" + value + "']").classed("selected", true).raise();
    
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
function initSVG(margin, width, height) {
    // Check if SVG exists
    if (!svg || !visualCanvas.select("svg").empty()) {
        // If SVG exists, remove it
        visualCanvas.select("svg").remove();
    }

    svg = visualCanvas
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top-8})`);// margin finessing for labels

    //Text for Player Name
    svg.append("text")
    .attr("class", "player-name")
    .attr("x", width / 2)
    .attr("y", -3)  
    .attr("text-anchor", "middle")
    .style("font-size", "20px") 
    .text("");

}
function updateBarGrap (visualObj) {

    const margin = { top: 25, right: 30, bottom: 30, left: 100 },
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    /*svg = visualCanvas
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top-8})`);*/ // margin finessing for labels

    initSVG(margin, width, height);

    const playerData = getPlayersData();
    const playerCountData = {};
    const uniqueProp = visualObj.uniqueProp;
    playerData.forEach(player => {
        playerCountData[player[uniqueProp]] = (playerCountData[player[uniqueProp]] || 0) + 1
    });
    const barData = Object.keys(playerCountData);
    const counts = Object.values(playerCountData);

    

    // 3. Scales and Axes
    const x = d3.scaleLinear()
        .domain([0, d3.max(counts)])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(barData)
        .range([0, height])
        .padding(.1);

    svg.selectAll("rect")
        .data(barData)
        .join("rect")
        .attr(uniqueProp+"-attr", d=> d)
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
    
}


function updateHistogram(visualObj) {
    const margin = { top: 35, right: 30, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    /*svg = visualCanvas
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top-10})`);*/

    initSVG(margin, width, height);
     


    const playerData = getPlayersData();
    const attribute = visualObj.attribute;
    // Append the svg object to the body of the page
    
    

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

}
/**
 * Function used to get numerical value from data given
 * @param {*} datum 
 * @param {*} mapKey 
 * @returns numerical value
 */
function getNumericalData(datum, mapKey) {
    let copy = {...datum};
    let dataRef = copy[mapKey];
    if (typeof dataRef === "string")
        dataRef= Number(dataRef.replace(/\D/g,''));
    return dataRef;


}
/**
 * @param {*} datum - data point
 */
function extractUnit(datum) {
    if (typeof datum == 'string') {
        const unit = datum.match(/\D+$/);
        return unit ? unit[0].trim() : null
    }
    return null;
}
/**
 * 
 * @param {*} visualObj 
 */
function updateScatterPlot(visualObj) {

    const margin = { top: 25, right: 30, bottom: 30, left: 100 },
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    const xData = visualObj.attributes[0];
    const yData = visualObj.attributes[1];
    const uniqueProp = visualObj.uniqueProp;
    initSVG(margin,width, height);
    const playerData = getPlayersData();
    const xUnit = extractUnit(playerData[0][xData]);
    const yUnit = extractUnit(playerData[0][yData]);
    // Create scales
    const xmax = d3.max(playerData, function (d) { 
        return getNumericalData(d, xData);
    } )
    const xmin = d3.min(playerData, function (d) { 
        return getNumericalData(d, xData);

    })
    const xScale = d3.scaleLinear()
                    .domain([xmin-5, xmax])
                    .range([margin.left, width - margin.right]);

    const ymax = d3.max(playerData, function (d) { 
        return getNumericalData(d, yData);

    })
    const ymin = d3.min(playerData, function (d) { 
        return getNumericalData(d, yData);

    })                
    const yScale = d3.scaleLinear()
                    .domain([ymin-5, ymax])
                    .range([height - margin.bottom, margin.top]);


    svg.selectAll("circle")
        .data(playerData)
        .enter()
        .append("circle")
        .attr(uniqueProp+"-attr", d => d[uniqueProp])
        .attr("cx",
        function (d) { 
            const num = getNumericalData(d, xData);
            return xScale(num);
    
        } )
        .attr("cy", function (d) { 
            const num = getNumericalData(d, yData);
            return yScale(num);})
        .attr("r", 5) //radius
        .attr("fill", "#1c2a9a");

    // Add x-axis
    var xAxis = d3.axisBottom(xScale);
    if (xUnit) {
        xAxis.tickFormat(d=> d + " "  + xUnit);
    }
    svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

    // Add y-axis
    var yAxis = d3.axisLeft(yScale);
    if (yUnit) {
        yAxis.tickFormat(d=> d + " "  + yUnit);
    }
    svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

    // Add x axis label
    svg.append("text")
    .attr("transform", `translate(${width/2},${height - margin.bottom + 40})`)
    .style("text-anchor", "middle")
    .text(xData.replace(/_/g, ' '));

    // Add Y axis label
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin.left - 40)
    .attr("x", 0 - (height / 2))
    .text(yData.replace(/_/g, ' '));

}


export function updateVisual(visualObj) {
    if (visualObj.type === "histogram") {
        updateHistogram(visualObj);

    }
    if (visualObj.type === "bar") {
        updateBarGrap(visualObj);
    }
    if (visualObj.type === 'scatter') {
        updateScatterPlot(visualObj);
    }

}

export function addVisual(container, playerData) {

    visualCanvas = d3.select(container)
                    .append("div")
                    .attr("id", "visual");
    setPlayersData(playerData);
        
}