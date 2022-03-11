//require('../style/common.css');
//window.$ = window.jQuery = require('jquery');
//require('bootstrap');
//import Worker from 'worker-loader!./worker.js';
//require('./lib/jimp.min');
//import Jimp from 'jimp';
//import { Module } from 'webpack';
//let watermark = require('../img/watermark.jpg');

//const { resolve } = require("url");

//const { Module } = require("webpack");

//const EventClass = require('./Class/EventClass');
//global.LinkedList = require('./Class/datastructure/LinkedList');

class App
{
    constructor()
    {
        let self = this;
        /*
        WebAssembly.compileStreaming(fetch("./src/wasm/test.wasm")).then(module=>{
            this.Module = module;    
        });
        */
       /*
        this.moduleMemory = new WebAssembly.Memory({initial: 256});

        const importObject = {
            env:{
                __memory_base : 0,
                memory: this.moduleMemory,
            }
        };
        WebAssembly.instantiateStreaming(fetch("./src/wasm/wasmWatermark.wasm"),importObject).then(result=>{
            let result = result.instance.exports.insertWatermark();
            console.log(result);
        })
        */
       //WebAssembly.instantiateStreaming(fetch("./src/wasm/test.wasm"), )
    }
    readFileAndProcess(readfile){
        let self = this;
        let img1;
        let img2;
        let timeNow1;
        let timeNow2;
        let deltaTime;
        var reader = new FileReader();
        reader.addEventListener("load", function(e){
            Jimp.read(e.target.result).then(image=>{
                console.log(image);
                Jimp.read('src/img/watermark.jpg').then(wtImg=>{
                    //console.log(wtImg);
                    timeNow1 = Date.now();
                    let result = self.addWatermark(image, wtImg);
                    timeNow2 = Date.now();
                    deltaTime = timeNow2 - timeNow1;
                    $("#spentTime1").html(deltaTime);
                    
                    Jimp.read(result).then(d=>{
                        d.getBase64Async("image/jpeg").then(data=>{
                            $("#jsResult").attr("src", data);    
                        })
                    })
                   
                    self.readyAssembly().then(()=>{
                        timeNow1 = Date.now();
                        let wResult = self.wasmAddWatermark(image, wtImg);
                        timeNow2 = Date.now();
                        deltaTime = timeNow2 - timeNow1;
                        $("#spentTime2").html(deltaTime);
                        Jimp.read(wResult).then(d=>{
                            d.getBase64Async("image/jpeg").then(asmimage=>{
                                $("#wasmResult").attr("src", asmimage);
                            })
                        })
                    })
                })
            })
            /*
            Jimp.read(e.target.result).then(image=>{
                console.log(image);
                Jimp.read('src/img/watermark.jpg').then(wtImg=>{
                    self.readyAssembly().then(()=>{
                        //const memory = Module.exports.memory;

                        //const resultarray = new Int32Array(memory.buffer, 0, image.bitmap.width*4*image.bitmap.height);
                        timeNow1 = Date.now();
                        let resultImg = self.wasmAddWatermark(image, wtImg);
                        timeNow2 = Date.now();
                        deltaTime = timeNow2 - timeNow1;
                        $("#spentTime2").html(deltaTime);
                        Jimp.read(resultImg).then(t=>{
                            t.getBase64Async("image/jpeg").then(asmimage=>{
                                $("#wasmResult").attr("src", asmimage);
                            })
                        })
                    })
                })
            })

            */
        });
        reader.readAsArrayBuffer(readfile);
    }
    addWatermark(origin, water){
        let oBitmap = origin.bitmap;
        let wBitmap = water.bitmap;
        
        for(let j = 0; j < oBitmap.height; j += wBitmap.height){
            for(let i = 0; i < oBitmap.width; i += wBitmap.width){
                oBitmap = this.addWatermarkOne(oBitmap, wBitmap, i, j)
            }
        }
        //$("#jsResult").attr("src", "data:" + "image/jpeg" + ";base64," + oBitmap.data.toString('base64'));
        return oBitmap;
    }
    addWatermarkOne(oBitmap,wBitmap, x, y){
        //console.log(4*wBitmap.width*wBitmap.height);
        for(let j = 0; j < wBitmap.height; j++){
            for(let i = 0; i < wBitmap.width*4; i=i+4){
                /*
                if(x + (y*wBitmap.width*4 % (wBitmap.width*4)) + i >= oBitmap.width*4){
                    continue;
                }else if((x + y*wBitmap.width*4 + i) / wBitmap.width*4 >= oBitmap.height){
                    continue;
                }
                */
                let baseIndex = x*4 + (y*4*oBitmap.width) + i + j*oBitmap.width*4;
                let wbaseIndex = i + j*wBitmap.width*4;
                oBitmap.data[baseIndex + 0] = oBitmap.data[baseIndex + 0] ^ wBitmap.data[wbaseIndex + 0] ^ wBitmap.data[wbaseIndex + 0] ^ wBitmap.data[wbaseIndex + 0];
                oBitmap.data[baseIndex + 1] = oBitmap.data[baseIndex + 1] ^ wBitmap.data[wbaseIndex + 1] ^ wBitmap.data[wbaseIndex + 1] ^ wBitmap.data[wbaseIndex + 1];
                oBitmap.data[baseIndex + 2] = oBitmap.data[baseIndex + 2] ^ wBitmap.data[wbaseIndex + 2] ^ wBitmap.data[wbaseIndex + 2] ^ wBitmap.data[wbaseIndex + 2];
                oBitmap.data[baseIndex + 3] =  100;
                //console.log(x*4 + (y*4 + oBitmap.width*4) + i + j*oBitmap.width*4 + 3);
            }
        }
        console.log(oBitmap.data.length);
        return oBitmap;
    }
    createPointers(resolve, reject, returnPointers){
        const onSuccess = Module.insertWatermark(function(){
            freePointers(onSuccess, onError);
            resolve();
        }, 'v');
        const onError = Module.insertWatermark(function(errorMessage){
            freePointers(onSuccess, onError);
            reject(Module.UTF8ToString(errorMessage));
        }, 'vi');

        returnPointers.onSuccess = onSuccess;
        returnPointers.onError = onError;
    }
    freePointers(onSuccess, onError){
        Module.removeFunction(onSuccess);
        Module.removeFunction(onError);
    }
    readyAssembly(){
        (async () => {
            const response = await fetch('./src/wasm/wasmwatermark.wasm');
            const buffer = await response.arrayBuffer();
            const module = new WebAssembly.Module(buffer);
            const instance = new WebAssembly.Instance(module);
            console.log(instance);
          })();
          return new Promise((resolve, reject)=>{
            resolve();
          });
        /*
        this.moduleMemory = new WebAssembly.Memory({'initial': 1024*20, 'maximum':65536});
        this.moduleMemory.grow(1024);
        this.tbl = new WebAssembly.Table({initial:1024*500, element:"anyfunc"});
        Module['wasmMemory'] = this.moduleMemory;
        Module['buffer'] = Module['wasmMemory'].buffer;
        const importObject = {
            env:{
                __memory_base : 0,
                memory: this.moduleMemory,
                js: {
                    tbl: this.tbl
                }
            }
        };

        return new Promise(function(resolve, reject){
            WebAssembly.instantiateStreaming(fetch("./src/wasm/wasmwatermark.wasm"),importObject).then(result=>{
                resolve();
            })
        })
        */
    }
    wasmAddWatermark(origin, water){
        let oBitmap = origin.bitmap;
        let wBitmap = water.bitmap;
        
        let result = Module._insertWatermark(origin.bitmap.data,water.bitmap.data,origin.bitmap.width, origin.bitmap.height, water.bitmap.width, water.bitmap.height);
        //$("#jsResult").attr("src", "data:" + "image/jpeg" + ";base64," + oBitmap.data.toString('base64'));
        //origin.bitmap.data = result;
        return origin;
    }

