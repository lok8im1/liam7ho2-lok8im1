import React from 'react';
import Debug from 'debug';
import 錄音控制 from '../元件/錄音控制';
import 音檔表 from '../元件/音檔表';

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
        音檔: [],
      };
  }

  加音檔(blob) {
    debug(blob);
    let { 音檔 } = this.state;
    this.setState({ 音檔: [...音檔, blob] });
  }

  render() {
    let { frequency, timeInterval, channels, 音檔, 這馬時間 } = this.state;
    if (frequency != 44100) {
      return (
        <div className='app container'>
          你的瀏覽器不支援44100Hz的錄音。錄音頻率是：{frequency}
        </div>
        );
    }

    return (
    <div className='app container'>
      <article>
        <錄音控制 frequency={frequency} timeInterval={timeInterval} channels={channels}
          加音檔={this.加音檔.bind(this)}/>

        <音檔表 音檔={音檔}/>
      </article>
    </div>
    );
  }
}
