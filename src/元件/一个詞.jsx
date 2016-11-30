import React from 'react';
import Debug from 'debug';

var debug = Debug('itaigi:一个詞');

export default class 一个詞 extends React.Component {

  放送() {
    let 音樂 = this.refs.音樂;
    音樂.play();
  }

  render() {
    let { 分詞, 漢字, 臺羅 } = this.props;

    return (
      <span className='ui huge button'>
      <ruby onClick={this.放送.bind(this)}>
        {漢字}
        <rt> {臺羅} </rt>
      </ruby>
        
      <audio ref="音樂">
        <source type='audio/wav'
          src={encodeURI(
            'http://voice.itaigi.tw/語音合成?查詢腔口=閩南語&查詢語句=' + 分詞
          )}/>
      </audio>
      </span>
    );
  }
}
