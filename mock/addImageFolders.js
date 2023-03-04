// const fs = require("fs");
// const fsPromises = require("fs").promises;
// const path = require("path");

// const createImageFolders = async () => {
//   try {
//     if (!fs.existsSync(path.join(__dirname, "..", "public", "images"))) {
//       await fsPromises.mkdir(path.join(__dirname, "..", "public", "images"));
//     }
//     if (
//       !fs.existsSync(path.join(__dirname, "..", "public", "images", "products"))
//     ) {
//       await fsPromises.mkdir(
//         path.join(__dirname, "..", "public", "images", "products"),
//       );
//     }
//     if (
//       !fs.existsSync(
//         path.join(__dirname, "..", "public", "images", "products", "small"),
//       )
//     ) {
//       await fsPromises.mkdir(
//         path.join(__dirname, "..", "public", "images", "products", "small"),
//       );
//     }
//     if (
//       !fs.existsSync(
//         path.join(__dirname, "..", "public", "images", "products", "medium"),
//       )
//     ) {
//       await fsPromises.mkdir(
//         path.join(__dirname, "..", "public", "images", "products", "medium"),
//       );
//     }
//     if (
//       !fs.existsSync(
//         path.join(__dirname, "..", "public", "images", "products", "large"),
//       )
//     ) {
//       await fsPromises.mkdir(
//         path.join(__dirname, "..", "public", "images", "products", "large"),
//       );
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports = createImageFolders;
