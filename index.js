//importing the files
const eco = require("./lib/Meme");
/**
  * @param {string} token | Mongo URL string}
  * returns {Economy Class}
 */
function MongoEco(token) {
    return new eco(token);
}
//add Options to it
MongoEco.eco = eco;
MongoEco.version = require("./package.json").version;

//exporting this meme
module.exports = MongoEco;