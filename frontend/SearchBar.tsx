import React, { useState, useEffect } from 'react';

interface Course {
  id: number;
  subject: string;
  catalog_number: string;
}

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [data, setData] = useState<Course[]>([]);

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const results = data.filter(
      (course: Course) =>
        course.subject.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleChange} />
      <ul>
        {searchResults.map((course) => (
          <li key={course.id}>
            {course.subject} - {course.catalog_number}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBar;