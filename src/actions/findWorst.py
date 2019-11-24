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

def findWorstPoint(current, potential):
    currentPM = current["PM10"]
    potentialWorstPM = potential["PM10"]
    if currentPM < potentialWorstPM:
            return potential
    return current


def getWorstForEveryHour(data):
    dates = {}
    for point in data:
        date  = point['datetime']
        timestamp = time.mktime(datetime.datetime.strptime(date, "%m/%d/%Y, %H:%M:%S").timetuple())
        dt_object = datetime.datetime.fromtimestamp(timestamp)
        
        key = "%s/%s/%s %s" % (dt_object.month, dt_object.day, dt_object.year, dt_object.hour)

        if(dates.__contains__(key)):
            worstPoint = findWorstPoint(dates.get(key), point)
            dates[key] = worstPoint
        else:
            dates[key] = point
        
    return dates

worstHourly = getWorstForEveryHour(data)

print(worstHourly)


