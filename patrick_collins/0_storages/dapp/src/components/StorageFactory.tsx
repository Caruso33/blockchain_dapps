import { ethers } from "ethers";
import React, { useState } from "react";
import { useAccount, useSigner } from "wagmi";
import deployment from "../utils/deployment.json";
import Spinner from "./Spinner.tsx";

export default function StorageFactory() {
  const [storageIndex, setStorageIndex] = useState("");
  const [storageValue, setStorageValue] = useState("");

  const [simpleStorageCounter, setSimpleStorageCounter] = useState(0);
  const [simpleStorageValue, setSimpleStorageValue] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const { isConnected } = useAccount();
  const { data: signer } = useSigner();

  const storageFactory = signer
    ? new ethers.Contract(deployment.address, deployment.abi, signer)
    : null;

  return (
    isConnected && (
      <>
        <h2>Create new simple storage</h2>
        <button onClick={() => storageFactory?.createSimpleStorageContract()}>
          {isLoading ? <Spinner /> : "Create"}
        </button>
        <h2>Get storage counter</h2>
        <button
          onClick={async () => {
            const counter = await storageFactory?.simpleStorageCounter();
            console.log("SimpleStorageCounter: ", counter.toNumber());
            setSimpleStorageCounter(counter.toNumber());
          }}
        >
          {isLoading ? <Spinner /> : "Get counter"}
        </button>
        <pre>Simple Storage Counter: {simpleStorageCounter}</pre>
        <h2>Set storage index</h2>
        <label>Storage Index 0-indexed</label>{" "}
        <input
          type="number"
          placeholder="Type storage index"
          value={storageIndex}
          onChange={(e) => setStorageIndex(e.target.value)}
        />
        <h2>Get storage</h2>
        <button
          onClick={async () => {
            if (!storageIndex || isNaN(Number(storageIndex))) return;

            const value = await storageFactory?.sfGet(
              Number(storageIndex).toFixed(0)
            );
            console.log("SimpleStorageValue: ", value.toNumber());
            setSimpleStorageValue(value.toNumber());
          }}
        >
          {isLoading ? <Spinner /> : "Get Storage of current storage index"}
        </button>
        <pre>Simple Storage Value: {simpleStorageValue}</pre>
        <h2>Save storage</h2>
        <input
          type="number"
          placeholder="Storage number"
          value={storageValue}
          onChange={(e) => setStorageValue(e.target.value)}
        />
        <button
          onClick={async () => {
            if (
              !storageIndex ||
              isNaN(Number(storageIndex)) ||
              !storageValue ||
              isNaN(Number(storageValue))
            )
              return;

            setIsLoading(true);
            try {
              const tx = await storageFactory?.sfStore(
                storageIndex,
                Number(storageValue)
              );
              await tx.wait();
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {isLoading ? <Spinner /> : "Save storage"}
        </button>
      </>
    )
  );
}
