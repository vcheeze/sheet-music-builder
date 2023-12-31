# Sheet Music Builder

A simple Node.js CLI to help generate sheet music for our weekly gatherings.

## Notes

Since our sheet music lives in Dropbox, we have to create an App on Dropbox's App Console in order to generate an API token that can access the files and their metadata. For some reason, the token expires quite regularly (several times a day). Exploring a longer-term auth option is on the cards.

My Dropbox app can be accessed [here](https://www.dropbox.com/developers/apps/info/bju8zn6yfjjbw0s#settings), but only by me :P

The [Dropbox HTTP documentation](https://www.dropbox.com/developers/documentation/http/documentation#files-search) is also helpful.

## Roadmap

- Create file naming convention and udpate Dropbox folders and files to follow suit
- Explore and see if there are ways to integrate Dropbox with Notion so that, while creating an Order of Service, the song names can be chosen from what exists on Dropbox to ensure they are synced
- Use TypeScript with [ts-node](https://www.npmjs.com/package/ts-node) because writing pure Vanilla JavaScript without type safety makes me panic a little inside

## Libraries Used

- [pdf2json](https://www.npmjs.com/package/pdf2json) for reading PDF content
- [PDF-LIB](https://pdf-lib.js.org/) for [merging PDFs](https://github.com/Hopding/pdf-lib/issues/252)
- [chalk](https://www.npmjs.com/package/chalk) and [boxen](https://www.npmjs.com/package/boxen) for pretty terminal messages
- [Fuse.js](https://fusejs.io/) for fuzzy search
- [inquirer](https://www.npmjs.com/package/inquirer) for prompts and questions
- [lodash](https://lodash.com/docs/4.17.15#merge) for their single `merge` function that I am too lazy to write myself
