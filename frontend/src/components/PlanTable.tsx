import { SetStateAction, useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ReactSortable } from "react-sortablejs";
import { Course, CourseCtx } from "../App";
import CourseCard from "./CourseCard";
import useCardActions from "../utils/CardActions";
import { Pattern } from "../utils/CardActions";
import "./Description.css";

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

function getColumnCredits(coursePlan: Course[][], sem: number): number {
  let credits: number = 0;
  coursePlan[sem].forEach((course) => {
    credits += course.credit;
  });
  return credits;
}

function PlanTable() {
  const [coursePlan, setCoursePlan] = useState<Course[][]>(new Array(NUM_SEMESTERS).fill([]));
  const [desc, setDesc] = useState("");

  // if allCourses list is reloaded, restart planning
  // TODO: change to "reload plan" instead of wiping the plan
  const allCourses = useContext(CourseCtx);
  useEffect(() => {
    setCoursePlan(new Array(NUM_SEMESTERS).fill([]));
  }, [allCourses]);

  const { setMissing } = useCardActions();
  const { setPattern } = useCardActions();

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

    // determine pattern warnings
    coursePlan.forEach((sem, semIdx) => {
      sem.forEach((course) => {
        course.pattern.forEach((pattern) => {
          if (pattern === "fa_only") {
            if (semIdx % 2 !== 0) {
              setPattern(course.id, pattern as Pattern);
            }
            else {
              setPattern(course.id, "none");
            }
          }
          else if (pattern === "sp_only") {
            if (semIdx % 2 !== 1) {
              setPattern(course.id, pattern as Pattern);
            }
            else {
              setPattern(course.id, "none");
            }
          }
          else if (pattern === "not_recent" || pattern === "none") {
            setPattern(course.id, pattern as Pattern);
          }
        })
      })
    });

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
              <Row className="justify-content-center align-items-center h6">
                {semIdxs.map((semIdx) => (
                  <Col>
                    Total Credits: {getColumnCredits(coursePlan, semIdx)}
                  </Col>
                ))}
              </Row>
              <Row>
                {semIdxs.map((semIdx) => (
                  <Col key={semIdx} className="ps-0 pe-0 pt-0 pb-0">
                    <ReactSortable list={coursePlan[semIdx]} setList={setCoursePlanAtSem(setCoursePlan, semIdx)}
                      group="courses" swapThreshold={1.5}>
                      {coursePlan[semIdx]?.map((course) => (
                        <CourseCard key={course.id} course={course} style={{ aspectRatio: "1/0.8" }} desc={desc} setDesc={setDesc}/>
                      ))}
                    </ReactSortable>
                  </Col>
                ))}
              </Row>
            </Col>
          )
        })}
      </Row>
      <Row className = "fixed-bottom">
        {desc}
      </Row>
    </Container>
  )
}

export default PlanTable;