import json


with open('5lines.json') as json_file:
    data = json.load(json_file)
    for row in data:
        row['datetime'] = row['datetime'] + ' GMT+02'
        # print(row['datetime'])
with open("5lines2.json", "w") as jsonFile:
    json.dump(data, jsonFile)

    # for p in data['people']:
    #     print('Name: ' + p['name'])
    #     print('Website: ' + p['website'])
    #     print('From: ' + p['from'])
    #     print('')
