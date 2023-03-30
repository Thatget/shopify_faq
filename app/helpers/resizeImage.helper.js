// const sharp = require('sharp');
// // const uuidv4 = require('uuid/v4');
// const { v4: uuidv4 } = require('uuid');
// const path = require('path');

// class resize {
//     constructor(folder) {
//         this.folder = folder;
//     }
//     async save(buffer) {
//         const filename = resize.filename();
//         const filepath = this.filepath(filename);

//         await sharp(buffer)
//             // .resize(300, 300, {
//             //     fit: sharp.fit.inside,
//             //     withoutEnlargement: true
//             // })
//             .toFile(filepath);

//         return filename;
//     }
//     static filename() {
//         return `${uuidv4()}.png`;
//     }
//     filepath(filename) {
//         return path.resolve(`${this.folder}/${filename}`)
//     }
// }
// module.exports = resize;