import React, { useState } from 'react';
import './App.css';

import { Card, Grid, NextUIProvider } from '@nextui-org/react';

import { ReactSortable } from "react-sortablejs";
import SearchBar from './SearchBar';

interface Course {
  id: string,
  subject: string,
  number: string,
  title: string
}

function App() {
  const [courseList, setCourseList] = useState<Course[]>([
    { id: "1", subject: "CS", number: "124", title: "Computer Science I"},
    { id: "2", subject: "CS", number: "128", title: "Computer Science II"},
  ]);

  const [courseList2, setCourseList2] = useState<Course[]>([
    { id: "3", subject: "CS", number: "225", title: "Data Structures"},
  ]);

  return (
    <NextUIProvider>
      <Grid.Container>
        <Grid xs={9}>
          <Grid.Container>
            <Grid xs={4}>
              <ReactSortable list={courseList} setList={setCourseList} group="courses">
                {courseList.map((item) => (
                  <Card key={item.id}>{`${item.subject} ${item.number}`}<br/>{item.title}</Card>
                ))}
              </ReactSortable>
            </Grid>
            <Grid xs={4}>
              <ReactSortable list={courseList2} setList={setCourseList2} group="courses">
                {courseList2.map((item) => (
                  <Card key={item.id}>{`${item.subject} ${item.number}`}<br/>{item.title}</Card>
                ))}
              </ReactSortable>
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
