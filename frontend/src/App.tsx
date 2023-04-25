import { createContext, Dispatch, useEffect, useReducer, useState, Profiler } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchBar from './components/SearchBar';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import PlanTable from './components/PlanTable';
import { CardAction, cardReducer, CardState } from './utils/CardActions';

// import data from "./data/20230307_api_test_courses.json";

export interface Course {
  id: string,
  subject: string,
  number: string,
  title: string,
  credit: number,
  equiv: string[],
  concur: string[],
  prereq: string[],
  subseq: string[]
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
    xhr.open('GET', 'http://localhost:1123/api/course/2020-fa'); // TODO should be based on current sem/dropdown value
    xhr.send();
  }, []);

  const profilerCallback = function(id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: Set<any>) {
    console.log(`${id} ${phase} took ${actualDuration} ms`);
  }

  return (
    <Profiler id="searchBarProfiler" onRender={profilerCallback}>
      <Container fluid>
        <AppCtx.Provider value={allCourses}>
          <CardCtx.Provider value={{ cardStates, cardDispatch }}>
            <Row className="mt-2">
              <Col xs={10}>
                <PlanTable />
              </Col>
              <Col xs={2}>
                <SearchBar />
              </Col>
            </Row>
          </CardCtx.Provider>
        </AppCtx.Provider>
      </Container>
    </Profiler>
  )
}

export default App;
