import xml.etree.ElementTree as ET
from collections import defaultdict


class RMLParser(object):

    def __init__(self):
        self.root = None
        self.events = None
        self.organizations = None
        self.regatta = None
        self.venue = None
        self.filename = None

    def reload(self):
        if self.filename is not None:
            self.load_from_file(self.filename)

    def load_from_file(self, filename):
        self.filename = filename
        tree = ET.parse(filename)
        self.root = tree.getroot()
        self.parse_root()

    def load_from_string(self, rml_data):
        self.root = ET.fromstring(rml_data)
        self.parse_root()

    def parse_root(self):
        self.events = self.parse_elems('event')
        self.organizations = self.parse_elems('organization')
        self.events = RMLParser.enrich_events(self.events, self.organizations)
        self.events = RMLParser.force_race_list(self.events)
        self.regatta = self.get_elem_items(self.root)
        self.venue = self.parse_elems('venue')[0]

    def parse_elems(self, name):
        return map(lambda x: RMLParser.elem_to_dict(x)[name], self.root.findall(name))

    @staticmethod
    def elem_to_dict(t):
        d = {t.tag: {} if t.attrib else None}
        children = list(t)
        if children:
            dd = defaultdict(list)
            for dc in map(RMLParser.elem_to_dict, children):
                for k, v in dc.iteritems():
                    dd[k].append(v)
            d = {t.tag: {k:v[0] if len(v) == 1 else v for k, v in dd.iteritems()}}
        if t.attrib:
            d[t.tag].update((k.replace('{http://www.omg.org/XMI}','_'), v if v != '' else None) for k, v in t.attrib.iteritems())
        if t.text:
            text = t.text.strip()
            if children or t.attrib:
                if text:
                    d[t.tag]['#text'] = text
            else:
                d[t.tag] = text
        return d

    @staticmethod
    def get_by_id(item_list, id):
        return filter(lambda x: x['_id'] == id, item_list)

    @staticmethod
    def force_race_list(events):
        new_events = []
        for event in events:
            #print 'processing ', event['eventTitle']
            if 'stage' in event:
                if type(event['stage']) == dict:
                    event['stage'] = [event['stage']]
                new_stages = []
                for stage in event['stage']:
                    if type(stage['race']) == dict:
                        stage['race'] = [stage['race']]
                    new_stages.append(stage)
                event['stage'] = new_stages
                new_events.append(event)
        return new_events


    @staticmethod
    def enrich_events(events, organizations):
        for event in events:
            #print "processing", event['eventTitle']
            if 'crew' in event:
                for crew in event['crew']:
                    team = RMLParser.get_by_id(organizations,crew['organization'])
                    if len(team) == 0:
                        crew['organization'] = "No Team"
                    else:
                        team = team[0]
                        crew['organization'] = {'abbreviatedName': team['abbreviatedName'], 'name': team['name']}
        return events

    @staticmethod
    def get_elem_items(elem):
        item_dict = dict()
        item_dict['_type'] = elem.tag
        for item in elem.items():
            item_dict[item[0]] = item[1]
        if '{http://www.omg.org/XMI}id' in item_dict:
            x = item_dict['{http://www.omg.org/XMI}id']
            del item_dict['{http://www.omg.org/XMI}id']
            item_dict['_id'] = x
        return item_dict
