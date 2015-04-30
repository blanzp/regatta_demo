import json

from flask import Flask, request, abort, url_for
import os
import simplejson
import time

# Must be application for AWS Elastic Beanstalk
application = Flask(__name__, static_folder='static')
app = application
global rml_parser


# Main page
@app.route('/')
def index():
    # send_static_file will guess the correct MIME type
    return app.send_static_file('html/index.html')

@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)

# Get single item
@app.route('/api/<resource>/<id>')
def get_resource_id(resource, id):
    rml_parser.reload()

    if resource == 'organizations':
        data = filter(lambda x: x['_id'] == id, rml_parser.organizations)[0]
    elif resource == 'events':
        data = filter(lambda x: x['_id'] == id, rml_parser.events)[0]
    elif resource == 'flights':
        flights = get_flights(rml_parser.events)
        return simplejson.dumps(flights[int(id)])
    else:
        return "Invalid resource"
    return simplejson.dumps(data)


# Get Items
@app.route('/api/<resource>')
def get_resources(resource):
    rml_parser.reload()

    if resource == 'events':
        data = rml_parser.events
    elif resource == 'regattas':
        data = rml_parser.regatta
    elif resource == 'organizations':
        data = rml_parser.organizations
    elif resource == 'flights':
        flights = get_flights(rml_parser.events)
        return simplejson.dumps(flights)
    else:
        return "Invalid resource"
    return json.dumps(data)

def get_flights(events):
    flights = []
    for event in events:
        stage_index = 0
        for stage in event['stage']:
            race_index = 0
            for race in stage['race']:
                race['racingCrew'] = enrich_racing_crews(race['racingCrew'], event['crew']) if 'racingCrew' in race else ''
                flights.append({'event_id': event['_id'],
                                'eventNumber': event['eventNumber'],
                                'crew': event['crew'],
                                'racingCrew': fix_racing_time(race['racingCrew']) if 'racingCrew' in race else '',
                                'winningSplit': fix_winning_time(race['winningSplit']) if 'winningSplit' in race else '',
                                'race_id': race['_id'],
                                'stage_index': stage_index,
                                'stageType': 'Final' if 'stageType' in stage else 'Heat',
                                'flight_index': race_index,
                                'eventTitle': event['eventTitle'],
                                'raceNumber': race['raceNumber'],
                                'start_time': race['start_time'] if 'start_time' in race else '',
                                'winning_time': race['winning_time'] if 'winning_time' in race else '',
                                'status': race['status'] if 'status' in race else ''})
                race_index += 1
            stage_index += 1
    return sorted(
        flights, key=lambda x: (int(x['eventNumber']), x['stage_index'], x['raceNumber']))


def fix_racing_time(racing_crew):
    import datetime
    import time

    new_racing_crew = []
    for crew in racing_crew:
        if crew['results']['split']['time'] == '00:00:00Z':
            crew['results']['split']['raw_time'] = 0
        else:
            dt = datetime.datetime.strptime(crew['results']['split']['time'],'%H:%M:%S.%fZ')
            crew['results']['split']['raw_time'] = datetime.datetime.strptime(crew['results']['split']['time'],'%H:%M:%S.%fZ').isoformat()
            # print dt.timetuple()
            # millis_since_epoch = time.mktime(dt.timetuple()) + dt.microsecond * 1e-6
            # crew['results']['split']['raw_time_millis'] = millis_since_epoch

        new_racing_crew.append(crew)
    return new_racing_crew

def fix_winning_time(winning_time):
    import datetime
    import time
    if winning_time['time'] == '00:00:00Z':
        winning_time['raw_time'] = 0
    else:
        #ts = time.strptime(winning_time['time'],'%H:%M:%S.%fZ')
        dt = datetime.datetime.strptime(winning_time['time'],'%H:%M:%S.%fZ')
        winning_time['raw_time'] = datetime.datetime.strptime(winning_time['time'],'%H:%M:%S.%fZ').isoformat()
        # sec_since_epoch = time.mktime(dt.timetuple()) + dt.microsecond/1000000.0
        # millis_since_epoch = sec_since_epoch * 1000
        # winning_time['raw_time_millis'] = millis_since_epoch
    return winning_time

def enrich_racing_crews(racing_crews,crews):
    new_crews = list()
    for racing_crew in racing_crews:
        crew = get_crew_by_id(crews, racing_crew['crew'])
        racing_crew['organization'] = crew['organization']
        racing_crew['subTeamId'] = crew['subTeamId'] if 'subTeamId' in crew else ''
        new_crews.append(racing_crew)
    return new_crews


def get_crew_by_id(crews,id):
    for crew in crews:
        if crew['_id'] == id:
            return crew
    return None


@app.route('/api/races/<race_id>', methods=['POST'])
def update_race(race_id):
    return "Race updated successfully", 200


@app.route('/api/racecrews', methods=['POST'])
def update_races():
    return "OK", 200


# def get_crew_dict():
#     crew_dict = {}
#     crew_detail = model.CrewCollection(conn).scan()
#     for detail in crew_detail:
#         crew_dict[detail['_id']] = detail._data
#     return crew_dict


def find_racecrew_by_lane(race_crews, lane):
    i = 0
    for race_crew in race_crews:
        #app.logger.debug("comparing {} to {}".format(race_crew['laneNumber'],lane))
        if int(race_crew['laneNumber']) == lane:
            #app.logger.debug("returning {}".format(i))
            return i
        i += 1
    return None


# Start Race
@app.route('/api/event/<event_id>/stage/<stage_index>/race/<race_index>', methods=['POST'])
def start_race(event_id, stage_index, race_index):
    stage_index = int(stage_index)
    race_index = int(race_index)
    action = request.args.get('action')

    if action == 'start':
            return "Race Started", 200
    elif action == "finish":
            return "Race Finish Saved", 200
    else:
        return "No such action", 404

@app.route('/api/custom')
def get_custom():
    global custom
    return json.dumps(custom)


def filter_list_event(data_list, value):
    obj_list = []
    for obj in data_list:
        if obj.Event == value:
            obj_list.append(obj)
            return obj_list


def main():
    import argparse
    from rml_parser import RMLParser
    global rml_parser
    global custom

    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('--rml_file', help='rml file')
    parser.add_argument('--twitter_acct', help='name of twitter account')
    parser.add_argument('--twitter_hashtag', help='hashtag')

    args = parser.parse_args()

    rml_parser = RMLParser()
    print "Loading file: ", args.rml_file
    rml_parser.load_from_file(args.rml_file)

    custom = { "screenname": args.twitter_acct, "hashtag": args.twitter_hashtag }

    app.logger.debug("Starting Flask Server")
    app.run(host="0.0.0.0", debug=True)
    # app.run(debug=True)


if __name__ == "__main__":
    main()
