"""ATS-Friendly Resume Templates and Generation"""

from typing import Dict, List, Optional
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from io import BytesIO


TEMPLATES = {
    "ats-friendly-1": {
        "name": "ats-friendly-1",
        "display_name": "Classic ATS-Friendly",
        "description": "Simple, ATS-optimized format with clean typography",
        "ats_optimized": True
    },
    "ats-friendly-2": {
        "name": "ats-friendly-2",
        "display_name": "Modern ATS",
        "description": "Modern layout optimized for Applicant Tracking Systems",
        "ats_optimized": True
    }
}


def generate_ats_score(resume_data: dict) -> float:
    """
    Calculate ATS compatibility score based on resume structure.
    Score is from 0 to 100.
    """
    score = 50  # Base score
    
    # Check for essential sections
    if resume_data.get("full_name"):
        score += 5
    if resume_data.get("email"):
        score += 5
    if resume_data.get("phone"):
        score += 5
    if resume_data.get("location"):
        score += 5
    
    # Check for professional sections
    if resume_data.get("experience") and len(resume_data["experience"]) > 0:
        score += 10
    if resume_data.get("education") and len(resume_data["education"]) > 0:
        score += 10
    if resume_data.get("skills") and len(resume_data["skills"]) > 0:
        score += 10
    
    # Bonus for summary
    if resume_data.get("summary"):
        score += 5
    
    return min(score, 100)


def generate_resume_html(resume_data: dict, template: str = "ats-friendly-1") -> str:
    """Generate HTML representation of resume"""
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Resume - {resume_data.get('full_name', 'User')}</title>
        <style>
            body {{
                font-family: Arial, Helvetica, sans-serif;
                line-height: 1.6;
                max-width: 8.5in;
                margin: 0.5in;
                padding: 0;
                color: #333;
            }}
            h1 {{
                font-size: 24px;
                margin: 0 0 5px 0;
                text-transform: uppercase;
            }}
            .contact {{
                font-size: 12px;
                margin-bottom: 15px;
                text-align: center;
            }}
            .contact span {{
                margin: 0 10px;
            }}
            h2 {{
                font-size: 14px;
                margin: 15px 0 8px 0;
                padding-bottom: 3px;
                border-bottom: 2px solid #333;
                text-transform: uppercase;
            }}
            .entry {{
                margin-bottom: 10px;
            }}
            .entry-title {{
                font-weight: bold;
                font-size: 12px;
            }}
            .entry-subtitle {{
                font-style: italic;
                font-size: 11px;
                color: #666;
            }}
            .entry-description {{
                font-size: 11px;
                margin-top: 3px;
            }}
            .skills {{
                font-size: 11px;
            }}
            .skills-list {{
                display: inline;
            }}
        </style>
    </head>
    <body>
        <h1>{resume_data.get('full_name', 'Full Name')}</h1>
        
        <div class="contact">
    """
    
    if resume_data.get("email"):
        html += f"<span>{resume_data['email']}</span>"
    if resume_data.get("phone"):
        html += f"<span>{resume_data['phone']}</span>"
    if resume_data.get("location"):
        html += f"<span>{resume_data['location']}</span>"
    
    html += "</div>"
    
    # Summary
    if resume_data.get("summary"):
        html += f"""
        <h2>Professional Summary</h2>
        <p>{resume_data['summary']}</p>
        """
    
    # Experience
    if resume_data.get("experience"):
        html += "<h2>Experience</h2>"
        for exp in resume_data["experience"]:
            html += f"""
            <div class="entry">
                <div class="entry-title">{exp.get('job_title', '')} - {exp.get('company', '')}</div>
                <div class="entry-subtitle">{exp.get('start_date', '')} to {exp.get('end_date', '')}</div>
                <div class="entry-description">{exp.get('description', '')}</div>
            </div>
            """
    
    # Education
    if resume_data.get("education"):
        html += "<h2>Education</h2>"
        for edu in resume_data["education"]:
            html += f"""
            <div class="entry">
                <div class="entry-title">{edu.get('degree', '')} in {edu.get('field', '')} - {edu.get('school', '')}</div>
                <div class="entry-subtitle">{edu.get('start_date', '')} to {edu.get('end_date', '')}</div>
                {f'<div class="entry-description">{edu.get("description", "")}</div>' if edu.get('description') else ''}
            </div>
            """
    
    # Skills
    if resume_data.get("skills"):
        html += f"""
        <h2>Skills</h2>
        <div class="skills-list">{', '.join(resume_data['skills'])}</div>
        """
    
    html += """
    </body>
    </html>
    """
    
    return html


def generate_resume_pdf(resume_data: dict, template: str = "ats-friendly-1") -> bytes:
    """Generate PDF resume using reportlab"""
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.black,
        spaceAfter=6,
        alignment=0
    )
    story.append(Paragraph(resume_data.get('full_name', 'Full Name'), title_style))
    
    # Contact info
    contact_info = []
    if resume_data.get("email"):
        contact_info.append(resume_data['email'])
    if resume_data.get("phone"):
        contact_info.append(resume_data['phone'])
    if resume_data.get("location"):
        contact_info.append(resume_data['location'])
    
    contact_style = ParagraphStyle(
        'Contact',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.grey,
        spaceAfter=12,
        alignment=1
    )
    story.append(Paragraph(' | '.join(contact_info), contact_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Summary
    if resume_data.get("summary"):
        heading_style = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontSize=12,
            textColor=colors.black,
            spaceAfter=6,
            borderPadding=4,
            borderColor=colors.black,
            borderWidth=0.5,
            borderBottomWidth=2
        )
        story.append(Paragraph("PROFESSIONAL SUMMARY", heading_style))
        story.append(Paragraph(resume_data['summary'], styles['Normal']))
        story.append(Spacer(1, 0.15*inch))
    
    # Experience
    if resume_data.get("experience"):
        story.append(Paragraph("EXPERIENCE", heading_style))
        for exp in resume_data["experience"]:
            story.append(Paragraph(
                f"<b>{exp.get('job_title', '')} - {exp.get('company', '')}</b>",
                styles['Normal']
            ))
            story.append(Paragraph(
                f"<i>{exp.get('start_date', '')} to {exp.get('end_date', '')}</i>",
                styles['Normal']
            ))
            story.append(Paragraph(exp.get('description', ''), styles['Normal']))
            story.append(Spacer(1, 0.1*inch))
    
    # Education
    if resume_data.get("education"):
        story.append(Paragraph("EDUCATION", heading_style))
        for edu in resume_data["education"]:
            story.append(Paragraph(
                f"<b>{edu.get('degree', '')} in {edu.get('field', '')} - {edu.get('school', '')}</b>",
                styles['Normal']
            ))
            story.append(Paragraph(
                f"<i>{edu.get('start_date', '')} to {edu.get('end_date', '')}</i>",
                styles['Normal']
            ))
            if edu.get('description'):
                story.append(Paragraph(edu['description'], styles['Normal']))
            story.append(Spacer(1, 0.1*inch))
    
    # Skills
    if resume_data.get("skills"):
        story.append(Paragraph("SKILLS", heading_style))
        skills_text = ', '.join(resume_data['skills'])
        story.append(Paragraph(skills_text, styles['Normal']))
    
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()


def get_available_templates() -> List[Dict]:
    """Get list of available resume templates"""
    return list(TEMPLATES.values())
