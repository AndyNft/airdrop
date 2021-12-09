const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  Account,
} = require("@solana/web3.js");

//STEP-1 Generating a new wallet keypair
const newPair = new Keypair();
console.log(newPair);

//STEP-2 Storing the public and private key
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const secretKey = newPair._keypair.secretKey;

//STEP-3 Getting the wallet Balance
const getWalletBalance = async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const myWallet = await Keypair.fromSecretKey(secretKey);
    const walletBalance = await connection.getBalance(
      new PublicKey(myWallet.publicKey)
    );
    console.log(`=> For wallet address ${publicKey}`);
    console.log(`   Wallet balance: ${parseInt(walletBalance)/LAMPORTS_PER_SOL}SOL`);
  } catch (err) {
    console.log(err);
  }
};

//STEP-4 Air dropping SOL (in terms of LAMPORTS)
const airDropSol = async (membership) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const walletKeyPair = await Keypair.fromSecretKey(secretKey);
    let drop=0;
    if (membership == "Diamond Hands"){
      drop=5;
    }
    else if (membership == "Paper Hands"){
      drop=2;
    }
    else 
    {
      console.log("No Airdrop for Non Members")
    }
    
    if (membership == "Paper Hands" || "Diamond Hands") {
      console.log(`-- Airdropping ` + drop + ` SOL to ` + membership);
      const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(walletKeyPair.publicKey),
       drop * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(fromAirDropSignature);
      }
  } catch (err) {
    console.log(err);
  }
};

//STEP-5 Driver function modified for taking input
const driverFunction = async (membership) => {
    await getWalletBalance();
    await airDropSol(membership);
    await getWalletBalance();
}

//Sleep fucntion to avoid rate limiting from Solana 
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Testing multiple Calls
const runnerFunction = async () => {
console.log("Test Run #1");
await driverFunction("Diamond Hands");
await sleep(7000);
console.log("Test Run #2");
await driverFunction("Paper Hands");
await sleep(7000);
console.log("Test Run #3");
await driverFunction("Enthusiasts");
}

runnerFunction();