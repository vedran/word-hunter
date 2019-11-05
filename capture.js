const cv = require('opencv4nodejs');
const fs = require('fs');

const BoardSVM = require("./svm");

const vc = new cv.VideoCapture(0);

//const svm = new BoardSVM();

let start = new Date().valueOf();
let counter = 0;

while (true) {
  const img = vc.read().rotate(cv.ROTATE_180);
  //const img = cv.imread("data/raw/23.jpg");
  const gray = img.cvtColor(cv.COLOR_RGB2GRAY);
  const binary = gray.threshold(165, 255, cv.THRESH_BINARY);
  const edges = binary.canny(180, 220, 3);

  const mode = cv.RETR_TREE;
  const method = cv.CHAIN_APPROX_NONE;

  const contours = edges.findContours(mode, method)
    .filter(c => !c.isConvex)
    .filter(c => {
      const perimeter = c.arcLength(true);
      const approx = c.approxPolyDP(0.02 * perimeter, true);
      const isRect = approx.length === 4;

      if (!isRect) return false;

      const bbox = c.minAreaRect();
      const ratio = bbox.size.width / bbox.size.height;

      if (c.hierarchy.x === -1) {
        return false;
      }

      if (ratio < 0.85 || ratio > 1.15) {
        return false;
      }

      if (c.area < 40) {
        return false;
      }

      return true;
    })

  const contourPoints = contours.map(c => c.getPoints())

  img.drawContours(contourPoints, -1, new cv.Vec(0, 0, 255), { thickness: 2 })
  
  contours.forEach((c, i) => {
    let tileRect = c.boundingRect().pad(0.9);
    const roi = gray.getRegion(tileRect);
    const resized = roi.resize(30, 30);
    cv.imwrite(`./data/training/raw/${start}_${counter}.png`, resized)
    counter += 1;
    cv.imshow("capture", roi);
    cv.waitKey(100);
  })
}
