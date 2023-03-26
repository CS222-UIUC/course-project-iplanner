// 8 draggable columns for each semesters.

import { SetStateAction, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ReactSortable } from "react-sortablejs";
import { Course } from "../App";
import CourseCard from "./CourseCard";

type Dispatch<A> = (value: A) => void;

function setCoursePlanAtSem(setFcn: Dispatch<SetStateAction<Course[][]>>, idx: number): Dispatch<Course[]> {
  return (courseRow: Course[]) => {
    setFcn((prevCoursePlan: Course[][]) => {
      let cloned = [...prevCoursePlan];
      cloned[idx] = courseRow;
      return cloned;
    })
  };
}

function PlanTable({ allCourses }: { allCourses: Course[] }) {
  const NUM_SEMESTERS = 8;
  const [coursePlan, setCoursePlan] = useState<Course[][]>(new Array(NUM_SEMESTERS).fill([]));

  // if allCourses list is reloaded, restart planning
  // TODO: change to "reload plan" instead of wiping the plan
  useEffect(() => {
    setCoursePlan(new Array(NUM_SEMESTERS).fill([]));
  }, [ allCourses ]);

  const YEAR_LABELS = ["Freshman", "Sophomore", "Junior", "Senior"];

  return (
    <Container fluid>
      <Row>
        {YEAR_LABELS.map((yearLabel, yearIdx) => {
          const semIdxs = [yearIdx * 2, yearIdx * 2 + 1];
          return (
            <Col key={yearLabel + yearIdx} className="border-end border-2">
              <Row className="justify-content-center align-items-center h5">{yearLabel}</Row>
              <Row>
                {semIdxs.map((semIdx) => (
                  <Col key={semIdx} className="ps-0 pe-1">
                    <ReactSortable list={coursePlan[semIdx]} setList={setCoursePlanAtSem(setCoursePlan, semIdx)}
                                    group="courses" swapThreshold={1.5}>
                      {coursePlan[semIdx]?.map((course) => (
                        <CourseCard key={course.id} course={course} />
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