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

Or would you prefer a cdn: `//cdn.jsdelivr.net/iso8601-localizer/1.2.2/iso8601-localizer.min.js`

## How to use

```javascript
// ISO8601 obtained from database or API
var localizeMe = '2015-06-02T14:13:12';

var localized = new ISO8601Localizer(localizeMe).localize();
```

Do you need your own date/time in ISO8601 format:

```javascript
var alreadyLocalized = new Date();

/*
A new Date object won't be formatted in ISO8601, so to do
so we use toISOString(), BUT the returned ISO8601 won't be localized,
it will be a UTC timezone, so to achieve a localized ISO8601
you do need ISO8601Localizer.
*/
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

After installing via `bower` just like you would `require` a node module:
```javascript
var ISO8601Localizer = require('iso8601-localizer');
```

Now go back to above **How to use** section and use as shown in those examples.

## The to method

You may decide to localize a given ISO8601 but not to your own offset,
but to another offset, for more info take a look [here](https://www.wikiwand.com/en/List_of_UTC_time_offsets).

```javascript
var localizedTo = new ISO8601Localizer('2015-06-02T14:13:12').to(-5).localize();
```

There are 2 types of fractionated offsets: **.30min** and **.45min**:

```javascript
// -4 hours and 30 minutes, you can pass -4.30 if you want.
var localizedTo = new ISO8601Localizer('2015-06-02T14:13:12').to(-4.3).localize();

// +8 hours and 45 minutes.
var localizedTo = new ISO8601Localizer('2015-06-02T14:13:12').to(8.45).localize();
```

**Valid offsets**:

```
[14, 13, 12.45, 12, 11.3, 11, 10.3, 10, 9.3, 9, 8.45, 8, 7, 6.3, 6, 5.45, 5.3, 5, 4.3, 4, 3.3, 3, 2, 1, 0, -1, -2, -3, -3.3, -4, -4.3, -5, -6, -7, -8, -9, -9.3, -10, -11, -12]
```

## The returnAs method

By default when you call to `localize` method the returned value is a valid ISO8601 string but you can use `returnAs` method to change the default behavior:

```javascript
// localizedTo = { day: "02", hour: "09", minute: "13", month: "06", second: "12", year: "2015" }
var localizedTo = new ISO8601Localizer('2015-06-02T14:13:12').to(-5).returnAs('object').localize();
```

The above call to `licalize` will result with an object rather than a string.

**Valid returnAs values**:

The returnAs method takes a string to indicate the requested return value, those are the valid strings you can pass:

* string(**default behavior**)
* object

## Why I need this tool?

Some APIs will retrieve date/time in ISO8601 format, the problem is that the ISO8601 format will be
retrieved as UTC timezone, this framework is built upon this exact idea as I experienced a UTC retrieval myself.

## How it works?

Javascript has a method called `getTimezoneOffset()` you can use on `Date` objects, the method return the number of minutes negative or positive depending on you timezone offset, I use this value to localize a given ISO8601.

Given `+3h` while the date/time are `2010-05-02:22:44:32`, the return result will be `2010-05-03:01:44:32`, there are more complicated cases such as leap year, fraction offsets or when the localization process forwards a month or even a year.

## Features

1. The source code is based on `Typescript` so if you love Typescript as I do you will find it useful.
2. You can localize a given ISO8601 not only to your offset but a given offfset.
3. Use it as a client-side framework or a node module.

**Enjoy !**

## Contact

Feel free to contact me via my email: `avielfedida@gmail.com`.

###### Version: `1.2.2`

###### License: `MIT`
