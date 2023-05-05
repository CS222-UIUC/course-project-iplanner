import { createContext, Dispatch, useEffect, useReducer, useState, Profiler } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchBar from './components/SearchBar';
import { Badge, Container, Stack } from 'react-bootstrap';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import PlanTable from './components/PlanTable';
import { CardAction, cardReducer, CardState, Pattern } from './utils/CardActions';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

// TODO: FE testing only, change to api call in useEffect onMount function
import data from "./data/20230307_api_test_courses.json";
import LoginForm from './components/LoginForm';

export interface Course {
  id: string,
  subject: string,
  number: string,
  title: string,
  credit: number,
  equiv: string[],
  concur: string[][],
  prereq: string[][],
  subseq: string[],
  pattern: Pattern,
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

export const AppCtx = createContext<Record<string, Course>>({});

function App() {
  const [cardStates, cardDispatch] = useReducer(cardReducer, {});
  const [allCourses, setAllCourses] = useState<Record<string, Course>>({});
  const [description, setDescription] = useState("");

  // Execute on mount
  useEffect(() => {
    let xhr = new XMLHttpRequest();

    xhr.onload = function(event: ProgressEvent<EventTarget>)  {
      console.log("Finished loading data!");
      setAllCourses(JSON.parse(this.responseText).reduce((dict: Record<string, Course>, course: Course) => {
        dict[course.id] = course;
        return dict;
      }, {}));
    };
    xhr.open('GET', 'http://localhost:1123/api/course/');
    xhr.send();
  }, []);

  return (
    <Container fluid>
      <AppCtx.Provider value={allCourses}>
        <CardCtx.Provider value={{ cardStates, cardDispatch }}>
          <Row className="mt-2">
            <Col xs={10}>
              <div style={{ height: "70vh" }}>
                <PlanTable desc={description} setDesc={setDescription} />
              </div>
              <div className="d-flex align-items-center">
                <b className="me-2">Legend:</b>
                <Badge className="curr me-1">Current Course</Badge>
                <Badge className="prereq me-1">Prerequisite</Badge>
                <Badge className="concur me-1">Concurrent</Badge>
                <Badge className="subseq me-1">Subsequent</Badge>
              </div>
              <div>
                <b>Course Description:</b> {description}
              </div>
            </Col>
            <Col xs={2}>
                <LoginForm />
                <SearchBar desc={description} setDesc={setDescription} />
            </Col>
          </Row>
        </CardCtx.Provider>
      </AppCtx.Provider>
    </Container>
  )
}

export default App;