import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as table from "./table.js"
import * as visual from "./visual.js"


let dropDownMenu,dropDownAttributes, columns,checkedVisualObject;


const visualObjects = [
    {attribute: "Speed", type: "histogram", name: "Speed", uniqueProp:"Speed"}, 
    {attribute: "Stamina", type: "histogram", name: "Stamina", uniqueProp:"Stamina"},
    {attribute: "Balance", type: "histogram", name: "Balance", uniqueProp: "Balance"},
    {attribute: "Strength", type: "histogram", name: "Strength", uniqueProp: "Strength"},
    {attribute: "Rating", type: "histogram", name: "Rating", uniqueProp: "Rating"},
    {attribute: "Nationality", type: "bar", name: "Nationality", uniqueProp: "Nationality"},
    {attribute: "Club", type: "bar", name: "Club", uniqueProp: "Club"},
    {attribute: "Club_Position", type: "bar", name: "Club Position", uniqueProp: "Club_Position"},
    {attribute: "Preffered_Foot", type: "bar", name: "Preffered Foot", uniqueProp: "Preffered_Foot"},
    {attributes:["Speed", "Stamina"],  type: "scatter", name: "Speed vs Stamina", uniqueProp: "Name"},
    {attributes:["Strength", "Rating"],  type: "scatter", name: "Strength vs Rating", uniqueProp: "Name"}
    
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
    const visualObjects = findVisualsWithColumnToRemove(columnName);
    
    visualObjects.forEach( visualObject =>{
        removeVisualCheckBox(visualObject);
        //if we have a visual that's checked, we need to stop showing it
        if (getCheckedVisual() == visualObject) {
            setCheckedVisual(null);
            visual.showVisual(visualObject, false);
            
            }
        }
    )

}
    
function findVisualsWithColumnToRemove(columnName) {
    const foundVisualObjects = visualObjects.filter(obj => 
            {
            if (obj.attribute)
                return obj.attribute == columnName
            if (obj.attributes)
                return obj.attributes.includes(columnName);
            }
        );
    return foundVisualObjects;

}
function findVisualsWithColumnToAdd(columnName) {
    const foundVisualObjects = visualObjects.filter(obj => {
        if (obj.attribute)
            return obj.attribute == columnName
        if (obj.attributes) {  
            const hasColumn = obj.attributes.includes(columnName)
            const getOtherColumn = hasColumn ? obj.attributes.find(attr => attr != columnName) : null;
            return getOtherColumn ? getColumns().includes(getOtherColumn) : false

        }
    });
    
    return foundVisualObjects;
   
}

function removeVisualCheckBox(visualObject) {
    if (visualObject.attribute)
        getDropDownMenu().select("#checkbox_" + visualObject.attribute).remove();
    if (visualObject.attributes)
        getDropDownMenu().select("#checkbox_" + visualObject.attributes.join("-")).remove();

}
function addVisualCheckBox(visualObject) {
    const checkboxContainer = d3.select(".show-visual-checkboxes")
                .append("label")
                .text(visualObject.name)
                .attr("class", "visual-checkbox")
                .attr("id", function(){
                    if (visualObject.attribute)
                        return "checkbox_"+visualObject.attribute
                    if (visualObject.attributes)
                        return  "checkbox_"+visualObject.attributes.join("-");
                })
                .append("input")
                .attr("type", "checkbox");
    checkboxContainer.on('change', function (e) {
            table.refresh(); //remove unnecessary highlighting
            const checkedBoxes = dropDownMenu.selectAll("input[type='checkbox']:checked");
            const checkedTarget = e.target;
            checkedBoxes.each(function(){
                if (this !== checkedTarget) {  //remove check from checked 
                                            // checkboxes if it's not the target
                    d3.select(this).property("checked",false);
                }
            });
        
        /*const visualObj = findVisuals(columnName);*/
        if (checkedTarget.checked) {
                setCheckedVisual(visualObject);
                visual.showVisual(visualObject);
            }
        else {
                setCheckedVisual(null);
                visual.showVisual(visualObject, false);

            }
        });

            
                
}

export function getCheckedVisual() {
    return checkedVisualObject;
}

function setCheckedVisual(visualObj) {
    checkedVisualObject = visualObj;
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
        const visualObjects = findVisualsWithColumnToAdd(newColumnName);
        visualObjects.forEach( visualObject =>
            addVisualCheckBox(visualObject)
        )

    });


  }

export function addDropDown(container, dropDownData, columns) {
    const dropDownMenu = d3.select(container)
                    .append("div")
                    .attr("class", "dropdown-menu").lower();
                    const title  = dropDownMenu.append("div")
                            .text("Player Attributes");
    const dropdown = dropDownMenu.append("select")
                    .attr("class", "attributes");
    const addButton = dropDownMenu.append("button")
                    .attr("class", "addButton")
                    .attr("type", "button")
                    .text("+");
    const showVisuals = dropDownMenu.append("div")
                                  .attr("class", "show-visual-checkboxes")
                                  .append("span")
                                  .attr("class", "visualizaton-label")
                                  .text("Visualization:")
    setColumns(columns);
    setDropDownMenu(dropDownMenu);
    updateDropDown(dropDownData);
    //want to know what columns are also in visualObjects
    const visualCheckboxes = visualObjects.filter(visualObj => {
        if (visualObj.attribute)
            return columns.includes(visualObj.attribute)
        if (visualObj.attributes)
            return visualObj.attributes.every(attr=> columns.includes(attr));
    });
    //create checkboxes for them
    visualCheckboxes.forEach(checkbox =>
         addVisualCheckBox(checkbox)
    );
}