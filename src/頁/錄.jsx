import React from 'react';
import Debug from 'debug';
import 錄音控制 from '../元件/錄音控制';
import 音檔表 from '../元件/音檔表';

var debug = Debug('itaigi:錄');

export default class 錄 extends React.Component {
  constructor(props) {
    super(props);
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    let { sampleRate } = new AudioContext();
    this.state = {
        frequency: sampleRate, // 無法度改
        timeInterval: 600 * 1000, // 錄音最長600秒
        channels: 2,
        音檔: [],
        編號: undefined,
      };
  }

  調名(input) {
    let 名 = input.value;
    this.setState({ 名 });
  }

  掠稿() {
    this.setState({ 編號: this.state.音檔.length });
  }

  加音檔(blob) {
    let { 音檔 } = this.state;
    this.setState({ 音檔: [...音檔, blob] });
    this.掠稿();
  }

  render() {
    let { frequency, timeInterval, channels, 名, 音檔, 編號 } = this.state;
    if (frequency != 44100) {
      return (
        <div className='app container'>
          你的瀏覽器不支援44100Hz的錄音。錄音頻率是：{frequency}
        </div>
        );
    }

    return (
    <div className='app container'>
        <div className="ui form">
          <div className="fields">
            <div className="field">
              <label>名</label>
              <input type='text' placeholder="名" value={名} onChange={this.調名.bind(this)} />
            </div>
            <button className="ui button" onClick={this.掠稿.bind(this)}>載入進度</button>
          </div>
        </div>
        <錄音控制 frequency={frequency} timeInterval={timeInterval} channels={channels}
          第幾个={音檔.length + 1} 加音檔={this.加音檔.bind(this)}/>

        <音檔表 音檔={音檔}/>
        {編號}
    </div>
    );
  }
}
