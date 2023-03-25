import React, { ChangeEvent, useState } from "react";
import data from "../20230307_api_test_courses.json";
import { ReactSortable } from "react-sortablejs";

import { Course } from "../App"
import CourseCard from "./CourseCard";
import Container from "react-bootstrap/esm/Container";
import Form from 'react-bootstrap/Form';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availCourses, setAvailCourses] = useState(data);
  const [searchResults, setSearchResults] = useState<boolean[]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const keywords = event.target.value.toLowerCase().split(/\s+/).filter((str) => str.length > 0);

    const results = availCourses.map((course: Course) =>
      keywords.every(
        (keyword) => (course.subject + course.number + course.title).toLowerCase().includes(keyword)
      )
    );
    setSearchResults(results);
  };

  return (
    <Container fluid>
      <Form>
        <Form.Control type="text" value={searchTerm} onChange={handleChange} />
      </Form>
      <ReactSortable list={availCourses} setList={setAvailCourses} group="courses">
        {availCourses.filter((_, idx) => searchResults[idx]).map((item) => (
          <CourseCard key={item.id} course={item} />
        ))}
      </ReactSortable>
    </Container>
  );
};

export default SearchBar;
