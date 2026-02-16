import { useState } from "react";
import ThreeScene from "./components/ThreeScene";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";

function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden", color: 'white' }}>
      <header style={{height: '50px', background: '#111', display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #333'}}>
        <h2 style={{margin: 0}}>Furniture Studio v2.0</h2>
      </header>
      
      <div style={{ display: "flex", flex: 1 }}>
        <LeftSidebar />
        <main style={{ flex: 1, position: "relative" }}>
          <ThreeScene onSelect={setSelected} />
        </main>
        <RightSidebar selected={selected} />
      </div>
    </div>
  );
}

export default App;