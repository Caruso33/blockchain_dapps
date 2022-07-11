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

  async function createSimpleStorage() {
    setIsLoading(true);
    try {
      const tx = await storageFactory?.createSimpleStorageContract();
      await tx.wait();
    } finally {
      setIsLoading(false);
    }
  }

  async function getStorageCounter() {
    setIsLoading(true);
    try {
      const counter = await storageFactory?.simpleStorageCounter();
      console.log("SimpleStorageCounter: ", counter.toNumber());
      setSimpleStorageCounter(counter.toNumber());
    } finally {
      setIsLoading(false);
    }
  }

  async function getStorageValue() {
    if (!storageIndex || isNaN(Number(storageIndex))) return;

    setIsLoading(true);
    try {
      const value = await storageFactory?.sfGet(
        Number(storageIndex).toFixed(0)
      );
      console.log("SimpleStorageValue: ", value.toNumber());
      setSimpleStorageValue(value.toNumber());
    } finally {
      setIsLoading(false);
    }
  }

  async function setStorageVal() {
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
      await getStorageValue();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    isConnected && (
      <>
        <h2>Create new simple storage</h2>
        <button onClick={createSimpleStorage}>
          {isLoading ? <Spinner /> : "Create new simple storage"}
        </button>
        <h2>Get storage counter</h2>
        <button onClick={getStorageCounter}>
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
        <button onClick={getStorageValue}>
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
        <button onClick={setStorageVal}>
          {isLoading ? <Spinner /> : "Save storage"}
        </button>
      </>
    )
  );
}
