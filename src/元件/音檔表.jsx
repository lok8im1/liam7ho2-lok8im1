import React from 'react';
import Debug from 'debug';
var debug = Debug('itaigi:音檔表');

export default class 音檔表 extends React.Component {
  render() {
    let { 音檔 } = this.props;
    let bl = 音檔.map((blob, i)=>(
      <div  key={i} className='item' >
        <div className='content'>
              <div className="ui tag teal label">
                <i className="music icon"></i>{(i + 1) }
              </div>
              <audio
                src={URL.createObjectURL(blob)}
                type="audio/wav" controls>
              </audio>
              <a target='_blank' href={URL.createObjectURL(blob)} download={(i + 1) + '.wav'}>
                <div className="ui label">
                  <i className="download icon"></i>
                  這个好
                </div>
              </a>
          </div>
        </div>
        )
      ).reverse();

    return (
      <div className="ui celled list">
          {bl}
      </div>
    );
  }
}
