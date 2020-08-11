const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const isFunction = (val) => typeof val === "function";
const isObject = (val) => typeof val === "object";

function Promise(executor) {
  let self = this;
  self.status = PENDING;
  self.onFulfilled = [];
  self.onRejected = [];

  function resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject);
    }
    if (self.status === PENDING) {
      self.status = FULFILLED;
      self.value = value;
      self.onFulfilled.forEach((fn) => fn());
    }
  }

  function reject(reason) {
    if (self.status === PENDING) {
      self.status = REJECTED;
      self.reason = reason;
      self.onRejected.forEach((fn) => fn());
    }
  }

  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  resolve = isFunction(onFulfilled) ? onFulfilled : (val) => val;
  reject = isFunction(onRejected)
    ? onRejected
    : (reason) => {
        throw reason;
      };
  let promise2 = new Promise((resolve, reject) => {
    const handleFulfilled = () => {
      setTimeout(() => {
        try {
          let x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    };

    const handleRejected = () => {
      setTimeout(() => {
        try {
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    };
    if (this.status === FULFILLED) {
      handleFulfilled();
    } else if (this.status === REJECTED) {
      handleRejected();
    } else if (this.status === PENDING) {
      this.onFulfilled.push(handleFulfilled);
      this.onRejected.push(handleRejected);
      // console.log(this.onFulfilled);
    }
  });

  return promise2;
};

function resolvePromise(promise2, x, resolve, reject) {
  if ((x && isObject(x)) || isFunction(x)) {
    try {
      let then = x.then;
      if (isFunction(then)) {
        then.call(
          x,
          (y) => {
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      reject(e);
    }
  } else {
    resolve(x);
  }
}

Promise.prototype.resolve = function (params) {
  return new Promise((resolve, reject) => {
    resolve(params);
  });
};

Promise.prototype.race = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      promise(resolve, reject);
    });
  });
};

Promise.prototype.all = function (promises) {
  return new Promise((resolve, reject) => {
    let count = 0,
      values = [],
      length = promises.length;
    promises.forEach((promise) => {
      promise.then((res) => {
        values[count] = res;
        if (count === length) {
          resolve(values);
        }
        ++count;
      }, reject);
    });
  });
};

Promise.prototype.catch = function (reject) {
  return this.then(null, reject);
};

Promise.prototype.finally = function (callback) {
  return this.then(
    (value) => Promise.resolve(callback()).then(() => value),
    (err) => Promise.resolve(callback()).then(() => err)
  );
};

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1000);
  }, 1000);
});

p.then((res) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(res + 100);
    }, 1000);
  });
}).then((res) => {
  console.log(res, 8888);
});

// p.then((res) => {
//   console.log(res);
// });
