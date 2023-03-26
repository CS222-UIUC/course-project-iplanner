import { CardCtx, Course, CourseCtx } from "../App";

import Card from 'react-bootstrap/Card';
import { MouseEvent, useContext } from "react";
import { Search } from 'react-bootstrap-icons';
import useCardActions from "../utils/CardActions";

function CourseCard({ course }: { course: Course }) {
  const { cardStates } = useContext(CardCtx);
  const allCourses = useContext(CourseCtx);
  const { setRelation, clearRelation } = useCardActions();

  const calcRelations = (event: MouseEvent) => {
    // TODO Anant: calculate and set relations.
    // Use allCourses to determine relations. prereq|concur|equiv are provided.
    // Calculate prerequisite chain (prechn). Also set the current hovered course
    // to "curr". Use setRelation(course_id, relation) to set the relations.
  };
  const clearRelations = (event: MouseEvent) => {
    // TODO
    // Set all course's relation to "none".
  }

  return (
    <div>
      <Card key={course.id} className="shadow fs-6" onMouseEnter={calcRelations} onMouseLeave={clearRelations}>
        <Card.Body>
          {`${course.subject} ${course.number}`}<br/>{course.title}
        </Card.Body>
        {
          cardStates[course.id]?.searched ?
          (<Search style={{position: "absolute", top: "10px", right: "10px"}} className="text-primary" />) :
          null
        }
        {
          cardStates[course.id]?.relation !== "none" ?
          (<div style={{position: "absolute", bottom: "10px", right: "20px"}}>{cardStates[course.id]?.relation}</div>) :
          null
        }
      </Card>
    </div>
  )
}

export default CourseCard;