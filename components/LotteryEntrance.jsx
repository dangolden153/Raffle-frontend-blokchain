import { useEffect, useState } from 'react';
import { useWeb3Contract } from 'react-moralis';
import { useMoralis } from 'react-moralis'
import { constractAddress, contractAbi } from '../constants'
import { ethers } from 'ethers'
import { useNotification } from 'web3uikit'


function LotteryEntrance() {
  const [entranceFee, setEntranceFee] = useState("0")
  const [recentWinner, setRecentWinner] = useState()
  const [numPlayers, setNumplayers] = useState("")
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const notification = useNotification()
  const raffleAddress = chainId in constractAddress ? constractAddress[chainId][0] : null

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  })


  const { runContractFunction: getentranceFee } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: raffleAddress,
    functionName: "getentranceFee",
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  })

  const { runContractFunction: getNumberPlayers } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: raffleAddress,
    functionName: "getNumberPlayers",
    params: {},
  })

  const updateUi = async () => {
    const entranceFeeCoantract = (await getentranceFee()).toString()
    const numPlayersFromContxt = (await getNumberPlayers()).toString()
    const recentWinneFromContxt = await getRecentWinner()
    setEntranceFee(entranceFeeCoantract)
    setNumplayers(numPlayersFromContxt)
    setRecentWinner(recentWinneFromContxt)
  }

  useEffect(() => {
    if (!raffleAddress) return
    if (isWeb3Enabled) {
      
      updateUi()
    }
  }, [isWeb3Enabled])


  const handleEnterRaffle = async () => {
    await enterRaffle({
      onSuccess: handleNotificationSuccess
    })
    console.log("enterRaffle")
  }


  const handleNotificationSuccess = async (tx) => {
    await tx.wait(1)
    handleNotification(tx)
    updateUi()
  }

  const handleNotification = async (tx) => {
    notification({
      type:"info",
      title: "Transaction Notificarion",
      message: "Transaction completed!",
      status: "success",
      position: "topR",
      // icon: "bell"
    })
  }






  return (
    <div style={{marginLeft:"20px"}}>
      
      <div>
        {raffleAddress ? (<h2>Hi, your Lottery Entrance: {ethers.utils.formatUnits(entranceFee, "ether")}ETH</h2>) : (
          <h2>Hi, You don't have a Raffle Address!</h2>
        )}
        <p >Number of players: {numPlayers}</p>
        <p>Recent winner:{""} {recentWinner}</p>
      </div>
      <button
        onClick={handleEnterRaffle}
        style={{padding:"10px"}}
      >
        Enter Raffle
      </button>

    </div>
  )
}

export default LotteryEntrance