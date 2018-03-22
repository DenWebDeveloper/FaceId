const path = require('path');
const fs = require('fs');
const fr = require('face-recognition');

const dataPath = path.resolve('./img/stiv');
const classNames = ['stiv'];
const allFiles = fs.readdirSync(dataPath);
const imagesByClass = classNames.map(c =>
    allFiles
        .filter(f => f.includes(c))
        .map(f => path.join(dataPath, f))
        .map(fp => fr.loadImage(fp))
);

const numTrainingFaces = 10;
const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, numTrainingFaces));
const testDataByClass = imagesByClass.map(imgs => imgs.slice(numTrainingFaces));

const image = fr.loadImage('./img/stiv77.jpg');
const detector = fr.FaceDetector();
const targetSize = 150;
const faceImages = detector.detectFaces(image, targetSize);
faceImages.forEach((img, i) => fr.saveImage(img, `face_${i}.png`));


const recognizer = fr.FaceRecognizer();

trainDataByClass.forEach((faces, label) => {
    const name = classNames;
    recognizer.addFaces(faces, name)
});

const modelState = recognizer.serialize();
fs.writeFileSync('model.json', JSON.stringify(modelState));

const errors = classNames.map(_ => [])
testDataByClass.forEach((faces, label) => {
    const name = classNames[label]
    console.log();
    console.log('testing %s', name)
    faces.forEach((face, i) => {
        const prediction = recognizer.predictBest(face)
        console.log('%s (%s)', prediction.className, prediction.distance)

        // count number of wrong classifications
        if (prediction.className !== name) {
            errors[label] = errors[label] + 1
        }
    })
})

// print the result
const result = classNames.map((className, label) => {
    const numTestFaces = testDataByClass[label].length
    const numCorrect = numTestFaces - errors[label].length
    const accuracy = parseInt((numCorrect / numTestFaces) * 10000) / 100
    return `${className} ( ${accuracy}% ) : ${numCorrect} of ${numTestFaces} faces have been recognized correctly`
})
console.log('result:');
console.log(result);