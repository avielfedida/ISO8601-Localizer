/// <reference path="typings/tsd.d.ts" />

import interfaces = require('./lib/interfaces');
import arrays = require('./lib/arrays');
import classes = require('./lib/classes');

export = ISO8601Localizer;

class ISO8601Localizer implements interfaces.localizer {

    private userOffset: number;

    private userISO8601: string;

    // Partially Stricted(no ^ and $): 2013-01-05T04:13:00
    private ISO8601Pattern: RegExp = /(\d{4})-([0-1][0-9])-([0-3][0-9])T([0-2][0-9]):([0-5][0-9]):([0-5][0-9])/;

    public constructor( userISO8601: string ) {

        this.userISO8601 = userISO8601;
        this.userOffset = new Date().getTimezoneOffset() / -60;

    }

    public to(offset: number): interfaces.localizer {

      if( ! this.validOffset(offset)) {
        this.errorThrower(0);
      };

      this.userOffset = offset;

      return this;

    }

    // There are few variables set here for clarification and never used such as: newerDay, newerMonth and newYear.
    public localize(): string {

        let upperCaseISO8601 = this.userISO8601.toUpperCase();

        if( ! this.isValid(upperCaseISO8601) ) {

          this.errorThrower(1);

        }

        let { offsetHours,  operator } = this.getOffset();

        let matchStrings: string[] = upperCaseISO8601.match(this.ISO8601Pattern);

        let fullMatch = matchStrings.shift();

        let matchNumbers: number[] = matchStrings.map(function( val ) {

            return parseInt(val);

        });

        let [ year, month, day, hour, minute, second ]: number[] = matchNumbers;

        let leapYear: boolean = this.isLeapYear( year );

        // -1 is because arrays.monthsDays have 0 index.
        let daysInMonth = arrays.monthsDays[month - 1];

        if(leapYear && month === 2) { // 2 === Feb, On Feb while leap year, there are 29 days and not 28

            daysInMonth = 29; // daysInMonth = 29 instead of daysInMonth++ is used for expressivity.

        }

        if( ! this.isLogical(daysInMonth, day)) {

          this.errorThrower(2);

        }

        // DIM stands for days in month, its use is explained inside the operator === '-' if statement.
        let previousMonthDIM = (function() {

            // The -2 used because -1 due to arrays.monthsDays have 0 index and -1 because we need the previous month.

            if(month - 2 < 0) {

                return arrays.monthsDays[ 12 + ( month - 2 ) ];

            }

            return arrays.monthsDays[ month - 2 ];

        })();

        if(leapYear && month === 3) { // 3 === Feb, previous month is Feb, On Feb while leap year, there are 29 days and not 28

            previousMonthDIM = 29; // daysInMonth = 29 instead of daysInMonth++ is used for expressivity.

        }

        if(operator === '=') {

            return fullMatch;

        }

        if(operator === '+') {

            let newHour = hour = hour + offsetHours;                     // ---------- Final(maybe)

            if(newHour > 23) {

                let addDays = Math.floor( newHour / 24 );
                let remainingHours = hour = newHour % 24;               // ---------- Final
                let newDay = day = day + addDays;                       // ---------- Final(maybe)

                if(newDay > daysInMonth) {

                    let newerDay = day = newDay - daysInMonth;           // ---------- Final
                    let newMonth = month = month + 1;                    // ---------- Final(maybe)

                    if(newMonth > 12) {

                        let newerMonth = month = 1;                       // ---------- Final
                        let newYear = year = year + 1;                    // ---------- Final

                    }

                }

            }

        }

        if(operator === '-') {

            let newHour = hour = hour - offsetHours;                      // ---------- Final(maybe)

            if(newHour < 1) {

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
                newHour = Math.abs( newHour ) + 24;

                let decreaseDays = Math.floor( newHour / 24 );

                let remainingHours = hour = 24 - ( newHour % 24 );   // ---------- Final(maybe)

                if(newHour === 0) {

                    decreaseDays = 1;

                    /*
                    When newHour % 24 equals 0, 24 - 0 is 24, so when newHour equals 0, I set the hour
                    to 0, for now there is no need to set remainingHours, but I want both variables to have
                    the same values, maybe it will help later.
                    */
                    remainingHours = hour = 0;                       // ---------- Final

                }

                let newDay = day = day - decreaseDays;                // ---------- Final(maybe)

                /*
                This if statement is very special, if newDay is smaller than 1, then it set the
                newerDay and the day to be..... previousMonthDIM + newDay and not newDay - daysInMonth.
                The + and not - is because newDay may be negative, previousMonthDIM and not daysInMonth
                because we decrease days but from the maximum number of days of the previous month, remember
                when operator equals '-' we going backwards.

                When newDay equals 0, no days will be decreased from the previous month max days.
                */
                if(newDay < 1) {

                    let newerDay = day = previousMonthDIM + newDay;    // ---------- Final
                    let newMonth = month = month - 1;                  // ---------- Final(maybe)

                    if(newMonth < 1) {

                        let newerMonth = month = 12;                   // ---------- Final
                        let newYear = year = year - 1;                 // ---------- Final

                    }

                }

            }

        }

        let [...ISO8601]: number[] = [year, month, day, hour, minute, second];
        let stringedISO8601: string[]  = [];

        for(let k in ISO8601) {

            let toStringISO8601 = ISO8601[k].toString();

            stringedISO8601.push(toStringISO8601.length === 1 ? "0" + toStringISO8601 : toStringISO8601);

        }

        return  stringedISO8601[0] + '-' +
                stringedISO8601[1] + '-' +
                stringedISO8601[2] + 'T' +
                stringedISO8601[3] + ':' +
                stringedISO8601[4] + ':' +
                stringedISO8601[5];

    }

    // I removed the break statements below due to the throw statements(the break will never be reached).
    private errorThrower(errorCode: number): void {

      switch(errorCode) {

        case 0:

          throw 'Invalid offset supplied, valid offsets are between -11 to 14';

        case 1:

          throw 'Invalid ISO8601, try something like(case insensitive, T may be t): 2005-06-03T13:04:32';

        case 2:

          throw 'Non logical date, please check that there are X days in month Y.';

        default:

          throw 'Unknow error code.';

      }

    }

    private isLogical(maxDays: number, day: number): boolean {

        return day <= maxDays;

    }

    private getOffset(): interfaces.offsetObject {

        let offset = this.userOffset;

        return {

            operator: (function() {

                if(offset > 0) {

                    return '+';

                } else if(offset < 0) {

                    return '-';

                } else {

                    return '=';

                }

            })(),

            offsetHours: Math.abs(offset)

        };

    }

    private validOffset(offset: number): boolean {

      let RangerInstance = new classes.Ranger();
      let validOffsets: Array<number> = RangerInstance.getRange(-11, 14);

      return ( validOffsets.indexOf(offset) > -1 ) ? true : false;

    }

    private isValid( maybeValid: string ): boolean {

        return this.ISO8601Pattern.test( maybeValid );

    }

    private isLeapYear( year: number ): boolean {

        /*
        Mathisfun(https://www.mathsisfun.com/leap-years.html):

        "
        Leap Years are any year that can be evenly divided by 4 (such as 2012, 2016, etc),
        except if it can can be evenly divided by 100, then it isn't (such as 2100, 2200, etc),
        except if it can be evenly divided by 400, then it is (such as 2000, 2400).
        "
        */

        return (

                (year % 4 === 0 && year % 100 !== 0)

                ||

                (year % 4 === 0 && year % 100 === 0 && year % 400 === 0)

                );

    }

}
