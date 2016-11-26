import React from 'react';
import Debug from 'debug';
var debug = Debug('itaigi:錄音控制');

var MediaStreamRecorder = require('msr');

var mediaRecorder;

export default class 錄音控制 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        start: false,
        stop: true,
        pause: true,
        resume: true,
        這馬時間: 0,
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
    let { channels, timeInterval, 加音檔 } = this.props;
    mediaRecorder.audioChannels = channels;
    mediaRecorder.ondataavailable = ((blob)=>(this.stopA(), 加音檔.bind(this)(blob)));

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

  stopA() {
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
    let { frequency } = this.props;
    let { 這馬時間 } = this.state;
    let 揤 = 'ui compact blue labeled icon button';
    let 袂使 = 'ui compact labeled icon button disabled';
    return (
        <section>
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
      );
  }
}
