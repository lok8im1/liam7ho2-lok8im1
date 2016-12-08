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
        當佇送: false,
        資料: undefined,
      };
  }

  掠稿() {
    let 名 = this.refs.名.value.trim();
    if (名 == '')
      return;
    this.setState({ 名 });
    superagent.get(後端.稿())
      .query({ 啥人唸的: 名 })
      .then(({ body })=>(
        this.setState({ 資料: body, 漢字音標對齊: undefined }),
        this. 對齊(body)
      ))
      .catch((err) => (debug(err)));
  }

  對齊(body)  {
    superagent.get(後端.對齊())
      .query({ 查詢腔口: '閩南語', 漢字: body.漢字, 音標: body.臺羅 })
      .then(({ body })=>(
        this.setState({ 漢字音標對齊: body })
      ))
      .catch((err) => (debug(err)));

  }

  送出音檔(blob) {
    this.setState({ 當佇送: true });
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
            this.setState({ 資料: body, 當佇送: false, 漢字音標對齊: undefined }),
            this. 對齊(body)
          ))
          .catch((err) => (
            debug(err),
            alert('上傳失敗，麻煩檢查網路或回報錯誤～'),
            this.setState({ 當佇送: false })
          ));
      }.bind(this);

    this.fileReader.readAsArrayBuffer(blob);
  }

  render() {
    let { frequency, timeInterval, channels, 名, 音檔, 資料, 漢字音標對齊, 當佇送 } = this.state;
    if (frequency < 44100) {
      return (
        <div className='app container'>
          你的瀏覽器不支援44100Hz以上的錄音。錄音頻率是：{frequency}
        </div>
        );
    }

    return (
    <div className='app container'>
        <div className="ui form">
          <div className="fields">
            <div className="field">
              <label>名</label>
              <input ref='名' type='text' placeholder="你叫啥名"/>
            </div>
            <button className="ui button" onClick={this.掠稿.bind(this)}>載入進度</button>
          </div>
        </div>
        <顯示例句 frequency={frequency} timeInterval={timeInterval} channels={channels}
          資料={資料} 漢字音標對齊={漢字音標對齊} 送出音檔={this.送出音檔.bind(this)} 當佇送={當佇送}/>
    </div>
    );
  }
}
