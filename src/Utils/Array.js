export const doesHaveConflict = function (slotsArray, newSlot) {

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
        const resultArray = [...array];
        resultArray.sort(compatorFn);
        return resultArray;
    }
}