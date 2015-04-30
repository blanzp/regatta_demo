# Regatta Demo

[![Build Status](https://secure.travis-ci.org/blanzp/regatta_demo.png?branch=master)](http://travis-ci.org/blanzp/regatta_demo)
[![Coverage Status](https://coveralls.io/repos/blanzp/regatta_demo/badge.svg?branch=master)](https://coveralls.io/r/blanzp/regatta_demo?branch=master)

This app runs a web server against the RML file managed by [Regatta Workbench](http://regattaworkbench.com/).
The primary purpose of this app is to demonstrate alternative methods of managing regatta and exposing data from regatta workbench.

## Requirements:

### On windows host install:

* [Regatta Workbench](http://regattaworkbench.com/)
* Python
    
### On IOS device install:

* [Drafts](http://agiletortoise.com/drafts/)
* [Tweebot](http://tapbots.com/tweetbot/)  this is optional
* Google Chrome
    
### Setup:

1. Run regatta workbench on PC
2. Run web server with start_server.bat on PC
3. Connect IOS device and PC/Laptop with webserver on same wifi.  On IOS you can enable a person hotspot with Settings->Personal Hotspot.
4. Run "ipconfig" on the PC to identify its IP address
5. On the IOS device in Chrome open "http://<ip_address>:5000
6. In IOS Drafts application setup an action "Tweetbot" with url "tweetbot:///post?text=[[drafts]]&callback_url=googlechrome://".  Alternatively
you can try "twitter:///post?text=[[drafts]]&callback_url=googlechrome://" if you dont have Tweetbot installed.

### Tweeting Results:

When results are saved from [Regatta Workbench](http://regattaworkbench.com/) by save icon, they can be viewed on the web page.
A brower page reload will show the latest results.  From the IOS device navigate to Manage->Race Results.  Under each result there will be a tweet link.
Clicking this link will open in drafts first, then copy results to Tweetbot.  Once in Tweetbot, validate the results, shorten if needed
and send.  IOS device should go back to google chrome.

