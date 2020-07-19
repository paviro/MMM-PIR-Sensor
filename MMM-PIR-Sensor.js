/* global Module */

/* Magic Mirror
* Module: MMM-PIR-Sensor
*
* By Paul-Vincent Roll http://paulvincentroll.com
* MIT Licensed.
*/

Module.register('MMM-PIR-Sensor',{
	requiresVersion: '2.1.0',
	defaults: {
		sensorPin: 22,
		sensorState: 1,
		relayPin: false,
		relayState: 1,
		alwaysOnPin: false,
		alwaysOnState: 1,
		alwaysOffPin: false,
		alwaysOffState: 1,
		powerSaving: true,
		powerSavingDelay: 0,
		powerSavingNotification: false,
		powerSavingMessage: "Monitor will be turn Off by PIR module",
		presenceIndicator: "fa-bullseye",
		presenceIndicatorColor: "red",
		presenceOffIndicator: null,
		presenceOffIndicatorColor: "dimgray",
		runSimulator: false
	},

	userPresence: false,

	getStyles: function() {
		return [
			'font-awesome.css'
		];
	},

	getDom: function() {
		var wrapper = document.createElement("i");
		if (this.userPresence) {
			if (this.config.presenceIndicator && this.config.presenceIndicatorColor) {
				wrapper.className = "fas " + this.config.presenceIndicator;
				wrapper.style = "color: " + this.config.presenceIndicatorColor + ";";
			}
		}
		else {
			if (this.config.presenceOffIndicator && this.config.presenceOffIndicatorColor) {
				wrapper.className = "fas " + this.config.presenceOffIndicator;
				wrapper.style = "color: " + this.config.presenceOffIndicatorColor + ";";
			}
		}
		return wrapper;
	},

	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
		if (notification === 'USER_PRESENCE') {
			this.userPresence = payload;
			this.sendNotification(notification, payload);
			if  (payload === false && this.config.powerSavingNotification === true){
				this.sendNotification("SHOW_ALERT",{type:"notification", message:this.config.powerSavingMessage});
			}
			this.updateDom();
		} else if (notification === 'SHOW_ALERT') {
			this.sendNotification(notification, payload)
		}
	},

	notificationReceived: function (notification, payload) {
		if (notification === 'SCREEN_WAKEUP') {
			this.sendNotification(notification, payload)
		}
	},

	start: function () {
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	}
});
