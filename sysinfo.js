'use strict';

var _         = require('lodash-node'),
    util      = require('util'),
    os        = require('os'),
    exec      = require('child_process').exec,
    async     = require('async');

/**
 * System Information Object
 * @return {[sysinfo]} [system information object]
 */
var sysinfo = function () {
  this.arch         = os.arch();
  this.clockSpeed   = this.clockSpeed();
  this.cpu          = this.cpu();
  this.cpuLoad      = exports.cpuLoad();
  this.cpus         = os.cpus();
  this.endianness   = os.endianness();
  this.EOL          = os.EOL;
  this.freemem      = os.freemem();
  this.hostname     = os.hostname();
  this.loadavg      = os.loadavg();
  this.memusage     = exports.memoryUsage();
  this.numCpus      = this.numCpus();
  this.platform     = os.platform();
  this.release      = os.release();
  this.tmpdir       = os.tmpdir();
  this.totalmem     = os.totalmem();
  this.type         = os.type();
  this.uptime       = os.uptime();
};

sysinfo.prototype.toString = function () {
  return util.format('%s (%s) %s', this.type, this.arch, this.release);
};

sysinfo.prototype.clockSpeed = function () {
  return os.cpus()[0].speed;
};

sysinfo.prototype.cpu = function () {
  return os.cpus()[0].model;
};

sysinfo.prototype.numCpus = function () {
  return os.cpus().length;
};

exports.macAddress = function (uuid, callback) {

  exec('ifconfig ' + uuid + ' | awk \'/ether/ {print $2}\'',
  function (err, stdout, stderr) {
    if (stdout === null || stdout === '' || err) {
      callback(null); // silent fail
    } else {
      callback(stdout);
    }
  });
};

/**
 * Retreives all network interfaces on the host device, map to a usable array
 * @return [{[string]: [object]}] [an array of network interfaces]
 */
exports.networkInterfaces = function (callback) {

  var ifaces = [];

  _.forIn(os.networkInterfaces(), function (value, key) {
    ifaces.push({
      'uuid': key,
      'addresses': value
    });
  });

  async.each(ifaces, function (iface, callback) {

    exports.macAddress(iface.uuid, function (ether) {
      iface.ether = ether;
      callback();
    });

  }, function (err) {
    callback(ifaces);
  });

};


/**
 * Retrieves system information about the host device
 * @return {[type]} [description]
 * @todo  retrieve data to plot to a chart (freemem, loadavg, etc.)
 */
exports.systemInfo = function (callback) {

  var info = new sysinfo();

  exports.networkInterfaces(function (ifaces) {
    info.ifaces = ifaces;
    callback(info);
  });

};

exports.loadAverage = function () {
  return os.loadavg();
};

/**
 * Cpu load in percentages
 * @return array array of floats
 */
exports.cpuLoad = function () {

  var cpus = os.cpus();
  var loads = [];

  cpus.forEach(function (cpu) {

    var load = cpu.times.user + cpu.times.nice +
               cpu.times.sys  + cpu.times.irq;

    var uptime = os.uptime() * 1000; // convert seconds to ms

    loads.push((load / uptime) * 100);

  });

  return loads;

};

/**
 * Available amount of memory in percentages
 * @return double [amount of free memory]
 */
exports.memoryUsage = function () {
  return ((os.totalmem() - os.freemem()) / os.totalmem()) * 100;
};