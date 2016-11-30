export default class 後端  {
  static 網址() {
    // return 'http://private-f0474-tai5uan5gian5gi2phing5thai5.apiary-mock.com/';
    //return 'http://localhost:8000';
    return 'https://lok8im1.herokuapp.com';
  }

  static 稿() {
    return this.網址() + '/稿/';
  }

  static 對齊() {
    return 'https://xn--lhrz38b.xn--v0qr21b.xn--kpry57d/漢字音標對齊';
  }

  static 音樂(分詞) {
    return encodeURI(
             'https://xn--lhrz38b.xn--v0qr21b.xn--kpry57d/語音合成?查詢腔口=閩南語&查詢語句=' + 分詞
           );
  }
}
