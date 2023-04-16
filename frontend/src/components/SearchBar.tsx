import React, { useContext, useEffect, useMemo, useState } from "react";
import { ReactSortable } from "react-sortablejs";

import { CardCtx, Course, AppCtx } from "../App"
import CourseCard from "./CourseCard";
import Container from "react-bootstrap/esm/Container";
import Form from 'react-bootstrap/Form';
import useCardActions from "../utils/CardActions";
import { Button } from "react-bootstrap";

function SearchBar() {
  const { cardStates } = useContext(CardCtx);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const [availCourses, setAvailCourses] = useState<Course[]>([]);

  // On change of allCourse (api call returns), set available Courses!
  const allCourses = useContext(AppCtx);
  useEffect(() => {
    setAvailCourses(Object.values(allCourses));
  }, [ allCourses ]);

  const [ searchResults, setSearchResults ] = useState<Record<string, boolean>>({});
  const searchCourse = (event: React.MouseEvent<HTMLButtonElement>) => {
    const keywords = searchTerm.toLowerCase().split(/\s+/).filter((str) => str.length > 0);

    const results: Record<string, boolean> = {};
    Object.values(allCourses).forEach((course) => {
      const matches = keywords.length > 0 && keywords.every(
        (keyword) => (course.subject + course.number + course.title).toLowerCase().includes(keyword)
      );
      results[course.id] = matches;
    });
    setSearchResults(results);
  };

  // Since "useCardActions" is a self-defined hook, it needs to be called at the top of another hook,
  // not in a callback function. Thus we retrieve dispatch functions from hook useCardActions() at top
  // of our function, and make calls  to these dispatch functions later/
  const { setSearch, clearSearch } = useCardActions();
  useEffect(() => {
    let foundCount = 0;
    Object.values(allCourses).every((course) => {
      if (searchResults[course.id]) {
        setSearch(course.id);
        ++foundCount;
      } else {
        clearSearch(course.id);
      }
      return foundCount < 50; // Only show first 50 results
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults]);

  // Note that courses not matching the searching keywords are being set to "display: none"
  // instead of doing filtering (availCourse.filter().map()). The latter messes up the inherent
  // indices of each course and causes the wrong course to be moved when dragged.
  return (
    <Container fluid>
      <Form>
        <Form.Control type="text" placeholder="Search Course..." value={searchTerm} onChange={handleInputChange} />
        <Button variant="primary" onClick={searchCourse}>Submit</Button>
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
