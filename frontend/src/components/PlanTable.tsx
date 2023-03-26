import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { flushSync } from "react-dom";
import { ReactSortable } from "react-sortablejs";
import { Course } from "../App";
import CourseCard from "./CourseCard";

type Dispatch<A> = (value: A) => void;

function setCourseAtIdx(setFcn: Dispatch<Course[][]>, courseList: Course[][], idx: number): Dispatch<Course[]> {
  return (courseRow: Course[]) => {
    let cloned = {...courseList};
    cloned[idx] = courseRow;
    console.log(idx, cloned);
    setFcn(cloned);
    flushSync(() => {});
  };
}

function PlanTable() {
  const NUM_SEMESTERS = 8;
  let empty: Course[][] = [];
  for (let i = 0; i < NUM_SEMESTERS; ++i) empty[i] = [];
  const [courseList, setCourseList] = useState<Course[][]>(empty);

  return (
    <Container fluid>
      <Row className="text-center h5">
        <Col>Freshman</Col>
        <Col>Sophomore</Col>
        <Col>Junior</Col>
        <Col>Senior</Col>
      </Row>
      <Row>
        {Object.keys(courseList).map((_, idx) => {
          return (
            <Col key={idx} className="mr-1">
              <ReactSortable list={courseList[idx]} setList={setCourseAtIdx(setCourseList, courseList, idx)}
                              group="courses" swapThreshold={1.5}>
                {courseList[idx]?.map((item) => (
                  <CourseCard key={item.id} course={item} />
                ))}
              </ReactSortable>
            </Col>
          );
        })}
      </Row>
    </Container>
  )
}

export default PlanTable;