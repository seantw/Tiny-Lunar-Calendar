// 傳入：西元年份。回傳：該年每一天的農曆日期二維陣列。二維陣列為 [西元月份][農曆月日]，負值為農曆閏月。
function getLunarCalendar(targetYear){

  'use strict';

  /*
    依序存放農曆資料 2000-02-05 ~ 2100
    binYear: 農曆1~12月天數? 29或30(12bit)、該年農曆閏幾月? 0無 2~11月(4bit)。1年共計16bit
    binLeap: 閏月大小 (1年1bit)
  */
  const binYear = window.atob('yWDZVNSg2lB1Ulagq7cl0JLQyrWpULSguqStUFXZS6ClsFF2UrCpMHlUaqCtUFtSS2Cm5qTg0mDqZdUwWqB2o5bQSvtK0KTQ0LbSUNUg3UW1oFbQVbJJsKV3pLCqULJVbSCtoEtjk3BJ+ElwZLBopupQayCmxKrgkuDS48lg1VfUoNpQXVVWoKbQVdRS0Km4qVC0oLamrVBVoKukpbBSsLJzaTBzN2qgrVBLVUtgpXBU5NFg6WjVINqgaqZW0ErgqdSi0NFQ8lI=');
  const binLeap = window.atob('AABAAAgBISAAAAQEAA==');
  let bD = new Date(2000,1,5);
  const [minYear,maxYear] = [bD.getFullYear(), bD.getFullYear() + (binYear.length/2) -1]; //農曆表格年分範圍

  let aCalendar = [];
  for(let i=0;i<12;i++) aCalendar.push([]);

  if(targetYear<=minYear || targetYear>maxYear) return(aCalendar); //超過農曆資料範圍 (資料後1年開始才能計算)

  //取得國曆y年m月的天數 (m=1~12)
  const getSolarMonthSize = (y,m) => m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);

  //取得農曆y年的閏月份: 0無、1~12
  const getLeapMonth = y => binYear.charCodeAt((y-minYear)*2+1) & 0x0f;

  //取得農曆y年的閏月日數: 0小月(29日)、1大月(30日)
  const getLeapSize = y => binLeap.charCodeAt(Math.floor((y-minYear) / 8)) & (0x80 >>> (Math.floor(y-minYear) % 8) )?1:0;

  //取得農曆y年m月的日數: 0小月(29日)、1大月(30日)
  const getMonthSize = (y,m) => (((binYear.charCodeAt((y-minYear)*2) << 8) | (binYear.charCodeAt((y-minYear)*2+1) & 0xf0)) & (0x8000 >>> (m-1)))?1:0;

  //取得農曆y年共幾天(含閏月)
  const getYearDays = y => (12+(getLeapMonth(y)?1:0))*29 + ((binYear.charCodeAt((y-minYear)*2) << 8) | (binYear.charCodeAt((y-minYear)*2+1) & 0xf0)).toString(2).match(/1/g).length + getLeapSize(y);

  //計算 資料起始日 ~ 目標年前一年 的農曆天數, 算出去年農曆春節的國曆日期
  let numDiffDays = 0;
  for(let y = minYear; y<(targetYear-1); y++) numDiffDays += getYearDays(y);


  //計算 目標年前一年農曆春節 的 國曆日期
  bD.setDate(bD.getDate() + numDiffDays);

  //計算 目標年前一年農曆春節 至 目標年的國曆12月
  for(let y = (targetYear-1); y<=targetYear; y++) {
    let leapMonth = getLeapMonth(y); //閏月份
    for(let m=1;m<=12;m++) {
      for(let d=1; d<=(29+getMonthSize(y,m)); d++) {
        if(bD.getFullYear()==targetYear) aCalendar[bD.getMonth()].push(m*100+d);
        bD.setDate(bD.getDate()+1);
      }
      
      if(m==leapMonth) { //有閏月
        for(let d=1; d<=(29+getLeapSize(y)); d++) {
          if(bD.getFullYear()==targetYear) aCalendar[bD.getMonth()].push(-(m*100+d));
          bD.setDate(bD.getDate()+1);
        }
      }
      
    }
  }
  return(aCalendar);
}

// 傳入：西元年份。回傳：該年清明節為4月的幾日。
function getQingMing(targetYear) {
  const tropicalYear = 31556925252; //平均回歸年
  const baseQingMing = 954847918750; // 2000年清明日期
  return (new Date(baseQingMing+(targetYear-2000)*tropicalYear)).getDate();
}
