// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";

import "../src/InsuranceManager.sol";
import "../src/JagaStake.sol";
import "../src/JagaToken.sol";
import "../src/DAOGovernance.sol";
import "../src/ClaimManager.sol";
import "../src/MorphoReinvest.sol";
import "../src/mock/MockUSDC.sol";
import "../src/mock/MockMorphoVault.sol";

contract DeployJaga is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy Mock USDC
        MockUSDC usdc = new MockUSDC();
        console2.log("USDC deployed at:", address(usdc));

        // Deploy Mock Morpho Vault
        MockMorphoVault morpho = new MockMorphoVault(address(usdc));
        console2.log("Morpho deployed at:", address(morpho));

        // Deploy main contracts
        InsuranceManager insuranceManager = new InsuranceManager(
            address(usdc),
            100,
            300,
            500,
            30 days
        );
        JagaStake jagaStake = new JagaStake(address(usdc));
        JagaToken jagaToken = JagaToken(jagaStake.getJagaToken());
        DAOGovernance dao = new DAOGovernance(
            address(jagaToken),
            address(insuranceManager)
        );
        ClaimManager claimManager = new ClaimManager(address(usdc));
        MorphoReinvest morphoReinvest = new MorphoReinvest(
            address(morpho),
            address(usdc)
        );

        // Set configurations:
        insuranceManager.setConfig(
            address(jagaStake),
            address(claimManager),
            address(morphoReinvest)
        );
        jagaStake.setConfig(address(insuranceManager), address(claimManager));
        dao.setConfig(address(jagaToken), address(insuranceManager));
        claimManager.setConfig(address(dao), address(jagaStake));

        vm.stopBroadcast();

        console.log("InsuranceManager deployed at:", address(insuranceManager));
        console.log("JagaStake deployed at:", address(jagaStake));
        console.log("JagaToken deployed at:", address(jagaToken));
        console.log("DAOGovernance deployed at:", address(dao));
        console.log("ClaimManager deployed at:", address(claimManager));
        console.log("MorphoReinvest deployed at:", address(morphoReinvest));
    }

    // Phase 1: Deploy mocks (USDC, MockMorphoVault)
    function runPhase1() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);
        MockUSDC usdc = new MockUSDC();
        console2.log("USDC deployed at:", address(usdc));
        MockMorphoVault morpho = new MockMorphoVault(address(usdc));
        console2.log("Morpho deployed at:", address(morpho));
        vm.stopBroadcast();
    }

    // Phase 2: Deploy InsuranceManager + JagaStake (requires USDC_ADDRESS)
    function runPhase2() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address usdc = vm.envAddress("USDC_ADDRESS");
        vm.startBroadcast(pk);
        InsuranceManager insuranceManager = new InsuranceManager(usdc, 100, 300, 500, 30 days);
        console2.log("InsuranceManager deployed at:", address(insuranceManager));
        JagaStake jagaStake = new JagaStake(usdc);
        console2.log("JagaStake deployed at:", address(jagaStake));
        JagaToken jagaToken = JagaToken(jagaStake.getJagaToken());
        console2.log("JagaToken derived at:", address(jagaToken));
        vm.stopBroadcast();
    }

    // Phase 3: Deploy DAO + ClaimManager + MorphoReinvest
    // Requires: USDC_ADDRESS, MORPHO_VAULT_ADDRESS, INSURANCE_MANAGER_ADDRESS, JAGA_TOKEN_ADDRESS
    function runPhase3() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address usdc = vm.envAddress("USDC_ADDRESS");
        address morpho = vm.envAddress("MORPHO_VAULT_ADDRESS");
        address insurance = vm.envAddress("INSURANCE_MANAGER_ADDRESS");
        address jagaToken = vm.envAddress("JAGA_TOKEN_ADDRESS");
        vm.startBroadcast(pk);
        DAOGovernance dao = new DAOGovernance(jagaToken, insurance);
        console2.log("DAOGovernance deployed at:", address(dao));
        ClaimManager claimManager = new ClaimManager(usdc);
        console2.log("ClaimManager deployed at:", address(claimManager));
        MorphoReinvest morphoReinvest = new MorphoReinvest(morpho, usdc);
        console2.log("MorphoReinvest deployed at:", address(morphoReinvest));
        vm.stopBroadcast();
    }

    // Phase 4: Wire configurations using env-provided addresses
    // Requires: JAGA_STAKE_ADDRESS, INSURANCE_MANAGER_ADDRESS, DAO_GOVERNANCE_ADDRESS,
    //           CLAIM_MANAGER_ADDRESS, MORPHO_REINVEST_ADDRESS, JAGA_TOKEN_ADDRESS
    function runWire() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address jagaStakeAddr = vm.envAddress("JAGA_STAKE_ADDRESS");
        address insuranceAddr = vm.envAddress("INSURANCE_MANAGER_ADDRESS");
        address daoAddr = vm.envAddress("DAO_GOVERNANCE_ADDRESS");
        address claimAddr = vm.envAddress("CLAIM_MANAGER_ADDRESS");
        address reinvestAddr = vm.envAddress("MORPHO_REINVEST_ADDRESS");
        address jagaTokenAddr = vm.envAddress("JAGA_TOKEN_ADDRESS");

        vm.startBroadcast(pk);
        JagaStake jagaStake = JagaStake(jagaStakeAddr);
        InsuranceManager insuranceManager = InsuranceManager(insuranceAddr);
        DAOGovernance dao = DAOGovernance(daoAddr);
        ClaimManager claimManager = ClaimManager(claimAddr);
        MorphoReinvest morphoReinvest = MorphoReinvest(reinvestAddr);

        insuranceManager.setConfig(address(jagaStake), address(claimManager), address(morphoReinvest));
        jagaStake.setConfig(address(insuranceManager), address(claimManager));
        dao.setConfig(jagaTokenAddr, address(insuranceManager));
        claimManager.setConfig(address(dao), address(jagaStake));
        vm.stopBroadcast();
    }

}

