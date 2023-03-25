import React, { createContext, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ReactSortable } from "react-sortablejs";
import SearchBar from './components/SearchBar';
import CourseCard from './components/CourseCard';
import { flushSync } from 'react-dom';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

export interface Course {
  id: string,
  subject: string,
  number: string,
  title: string,
  credit: number
  equiv: string[],
  concur: string[][],
  prereq: string[][]
}

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

export interface CardState {
  highlight: "prereq" | "concur" | "subseq" | "equiv",
  searched: boolean
}
const CardCtx = createContext({});

function App() {
  const NUM_SEMESTERS = 8;
  let empty: Course[][] = [];
  for (let i = 0; i < NUM_SEMESTERS; ++i) empty[i] = [];
  const [courseList, setCourseList] = useState<Course[][]>(empty);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});

  return (
    <Container fluid>
      <Row className="mt-2">
        <Col xs={9}>
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
        </Col>
        <Col xs={3}>
          <SearchBar />
        </Col>
      </Row>
    </Container>
  )
}

export default App;
