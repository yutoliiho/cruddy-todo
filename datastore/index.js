const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  // REFACTOR OF ABOVE CODE:
  counter.getNextUniqueId((err, id) => {
    var pathName = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(pathName, text, (err) => {
      if (err) {
        callback(err);
        // callback(null, 0);
      }
      else {
        callback(null, { id, text });
      }
    })
  })
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  // REFACTOR OF ABOVE CODE:

  // read contents of all files with fs.readdir();
  // fs.readdir( path, options, callback )

  // JOSH's CALLBACK REFACTOR:
  // var all = _.map(files, (file) => {
  //   var id = path.basename(file, '.txt');
  //   var path = path.join(exports.dataDir, file);

  // })

  // CALLBACK REFACTOR: (WORKING CODE)
  var allFilesArr = [];
  var pathName = exports.dataDir;
  fs.readdir(pathName, (err, files) => {
    if (err) {
      callback(null, 0);
    } else {
      // console.log('49 ', files)
      files.forEach(el => allFilesArr.push({
        id: el.slice(0, 5), text: el.slice(0, 5)
      }))
      callback(null, allFilesArr)
    }
  })

  // PROMISE REFACTOR
  // var allFilesArr = [];
  // var pathName = exports.dataDir;
  // return new Promise(())
};

exports.readAllAsync = Promise.promisify(exports.readAll)



exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

  // REFACTOR OF ABOVE CODE:
  // use fs.readFile(pathName, callback)
  // passin the one file that I want to read into the callback, so people can usee it in the future.

  var pathName = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(pathName, (error, text) => {
    if (error) {
      callback(error);
    } else {
      callback(null, { id: id, text: text.toString() });
    }
  })
};

// const updateAnimal = (animal, number, callback) => {
//   // getAnimal:
//   // allAnimal => {cat: 1, dog: 2}
//   // updateAnimal => {cat: 10, dog: 2}
//   allAnimal((err, animals) => {
//     if (err) {
//       callback(err);
//     } else {
//       fs.writeFile(pathName, number, (error, animals) => {
//         if (error) {
//           callback(null, 0)
//         } else {
//           var newAnimal = { animals.animal: number }
//           callback(null, newAnimal);
//         }
//       })
//     }
//   })

//   // writeFile
// }


exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  //console.log('Before work: ', text);

  // REFACTOR OF ABOVE CODE:
  var pathName = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(pathName, 'utf-8', (error, oldText) => {
    //console.log('This is the old text: ', oldText);
    if (error) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(pathName, text, (error) => {
        if (error) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          // console.log(id);
          // console.log(text);
          callback(null, { id: id, text: text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

  // REFACTOR OF ABOVE CODE:
  var pathName = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(pathName, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
