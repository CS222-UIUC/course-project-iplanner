import { CardCtx, Course, AppCtx } from "../App";
import "./CourseCard.css";
import { memo, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { MouseEvent, useContext, CSSProperties } from "react";
import { ExclamationTriangle, Search, XSquare } from 'react-bootstrap-icons';
import useCardActions from "../utils/CardActions";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function CourseCard({ course, style, desc, setDesc }: { course: Course, style: CSSProperties, desc: string, setDesc: Function }) {
  const relHighlighted = useRef<string[]>([]);
  const { cardStates } = useContext(CardCtx);
  const allCourses = useContext(AppCtx);
  const { setRelation, clearRelation } = useCardActions();

  const description = (event : MouseEvent) => {
    setDesc((course.title + " | Credits: " + course.credit + " | " + course.description));
  };

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
    for (const id of relHighlighted.current) {
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

  const patternTooltip = (courseId: string) => {
    let message = "";
    switch (cardStates[courseId].pattern) {
      case "fa_only":
        message += "Offered mostly on fall semesters."; break;
      case "sp_only":
        message += "Offered mostly on spring semesters."; break;
      case "not_recent":
        message += "Not offered recently"; break;
    }
    return (
      <Tooltip>
        {message}
      </Tooltip>
    )
  }

  return (
    <div style={style}>
      <Card key={course.id} className={"shadow fs-6 h-100 " + cardStates[course.id]?.relation?.toLowerCase()}
        onMouseEnter={calcRelations} onMouseLeave={clearRelations} onClick={description}>
        <Card.Body>
          <div className="h6">
            {`${course.subject} ${course.number}`}
          </div>
          <div className="small">
            {course.title}
          </div>
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
                  <XSquare className="text-danger" />
                </OverlayTrigger>
              ) :
              null
          }
        </div>
        <div style={{ position: "absolute", top: "10px", right: "30px" }}>
          {
            cardStates[course.id]?.pattern && cardStates[course.id].pattern !== "none" ?
              (
                <OverlayTrigger overlay={patternTooltip(course.id)}>
                  <ExclamationTriangle className="text-warning" />
                </OverlayTrigger>
              ) :
              null
          }
        </div>
      </Card>
    </div>
  )
}

export default memo(CourseCard);