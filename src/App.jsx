import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
	const [currentAccount, setCurrentAccount] = useState('');
  const[allWaves, setAllWaves] = useState([]);
	const contractAddress = '0x96C9008781c8FD8d906299260B9853C65ef93f7C';
	const contractABI = abi.abi;
// const getAllWaves = async () => {
//   const { ethereum } = window;

//   try {
//     if (window.ethereum) {
//       const provider = new ethers.providers.Web3Provider(ethereum);
//       const signer = provider.getSigner();
//       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
//       const waves = await wavePortalContract.getAllWaves();

//       const wavesCleaned = waves.map(wave => {
//         return {
//           address: wave.waver,
//           timestamp: new Date(wave.timestamp * 1000),
//           message: wave.message,
//         };
//       });

//       setAllWaves(wavesCleaned);
//     } else {
//       console.log("Ethereum object doesn't exist!");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// /**
//  * Listen in for emitter events!
//  */
// useEffect(() => {
//   let wavePortalContract;

//   const onNewWave = (from, timestamp, message) => {
//     console.log("NewWave", from, timestamp, message);
//     setAllWaves(prevState => [
//       ...prevState,
//       {
//         address: from,
//         timestamp: new Date(timestamp * 1000),
//         message: message,
//       },
//     ]);
//   };

//   if (window.ethereum) {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();

//     wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
//     wavePortalContract.on("NewWave", onNewWave);
//   }

//   return () => {
//     if (wavePortalContract) {
//       wavePortalContract.off("NewWave", onNewWave);
//     }
//   };
// }, []);
const getAllWaves = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);

        wavePortalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);

          setAllWaves(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          }]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  
	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log('Make sure you have metamask!');
				return;
			} else {
				console.log('We have the ethereum object', ethereum);
			}

			const accounts = await ethereum.request({ method: 'eth_accounts' });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log('Found an authorized account:', account);
				setCurrentAccount(account);
			} else {
				console.log('No authorized account found');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert('Get MetaMask!');
				return;
			}

			const accounts = await ethereum.request({
				method: 'eth_requestAccounts'
			});

			console.log('Connected', accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error);
		}
	};

	const wave = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				let count = await wavePortalContract.getTotalWaves();
				document.getElementById(
					'totalWaves'
				).innerHTML = `Total waves 👋 : ${count}`;

				document.getElementById('surprise').addEventListener('click', go);
				function go() {
					window.open('https://rahulkarda.netlify.app', '_blank');
					console.log('Retrieved total wave count...', count.toNumber());
				}

				// const waveTxn = await wavePortalContract.wave();
				let message = document.getElementById('message').value;
				const waveTxn = await wavePortalContract.wave(message, {
					gasLimit: 300000
				});
				console.log('Message: ', message);
				console.log('Mining...', waveTxn.hash);

				await waveTxn.wait();
				console.log('Mined -- ', waveTxn.hash);

				count = await wavePortalContract.getTotalWaves();
				console.log('Retrieved total wave count...', count.toNumber());
				document.getElementById(
					'totalWaves'
				).innerHTML = `Total waves 👋 : ${count}`;
				document.getElementById('surprise').innerHTML = 'Surprise Link';
			} else {
				document.getElementById(
					'totalWaves'
				).innerHTML = `Total waves 👋 : ${count}`;
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);


	return (
		<div className="mainContainer">
			<div className="dataContainer">
				<div className="header">👋 Hey there!</div>

				<div className="bio">
				<p>I am <a href="https://rahulkarda.netlify.app">Rahul</a> and I'm
					building some decentralized Blockchain projects. Pretty cool right? </p>
					<p> Connect your Ethereum wallet to wave at me, send me cake or share some hype!</p>
					{!currentAccount && (
						<button className="waveButton connectBtn" onClick={connectWallet}>
							Connect MetaMask
						</button>
					)}
         {allWaves.map((wave, index) => {
          return (
            <div style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
				</div>
        

				<div id="messageBox">
					<input type="text" id="message" placeholder="Enter your message" />
				</div>
				<div className="button">
					<button className="waveButton waveBtn" onClick={wave}>
						Wave at Me 👋
					</button>
					<button className="waveButton cakeBtn" onClick={wave}>
						Send me cake 🍰
					</button>
					<button className="waveButton hypeBtn" onClick={wave}>
						Share some hype 🔥
					</button>
				</div>
        <div id="totalWaves"></div>
    <div id="surprise"></div>
				<div className="footer">
					<p>All Rights Reserved © 2022</p>
					<p>Designed by Rahul Karda</p>
					<a href="https://github.com/rahulkarda">
						<i className="fa-brands fa-github" />
					</a>
				</div>
			</div>
      
		</div>
    
	);
};

export default App;
