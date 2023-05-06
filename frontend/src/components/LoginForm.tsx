import { useState } from "react";
import { Button, Container, Modal, Form } from "react-bootstrap";

export default function LoginForm() {
    const [show, setShow] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const login = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();

      let xhr = new XMLHttpRequest();
      xhr.onload = (event: ProgressEvent<EventTarget>) => {
        setShow(true);
      };
      xhr.onerror = (event: ProgressEvent<EventTarget>) => {
        console.log("Error");
      };
      xhr.open('POST', 'http://localhost:1123/api/user/login');
      xhr.send(JSON.stringify({ username, password }));
    };

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
                <Form.Label>Username</Form.Label>
                <Form.Control type="username" placeholder="Username" onChange={e => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" onClick={login}>
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    );
  }