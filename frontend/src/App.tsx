import { createContext, Dispatch, useEffect, useReducer, useState, SetStateAction } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchBar from './components/SearchBar';
import { Badge, Container, Stack } from 'react-bootstrap';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import PlanTable from './components/PlanTable';
import { CardAction, cardReducer, CardState, Pattern } from './utils/CardActions';

// TODO: FE testing only, change to api call in useEffect onMount function
import data from "./data/20230307_api_test_courses.json";
import LoginForm from './components/LoginForm';

export interface Course {
  id: string,
  subject: string,
  number: string,
  title: string,
  credit: number[],
  equiv: string[],
  concur: string[][],
  prereq: string[][],
  subseq: string[],
  pattern: Pattern,
  description: string
};

interface CardCtxType {
  cardStates: Record<string, CardState>,
  cardDispatch: Dispatch<CardAction>
};

export const NUM_SEMESTERS = 9;
interface CoursePlanType {
  plan: Course[][],
  setPlan: Dispatch<SetStateAction<Course[][]>>
};
interface DescriptionType {
  id: string,
  setId: Dispatch<SetStateAction<string>>
};

const emptyCardCtxType: CardCtxType = {
  cardStates: {},
  cardDispatch: (arg: CardAction) => { }
};
export const CardCtx = createContext(emptyCardCtxType);
export const AppCtx = createContext<Record<string, Course>>({});
export const PlanCtx = createContext<CoursePlanType>({ plan: [], setPlan: (arg: SetStateAction<Course[][]>) => { } });
export const DescCtx = createContext<DescriptionType>({ id: "", setId: (arg: SetStateAction<string>) => { } });

function App() {
  const [cardStates, cardDispatch] = useReducer(cardReducer, {});
  const [allCourses, setAllCourses] = useState<Record<string, Course>>({});
  const [description, setDescription] = useState("");
  const [coursePlan, setCoursePlan] = useState<Course[][]>(new Array(NUM_SEMESTERS).fill([]));
  const [descId, setDescId] = useState("");

  // Execute on mount
  useEffect(() => {
    setCoursePlan(new Array(NUM_SEMESTERS).fill([]));

    let xhr = new XMLHttpRequest();

    xhr.onload = function(event: ProgressEvent<EventTarget>)  {
      const dict = JSON.parse(this.responseText).reduce((dict: Record<string, Course>, course: Course) => {
        dict[course.id] = course;
        return dict;
      }, {});
      setAllCourses(dict);
    };
    xhr.open('GET', 'http://localhost:1123/api/course/');
    xhr.send();
  }, []);

  return (
    <Container fluid>
      <AppCtx.Provider value={allCourses}>
        <CardCtx.Provider value={{ cardStates, cardDispatch }}>
          <PlanCtx.Provider value={{ plan: coursePlan, setPlan: setCoursePlan }}>
            <DescCtx.Provider value={{ id: descId, setId: setDescId }}>
              <Row className="mt-2">
                <Col xs={10}>
                  <div style={{ height: "70vh" }}>
                    <PlanTable />
                  </div>
                  <div className="d-flex align-items-center">
                    <b className="me-2">Legend:</b>
                    <Badge className="curr me-1">Current Course</Badge>
                    <Badge className="prereq me-1">Prerequisite</Badge>
                    <Badge className="concur me-1">Concurrent</Badge>
                    <Badge className="subseq me-1">Subsequent</Badge>
                  </div>
                  <div>
                    <b>Course Description: </b>
                    { descId === "" ? "Select a course to view its description." :
                      (
                        <div>
                          <div dangerouslySetInnerHTML={{ __html: allCourses[descId].title + " | Credits: " + allCourses[descId].credit }}></div>
                          <div dangerouslySetInnerHTML={{ __html: allCourses[descId].description }}></div>
                        </div>
                      )
                    }
                  </div>
                </Col>
                <Col xs={2} style={{ height: "98vh", overflow: "hidden" }}>
                  <Stack>
                    <LoginForm />
                    <SearchBar />
                  </Stack>
                </Col>
              </Row>
            </DescCtx.Provider>
          </PlanCtx.Provider>
        </CardCtx.Provider>
      </AppCtx.Provider>
    </Container>
  )
}

export default App;