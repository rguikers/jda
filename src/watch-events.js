const SolidityCoder = require('web3/lib/solidity/coder');
const RToken = artifacts.require('RToken');

/*
 * Monitors events of deployed contract, prints event details
 *
 * Usage:
 *
 * truffle exec src/watch-events.js
 */
async function watchEvents () {
  // get deployed contract
  const token = await RToken.deployed();

  let abiEvents = {};

  // get all events this contract can emit
  for (const item of RToken.abi) {
    if (item.type === 'event') {
      // signature is event name, followed by all argument types
      const signature = item.name + '(' + item.inputs.map(input => input.type).join(',') + ')';
      const hash = web3.sha3(signature);

      abiEvents[hash] = item;
    }
  }

  // listen to these topics
  const listenOptions = {
    topics: [ Object.keys(abiEvents) ],
    address: token.address
  };

  const filter = web3.eth.filter(listenOptions);
  filter.watch((err, event) => {
    if (err) {
      console.error(err);
    } else {
      for (let topicIdx = 0; topicIdx < event.topics.length; topicIdx++) {
        // topic is the hash of the event signature ...
        const topic = event.topics[topicIdx];

        // ... let's see if it's known to us
        const abiEvent = abiEvents[topic];
        if (abiEvent) {
          console.log('event', {
            blockNumber: event.blockNumber,
            logIndex: event.logIndex,
            transactionHash: event.transactionHash,
            transactionIndex: event.transactionIndex,
            name: abiEvent.name
          });

          console.log('args', decodeArgs(event, topicIdx, abiEvent));
        }
      }
    }
  });
}

function decodeArgs (event, topicIdx, abiEvent) {
  const inputData = SolidityCoder.decodeParams(
    abiEvent.inputs
      .filter(input => !input.indexed)
      .map(input => input.type),
    event.data.substring(2)
  );

  const args = {};

  let indexedArgNo = topicIdx + 1;
  let notIndexedArgNo = 0;
  for (let i = 0; i < abiEvent.inputs.length; i++) {
    let value;

    if (abiEvent.inputs[i].indexed) {
      value = event.topics[indexedArgNo++];
    } else {
      value = inputData[notIndexedArgNo++];
    }

    if (abiEvent.inputs[i].type === 'bytes32') {
      value = bytes32ToString(value);
    } else if (value.toNumber) {
      // not our problem if the number is be too large for a Number
      value = value.toString();
    }

    args[abiEvent.inputs[i].name] = value;
  }
  return args;
}

/**
 * Converts bytes32 to String and removes trailing characters
 * @param value {String} hexadecimal
 * @return {String}
 */
function bytes32ToString (value) {
  return web3.toAscii(value).replace(/\u0000/g, '');
}

module.exports = function (callback) {
  watchEvents()
    .catch(callback);
};
