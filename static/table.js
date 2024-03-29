import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as dropdown from "./dropdown.js";
import * as visual from "./visual.js";
let players_data = {};
let table,selectedPlayer;

//highlight Multiple Rows
export function highlightDataRows(playerDataToHighlight) {
  refresh();
  playerDataToHighlight.forEach(d => {
    const rowId = d.Name.replace(/ /g, '_')
    const row = d3.select("tr#"+rowId).node();
    highlightRow(row);
  });
}

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
    const table = getTable();
    const tr = table.select("thead tr");
    const tbody = table.select("tbody");
    const headers =tr
        .selectAll('th')
        .data(columns);
    headers.exit().remove();
    const th = headers.enter().append('th')
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
            return column.replace(/_/g, ' ') 
          })
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
function highlightRow(rowToHighlight) {
  d3.select(rowToHighlight).classed("selected",true);
}
function updateRows(tbody, columns) {
  const rows = tbody.selectAll('tr')
                  .data(getPlayersData()).join("tr")
                  .attr("id", d=> d.Name.replace(/ /g, '_')
                  )
                  .classed("clickable",true)
                  .classed("selected", function (data){
                     return (data.Name === selectedPlayer ? true : false)
                  })
                  .on("click", function(event, data) {
                    refresh();
                    highlightRow(this);
                    const checkedVisualObject = dropdown.getCheckedVisual();
                    if (checkedVisualObject)
                        visual.selectVisualData(data,checkedVisualObject);
                  });

      // create a cell in each row for each column
  const cells = rows.selectAll('td')
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

 
  