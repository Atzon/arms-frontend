import json
import time
import datetime

with open('5lines.json') as json_file:
    data = json.load(json_file)
    for row in data:
        row['datetime'] = row['datetime']
        # print(row['datetime'])
with open("5lines2.json", "w") as jsonFile:
    json.dump(data, jsonFile)

def findWorstPoint(data):
    worstPm = 0.0
    foundPoint = None
    for point in data:
        currentPM = point["PM10"]
        if currentPM > worstPm:
            worstPm=currentPM
            foundPoint=point
    return foundPoint


def groupDataHourly(data):
    dates = {}
    for point in data:
        date  = point['datetime']
        timestamp = time.mktime(datetime.datetime.strptime(date, "%m/%d/%Y, %H:%M:%S").timetuple())
        dt_object = datetime.datetime.fromtimestamp(timestamp)
        
        key = "%s/%s/%s %s" % (dt_object.month, dt_object.day, dt_object.year, dt_object.hour)

        if(dates.__contains__(key)):
            dates[key].append(point)
        else:
            dates[key] = [point]
        
    return dates

def getWorstForEveryHour(data): 
    worstHourly = {}
    for key in data.keys(): 
        worstFromHour = findWorstPoint(data[key])
        worstHourly[key]=worstFromHour
    return worstHourly

dates = groupDataHourly(data)
worstHourly = getWorstForEveryHour(dates)

print(worstHourly)


