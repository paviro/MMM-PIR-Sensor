# MMM-PIR-Sensor
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It can monitor a [PIR motion](http://www.amazon.com/2013newestseller-HC-SR501-Pyroelectric-Infrared-Detector/dp/B00FDPO9B8) sensor and put your mirror to sleep if nobody uses it by turning off HDMI output or by turning off the mirror via a relay.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/paviro/MMM-PIR-Sensor.git`. A new folder will appear navigate into it.
2. Execute `npm install` to install the node dependencies.
3. Add your user (`pi`?) to the `gpio group` by executing `sudo usermod -a -G gpio pi`.
4. Execute `sudo chmod u+s /opt/vc/bin/tvservice && sudo chmod u+s /bin/chvt` to allow turning on/off the hdmi output.
5. Reboot your Pi.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-PIR-Sensor',
		config: {
			// See 'Configuration options' for more information.
		}
	}
]
````

## Configuration Options

The following properties can be configured:

<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>sensorPin</code></td>
			<td>The pin your PIR-sensor is connected to.<br>
				<br><b>Possible values:</b> <code>int</code>
				<br><b>Default value:</b> <code>22</code>
				<br><b>Note:</b> Please use BCM-numbering.
			</td>
		</tr>
		<tr>
			<td><code>sensorState</code></td>
			<td>Invert the GPIO-state that triggers user presence. For example, a <code>0</code> value would tell the mirror to trigger user presence when the GPIO pin receives <code>0</code> value.<br>
				<br><b>Possible values:</b> <code>int (0 or 1)</code>
				<br><b>Default value:</b> <code>1</code>
			</td>
		</tr>
		<tr>
			<td><code>powerSaving</code></td>
			<td>Should the monitor be turned off if no user is present? (via HDMI or relay)<br>
				<br><b>Possible values:</b> <code>boolean</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>powerSavingDelay</code></td>
			<td>Additional software side delay (in seconds) before the monitor will be turned off.<br>
				<br><b>Possible values:</b> <code>int</code>
				<br><b>Default value:</b> <code>0</code>
			</td>
		</tr>
		<tr>
			<td><code>relayPin</code></td>
			<td>If you want to use a relay to turn of the mirror provide the pin here. If no pin is provided HDMI is turned off instead.<br>
				<br><b>Possible values:</b> <code>int</code>
				<br><b>Default value:</b> <code>false</code>
				<br><b>Note:</b> Please use BCM-numbering.
			</td>
		</tr>
		<tr>
			<td><code>relayState</code></td>
			<td>GPIO-state your relay is turned on.<br>
				<br><b>Possible values:</b> <code>int (0 or 1)</code>
				<br><b>Default value:</b> <code>1</code>
			</td>
		</tr>
		<tr>
			<td><code>alwaysOnPin</code></td>
			<td>If you would like to use a GPIO pin to trigger power-saving mode. Ideal for users who want to have a physical switch that controls whether or not to use the motion sensor.<br>
				<br><b>Possible values:</b> <code>int</code>
				<br><b>Default value:</b> <code>false</code>
				<br><b>Note:</b> Please use BCM-numbering.
			</td>
		</tr>
		<tr>
			<td><code>alwaysOnState</code></td>
			<td>GPIO-state to trigger always-on.<br>
				<br><b>Possible values:</b> <code>int (0 or 1)</code>
				<br><b>Default value:</b> <code>1</code>
			</td>
		</tr>
		<tr>
			<td><code>alwaysOffPin</code></td>
			<td>If you would like to use a GPIO pin to trigger sleep mode. Ideal for users who want to have a physical switch to shut off the screen (perhaps the mirror is too bright at night).<br>
				<br><b>Possible values:</b> <code>int</code>
				<br><b>Default value:</b> <code>false</code>
				<br><b>Note:</b> Please use BCM-numbering.
			</td>
		</tr>
		<tr>
			<td><code>alwaysOffState</code></td>
			<td>GPIO-state to trigger always-off.<br>
				<br><b>Possible values:</b> <code>int (0 or 1)</code>
				<br><b>Default value:</b> <code>1</code>
			</td>
		</tr>
		<tr>
			<td><code>powerSavingNotification</code></td>
			<td>To display a notification before to switch screen off<br>
				<br><b>Possible values:</b> <code>boolean</code>
				<br><b>Default value:</b> <code>false</code>
				<br><b>Note:</b> Need the default module "alert" to be declared on config.js file.
			</td>
		</tr>
		<tr>
			<td><code>powerSavingMessage</code></td>
			<td>Message notification to display before to switch screen off<br>
				<br><b>Default value:</b> <code>"Monitor will be turn Off by PIR module"</code>
			</td>
		</tr>
		<tr>
			<td><code>preventHDMITimeout</code></td>
			<td>When <code>powerSaving</code> is On: time, in minutes, after which- while HDMI is off- the screen will be briefly turned on and off again, periodically. This is to avoid older HDMI screens from automatically turning Off due to "No Signal".
				<br><b>Possible values:</b> <code>0-10</code>
				<br><b>Default value:</b> <code>0</code>
				<br><b>Note:</b>0 value means that this feature is turned off.
			</td>
		</tr>    
                <tr>
			<td><code>supportCEC</code></td>
		        <td>When <code>powerSaving</code> is On: support CEC to turn monitor ON or OFF as well, not just the HDMI circuit in the RPI.
				<br><b>Possible values:</b> <code>boolean</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>    
    <tr>
			<td><code>presenceIndicator</code></td>
			<td>When module <code>position</code> is defined, thus it is <b>visible</b>, display an indicator when <code>USER_PRESENCE</code> is detected.
				<br><b>Possible values:</b> <code>Font Awesome icons</code> [See here](https://fontawesome.com/icons?d=gallery)
				<br><b>Default value:</b> <code>fa-bullseye</code>			
				<br><b>Note: </b> Not displayed if set to <code>null</code>
			</td>
		</tr>    
                <tr>
			<td><code>presenceIndicatorColor</code></td>
			<td>The color of <code>presenceIndicator</code>, if defined.
				<br><b>Possible values:</b> <code>color value</code>
				<br><b>Default value:</b> <code>red</code>
				<br><b>Note: </b> <code>presenceIndicator</code> is not displayed if this parameter is set to <code>null</code>
			</td>
		</tr>    
                <tr>
			<td><code>presenceOffIndicator</code></td>
			<td>When module <code>position</code> is defined, thus it is <b>visible</b>, display an indicator when <code>USER_PRESENCE</code> is <b>not</b> detected.
				<br><b>Possible values:</b> <code>Font Awesome icons</code> [See here](https://fontawesome.com/icons?d=gallery)
				<br><b>Default value:</b> <code>null</code>
				<br><b>Note: </b> Not displayed if set to <code>null</code>
			</td>
		</tr>    
                <tr>
			<td><code>presenceOffIndicatorColor</code></td>
			<td>The color of <code>presenceOffIndicator</code>, if defined.
				<br><b>Possible values:</b> <code>color value</code>
				<br><b>Default value:</b> <code>dimgray</code>
				<br><b>Note: </b> <code>presenceOffIndicator</code> is not displayed if this parameter is set to <code>null</code>
			</td>
		</tr>    
		<tr>
			<td><code>runSimulator</code></td>
			<td>Turn on a simulator that will send <code>USER_PRESENCE ON</code> every 20 seconds, and <code>USER_PRESENCE OFF</code> one second after that. 
				<br>This is handy when you want to work on the configuration of the mirror without having to stand up in front of it in order to test.
				<br><b>Possible values:</b> <code>boolean</code>
				<br><b>Default value:</b> <code>false</code>
				<br><b>Note: </b> Don't forget to turn this one off when using the actual IR sensor!
			</td>
		</tr>
	</tbody>
</table>

## Example

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-PIR-Sensor', 
		position: "top_center", // Remove this line to avoid having an visible indicator
		config: {
			sensorPin: 23,
			powerSavingDelay: 60, // Turn HDMI OFF after 60 seconds of no motion, until motion is detected again
			preventHDMITimeout: 4, // Turn HDMI ON and OFF again every 4 minutes when power saving, to avoid LCD/TV timeout
			supportCEC: true, 
			presenceIndicator: "fa-eye", // Customizing the indicator
			presenceOffIndicator: "fa-eye", // Customizing the indicator
			presenceIndicatorColor: "#f51d16", // Customizing the indicator
			presenceOffIndicatorColor: "#2b271c" // Customizing the indicator
		}
	}
]
````

## Developer Notes
This module broadcasts a `USER_PRESENCE` notification with the payload beeing `true` or `false` you can use it to pause or disable your module.

## Dependencies
- [wiring-pi](https://www.npmjs.com/package/wiring-pi) (installed via `npm install`)

The MIT License (MIT)
=====================

Copyright © 2016 Paul-Vincent Roll

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
