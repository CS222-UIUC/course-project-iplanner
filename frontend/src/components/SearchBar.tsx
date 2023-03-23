import React, { useState } from "react";
import data from "../20230307_api_test_courses.json";

import { Course } from "../App"

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Course[]>([]);

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
      {searchResults.map((course: Course) => (
        <div key={course.id}>
          <h3>
            {course.subject} {course.number}
          </h3>
          <p>{course.title}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchBar;
