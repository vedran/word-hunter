const cv = require('opencv4nodejs');
const fs = require('fs');

const BoardSVM = require("./svm");
const vc = new cv.VideoCapture(0);
const svm = new BoardSVM();

const testPath = `data/test/`;
const testFiles = fs.readdirSync(testPath).map(file => `${testPath}${file}`);
testFiles.forEach(testFile => {
  if (!testFile.endsWith(".png")) return;

  console.log(testFile);
  const mat = cv.imread(testFile);
  const prediction = svm.predict(mat);

  console.log(`Test file: ${testFile} -> Prediction: ${prediction}`);
  //cv.imshow("test", mat);
  //cv.waitKey();
})