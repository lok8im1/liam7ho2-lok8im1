import React from 'react';
import MediaStreamRecorder from 'msr';

import Debug from 'debug';
var debug = Debug('itaigi:錄音控制');

export default class 錄音控制 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        start: false,
        這馬時間: 0,
      };
  }

  onMediaError(e) {
    debug('media error', e);
    alert('提無麥克風的權限，抑是請用https來連線');
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
    this.setState({ start: false });
  }

  render() {
    let { 第幾个, frequency } = this.props;
    let { 這馬時間 } = this.state;
    return (
        <section>
            <div className="ui teal tag label">
              <i className="music icon"></i>雙聲道 {frequency}Hz WAV
            </div>
            {!this.state.start ?
            <button id="start-recording" className="ui compact blue labeled icon button"
                onClick={this.startA.bind(this)} disabled={this.state.start}>
              <i className="play icon"/>開始
            </button>
            : null
            }
            {this.state.start ?
            <button id="stop-recording" className="ui compact labeled icon button"
              onClick={this.stopA.bind(this)} disabled={!this.state.start}>
              <i className="stop icon"/> 停止
              <div className="floating ui red label">{這馬時間}</div>
            </button>
            : null
            }
        </section>
      );
  }
}
