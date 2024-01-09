# compass-education

A package to interact with Compass, a school management system by JDLF, mostly used in Australia.

---

### :exclamation: Disclaimer - This package is unofficial and may not support all schools using Compass. 

## Installation
```
npm i compass-education
```

## Get Started
```js
const Compass = require("compass-education");
const Client = new Compass.Client("https://xx.compass.education");

(async () => {
	await Client.login("Username", "Password");
	const classes = await Client.getClasses();
	/*
		[
			{
				title: 'XSCIH',
				rollMarked: true,
				start: '2022-05-17T22:45:00Z',
				finish: '2022-05-18T00:00:00Z',
				activityId: 80166,
				instanceId: 'XX',
				longTitle: '10:45: 1 - XSCIH - B33 - X',
				longTitleWithoutTime: '1 - XSCIH - B33 - X',
				classroom: 'B33',
				teacher: 'XX'
			},
			...	3 more	
		]
	*/
})();
```

## Motivation

I needed a way to get my classes programmatically, and thats how this project was born.

I have worked with other API wrappers of Compass ages ago, but they were mainly based on Puppeteer. This was quite slow. Instead, we reverse engineer the routes based on the Compass web app. 

Note: This library does not work for every school. If it doesn't, feel free to tweak the code a little or submit an issue, and maybe we can find some way to deal with it.

## Contributions

Since this library is not tested, and does not guarantee usability for different schools, contributions are very much welcome.

## License

This library uses the GPL-3.0 license.
