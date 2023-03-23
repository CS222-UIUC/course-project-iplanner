import { Card } from "@nextui-org/react";
import { Course } from "../App";

interface CourseProp {
  course: Course
}

function CourseCard({ course }: CourseProp) {
  return (
    <Card key={course.id}>
      {`${course.subject} ${course.number}`}<br/>{course.title}
    </Card>
  )
}

export default CourseCard;