# Compile contracts



Execute the following command:

```sh
truffle compile
```


# Deploy contracts to blockchain

Execute the following command:

```sh
truffle migrate --reset
```


# Monitor contract events

Execute the following command:

```sh
truffle exec src/watch-events.js
```

> when events are emitted, they'll appear in this shell


# Transfer tokens (manual)

-   Execute the following command to open an interactive shell:

    ```sh
    truffle console
    ```

    > This console takes JavaScript commands to interact with contracts.

-   Get the first account. This is the owner of the contract as well.

    ```js
    owner = web3.eth.accounts[0]
    ```

    > should print the address of the first account

-   Get the second acount. This will be the receiver.

    ```js
    receiver = web3.eth.accounts[1]
    ```

    > should print the address of the second account

-   Get the deployed contract and store it in a variable.

    ```js
    var token = null
    RToken.deployed().then(addr => { token = addr; })
    ```

    > should give no other output than `undefined`

-   Now that we have the contract instance and addresses of two users, we can interact with the token.
    Get the total balance of tokens for the owner:

    ```js
    token.balanceOf(owner).then(balance => balance.toString(10)).then(console.log)
    ```

    > should print the balance of the first users, which holds all value in the initial state

-   Send tokens from the first (owner) to the second account:

    ```js
    token.transfer(receiver, 100, { from: owner }).then(console.log)
    ```

    > should print the transaction receipt

-   Get new balance for the sender and receiver:

    ```js
    token.balanceOf(owner).then(balance => console.log('owner has', balance.toString(10)))
    token.balanceOf(receiver).then(balance => console.log('receiver has', balance.toString(10)))
    ```


# Transfer tokens (automatic)

-   You'll need a from and to address. Go to Ganache and look at the Accounts tab, copy addresses from there.

-   Execute the following command:

    ```sh
    truffle exec src/transfer.js [from address] [to address] [amount]
    ```
