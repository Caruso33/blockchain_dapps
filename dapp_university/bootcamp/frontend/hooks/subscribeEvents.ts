import { Listener } from "@ethersproject/providers";
import { ethers } from "hardhat";

function subscribeEvents(
  provider: ethers.providers.Provider,
  eventName: string,
  listener: Listener
) {
  console.log(`Subscribing to ${eventName} events`);
  provider.on(eventName, listener);
}

function subscribeCancelOrderEvents(provider: ethers.providers.Provider) {
  const listener: Listener = (args: any) => console.dir("args", args);

  subscribeEvents(provider, "CancelOrderEvent", listener);
}

export { subscribeCancelOrderEvents };
