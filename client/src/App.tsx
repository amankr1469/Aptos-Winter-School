import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button } from "antd";
import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Network, Provider } from "aptos";

export const provider = new Provider(Network.TESTNET);

export const moduleAddress = "48a138b4c3228d1982d99142f72e9cd38cad4d77280c2f669abdd1c9ca084eaf";

function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [counter, setCounter] = useState<number>(0);
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [reload, setReload] = useState<number>(0);

  useEffect(() => {
    fetch();
  }, [account?.address]);

  const fetch = async () => {
    if (!account) return;
    try {
      const todoListResource = await provider.getAccountResource(
        account?.address,
        `${moduleAddress}::counter::CounterHolder`,
      );
      let data = JSON.parse((todoListResource?.data as any).count);
      setCounter(data);
      if(reload){
        window.location.reload();
      }
    }
    catch (e: any) {
      incrementButton();
    }
  }

  const timer = () => { setInterval(() => { setReload(1); fetch() }, 10000); }

  useEffect(() => {
    timer();
  }, [account?.address]);

  const incrementButton = async () => {
    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::counter::increment`,
      type_arguments: [],
      arguments: [],
    };
    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      window.location.reload();
    } catch (error: any) {
      console.log(error);
    } finally {
      setTransactionInProgress(false);
    }
  };
  

  return (
    <>
      <Layout>
        <Row align="middle" justify="space-evenly" style={{backgroundColor:"#1c2124"}}>
          <Col >
            <h1 style={{color: "white"}}>Aptos Blockchain Winter School</h1>
          </Col>
          <Col style={{ textAlign: "right" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
          <Row style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <Col>
              <Button
                disabled={!account || transactionInProgress}
                block
                onClick={incrementButton}
                type="primary"
                style={{ margin: "0 auto", borderRadius: "50%", height: "300px", width: "300px", backgroundImage: `url(/aptos.png)` , display: "flex", flexDirection: "column", paddingTop:"55px", justifyContent: "center", alignItems: "center",backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat', }}
              >
                <p style={{ fontSize: "20px", color: "black", paddingBottom: "50px", fontFamily:"Roboto Slab"}}>!APTOS!</p>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <p style={{ fontSize: "80px", textAlign: "center", color: "white", fontFamily:"Roboto Slab" }}>Count: {counter}</p>
            </Col>
          </Row>
      </div>
    </>
  );
}

export default App;
