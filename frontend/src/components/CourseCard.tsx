import { CardCtx, Course, CourseCtx } from "../App";
import "./CourseCard.css";
import { useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { MouseEvent, useContext} from "react";
import { Search, XSquare } from 'react-bootstrap-icons';
import useCardActions from "../utils/CardActions";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function CourseCard({ course }: { course: Course }) {
  const relHighlighted = useRef<string[]>([]);
  const { cardStates } = useContext(CardCtx);
  const allCourses = useContext(CourseCtx);
  const { setRelation, clearRelation } = useCardActions();

  // Use allCourses to determine relations. prereq|concur|equiv are provided.
  // Calculate prerequisite chain (prechn). Also set the current hovered course
  // to "curr". Use setRelation(course_id, relation) to set the relations.
  const calcRelations = (event: MouseEvent) => {
    let prechn: string[] = [];
    const queue = [course.id];

    while (queue.length !== 0) {
      const cId = queue.shift()!;
      const cCourse = allCourses[cId];

      for (const Ids of cCourse.prereq) {
        queue.push(Ids);
        setRelation(Ids, "prechn");
        relHighlighted.current.push(Ids);
        prechn.push(Ids);
      }
    }

    for (const itr of course.equiv) {
      setRelation(itr, "equiv");
      relHighlighted.current.push(itr);
    }
    for (const itr of course.concur) {
      setRelation(itr, "concur");
      relHighlighted.current.push(itr);
    }
    for (const itr of course.prereq) {
      setRelation(itr, "prereq");
    }
    for (const itr of course.equiv) {
      setRelation(itr, "equiv");
      relHighlighted.current.push(itr);
    }
    for (const itr of course.subseq) {
      setRelation(itr, "subseq");
      relHighlighted.current.push(itr);
    }
    setRelation(course.id, "curr");
    relHighlighted.current.push(course.id);
  };

  // Set all course's relation to "none".
  const clearRelations = (event: MouseEvent) => {
    for(const id of relHighlighted.current)
    {
      clearRelation(id);
    }
    relHighlighted.current = [];
  };

  const missingTooltip = (courseId: string) => {
    return (
      <Tooltip>
        {
          cardStates[courseId].missing?.reduce((msg: string, courseId: string) => {
            const course = allCourses[courseId];
            return course ? msg + `${course.subject} ${course.number} ` : msg;
          }, "Missing requirement(s): ")
        }
      </Tooltip>
    );
  };

  return (
    <div>
      <Card key={course.id} className={"shadow fs-6 " + cardStates[course.id]?.relation?.toLowerCase()}
            onMouseEnter={calcRelations} onMouseLeave={clearRelations}>
        <Card.Body>
          {`${course.subject} ${course.number}`}<br />{course.title}
        </Card.Body>
        <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
        {
          // searched icon on top-right of card
          cardStates[course.id]?.searched ?
            (<Search className="text-primary" />) :
            null
        }
        </div>
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          {
            cardStates[course.id]?.missing?.length > 0 ?
              (
                <OverlayTrigger overlay={missingTooltip(course.id)}>
                  <XSquare className="text-danger"/>
                </OverlayTrigger>
              ) :
              null
          }
        </div>
      </Card>
    </div>
  )
}

export default CourseCard;