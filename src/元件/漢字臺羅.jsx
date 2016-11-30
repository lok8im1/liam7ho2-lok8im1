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
    let { 分詞, 綜合標音 } = this.props.漢字音標對齊;
    let 分詞陣列=[],漢字陣列=[], 臺羅陣列=[]
    綜合標音.map(function(標音){
      分詞陣列.concat(標音.分詞.split(' '))
      漢字陣列.concat(標音.漢字.split(' '))
      臺羅陣列.concat(標音.臺羅.split(' '))
    // 漢字, 臺羅.concat
    })
    //
    return (
    <div>
      {編號}<br/>
      {漢字}<br/>
      {臺羅}<br/>
      {分詞}<br/>
    </div>
    );
  }
}
