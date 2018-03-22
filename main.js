const path = require('path');
const fs = require('fs');
const {
    fr,
    drawRects,
    rescaleRect
} = require('./commons');


const loadImg = fr.loadImage('img/test2.jpg'); // Завантажуєм картинку
const loadImgBig = fr.pyramidUp(loadImg);   // Збільшуєм картинку
const detector = new fr.FrontalFaceDetector();
const faceRects = detector.detect(loadImgBig); // Виділяєм лиця Тут зберігаються координати для малювання
const imgFaceRects = faceRects.map(rect => rescaleRect(rect, 0.5)); // Повертаєм до вихідного зображення

// const win = new fr.ImageWindow();
// win.setImage(loadImg);
// drawRects(win, imgFaceRects);
// fr.hitEnterToContinue();

// arrays of face images, (use FaceDetector to detect and extract faces)
const recognizer = fr.FaceRecognizer();
const stivFace = [];

const numJitters = 15;
recognizer.addFaces(stivFaces, 'stiv');
const predictions = recognizer.predict(stivFace);
console.log(predictions);
const modelState = recognizer.serialize()
fs.writeFileSync('model.json', JSON.stringify(modelState));
