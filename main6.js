const path = require('path');
const fs = require('fs');
const fr = require('face-recognition');
const detector = fr.FaceDetector();
const recognizer = fr.FaceRecognizer();

const dataPath = path.resolve('./data/faces2');

const allFiles = fs.readdirSync(dataPath);

function train(name) {
    const classNames = [`${name}`];
    const images = classNames.map(c =>
        allFiles
            .filter(f => f.includes(c))
            .map(f => path.join(dataPath, f))
            .map(fp => fr.loadImage(fp))
    );

    const targetSize = 150;
    const faceImages = images.map(arrayImgs => {
            return arrayImgs.map(img => {
                return detector.detectFaces(img, targetSize);
            });
        }
    );

    const imgsFaces = faceImages[0].filter((img, i) => {
        if (img.length !== 0) {
            const _img = img[0] || img;
            fr.saveImage(`./cut_img/face_${i}.png`, _img);
            return img
        }
    });

    imgsFaces.forEach((faces) => {
        if (faces.length === 0) return;
        const name = classNames[0];
        recognizer.addFaces(faces, name)
    });

}

train('raj');
train('stiv');

fs.writeFileSync('./appdata/face.json', JSON.stringify(recognizer.serialize()));

