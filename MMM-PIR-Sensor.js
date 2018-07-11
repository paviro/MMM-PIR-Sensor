/* global Module */

/* Magic Mirror
 * Module: MMM-PIR-Sensor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */


Module.register('MMM-PIR-Sensor',{

	requiresVersion: "2.1.0",

	defaults: {
		sensorPIN: 22,
		invertSensorValue: false,
		relayPIN: false,
		relayOnState: 1,
		powerSaving: true,
		powerSavingDelay: 0,
		powerSavingNotification: false,
		powerSavingMessage: "Monitor will be turn Off by PIR module", 
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "USER_PRESENCE"){
			this.sendNotification(notification, payload)
		        if (payload === false && this.config.powerSavingNotification === true){
				this.sendNotification("SHOW_ALERT",{type:"notification", message:this.config.powerSavingMessage});
			}
		}
	},

	notificationReceived: function(notification, payload) {
		if (notification === "SCREEN_WAKEUP"){
			this.sendNotification(notification, payload)
		}
	},

	start: function() {
		if (this.config.relayOnState == 1){
			this.config.relayOffState = 0
		}
		else if (this.config.relayOnState == 0){
			this.config.relayOffState = 1
		}
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	}
});
