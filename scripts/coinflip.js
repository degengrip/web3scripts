var Web3 = require('web3');

const CoinFlipMetadata = require('./metadata/CoinFlip.json');

const contractAddress = "0x49BF1260CF0BD17A1F179D7ad50aC0993106891B";
const privateKey = "ceb37b50686d6b45ff9979418d472f87b8d8c0bd05606e2883846a49d52f5d37";
const FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;


var web3 = new Web3("https://rinkeby.infura.io/v3/4e682f84f1bb4a52b57de837a8681ada");




(async () => {
    try {
        const account = web3.eth.accounts.privateKeyToAccount(privateKey)

        const gasLimit = 200000
        const gasPrice = await web3.eth.getGasPrice()

        const contract = new web3.eth.Contract(CoinFlipMetadata.abi, contractAddress, {
            from: account.address,
            gasPrice: gasLimit
        });

        const block = await web3.eth.getBlock("latest");
        const blockValue = parseInt(block.hash);
        const coinFlip = blockValue > (FACTOR)

        const tx = {
            // this could be provider.addresses[0] if it exists
            from: account.address, 
            // target address, this could be a smart contract address
            to: contractAddress, 
            // optional if you want to specify the gas limit 
            gas: gasLimit,
            gasPrice: gasPrice * 222,
            // this encodes the ABI of the method and the arguements
            data: contract.methods.flip(coinFlip).encodeABI() 
          };
        const signPromise = await web3.eth.accounts.signTransaction(tx, privateKey);

        const transaction = await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
        console.log(transaction)
        const consecutiveWins = await contract.methods.consecutiveWins().call();
        console.log(consecutiveWins);
    } catch (e) {
        console.log(e)
    }
    
})()
