(function(){
  var video;
  var width = 640;
  var height = 480;
  var mediaOptions = { audio: false, video: true };
  
  var prevFrame;
  var currentFrame;

  if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }

  if (!navigator.getUserMedia){
    return alert('getUserMedia not supported in this browser.');
  }

  navigator.getUserMedia(mediaOptions, success, function(e) {
    console.log(e);
  });

  function success(stream){
    video = document.querySelector("#player");
    video.src = window.URL.createObjectURL(stream);
  }
  function captureFrame(){
    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video,0,0,width, height);
    var bitmap = [];
    for(var i = 0; i<canvas.height; i++){
      bitmap.push([]);
      for(var j = 0; j<canvas.width; j++){
        bitmap[i].push(context.getImageData(j, i, 1, 1));
      }
    }
    return bitmap;
  }
  function playChange(){
    if(typeof currentFrame === 'undefined'){
      prevFrame = captureFrame();
    } else{
      prevFrame = currentFrame;
    }
    currentFrame = captureFrame();
    var col = Math.floor(width/2);
    var prevTotal = 0;
    var currentTotal = 0;
    var max = 280;
    var min = 200;
    for(var row = 200; row < 280; row++){
      prevTotal += prevFrame[row][col][0];
      currentTotal += currentFrame[row][col][0];
    }
    if(prevTotal/(max-min) < 50){
      var prevState = 1;
    } else {
      var prevState = 0;
    }
    
    if(currentTotal/(max-min) < 50){
      var currentState = 1;
    } else {
      var currentState = 0;
    }
    
    if(currentState && !prevState){
      console.log('Ding!');
    }
    
  }
  setInterval(playChange,100);
})();