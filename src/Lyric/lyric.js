/* 歌词提取 */
export default class Lyric {
  constructor(str) {
    if (typeof str === "undefined") {
      this.lines = [{ time: 1, txt: "解析歌词失败" }];
      this.total = 1;
      this.curren = 0;
      this.errorLyric = true;
      return this;
    }

    let lyricArr = str.split("[").slice(1); // 先以[进行分割
    let lrcObj = [];
    lyricArr.forEach((item) => {
      let arr = item.split("]"); // 再分割右括号
      // 时间换算成秒
      let m = parseInt(arr[0].split(":")[0]);
      let s = parseInt(arr[0].split(":")[1]);
      arr[0] = m * 60 + s;
      if (arr[1] != "\n") {
        // 去除歌词中的换行符
        lrcObj.push({ time: arr[0], lyric: arr[1] });
      }
    });

    this.lines = lrcObj;
    this.total = lrcObj.length;
    this.curren = 0;
  }
}
