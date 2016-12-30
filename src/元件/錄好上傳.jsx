import React from 'react';
import Debug from 'debug';
import 漢字臺羅 from './漢字臺羅';
import 音檔表 from './音檔表';

var debug = Debug('itaigi:錄好上傳');

export default class 錄好上傳 extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let { 有確定的資料, 當佇送, 上傳好矣, 錄好的上傳 } = this.props;

    if (!有確定的資料) {
      return (
        <div>
        </div>
        );
    }

    let { 確定的音檔, 編號, 漢字音標對齊 } = this.props.確定的資料;
    if (上傳好矣) {
      return (
        <div className='ui segment'>
          第 {編號} 句 上傳好矣
        </div>
        );
    }

    if (當佇送) {
      return (
        <div className='ui segment'>
          <漢字臺羅 編號={編號} 漢字音標對齊={漢字音標對齊}/>
          <br/>
          <div className="ui segment">
            <div className="ui active inverted dimmer">
              <div className="ui text loader">上傳中…</div>
            </div>
            <p></p>
          </div>
        </div>
        );
    }

    return (
    <div className='ui segment'>
      <漢字臺羅 編號={編號} 漢字音標對齊={漢字音標對齊}/>
      <br/>
      上傳失敗，請閣傳一擺<br/>
      <音檔表 音檔={[確定的音檔]} 送出音檔={錄好的上傳.bind(this)} />
    </div>
    );
  }
}
