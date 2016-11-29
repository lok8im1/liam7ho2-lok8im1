import React from 'react';
import Debug from 'debug';
import 錄音控制 from '../元件/錄音控制';
import 音檔表 from '../元件/音檔表';

var debug = Debug('itaigi:漢字臺羅');

export default class 漢字臺羅 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.資料 === this.props.資料) return;
  }

  render() {
    let { 編號, 漢字, 臺羅 } = this.props.資料;
    return (
    <div>
      {編號}<br/>
      {漢字}<br/>
      {臺羅}<br/>
    </div>
    );
  }
}
