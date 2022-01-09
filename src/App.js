import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers"
import Posts from "./artifacts/contracts/Posts.sol/Posts.json"
import { useState, useEffect } from "react"

const Post_contract = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"

function App() {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [image, setImage] = useState("")
  const [posts, setPosts] = useState([])

  useEffect(() => {
    get_All_Posts()
  }, [])

  async function requestAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts)
  }

  async function get_All_Posts() {
    if (window.ethereum !== undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(Post_contract, Posts.abi, provider)
      try {
        const data = await contract.get_Posts()
        setPosts(data)
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
      get_All_Posts()
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
      get_All_Posts()
    }
  }

  console.log(posts)
  return (
    <div className="App">
      <button onClick={requestAccount} className="">Connect Wallet</button>

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


      <div className="posts_box">
        {
          posts.map(v => {
            return (
              <div className="card">
                <h1>{v?.title}</h1>
                <div>{v?.content}</div>
                <button onClick={sendAmount}>Donate</button>
                {v?.author.toLowerCase() === window.ethereum._state.accounts[0] && <button onClick={sendAmount}>Withdraw</button>}
              </div>
            )
          })
        }
      </div>

    </div>
  );
}

export default App;
