import React, { useState } from "react";

export default function AssetsPage() {
  const initialAssets = [
    {id:1, tag: 'EQ-1001', name: 'Laptop Dell', model: 'Latitude 7420', serial: 'SN12345', status: 'in_service'},
    {id:2, tag: 'PRN-01', name: 'Impresora Oficina', model: 'HP M428', serial: 'SN98765', status: 'maintenance'}
  ];

  const [assets, setAssets] = useState(initialAssets);
  const [nextId, setNextId] = useState(initialAssets.length + 1);

  const addAsset = (payload) => {
    setAssets(prev => [...prev, { id: nextId, ...payload }]);
    setNextId(id => id + 1);
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto" }}>
      <a href="/">← Volver</a>
      <h1>Activos Generales</h1>

      <section style={{ maxWidth: 900 }}>
        <h2>Agregar activo</h2>
        <AssetForm onAdd={addAsset} />
        <h2 style={{ marginTop: 16 }}>Lista de activos</h2>
        <AssetsTable assets={assets} />
      </section>
    </main>
  );
}

function AssetForm({ onAdd }) {
  const [tag, setTag] = useState("");
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [status, setStatus] = useState("in_service");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tag.trim() || !name.trim()) {
      alert("Tag y Nombre son obligatorios");
      return;
    }
    onAdd({
      tag: tag.trim(),
      name: name.trim(),
      model: model.trim(),
      serial: serial.trim(),
      status
    });
    setTag(""); setName(""); setModel(""); setSerial(""); setStatus("in_service");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag / Código" required />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del activo" required />
        <input value={model} onChange={e => setModel(e.target.value)} placeholder="Modelo" />
        <input value={serial} onChange={e => setSerial(e.target.value)} placeholder="Serial" />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="in_service">in_service</option>
          <option value="out_of_service">out_of_service</option>
          <option value="maintenance">maintenance</option>
        </select>
        <button type="submit">Agregar</button>
      </div>
    </form>
  );
}

function AssetsTable({ assets }) {
  return (
    <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>ID</th><th>Tag</th><th>Nombre</th><th>Modelo</th><th>Serial</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        {assets.map(a => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.tag}</td>
            <td>{a.name}</td>
            <td>{a.model ?? ""}</td>
            <td>{a.serial ?? ""}</td>
            <td>{a.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
