import { useAccount, useConnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { deployedChains } from "../utils/constants.ts";

function Header() {
  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  let content: JSX.Element;

  if (!isConnected)
    content = <button onClick={() => connect()}>Connect Wallet</button>;
  else {
    content = <div>Connected to {address}</div>;

    const deployedChainNames = deployedChains.map(
      (deployedChain) => deployedChain.name
    );

    if (
      chains?.filter((chain) => deployedChainNames.includes(chain?.name))
        ?.length === 0 ||
      !deployedChainNames?.includes(chain?.name)
    ) {
      return (
        <>
          {content}
          <div>Please connect to {deployedChainNames[0]} chain</div>
        </>
      );
    }
  }

  return content;
}

export default Header;
