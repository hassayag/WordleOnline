export const randomWord = async () => {
    const words = await readFile('word-data/valid_solutions.csv');

    const randIndex = Math.floor(Math.random() * words.length);

    return words[randIndex];
};

export const readFile = async (fileDir) => {
    let words = [];

    const filePath = path.join(__dirname, '..', fileDir);

    const stream = fs
        .createReadStream(filePath)
        .pipe(parse({ delimiter: ',', from_line: 2 }));

    stream.on('data', function (row) {
        words.push(row[0]);
    });

    // sleep to read file, please make this less jank
    await new Promise((r) => setTimeout(r, 1000));

    return words;
};
