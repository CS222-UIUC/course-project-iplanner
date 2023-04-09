import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

import { CardCtx, Course, CourseCtx } from "../App"
import CourseCard from "./CourseCard";
import Container from "react-bootstrap/esm/Container";
import Form from 'react-bootstrap/Form';
import useCardActions from "../utils/CardActions";

function SearchBar() {
  const { cardStates } = useContext(CardCtx);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [availCourses, setAvailCourses] = useState<Course[]>([]);

  // On change of allCourse (api call returns), set available Courses!
  const allCourses = useContext(CourseCtx);
  useEffect(() => {
    setAvailCourses(Object.values(allCourses));
  }, [ allCourses ]);

  // Since "useCardActions" is a self-defined hook, it needs to be called at the top of another hook,
  // not in a callback function. Thus we retrieve dispatch functions from hook useCardActions() at top
  // of our function, and make calls  to these dispatch functions later/
  const { setSearch, clearSearch } = useCardActions();
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const keywords = event.target.value.toLowerCase().split(/\s+/).filter((str) => str.length > 0);

    // If match, dispatch a setSearch() event using cardActions; o/w clearSearch().
    Object.values(allCourses).forEach((course) => {
      const matches = keywords.length > 0 && keywords.every(
        (keyword) => (course.subject + course.number + course.title).toLowerCase().includes(keyword)
      );
      if (matches) {
        setSearch(course.id);
      } else {
        clearSearch(course.id);
      }
    });
  };

  // Note that courses not matching the searching keywords are being set to "display: none"
  // instead of doing filtering (availCourse.filter().map()). The latter messes up the inherent
  // indices of each course and causes the wrong course to be moved when dragged.
  return (
    <Container fluid>
      <Form>
        <Form.Control type="text" placeholder="Search Course..." value={searchTerm} onChange={handleInputChange} />
      </Form>
      <ReactSortable list={availCourses} setList={setAvailCourses} group="courses">
        {availCourses?.map((course) => (
          <div key={course.id} className={cardStates[course.id]?.searched ? "" : "d-none"}>
            <CourseCard course={course} style={{}}/>
          </div>
        ))}
      </ReactSortable>
    </Container>
  );
};

export default SearchBar;
