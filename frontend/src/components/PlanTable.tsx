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
    setFcn(cloned);
    flushSync(() => {});
  };
}

function PlanTable() {
  const NUM_SEMESTERS = 8;
  let empty: Course[][] = [];
  for (let i = 0; i < NUM_SEMESTERS; ++i) empty[i] = [];
  const [courseList, setCourseList] = useState<Course[][]>(empty);

  const YEAR_LABELS = ["Freshman", "Sophomore", "Junior", "Senior"];

  return (
    <Container fluid>
      <Row className="text-center h5">
        {YEAR_LABELS.map((yearLabel, yearIdx) => {
          const semIdxs = [yearIdx * 2, yearIdx * 2 + 1];
          return (
            <Col key={yearLabel + yearIdx} className="border-right">
              <Row className="justify-content-center align-items-center">{yearLabel}</Row>
              <Row>
                {semIdxs.map((semIdx) => (
                  <Col key={semIdx} className="p-0">
                    <ReactSortable list={courseList[semIdx]} setList={setCourseAtIdx(setCourseList, courseList, semIdx)}
                                    group="courses" swapThreshold={1.5}>
                      {courseList[semIdx]?.map((item) => (
                        <CourseCard key={item.id} course={item} />
                      ))}
                    </ReactSortable>
                  </Col>
                ))}
              </Row>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default PlanTable;