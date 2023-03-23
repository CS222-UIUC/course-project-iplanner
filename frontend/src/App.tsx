import React, { useState } from 'react';
import './App.css';

import { Card, Grid, NextUIProvider } from '@nextui-org/react';

import { ReactSortable } from "react-sortablejs";
import SearchBar from './components/SearchBar';
import { flushSync } from 'react-dom';

export interface Course {
  id: string,
  subject: string,
  number: string,
  title: string,
  credit: number
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

function App() {
  const NUM_SEMESTERS = 8;
  const [courseList, setCourseList] = useState<Course[][]>(new Array<Course[]>(NUM_SEMESTERS));

  return (
    <NextUIProvider>
      <Grid.Container>
        <Grid xs={9}>
          <Grid.Container>
            <Grid xs={4}>
              {Object.keys(courseList).map((key) => {
                let idx = parseInt(key);
                return (
                  <ReactSortable key={idx} list={courseList[idx]} setList={setCourseAtIdx(setCourseList, courseList, idx)} group="courses">
                    {courseList[idx].map((item) => (
                      <Card key={item.id}>{`${item.subject} ${item.number}`}<br/>{item.title}</Card>
                    ))}
                  </ReactSortable>
                )
              })}
            </Grid>
          </Grid.Container>
        </Grid>
        <Grid xs={3}>
          <SearchBar />
        </Grid>
      </Grid.Container>
    </NextUIProvider>
  );
}

export default App;
