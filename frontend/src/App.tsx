import { createContext, Dispatch, useEffect, useReducer, useState, Profiler } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchBar from './components/SearchBar';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import PlanTable from './components/PlanTable';
import { CardAction, cardReducer, CardState, Pattern } from './utils/CardActions';

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
      </AppCtx.Provider>
    </Container>
  )
}

export default App;
