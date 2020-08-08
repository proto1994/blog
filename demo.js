let arr = [],
  arrMap = {};

for (let i = 0; i < 100; i++) {
  let randomNumber = Math.floor(Math.random() * 100);
  arrMap[randomNumber]++;
  arr.push(randomNumber);
}

let filterArr = [];
arr.forEach(item => {
    filterArr.push(item);
})