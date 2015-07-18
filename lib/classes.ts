module classes {

	export class Ranger {

    public getRange(start: number, end: number): Array<number> {

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

      var notBothNegativeTmp = null,
          bothNegativeTmp = null,
          bothNegativeFlag: boolean = false,
          retArray: Array<number> = [];

      if(start < 0 && end < 0) {

          start = Math.abs(start);

          end = Math.abs(end);

          bothNegativeFlag = true;

          // For cases like: (-7, -5)
          if(start > end) {

              bothNegativeTmp = end;

              end = start;

              start = bothNegativeTmp;

          } // Else, for cases like: (-5, -7), (-7, -7)

      } else {

        // For cases like: (7, 5), (5, -7)
        if(start > end) {

          notBothNegativeTmp = end;

          end = start;

          start = notBothNegativeTmp;

        } // Else, for cases like: (5, 7), (7, 7), (7, 7), (-7, 5)

      }

      for(let i = start; i <= end; i++) {

        if(bothNegativeFlag) {

           retArray.push(-i);

        } else {

           retArray.push(i);

        }

      }

      return retArray;

    }

  }

}
