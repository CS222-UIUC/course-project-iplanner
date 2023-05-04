import { createContext, Dispatch, useEffect, useReducer, useState, Profiler } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchBar from './components/SearchBar';
import { Container, Stack } from 'react-bootstrap';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import PlanTable from './components/PlanTable';
import { CardAction, cardReducer, CardState, Pattern } from './utils/CardActions';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

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


function LoginForm() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <Container fluid>
      <Button variant="secondary" onClick={handleShow}>
        Login
      </Button>

      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

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
              <Row style={{ height: "25vh", width: "83vw", padding: "10px" }}>
                <b>Legend:</b>
                <h6 className="curr">This colored course is the current course being hovered over.</h6>
                <h6 className="prereq">These colored courses are a prerequisite of the current course.</h6>
                <h6 className="concur">These colored courses are to be taken concurrently to the current course.</h6>
                <h6 className="subseq">These colored courses are to be taken after the current course.</h6>
                <b>Course Description:</b> {description}
              </Row>
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
