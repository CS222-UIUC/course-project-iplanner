import { Card, Container, Spacer, useTheme } from "@nextui-org/react";
import { Course } from "../App";

interface CourseProp {
  course: Course
}

function CourseCard({ course }: CourseProp) {
  const { theme } = useTheme();

  return (
    <div>
      <Card isHoverable key={course.id} css={{cursor: "pointer", width: "100%", fontSize: theme?.fontSizes.xs, fontFamily: theme?.fonts.sans}}>
        {`${course.subject} ${course.number}`}<br/>{course.title}
      </Card>
      <Spacer y={0.2} />
    </div>
  )
}

export default CourseCard;