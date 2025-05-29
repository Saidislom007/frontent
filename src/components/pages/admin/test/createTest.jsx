import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateTestPage = () => {
  const [title, setTitle] = useState('');
  const [testType, setTestType] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTest = {
      title,
      testType,
      level,
      duration,
      instructions,
      content
    };

    axios.post('http://192.168.100.99:5050/api/test/create', newTest)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error creating test:', error);
      });
  };

  return (
    <div>
      <h1>Create New Test</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Test Type" onChange={(e) => setTestType(e.target.value)} required />
        <input type="text" placeholder="Level" onChange={(e) => setLevel(e.target.value)} required />
        <input type="number" placeholder="Duration" onChange={(e) => setDuration(e.target.value)} required />
        <textarea placeholder="Instructions" onChange={(e) => setInstructions(e.target.value)} required />
        <textarea placeholder="Content" onChange={(e) => setContent(e.target.value)} required />
        <button type="submit">Create Test</button>
      </form>
    </div>
  );
};

export default CreateTestPage;
