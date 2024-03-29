This is a Flask (Python) Project that uses D3.js for the visualizations. 
I set up a virtual enviroment (.venv) that is running Flask.
Set up steps for this can be found here: https://flask.palletsprojects.com/en/3.0.x/installation/

Once you have flask installed make sure that your enviroment is activated:
```
. .venv/bin/activate
```
You can launch app by using the flask run command:
```
flask run
```
The D3.js library will be delivered by the CDN jsdelvir.net.

The main backend code is found in app.py, all the APIs can be found there. 

The static directory contains all the javascript and css files that we need for this project.
I've added the JSON file soccer_small.json  to extract data that's needed.

The Graph and Visulization will be shown on the home (/) page:

![Screenshot 2024-01-07 at 11 52 04 AM](https://github.com/echujon/uofu-webproject/assets/2402634/27c37764-4c67-46b0-8ce3-6477735a419a)

You can see the visualization of a player's attribute by clicking on the a visulazition checkbox:

![Screenshot 2024-01-07 at 11 53 08 AM](https://github.com/echujon/uofu-webproject/assets/2402634/7f1046bd-a172-4c17-8221-8c372b0d4968)

There are 3 different types of visualizations: Histogram, Bar Graph, Scatter Plot.
You can find the attribute columns that enable these visualizations in the dropdown.js file under the variable visualObjects.


Here are the mappings for convenience:
* Histogram: Speed, Stamina, Balance, Strength, Rating
* Bar Graph: Nationality, Club, Club Position
* Scatter Plot: [Speed, Stamina], [Strength, Rating], [Height,Speed], [Ball Control, Speed], [Weight, Speed]
  * For the Scatter Plot you will need to have both attributes enabled.

Once you clicked on a visualation checkbox, you can now select a row of a player's data, and the visuzalation on the right should be highlighted as well as show the name of the player above the visualization:
![Screenshot 2024-01-22 at 2 52 36 PM](https://github.com/echujon/uofu-webproject/assets/2402634/9ccaf613-b31c-4301-a8bb-5b98861b98b6)

Vice versa, you can select a data value visualizaton, and the player row or rows shoud be selected:
![Screenshot 2024-01-22 at 2 54 28 PM](https://github.com/echujon/uofu-webproject/assets/2402634/dd412bd9-3465-4ab4-a04f-abaa3530ed21)





