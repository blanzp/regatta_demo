__author__ = 'Paul'

from unittest import TestCase
from regatta_demo.rml_parser import RMLParser


class TestRML(TestCase):

    @classmethod
    def setUpClass(cls):
        cls.parser = RMLParser()
        cls.parser.load_from_file('regatta_demo/tests/static/Long-Island-Junior-Rowing-Championships-2015-05-03.rml')

    def test_events_type(self):
        self.assertIsInstance(self.parser.events,list)

    def test_events_size(self):
        self.assertGreaterEqual(len(self.parser.events), 20)

    def test_events_first(self):
        self.assertEqual(self.parser.events[0]['eventTitle'],"Womens Varsity 1x")

    def test_events_mens1x(self):
        self.assertEqual(self.parser.events[1]['eventTitle'],"Mens Varsity 1x")

    def test_organizations_type(self):
        self.assertIsInstance(self.parser.organizations,list)

    def test_organizations_size(self):
        self.assertGreaterEqual(len(self.parser.organizations), 20)

    def test_regatta_type(self):
        self.assertIsInstance(self.parser.regatta, dict)

    def test_regatta_has_name(self):
        self.assertIn('name', self.parser.regatta)

    def test_regatta_name(self):
        self.assertEqual(self.parser.regatta['abbreviatedName'],'Long Island Junior Rowing Championships')

    def test_venue_has_city(self):
        self.assertEqual(self.parser.venue['city'],'Oyster Bay')

    def test_venue_type(self):
        self.assertIsInstance(self.parser.venue, dict)