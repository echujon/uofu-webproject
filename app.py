import re
from datetime import datetime
from urllib.parse import unquote
from flask import Flask, json, render_template

app = Flask(__name__)

data = None


def readData():
    with app.open_resource("soccer_small.json") as f:
        return json.load(f)


@app.route("/")
def home():
    return render_template("table.html")


@app.route("/players/")
def getPlayers():
    global data
    if not data:
        data = readData()
    return json.dumps(data, ensure_ascii=False)


@app.route("/players/<name>")
def getPlayer(name):
    global data
    if not data:
        data = readData()
    for playerInfo in data:
        if playerInfo["Name"] == name:
            return json.dumps(playerInfo, ensure_ascii=False)
    return "Couldn't find Player with name " + name


@app.route("/clubs/")
def getClubs():
    global data
    jsonAttributes = {}
    if not data:
        data = readData()
    clubs = {}
    for playerInfo in data:
        clubName = playerInfo["Club"]
        name = playerInfo["Name"]
        name = unquote(name)
        if clubName in clubs:
            players = clubs[clubName]
            if players:
                players.append(name)
        else:
            players = []
            players.append(name)
            clubs[clubName] = players

    return json.dumps(clubs, ensure_ascii=False)


@app.route("/attributes/")
def getAttributes():
    global data
    jsonAttributes = {}
    if not data:
        data = readData()
    attributes = set()
    attributes.update(list(data[0].keys()))
    jsonAttributes = list(attributes)
    return json.dumps(jsonAttributes)
