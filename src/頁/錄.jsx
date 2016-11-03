import React from 'react';
import Debug from 'debug';
var debug = Debug('itaigi:App');

var MediaStreamRecorder = require('msr');

var index = 1;
var mediaRecorder;

// below function via: http://goo.gl/B3ae8c
function bytesToSize(bytes) {
  var k = 1000;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
// below function via: http://goo.gl/6QNDcI
function getTimeLength(milliseconds) {
  var data = new Date(milliseconds);
  return data.getUTCHours() + ' hours, ' + data.getUTCMinutes() + ' minutes and ' + data.getUTCSeconds() + ' second(s)';
}

window.onbeforeunload = function () {
    document.querySelector('#start-recording').disabled = false;
  };

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: false,
      stop: true,
      pause: true,
      resume: true,
      save: true,
    };
  }

  captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
  }

  onMediaError(e) {
    console.error('media error', e);
  }

  onMediaSuccess(stream) {
    let audio = document.createElement('audio');
    audio = mergeProps(audio, {
        controls: true,
        muted: true,
        src: URL.createObjectURL(stream),
      });
    audio.play();
    let audiosContainer = document.getElementById('audios-container');
    audiosContainer.appendChild(audio);
    audiosContainer.appendChild(document.createElement('hr'));
    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.stream = stream;
    mediaRecorder.recorderType = StereoAudioRecorder;
    mediaRecorder.mimeType = 'audio/wav';
    // mediaRecorder.mimeType = 'audio/webm'; // audio/ogg or audio/wav or audio/webm
    // mediaRecorder.audioChannels = !!document.getElementById('left-channel').checked ? 1 : 2;
    mediaRecorder.ondataavailable = function (blob) {
        var a = document.createElement('a');
        a.target = '_blank';
        a.innerHTML = 'Open Recorded Audio No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval);
        a.href = URL.createObjectURL(blob);

        let audiosContainer = document.getElementById('audios-container');
        audiosContainer.appendChild(a);
        audiosContainer.appendChild(document.createElement('hr'));
      };
    var timeInterval = document.querySelector('#time-interval').value;
    if (timeInterval) timeInterval = parseInt(timeInterval);
    else timeInterval = 5 * 1000;
    // get blob after specific time interval
    mediaRecorder.start(timeInterval);
    this.setState({ stop: false });
    this.setState({ pause: false });
    this.setState({ save: false });
  }

  startA() {
    console.log('@@');
    this.setState({ start: true });
    let mediaConstraints = {
      audio: true,
    };
    this.captureUserMedia(mediaConstraints, this.onMediaSuccess.bind(this), this.onMediaError.bind(this));
  }

  stopA(a, b) {
    console.log('@X@');
    this.setState({ stop: true });
    debug('@X@');
    mediaRecorder.stop();
    mediaRecorder.stream.stop();
    debug('@X@');
    this.setState({ pause: true });
    this.setState({ start: false });
    console.log('@X@');
  }

  pauseA() {
    console.log('@@');
    this.setState({ pause: true });
    mediaRecorder.pause();
    this.setState({ resume: false });
  }

  resumeA() {
    console.log('@@');
    this.setState({ resume: true });
    mediaRecorder.resume();
    this.setState({ pause: false });
  }

  saveA() {
    debug('@@');
    this.setState({ save: true });
    mediaRecorder.save();
    // alert('Drop WebM file on Chrome or Firefox. Both can play entire file.
    //  VLC player or other players may not work.');
  }

  render() {
    return (
    <div className='app background'>
    XX    <article>

        <div className="github-stargazers"></div>

        <section className="experiment">
            <label htmlFor="time-interval">Time Interval (milliseconds):</label>
            <input type="text" id="time-interval" defaultValue="10000"/>ms

            <br/>
            <br/> recorderType:WebAudio API (WAV)

            <br/>

            <input id="left-channel" type="checkbox" defaultChecked="true" />
            <label htmlFor="left-channel">Record Mono Audio</label>

            <br/>
            <br/>

            <button id="start-recording"
              onClick={this.startA.bind(this)} disabled={this.state.start}>Start</button>
            <button id="stop-recording"
            onClick={this.stopA.bind(this)}  disabled={this.state.stop}>Stop</button>

            <button id="pause-recording"
            onClick={this.pauseA.bind(this)} disabled={this.state.pause}>Pause</button>
            <button id="resume-recording"
             onClick={this.resumeA.bind(this)} disabled={this.state.resume}>Resume</button>

            <button id="save-recording"
             onClick={this.saveA.bind(this)} disabled={this.state.save}>Save</button>
        </section>

        <section className="experiment">
            <div id="audios-container"></div>
        </section>

        <script>
        </script>


        <script src="https://cdn.webrtc-experiment.com/commits.js" async></script>
</article>
    </div>
    );
  }
}
