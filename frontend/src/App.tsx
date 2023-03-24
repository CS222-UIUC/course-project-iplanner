import React, { createContext, useState } from 'react';
import './App.css';

import { Col, Container, Grid, NextUIProvider, Row, Spacer } from '@nextui-org/react';

import { ReactSortable } from "react-sortablejs";
import SearchBar from './components/SearchBar';
import CourseCard from './components/CourseCard';
import { flushSync } from 'react-dom';

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
    <NextUIProvider>
      <Spacer y={0.3} />
      <CardCtx.Provider value={cardStates}>
        <Container fluid>
          <Grid.Container css={{width: "100%"}}>
            <Grid xs={9}>
              <Container fluid>
                <Row gap={0.3}>
                  <Col css={{textAlign: "center"}}>Freshman</Col>
                  <Col css={{textAlign: "center"}}>Sophomore</Col>
                  <Col css={{textAlign: "center"}}>Junior</Col>
                  <Col css={{textAlign: "center"}}>Senior</Col>
                </Row>
                <Spacer y={1} />
                <Row gap={0.1}>
                  {Object.keys(courseList).map((_, idx) => {
                    return (
                      <Col>
                        <ReactSortable key={idx} list={courseList[idx]} setList={setCourseAtIdx(setCourseList, courseList, idx)}
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
            </Grid>
            <Grid xs={3}>
              <SearchBar />
            </Grid>
          </Grid.Container>
        </Container>
      </CardCtx.Provider>
    </NextUIProvider>
  );
}

export default App;
