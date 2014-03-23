'use strict';

var should    = require('should'),
    os        = require('os'),
    sysinfo   = require('../sysinfo');

describe('systeminfo', function (done) {

  describe('#systemInfo()', function (done) {

    it('should return basic information', function (done) {
      sysinfo.systemInfo(function (info) {

        var a = ['arch', 'clockSpeed', 'cpu', 'cpuLoad', 'cpus', 'endianness',
                'EOL', 'freemem', 'hostname', 'ifaces', 'loadavg', 'memusage',
                'numCpus', 'platform', 'release', 'tmpdir', 'totalmem', 'type',
                'uptime'
              ];

        info.should.have.properties(a);
        done();

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
      return sysinfo.memoryUsage().should.be.within(0, 100);
    });
  });

  describe('#cpuLoad()', function () {
    it('should return an array with values for each core', function () {
      return sysinfo.cpuLoad().length.should.equal(os.cpus().length);
    });
  });

});