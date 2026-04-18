import { useEffect, useState } from 'react';
import './App.css';

const customTasks = [
  'Wash the dishes',
  'Walk the dog',
  'Clean the room',
  'Do the laundry',
  'Go grocery shopping',
  'Cook dinner',
  'Water the plants',
  'Take out the trash',
  'Study for exams',
  'Finish homework',
  'Call a friend',
  'Pay the bills',
  'Organize the desk',
  'Go to the gym',
  'Read a book',
  'Buy coffee',
  'Check emails',
  'Plan the week',
  'Clean the kitchen',
  'Watch a movie',
];

function App() {
  const [todoList, setTodoList] = useState<any[]>([]);
  const [userValue, setUserValue] = useState('all');
  const [leftSort, setLeftSort] = useState('asc');
  const [rightSort, setRightSort] = useState('desc');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((res) => res.json())
      .then((data) => {
        const newTodos = data.slice(0, 20).map((item: any, index: number) => {
          return {
            ...item,
            displayTask: customTasks[index],
            completed: false,
            completedDate: null,
          };
        });

        setTodoList(newTodos);
      });
  }, []);

  const completeTask = (id: number) => {
    const updated = todoList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          completed: true,
          completedDate: new Date().toISOString(),
        };
      }
      return item;
    });

    setTodoList(updated);
  };

  const undoTask = (id: number) => {
    const updated = todoList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          completed: false,
          completedDate: null,
        };
      }
      return item;
    });

    setTodoList(updated);
  };

  const filteredTodos =
    userValue === 'all'
      ? todoList
      : todoList.filter((item) => item.userId === Number(userValue));

  const pendingTodos = filteredTodos
    .filter((item) => item.completed === false)
    .sort((a, b) => {
      if (leftSort === 'asc') {
        return a.displayTask.localeCompare(b.displayTask);
      }
      return b.displayTask.localeCompare(a.displayTask);
    });

  const completedTodos = filteredTodos
    .filter((item) => item.completed === true)
    .sort((a, b) => {
      const first = a.completedDate ? new Date(a.completedDate).getTime() : 0;
      const second = b.completedDate ? new Date(b.completedDate).getTime() : 0;

      if (rightSort === 'asc') {
        return first - second;
      }
      return second - first;
    });

  return (
    <div className="wrapper">
      <h1>Daily Planner</h1>
      <p className="subtitle">Simple React todo app</p>

      <div className="filters">
        <div className="filter-box">
          <label>Filter by user</label>
          <select
            value={userValue}
            onChange={(e) => setUserValue(e.target.value)}
          >
            <option value="all">All Users</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i + 1}>
                User {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <label>Sort uncompleted</label>
          <select
            value={leftSort}
            onChange={(e) => setLeftSort(e.target.value)}
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>

        <div className="filter-box">
          <label>Sort completed</label>
          <select
            value={rightSort}
            onChange={(e) => setRightSort(e.target.value)}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>

      <div className="boards">
        <div className="board">
          <h2>Uncompleted Todos</h2>

          {pendingTodos.length === 0 ? (
            <p className="empty-text">No tasks here.</p>
          ) : (
            pendingTodos.map((item) => (
              <div key={item.id} className="task-card">
                <div className="text-part">
                  <p className="main-task">{item.displayTask}</p>
                  <span className="small-text">User {item.userId}</span>
                </div>

                <button
                  className="done-btn"
                  onClick={() => completeTask(item.id)}
                >
                  Complete
                </button>
              </div>
            ))
          )}
        </div>

        <div className="board">
          <h2>Completed Todos</h2>

          {completedTodos.length === 0 ? (
            <p className="empty-text">No completed tasks yet.</p>
          ) : (
            completedTodos.map((item) => (
              <div key={item.id} className="task-card finished-card">
                <div className="text-part">
                  <p className="main-task">✔ {item.displayTask}</p>
                  <p className="api-task">API title: {item.title}</p>
                  <span className="small-text">
                    Completed on{' '}
                    {item.completedDate
                      ? new Date(item.completedDate).toLocaleDateString()
                      : '-'}
                  </span>
                </div>

                <button className="back-btn" onClick={() => undoTask(item.id)}>
                  Undo
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
