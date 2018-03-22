const path = require('path');
const fs = require('fs');
const {
    fr,
    drawRects,
    getAppdataPath,
    ensureAppdataDirExists
} = require('./commons');

fr.winKillProcessOnExit();
ensureAppdataDirExists();


const trainedModelFile = 'face.json';
const trainedModelFilePath = './appdata';

const dataPath = path.resolve('./img/stiv');
const facesPath = path.resolve('./img/stiv');
//const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']
const classNames = 'stiv';

const detector = fr.FaceDetector();
const recognizer = fr.FaceRecognizer();

if (!fs.existsSync(trainedModelFilePath)) {
    console.log('%s not found, start training recognizer...', trainedModelFile);
    const allFiles = fs.readdirSync(facesPath);
    const imagesByClass = allFiles.map((fp) => fr.loadImage(`./img/stiv/${fp}`));
    recognizer.addFaces(imagesByClass, 'stiv');
    console.log('train end');
    fs.writeFileSync('./appdata/' + trainedModelFile, JSON.stringify(recognizer.serialize()));
} else {
    console.log('found %s, loading model', trainedModelFile);

    recognizer.load(require('./appdata/' + trainedModelFile));

    console.log('imported the following descriptors:');
    console.log(recognizer.getDescriptorState())
}
// До цього модель створенна

const bbtThemeImgs = fs.readdirSync('./img/test-img') .map(fp => fr.loadImage('./img/test-img/'+fp));

bbtThemeImgs.forEach((_img, i) => {
    let img = _img;

    // resize image if too small
    // const minPxSize = 400000;
    // if ((img.cols * img.rows) < minPxSize) {
    //     img = fr.resizeImage(img, minPxSize / (img.cols * img.rows))
    // }

    console.log('detecting faces for query image');
    const faceRects = detector.locateFaces(img).map(res => res.rect);
    const faces = detector.getFacesFromLocations(img, faceRects);

    const win = new fr.ImageWindow();
    win.setImage(img);
    drawRects(win, faceRects);

    // mark faces with distance > 0.6 as unknown
    const unknownThreshold = 0.6;
    faceRects.forEach((rect, i) => {
        const prediction = recognizer.predict(faces[i], unknownThreshold)
        win.addOverlay(rect, `${prediction.className} (${prediction.distance})`)
        console.log(rect);
        console.log(prediction)
        console.log('the end');
    })
});

fr.hitEnterToContinue();