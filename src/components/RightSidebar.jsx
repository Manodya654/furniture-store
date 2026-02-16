const RightSidebar = ({ selected }) => (
  <aside style={{...sideStyle, borderRight: 'none', borderLeft: '1px solid #444'}}>
    <h3>Properties</h3>
    {selected ? (
      <>
        <p>Selected: <b>{selected.name}</b></p>
        <label>Color:</label>
        <input type="color" onChange={(e) => window.changeColor(e.target.value)} style={{width: '100%', height: '40px', marginTop: '10px'}} />
        <button onClick={() => window.deleteSelected()} style={{...btnStyle, background: '#a33', marginTop: '20px'}}>Delete Item</button>
      </>
    ) : (
      <p style={{color: '#888'}}>Select an item to edit</p>
    )}
  </aside>
);
const sideStyle = { width: '220px', background: '#222', padding: '20px' };
const btnStyle = { width: '100%', padding: '10px', cursor: 'pointer', color: 'white', border: 'none', borderRadius: '4px' };
export default RightSidebar;