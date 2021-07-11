'use strict';

/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;

//create all variables
const recordedVideo = document.querySelector('#recorded');
const recordButton = document.querySelector('#record');
const playButton = document.querySelector('#play');
const parent=document.querySelector(".options__left");



let html;

//when we click on recordButton it either call startRecording function or StopRecording function on the basis of button property
recordButton.addEventListener('click', () => {
  if (recordButton.innerHTML === "\n            <i class=\"fas fa-record-vinyl\" aria-hidden=\"true\"></i>\n          ") {
    startRecording();
  } else {
    stopRecording();
    html="\n            <i class=\"fas fa-record-vinyl\" aria-hidden=\"true\"></i>\n          ";
    recordButton.classList.toggle("background__red");
    recordButton.innerHTML = html;
    
    playButton.innerHTML="<i class=\"fa fa-play\" aria-hidden=\"true\"></i>";
    
  //here when we stopped recording we create a new download button so that we can download our rcorded file


    const downloadButton=document.createElement('div');
    downloadButton.classList.add('options__button');
    downloadButton.setAttribute('id','download');
    downloadButton.innerHTML='<i class="fa fa-download" aria-hidden="true"></i>';
    parent.append(downloadButton);

    //when we click download button it will get all data from blob and download it
    downloadButton.addEventListener('click', () => {
        const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
      });
    // playButton.disabled = false;
    // downloadButton.disabled = false;
  }
});

playButton.addEventListener('click', () => {
    if(playButton.innerHTML==="<i class=\"fa fa-play\" aria-hidden=\"true\"></i>"){
        const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
        recordedVideo.src = null;
        recordedVideo.srcObject = null;
        recordedVideo.src = window.URL.createObjectURL(superBuffer);
        recordedVideo.controls = true;
        recordedVideo.play();
    }
});


//this function handle the data available in event object and push it in recordedBlobs
function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

//this function start recording the screen in recordedBlobs
function startRecording() {
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.classList.toggle("background__red");
  recordButton.innerHTML='<i class="fas fa-stop"></i>';
  
  playButton.innerHTML='<i class="fas fa-pause" aria-hidden="true"></i>';
  const download=document.getElementById('download');
  if(download!=null){
    download.parentNode.removeChild(download);
  }
  
  
  // on stop event we handle the data using handle data function
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

// this function will stop recording
function stopRecording() {
  mediaRecorder.stop();
}




