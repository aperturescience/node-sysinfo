'use strict';

var assert    = require('assert'),
    os        = require('os'),
    _         = require('lodash-node'),
    sysinfo   = require('../sysinfo');

describe('systeminfo', function (done) {

  describe('#systemInfo()', function (done) {

    it('should return basic information', function (done) {
      sysinfo.systemInfo(function (info) {
        var props = Object.getOwnPropertyNames(info);
        var a = ['arch',
                'clockSpeed',
                'cpu',
                'cpus',
                'cpuLoad',
                'endianness',
                'EOL',
                'freemem',
                'hostname',
                'loadavg',
                'numCpus',
                'platform',
                'release',
                'tmpdir',
                'totalmem',
                'type',
                'uptime',
                'ifaces'
                ];
        done(assert.deepEqual(props, a));
      });

    });

  });

  describe('#networkInterfaces()', function () {
    it('should return all network interfaces on host', function (done) {
      sysinfo.networkInterfaces(function (ifaces) {
        done();
      });
    });
  });

  describe('#memoryUsage()', function () {
    it('should return the memory usage percentage', function () {
      var a = sysinfo.memoryUsage();
      var s = a > 0 && a <= 100;
      return assert.strictEqual(s, true);
    });
  });

  describe('#cpuLoad()', function () {
    it('should return an array with values for each core', function () {
      var a = sysinfo.cpuLoad();
      var correctNumberOfCores = a.length === os.cpus().length;
      return assert.strictEqual(correctNumberOfCores, true);
    });
  });

});