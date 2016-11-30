import React from 'react';
import Debug from 'debug';
import 一个詞 from '../元件/一个詞';

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
    let { 編號 } = this.props.資料;
    let { 分詞, 綜合標音 } = this.props.漢字音標對齊;
    let 分詞陣列 = [];
    let 漢字陣列 = [];
    let 臺羅陣列 = [];
    綜合標音.map(function (標音) {
      分詞陣列 = 分詞陣列.concat(標音.分詞.split(' '));
      漢字陣列 = 漢字陣列.concat(標音.漢字.split(' '));
      臺羅陣列 = 臺羅陣列.concat(標音.臺羅閏號調.split(' '));
    });

    let 詞 = 分詞陣列.map((分詞, i)=>(
      <一个詞 key={i}
        分詞={分詞} 漢字={漢字陣列[i]} 臺羅={臺羅陣列[i]} />
    ));

    return (
      <div>
        第 {編號} 句<br/>
        {詞}<br/>
      </div>
    );
  }
}
