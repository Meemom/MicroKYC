# GigIT.

Fast-track freelancer verification with AI-powered document analysis

---

## About
**GigIT** is a backend API designed to help banks verify freelancers quickly using their tax forms (e.g., 1099). Users submit their documents, and our API analyzes them using **Gemini 2.5 Pro** to produce a verification report. Underwriters then review the report, significantly reducing the time it takes for freelancers to get approved.

---

## Inspiration
We noticed that freelancers often face delays in getting verified by banks because standard verification processes are slow and require manual review of tax documents. We wanted to create a solution that leverages **AI** to automate document analysis and speed up verification, making banking more accessible for freelancers.

---

## What it does
- Users submit their tax documents (e.g., 1099 forms) to the API.  
- The API analyzes the documents using **Gemini 2.5 Pro** to extract relevant information.  
- A verification report is generated and sent to the bank.  
- Underwriters review the report for final approval.  
- Reduces verification time from days to hours.

---

## How we built it
- **Backend:** FastAPI  
- **File processing:** Python, PyPDF2 for PDFs, image handling for scanned documents  
- **AI:** Google Gemini 2.5 Pro for generative document analysis  
- **Testing:** Postman / curl for API endpoint testing  
- **Deployment:** Local server with Uvicorn  

---

## Accomplishments 
- Built a fully functional **document processing API** from scratch  
- Integrated generative AI to automatically analyze and produce verification reports  
- Created a solution specifically for **freelancers**, a group often overlooked in traditional banking systems  

---
## Next Steps
- Expand AI capabilities to handle more document types and international forms  
- Add a frontend dashboard for users and banks to track verification status  
- Implement authentication and security for sensitive document handling  
- Optimize AI processing for faster response times

---
## License / Access
This repository is view-only. All rights reserved by Jemima Silaen, Vriti Dahiya, Sansita Malhotra. No copying, redistribution, or derivative works are permitted without prior written consent. See LICENSE for details.

---

## How to Test Locally
1. Clone the repository  
```bash
git clone <repo-url>
cd backend


