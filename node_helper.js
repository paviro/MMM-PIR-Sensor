'use strict';

/* Magic Mirror
 * Module: MMM-PIR-Sensor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const gpio = require('wiring-pi');
const exec = require('child_process').exec;

module.exports = NodeHelper.create({
  start: function () {
    this.started = false
  },
  activateMonitor: function () {
    if (this.config.relayPIN != false) {
      gpio.digitalWrite(this.config.relayPIN, this.config.relayOnState)
    }
    else if (this.config.relayPIN == false){
      exec("/opt/vc/bin/tvservice -p", null);
    }
  },
  deactivateMonitor: function () {
    if (this.config.relayPIN != false) {
      gpio.digitalWrite(this.config.relayPIN, this.config.relayOffState)
    }
    else if (this.config.relayPIN == false){
      exec("/opt/vc/bin/tvservice -o", null);
    }
  },
  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    const self = this;
    if (notification === 'CONFIG' && this.started == false) {
      
      const self = this
      this.config = payload
      
      //Setup pins
      exec("echo '" + this.config.sensorPIN.toString() + "' > /sys/class/gpio/export", null);
      exec("echo 'in' > /sys/class/gpio/gpio" + this.config.sensorPIN.toString() + "/direction", null);

      if (this.config.relayPIN) {
        exec("echo '" + this.config.relayPIN.toString() + "' > /sys/class/gpio/export", null);
        exec("echo 'out' > /sys/class/gpio/gpio" + this.config.relayPIN.toString() + "/direction", null);
        exec("echo '1' > /sys/class/gpio/gpio" + this.config.relayPIN.toString() + "/value", null);
      }
      
      //Set gpio-mode
      gpio.setup('sys');
      
      //Detected movement
      gpio.wiringPiISR(this.config.sensorPIN, gpio.INT_EDGE_BOTH, function(delta) {
        if (gpio.digitalRead(self.config.sensorPIN) == 1) {
          self.sendSocketNotification("USER_PRESENCE", true);
          if (self.config.powerSaving){
            self.activateMonitor()
          }
        }
        //No movement
        else if (gpio.digitalRead(self.config.sensorPIN) == 0) {
          self.sendSocketNotification("USER_PRESENCE", false);
          if (self.config.powerSaving){
            self.deactivateMonitor()
          }
        }
      });
     
    this.started = true
    };
  }
  
});