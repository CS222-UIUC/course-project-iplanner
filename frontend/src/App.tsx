import { createContext, Dispatch, useEffect, useReducer, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchBar from './components/SearchBar';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import PlanTable from './components/PlanTable';
import { CardAction, cardReducer, CardState } from './utils/CardActions';
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


function LoginForm() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
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
    </>

  );
}

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
              <PlanTable desc={description} setDesc={setDescription} />
            </Col>
            <Col xs={2}>
              <Row style={{ height: "5vh", padding: "5px" }}><SearchBar desc={description} setDesc={setDescription} /></Row>
              <Row style={{ height: "10vh", padding: "20px" }}><LoginForm /></Row>
            </Col>
          </Row>
          <Row style={{ height: "30vh", width: "83vw", padding: "10px" }}>
            <b>Legend:</b>
            <h6 className="curr">This colored course is the current course being hovered over.</h6>
            <h6 className="prereq">These colored courses are a prerequisite of the current course.</h6>
            <h6 className="concur">These colored courses are to be taken concurrently to the current course.</h6>
            <h6 className="subseq">These colored courses are to be taken after the current course.</h6>
            <b>Course Description:</b> {description}
          </Row>
        </CardCtx.Provider>
      </CourseCtx.Provider>
    </Container>
  )
}

export default App;
