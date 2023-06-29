import inquirer from 'inquirer';

export const getSongTitles = async (pdfParser) => {
  // get text from PDF
  const rawText = pdfParser.getRawTextContent();
  const textArray = rawText.split('\r\n');
  // parse array and remove unlikely candidates for song names
  const startIndex = textArray.findLastIndex(
    (txt) => txt.toLowerCase().includes('song') // TODO modify this to use regex for 'Song {number}', otherwise song names containing the word "song" will make this fail
  );
  const endIndex = textArray.findIndex((txt) => txt.includes('@'));
  // extract song name candidates (basically the right column on Notion)
  const songCandidates = textArray.slice(startIndex + 1, endIndex);
  // prompt user to choose the actual songs
  const { songs } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'songs',
      message: "Pick the songs you'd like to include: ",
      choices: songCandidates,
      loop: false,
    },
  ]);
  return songs;
};
