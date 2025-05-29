import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllTestsPage = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    // API'dan testlarni olish
    axios.get('http://192.168.100.99:5050/api/test/get-all')
      .then((response) => {
        setTests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tests:', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://192.168.100.99:5050/api/test/delete/${id}`)
      .then(() => {
        setTests(tests.filter(test => test._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting test:', error);
      });
  };

  return (
    <div>
      <h1>All Tests</h1>
      <Link to="/create">Create New Test</Link>
      <ul>
        {tests.map((test) => (
          <li key={test._id}>
            <strong>{test.title}</strong> - {test.level}
            <Link to={`/edit/${test._id}`}>Edit</Link>
            <button onClick={() => handleDelete(test._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllTestsPage;
