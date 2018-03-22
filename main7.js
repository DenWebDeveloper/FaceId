const modelState = require('./appdata/face.json');
const path = require('path');
const fs = require('fs');
const fr = require('face-recognition');
const detector = fr.FaceDetector();
const recognizer = fr.FaceRecognizer();
recognizer.load(modelState);

const {
    drawRects
} = require('./commons');



const img =  fr.loadImage('./img/stiv/stiv4.jpg');
console.log('detecting faces for query image');
const faceRects = detector.locateFaces(img).map(res => res.rect);
const faces = detector.getFacesFromLocations(img, faceRects, 150);
const win = new fr.ImageWindow();
win.setImage(img);
drawRects(win, faceRects);
const unknownThreshold = 0.6;
faceRects.forEach((rect, i) => {
        const prediction = recognizer.predictBest(faces[i], unknownThreshold);
        win.addOverlay(rect, `${prediction.className} (${prediction.distance})`);
        console.log(rect);
        console.log(prediction)
    });

// bbtThemeImgs.forEach((_img, i) => {
//     let img = _img
//
//     // resize image if too small
//     const minPxSize = 400000
//     if ((img.cols * img.rows) < minPxSize) {
//         img = fr.resizeImage(img, minPxSize / (img.cols * img.rows))
//     }
//
//     console.log('detecting faces for query image')
//     const faceRects = detector.locateFaces(img).map(res => res.rect)
//     const faces = detector.getFacesFromLocations(img, faceRects, 150)
//
//     const win = new fr.ImageWindow()
//     win.setImage(img)
//     drawRects(win, faceRects)
//
//     // mark faces with distance > 0.6 as unknown
//     const unknownThreshold = 0.6
//     faceRects.forEach((rect, i) => {
//         const prediction = recognizer.predictBest(faces[i], unknownThreshold)
//         win.addOverlay(rect, `${prediction.className} (${prediction.distance})`)
//         console.log(rect)
//         console.log(prediction)
//     })
// })
fr.hitEnterToContinue();