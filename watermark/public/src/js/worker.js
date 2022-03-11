import Jimp from './lib/jimp.min.js';

self.addEventListener('message', e => {
   Jimp.read(e.data).then(image => {
    self.postMessage("excuted worker");
  });
});

function addWatermark(target, watermark){
    let targetBitmap = target.bitmap;
    let wtBitmap = watermark.bitmap;
    for(let i = 0; i < targetBitmap.width; i++){
        for(let j = 0; j < targetBitmap.height; j++){
            
        }
    }
}