const AssetsMenu = ({ onAdd, selectedItem, onColorChange }) => {
  const sidebarStyle = {
    width: "250px",
    background: "#2a2a2a",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    borderRight: "1px solid #444",
  };

  const buttonStyle = {
    padding: "12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <aside style={sidebarStyle}>
      <h3>Assets</h3>
      {["chair", "table", "sofa", "bed", "lamp"].map((item) => (
        <button key={item} style={buttonStyle} onClick={() => onAdd(item)}>
          + Add {item}
        </button>
      ))}

      <hr style={{ border: "0.5px solid #444", width: "100%" }} />

      <h3>Properties</h3>
      {selectedItem ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p>Selected: {selectedItem.name}</p>
          <input 
            type="color" 
            onChange={(e) => onColorChange(e.target.value)} 
            style={{ width: "100%", height: "40px" }}
          />
        </div>
      ) : (
        <p style={{ color: "#888" }}>Select an item to edit.</p>
      )}
    </aside>
  );
};

export default AssetsMenu;