import React from 'react';
import cookie from 'react-cookie';
import superagent from 'superagent-bluebird-promise';
import Debug from 'debug';
import 後端 from '../App/後端';
import 顯示例句 from '../元件/顯示例句';
import 錄好上傳 from '../元件/錄好上傳';

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
        顯示名: cookie.load('hian2si7_mia5'),
        音檔: [],
        當佇送: false,
        資料: undefined,
        全部確定的資料: [],
      };
  }

  componentDidMount() {
    this.掠稿();
  }

  掠稿() {
    let 名 = this.refs.名.value.trim();
    if (名 == '')
      return;
    this.setState({ 名 });
    cookie.save('hian2si7_mia5', 名);
    superagent.get(後端.稿())
      .query({ 啥人唸的: 名 })
      .then(({ body })=>(
        this.setState({ 資料: body, 漢字音標對齊: undefined }),
        this.對齊(body)
      ))
      .catch((err) => (debug(err)));
  }

  掠後一句稿() {
    this.setState({資料:undefined, 漢字音標對齊: undefined }),
    superagent.get(後端.稿())
      .query({ 啥人唸的: 名 })
      .then(({ body })=>(
        this.setState({ 資料: body, 漢字音標對齊: undefined }),
        this.對齊(body)
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
    let { 全部確定的資料 } = this.state;
    let { 資料, 漢字音標對齊 } = this.state;
    this.setState({ 全部確定的資料: [
      {
        確定的音檔: blob,
        編號: 資料.編號,
        漢字音標對齊: 漢字音標對齊,
      },
      ...全部確定的資料,
      ], });

    this.掠後一句稿();
  }

  改顯示名(evt) {
    let 顯示名 = evt.target.value;
    this.setState({ 顯示名 });
  }

  render() {
    let { frequency, timeInterval, channels, 顯示名, 音檔, 資料, 漢字音標對齊, 當佇送, 全部確定的資料 } = this.state;
    if (frequency < 44100) {
      return (
        <div className='app container'>
          你的瀏覽器不支援44100Hz以上的錄音。錄音頻率是：{frequency}
        </div>
        );
    }

    let a = 全部確定的資料.map((確定的資料, i)=>(<錄好上傳 key={i} 確定的資料={確定的資料}/>));
    return (
    <div className='app container'>
        <div className="ui form">
          <div className="fields">
            <div className="field">
              <label>名</label>
              <input ref='名' type='text' placeholder="你叫啥名"
                value={顯示名} onChange={this.改顯示名.bind(this)}/>
            </div>
            <button className="ui button" onClick={this.掠稿.bind(this)}>載入進度</button>
          </div>
        </div>
        <顯示例句 frequency={frequency} timeInterval={timeInterval} channels={channels}
          資料={資料} 漢字音標對齊={漢字音標對齊} 送出音檔={this.送出音檔.bind(this)} 當佇送={當佇送}/>
        {a}
    </div>
    );
  }
}
