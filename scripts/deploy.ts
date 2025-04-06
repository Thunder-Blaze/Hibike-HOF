import { task } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";

task("deploy", "Deploys the MusicNFT contract").setAction(async (_, { ethers }) => {
  const MusicNFT = await ethers.getContractFactory("MusicNFT");
  const musicNFT = await MusicNFT.deploy();
  await musicNFT.waitForDeployment();

  const address = await musicNFT.getAddress();
  console.log("MusicNFT deployed to:", address);
});

export default {}; 