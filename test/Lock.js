
describe("AAVE", function () {
  let aavecontract;
  
  
  it("Deployment",async function () {
    
    console.log("HI");
    const accounts=await ethers.getSigners();

    const provider = new hre.ethers.getDefaultProvider("http://127.0.0.1:8545/");
    const {chainId}=await provider.getNetwork()
    console.log(Number(chainId));
    const aavefactory=await hre.ethers.getContractFactory("FlashLoan",provider.getSigner());
    console.log("HI");
    
     aavecontract=await aavefactory.deploy("0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e");
    const x= await aavecontract.waitForDeployment();


    console.log("AAVE deployed to:",aavecontract.target);
    const WETH="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const USDC="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const pricefor1ethinusdc=await aavecontract.getAmountOutMin(USDC,WETH,10**10);
    console.log("Price for 1 eth in usdc",pricefor1ethinusdc);
    
    const USDC_WHALE_ADDRESS="0x51C72848c68a965f66FA7a88855F9f7784502a7F";
    const ERC20_ABI=[{
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },{
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },{
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }]

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_WHALE_ADDRESS],
  });
  // console.log(accounts[0]);
    const signer=accounts[0];
  const t=await signer.sendTransaction({
    to: USDC_WHALE_ADDRESS,
    value: ethers.parseEther("50.0"), // Sends exactly 50.0 ether
  });
  await t.wait();

  const whaleSigner=await ethers.getSigner(USDC_WHALE_ADDRESS);
  const whaleContract=new ethers.Contract(USDC,ERC20_ABI,whaleSigner);
  const balance=await whaleContract.balanceOf(USDC_WHALE_ADDRESS);
  const HUNDERED_USDC=10**9;
  const tx=await whaleContract.transfer(await provider.getSigner(),HUNDERED_USDC);
  await tx.wait();

  
  const tx2=await whaleContract.connect(accounts[0]).approve(aavecontract.target,HUNDERED_USDC);
  await tx2.wait();

  const tx3=await aavecontract.swapTokens(USDC,WETH,HUNDERED_USDC,0,accounts[0].address,20227458);
  await tx3.wait();

  console.log("USDC balance of whale",balance.toString());

  const balance2 =await aavecontract.balanceOfuserfortoken(WETH,accounts[0].address);
  console.log("WETH balance of user",balance2.toString());
  const path1=[WETH,USDC];
  // const path=[USDC,WETH,USDC]
  const uniswap=await aavecontract.UNISWAP_getAmountsOutMin(path1,HUNDERED_USDC)
  console.log("Uniswap check",uniswap[1].toString());
  
  const path2=[USDC,WETH]
  const sushiswap=await aavecontract.SUSHISWAP_getAmountsOutMin(path2,uniswap[1])
  console.log("Sushiswap check",sushiswap[1].toString());
  // console.log("Arbitrage check",arbitragecheck[path.length-1].toString());
  });


  
});
