import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as table from "./table.js";
import * as dropdown from "./dropdown.js";
import * as visual from "./visual.js";

let container = d3.select("body")
                  .append("div")
                  .attr("id", "container").node();
//Original Columns                  
let columns = ['Name', 'Nationality', 'National_Position', 'Club', 'Height',  'Preffered_Foot', 'Speed', 'Stamina']                        
d3.json("/players/").then(function(data) {
    table.addTable(container, data,columns);
    visual.addVisual(container,data,columns);
   
  }).catch(function (error){
     if (error)
        console.log(error);
  });
  
  d3.json("/attributes").then(function (data) {
      dropdown.addDropDown(container, data,columns);
      
      } ).catch(function (error){
            if (error)
            console.log(error);
      });

