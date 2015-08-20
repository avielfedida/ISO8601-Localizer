/// <reference path="typings/tsd.d.ts" />
var arrays = require('./lib/arrays');
var classes = require('./lib/classes');
var ISO8601Localizer = (function () {
    function ISO8601Localizer(userISO8601) {
        // Partially Stricted(no ^ and $): 2013-01-05T04:13:00
        this.ISO8601Pattern = /(\d{4})\-([0-1][0-9])\-([0-3][0-9])T([0-2][0-9])\:([0-5][0-9])\:([0-5][0-9])/;
        this.userISO8601 = userISO8601;
        this.userOffset = new Date().getTimezoneOffset() / -60;
    }
    ISO8601Localizer.prototype.to = function (offset) {
        if (!this.validOffset(offset)) {
            this.errorThrower(0);
        }
        this.userOffset = offset;
        return this;
    };
    // There are few variables set here for clarification and never used such as: newerDay, newerMonth and newYear.
    ISO8601Localizer.prototype.localize = function () {
        if (typeof this.userISO8601 !== 'string') {
            this.errorThrower(6);
        }
        var upperCaseISO8601 = this.userISO8601.toUpperCase();
        if (!this.isValid(upperCaseISO8601)) {
            this.errorThrower(1);
        }
        var _a = this.getOffset(), offsetHours = _a.offsetHours, operator = _a.operator;
        var matchStrings = upperCaseISO8601.match(this.ISO8601Pattern);
        var fullMatch = matchStrings.shift();
        var matchNumbers = matchStrings.map(function (val) {
            return parseInt(val);
        });
        var year = matchNumbers[0], month = matchNumbers[1], day = matchNumbers[2], hour = matchNumbers[3], minute = matchNumbers[4], second = matchNumbers[5];
        var leapYear = this.isLeapYear(year);
        // -1 is because arrays.monthsDays have 0 index.
        var daysInMonth = arrays.monthsDays[month - 1];
        if (leapYear && month === 2) {
            daysInMonth = 29; // daysInMonth = 29 instead of daysInMonth++ is used for expressivity.
        }
        if (!this.isLogical(daysInMonth, day)) {
            this.errorThrower(2);
        }
        // DIM stands for days in month, its use is explained inside the operator === '-' if statement.
        var previousMonthDIM = (function () {
            // The -2 used because -1 due to arrays.monthsDays have 0 index and -1 because we need the previous month.
            if (month - 2 < 0) {
                return arrays.monthsDays[12 + (month - 2)];
            }
            return arrays.monthsDays[month - 2];
        })();
        if (leapYear && month === 3) {
            previousMonthDIM = 29; // daysInMonth = 29 instead of daysInMonth++ is used for expressivity.
        }
        if (operator === '=') {
            return fullMatch;
        }
        if (this.isFloat(offsetHours)) {
            var offsetHoursRemainder = this.getRemainder(offsetHours);
            var newMinute = 0;
            var remainderMinutes = 0;
            switch (offsetHoursRemainder) {
                // 45 minutes
                case 45:
                /*
                When using .to() method the user must use .3 or .45 BUT when getTimezoneOffset value is
                used(when not using the to method), well lets take for example +5.45, the number of minutes returned
                is 60*5+45=345, now let divide 345/60=5.75, the fraction is .75, the case 45 is as explained because
                the use must use .3 or .45.
                */
                case 75:
                    remainderMinutes = 45;
                    break;
                // 30 minutes, users can send .30, javascript will convert it to 0.3
                case 3:
                // Same explanation as case 75, this case +5.3 is 60*5+30=330 and 330/60=5.5
                case 5:
                    remainderMinutes = 30;
                    break;
                default:
                    this.errorThrower(3);
            }
            if (operator === '+') {
                newMinute = minute + remainderMinutes;
            }
            if (operator === '-') {
                newMinute = minute - remainderMinutes;
            }
            /*
            The Math.ceil(offsetHours) is used instead of Math.floor(offsetHours) + 1.
            The floor is used to cancel the fraction and the +1 because newMinute > 59
            or newMinute < 0 either way the system is using absolute offsetHours
            (the system check operator variable).
            */
            if (newMinute > 59) {
                minute = newMinute - 60; // ---------- Final
                offsetHours = Math.ceil(offsetHours);
            }
            else if (newMinute < 0) {
                minute = newMinute + 60; // ---------- Final
                offsetHours = Math.ceil(offsetHours);
            }
            else {
                minute = newMinute; // ---------- Final
                offsetHours = Math.floor(offsetHours);
            }
        }
        // The following actions will take place only for integers offsets.
        if (operator === '+') {
            var newHour = hour = hour + offsetHours; // ---------- Final(maybe)
            if (newHour > 23) {
                var addDays = Math.floor(newHour / 24);
                var remainingHours = hour = newHour % 24; // ---------- Final
                var newDay = day = day + addDays; // ---------- Final(maybe)
                if (newDay > daysInMonth) {
                    var newerDay = day = newDay - daysInMonth; // ---------- Final
                    var newMonth = month = month + 1; // ---------- Final(maybe)
                    if (newMonth > 12) {
                        var newerMonth = month = 1; // ---------- Final
                        var newYear = year = year + 1; // ---------- Final
                    }
                }
            }
        }
        if (operator === '-') {
            var newHour = hour = hour - offsetHours; // ---------- Final(maybe)
            if (newHour < 1) {
                /*
                I use + 24 so decreaseDays and remainingHours will calculate the currect value,
                notice that this block statement is entered only when I need to decrease a day, so
                the + 24 is used to artificially "show" the calculations that a day was passed(in our case
                the previous day wasn't pass).

                 - decreaseDays divide the newHour by 24 then floor the result to get the number
                   of days.

                 - remainingHours will modulus the newHour to get the number of remaining hours to set
                   after it decreased a day or more.

                There is a special case where newHour equals to 0, for that case the decreaseDays
                calculation fails, and as result also newDay calculation fails, so before I calculate
                newDay I check to see if the newHour equals 0, if so I manually set decreaseDays to 1.
                */
                newHour = Math.abs(newHour) + 24;
                var decreaseDays = Math.floor(newHour / 24);
                var remainingHours = hour = 24 - (newHour % 24); // ---------- Final(maybe)
                if (newHour === 0) {
                    decreaseDays = 1;
                    /*
                    When newHour % 24 equals 0, 24 - 0 is 24, so when newHour equals 0, I set the hour
                    to 0, for now there is no need to set remainingHours, but I want both variables to have
                    the same values, maybe it will help later.
                    */
                    remainingHours = hour = 0; // ---------- Final
                }
                var newDay = day = day - decreaseDays; // ---------- Final(maybe)
                /*
                This if statement is very special, if newDay is smaller than 1, then it set the
                newerDay and the day to be..... previousMonthDIM + newDay and not newDay - daysInMonth.
                The + and not - is because newDay may be negative, previousMonthDIM and not daysInMonth
                because we decrease days but from the maximum number of days of the previous month, remember
                when operator equals '-' we going backwards.

                When newDay equals 0, no days will be decreased from the previous month max days.
                */
                if (newDay < 1) {
                    var newerDay = day = previousMonthDIM + newDay; // ---------- Final
                    var newMonth = month = month - 1; // ---------- Final(maybe)
                    if (newMonth < 1) {
                        var newerMonth = month = 12; // ---------- Final
                        var newYear = year = year - 1; // ---------- Final
                    }
                }
            }
        }
        var ISO8601 = [year, month, day, hour, minute, second].slice(0);
        if (this.userReturnAs) {
            switch (this.userReturnAs) {
                case 'object':
                    return this.returnAsObject(ISO8601);
                default:
                    return this.returnAsString(ISO8601);
            }
        }
        else {
            return this.returnAsString(ISO8601);
        }
    };
    ISO8601Localizer.prototype.returnAs = function (as) {
        if (typeof as !== 'string') {
            this.errorThrower(7);
        }
        as = as.toLowerCase();
        if (!this.validReturnAs(as)) {
            this.errorThrower(5);
        }
        this.userReturnAs = as;
        return this;
    };
    ISO8601Localizer.prototype.validReturnAs = function (returnAs) {
        return (arrays.returnAsTypes.indexOf(returnAs) > -1) ? true : false;
    };
    ISO8601Localizer.prototype.returnAsString = function (ISO8601) {
        var stringedISO8601Object = this.returnAsObject(ISO8601);
        return stringedISO8601Object.year + '-' +
            stringedISO8601Object.month + '-' +
            stringedISO8601Object.day + 'T' +
            stringedISO8601Object.hour + ':' +
            stringedISO8601Object.minute + ':' +
            stringedISO8601Object.second;
    };
    ISO8601Localizer.prototype.returnAsObject = function (ISO8601) {
        var stringedISO8601Object = { year: '', month: '', day: '', hour: '', minute: '', second: '' };
        var ISO8601ParameterOrder = ['year', 'month', 'day', 'hour', 'minute', 'second'];
        for (var k in ISO8601) {
            var toStringISO8601 = ISO8601[k].toString();
            stringedISO8601Object[ISO8601ParameterOrder[k]] = (toStringISO8601.length === 1 ? "0" + toStringISO8601 : toStringISO8601);
        }
        return stringedISO8601Object;
    };
    ISO8601Localizer.prototype.getRemainder = function (n) {
        return parseInt(n.toString().split('.')[1]);
    };
    ISO8601Localizer.prototype.isFloat = function (n) {
        return n === Number(n) && n % 1 !== 0;
    };
    ISO8601Localizer.prototype.errorThrower = function (errorCode) {
        var error = '';
        var className = this.constructor.toString().match(/\w+/g)[1];
        switch (errorCode) {
            case 0:
                error = 'Invalid offset supplied, valid offsets are between -12 to 14';
                break;
            case 1:
                error = 'Invalid ISO8601, try something like(case insensitive, T may be t): 2005-06-03T13:04:32';
                break;
            case 2:
                error = 'Non logical date, please check that there are X days in month Y.';
                break;
            case 3:
                error = 'Unknown offset fraction, internal error, please contact the code author.';
                break;
            case 4:
                error = 'to method parameter type is not a number.';
                break;
            case 5:
                error = 'Invalid string argument supplied to returnAs method.';
                break;
            case 6:
                error = 'Constructor parameter type is not a string.';
                break;
            case 7:
                error = 'returnAs method parameter type is not a string.';
                break;
            default:
                error = 'Unknow error code.';
        }
        throw (className + ': ' + error);
    };
    ISO8601Localizer.prototype.isLogical = function (maxDays, day) {
        return day <= maxDays;
    };
    ISO8601Localizer.prototype.getOffset = function () {
        var offset = this.userOffset;
        return {
            operator: (function () {
                if (offset > 0) {
                    return '+';
                }
                else if (offset < 0) {
                    return '-';
                }
                else {
                    return '=';
                }
            })(),
            offsetHours: Math.abs(offset)
        };
    };
    ISO8601Localizer.prototype.validOffset = function (offset) {
        if (typeof offset !== 'number') {
            this.errorThrower(4);
        }
        var RangerInstance = new classes.Ranger();
        var validIntegerOffsets = RangerInstance.getRange(-12, 14);
        var validOffsets = validIntegerOffsets.concat(arrays.floatingPointOffsets);
        return (validOffsets.indexOf(offset) > -1) ? true : false;
    };
    ISO8601Localizer.prototype.isValid = function (maybeValid) {
        return this.ISO8601Pattern.test(maybeValid);
    };
    ISO8601Localizer.prototype.isLeapYear = function (year) {
        /*
        Mathisfun(https://www.mathsisfun.com/leap-years.html):

        "
        Leap Years are any year that can be evenly divided by 4 (such as 2012, 2016, etc),
        except if it can can be evenly divided by 100, then it isn't (such as 2100, 2200, etc),
        except if it can be evenly divided by 400, then it is (such as 2000, 2400).
        "
        */
        return ((year % 4 === 0 && year % 100 !== 0)
            ||
                (year % 4 === 0 && year % 100 === 0 && year % 400 === 0));
    };
    return ISO8601Localizer;
})();
module.exports = ISO8601Localizer;
