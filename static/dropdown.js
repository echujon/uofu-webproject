import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as table from "./table.js"
import * as visual from "./visual.js"


let dropDownAttributes = {};
let dropDownMenu, columns,checkedColumn;


let visual_objects = [
    {attribute: "Speed", type: "histogram"}, 
    {attribute: "Stamina", type: "histogram"},
    {attribute: "Strength", type: "histogram"},
    {attribute: "Nationality", type: "bar"},
    {attribute: "Club", type: "bar"}
]

function setColumns (cols) {
    columns = cols;
}

function getColumns() {
    return columns;
}
function getDropDownMenu() {
    return dropDownMenu;
}
function setDropDownMenu(dropDownMenuEl) {
    dropDownMenu = dropDownMenuEl;
}

export function removeColumn(columnName) {
    let columns = getColumns();
    const removeIndex = columns.indexOf(columnName);
    columns.splice(removeIndex,1);
    dropDownAttributes.push(columnName);
    setColumns(columns);
    updateDropDown(dropDownAttributes);
}

function findVisual(columnName) {
    let visualObject = visual_objects.find(obj => obj.attribute === columnName);
    return visualObject;
}

 function addVisualCheckBox(columnName) {
    let dropDownMenu = getDropDownMenu();
    let checkbox = dropDownMenu.select(".show-visuals")
                .append("label")
                .text(columnName)
                .append("input")
                .attr("type", "checkbox");
    checkbox.attr("id", columnName);
    checkbox.on('change', function (e) {
        table.refresh();
        let checkedBoxes = dropDownMenu.selectAll("input[type='checkbox']:checked");
        checkedBoxes.each(function(){
                if (this !== e.target) {
                    d3.select(this).property("checked",false);
                }
            });
        
        let visualObj = findVisual(columnName);
        if (this.checked) {
                setCheckedColumn(columnName);
                visual.showVisual(visualObj);
            }
            else {
                setCheckedColumn(null);
                visual.showVisual(visualObj, false);

            }
        });

            
                
}

export function getCheckedColumn() {
    return checkedColumn;
}

function setCheckedColumn(column) {
    checkedColumn = column;
}
function updateDropDown(attributes) {
    columns = getColumns();                  
    dropDownAttributes = attributes.filter(attr=> !columns.includes(attr));
    let dropDownMenu = getDropDownMenu();
    let dropdown = dropDownMenu.select("select.attributes");
    let dropdownData = dropdown.selectAll("option")
                            .data(dropDownAttributes);
    dropdownData.enter()
                .append("option")
                .merge(dropdownData)
                .text(function (d) { 
                        return d;
                });
    dropdownData.exit().remove();
    let addButton = dropDownMenu.select(".addButton");
    addButton.on('click', function (e) {
        let newColumnName = d3.select(this.parentNode).select(".attributes").node().value;
        columns.push(newColumnName);
        setColumns(columns);
        table.updateTable(getColumns());
        updateDropDown(attributes);

    });


  }

export function addDropDown(container, dropDownData, columns) {
    let dropDownMenu = d3.select(container)
                    .append("div")
                    .attr("class", "dropdown-menu").lower();
    let title  = dropDownMenu.append("div")
                            .text("Player Attributes");
    let dropdown = dropDownMenu.append("select")
                    .attr("class", "attributes");
    let addButton = dropDownMenu.append("button")
                    .attr("class", "addButton")
                    .attr("type", "button")
                    .text("+");
    let showVisuals = dropDownMenu.append("div")
                                  .attr("class", "show-visuals")
                                  .append("span").text("Show Visuals:")
    setColumns(columns);
    setDropDownMenu(dropDownMenu);
    updateDropDown(dropDownData);
    addVisualCheckBox("Speed");
    addVisualCheckBox("Stamina");
    addVisualCheckBox("Strength");
    addVisualCheckBox("Nationality");
    addVisualCheckBox("Club");
}