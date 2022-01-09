import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers"
import Posts from "./artifacts/contracts/Posts.sol"

const contract = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contract, Posts.abi, provider)
      try {
        const data = await contract.blogCount()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  return (
    <div className="App">
      <button onClick={fetchGreeting} className="">press</button>
    </div>
  );
}

export default App;
