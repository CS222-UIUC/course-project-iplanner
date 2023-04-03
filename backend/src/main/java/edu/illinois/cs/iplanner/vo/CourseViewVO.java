package edu.illinois.cs.iplanner.vo;

import java.util.List;

import edu.illinois.cs.iplanner.model.CourseDTO;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CourseViewVO {
    private String id;
    
    private String subject;

    private String number;

    private String title;

    private List<Integer> credit;

    private List<List<String>> prereq;

    private List<List<String>> concur;

    private List<String> equiv;

    public CourseViewVO(CourseDTO courseDTO) {
        this.id = courseDTO.getId();
        this.subject = courseDTO.getSubject();
        this.number = courseDTO.getNumber();
        this.title = courseDTO.getTitle();
        this.credit = courseDTO.getCredit();
        this.prereq = courseDTO.getPrereq();
        this.concur = courseDTO.getConcur();
        this.equiv = courseDTO.getEquiv();
    };
}
