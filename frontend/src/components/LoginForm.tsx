import { useContext, useRef, useState } from "react";
import { Button, Container, Modal, Form, Row, Col, ButtonGroup, Overlay, Tooltip } from "react-bootstrap";
import { AppCtx, Course, PlanCtx } from "../App";

export default function LoginForm() {
  const [show, setShow] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [loginError, setLoginError] = useState(0);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showSave, setShowSave] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [loadMessage, setLoadMessage] = useState('');
  const saveButton = useRef(null);
  const loadButton = useRef(null);

  const login = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    let xhr = new XMLHttpRequest();
    xhr.onload = (event: ProgressEvent<EventTarget>) => {
      if (xhr.status >= 200 && xhr.status < 400) {
        setShow(false);
        setLoginStatus(true);
        setLoginError(0);
      } else {
        setLoginError(1); // Invalid credentials
      }
    };
    xhr.onerror = (event: ProgressEvent<EventTarget>) => {
      setLoginError(2); // Network error
    };
    xhr.open('POST', 'http://localhost:1123/api/user/login');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ username, password }));
  };

  const { plan: coursePlan, setPlan: setCoursePlan } = useContext(PlanCtx);
  const planToStrArray = (plan: Course[][]) => {
    return plan.map((semester: Course[]) => {
      return semester.map((course: Course) => course.id);
    });
  };
  const savePlan = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    let xhr = new XMLHttpRequest();
    xhr.onload = (event: ProgressEvent<EventTarget>) => {
      if (xhr.status >= 200 && xhr.status < 400) {
        setSaveMessage("Plan saved!");
      } else {
        setSaveMessage("Failed, need to login!");
      }
      setShowSave(true);
      setInterval(() => setShowSave(false), 3000);
    };
    xhr.onerror = (event: ProgressEvent<EventTarget>) => {
      setSaveMessage("Network error!");
      setShowSave(true);
      setInterval(() => setShowSave(false), 3000);
    };
    xhr.open('POST', 'http://localhost:1123/api/user/save');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(planToStrArray(coursePlan)));
  };

  const allCourses = useContext(AppCtx);
  const strArrayToPlan = (strArray: string[][]) => {
    return strArray.map((semester: string[]) => {
      return semester.map((courseId: string) => allCourses[courseId]);
    });
  };
  const loadPlan = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    let xhr = new XMLHttpRequest();
    xhr.onload = (event: ProgressEvent<EventTarget>) => {
      if (xhr.status >= 200 && xhr.status < 400) {
        const plan = JSON.parse(xhr.responseText);
        setCoursePlan(strArrayToPlan(plan));
        setLoadMessage("Plan loaded!");
      } else {
        setLoadMessage("Failed, need to login!");
      }
      setShowLoad(true);
      setInterval(() => setShowLoad(false), 3000);
    };
    xhr.onerror = (event: ProgressEvent<EventTarget>) => {
      setLoadMessage("Network error!");
      setShowLoad(true);
      setInterval(() => setShowLoad(false), 3000);
    };
    xhr.open('GET', 'http://localhost:1123/api/user/plan');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  };

  return (
    <Container fluid>
      <div className="w-100">
        {
          !loginStatus ?
          <Button variant="info" className="w-100" onClick={handleShow}>Login</Button> :
          <ButtonGroup className="w-100" aria-label="Basic example">
            <Button ref={saveButton} variant="success" onClick={savePlan}>Save</Button>
            <Overlay target={saveButton.current} show={showSave} placement="bottom">
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  { saveMessage }
                </Tooltip>
              )}
            </Overlay>
            <Button ref={loadButton} variant="warning" onClick={loadPlan}>Load</Button>
            <Overlay target={loadButton.current} show={showLoad} placement="bottom">
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  { loadMessage }
                </Tooltip>
              )}
            </Overlay>

          </ButtonGroup>
        }
      </div>

      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="username" placeholder="Username" onChange={e => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" onClick={login}>
              Login
            </Button>
            <div className="text-danger">
              {
                loginError === 1 ? "Invalid credentials!" :
                loginError === 2 ? "Network error!" : ""
              }
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}