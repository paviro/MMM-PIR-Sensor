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
		suspendResume: true,
		classesActive: "fas fa-user",
		classesInactive: "far fa-user inactive"
	},
	user_present: false,

	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
		if (notification === 'USER_PRESENCE') {
			this.user_present = payload;

			this.sendNotification(notification, payload)
			if (payload === false && this.config.powerSavingNotification === true){
				this.sendNotification("SHOW_ALERT",{type:"notification", message:this.config.powerSavingMessage});
			}

			if(this.config.suspendResume) {
				self = this;

				// Suspend all modules
				MM.getModules().enumerate((module) => {
					if(!module.hidden) {
						if(payload) { // User present
							clearTimeout(self.suspendTimeout);
							module.resume();
						} else { // User not present
							setTimeout(function() {
								console.log(module);
								module.suspend();
							}, self.config.powerSavingDelay * 1000);
						}
					}
				});
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
	},

	getDom: function() {
		var wrapper;
		wrapper = document.createElement("div");
		wrapper.className = this.config.classes + " " + (this.user_present ? this.config.classesActive : this.config.classesInactive);
		return wrapper;
	},

});
