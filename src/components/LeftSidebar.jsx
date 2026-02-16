const LeftSidebar = () => (
  <aside style={sideStyle}>
    <h3>Add Assets</h3>
    <button onClick={() => window.addAsset('chair')} style={btnStyle}>+ Chair</button>
    <button onClick={() => window.addAsset('table')} style={btnStyle}>+ Table</button>
    <button onClick={() => window.addAsset('sofa')} style={btnStyle}>+ Sofa</button>
    
    <h3 style={{marginTop: '30px'}}>Transform</h3>
    <button onClick={() => window.setMode('translate')} style={btnStyle}>Move (G)</button>
    <button onClick={() => window.setMode('rotate')} style={btnStyle}>Rotate (R)</button>
    <button onClick={() => window.setMode('scale')} style={btnStyle}>Scale (S)</button>
  </aside>
);

const sideStyle = { width: '220px', background: '#222', padding: '20px', borderRight: '1px solid #444' };
const btnStyle = { width: '100%', padding: '10px', marginBottom: '8px', cursor: 'pointer', background: '#444', color: 'white', border: 'none', borderRadius: '4px' };
export default LeftSidebar;