Project planning

Client - React Web App User UI Browse idols and groups Play music videos using a custom YouTube player View a personalized feed based on subscribed idols Like and comment on videos and posts Admin UI Search idols or paste external URLs to trigger data sync Create and edit event posts Review AI processed data before saving it to the database

Backend - Node.js / Express REST API Serves data to the React client Handles CRUD for idols, groups, videos, events, subscriptions, feedback Validates requests and checks permissions Auth module Manages login state with JWT or sessions Protects private routes and admin endpoints Data Pipeline (ETL) Imports the seed dataset from Kaggle into SQL Fetches idol and event data from external sources based on user actions or scheduled jobs Works together with the AI service to normalize raw data AI Agent Service Wraps the LLM API Converts messy external data into clean, structured objects For example: consistent idol profile fields or clean event summaries Writes the validated result back to the SQL database Background Jobs Periodically checks for new content for subscribed idols Triggers sync jobs for videos and events Can log job results for monitoring

SQL Database Suggested tables: users Stores user accounts idols, groups Core K-pop entities Seeded from Kaggle, then enriched by sync jobs videos YouTube videos linked to idols or groups events Event posts with time, place, link, and AI generated summary subscriptions Which users follow which idols feedback Likes and comments on videos and posts activity_log View and play history Drives dashboards and future recommendations

External Data Sources Kaggle CSV Initial seed data for idols and groups YouTube Data API Source for public music videos for the player Idol info sites (dbkpop, Kprofiles etc.) Extra idol and group metadata Parsed and normalized by the AI service Event pages (Eventbrite and other ticket sites) Single event URLs as input Used to build event posts with AI summaries LLM API Provides the AI agent with summarization and field mapping abilities
Potential Risk and solustion:

Technical Risks 
Risk 1.1 The project has too many moving parts and may increase technical debt. Solution Split the work into clear milestones. Make each milestone runnable and demo ready. 
Risk 1.2 YouTube API quota limits may block large data requests. Solution Use caching. Fetch new video data once per day. Store all metadata in SQL. 
Risk 1.3 The custom music player may become too complex. Solution Start with basic play and pause. Add queue playback later.
Data Risks 

Risk 2.1 The Kaggle dataset is old and incomplete. Solution Use Kaggle as seed data. Add an admin panel to import new idol data from external sites. 
Risk 2.2 External websites may change their HTML structure and break scraping. Solution Separate scraping and data mapping. Use AI to normalize fields. Update only selectors when needed. 
Risk 2.3 Event APIs like Eventbrite have limited public access. Solution Use single event URLs. Extract data from the page. Let AI produce a clean summary.
Legal and API Risks 

Risk 3.1 YouTube playback may violate platform rules. Solution Use the official embed API. Keep the YouTube watermark. Do not download videos.
Risk 3.2 Using idol photos may cause copyright issues. Solution Use YouTube thumbnails or your own images. Avoid crawling commercial photo sites.

System Design Risks 

Risk 4.1 The data update pipeline may become unstable. Solution Split the pipeline into three layers: Fetcher, AI Normalizer, SQL Writer. 
Risk 4.2 Backend APIs may become inconsistent and hard to maintain. Solution Define all endpoints in a clear API contract or Swagger file. 
Risk 4.3 A full recommendation system may slow the project. Solution Start with simple rules: subscribed idols, recent videos, and basic history.

Execution Risks 

Risk 5.1 Trying to build all features at once may delay completion. Solution Follow milestone-based development: Auth → Database → Player → Subscriptions → Events → AI. 
Risk 5.2 Deployment on AWS may take too much time. Solution Develop locally first. Deploy only after MVP. Use simple hosting options like S3, CloudFront, or Render.

AI Agent Layer (Langflow)
The project uses Langflow as a low-code AI agent layer.

Langflow is an open source visual framework for building LLM agents and workflows.
It lets me design flows for idol data normalization and event summarization without writing complex AI code.
Each Langflow flow is deployed as a REST API endpoint.
The Node.js backend calls these endpoints and stores the cleaned JSON in PostgreSQL.
Planned flows:

Idol Normalizer Flow

Input: raw text or HTML extracted from K-pop info sites
Output: structured idol profile (name, group, debut year, company, tags, sources)
Event Summary Flow

Input: raw content from event pages
Output: cleaned event object (title, datetime, venue, source link, short summary)
This setup keeps the AI logic outside the core app and reduces the amount of custom code in the backend while staying fully open source.

Tech Stack (cost friendly and open source)
•	Frontend: React + Vite + Tailwind CSS
•	Backend: Node.js + Express
•	Database: PostgreSQL (local Docker, future ready for AWS RDS)
•	ORM / Migrations: Prisma or Knex.js
•	Hosting: local for backend and DB, free static hosting (Netlify / Vercel) for frontend
•	Optional AI: pluggable LLM service, disabled by default to keep the project free, langflow

Open source API
1.	React-youtube (npm install react-youtube)
2.	Langflow 
3.	Cheerie – HTML parsing (npm install cheerie)
4.	Keycloak – user login / auth
<img width="468" height="273" alt="image" src="https://github.com/user-attachments/assets/a4e169d3-dfb7-4c77-828b-6105436d3db1" />
