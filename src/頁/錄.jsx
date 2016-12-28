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
        資料: undefined,
        音檔: [],
        有確定的資料: false,
        當佇送: false,
        上傳好矣: false,
        全部確定的資料: [],
      };
  }

  componentDidMount() {
    this.掠稿();
  }

  掠稿() {
    let 啥人唸的 = this.refs.名.value.trim();
    if (啥人唸的 == '')
      return;
    this.setState({ 啥人唸的});
    cookie.save('hian2si7_mia5', 啥人唸的);
    superagent.get(後端.稿())
      .query({ 啥人唸的: 啥人唸的 })
      .then(({ body })=>(
        this.setState({ 資料: body, 漢字音標對齊: undefined }),
        this.對齊(body)
      ))
      .catch((err) => (debug(err)));
  }

  掠後一句稿() {
    this.setState({ 資料: undefined, 漢字音標對齊: undefined }),
    superagent.get(後端.稿())
      .query({ 啥人唸的: this.state.啥人唸的 })
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
    let { 啥人唸的, 資料, 漢字音標對齊 } = this.state;
    this.setState({
      全部確定的資料: {
        啥人唸的: 啥人唸的,
        確定的音檔: blob,
        編號: 資料.編號,
        漢字音標對齊: 漢字音標對齊,
      },
      有確定的資料: true,
      上傳好矣:false,
    });

    this.掠後一句稿();
    this.錄好的上傳(blob);
  }

  錄好的上傳(確定的音檔=this.state.全部確定的資料.確定的音檔) {
    this.setState({ 當佇送: true });
    this.fileReader = new FileReader();
    this.fileReader.onload = function () {
        let encoded_blob = btoa(new Uint8Array(this.fileReader.result));
        let { 全部確定的資料 } = this.state;
        superagent.post(後端.稿())
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send({
            啥人唸的: 全部確定的資料.啥人唸的,
            編號: 全部確定的資料.編號,
            blob: encoded_blob,
          })
          .then(({ body })=>(
            this.setState({ 當佇送: false, 上傳好矣: true })
          ))
          .catch((err) => (
            debug(err),
            alert('上傳失敗，麻煩檢查網路或回報錯誤～'),
            this.setState({ 當佇送: false })
          ));
      }.bind(this);

    this.fileReader.readAsArrayBuffer(確定的音檔);
  }

  改顯示名(evt) {
    let 顯示名 = evt.target.value;
    this.setState({ 顯示名 });
  }

  render() {
    let { frequency, timeInterval, channels, 顯示名, 音檔, 資料, 漢字音標對齊 } = this.state;
    let { 有確定的資料, 當佇送, 上傳好矣, 全部確定的資料 } = this.state;
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
              <input ref='名' type='text' placeholder="你叫啥名"
                value={顯示名} onChange={this.改顯示名.bind(this)}/>
            </div>
            <button className="ui button" onClick={this.掠稿.bind(this)}>載入進度</button>
          </div>
        </div>
        <顯示例句 frequency={frequency} timeInterval={timeInterval} channels={channels}
          資料={資料} 漢字音標對齊={漢字音標對齊} 送出音檔={this.送出音檔.bind(this)}/>
        <錄好上傳
          錄好的上傳={this.錄好的上傳.bind(this)}
          確定的資料={全部確定的資料}
          有確定的資料={有確定的資料} 當佇送={當佇送} 上傳好矣={上傳好矣}/>
    </div>
    );
  }
}
