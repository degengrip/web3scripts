const logUpdate = require('log-update');
var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
var Wallet = require('ethereumjs-wallet').default;
var EthUtil = require('ethereumjs-util');

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
let i = 0;
let totalCounter = 0;
let totalBalance = 0;
const results = [];
(async () => {
    try {
        while (true) {
            const wallets = [...Array(110)].map(() => getWallet());                                                                                                                                                                                                                                                          
            const walletsWithBalance = await Promise.all(wallets.map(async wallet => {
                const balance = await web3.eth.getBalance(wallet.getAddressString());
                totalCounter++;
                totalBalance += Number(balance);
                logUpdate("total balance:" + totalBalance + " | total searched: " + totalCounter )
                if (balance > 0) {
                    fs.appendFileSync(__dirname +'/exp.txt', JSON.stringify({
                        address: wallet.getAddressString(),
                        privateKey: wallet.getPrivateKeyString(),
                        publicKey: wallet.getPublicKeyString(),
                        balance,
                    }));
                    return wallet
                }
                return null;
            } )).then(wwb => wwb.filter(wwb => wwb !== null));
            if (walletsWithBalance.length > 0) {
                walletsWithBalance.forEach(w => {
                    console.log(w.getPrivateKeyString(), w.getAddressString())
                })
            }
            i++;
        }
    } catch (e) {
        console.log(results)
        console.log(e)
    }
    console.log(results)
})()

function getWallet() {
    const privateKey = genRanHex(64);
    const privateKeyBuffer = EthUtil.toBuffer('0x'+ privateKey);
    const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
    return wallet;
}