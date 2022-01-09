import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers"
import Posts from "./artifacts/contracts/Posts.sol/Posts.json"
import { useState } from "react"

const Post_contract = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"

function App() {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [image, setImage] = useState("")

  async function requestAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts)
  }

  async function get_All_User_Posts() {
    if (window.ethereum !== undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(Post_contract, Posts.abi, provider)
      try {
        const data = await contract.get_Posts()
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
  }


  async function handle_submit() {
    if (title === "" && desc === "" && image === "") return

    if (window.ethereum !== undefined) {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Post_contract, Posts.abi, signer)
      const transaction = await contract.createPost(title, desc, image)
      await transaction.wait()
      get_All_User_Posts()
    }
  }


  async function sendAmount() {


    if (window.ethereum !== undefined) {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Post_contract, Posts.abi, signer)
      const options = { value: ethers.utils.parseEther("1.0") }
      const transaction = await contract.donate(0, options)
      await transaction.wait()
      get_All_User_Posts()
    }
  }
  // async function Provider_check() {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  //   console.log(window.ethereum._state)
  // }
  console.log(ethers.utils.formatEther("0x0de0b6b3a7640000"))

  return (
    <div className="App">
      <button onClick={requestAccount} className="">Connect Wallet</button>
      <button onClick={get_All_User_Posts}>get Posts</button>


      <div className="box">
        <input
          placeholder="Title"
          onChange={e => setTitle(e.target.value)} />

        <textarea
          rows="4"
          cols="30"
          onChange={e => setDesc(e.target.value)}
        >
        </textarea>

        <input
          placeholder="Image"
          onChange={e => setImage(e.target.value)}
        />

        <button onClick={handle_submit}>submit</button>
      </div>
      <button onClick={sendAmount}>Donate</button>
    </div>
  );
}

export default App;
