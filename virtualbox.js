var exec = require('child_process').exec;

const vbm = 'VBoxManage';

module.exports = {

    process: function (command, callback) {

        // var formated = vbm + ' ' + command;
        // console.log('stdout: ' + stdout);
        // console.log('stderr: ' + stderr);

    },
    makeCmd: function (command) {
        return vbm + " " + command;
    },

    getVmInfo: function (guid, callback) {

        var info = { guest_os: null, memory: null, cpus: null, status: null, uptime: null };

        exec(this.makeCmd('showvminfo ' + guid), function (error, stdout, stderr) {

            var lines = stdout.split("\r\n");

            for (var i = 0; i < lines.length; i++) {

                var element = lines[i];

                if (match = /^Guest OS\:\s+(.*?)$/.exec(element)) {
                    info.guest_os = match[1];
                }
                if (match = /^Memory size\:\s+(.*?)$/.exec(element)) {
                    info.memory = match[1];
                }
                if (match = /^Number of CPUs\:\s+(\d+)$/.exec(element)) {
                    info.cpus = match[1];
                }
                if (match = /^State\:\s+(powered off|running)\s\(since (.*?)\)$/.exec(element)) {
                    info.status = (match[1] === "running") ? "Running" : "Powered Off";
                    info.uptime = match[2];
                }

            }
            callback(info);

        });
    },

    listvms: function (callback) {

        var vms = [];
        var re = /\"(.*?)\" \{(.*?)\}/g;

        exec(this.makeCmd('list vms'), function (error, stdout, stderr) {
            while (m = re.exec(stdout.trim())) {
                vms.push({ name: m[1], guid: m[2] });
            }

            callback(vms);

            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
        // this.process('list vms', callback);

    },

    start: function(guid, callback) {
        // VBoxManage startvm <vm> --type headless
        exec(this.makeCmd('startvm ' + guid + ' --type headless'), function (error, stdout, stderr) {
            console.log("start");
            console.log("Error:", error);
            console.log("stdout:", stdout);
            console.log("stderr", stderr);
            callback(stdout);
        });
    },

    stop: function(guid, callback) {
        // VBoxManage controlvm <vm> acpipowerbutton
        // VBoxManage controlvm <vm> poweroff
        exec(this.makeCmd('controlvm ' + guid + ' poweroff'), function (error, stdout, stderr) {
            console.log("stop");
            console.log("Error:", error);
            console.log("stdout:", stdout);
            console.log("stderr", stderr);
            callback(stdout);
        });
    },

    reboot: function(guid, callback) {
        // VBoxManage controlvm <vm> reset
        exec(this.makeCmd('controlvm ' + guid + ' reset'), function (error, stdout, stderr) {
            callback(stdout);
        });
    },

    screenshot: function(guid, callback) {
        exec(this.makeCmd('controlvm ' + guid + ' screenshotpng ' + __dirname + '\\images\\' + guid + '.png'), function (error, stdout, stderr) {
            callback(error, stdout);
        });
    }



};