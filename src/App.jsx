import { useEffect, useState } from "react";
import api from "./services/api";
import TaskCard from "./components/TaskCard";
import EditModal from "./components/EditModal";
import "./App.css";
import { DndContext, closestCenter, useDroppable } from "@dnd-kit/core";
import toast, { Toaster } from "react-hot-toast";
import Button from "./components/Button";

function App() {

  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [taskEditando, setTaskEditando] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function carregarTasks(paginaAtual = 1) {
    setLoading(true);

    try {
      const params = { page: paginaAtual };

      if (busca) params.search = busca;
      if (filtroStatus) params.status = filtroStatus;

      const response = await api.get("/tasks", { params });

      setTasks(response.data.data);
      setLastPage(response.data.lastPage);

    } catch (err) {
      console.error("Erro ao carregar tasks:", err);
      toast.error("Erro ao carregar tarefas ❌");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarTasks(page);
  }, [page, busca, filtroStatus]);

  function iniciarEdicao(task){
    setTaskEditando(task);
    setModalOpen(true);
  }

  function salvarEdicao(taskAtualizada) {

    const taskParaEnviar = {
      titulo: taskAtualizada.titulo,
      descricao: taskAtualizada.descricao,
      status: taskAtualizada.status,
      subtasks: taskAtualizada.subtasks?.map(sub => ({
        ...(sub.id && { id: Number(sub.id) }),
        descricao: sub.descricao,
        concluida: sub.concluida
      }))
    };

    setTasks(prev =>
      prev.map(t =>
        t.id === taskAtualizada.id ? taskAtualizada : t
      )
    );

    return api.patch(`/tasks/${taskAtualizada.id}`, taskParaEnviar)
      .then((response) => {

        const taskAtualizadaBackend = response.data;

        setTasks(prev =>
          prev.map(t =>
            t.id === taskAtualizadaBackend.id ? taskAtualizadaBackend : t
          )
        );

        toast.success("Task atualizada 🚀");
        setModalOpen(false);
      })
      .catch(() => {
        toast.error("Erro ao salvar ❌");
      });
  }

  async function atualizarTaskCompleta(taskAtualizada) {

    atualizarTaskLocal(taskAtualizada);

    try {
      const response = await api.patch(`/tasks/${taskAtualizada.id}`, {
        status: taskAtualizada.status,
        subtasks: taskAtualizada.subtasks.map(sub => ({
          ...(sub.id && { id: Number(sub.id) }),
          descricao: sub.descricao || "",
          concluida: !!sub.concluida
        }))
      });

      const taskAtualizadaBackend = response.data;

      setTasks(prev =>
        prev.map(t =>
          t.id === taskAtualizadaBackend.id ? taskAtualizadaBackend : t
        )
      );

      return taskAtualizadaBackend;

    } catch (err) {
      console.error("Erro no PATCH:", err.response?.data);
      carregarTasks(page);
      throw err;
    }
  }

  function atualizarTaskLocal(taskAtualizada) {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskAtualizada.id ? taskAtualizada : t
      )
    );
  }

  function alterarStatus(id, novoStatus){
    api.patch(`/tasks/${id}`, { status: novoStatus })
      .then(() => {
        toast.success("Status atualizado 🚀");
        carregarTasks(page);
      })
      .catch(() => {
        toast.error("Erro ao mover ❌");
      });
  }

  function deletarTask(id) {
    api.delete(`/tasks/${id}`)
      .then(() => {
        toast.success("Task deletada 🗑");
        carregarTasks(page);
      })
      .catch(() => {
        toast.error("Erro ao deletar ❌");
      });
  }

  function criarTask(e) {
    e.preventDefault();

    api.post("/tasks", {
      titulo,
      descricao
    }).then(() => {
      setTitulo("");
      setDescricao("");
      toast.success("Task criada 🚀");
      carregarTasks(page);
    }).catch(() => {
      toast.error("Erro ao criar ❌");
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    alterarStatus(Number(active.id), over.id);
  }

  const tarefas = {
    A_FAZER: tasks.filter(t => t.status === "A_FAZER"),
    FAZENDO: tasks.filter(t => t.status === "FAZENDO"),
    FEITO: tasks.filter(t => t.status === "FEITO")
  };

  function Coluna({ id, titulo, lista }) {

    const { setNodeRef } = useDroppable({ id });

    return (
      <div
        ref={setNodeRef}
        style={{
          flex: "1 1 280px",
          width: "100%",
          maxWidth: "350px",
          minHeight: "400px",
          padding: "15px",
          background: "#1e293b",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
        }}
      >
        <h2 style={{ color: "#94a3b8" }}>
          {titulo} ({lista.length})
        </h2>

        {lista.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={deletarTask}
            onEdit={iniciarEdicao}
            onUpdateTask={atualizarTaskCompleta}
            onUpdateTaskLocal={atualizarTaskLocal}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "100%",
      width: "100%",
      margin: "0 auto",
      background: "#0f172a",
      minHeight: "100vh",
      padding: "10px",
      color: "#e2e8f0"
    }}>

      <Toaster position="top-right" />

      <h1 style={{
        textAlign: "center",
        color: "#38bdf8",
        marginBottom: "20px"
      }}>
         Orbit
      </h1>

      {loading && <p>Carregando...</p>}

      <input
        placeholder="Buscar tarefas..."
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setPage(1);
        }}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #334155",
          background: "#1e293b",
          color: "#e2e8f0",
          width: "100%",
          marginBottom: "10px",
          boxSizing: "border-box"
        }}
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <Button variant="secondary" onClick={() => { setFiltroStatus(""); setPage(1); }}>
          Todos
        </Button>

        <Button variant="primary" onClick={() => { setFiltroStatus("A_FAZER"); setPage(1); }}>
          A Fazer
        </Button>

        <Button variant="primary" onClick={() => { setFiltroStatus("FAZENDO"); setPage(1); }}>
          Fazendo
        </Button>

        <Button variant="primary" onClick={() => { setFiltroStatus("FEITO"); setPage(1); }}>
          Feito
        </Button>
      </div>

        <form 
        onSubmit={criarTask}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "10px"
        }}
        >
        <input
          placeholder="Título"
          value={titulo}
          onChange={(e)=>setTitulo(e.target.value)}
          style={{ flex: "1 1 200px" }}
        />

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e)=>setDescricao(e.target.value)}
          style={{ flex: "1 1 200px" }}
        />

        <Button type="submit" variant="success">
          Criar
        </Button>
      </form>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Button
          variant="secondary"
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Anterior
        </Button>

        <span>Página {page} de {lastPage}</span>

        <Button
          variant="secondary"
          onClick={() => setPage(prev => Math.min(prev + 1, lastPage))}
          disabled={page === lastPage}
        >
          Próxima
        </Button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{
          display: "flex",
          gap: "15px",
          marginTop: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-start"
        }}>
          <Coluna id="A_FAZER" titulo="A Fazer" lista={tarefas.A_FAZER} />
          <Coluna id="FAZENDO" titulo="Fazendo" lista={tarefas.FAZENDO} />
          <Coluna id="FEITO" titulo="Feito" lista={tarefas.FEITO} />
        </div>
      </DndContext>

      <EditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={salvarEdicao}
        task={taskEditando}
      />

    </div>
  );
}

export default App;