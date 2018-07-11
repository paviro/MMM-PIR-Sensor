'use strict';

/* Magic Mirror
 * Module: MMM-PIR-Sensor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const Gpio = require('onoff').Gpio;
const exec = require('child_process').exec;

module.exports = NodeHelper.create({
  start: function () {
    this.started = false;
  },

  activateMonitor: function () {
    if (this.config.relayPIN != false) {
      this.relay.writeSync(this.config.relayOnState);
    }
    else if (this.config.useOfficialTouchscreen != false) {
      // Max brightness is 255, lower is generally better for a mirror to
      // avoid light bleed.
      brightness = this.config.officialTouchscreenBrightness
      exec("sudo sh -c \"echo " + brightness + " > /sys/class/backlight/rpi_backlight/brightness\"")
    }
    else if (this.config.relayPIN == false){
      // Check if hdmi output is already on
      exec("/usr/bin/vcgencmd display_power").stdout.on('data', function(data) {
        if (data.indexOf("display_power=0") == 0)
          exec("/usr/bin/vcgencmd display_power 1", null);
      });
    }
  },

  deactivateMonitor: function () {
    if (this.config.relayPIN != false) {
      this.relay.writeSync(this.config.relayOffState);
    }
    else if (this.config.useOfficialTouchscreen != false) {
      // Brightness of 0 makes it look like the display is off.
      exec("sudo sh -c \"echo 0 > /sys/class/backlight/rpi_backlight/brightness\"")
    }
    else if (this.config.relayPIN == false){
      exec("/usr/bin/vcgencmd display_power 0", null);
    }
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'CONFIG' && this.started == false) {
      const self = this;
      this.config = payload;

      // Setup value which represent on and off
      const valueOn = this.config.invertSensorValue ? 0 : 1;
      const valueOff = this.config.invertSensorValue ? 1 : 0;

      //Setup pins
      this.pir = new Gpio(this.config.sensorPIN, 'in', 'both');
      // exec("echo '" + this.config.sensorPIN.toString() + "' > /sys/class/gpio/export", null);
      // exec("echo 'in' > /sys/class/gpio/gpio" + this.config.sensorPIN.toString() + "/direction", null);

      if (this.config.relayPIN) {
        this.relay = new Gpio(this.config.relayPIN, 'out');
        this.relay.writeSync(this.config.relayOnState);
        exec("/usr/bin/vcgencmd display_power 1", null);
      }

      //Detected movement
      this.pir.watch(function(err, value) {
        if (value == valueOn) {
          self.sendSocketNotification("USER_PRESENCE", true);
          if (self.config.powerSaving){
            clearTimeout(self.deactivateMonitorTimeout);
            self.activateMonitor();
          }
        }
        else if (value == valueOff) {
          self.sendSocketNotification("USER_PRESENCE", false);
          if (!self.config.powerSaving){
            return;
          }

          self.deactivateMonitorTimeout = setTimeout(function() {
            self.deactivateMonitor();
          }, self.config.powerSavingDelay * 1000);
        }
      });

      this.started = true;

    } else if (notification === 'SCREEN_WAKEUP') {
      this.activateMonitor();
    }
  }

});
