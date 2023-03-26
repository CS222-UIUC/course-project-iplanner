import { createContext, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchBar from './components/SearchBar';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import PlanTable from './components/PlanTable';

export interface Course {
  id: string,
  subject: string,
  number: string,
  title: string,
  credit: number
  equiv: string[],
  concur: string[][],
  prereq: string[][]
}

export interface CardState {
  highlight: "prereq" | "concur" | "subseq" | "equiv",
  searched: boolean
}
const CardCtx = createContext({});

function App() {
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});

  return (
    <Container fluid>
      <Row className="mt-2">
        <Col xs={10}>
          <PlanTable />
        </Col>
        <Col xs={2}>
          <SearchBar />
        </Col>
      </Row>
    </Container>
  )
}

export default App;
