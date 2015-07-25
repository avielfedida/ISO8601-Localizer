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
})(classes || (classes = {}));
module.exports = classes;
