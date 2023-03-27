# compass-education

A package to interact with Compass, a school management system in Australia.

---

### :exclamation: Disclaimer - This package is unofficial and does not support all schools using Compass. 

## Installation
```
npm i compass-education
```

## Get Started
[Read the documentation here!](https://heyimleo.gitbook.io/compass-education/)

A basic example to fetch all classes for the day.
```
const Compass = require("compass-education");
const Client = new Compass.Client("https://xx.compass.education");

(async () => {
	await Client.login("Username", "Password");
	const classes = await Client.getClasses();
	// example output below
})();
```

<details open>
	<summary>Example output of classes</summary>

	[
		{
			title: 'XSCIH',
			rollMarked: true,
			start: '2022-05-17T22:45:00Z',
			finish: '2022-05-18T00:00:00Z',
			activityId: 80166,
			instanceId: 'x', // censored
			longTitle: '10:45: 1 - XSCIH - B33 - X',
			longTitleWithoutTime: '1 - XSCIH - B33 - X',
			classroom: 'B33',
			teacher: 'X' // censored
		},
		{
			title: 'XPEHH',
			rollMarked: true,
			start: '2022-05-18T00:05:00Z',
			finish: '2022-05-18T01:20:00Z',
			activityId: 80146,
			instanceId: '80146180520220005',
			longTitle: '12:05: 2 - XPEHH - S1F - TRI',
			longTitleWithoutTime: '2 - XPEHH - S1F - TRI',
			classroom: 'S1F',
			teacher: 'X'
		},
		...	2 more	
	]

</details>

## Motivation

I needed a way to get my classes programmatically, and thats how this project was born.

I have worked with other API wrappers of Compass ages ago, but they were mainly based on Puppeteer. This caused a lack of features and also was a bit slow. Using services (basically Compass endpoints), it made this project faster and packed more features than other projects. 

[Here](https://github.com/tascord/compass-edu) you can check out [tascord](https://github.com/tascord/)'s original library "compass-edu" based on Puppeteer.

Note: This library does not work for every school. If it doesn't, feel free to tweak the code a little or submit an issue, and maybe we can find some way to deal with it.

## Contributions

Since this library is not tested, and does not work for different schools, contributions are very much welcome. Anything from issues, pull requests will always help me out. 

Also, I am not a NodeJS professional - feel free to roast my code. 


## License

This library uses the GPL-3.0 license.
