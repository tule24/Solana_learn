const {
    Connection,
    PublicKey,
    Account,
    connectionApiUrl,
    Transaction,
    Keypair,
    LAMPORTS_PER_SOL,
    clusterApiUrl
} = require("@solana/web3.js")

const devKeys = new Keypair();
const pubKey = new PublicKey(devKeys.publicKey).toString(); // devKeys._keypair.publicKey
const privateKey = devKeys._keypair.secretKey; // devKeys._keypair.secretKey
const publicRealKey = new PublicKey("6eJxw6vfrqg5xCnAupuhEqcL7fyGf58RtdQCHAnM363p");
// secretKey is Array[u8; 64]
// pubKey is BigNumber


const getWalletBalance = async (connection, myWallet) => {
    try {
        const walletBalance = await connection.getBalance(myWallet.publicKey);
        console.log(`Wallet address is ${myWallet.publicKey.toString()} and balance is ${walletBalance}`);
    } catch(err) {
        console.log(err);
    }
}

const requestAirdrop = async (connection, myWallet) => {
    try {
        const airdropSignatureResult = await connection.requestAirdrop(myWallet.publicKey, 0.1*LAMPORTS_PER_SOL);
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: airdropSignatureResult
        });
    } catch(err) {
        console.log(err);
    }
}

const main = async () => {
    const connection = new Connection(clusterApiUrl("testnet"), "confirmed");
    const myWallet = Keypair.fromSecretKey(privateKey);

    await getWalletBalance(connection, myWallet);
    await requestAirdrop(connection, myWallet);
    await getWalletBalance(connection, myWallet);
}

main();

/* Connection là mình đang tạo một kết nối tới 1 RPC API enpoint. Sol có 3 env để dev:
    + devnet: https://api.devnet.solana.com
    + testnet: https://api.testnet.solana.com
    + mainnet-beta: https://api.mainnet-beta.solana.com
    => clusterApiUrl nó sẽ lấy url tương ứng với option mình chọn
   Param thứ 2 của Connection là option Commitment ("processed" | "confirmed" | "finalized" | "recent" | "single" | "singleGossip" | "root" | "max") 
   Đây là các level cam kết mong muốn khi truy vấn trạng thái:
    + 'processed': truy vấn khối gần nhất khi đã có 1 confirmation của 1 node
    + 'confirmed': truy vấn khối gần nhất khi đã có 1 confirmation của 1 cluster
    + 'finalized': truy vấn khối gần nhất khi đã finalized bởi cluster 

    ConfirmTransaction mới sẽ sử dụng cú pháp như trên.
     - Lấy blockhash gần nhất và xác nhận transaction trên nó

    Muốn getBalance từ ví của mình thì cứ truyền pubkey của mình vô, chọn đúng mạng và check
*/
