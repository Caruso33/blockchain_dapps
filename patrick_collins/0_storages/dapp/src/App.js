import Header from "./components/Header.tsx";
import StorageFactory from "./components/StorageFactory.tsx";

function App() {
  // const provider = useProvider();

  // useEffect(() => {
  //   async function x() {
  //     console.log(await provider.getBlockNumber());
  //   }
  //   x();
  // }, [provider]);

  return (
    <>
      <Header />

      <StorageFactory />
    </>
  );
}

export default App;
