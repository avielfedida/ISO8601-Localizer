<p align="center">
	<img height="181" width="150" src="http://i.imgur.com/070F7jH.png">
</p>

---

> Simple to use getTimezoneOffset based ISO8601 localizer with source written in Typescript

## Installation

Node users:
```
npm install iso8601-localizer
```
Client-side users:
```
bower install iso8601-localizer
```

Or would you prefer a cdn: `//cdn.jsdelivr.net/iso8601-localizer/1.0.8/iso8601-localizer.min.js`

## How to use

```javascript
// ISO8601 obtained from database or API
var localizeMe = '2015-06-02T14:13:12';

var localized = new ISO8601Localizer(localizeMe).localize();
```

If you just need your own `time/date` in ISO8601 format, there is a trick for that:

```javascript
var alreadyLocalized = new Date();

// A new Date object won't be formatted in ISO8601, so to do
// so we use toISOString, BUT the returned ISO8601 won't be localized,
// for that we will ISO8601Localizer within the try block below.
var localizeMe = alreadyLocalized.toISOString();

/*
No matter how you obtained your ISO8601, ISO8601Localizer will
throw errors for invalid ISO8601 format or non logical date such
as April 31(there are 30 days in April), use a try catch blocks:
*/

try {

  var localized = new ISO8601Localizer(localizeMe).localize();

} catch (e) { /* Handle the error here. */ }
```

## Browserify users

Simply install via `bower` then:

```javascript
var ISO8601Localizer = require('iso8601-localizer');
```

Now go back to above **How to use** section.

## The to method

You may decide to localize a given ISO8601 but not to your own offset,
but to another offset, take a look [here](http://www.timeanddate.com/time/map/).

Now to figure out what is the offset you need, checkout [timeanddate](http://www.timeanddate.com/time/zone/).

And finally the code(valid offsets are between -11 to 14):

```javascript
try {
	// No matter how you obtain localizeMe.
  var localized = new ISO8601Localizer(localizeMe).to(-5).localize();

} catch (e) { /* Handle the error here. */ }
```

## Why do I need it?

Some APIs will retrieve `date/time` in `ISO8601` format, the problem is that the APIs won't check the request
location given your IP, so they `date/time` will be at `UTC` which probably not your local timezone, so that is why I build this framework.

## How it works?

Javascript have a method called `getTimezoneOffset()` you can use on `Date` objects, the method return the number of minutes negative of positive depending on you timezone, I use this value to convert a given `ISO8601` format into `ISO8601` format but now its localized.

Given `+3h` while the date/time are `2010-05-02:22:44:32`, the return result will be `2010-05-03:01:44:32`, there are more complicated case where its a leap year, or the  month need to advance, maybe the year, all cases are supported.

## Features

1. The source code is based on `Typescript` so if you love typescript as I do you will find it useful.
2. You can localize a given ISO8601 not only to your offset but a given offfset.
3. Support for leap years(add accuracy).
4. Use it as a client-side framework or a Node module.

**Enjoy !**

## Contact

Feel free to contact me via my email: `avielfedida@gmail.com`.

###### Version: `1.0.8`

###### License: `MIT`
