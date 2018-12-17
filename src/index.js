import { Drizzle, generateStore } from 'drizzle'
// Import contracts
import RToken from './../build/contracts/RToken.json'

const options = {
  contracts: [
    RToken
  ]
}

const drizzleStore = generateStore(this.props.options)
const drizzle = new Drizzle(this.props.options, drizzleStore)

var state = drizzle.store.getState();

// If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
if (state.drizzleStatus.initialized) {
  // Declare this call to be cached and synchronized. We'll receive the store key for recall.
  const dataKey = drizzle.contracts.SimpleStorage.methods.storedData.cacheCall()

  // Use the dataKey to display data from the store.
  return state.contracts.RToken.methods.balanceOf("");
}

// If Drizzle isn't initialized, display some loading indication.
return 'Loading...'
