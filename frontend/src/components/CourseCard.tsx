import { CardCtx, Course, CourseCtx } from "../App";
import "./CourseCard.css";

import Card from 'react-bootstrap/Card';
import { MouseEvent, useContext } from "react";
import { Search } from 'react-bootstrap-icons';
import useCardActions from "../utils/CardActions";

function CourseCard({ course }: { course: Course }) {
  const { cardStates } = useContext(CardCtx);
  const allCourses = useContext(CourseCtx);
  const { setRelation, clearRelation } = useCardActions();

  // Use allCourses to determine relations. prereq|concur|equiv are provided.
  // Calculate prerequisite chain (prechn). Also set the current hovered course
  // to "curr". Use setRelation(course_id, relation) to set the relations.
  const calcRelations = (event: MouseEvent) => {
    const queue = [course.id];
    while (queue.length !== 0) {
      const cId = queue.shift()!;
      const cCourse = allCourses.find((c) => c.id === cId)!;
      for (const Ids of cCourse.prereq) {
        queue.push(Ids);
        setRelation(Ids, "prechn");
      }
    }
    for (const itr of course.equiv) {
      setRelation(itr, "equiv");
    }
    for (const itr of course.concur) {
      setRelation(itr, "concur");
    }
    for (const itr of course.prereq) {
      setRelation(itr, "prereq");
    }
    for (const itr of course.equiv) {
      setRelation(itr, "equiv");
    }
    for (const itr of course.subseq) {
      setRelation(itr, "subseq");
    }
    setRelation(course.id, "curr");
  };

  // Set all course's relation to "none".
  const clearRelations = (event: MouseEvent) => {
    for (const iterator of allCourses) {
      clearRelation(iterator.id);
    }
  }

  return (
    <div>
      <Card key={course.id} className={"shadow fs-6 " + cardStates[course.id]?.relation?.toLowerCase()}
            onMouseEnter={calcRelations} onMouseLeave={clearRelations}>
        <Card.Body>
          {`${course.subject} ${course.number}`}<br />{course.title}
        </Card.Body>
        {
          // searched icon on top-right of card
          cardStates[course.id]?.searched ?
            (<Search style={{ position: "absolute", top: "10px", right: "10px" }} className="text-primary" />) :
            null
        }
      </Card>
    </div>
  )
}

export default CourseCard;