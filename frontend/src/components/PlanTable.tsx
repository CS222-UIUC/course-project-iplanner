import { SetStateAction, memo, useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ReactSortable } from "react-sortablejs";
import { Course, AppCtx, PlanCtx, NUM_SEMESTERS } from "../App";
import CourseCard from "./CourseCard";
import useCardActions from "../utils/CardActions";
import { Pattern } from "../utils/CardActions";
import "./Description.css";

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
    credits += course.credit ? course.credit[0] : 3; // TODO: fix missing credit issue
  });
  return credits;
}

function PlanTable() {
  const { plan: coursePlan, setPlan: setCoursePlan } = useContext(PlanCtx);

  // if allCourses list is reloaded, restart planning
  const allCourses = useContext(AppCtx);

  const { setMissing } = useCardActions();
  const { setPattern } = useCardActions();

  useEffect(() => {
    // Prerequisite/concurrent unsatisfied check
    let planUpToSem: Course[][] = [];
    coursePlan.forEach((sem) => {
      planUpToSem.push(sem);
      sem.forEach((course) => {
        let missingCourses: string[][] = [];
        course.concur.forEach((concurList) => { // For each concurrent course list
          if (!planUpToSem.some((semester: Course[]) => semester.some((c: Course) => concurList.includes(c.id)))) {
            missingCourses.push(concurList);
          }
        });
        course.prereq.forEach((prereqList) => {
          if (!planUpToSem.slice(0, -1).some((semester: Course[]) => semester.some((c: Course) => prereqList.includes(c.id)))) {
            missingCourses.push(prereqList);
          }
        });
        setMissing(course.id, missingCourses);
      })
    });

    // determine pattern warnings
    coursePlan.forEach((sem, semIdx) => {
      sem.forEach((course) => {
        const pattern = course.pattern;
        if (pattern === "fa_only") {
          if (semIdx % 2 !== 1) {
            setPattern(course.id, pattern as Pattern);
          }
          else {
            setPattern(course.id, "none");
          }
        }
        else if (pattern === "sp_only") {
          if (semIdx % 2 !== 0) {
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
    });

    // This comment disables warning of `setMissing` dep., which changes
    // every time the CardActions change and triggers too much updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursePlan]);

  const YEAR_LABELS = ["Freshman", "Sophomore", "Junior", "Senior"];
  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col className="border-end border-2 h-100" xs={1}>
          <Row className="justify-content-center align-items-center h5">Proficiency</Row>
          <Row className="h-100">
            <Col className="ps-0 pe-0 pt-0 pb-0">
              <ReactSortable list={coursePlan[0]} setList={setCoursePlanAtSem(setCoursePlan, 0)}
                group="courses" swapThreshold={1.5}>
                {coursePlan[0]?.map((course) => (
                  <CourseCard key={course.id} course={course} compact />
                ))}
              </ReactSortable>
            </Col>
          </Row>
        </Col>

        {YEAR_LABELS.map((yearLabel, yearIdx) => {
          const semIdxs = [yearIdx * 2 + 1, yearIdx * 2 + 2];
          return (
            <Col key={yearLabel + "yr,idx" + yearIdx} className="border-end border-2 h-100">
              <Row className="justify-content-center align-items-center h5">{yearLabel}</Row>
              <Row className="justify-content-center align-items-center h6 text-center">
                {semIdxs.map((semIdx) => (
                  <Col key={"sem" + semIdx}>
                    Credits: {getColumnCredits(coursePlan, semIdx)}
                  </Col>
                ))}
              </Row>
              <Row className="h-100">
                {semIdxs.map((semIdx) => (
                  <Col key={"sem-" + semIdx} className="ps-0 pe-0 pt-0 pb-0">
                    <ReactSortable list={coursePlan[semIdx]} setList={setCoursePlanAtSem(setCoursePlan, semIdx)}
                      group="courses" swapThreshold={1.5}>
                      {coursePlan[semIdx]?.map((course) => (
                        <CourseCard key={course.id} course={course} style={{ aspectRatio: "1/0.9" }} />
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

export default memo(PlanTable);