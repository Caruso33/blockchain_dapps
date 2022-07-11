import React from "react";
import { ethers } from "ethers";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";
import deployment from "../utils/deployment.json";

export default function StorageFactory() {
  const [storageIndex, setStorageIndex] = useState("");
  const [storageValue, setStorageValue] = useState("");

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
          Create
        </button>
        <h2>Get storage counter</h2>
        <button
          onClick={async () => {
            const counter = await storageFactory?.simpleStorageCounter();
            console.log(counter);
          }}
        >
          Get counter
        </button>

        <br />

        <input
          type="number"
          placeholder="Type storage index"
          value={storageIndex}
          onChange={(e) => setStorageIndex(e.target.value)}
        />

        <h2>Get storage</h2>
        <button
          onClick={async () => {
            if (!storageIndex) return;

            const storage = await storageFactory?.sfGet(storageIndex);
            console.log(storage);
          }}
        >
          Get Storage of current storage index
        </button>

        <h2>Save storage</h2>
        <input
          type="number"
          placeholder="Storage number"
          value={storageValue}
          onChange={(e) => setStorageValue(e.target.value)}
        />
        <button
          onClick={async () => {
            if (!storageValue || isNaN(Number(storageValue))) return;

            await storageFactory?.sfStore(Number(storageValue));
          }}
        >
          Save storage
        </button>
      </>
    )
  );
}
