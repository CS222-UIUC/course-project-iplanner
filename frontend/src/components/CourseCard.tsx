import { CardCtx, Course } from "../App";

import Card from 'react-bootstrap/Card';
import { useContext } from "react";
import { Search } from 'react-bootstrap-icons';

function CourseCard({ course }: { course: Course }) {
  const { cardStates } = useContext(CardCtx);

  return (
    <div>
      <Card key={course.id} className="shadow fs-6">
        <Card.Body>
          {`${course.subject} ${course.number}`}<br/>{course.title}
        </Card.Body>
        {
          cardStates[course.id]?.searched ?
          (<Search style={{position: "absolute", top: "10px", right: "10px"}} className="text-primary" />) :
          null
        }
      </Card>
    </div>
  )
}

export default CourseCard;