const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

// line 41: callback passed in because I need to be using it somewhere else in the code block;

exports.getNextUniqueId = (callback) => {
  // first readFile to get current ID/counter;
  // then add 1 to current ID/counter;
  // write the new uniqID to the counterFile;

  // VERSION 1:
  // readCounter((error, counter) => {
  //   if (error) {
  //     callback(null, 0)  // better than throw error;
  //   }
  //   else {
  //     counter = counter + 1;
  //     writeCounter(counter, (error, id) => {
  //       if (error) throw error;
  //       else {
  //         callback(null, id)
  //       }
  //     })
  //   }
  // });

  // return zeroPaddedNumber(counter);  // <--- using this line at writeCounter()

  // VERSION 2:
  readCounter((error, value) => {
    writeCounter(value + 1, (error, ID) => {
      callback(error, ID);
    });
  });

  // VERSION 3:
  // readCounter((error, value) => {
  //   writeCounter(value + 1, callback);
  // });
};

// what is the test doing,
// what is the output / input
// what are the expectations from the test
// observation in glearn, read the fucking prompt!


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
