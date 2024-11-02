import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { ethers } from "ethers";
import { Scanner } from '@yudiel/react-qr-scanner';
import contractABI from './Abi.json'


function App() {

  const [walletAddress, setWalletAddress] = useState("");
  const [contractData, setContractData] = useState(null);
  const [balance, setBalance] = useState("");
  const [upiId,setUpiId]=useState("")
  const [upiURL,setUpiURL]=useState("")
  const [amount,setAmount]=useState(0)
  const [amountInInr,setAmountInInr]=useState("")
  const contractAddress = "0x8b3244cc9B47A923Fdf72c0d06C1513d8BD0EA84";


  
   

   

   const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
         try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setWalletAddress(address);
         } catch (error) {
            console.error("Error connecting to MetaMask:", error);
         }
      } else {
         alert("Please install MetaMask to connect your wallet.");
      }
   };
   const sendAmount = async () => {
    if (!walletAddress) {
       alert("Please connect your wallet first.");
       return;
    }

    try {
       const provider = new ethers.providers.Web3Provider(window.ethereum);
       const signer = provider.getSigner();
       const contract = new ethers.Contract(contractAddress, contractABI, signer);

       // Sending amount as Ether (converted to Wei)
       const tx = await contract.sendAmount(upiURL, (amountInInr).toString(), {
          value: ethers.utils.parseEther(amount.toString()), // Ensure this is in Wei
       });

       console.log("Transaction sent:", tx);
       
       // Wait for the transaction to be mined
       const receipt = await tx.wait();
       console.log("Transaction mined:", receipt);

       alert("Transaction successful!");
    } catch (error) {
       console.error("Error calling sendAmount:", error);
    }
 };

   const callSmartContractFunction = async () => {
      if (!walletAddress) {
         alert("Please connect your wallet first.");
         return;
      }

      try {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();
         const contract = new ethers.Contract(contractAddress, contractABI, signer);

         const data = await contract.paymentRecieved(); // Adjust parameters as needed
         setContractData(data);
         console.log("Contract function result:", data);
      } catch (error) {
         console.error("Error calling contract function:", error);
      }
   };
  return (
    <div className="App">
     {/* <button onClick={async ()=>{

      const result=await axios.get("http://localhost:3000/");
      alert(result.data)

     }}>click</button> */}
     <br></br>
     <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button onClick={connectWallet} style={{ padding: "10px 20px", fontSize: "16px" }}>
        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
      </button>
      {walletAddress && <p>Connected Address: {walletAddress}</p>}
      <br></br>
      {balance}
    </div>
    <br></br>
<center>
    <div style={{width:'10em'}}>
    <Scanner onScan={(result) => {
      
      console.log(result[0].rawValue)

      const upiString = result[0].rawValue;
      setUpiURL(upiString)
console.log(upiString)
// Extract the UPI ID using a regular expression
      const upiIdMatch = upiString.match(/pa=([^&]*)/);
      const upi = upiIdMatch ? upiIdMatch[1] : null;

      console.log(upiId); // Output: "9305590863@ybl"

      setUpiId(upi)

    }} />;

    </div>
    </center>
   <br></br>
   <br></br>
   {upiId}
   <br></br>
   <br></br>
   {amount} MATIC
   <br></br>
   <br></br>
   <input placeholder="Enter Amount in INR" onChange={async (e)=>{

        let result=await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=inr");
        result=result.data["matic-network"].inr;
        setAmountInInr(e.target.value)
       setAmount((e.target.value/result).toFixed(18))

}}></input>
   <br></br>
   <br></br>
   <button style={{ padding: "10px 20px", fontSize: "16px" }} onClick={sendAmount}>Pay</button>
   <br></br>
   <br></br>
   <button style={{ padding: "10px 20px", fontSize: "16px" }} onClick={callSmartContractFunction}>Payment Recieved</button>
    </div>
  );
}

export default App;



