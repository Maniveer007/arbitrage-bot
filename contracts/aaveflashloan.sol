// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
// import '@uniswap/v2-periphery/contracts/interfaces/IERC20.sol';
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract FlashLoan is FlashLoanSimpleReceiverBase {
    address payable owner;
    IUniswapV2Router02 public uniswapRouter;
    address private constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IUniswapV2Router02 public sushiRouter;
    address private constant SUSHISWAP_V2_ROUTER = 0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F;
    // 301617920392831411 - uniswap
    // 300200860592926873 - pancakeswap 
    // 301510568452589683 - sushiswap

    constructor(address _addressProvider)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
        uniswapRouter = IUniswapV2Router02(UNISWAP_V2_ROUTER);
        sushiRouter = IUniswapV2Router02(SUSHISWAP_V2_ROUTER);
    }

    function triggerflashloan(address _token, uint256 _amount) public {
        address receiverAddress = address(this);
        address asset = _token;
        uint256 amount = _amount;
        bytes memory params = "";
        uint16 referralCode = 0;

        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );
    }


    /**
        This function is called after your contract has received the flash loaned amount
     */
    function  executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    )  external override returns (bool) {
        
        //Logic goes here
        
        uint256 totalAmount = amount + premium;
        IERC20(asset).approve(address(POOL), totalAmount);

        return true;
    }

    function balanceofthis(address _assert) external view  returns(uint){
        return IERC20(_assert).balanceOf(address(this));
    }

    function withdraw(address _assert) external {
        IERC20(_assert).transfer(msg.sender,IERC20(_assert).balanceOf(address(this)));
    }

    receive() external payable {}





    function swapTokens(
        address _tokenIn,
        address _tokenOut,
        uint _amountIn,
        uint _amountOutMin,
        address _to,
        uint _deadline
    ) external {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_tokenIn).approve(address(uniswapRouter), _amountIn);

        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        uint[] memory output=uniswapRouter.swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            _to,
            block.timestamp
        );
        console.log(output[0],output[1]);
    }

    function getAmountOutMin(
        address _tokenIn,
        address _tokenOut,
        uint _amountIn
    ) external view returns (uint[] memory) {
        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        uint[] memory amountsOut = uniswapRouter.getAmountsOut(_amountIn, path);
        return amountsOut;
    }

    function UNISWAP_getAmountsOutMin(
        address[] memory path,
        uint _amountIn
    ) external view returns (uint[] memory) {
        uint[] memory amountsOut = uniswapRouter.getAmountsOut(_amountIn, path);
        return amountsOut;
    }
    function SUSHISWAP_getAmountsOutMin(
        address[] memory path,
        uint _amountIn
    ) external view returns (uint[] memory) {
        uint[] memory amountsOut = sushiRouter.getAmountsOut(_amountIn, path);
        return amountsOut;
    }

    function balanceOfuserfortoken(address _token,address user) external view returns(uint){
        return IERC20(_token).balanceOf(user);
    }

}