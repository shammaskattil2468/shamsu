# Mubashira PK — Data Analyst Portfolio Website

A modern personal portfolio website built for **Mubashira PK**, an aspiring Data Analyst pursuing her Bachelor of Computer Applications (BCA), 5th semester.

---

## 🌟 Key Features

1. **Neat White Theme (Default) + Dark Mode Toggle:**
   - Default theme is an ultra-clean, modern white theme with subtle slate/cyan/blue accents, gentle borders, and soft shadows.
   - Interactive Sun/Moon toggle in the header allows visitors to switch between the crisp Neat White theme and the Dark Navy theme seamlessly.

2. **Genuine Personal Information & Hero Section:**
   - **Name:** Mubashira PK
   - **Title:** Aspiring Data Analyst
   - **Tagline:** *"Turning Raw Data Into Meaningful Insights."*
   - **Summary:** Focused on Python, SQL, Microsoft Excel, data cleaning, exploratory data analysis (EDA), and data visualization.
   - **Real Profile Image:** Integrated directly from your uploaded photo (`/mubashira.png`) with options to replace, preview, or remove (falling back to a stylish "MP" monogram).
   - **Status Badge:** *"Exploring Data | Learning Every Day"* with live pulsing indicator.

3. **"My Data Journey" Interactive Pipeline:**
   - **5-Stage Workflow:** `DATA COLLECTION` → `DATA CLEANING` → `DATA ANALYSIS` → `VISUALIZATION` → `INSIGHTS`.
   - Clickable stage navigator with practical code snippets and tools applied at each phase.

4. **Technical Skills (Categorized):**
   - **Programming and Libraries:** Python, Pandas, NumPy
   - **Database and Querying:** SQL, SQL Queries, Joins, Aggregate Functions
   - **Microsoft Excel:** Data Cleaning, Excel Formulas, Lookup Functions, Power Query
   - **Data Analysis and Visualization:** Exploratory Data Analysis (EDA), Data Exploration, Pattern Identification, Insight Generation, Matplotlib, Data Visualization
   - Filterable tabs, clean cards, no deceptive percentage bars.

5. **Currently Learning:**
   - Power BI, Statistics, Advanced Data Analysis, Data Visualization.

6. **Projects & Practical Experience:**
   - **Project 1:** *Student Performance Analysis Using Python* (Python, Pandas, Matplotlib)
   - **Project 2:** *Data Cleaning and Analysis Using Excel* (Microsoft Excel, Power Query)
   - **Project 3:** *Upcoming Data Analytics Project* (Coming Soon badge)
   - Interactive "View Details" modal for deep dive into key activities, tools, and methodologies.

7. **Interactive Data Analytics Showcase (Educational Dashboard):**
   - Transparently labeled sample dataset demonstration.
   - KPI metric summary cards.
   - Subject-wise score distribution bar chart.
   - Grade band category breakdown.
   - Interactive, searchable, sortable sample student records data table.

8. **Education & Certifications:**
   - Bachelor of Computer Applications (BCA), currently pursuing 5th Semester.
   - *Python for Data Analysis* certification card with editable issuer and verification link.

9. **Career Goal & Direct Contact:**
   - Direct `mailto:` email action to **mubashirapk2004@gmail.com** with 1-click clipboard copy.
   - Direct `tel:` phone call to **+91 8086794682** with 1-click clipboard copy.
   - Direct LinkedIn profile link: [Mubashira PK LinkedIn](https://www.linkedin.com/in/mubashira-pk-data-analyst?utm_source=share_via&utm_content=profile&utm_medium=member_android).
   - Validated contact form with formatted client dispatch and honest connection status.

10. **Portfolio Editing System (Admin Mode):**
    - Click **"Edit Portfolio"** in the top navigation bar.
    - Protected by passcode (`mubashira` or `mubashira2024`).
    - Edit profile information, upload/change profile photo, add/edit skills, add/edit projects, edit education and certifications, export/import JSON backups, or reset to defaults.
    - All edits persist automatically in browser `localStorage`.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies (including Express and Mongoose)
npm install

# 2. Make sure MongoDB is running locally on port 27017:
# mongodb://localhost:27017/

# 3. Start both backend server and frontend together:
npm run dev

# (Alternatively, run backend or frontend individually)
npm run server        # Backend Express server on http://localhost:5000
npm run dev:frontend # Frontend Vite app on http://localhost:5173
```

---

## 🍃 MongoDB Storage Integration

- **Connection URI:** `mongodb://localhost:27017/mubashira_portfolio` (configured in `.env`)
- **Portfolio Data Persistence:** All edits made via the "Edit Portfolio" modal are automatically saved into MongoDB and synced with local storage cache.
- **Contact Inquiries Inbox:** Messages submitted through the Contact form are stored into the `messages` collection in MongoDB, and viewable in the admin modal's **"MongoDB Messages"** tab.
- **Offline Resilience:** If MongoDB is offline, the application automatically falls back to browser storage without interrupting visitor experience.

---

## 🔒 Admin Passcode

- **Passcode:** `mubashira` (or `mubashira2024`)
- Allows you to edit any text, image, skill, or project without touching the code.
- You can export a JSON backup of your edits anytime from the "Storage & Backup" tab.

