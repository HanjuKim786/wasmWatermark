var pinchCenterX = 0;
var pinchCenterY = 0;

var zoomTransformOriginX = 0;
var zoomTransformOriginY = 0;

var panTranslateX = 0;
var panTranslateY = 0;

var scale = 1.0;

var distanceOfPinch = 0;
var initialCenter = {x:0,y:0};
var destCenter = {x:0, y:0};
var currentCenter = {x:0, y:0};
var pinchAnimFactor = 0;

$(".cp_innerzone img").on("touchstart",(e)=>{
    e.preventDefault();
    //console.log(e);
    if(e.touches.length == 2){
        let top = parseInt($(".cp_innerzone img").css("top"));
        let left = parseInt($(".cp_innerzone img").css("left"));
        let width = parseInt($(".cp_innerzone img").css("width"));
        let height = parseInt($(".cp_innerzone img").css("height"));
        let bottom = top + height;
        let right = left + width;

        let imgCenterX = (right - left) / 2;
        let imgCenterY = (bottom - top) / 2;
        
        distanceOfPinch = distance(e.touches[0].clientX,e.touches[0].clientY,e.touches[1].clientX,e.touches[1].clientY);
        if(destCenter.x == 0){
            initialCenter.x = (e.touches[0].clientX + e.touches[1].clientX)/2;
            initialCenter.y = (e.touches[0].clientY + e.touches[1].clientY)/2;
            destCenter.x = initialCenter.x;
            destCenter.y = initialCenter.y;
        }else{
            destCenter.x = (e.touches[0].clientX + e.touches[1].clientX)/2;
            destCenter.y = (e.touches[0].clientY + e.touches[1].clientY)/2;
        }
        currentCenter.x = initialCenter.x;
        currentCenter.y = initialCenter.y;
        pinchAnimFactor = 0;
        
        let deltaX = imgCenterX - (e.touches[0].clientX + e.touches[1].clientX)/2
        let deltaY = imgCenterY - (e.touches[0].clientY + e.touches[1].clientY)/2
    
        //zoomTransformOriginX -= deltaX;
        //zoomTransformOriginY -= deltaY;
        zoomTransformOriginX = currentCenter.x;
        zoomTransformOriginY = currentCenter.y;
    }
});
$(".cp_innerzone img").on("touchmove",(e)=>{
    e.preventDefault();
    
    if(e.touches.length == 2){
        //console.log(e);
        //pinch move
        let top = parseInt($(".cp_innerzone img").css("top"));
        let left = parseInt($(".cp_innerzone img").css("left"));
        let width = parseInt($(".cp_innerzone img").css("width"));
        let height = parseInt($(".cp_innerzone img").css("height"));
        let bottom = top + height;
        let right = left + width;

        let imgCenterX = (right - left) / 2;
        let imgCenterY = (bottom - top) / 2;

        let deltaX = imgCenterX - ((e.touches[0].clientX + e.touches[1].clientX)/2) - width;
        let deltaY = imgCenterY - ((e.touches[0].clientY + e.touches[1].clientY)/2) - height;
        
        //panTranslateX += deltaX * 0.005;
        //panTranslateY += deltaY * 0.005;


        let currentDistance = distance(e.touches[0].clientX,e.touches[0].clientY,e.touches[1].clientX,e.touches[1].clientY);
        let centerPointX = (e.touches[0].clientX + e.touches[1].clientX)/2;
        let centerPointY = (e.touches[0].clientY + e.touches[1].clientY)/2;
        if(currentDistance > distanceOfPinch){
            console.log(e);
            //pinchout
            if(scale < 2.0)
                scale += 0.01;
            if(pinchAnimFactor < 1.0)
                pinchAnimFactor += 0.005;
            //zoomTransformOriginX /= scale;
            //zoomTransformOriginY /= scale;

            //panTranslateX *= scale;
            //$(".cp_innerzone img").css("left", panTranslateX + "px");
            //panTranslateX /= scale;

            //panTranslateY *= scale;
            //$(".cp_innerzone img").css("top", panTranslateY + "px");
            //panTranslateY /= scale;

            currentCenter.x = (initialCenter.x*(1.0 - pinchAnimFactor) + destCenter.x*pinchAnimFactor);
            currentCenter.y = (initialCenter.y*(1.0 - pinchAnimFactor) + destCenter.y*pinchAnimFactor);

            zoomTransformOriginX = currentCenter.x;
            zoomTransformOriginY = currentCenter.y;

            $(".cp_innerzone").css("transform-origin", zoomTransformOriginX + "px " + zoomTransformOriginY + "px");
            $(".cp_innerzone").css("transform", "scale3d(" + scale + ", " + scale + ", 1)");

            //zoomTransformOriginX *= scale;
            //zoomTransformOriginY *= scale;
        }else{
            console.log(e);
            //pinchin
            if(scale > 1.0)
                scale -= 0.01;
            if(pinchAnimFactor < 1.0)
                pinchAnimFactor += 0.005;
            //zoomTransformOriginX /= scale;
            //zoomTransformOriginY /= scale;

            //panTranslateX *= scale;
            //$(".cp_innerzone img").css("left", panTranslateX + "px");
            //panTranslateX /= scale;

            //panTranslateY *= scale;
            //$(".cp_innerzone img").css("top", panTranslateY + "px");
            //panTranslateY /= scale;

            currentCenter.x = (initialCenter.x*(1.0 - pinchAnimFactor) + destCenter.x*pinchAnimFactor);
            currentCenter.y = (initialCenter.y*(1.0 - pinchAnimFactor) + destCenter.y*pinchAnimFactor);

            zoomTransformOriginX = currentCenter.x;
            zoomTransformOriginY = currentCenter.y;

            $(".cp_innerzone").css("transform-origin", zoomTransformOriginX + "px " + zoomTransformOriginY + "px");
            $(".cp_innerzone").css("transform", "scale3d(" + scale + ", " + scale + ", 1)");

            //zoomTransformOriginX *= scale;
            //zoomTransformOriginY *= scale;
        }
        distanceOfPinch = currentDistance;
    }
});
$(".cp_innerzone img").on("touchend",(e)=>{
    e.preventDefault();
    //console.log(e);
    if(e.touches.length <= 2){
        initialCenter = currentCenter;
        pinchAnimFactor = 0.0;
    }
});

function distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1 - x2,2) + Math.pow(y1 - y2, 2));
}