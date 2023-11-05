import { Letter } from '../types';

export const parseRow = (rowObj: Letter[]) => {
    const letters = Object.values(rowObj).map((obj) => obj.key);

    return letters.join('');
};
