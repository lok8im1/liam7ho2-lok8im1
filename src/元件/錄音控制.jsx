import React from 'react';
import MediaStreamRecorder from 'msr';

import Debug from 'debug';
var debug = Debug('itaigi:錄音控制');

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
    this.Mediarecorder = new MediaStreamRecorder(stream);
    this.Mediarecorder.stream = stream;
    this.Mediarecorder.recorderType = MediaStreamRecorder.StereoAudioRecorder;

    this.Mediarecorder.mimeType = 'audio/wav';
    let { channels, timeInterval, 加音檔 } = this.props;
    this.Mediarecorder.audioChannels = channels;
    this.Mediarecorder.ondataavailable = ((blob)=>(this.stopA(), 加音檔.bind(this)(blob)));

    this.Mediarecorder.start(timeInterval);
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
    this.setState({ 這馬時間: 0 });
    this.計時 = setInterval((tsham)=>(this.setState({ 這馬時間: this.state.這馬時間 + 1 })), 1000);
  }

  stopA() {
    this.Mediarecorder.stop();
    this.Mediarecorder.stream.stop();
    clearInterval(this.計時);
    this.setState({ stop: true });
    this.setState({ pause: true });
    this.setState({ resume: true });
    this.setState({ start: false });
  }

  pauseA() {
    this.setState({ pause: true });
    this.setState({ stop: true });
    this.Mediarecorder.pause();
    this.setState({ resume: false });
  }

  resumeA() {
    this.setState({ resume: true });
    this.Mediarecorder.resume();
    this.setState({ stop: false });
    this.setState({ pause: false });
  }

  render() {
    let { 第幾个, frequency } = this.props;
    let { 這馬時間 } = this.state;
    let 揤 = 'ui compact blue labeled icon button';
    let 袂使 = 'ui compact labeled icon button disabled';
    return (
        <section>
            <div className="ui teal tag label">
              <i className="music icon"></i>{第幾个} - 雙聲道 {frequency}Hz WAV
            </div>
            <button id="start-recording" className={this.state.start ? 袂使 : 揤}
                onClick={this.startA.bind(this)} disabled={this.state.start}>
              <i className="play icon"/>開始
            </button>
            <button id="stop-recording" className={this.state.stop ? 袂使 : 揤}
              onClick={this.stopA.bind(this)}  disabled={this.state.stop}>
              <i className="stop icon"/> 停止
              <div className="floating ui red label">{這馬時間}</div>
            </button>
        </section>
      );
  }
}
