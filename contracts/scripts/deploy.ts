import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  console.log("Deploying MemoryGarden to Hardhat");

  const memoryGarden = await viem.deployContract("MemoryGarden");

  console.log("MemoryGarden deployed to:", memoryGarden.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});