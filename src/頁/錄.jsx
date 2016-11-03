import React from 'react';
import Debug from 'debug';
var debug = Debug('itaigi:App');

var MediaStreamRecorder = require('msr');

var mediaRecorder;

// below function via: http://goo.gl/B3ae8c
function bytesToSize(bytes) {
  var k = 1000;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

window.onbeforeunload = function () {
    document.querySelector('#start-recording').disabled = false;
  };

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index:1,
      start: false,
      stop: true,
      pause: true,
      resume: true,
      save: true,
    };
  }
  onMediaError(e) {
    console.error('media error', e);
  }

  onMediaSuccess(stream) {
    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.stream = stream;
    mediaRecorder.recorderType = MediaStreamRecorder.StereoAudioRecorder;
    mediaRecorder.mimeType = 'audio/wav';
    // mediaRecorder.mimeType = 'audio/webm'; // audio/ogg or audio/wav or audio/webm
    let channels=2;
    mediaRecorder.audioChannels = channels;
    mediaRecorder.ondataavailable = (function (blob) {
      let {index}=this.state;
        var a = document.createElement('a');
        a.target = '_blank';
        a.innerHTML = 'No. ' + (index) + ' (大小： ' + bytesToSize(blob.size*2) + ') 時間長度： ' + (blob.size/44100/2/channels).toFixed(2)+' 秒';
        a.href = URL.createObjectURL(blob);
        this.setState({index:index+1})

        let audiosContainer = document.getElementById('audios-container');
        audiosContainer.appendChild(a);
        audiosContainer.appendChild(document.createElement('hr'));
        this.stopA();
      }).bind(this);
    var timeInterval = document.querySelector('#time-interval').value;
    if (timeInterval) timeInterval = parseInt(timeInterval)*1000;
    else timeInterval = 5 * 1000;
    // get blob after specific time interval
    mediaRecorder.start(timeInterval);
    this.setState({ stop: false });
    this.setState({ pause: false });
  }

  startA() {
    console.log('@@');
    this.setState({ start: true });
    let mediaConstraints = {
      audio: true,
    };
    navigator.getUserMedia(mediaConstraints, this.onMediaSuccess.bind(this), this.onMediaError.bind(this));
    this.setState({ save: true });
  }

  stopA(a, b) {
    debug('@X@');
    this.setState({ stop: true });
    mediaRecorder.stop();
    mediaRecorder.stream.stop();
    this.setState({ pause: true });
    this.setState({ resume: true });
    this.setState({ start: false });
    this.setState({ save: false });
  }

  pauseA() {
    console.log('@@');
    this.setState({ pause: true });
    this.setState({ stop: true });
    mediaRecorder.pause();
    this.setState({ resume: false });
  }

  resumeA() {
    console.log('@@');
    this.setState({ resume: true });
    mediaRecorder.resume();
    this.setState({ stop: false });
    this.setState({ pause: false });
  }

  saveA() {
    debug('@@');
    // this.setState({ save: true });
    mediaRecorder.save();
    // alert('Drop WebM file on Chrome or Firefox. Both can play entire file.
    //  VLC player or other players may not work.');
  }

  render() {
    return (
    <div className='app background'>
      <article>

        <section className="experiment">
            <label htmlFor="time-interval">錄音最長秒數：</label>
            <input type="text" id="time-interval" defaultValue="60"/>

            <br/>
            <br/> 錄音格式：44100Hz 雙聲道 WAV


            <br/>
            <br/>

            <button id="start-recording"
              onClick={this.startA.bind(this)} disabled={this.state.start}>開始</button>
            <button id="stop-recording"
            onClick={this.stopA.bind(this)}  disabled={this.state.stop}>停止</button>

            <button id="pause-recording"
            onClick={this.pauseA.bind(this)} disabled={this.state.pause}>暫停</button>
            <button id="resume-recording"
             onClick={this.resumeA.bind(this)} disabled={this.state.resume}>繼續</button>

            <button id="save-recording"
             onClick={this.saveA.bind(this)} disabled={this.state.save}>存檔</button>
        </section>

        <section className="experiment">
            <div id="audios-container"></div>
        </section>
</article>
    </div>
    );
  }
}
