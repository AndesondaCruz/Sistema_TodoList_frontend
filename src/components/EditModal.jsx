import { useState, useEffect } from "react";

function EditModal({ isOpen, onClose, onSave, task }) {

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [novaSubtask, setNovaSubtask] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitulo(task.titulo || "");
      setDescricao(task.descricao || "");
      setPrazo(task.prazo ? task.prazo.data?.split("T")[0] : "");
      setSubtasks(task.subtasks || []);
    }
  }, [task]);
 
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  function adicionarSubtask() {
  if (!novaSubtask.trim()) return;

  const nova = {
  descricao: novaSubtask,
  concluida: false
  // ❌ NÃO coloque id aqui
};

  setSubtasks(prev => {
    const updated = [...prev, nova];

    console.log("SUBTASKS AGORA:", updated); // 🔥

    return updated;
  });

  setNovaSubtask("");
}

  async function handleSubmit(e) {
  e.preventDefault();

  setLoading(true);

  const updatedTask = {
    ...task,
    titulo,
    descricao,
    prazo: prazo ? { data: prazo } : null,
    subtasks: [...subtasks]
  };

  console.log("ENVIANDO TASK:", updatedTask);

  try {
    await onSave(updatedTask); // 🔥 AGORA ESPERA O BACKEND
    fecharComAnimacao();
  } catch (error) {
    console.error("Erro ao salvar:", error);
  } finally {
    setLoading(false);
  }
}

  function fecharComAnimacao() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  return (
    <div
      style={{
        ...overlayStyle,
        opacity: visible ? 1 : 0
      }}
      onClick={fecharComAnimacao}
    >
      <div
        style={{
          ...modalStyle,
          transform: visible ? "scale(1)" : "scale(0.8)",
          opacity: visible ? 1 : 0
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* BOTÃO FECHAR */}
        <button
          onClick={fecharComAnimacao}
          style={closeButtonStyle}
        >
          ✖
        </button>

        <h2>Editar Task</h2>

        <form onSubmit={handleSubmit}>

          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
          />

          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
          />

          <input
            type="date"
            value={prazo || ""}
            onChange={(e) => setPrazo(e.target.value)}
          />

          {/* SUBTASKS */}
          <div style={{ marginTop: "10px" }}>
            <strong>Subtarefas</strong>

            <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
              <input
                value={novaSubtask}
                onChange={(e) => setNovaSubtask(e.target.value)}
                placeholder="Nova subtask"
              />

              <button type="button" onClick={adicionarSubtask}>
                +
              </button>
            </div>

            {subtasks.map((sub, index) => (
              <div key={sub.id || index}>
                {sub.descricao}
              </div>
            ))}
          </div>

          {/* BOTÕES */}
          <div style={{ marginTop: "10px" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </button>

            <button
              type="button"
              onClick={fecharComAnimacao}
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "opacity 0.3s ease"
};

const modalStyle = {
  position: "relative",
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  width: "320px",
  transition: "all 0.3s ease"
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  border: "none",
  background: "transparent",
  fontSize: "18px",
  cursor: "pointer"
};

export default EditModal;