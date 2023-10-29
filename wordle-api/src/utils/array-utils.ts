export function findAllInds(array, val) {
    const matchedInds = [];

    for (let i = 0; i < array.length; i++) {
        if (array[i] === val) {
            matchedInds.push(i);
        }
    }

    return matchedInds;
}
