# MMM-PIR-Sensor
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It can monitor a [PIR motion](http://www.amazon.com/2013newestseller-HC-SR501-Pyroelectric-Infrared-Detector/dp/B00FDPO9B8) sensor and put your mirror to sleep if nobody uses it by turning off HDMI output or by turning off the mirror via a relay.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/paviro/MMM-PIR-Sensor.git`. A new folder will appear navigate into it.
2. Execute `npm install` to install the node dependencies.
3. Add your user (`pi`?) to the `gpio group` by executing `sudo useradd -g pi gpio`.
4. Reboot your Pi.

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

## Configuration options

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
			<td><code>sensorPIN</code></td>
			<td>The pin your PIR-sensor is connected to.<br>
				<br><b>Possible values:</b> <code>int</code>
				<br><b>Default value:</b> <code>22</code>
				<br><b>Note:</b> Please use BCM-numbering.
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
			<td><code>relayPIN</code></td>
			<td>If you want to use a relay to turn of the mirror provide the pin here. If no pin is provided HDMI is turned off instead.<br>
				<br><b>Possible values:</b> <code>int</code>
				<br><b>Default value:</b> <code>none</code>
				<br><b>Note:</b> Please use BCM-numbering.
			</td>
		</tr>
		<tr>
			<td><code>relayOnState</code></td>
			<td>GPIO-state your relay is turned on.<br>
				<br><b>Possible values:</b> <code>int</code>
				<br><b>Default value:</b> <code>1</code>
			</td>
		</tr>
	</tbody>
</table>

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