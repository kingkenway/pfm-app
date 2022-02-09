const { performance } = require('perf_hooks');
// const logger = require('../../config/logger');

// const { data } = require('./data');

// function testData() {
//     const result = data.data;
    
//     result.sort((a, b) => (b.date) - (a.date));

//     return result;
// }

// var startTime = performance.now()

// console.log( testData().slice(0, 3) )

// var endTime = performance.now()

// console.log(`Call to doSomething took ${ (endTime - startTime) /1000 } seconds`)


const data = [
    {
        "_id": "61749426f72f490211ccb096",
        "type": "credit",
        "amount": 200000,
        "narration": "NIP/KUDA/KING  KENWAYDAVIDSON/TRANSFER",
        "date": "2021-10-23T11:28:55.000Z",
        "balance": 799388
    },
    {
        "_id": "61749426f72f490211ccb097",
        "type": "credit",
        "amount": 150000,
        "narration": "NIP/FCMB/KENWAYDAVIDSON KING/App Transfer To Zenith Bank KING   KENWAY DAVIDSON",
        "date": "2021-10-23T11:26:08.000Z",
        "balance": 599388
    },
    {
        "_id": "61749426f72f490211ccb098",
        "type": "debit",
        "amount": 240000,
        "narration": "VC POS Loc-129418703922--MOSH GOLDEN PROFILE PHA  OY           NG",
        "date": "2021-10-21T18:31:43.000Z",
        "balance": 449388
    }
  ];
  



const pap = data.map(x => ({
    ...x,
    c: 12345
}));

console.log(pap);