import { ethers } from "ethers";
import contractData from "../../public/contracts.json";

async function getContracts(chainId) {
  if (!chainId) return {};

  const { contracts } = contractData;

  const tokenContract = await new ethers.Contract(
    contracts.Token.address,
    contracts.Token.abi
  );

  const exchangeContract = await new ethers.Contract(
    contracts.Exchange.address,
    contracts.Exchange.abi
  );

  return { contractData, tokenContract, exchangeContract };
}

export default getContracts;
