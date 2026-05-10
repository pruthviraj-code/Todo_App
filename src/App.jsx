import React, { useState, useRef } from "react";
import "./App.css";
import DesktopDarkBg from "./assets/images/bg-desktop-dark.jpg";
import DesktopLightBg from "./assets/images/bg-desktop-light.jpg";
import MobileDarkBg from "./assets/images/bg-mobile-dark.jpg";
import MobileLightBg from "./assets/images/bg-mobile-light.jpg";
import Cross from "./assets/images/icon-cross.svg";
import SunIcon from "./assets/images/icon-sun.svg";
import MoonIcon from "./assets/images/icon-moon.svg";
import CheckIcon from "./assets/images/icon-check.svg";
import useLocalStorage from "./hooks/useLocaleStorage";

export default function App() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useLocalStorage("theme-dark", true);

  const dragIndex = useRef(null);
  const dragOverIndex = useRef(null);

  const handleDragStart = (index) => {
    dragIndex.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverIndex.current = index;

    if (dragIndex.current === dragOverIndex.current) return;

    const newTodos = [...todos];
    const draggedItem = newTodos.splice(dragIndex.current, 1)[0];
    newTodos.splice(dragOverIndex.current, 0, draggedItem);
    dragIndex.current = dragOverIndex.current;
    setTodos(newTodos);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    dragOverIndex.current = null;
  };

  const handleSearch = (e) => setInput(e.target.value);
  const itemLeft = todos.length;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (input.trim() === "") return;

      const todo = {
        id: crypto.randomUUID(),
        text: input,
        completed: false,
        checked: false,
      };

      setTodos((prev) => [...prev, todo]);
      setInput("");
    }
  };

  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((todo) => id !== todo.id));
  };

  const handleToggle = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  return (
    <div className={`container ${dark ? "theme-dark" : "theme-light"}`}>
      <img
        src={dark ? MobileDarkBg : MobileLightBg}
        alt="background"
        className="bg-img mobile"
      />

      <img
        src={dark ? DesktopDarkBg : DesktopLightBg}
        alt="background"
        className="bg-img desktop"
      />

      <div className="content">
        <div className="title-row">
          <h1 className="title">TODO</h1>

          <img
            src={dark ? SunIcon : MoonIcon}
            alt="toggle theme"
            className="theme-toggle"
            onClick={() => setDark((d) => !d)}
          />
        </div>

        <div className="todo-input-wrapper">
          <span className="circle"></span>

          <input
            value={input}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            type="text"
            className="todo-input"
            placeholder="Create a new todo..."
          />
        </div>

        <ul className="todo-list">
          {filteredTodos.map((todo, index) => (
            <li
              className="todo-item"
              key={todo.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="todo-item-left">
                <span
                  className={`circle ${todo.completed ? "checked" : ""}`}
                  onClick={() => handleToggle(todo.id)}
                >
                  {todo.completed && <img src={CheckIcon} alt="check_icon" />}
                </span>

                <span
                  className={`todo-text ${todo.completed ? "completed" : ""}`}
                >
                  {todo.text}
                </span>
              </div>

              <img
                src={Cross}
                alt="cross-icon"
                className="cross"
                onClick={() => handleDelete(todo.id)}
              />
            </li>
          ))}
        </ul>

        <div className="todo-footer">
          <span className="items-left">{itemLeft} items left</span>

          <div className="filters">
            <span
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </span>

            <span
              className={`filter-btn ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active
            </span>

            <span
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </span>
          </div>

          <span className="clear-btn" onClick={clearCompleted}>
            Clear Completed
          </span>
        </div>

        <p className="drag-hint">Drag and drop to reorder list</p>
      </div>
    </div>
  );
}
