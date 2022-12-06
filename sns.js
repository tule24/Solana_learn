const {
    getHashedName,
    getNameAccountKey,
    NameRegistryState
} = require("@solana/spl-name-service")

const {
    Connection,
    PublicKey,
    clusterApiUrl
} = require("@solana/web3.js")
/* Khi làm project về sns cần phải đảm bảo tính bảo mật và an toàn
    - Vì thiết kế là mapping pubkey của mình với một cái tên do mình đặt, nếu hacker có thể hack và thay đổi pubkey này thì mình sẽ mất tiền
*/
const accountName = "knoxtrades.sol"
const SOL_TLD_AUTHORITY = new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"); // top-level-domain // NameAccountKey
// signature of authority to validate actually wallet address match inputkey we trust
const getDomainKey = async (domain) => {
    try {
        let hashedDomain = await getHashedName(domain); // hash domain user input
        let inputDomainKey = await getNameAccountKey(hashedDomain, undefined, SOL_TLD_AUTHORITY); // get DomainKey từ hashdomain
        return {inputDomainKey, hashedInputName: hashedDomain}
    } catch(err) {
        console.log(err)
    }
}

const main = async () => {
    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
    const {inputDomainKey} = await getDomainKey(accountName.replace(".sol", "")); // get DomainKey
    const registry = await NameRegistryState.retrieve(connection, inputDomainKey); // get wallet registry from domainKey and network
    console.log(registry.owner.toBase58()); // result is wallet registry this domain
}

main();

