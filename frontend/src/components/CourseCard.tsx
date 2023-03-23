import React, { useState } from "react";

function CourseCard() {
  return (
    <Card key={item.id}>{`${item.subject} ${item.number}`}<br/>{item.title}</Card>
  )
}

export default CourseCard;