import React from 'react';
import Debug from 'debug';
import 漢字臺羅 from './漢字臺羅';
import 音檔表 from './音檔表';

var debug = Debug('itaigi:錄好上傳');

export default class 錄好上傳 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      當佇送: true,
      上傳好矣: false,
    };
    this.送出音檔();
  }

  送出音檔() {
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
            this.setState({ 上傳好矣: true }),
            this. 對齊(body)
          ))
          .catch((err) => (
            debug(err),
            alert('上傳失敗，麻煩檢查網路或回報錯誤～'),
            this.setState({ 當佇送: false })
          ));
      }.bind(this);

    this.fileReader.readAsArrayBuffer(this.state.確定的音檔);
  }

  render() {
    let { 確定的音檔, 編號, 漢字音標對齊 } = this.props.確定的資料;
    let { 當佇送, 上傳好矣 } = this.state;
    if (上傳好矣) {
      return (
        <div className='ui segment'>
        {編號} 上傳好矣
        </div>
        );
    }

    return (
    <div className='ui segment'>
      <漢字臺羅 編號={編號} 漢字音標對齊={漢字音標對齊}/>
      <br/>
      <音檔表 音檔={[確定的音檔]} 送出音檔={this.送出音檔.bind(this)} 當佇送={當佇送} />
    </div>
    );
  }
}
