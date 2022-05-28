import { ethers } from "ethers";
import contractData from "../../public/contracts.json";

async function getContracts() {
  const { contracts } = contractData;
  const token = await new ethers.Contract(
    contracts.Token.address,
    contracts.Token.abi
    // ethers.getDefaultProvider()
  );

  const exchange = await new ethers.Contract(
    contracts.Exchange.address,
    contracts.Exchange.abi
  );

  return { contractData, token, exchange };
}

export default getContracts;
