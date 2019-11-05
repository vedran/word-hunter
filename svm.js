const cv = require('opencv4nodejs');
const fs = require('fs');

class BoardSVM {
  constructor() {
    this.hog = new cv.HOGDescriptor({
      winSize: new cv.Size(30, 30),
      blockSize: new cv.Size(10, 10),
      blockStride: new cv.Size(10, 10),
      cellSize: new cv.Size(5, 5),
      L2HysThreshold: 0.2,
      nbins: 24,
      gammaCorrection: true,
      signedGradient: true
    });

    if (fs.existsSync("./svm.sav")) {
      this.svm = new cv.SVM();
      this.svm.load("./svm.sav");
    } else {
      this.trainAndSave();
    }
  }

  trainAndSave() {
    this.svm = new cv.SVM({
      kernelType: cv.ml.SVM.RBF,
      c: 12.5,
      gamma: 0.50625
    });

    // a - z, skipping j and z
    const letters = Array(26).fill(97).map((v, i) => v + i).map(ascii => String.fromCharCode(ascii));

    const samples = []
    const labels = []

    letters.forEach(letter => {
      const trainingPath = `data/training/${letter}/`;
      const files = fs.readdirSync(trainingPath).map(file => `${trainingPath}${file}`).filter(f => f.endsWith(".png"))

      files.forEach((file, i) => {
        if (i > 100) {
          return;
        }

        const img = cv.imread(file);
        const gray = img.cvtColor(cv.COLOR_RGB2GRAY)
        const desc = this.hog.compute(gray);

        if (!desc) {
          return;
        }

        samples.push(desc);
        labels.push(letter.charCodeAt(0))
      })
    })

    const trainData = new cv.TrainData(
      new cv.Mat(samples, cv.CV_32F),
      cv.ml.ROW_SAMPLE,
      new cv.Mat([labels], cv.CV_32S)
    );

    this.svm.train(trainData);
    this.svm.save(`./svm.sav`);
  }

  predict(mat) {
    let gray = mat;

    if (mat.channels > 1) {
      gray = mat.cvtColor(cv.COLOR_RGB2GRAY)
    }

    const predictHog = this.hog.compute(gray)

    return String.fromCharCode(this.svm.predict(predictHog));
  }
}

module.exports = BoardSVM;