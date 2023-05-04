import { createContext, Dispatch, useEffect, useReducer, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchBar from './components/SearchBar';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import PlanTable from './components/PlanTable';
import { CardAction, cardReducer, CardState } from './utils/CardActions';

// TODO: FE testing only, change to api call in useEffect onMount function
import data from "./data/20230307_api_test_courses.json";

export interface Course {
  id: string,
  subject: string,
  number: string,
  title: string,
  credit: number,
  equiv: string[],
  concur: string[],
  prereq: string[],
  subseq: string[],
  pattern: string[],
  description: string
}

interface CardCtxType {
  cardStates: Record<string, CardState>,
  cardDispatch: Dispatch<CardAction>
};

const emptyCardCtxType: CardCtxType = {
  cardStates: {},
  cardDispatch: (arg: CardAction) => { }
};
export const CardCtx = createContext(emptyCardCtxType);
export const CourseCtx = createContext<Record<string, Course>>({});

function App() {
  const [cardStates, cardDispatch] = useReducer(cardReducer, {});
  const [allCourses, setAllCourses] = useState<Record<string, Course>>({});
  const [description, setDescription] = useState("");

  // Execute on mount
  useEffect(() => {
    setAllCourses(data.reduce((dict: Record<string, Course>, course: Course) => {
      dict[course.id] = course;
      return dict;
    }, {}));
  }, []);

  return (
    <Container fluid>
      <CourseCtx.Provider value={allCourses}>
        <CardCtx.Provider value={{ cardStates, cardDispatch }}>
          <Row className="mt-2" style={{ height: "70vh" }}>
            <Col xs={10}>
              <PlanTable desc={description} setDesc={setDescription}/>
            </Col>
            <Col xs={2}>
              <SearchBar desc={description} setDesc={setDescription}/>
            </Col>
          </Row>
          <Row style={{ height: "30vh", padding: "10px"}}>
            <p><b>Legend:</b></p>
            <p><b>Course Description:</b> {description} </p>
          </Row>
        </CardCtx.Provider>
      </CourseCtx.Provider>
    </Container>
  )
}

export default App;
