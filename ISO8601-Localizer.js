var lib;
(function (lib) {
    var arrays;
    (function (arrays) {
        arrays.monthsDays = [
            31,
            28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
        ];
    })(arrays = lib.arrays || (lib.arrays = {}));
})(lib || (lib = {}));
var lib;
(function (lib) {
    var classes;
    (function (classes) {
        var Ranger = (function () {
            function Ranger() {
            }
            Ranger.prototype.getRange = function (start, end) {
                /*
                There are 6 parameters combination:
      
                1. (5, 7)
                2. (7, 5)
                3. (7, 7)
                4. (-5, -7)
                5. (-7, -5)
                6. (-7, -7)
                7. (5, -7)
                8. (-7, 5)
      
                This function will return an ordered range for the parameters, for example:
      
                (5, 7) or (7, 5) => [5,6,7]
                (-7, 5) or (5, -7) => [-7,-6,-5,-4,-3,-2,-1,0,1,2,4,5]
                (-7, -7) => [-7]
                (5, 5) => [5]
                */
                var notBothNegativeTmp = null, bothNegativeTmp = null, bothNegativeFlag = false, retArray = [];
                if (start < 0 && end < 0) {
                    start = Math.abs(start);
                    end = Math.abs(end);
                    bothNegativeFlag = true;
                    if (start > end) {
                        bothNegativeTmp = end;
                        end = start;
                        start = bothNegativeTmp;
                    }
                }
                else {
                    if (start > end) {
                        notBothNegativeTmp = end;
                        end = start;
                        start = notBothNegativeTmp;
                    }
                }
                for (var i = start; i <= end; i++) {
                    if (bothNegativeFlag) {
                        retArray.push(-i);
                    }
                    else {
                        retArray.push(i);
                    }
                }
                return retArray;
            };
            return Ranger;
        })();
        classes.Ranger = Ranger;
    })(classes = lib.classes || (lib.classes = {}));
})(lib || (lib = {}));
/// <reference path="typings/tsd.d.ts" />
/// <reference path="lib/interfaces.ts" />
/// <reference path="lib/arrays.ts" />
/// <reference path="lib/classes.ts" />
var ISO8601Localizer = (function () {
    function ISO8601Localizer(userISO8601) {
        this.ISO8601Pattern = /(\d{4})-([0-1][0-9])-([0-3][0-9])T([0-2][0-9]):([0-5][0-9]):([0-5][0-9])/;
        this.userISO8601 = userISO8601;
        this.userOffset = new Date().getTimezoneOffset() / -60;
        ;
    }
    ISO8601Localizer.prototype.to = function (offset) {
        if (!this.validOffset(offset)) {
            this.errorThrower(0);
        }
        ;
        this.userOffset = offset;
        return this;
    };
    ISO8601Localizer.prototype.localize = function () {
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
        var daysInMonth = lib.arrays.monthsDays[month - 1];
        if (leapYear && month === 2) {
            daysInMonth = 29;
        }
        if (!this.isLogical(daysInMonth, day)) {
            this.errorThrower(2);
        }
        var previousMonthDIM = (function () {
            // The -2 used because -1 due to lib.arrays.monthsDays have 0 index and -1 because we need the previous month.
            if (month - 2 < 0) {
                return lib.arrays.monthsDays[12 + (month - 2)];
            }
            return lib.arrays.monthsDays[month - 2];
        })();
        if (leapYear && month === 3) {
            previousMonthDIM = 29;
        }
        if (operator === '=') {
            return fullMatch;
        }
        if (operator === '+') {
            var newHour = hour = hour + offsetHours;
            if (newHour > 23) {
                var addDays = Math.floor(newHour / 24);
                var remainingHours = hour = newHour % 24;
                var newDay = day = day + addDays;
                if (newDay > daysInMonth) {
                    var newerDay = day = newDay - daysInMonth;
                    var newMonth = month = month + 1;
                    if (newMonth > 12) {
                        var newerMonth = month = 1;
                        var newYear = year = year + 1;
                    }
                }
            }
        }
        if (operator === '-') {
            var newHour = hour = hour - offsetHours;
            if (newHour < 1) {
                newHour = Math.abs(newHour) + 24;
                var decreaseDays = Math.floor(newHour / 24);
                var remainingHours = hour = 24 - (newHour % 24);
                if (newHour === 0) {
                    decreaseDays = 1;
                    remainingHours = hour = 0;
                }
                var newDay = day = day - decreaseDays;
                if (newDay < 1) {
                    var newerDay = day = previousMonthDIM + newDay;
                    var newMonth = month = month - 1;
                    if (newMonth < 1) {
                        var newerMonth = month = 12;
                        var newYear = year = year - 1;
                    }
                }
            }
        }
        var ISO8601 = [year, month, day, hour, minute, second].slice(0);
        var stringedISO8601 = [];
        for (var k in ISO8601) {
            var toStringISO8601 = ISO8601[k].toString();
            stringedISO8601.push(toStringISO8601.length === 1 ? "0" + toStringISO8601 : toStringISO8601);
        }
        return stringedISO8601[0] + '-' +
            stringedISO8601[1] + '-' +
            stringedISO8601[2] + 'T' +
            stringedISO8601[3] + ':' +
            stringedISO8601[4] + ':' +
            stringedISO8601[5];
    };
    ISO8601Localizer.prototype.errorThrower = function (errorCode) {
        switch (errorCode) {
            case 0:
                throw 'Invalid offset supplied, valid offsets are between -11 to 14';
                break;
            case 1:
                throw 'Invalid ISO8601, try something like(case insensitive, T may be t): 2005-06-03T13:04:32';
                break;
            case 2:
                throw 'Non logical date, please check that there are X days in month Y.';
                break;
            default:
                throw 'Unknow error code.';
        }
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
        var RangerInstance = new lib.classes.Ranger();
        var validOffsets = RangerInstance.getRange(-11, 14);
        return validOffsets.indexOf(offset) > -1 ? true : false;
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
