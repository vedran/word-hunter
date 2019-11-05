const fs = require('fs');
const cv = require('opencv4nodejs');

const files = fs.readdirSync("./data/training/raw/")
  .filter(f => f.endsWith(".png"))
  .sort()

files.map(file => {
  console.log(file);
  cv.imshow("img", cv.imread(`./data/training/raw/${file}`));
  cv.waitKey(200);
  const key = cv.waitKey();

  if(key < 97 || key > 122) {
    return;
  }

  const letter = String.fromCharCode(key)
  fs.rename(`./data/training/raw/${file}`, `./data/training/${letter}/${file}`, () => { })
})