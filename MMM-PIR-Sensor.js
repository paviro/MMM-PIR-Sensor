/* global Module */

/* Magic Mirror
* Module: MMM-PIR-Sensor
*
* By Paul-Vincent Roll http://paulvincentroll.com
* MIT Licensed.
*/

Module.register('MMM-PIR-Sensor', {

	requiresVersion: '2.1.0',

	defaults: {
		sensor: {
			pin: 22,
			activeState: 1
		},
		relay: {
			pin: false,
			activeState: 1
		},
		alwaysOn: {
			pin: false,
			activeState: 1
		},
		alwaysOff: {
			pin: false,
			activeState: 1
		}
		powerSaving: true,
		powerSavingDelay: 0,
	},

	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
		if (notification === 'USER_PRESENCE'){
			this.sendNotification(notification, payload)
		}
	},

	notificationReceived: function (notification, payload) {
		if (notification === 'SCREEN_WAKEUP'){
			this.sendNotification(notification, payload)
		}
	},

	start: function () {
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	}
});
