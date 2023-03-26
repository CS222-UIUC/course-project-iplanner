import { Course } from "../App";

import Card from 'react-bootstrap/Card';

interface CourseProp {
  course: Course
}

function CourseCard({ course }: CourseProp) {
  return (
    <div>
      <Card key={course.id} className="shadow fs-6">
        <Card.Body>
          {`${course.subject} ${course.number}`}<br/>{course.title}
        </Card.Body>
      </Card>
    </div>
  )
}

export default CourseCard;