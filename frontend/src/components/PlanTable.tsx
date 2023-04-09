import { SetStateAction, useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ReactSortable } from "react-sortablejs";
import { Course, CourseCtx } from "../App";
import CourseCard from "./CourseCard";
import useCardActions from "../utils/CardActions";

const NUM_SEMESTERS = 8;
type Dispatch<A> = (value: A) => void;

function setCoursePlanAtSem(setFcn: Dispatch<SetStateAction<Course[][]>>, idx: number): Dispatch<Course[]> {
  return (courseRow: Course[]) => {
    setFcn((prevCoursePlan: Course[][]) => {
      let cloned = [...prevCoursePlan];
      cloned[idx] = courseRow;
      return cloned;
    });
  };
}

function PlanTable() {
  const [coursePlan, setCoursePlan] = useState<Course[][]>(new Array(NUM_SEMESTERS).fill([]));

  // if allCourses list is reloaded, restart planning
  // TODO: change to "reload plan" instead of wiping the plan
  const allCourses = useContext(CourseCtx);
  useEffect(() => {
    setCoursePlan(new Array(NUM_SEMESTERS).fill([]));
  }, [allCourses]);

  const { setMissing } = useCardActions();
  useEffect(() => {
    // Prerequisite/concurrent unsatisfied check
    let planUpToSem: Course[][] = [];
    coursePlan.forEach((sem) => {
      planUpToSem.push(sem);
      sem.forEach((course) => {
        let missingCourses: string[] = [];
        course.concur.forEach((concur) => {
          if (!planUpToSem.some((semester: Course[]) => semester.some((c: Course) => c.id === concur))) {
            missingCourses.push(concur);
          }
        });
        course.prereq.forEach((prereq) => {
          if (!planUpToSem.slice(0, -1).some((semester: Course[]) => semester.some((c: Course) => c.id === prereq))) {
            missingCourses.push(prereq);
          }
        });
        setMissing(course.id, missingCourses);
      })
    });

    // TODO Anant determine pattern warnings

    // This comment disables warning of `setMissing` dep., which changes
    // every time the CardActions change and triggers too much updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursePlan]);

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
                  <Col key={semIdx} className="ps-0 pe-0 pt-0 pb-0">
                    <ReactSortable list={coursePlan[semIdx]} setList={setCoursePlanAtSem(setCoursePlan, semIdx)}
                      group="courses" swapThreshold={1.5}>
                      {coursePlan[semIdx]?.map((course) => (
                        <CourseCard key={course.id} course={course}
                          style={{ aspectRatio: "1/0.8" }}/>
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