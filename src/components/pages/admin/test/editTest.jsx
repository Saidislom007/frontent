import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditTestPage = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://192.168.100.99:5050/api/test/get/${id}`)
      .then((response) => {
        setTest(response.data);
      })
      .catch((error) => {
        console.error('Error fetching test:', error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`http://192.168.100.99:5050/api/test/edit/${id}`, test)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error updating test:', error);
      });
  };

  if (!test) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Test</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={test.title} onChange={(e) => setTest({ ...test, title: e.target.value })} required />
        <input type="text" value={test.testType} onChange={(e) => setTest({ ...test, testType: e.target.value })} required />
        <input type="text" value={test.level} onChange={(e) => setTest({ ...test, level: e.target.value })} required />
        <input type="number" value={test.duration} onChange={(e) => setTest({ ...test, duration: e.target.value })} required />
        <textarea value={test.instructions} onChange={(e) => setTest({ ...test, instructions: e.target.value })} required />
        <textarea value={test.content} onChange={(e) => setTest({ ...test, content: e.target.value })} required />
        <button type="submit">Update Test</button>
      </form>
    </div>
  );
};

export default EditTestPage;
