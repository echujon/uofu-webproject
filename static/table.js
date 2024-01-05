import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as dropdown from "./dropdown.js";
import * as visual from "./visual.js";
let players_data = {};
let table = null;

export function updateTable(columns) {
      var sortOrder = false;

      //use for ignoring Accent marks
      const collator = new Intl.Collator('en', {
        numeric: true,
        sensitivity: 'base'
      });

     // append the header row
    let table = getTable();
    let tr = table.select("thead tr");
    let tbody = table.select("tbody");
    let headers =tr
        .selectAll('th')
        .data(columns);
    headers.exit().remove();
    var th = headers.enter().append('th')
                    .attr("id", function(column){
                               return column
                          });
    
    th.filter(function (column) {
            return column != 'Name'
      }).append("span")
          .attr("class", "remove-column")
          .on('click', function() {
            let columnName = this.parentNode.id;
            d3.select(this.parentNode).remove();
            d3.selectAll(".col-"+columnName).remove();
            dropdown.removeColumn(columnName);

          })
      th.append("span").attr("class", "sortable").text(function (column) { 
            return column })
          .on('click', function (event, col) {
                sortOrder = !sortOrder
                if (sortOrder) {
                getPlayersData().sort(function (a, b) {
                        return collator.compare(a[col], b[col]);
                    });
                    
                }
                else {
                  getPlayersData().sort(function (a, b) {
                        return collator.compare(b[col], a[col]);
                    });
                }
                updateRows(d3.select("table tbody"),  columns);
            });
            
      updateRows(tbody, columns);
      
      
    return table;
}

function updateRows(tbody, columns) {
  let rows = tbody.selectAll('tr')
                  .data(getPlayersData()).join("tr")
                  .classed("clickable",true)
                  .on("click", function(event, data) {
                    d3.select("tr.selected").classed("selected", false);
                    d3.select(this).classed("selected",true);
                    let checkedColumn = dropdown.getCheckedColumn();
                    visual.selectVisualData(data,checkedColumn);
                  });

      // create a cell in each row for each column
  let cells = rows.selectAll('td')
        .data(function (row) {
          return columns.map(function (column) {
            return {column: column, value: row[column]};
          });
        }).join('td')
          .attr("class", function(d){ return "col-" + d.column})
          .text(function (d) { return d.value; });
}
  
function getPlayersData(){
    return players_data;
} 

function setPlayersData(playersData){
    players_data = playersData;
}

function setTable(tableEl) {
    table = tableEl;
}

function getTable() {
  return table;
}
  // render the table
  // Pass the container Element
export function addTable(container,playerData, columns) {
      let table, thead, tbody,tr;
      let playerTable = d3.select(container).append("div")
                            .attr("id", "player-table");
      
      table = playerTable.append('table');
      thead = table.append('thead');
      tbody = table.append('tbody');
      tr = thead.append('tr');
      setTable(table);
      setPlayersData(playerData);
      updateTable(columns);
  }

 
  