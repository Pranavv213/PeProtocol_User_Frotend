import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { ethers } from "ethers";
import { Scanner } from '@yudiel/react-qr-scanner';
import contractABI from './Abi.json'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import India from './assets/india.png'
import UAE from './assets/united-arab-emirates.png'
import Taiwan from './assets/taiwan.png'
import Singapore from './assets/singapore.png'
import peerfi from './assets/peerfi.png'
function App() {

  const [walletAddress, setWalletAddress] = useState("");
  const [contractData, setContractData] = useState(null);
  const [balance, setBalance] = useState("");
  const [upiId,setUpiId]=useState("")
  const [upiURL,setUpiURL]=useState("")
  const [amount,setAmount]=useState(0)
  const [amountInInr,setAmountInInr]=useState("")
  const [country,setCountry]=useState("")
  const [paymentRecieved,setPaymentRecieved]=useState(false)
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
       const tx = await contract.sendAmount(upiURL, amountInInr.toString(), {
          value: ethers.utils.parseEther(amount.toString()), // Ensure this is in Wei
       });

       console.log("Transaction sent:", tx);
       
       // Wait for the transaction to be mined
       const receipt = await tx.wait();
       console.log("Transaction mined:", receipt);

       alert("Transaction successful!");
       setPaymentRecieved(true)
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
    <div className="App" >
     {/* <button onClick={async ()=>{

      const result=await axios.get("http://localhost:3000/");
      alert(result.data)

     }}>click</button> */}
     <br></br>
     <img style={{width:'15em'}} src={peerfi}></img>
     <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button class="button-17" role="button" onClick={connectWallet} style={{ padding: "10px 20px", fontSize: "16px" }}>
        {walletAddress ? walletAddress.slice(0, 4)+"..."+walletAddress.slice(-4) : "Connect Wallet"}
      </button>
      {/* {walletAddress && <p>Connected Address: {walletAddress}</p>} */}
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
   <DropdownButton id="dropdown-basic-button" title={country==""?"Select Country":<div><img style={{width:'2em'}} src={India}></img> &nbsp; India </div>}>
      <Dropdown.Item onClick={()=>{
        setCountry("India")
      }}><img style={{width:'2em'}} src={India}></img> &nbsp; India</Dropdown.Item>
      <Dropdown.Item onClick={()=>{
        setCountry("India")
      }}><img style={{width:'2em'}} src={UAE}></img> &nbsp; UAE</Dropdown.Item>
      <Dropdown.Item onClick={()=>{
        setCountry("India")
      }}><img style={{width:'2em'}} src={Singapore}></img> &nbsp; Singapore</Dropdown.Item>
      <Dropdown.Item onClick={()=>{
        setCountry("India")
      }}><img style={{width:'2em'}} src={Taiwan}></img> &nbsp; Taiwan</Dropdown.Item>
    </DropdownButton>
   <br></br>
   <l style={{color:'white'}}>{upiId}</l>
   <br></br>
  
   <l style={{color:'white'}}>{amount} MATIC</l>
 
   <br></br>
   <br></br>
   <input placeholder="Enter Amount" onChange={async (e)=>{

        // let result=await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=inr");
        // result=result.data["matic-network"].inr;
        let result=26.89
        setAmountInInr((e.target.value/1).toFixed(3))
       setAmount((e.target.value/result).toFixed(18))

}}></input>
   <br></br>
 <br></br>
 {!paymentRecieved ? <button class="button-85" role="button" onClick={sendAmount}>Pay</button>:<button class="button-85" role="button"  onClick={callSmartContractFunction}>Payment Recieved</button> }
   

   <br></br>
   <br></br>  <br></br>  <br></br>  <br></br>
    </div>
  );
}

export default App;








