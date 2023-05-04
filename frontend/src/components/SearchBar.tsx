import React, { memo, useContext, useEffect, useLayoutEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

import { CardCtx, Course, AppCtx } from "../App"
import CourseCard from "./CourseCard";
import Container from "react-bootstrap/esm/Container";
import Form from 'react-bootstrap/Form';
import useCardActions from "../utils/CardActions";
import { Button } from "react-bootstrap";

function SearchBar({desc, setDesc}:{desc: string, setDesc: Function}) {
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

    console.log("Started searching");
    const results: Record<string, boolean> = {};
    Object.values(allCourses).forEach((course) => {
      const matches = keywords.length > 0 && keywords.every(
        (keyword) => (course.subject + course.number + course.title).toLowerCase().includes(keyword)
      );
      results[course.id] = matches;
    });
    console.log("Finished searching");
    setSearchResults(results);
  };

  // Since "useCardActions" is a self-defined hook, it needs to be called at the top of another hook,
  // not in a callback function. Thus we retrieve dispatch functions from hook useCardActions() at top
  // of our function, and make calls  to these dispatch functions later/
  const { setSearch, clearSearch } = useCardActions();
  useLayoutEffect(() => {
    console.log("Started rendering...");
    Object.values(allCourses).forEach((course) => {
      if (searchResults[course.id]) {
        setSearch(course.id);
      } else {
        clearSearch(course.id);
      }
    });
    console.log("Finished rendering...");
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
            <CourseCard course={course} style={{}} desc={desc} setDesc={setDesc} />
          </div>
        ))}
      </ReactSortable>
    </Container>
  );
};

export default memo(SearchBar);