    wasmAddWatermarkOne(oBitmap,wBitmap, x, y){
        //console.log(4*wBitmap.width*wBitmap.height);
        for(let j = 0; j < wBitmap.height; j++){
            for(let i = 0; i < wBitmap.width*4; i=i+4){
                /*
                if(x + (y*wBitmap.width*4 % (wBitmap.width*4)) + i >= oBitmap.width*4){
                    continue;
                }else if((x + y*wBitmap.width*4 + i) / wBitmap.width*4 >= oBitmap.height){
                    continue;
                }
                */
                let baseIndex = x*4 + (y*4*oBitmap.width) + i + j*oBitmap.width*4;
                let wbaseIndex = i + j*wBitmap.width*4;
                oBitmap.data[baseIndex + 0] = Module._xorPixel(oBitmap.data[baseIndex + 0], wBitmap.data[wbaseIndex + 0]); 
                oBitmap.data[baseIndex + 1] = Module._xorPixel(oBitmap.data[baseIndex + 1], wBitmap.data[wbaseIndex + 1]); 
                oBitmap.data[baseIndex + 2] = Module._xorPixel(oBitmap.data[baseIndex + 2], wBitmap.data[wbaseIndex + 2]); 
                oBitmap.data[baseIndex + 3] =  100;
            }
        }
        return oBitmap;
    }
}

window.App = App;