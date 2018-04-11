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
        console.log('[' + this.name + '] Node Helper Start');
    },

    activateMonitor: function () {
        if (this.config.relayPIN != false) {
            this.relay.writeSync(this.config.relayOnState);
        }
        else if (this.config.relayPIN == false) {
            // Check if hdmi output is already on
            exec("vcgencmd display_power").stdout.on('data', function(data) {
                if (data.indexOf("display_power=0") == 0)
                    exec("vcgencmd display_power 1", null);
            });
        }
    },

    deactivateMonitor: function () {
        if (this.config.relayPIN != false) {
            this.relay.writeSync(this.config.relayOffState);
        }
        else if (this.config.relayPIN == false) {
            exec("vcgencmd display_power 0", null);
        }
    },

    // Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'CONFIG' && this.started == false) {
            const self = this;
            this.config = payload;
            self.deactivateMonitorTimeout;

        // Setup value which represent on and off
        const valueOn = this.config.invertSensorValue ? 0 : 1;

        // Setup pins
        this.pir = new Gpio(this.config.sensorPIN, 'in', 'both');
                if (this.config.relayPIN) {
                    this.relay = new Gpio(this.config.relayPIN, 'out');
                    this.relay.writeSync(this.config.relayOnState);
                    exec("vcgencmd display_power 1", null);
                }

                // Detected movement
                this.pir.watch(function pirDetect(err, value) {
                    // If motion is detected
                    if (value == valueOn) {
                        if (self.config.powerSaving) {
                            // Power on monitor
                            self.activateMonitor();
                            // Clear old timeout for powering off monitor
                            clearTimeout(self.deactivateMonitorTimeout);
                            // Set new timer to power off monitor
                            self.deactivateMonitorTimeout = setTimeout(function () {
                                self.sendSocketNotification('USER_PRESENCE', false);
                                pirDetect.active = false;
                                console.log('[' + self.name + '] User not present');
                                if (self.config.powerSaving) {
                                    self.deactivateMonitor();
                                }
                            }, self.config.powerSavingDelay * 1000);
                        }
                        self.sendSocketNotification('USER_PRESENCE', true);
                        console.log('[' + self.name + '] User present');
                    }
                });

                this.started = true;

        } else if (notification === 'SCREEN_WAKEUP') {
            this.activateMonitor();
        }
    }
});
