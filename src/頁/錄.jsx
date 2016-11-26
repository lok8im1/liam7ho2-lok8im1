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
        這馬時間: 0,
        音檔: [],
      };
  }

  onMediaError(e) {
    debug('media error', e);
  }

  onMediaSuccess(stream) {
    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.stream = stream;
    mediaRecorder.recorderType = MediaStreamRecorder.StereoAudioRecorder;

    mediaRecorder.mimeType = 'audio/wav';
    let { channels, timeInterval } = this.state;
    mediaRecorder.audioChannels = channels;
    mediaRecorder.ondataavailable = (function (blob) {
        let { 音檔 } = this.state;
        this.setState({ 音檔: [...音檔, blob] });
        this.stopA();
      }).bind(this);

    mediaRecorder.start(timeInterval);
    this.setState({ 這馬時間: 0 });
    this.setState({ stop: false });
    this.setState({ pause: false });
  }

  startA() {
    this.setState({ start: true });
    let mediaConstraints = {
      audio: true,
    };
    navigator.getUserMedia(
      mediaConstraints,
       this.onMediaSuccess.bind(this),
       this.onMediaError.bind(this)
       );
    this.計時 = setInterval((tsham)=>(this.setState({ 這馬時間: this.state.這馬時間 + 1 })), 1000);
  }

  stopA(a, b) {
    this.setState({ stop: true });
    clearInterval(this.計時);
    mediaRecorder.stop();
    mediaRecorder.stream.stop();
    this.setState({ pause: true });
    this.setState({ resume: true });
    this.setState({ start: false });
  }

  pauseA() {
    this.setState({ pause: true });
    this.setState({ stop: true });
    mediaRecorder.pause();
    this.setState({ resume: false });
  }

  resumeA() {
    this.setState({ resume: true });
    mediaRecorder.resume();
    this.setState({ stop: false });
    this.setState({ pause: false });
  }

  render() {
    let { frequency, channels, 音檔, 這馬時間 } = this.state;
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
            <button id="start-recording" className={this.state.start ? 袂使 : 揤}
                onClick={this.startA.bind(this)} disabled={this.state.start}>
              <i className="play icon"/>開始
            </button>
            <button id="stop-recording" className={this.state.stop ? 袂使 : 揤}
              onClick={this.stopA.bind(this)}  disabled={this.state.stop}>
              <i className="stop icon"/> 停止
              <div className="floating ui red label">{這馬時間}</div>
            </button>
              <div className="ui tag label">
                <i className="music icon"></i>錄音格式：{frequency}Hz 雙聲道 WAV
              </div>
        </section>

        <div className="ui celled list">
            {bl}
        </div>
      </article>
    </div>
    );
  }
}
