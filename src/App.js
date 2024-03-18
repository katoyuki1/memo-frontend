import React, { useState, useEffect } from 'react';
import './index.css'; // Tailwind CSSをインポート

function App() {
  const [memos, setMemos] = useState([]);
  const [currentMemo, setCurrentMemo] = useState({ id: null, title: '', content: '' });
  const apiUrl = 'http://localhost:8000/api/memos/'; // Django APIのURL

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setMemos(data));
  }, []);

  const saveMemo = () => {
    const method = currentMemo.id ? 'PUT' : 'POST';
    const id = currentMemo.id ? `${currentMemo.id}/` : '';
    fetch(`${apiUrl}${id}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentMemo),
    }).then(() => {
      setCurrentMemo({ id: null, title: '', content: '' });
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => setMemos(data));
    });
  };

  const deleteMemo = (id) => {
    fetch(`${apiUrl}${id}/`, {
      method: 'DELETE',
    }).then(() => {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => setMemos(data));
    });
  };

  return (
    <div className="App container mx-auto mt-10">
      <div className="mb-5">
        <input
          type="text"
          value={currentMemo.title}
          onChange={(e) => setCurrentMemo({ ...currentMemo, title: e.target.value })}
          placeholder="Title"
          className="input input-bordered input-primary w-full max-w-xs"
        />
        <textarea
          value={currentMemo.content}
          onChange={(e) => setCurrentMemo({ ...currentMemo, content: e.target.value })}
          placeholder="Content"
          className="textarea textarea-primary w-full max-w-xs mt-2"
        />
        <button onClick={saveMemo} className="btn btn-primary mt-2">Save</button>
      </div>
      <ul>
        {memos.map((memo) => (
          <li key={memo.id} className="mb-4 p-2 border rounded shadow">
            <h2 className="text-lg font-bold">{memo.title}</h2>
            <p className="mt-2 mb-2">{memo.content}</p>
            <button onClick={() => setCurrentMemo(memo)} className="btn btn-secondary mr-2">Edit</button>
            <button onClick={() => deleteMemo(memo.id)} className="btn btn-error">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
