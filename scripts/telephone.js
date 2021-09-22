const TelephoneMetadata = require('./metadata/Telephone.json');

var Web3 = require('web3');
var web3 = new Web3("https://rinkeby.infura.io/v3/4e682f84f1bb4a52b57de837a8681ada");


const contractAddress = "0x64b3e1ccc421e81DD11F6c6C4193ebaC21472Aa8";
const privateKey = "ceb37b50686d6b45ff9979418d472f87b8d8c0bd05606e2883846a49d52f5d37";



(async () => {
    try {
        const account = web3.eth.accounts.privateKeyToAccount(privateKey)

        const gasLimit = 200000
        const gasPrice = await web3.eth.getGasPrice()

        const contract = new web3.eth.Contract(TelephoneMetadata.abi, contractAddress, {
            from: account.address,
            gasPrice: gasLimit
        });

        const tx = {
            from: account.address, 
            to: contractAddress, 
            gas: gasLimit,
            gasPrice: gasPrice * 100,
            data: contract.methods.changeOwner(account.address).encodeABI() 
          };
        const signPromise = await web3.eth.accounts.signTransaction(tx, privateKey);

        const transaction = await web3.eth.sendSignedTransaction(signPromise.rawTransaction)
        console.log(transaction)
    } catch (e) {
        console.log(e)
    }
    
})()
