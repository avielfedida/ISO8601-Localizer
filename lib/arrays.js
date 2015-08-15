var arrays;
(function (arrays) {
    arrays.returnAsTypes = [
        'string',
        'object'
    ];
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
        31 // December
    ];
    arrays.floatingPointOffsets = [
        -9.3,
        -4.3,
        -3.3,
        3.3,
        4.3,
        5.3,
        5.45,
        6.3,
        8.45,
        9.3,
        10.3,
        11.3,
        12.45
    ];
})(arrays || (arrays = {}));
module.exports = arrays;
