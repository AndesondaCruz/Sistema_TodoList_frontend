import { useDraggable } from "@dnd-kit/core";
import api from "../services/api";
import toast from "react-hot-toast";
import Button from "./Button";

function TaskCard({ task, onDelete, onEdit, onUpdateTask, onUpdateTaskLocal }) {

  const total = task.subtasks?.length || 0;
  const concluidas = task.subtasks?.filter(s => s.concluida).length || 0;
  const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id.toString()
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,

    background: "#0f172a",
    padding: "6px 14px",
    borderRadius: "12px",
    marginBottom: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
    cursor: "grab",
    transition: "0.2s",

    borderLeft: `5px solid ${
      task.status === "A_FAZER"
        ? "#38bdf8"
        : task.status === "FAZENDO"
        ? "#f59e0b"
        : "#22c55e"
    }`
  };

  return (
    <div ref={setNodeRef} style={style}>

      {/* DRAG */}
      <div
        {...listeners}
        {...attributes}
        style={{
          cursor: "grab",
          fontWeight: "bold",
          marginBottom: "5px",
          color: "#94a3b8"
        }}
      >
        ⠿ Arrastar
      </div>

      {/* INFO */}
      <h3 style={{ margin: "5px 0" }}>{task.titulo}</h3>
      <p style={{ opacity: 0.8 }}>{task.descricao}</p>

      <p style={{ fontSize: "13px", opacity: 0.7 }}>
        Status: {task.status}
      </p>

      {/* PROGRESSO */}
      {total > 0 && (
        <div style={{ marginTop: "10px" }}>
          <div style={{
            height: "8px",
            background: "#1e293b",
            borderRadius: "5px"
          }}>
            <div style={{
              width: `${progresso}%`,
              height: "100%",
              background: "#22c55e",
              borderRadius: "5px",
              transition: "0.3s"
            }} />
          </div>

          <small>{progresso}% concluído</small>
        </div>
      )}

      {/* SUBTASKS */}
      {task.subtasks?.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <strong>Subtarefas:</strong>

          {task.subtasks.map(sub => (
            <div key={sub.id} style={{ fontSize: "14px", marginTop: "5px" }}>

              <input
                type="checkbox"
                checked={!!sub.concluida}
                onChange={async (e) => {
                  e.stopPropagation();

                  const novasSubtasks = task.subtasks.map(s =>
                    s.id === sub.id
                      ? { ...s, concluida: !s.concluida }
                      : s
                  );

                  // 🔥 UI otimista
                  onUpdateTaskLocal({
                    ...task,
                    subtasks: novasSubtasks
                  });

                  const toastId = toast.loading("Atualizando...");

                  try {
                    await onUpdateTask({
                      ...task,
                      subtasks: novasSubtasks
                    });

                    toast.success("Subtask atualizada ✅", { id: toastId });

                  } catch {
                    toast.error("Erro ao atualizar ❌", { id: toastId });
                  }
                }}
              />

              <span style={{
                textDecoration: sub.concluida ? "line-through" : "none",
                marginLeft: "5px"
              }}>
                {sub.descricao || "Sem título"}
              </span>

              {/* DELETE SUBTASK */}
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  if (!sub.id) return;

                  if (!window.confirm("Tem certeza que deseja deletar?")) return;

                  api.delete(`/subtasks/${sub.id}`)
                    .then(() => {

                      const novasSubtasks = task.subtasks.filter(s => s.id !== sub.id);

                      onUpdateTaskLocal({
                        ...task,
                        subtasks: novasSubtasks
                      });

                      toast.success("Subtask deletada 🗑️");
                    })
                    .catch(() => {
                      toast.error("Erro ao deletar subtask ❌");
                    });
                }}
                style={{
                  marginLeft: "8px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#ef4444"
                }}
              >
                🗑
              </button>

            </div>
          ))}
        </div>
      )}

      {/* BOTÕES */}
      <div style={{ 
        marginTop: "15px",
        display: "flex",
        justifyContent: "center",
        gap: "10px" 
      }}>
        <Button
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
        >
          Editar
        </Button>

        <Button
          variant="danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          Deletar
        </Button>
      </div>

    </div>
  );
}

export default TaskCard;