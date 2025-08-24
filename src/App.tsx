import { useEffect, useState } from "react";
import TodoItem from "./todoitem";
import { Construction } from "lucide-react";



type Priority = "Urgente" | "Moyenne" | "Basse";

type toDo = {
  id : number;
  text: string;
  priority : Priority;
}


function App() {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Moyenne");
  const savedTodos = localStorage.getItem("todos");
  const initialTodos = savedTodos ?  JSON.parse(savedTodos) : [];
  const [todos, setTodos] = useState<toDo []>(initialTodos);
  const [filter, setFilter] = useState<Priority | "Tous">("Moyenne");

  useEffect(() => {
    localStorage.setItem("todos",JSON.stringify(todos))
  } , [todos])

  function addTodo() {
    if(input.trim() == "") {
      return
    }

    const newTodo : toDo = {
        id : Date.now(),
        text: input.trim(),
        priority : priority
    }

    const newTodos = [newTodo, ... todos];
    setTodos(newTodos);
    setInput("");
    setPriority("Moyenne");
    console.log(newTodos);
  }

  let filteredTodos : toDo[] = []

  if (filter === "Tous") {
    filteredTodos = todos;
  } else {
    filteredTodos = todos.filter((todo) => todo.priority === filter)
  }

  const totalCount = todos.length;
  const urgentCount = todos.filter((t) => t.priority === "Urgente").length;
  const mediumCount = todos.filter((t) => t.priority === "Moyenne").length;
  const lowCount = todos.filter((t) => t.priority === "Basse").length;
  
  function deleteTodo (id:number) {
    const newTodos = todos.filter((todo) => todo.id !== id)
    setTodos(newTodos)
  }

  const [selectedTodos, setSelectedTodos] = useState<Set<number>> (new Set());

  function toggleSelectTodo (id:number) {
    const newSelected = new Set(selectedTodos)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedTodos(newSelected)
  }

  function finishSelected () {
    const newTodos = todos.filter((todo) => {
      if(selectedTodos.has(todo.id)) {
        return false
      } else {
        return true
      }
    })

    setTodos(newTodos);
    setSelectedTodos(new Set());

  }

  return (
   <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15" bg-base-300 p-5 rounded-2xl>
      <h2 className="text-center font-bold text-2xl">Ma todo list améliorée</h2>

      <div className="flex gap-4">
        <input type="text" className="input w-full" placeholder="Ajouter une tâche..." value={input} onChange={(e) => setInput(e.target.value)}/>
        <select className="select w-full" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
        </select>
        <button onClick={addTodo} className="btn btn-primary">Ajouter</button>
    
      </div>
      <div className="space-y-2 flex-1 h-fit" >
        <div className="flex items-center justify-between">        
          <div className="flex flex-wrap gap-4">
          <button className={`btn btn-soft ${filter === "Tous" ? "btn-accent" : ""}`} onClick={() => setFilter("Tous")}>Tous ({totalCount})</button>

          <button className={`btn btn-soft ${filter === "Tous" ? "btn-accent" : ""}`} onClick={() => setFilter("Urgente")}>Urgente ({urgentCount})</button>

            <button className={`btn btn-soft ${filter === "Tous" ? "btn-accent" : ""}`} onClick={() => setFilter("Moyenne")}>Moyenne ({mediumCount})</button>

              <button className={`btn btn-soft ${filter === "Tous" ? "btn-accent" : ""}`} onClick={() => setFilter("Basse")}>Basse ({lowCount})</button>
        </div>
             <button onClick={finishSelected} className="btn bg-neutral" disabled={selectedTodos.size == 0}>Finir la sélection ({selectedTodos.size})</button>
             </div>




        {filteredTodos.length > 0 ?  (
          <ul className="divide-y divide-primary/20">
            {filteredTodos.map((todo) => (
              <li key={todo.id}>
                <TodoItem todo={todo}
                isSelected ={selectedTodos.has(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
                onToggleSelect = {toggleSelectTodo} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center items-center flex-col p-5">
            <Construction strokeWidth={1} className="w-40 h-40 text-accent"/>
            <p>Aucune tâche pour ce filtre</p>
          </div>
        )}

      </div>
      
      </div>     
   </div>
  )
}

export default App
