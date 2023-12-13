const validateArray = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error("Not an array", arr);
    }
}

export const doesHaveConflict = function (slotsArray, newSlot) {
    validateArray(slotsArray);

    for (const slot of slotsArray) {
        if (newSlot[0] <= slot[0] && slot[0] <= newSlot[1]) {
            return true;
        }

        if (newSlot[0] <= slot[1] && slot[1] <= newSlot[1]) {
            return true;
        }
    }

    return false;
}

export const partition = function (array, partitionCb) {
    validateArray(array);
    const yes = [], no = [];

    for (let idx = 0; idx < array.length; idx++) {
        partitionCb(array[idx], idx, array)
            ? yes.push(array[idx])
            : no.push(array[idx]);
    }

    return { yes, no };
}

export const sortArrayCurried = function (compatorFn) {
    return function (array) {
        validateArray(array);
        const resultArray = [...array];
        resultArray.sort(compatorFn);
        return resultArray;
    }
}

export const findIntersection = function (array1, array2, comparatorFn) {
    validateArray(array1);
    validateArray(array2);

    comparatorFn ??= ((a, b) => { return a === b });

    return array1.filter(value1 => {
        return array2.some((value2) => comparatorFn(value1, value2));
    })
}

export const findDiff = function (array1, array2, comparatorFn) {
    validateArray(array1);
    validateArray(array2);

    comparatorFn ??= ((a, b) => { return a === b });

    return array1.filter(value1 => {
        return !array2.some((value2) => comparatorFn(value1, value2));
    })
}