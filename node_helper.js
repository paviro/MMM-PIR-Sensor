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
const execSync = require('child_process').execSync;

module.exports = NodeHelper.create({
    start: function () {
        this.started = false;
    },

    activateMonitor: function () {
        let self = this;
        // If always-off is enabled, keep monitor deactivated
        let alwaysOffTrigger = self.alwaysOff && (self.alwaysOff.readSync() === self.config.alwaysOffState)
        if (alwaysOffTrigger) {
            return;
        }
        
        if (self.config.switchHDMI === true) {
            // cancle any scheduled off events
            if(self.hdmiOffTimeout !== undefined) {
                clearTimeout(self.hdmiOffTimeout);
                self.hdmiOffTimeout = undefined;
            }
            
            // Check if hdmi output is already on
            let displayOff = execSync("/usr/bin/vcgencmd display_power").indexOf("display_power=0") === 0
            if (displayOff){
                exec("/usr/bin/vcgencmd display_power 1", null);
            }

            let switchOnDelay = displayOff ? self.config.relayOnDelay : 0;

            // If relays are being used
            if (self.config.relayPin !== false) {
                // check if a switch on is already scheduled
                if(self.relayOnTimeout === undefined) {
                    self.relayOnTimeout = setTimeout(function() {
                        self.relay.writeSync(self.config.relayState);
                        self.relayOnTimeout = undefined;
                    }, switchOnDelay);
                }
            }
        } else {
            //switch the relay immediately
            self.relay.writeSync(self.config.relayState);
        }
    },

    deactivateMonitor: function () {
        let self = this;
        // If always-on is enabled, keep monitor activated
        let alwaysOnTrigger = self.alwaysOn && (self.alwaysOn.readSync() === self.config.alwaysOnState)
        let alwaysOffTrigger = self.alwaysOff && (self.alwaysOff.readSync() === self.config.alwaysOffState)
        if (alwaysOnTrigger && !alwaysOffTrigger) {
            return;
        }
        // If relays are being used in place of HDMI
        if (self.config.relayPin !== false) {
            // cancel any scheduled turn-on events
            if(self.relayOnTimeout !== undefined) {
                clearTimeout(self.relayOnTimeout);
                self.relayOnTimeout = undefined;
            }

            self.relay.writeSync((self.config.relayState + 1) % 2);
        }

        if (self.config.switchHDMI === true) {
            // check if a switch off is already scheduled
            if(self.hdmiOffTimeout === undefined) {
                self.hdmiOffTimeout = setTimeout(function() {
                    exec("/usr/bin/vcgencmd display_power 0", null);
                    self.hdmiOffTimeout = undefined;
                }, self.config.hdmiOffDelay);
            }
        }
    },

    // Subclass socketNotificationReceived received.
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'CONFIG' && this.started == false) {
            const self = this;
            this.config = payload;

            // Setup for relay pin
            if (this.config.relayPin) {
                this.relay = new Gpio(this.config.relayPin, 'out');
                this.relay.writeSync(this.config.relayState);
                exec("/usr/bin/vcgencmd display_power 1", null);
            }

            // Setup for alwaysOn switch
            if (this.config.alwaysOnPin) {
                this.alwaysOn = new Gpio(this.config.alwaysOnPin, 'in', 'both');
                const alwaysOnState = this.config.alwaysOnState
                this.alwaysOn.watch(function (err, value) {
                    if (value === alwaysOnState) {
                        self.sendSocketNotification('ALWAYS_ON', true);
                        self.sendSocketNotification('SHOW_ALERT', {
                            title: 'Always-On Activated',
                            message: 'Mirror will not activate power-saving mode',
                            timer: 4000
                        });
                        if (self.config.powerSaving){
                            clearTimeout(self.deactivateMonitorTimeout);
                        }
                    } else if (value === (alwaysOnState + 1) % 2) {
                        self.sendSocketNotification('ALWAYS_ON', false);
                        self.sendSocketNotification('SHOW_ALERT', {
                            title: 'Always-On Deactivated',
                            message: 'Mirror will now use motion sensor to activate',
                            timer: 4000
                        });
                    }
                })
            }

            // Setup for alwaysOff switch
            if (this.config.alwaysOffPin) {
                this.alwaysOff = new Gpio(this.config.alwaysOffPin, 'in', 'both');
                const alwaysOffState = this.config.alwaysOffState
                this.alwaysOff.watch(function (err, value) {
                    if (value === alwaysOffState) {
                        self.sendSocketNotification('ALWAYS_OFF', true);
                        self.deactivateMonitor();
                    } else if (value === (alwaysOffState + 1) % 2) {
                        self.sendSocketNotification('ALWAYS_OFF', false);
                        self.activateMonitor();
                        if (self.config.powerSaving){
                            clearTimeout(self.deactivateMonitorTimeout);
                        }
                    }
                })
            }

            // Setup for sensor pin
            this.pir = new Gpio(this.config.sensorPin, 'in', 'both');

            // Setup value which represent on and off
            const valueOn = this.config.sensorState;
            const valueOff = (this.config.sensorState + 1) % 2;

            // Detected movement
            this.pir.watch(function (err, value) {
                if (value == valueOn) {
                    self.sendSocketNotification('USER_PRESENCE', true);
                    if (self.config.powerSaving){
                        clearTimeout(self.deactivateMonitorTimeout);
                        self.activateMonitor();
                    }
                }
                else if (value == valueOff) {
                    self.sendSocketNotification('USER_PRESENCE', false);
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
