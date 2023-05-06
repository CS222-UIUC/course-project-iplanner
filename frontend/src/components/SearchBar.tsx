import React, { memo, useContext, useEffect, useLayoutEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

import { CardCtx, Course, AppCtx, PlanCtx } from "../App"
import CourseCard from "./CourseCard";
import Container from "react-bootstrap/esm/Container";
import Form from 'react-bootstrap/Form';
import useCardActions from "../utils/CardActions";
import { Button } from "react-bootstrap";

function SearchBar({desc, setDesc}:{desc: string, setDesc: Function}) {
  const { cardStates } = useContext(CardCtx);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [ moreResults, setMoreResults ] = useState(false);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Since "useCardActions" is a self-defined hook, it needs to be called at the top of another hook,
  // not in a callback function. Thus we retrieve dispatch functions from hook useCardActions() at top
  // of our function, and make calls  to these dispatch functions later/
  const { setSearch, clearSearch } = useCardActions();

  const [availCourses, setAvailCourses] = useState<Course[]>([]);
  const [searchHighlight, setSearchHighlight] = useState<string[]>([]);
  const allCourses = useContext(AppCtx);
  const coursePlan = useContext(PlanCtx).plan;
  const inPlan = (coursePlan: Course[][], id: string) => {
    return coursePlan.some(semPlan => semPlan.some(course => course.id === id));
  }

  useEffect(() => {
    searchCourse();
  }, [searchTerm]);

  const searchCourse = () => {
    searchHighlight.forEach(courseId => {
      cardStates[courseId].searched = false;
    });

    const keywords = searchTerm.toLowerCase().split(/\s+/).filter((str) => str.length > 0);
    const matches = (course: Course) => {
      return keywords.length > 0 && keywords.every(
        (keyword) => (course.subject + course.number + course.title).toLowerCase().includes(keyword)
      );
    };

    let available: Course[] = [];
    let more = false; // If more results are hidden
    let highlight: string[] = [];
    coursePlan.forEach((semPlan) => {
      semPlan.forEach((course) => {
        if (matches(course)) {
          highlight.push(course.id);
          setSearch(course.id);
        }
      });
    });

    Object.values(allCourses).forEach((course) => {
      if (matches(course)) {
        if (available.length < 50 && !highlight.includes(course.id)) {
          available.push(allCourses[course.id]);
          setSearch(course.id);
        } else {
          more = true;
        }
      }
    });
    setAvailCourses(available);
    setSearchHighlight(highlight);
    setMoreResults(more);
  };

  // Note that courses not matching the searching keywords are being set to "display: none"
  // instead of doing filtering (availCourse.filter().map()). The latter messes up the inherent
  // indices of each course and causes the wrong course to be moved when dragged.
  return (
    <Container fluid>
      <Form>
        <Form.Control type="text" placeholder="Search Course..." value={searchTerm} onChange={handleInputChange} />
        {/* <Button variant="primary" onClick={searchCourse}>Submit</Button> */}
      </Form>
      <div style={{ height: "100%", overflowY: "scroll" }}>
        <ReactSortable list={availCourses} setList={setAvailCourses} group="courses">
          {availCourses?.map((course) => (
            <div key={course.id} className={cardStates[course.id]?.searched ? "" : "d-none"}>
              <CourseCard course={course} style={{}} desc={desc} setDesc={setDesc} />
            </div>
          ))}
        </ReactSortable>
      </div>
    </Container>
  );
};

export default memo(SearchBar);
