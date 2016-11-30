import React from 'react';
import Debug from 'debug';
import 漢字臺羅 from '../元件/漢字臺羅';
import 錄音控制 from '../元件/錄音控制';
import 音檔表 from '../元件/音檔表';

var debug = Debug('itaigi:顯示例句');

export default class 顯示例句 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        音檔: [],
      };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.資料 === this.props.資料) return;
    this.setState({ 音檔: [] });
  }

  加音檔(blob) {
    let { 資料, 音檔 } = this.state;
    this.setState({ 音檔: [...音檔, blob] });
  }

  render() {
    let { frequency, timeInterval, channels, 名, 資料, 漢字音標對齊, 送出音檔, 當佇送 } = this.props;
    if (資料 === undefined) {
      return <div/>;
    }

    if (漢字音標對齊 === undefined) {
      return (
          <div className="ui active inline loader"/>
        );
    }

    let { 音檔 } = this.state;
    return (
    <div>
      <漢字臺羅 資料={資料} 漢字音標對齊={漢字音標對齊}/>
      <錄音控制 frequency={frequency} timeInterval={timeInterval} channels={channels}
        資料={資料} 加音檔={this.加音檔.bind(this)}/>

      <音檔表 音檔={音檔} 送出音檔={送出音檔.bind(this)} 當佇送={當佇送} />
    </div>
    );
  }
}
