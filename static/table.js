import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as dropdown from "./dropdown.js";
import * as visual from "./visual.js";
let players_data = {};
let table,selectedPlayer;

//Get rids of any selection
export function refresh() {
    getTable().selectAll(".selected").classed("selected",false);
}
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
    let th = headers.enter().append('th')
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
                //keep selected class order
                let selectedRow = d3.select("tr.selected");
                if (selectedRow.size()>0) {
                    selectedPlayer = selectedRow.select(".col-Name").text();
                }

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
                updateRows(tbody,  columns);
            });
            
      updateRows(tbody, columns);
      
      
    return table;
}

function updateRows(tbody, columns) {
  let rows = tbody.selectAll('tr')
                  .data(getPlayersData()).join("tr")
                  .classed("clickable",true)
                  .classed("selected", function (data){
                     return (data.Name === selectedPlayer ? true : false)
                  })
                  .on("click", function(event, data) {
                    d3.select("tr.selected").classed("selected", false);
                    d3.select(this).classed("selected",true);
                    let checkedColumn = dropdown.getCheckedColumn();
                    if (checkedColumn)
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

 
  