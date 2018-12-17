const RToken = artifacts.require("RToken");

/*
 * Simple command line utility to transfer tokens from one account to another.
 *
 * Usage:
 *
 * truffle exec src/transfer.js [from address] [to address] [amount]
 */
module.exports = function (callback) {
  (async function () {
    // parse arguments
    const from = process.argv[process.argv.length - 3];
    const to = process.argv[process.argv.length - 2];
    const amount = process.argv[process.argv.length - 1];

    if (!web3.isAddress(from) || !web3.isAddress(to)) {
      return callback(new Error('usage: truffle exec src/transfer [from] [to] [amount]'));
    }

    // perform transfer
    const token = await RToken.deployed();
    const txReceipt = await token.transfer(to, amount, { from });
    if (txReceipt.receipt.status !== '0x1') throw new Error('transaction failed');

    console.log('transfer done, raised events:', JSON.stringify(txReceipt.logs, null, '  '));

    // print new balances
    const balanceOfSender = await token.balanceOf.call(from);
    const balanceOfRecipient = await token.balanceOf.call(to);

    console.log(`new balance of sender: ${balanceOfSender.toString(10)}`);
    console.log(`new balance of recipient: ${balanceOfRecipient.toString(10)}`);
  })()
    .then(() => callback())
    .catch(callback);
};

