const { Pool } = require('pg');
const managedPool = require('../src');

let connectCalled = false;
let releaseCalled = false;
let clientMatched = false;
let returnMatched = false;
let throwMatched = false;

const mockClient = {
  error() {
    throw 'thrown error';
  },
  release() {
    releaseCalled = true;
  }
};

const mockPool = {
  async connect() {
    connectCalled = true;
    return mockClient;
  }
};

Object.defineProperty(Pool, Symbol.hasInstance, {
  value(instance) {
    return instance === mockPool;
  }
});

const connect = managedPool(mockPool);

(async () => {
  const rtn = await connect(async client => {
    clientMatched = client === mockClient;

    return 'return value';
  });

  returnMatched = rtn === 'return value';

  try {
    await connect(async client => {
      await client.error();
    });
  } catch(e) {
    throwMatched = e === 'thrown error';
  }

  if(clientMatched && returnMatched && throwMatched && connectCalled && releaseCalled) {
    console.log('Test passed');
    process.exit(0);
  } else {
    console.log('Test failed');
    process.exit(1);
  }
})().catch(e => {
  console.error(e.toString());
  process.exit(1);
});
