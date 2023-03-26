import { createContext, Dispatch, useEffect, useReducer, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchBar from './components/SearchBar';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import PlanTable from './components/PlanTable';
import { CardAction, cardReducer, CardState } from './utils/CardActions';

// TODO: FE testing only, change to api call in useEffect onMount function
import data from "./data/20230307_api_test_courses.json";

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

interface CardCtxType {
  cardStates: Record<string, CardState>,
  cardDispatch: Dispatch<CardAction>
};
const emptyCardCtxType: CardCtxType = {
  cardStates: {},
  cardDispatch: (arg: CardAction) => {}
};
export const CardCtx = createContext(emptyCardCtxType);

function App() {
  const [cardStates, cardDispatch] = useReducer(cardReducer, {});
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  // Execute on mount
  useEffect(() => {
    setAllCourses(data);
  }, []);

  return (
    <Container fluid>
      <CardCtx.Provider value={{ cardStates, cardDispatch }}>
        <Row className="mt-2">
          <Col xs={10}>
            <PlanTable allCourses={allCourses}/>
          </Col>
          <Col xs={2}>
            <SearchBar allCourses={allCourses}/>
          </Col>
        </Row>
      </CardCtx.Provider>
    </Container>
  )
}

export default App;
