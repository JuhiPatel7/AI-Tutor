# PDF Annotation Features Guide

Your AI Tutor app now includes powerful PDF annotation capabilities to help you study more effectively.

## Features

### 1. Highlighting
- Click the **Highlight** button in the toolbar
- Select any text in the PDF
- The text will be highlighted with your chosen color
- Highlights are saved automatically

### 2. Underlining
- Click the **Underline** button in the toolbar
- Select any text in the PDF
- The text will be underlined with your chosen color
- Underlines are saved automatically

### 3. Text Notes
- Click the **Note** button in the toolbar
- Select any text in the PDF
- Enter your note in the popup dialog
- A sticky note icon will appear on the selected text
- Hover over the icon to see your note

### 4. Color Selection
- Choose from 5 different colors for your annotations
- Yellow (default), Red, Teal, Mint Green, and Lavender
- Click any color circle to select it

### 5. Managing Annotations
- Hover over any annotation to see a delete button
- Click the trash icon to remove an annotation
- All annotations are saved per page and per PDF
- Annotations persist across sessions

## How to Use

1. **Upload a PDF** - Click "Upload PDF" and select your study material
2. **Select an annotation tool** - Choose Highlight, Underline, or Note
3. **Select text** - Click and drag to select text in the PDF
4. **Release to annotate** - The annotation is saved automatically
5. **Change colors** - Click a color circle to change the annotation color
6. **Navigate pages** - Use the arrow buttons to move between pages
7. **Delete annotations** - Hover over an annotation and click the trash icon

## Database Setup

Run the new SQL script to enable annotations:

\`\`\`bash
# In Supabase SQL Editor, run:
scripts/004_create_annotations_table.sql
\`\`\`

## Installation

After pulling the latest changes, install the new dependencies:

\`\`\`bash
npm install
npm run dev
\`\`\`

The app now uses `react-pdf` for better PDF rendering and annotation support.

## Tips

- Annotations are private - only you can see your annotations
- Each PDF maintains its own set of annotations
- Annotations are organized by page number
- Use different colors to categorize different types of information
- Add notes to capture your thoughts and questions while studying
