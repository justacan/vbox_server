var express = require('express');
var app = express();

var fs = require('fs');

// var base64 = require('node-base64-image');

var VirtualBox = require('./virtualbox');

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/instances', function (req, res) {
    VirtualBox.listvms(function (output) {
        res.json(output);
    });
});

app.get('/instances/:guid/screenshot', function (req, res) {
    VirtualBox.screenshot(req.params.guid, function (err, output) {
        if (err) {
            res.json({ screenshot: null })
        }
        fs.readFile(__dirname + '\\images\\' + req.params.guid + '.png', function (err, data) {
            var base64data = new Buffer(data).toString('base64');
            if (err) {
                res.json({ screenshot: null })
            }
            res.json({ screenshot: base64data });
        });
    });
});

app.get('/instances/:guid', function (req, res) {
    VirtualBox.getVmInfo(req.params.guid, function (output) {
        res.json({ vm: output });
    });
});

app.post('/instances/:guid/start', function (req, res) {
    VirtualBox.start(req.params.guid, function (output) {
    });
    res.json({ action: "Starting" });
});

app.post('/instances/:guid/stop', function (req, res) {
    console.log("Stop Controller");
    VirtualBox.stop(req.params.guid, function (output) {
    });
    res.json({ action: "Stopping" });
});

app.post('/instances/:guid/reboot', function (req, res) {
    VirtualBox.reboot(req.params.guid, function (output) {
    });
    res.json({ action: "Rebooting" });
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});