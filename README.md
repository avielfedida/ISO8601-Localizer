<p align="center">
	<img height="181" width="150" src="http://i.imgur.com/070F7jH.png">
</p>

---

> Simple to use getTimezoneOffset based ISO8601 localizer with source written in typescript

## Installation

```
bower install ISO8601-Localizer
```

Include `ISO8601-Localizer.js` before your js code, then simple do:

```javascript
var localizeMe = '2015-06-02T14:13:12';

var localized = new ISO8601Localizer(localizeMe).get();
```

A full use I suggest will be as:

```javascript
// ISO8601 you got from a database or API
var localizeMe = '2015-03-14T14:32:50';

// Or maybe...
var alreadyLocalized = new Date(); // Already localized...

// But what if...
var localizeMe = alreadyLocalized.toISOString(); // Not localized anymore but in ISO8601 format.

/*
The try-catch blocks are for invalid ISO8601 or non logical date such
as April 31(there are only 30 days in April), for those cases the
framework will throw an error.
*/

try {

	var localized = new ISO8601Localizer(localizeMe).get();

} catch (e) {

	// Handle the error here.

}
```

## Why do I need it?

Some APIs will retrieve `date/time` in `ISO8601` format, the problem is that the APIs won't check the request
location given your IP, so they `date/time` will be at `UTC` which probably not your local timezone, so that is why I build this framework.

## How it works?

Javascript have a method called `getTimezoneOffset()` you can use on `Date` objects, the method return the number of minutes negative of positive depending on you timezone, I use this value to convert a given `ISO8601` format into `ISO8601` format but now its localized.

Given `+3h` while the date/time are `2010-05-02:22:44:32`, the return result will be `2010-05-03:01:44:32`, there are more comlicated case where its a leap year, or the  month need to advance, maybe the year, all cases are supported.

## Features

1. The source code is based on `typescript` so if you love typescript as I do you will find it usefull.
2. Support for leap years.

**Enjoy !**

## Contact

Feel free to contact me at `avielfedida@gmail.com`.

###### Version: `1.0.1`

###### License: `MIT`