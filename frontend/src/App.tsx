import React, { createContext, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ReactSortable } from "react-sortablejs";
import SearchBar from './components/SearchBar';
import CourseCard from './components/CourseCard';
import { flushSync } from 'react-dom';
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
        <Col xs={9}>
          <PlanTable />
        </Col>
        <Col xs={3}>
          <SearchBar />
        </Col>
      </Row>
    </Container>
  )
}

export default App;
