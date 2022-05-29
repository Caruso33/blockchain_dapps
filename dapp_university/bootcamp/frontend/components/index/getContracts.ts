import { ethers } from "ethers";
import deployments from "../../public/deployments.json";

async function getContracts(chainId: number) {
  if (!chainId) return null;

  const deploymentChainData = deployments[`${chainId}`];
  if (!deploymentChainData) return null;

  const contractData = deploymentChainData[0];
  if (!contractData) return null;

  const tokenContract = await new ethers.Contract(
    contractData.contracts.Token.address,
    contractData.contracts.Token.abi
  );

  const exchangeContract = await new ethers.Contract(
    contractData.contracts.Exchange.address,
    contractData.contracts.Exchange.abi
  );

  return { contractData, tokenContract, exchangeContract };
}

export default getContracts;
