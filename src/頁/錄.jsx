import React from 'react';
import superagent from 'superagent-bluebird-promise';
import Debug from 'debug';
import 後端 from '../App/後端';
import 顯示例句 from '../元件/顯示例句';

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
        資料: {
          編號: 1,
          漢字: 'undefined',
          臺羅: 'sui2',
        },
      };

    this.fileReader = new FileReader();
    this.fileReader.onload = function () {
        let encoded_blob = btoa(new Uint8Array(this.fileReader.result));
        superagent.post(後端.稿())
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send({
            啥人唸的: this.state.名,
            編號: this.state.資料.編號,
            blob: encoded_blob,
          })
          .then(({ body })=>(
            this.setState({ 資料: body })
          ))
          .catch((err) => (debug(err)));
      }.bind(this);

  }

  調名(event) {
    let 名 = event.target.value;
    this.setState({ 名 });
  }

  掠稿() {
    this.setState({ 載入名: this.state.名 });
    superagent.get(後端.稿() + '?啥人唸的=' + encodeURI(this.state.名))
      .then(({ body })=>(
        this.setState({ 資料: body })
      ))
      .catch((err) => (debug(err)));
  }

  送出音檔(blob) {
    this.fileReader.readAsArrayBuffer(blob);
  }

  render() {
    let { frequency, timeInterval, channels, 名, 音檔, 資料 } = this.state;
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
              <input type='text' placeholder="你的名" onChange={this.調名.bind(this)} />
            </div>
            <button className="ui button" onClick={this.掠稿.bind(this)}>載入進度</button>
          </div>
        </div>
        <顯示例句 frequency={frequency} timeInterval={timeInterval} channels={channels}
          資料={資料} 送出音檔={this.送出音檔.bind(this)}/>
    </div>
    );
  }
}
