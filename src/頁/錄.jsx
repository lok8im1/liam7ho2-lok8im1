import React from 'react';
import Debug from 'debug';
var debug = Debug('itaigi:App');

var MediaStreamRecorder = require('msr');

var mediaRecorder;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    let { sampleRate } = new AudioContext();
    this.state = {
        frequency: sampleRate, // 無法度改
        timeInterval: 600 * 1000, // 錄音最長600秒
        channels: 2,
        index: 1,
        start: false,
        stop: true,
        pause: true,
        resume: true,
        save: true,
        音檔: [],
      };
  }

  onMediaError(e) {
    console.error('media error', e);
  }

  onMediaSuccess(stream) {
    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.stream = stream;
    mediaRecorder.recorderType = MediaStreamRecorder.StereoAudioRecorder;

    // mediaRecorder.mimeType = 'audio/webm'; // audio/ogg or audio/wav or audio/webm
    mediaRecorder.mimeType = 'audio/wav';
    let { channels, timeInterval } = this.state;
    mediaRecorder.audioChannels = channels;
    debug(mediaRecorder.sampleRate);
    mediaRecorder.ondataavailable = (function (blob) {
        debug(mediaRecorder.sampleRate);
        let { 音檔 } = this.state;
        this.setState({ 音檔: [...音檔, blob] });
        this.stopA();
      }).bind(this);

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
    navigator.getUserMedia(
      mediaConstraints,
       this.onMediaSuccess.bind(this),
       this.onMediaError.bind(this)
       );
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
    mediaRecorder.save();

    // alert('Drop WebM file on Chrome or Firefox. Both can play entire file.
    //  VLC player or other players may not work.');
  }

  // below function via: http://goo.gl/B3ae8c
  bytesToSize(bytes) {
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  }

  render() {
    let { frequency, channels, 音檔 } = this.state;
    if (frequency != 44100) {
      return (
        <div className='app container'>
          你的瀏覽器不支援44100Hz的錄音。錄音頻率是：{frequency}
        </div>
        );
    }

    let 揤 = 'ui compact blue labeled icon button';
    let 袂使 = 'ui compact labeled icon button disabled';
    let bl = 音檔.map((blob, i)=>(
      <div  key={i} className='item' >
        <div className='content'>
              <div className="ui tag teal label">
                <i className="music icon"></i>{(i + 1) }
              </div>
              <audio
                src={URL.createObjectURL(blob)}
                type="audio/wav" controls>
              </audio>
              <a target='_blank' href={URL.createObjectURL(blob)} download={(i + 1) + '.wav'}>
                <div className="ui label">
                  <i className="download icon"></i>
                  下載
                </div>
              </a>
          </div>
        </div>
        )
).reverse();

    return (
    <div className='app container'>
      <article>

        <section className="experiment">
            錄音格式：{frequency}Hz 雙聲道 WAV

            <br/>
            <br/>

            <button id="start-recording" className={this.state.start ? 袂使 : 揤}
                onClick={this.startA.bind(this)} disabled={this.state.start}>
              <i className="play icon"/>開始
            </button>
            <button id="stop-recording" className={this.state.stop ? 袂使 : 揤}
              onClick={this.stopA.bind(this)}  disabled={this.state.stop}>
             <i className="stop icon"/> 停止
            </button>

            <button id="pause-recording" className={this.state.pause ? 袂使 : 揤}
              onClick={this.pauseA.bind(this)} disabled={this.state.pause}>
              <i className="pause icon"/>暫停
            </button>
            <button id="resume-recording" className={this.state.resume ? 袂使 : 揤}
              onClick={this.resumeA.bind(this)} disabled={this.state.resume}>
              <i className="play icon"/>繼續
            </button>

            <button id="save-recording" className={this.state.save ? 袂使 : 揤}
             onClick={this.saveA.bind(this)} disabled={this.state.save} >
              <i className="download icon"></i>存檔
            </button>

        </section>

        <div className="ui celled list">
            {bl}
        </div>
      </article>
    </div>
    );
  }
}
