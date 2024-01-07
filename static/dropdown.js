import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as table from "./table.js"
import * as visual from "./visual.js"


let dropDownAttributes = {};
let dropDownMenu, columns,checkedColumn;


let visual_objects = [
    {attribute: "Speed", type: "histogram"}, 
    {attribute: "Stamina", type: "histogram"},
    {attribute: "Balance", type: "histogram"},
    {attribute: "Strength", type: "histogram"},
    {attribute: "Rating", type: "histogram"},
    {attribute: "Nationality", type: "bar"},
    {attribute: "Club", type: "bar"},
    {attribute: "Club_Position", type: "bar"},
    {attribute: "Preffered_Foot", type: "bar"}
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
    const visualObj = findVisual(columnName);
    //if we have a visual, we need to stop showing it
    if (visualObj) {
        removeVisualCheckBox(columnName);
        visual.showVisual(visualObj, false);

    }
    
}

function findVisual(columnName) {
    let visualObject = visual_objects.find(obj => obj.attribute === columnName);
    return visualObject;
}

function removeVisualCheckBox(checkboxName) {
    
    getDropDownMenu().select("#checkbox_" + checkboxName).remove();

}
function addVisualCheckBox(columnName) {
    let dropDownMenu = getDropDownMenu();
    let checkbox = dropDownMenu.select(".show-visuals")
                .append("label")
                .text(columnName)
                .attr("class", "visual-checkbox")
                .attr("id", "checkbox_"+columnName)
                .append("input")
                .attr("type", "checkbox");
    checkbox.on('change', function (e) {
        table.refresh(); //remove unnecessary highlighting
        let checkedBoxes = dropDownMenu.selectAll("input[type='checkbox']:checked");
        checkedBoxes.each(function(){
                if (this !== e.target) {  //remove check from checked 
                                            // checkboxes if it's not the target
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
        if (findVisual(newColumnName)) {
            addVisualCheckBox(newColumnName);
        }

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
                                  .append("span")
                                  .attr("class", "visualizaton-label")
                                  .text("Visualization:")
    setColumns(columns);
    setDropDownMenu(dropDownMenu);
    updateDropDown(dropDownData);
    //want to know what columns are also in visual_objects
    const checkboxes = visual_objects.filter(visualObj => columns.includes(visualObj.attribute))
                                     .map( obj => obj.attribute);
    //create checkboxes for them
    checkboxes.forEach(checkbox =>
         addVisualCheckBox(checkbox)
    );
}