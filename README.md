K-pop Music Hub
A full stack K-pop content platform with an admin CMS, AI powered data pipeline, and a user focused music player.
This project supports both casual fans and admins who want to maintain an accurate K-pop database. The system integrates external data sources, AI based normalization, clean SQL storage, and a React interface for browsing groups, idols, and music videos.
1. Project Overview
The platform provides two main user experiences.
Client – React Web App
Browse idols, groups, albums, and videos
Play music videos through a custom YouTube embedded player
Receive personalized content based on subscriptions
View featured idols, trending tracks, and upcoming content
Like or comment on posts in future versions
Admin – Data Management Console
Import idols, groups, and albums by pasting external profile URLs
Import music videos using YouTube links
Validate and edit AI processed metadata before saving
Manage events with AI generated summaries
Search, filter, edit, and delete existing entries
2. System Architecture
Frontend
React + Vite + Tailwind CSS
Component based UI for groups, idols, and video playback
Role aware navigation menu (user vs admin)
Fully responsive layout
Backend
Node.js + Express REST API
Serves all data to frontend
Handles CRUD for:
groups
idols
videos
events
subscriptions
feedback
Validates requests and checks permissions
Integrates with AI and external APIs
Includes a background job layer for periodic sync tasks
Authentication
Keycloak
Login state handled on both client and server
Protects admin routes
Future plan: role based access (USER / ADMIN)
3. AI Agent Layer (Langflow)
The project uses Langflow as a low code AI workflow engine.
Each flow is deployed as a REST endpoint. The Node backend calls these flows and writes the cleaned results into PostgreSQL.
Idol Normalization Flow
Input: raw text or HTML from K-pop profile sites
Output: structured profile
idol name
group
debut year
tags
company
cleaned metadata
Event Summary Flow
Input: raw event page content
Output: structured event object
title
datetime
venue
summary
official link
This approach keeps AI logic decoupled. Backend stays clean and easy to maintain.
4. Data Pipeline (ETL)
The platform uses a three step pipeline:
1. Fetcher
Downloads raw data from Kaggle CSV, K-pop sites, Eventbrite pages, YouTube Data API
2. AI Normalizer
Langflow cleans and standardizes all fields
Removes inconsistencies in external data sources
3. SQL Writer
Saves final data into PostgreSQL
Ensures referential integrity across groups, idols, albums, and videos
Background jobs can refresh subscribed idols and new video releases.
5. Database Schema (PostgreSQL)
Recommended tables:
Table	Purpose
users	user accounts (Keycloak ID, profile)
groups	core group info
idols	linked to groups
albums	linked to groups and idols
videos	YouTube data + metadata
events	event schedule, venue, link, AI summary
subscriptions	user to idol relationship
feedback	likes and comments
activity_log	view history and analytics
The schema is optimized for fan interactions, search, and recommendation features.
6. External Data Sources
Kaggle CSV – initial seed dataset
YouTube Data API – public video metadata
K-profiles / dbkpop – additional group and idol metadata
Eventbrite and similar sites – event details
LLM API / Langflow – summarizes and maps fields
This hybrid pipeline enriches the data while keeping the system cost friendly.
7. Technology Stack
Frontend: React, Vite, Tailwind CSS
Backend: Node.js, Express
Database: PostgreSQL (local Docker, AWS ready)
ORM: Prisma or Knex
Auth: Keycloak
AI: Langflow (open source, optional)
YouTube Player: react-youtube
HTML parsing: Cheerio
Hosting:
Frontend: Netlify or Vercel
Backend: local or Render
DB: Docker or RDS
All components are open source or free to run.
8. Milestones (as of 2025-12-03)
1. Authentication
Keycloak login integrated
Token handling working
Sidebar adapts to user role
Admin section visible only when logged in
2. Admin – Video Importing
Paste YouTube URL to auto fetch metadata
Form auto filled with extracted info
Save to SQL fully working
Video dashboard supports search, A-Z filter, and group filter
Edit and delete functions complete
3. Admin – Group / Idol / Album Import
URL scraping page implemented
Extracts group metadata from profile sites
Add idols and albums dynamically
Save bundle into PostgreSQL
CSV import UI prepared
4. Public UI
Groups page fully implemented
Idols page connected to live DB
Clean card layouts
5. Music Player Integration
Embedded YouTube player with next and previous buttons
Queue displayed under current video
Featured idol widget pulling live data
6. Global Structure
Sidebar navigation complete
Dark theme applied across UI
Logout shows username
Admin routes organized
Progress Summary
The system now functions as a working CMS plus early user platform. The foundation supports playlist features, recommendations, richer idol pages, and advanced event management.
9. Risks and Mitigations
Technical
Too many moving parts → split into small milestones
YouTube quota limits → cache and store metadata in SQL
Complex music player → start simple and iterate
Data
Kaggle dataset outdated → use only as seed
HTML structure changes → keep scrapers independent from normalizers
Limited official event APIs → rely on URL parsing plus AI summarization
Legal
YouTube playback compliance → use official embed API
Idol photo copyright → use thumbnails or approved images
System
ETL pipeline instability → separate fetch, normalize, write layers
API inconsistency → maintain clear API contracts
Heavy recommendations → start with simple rules
Execution
Building too much at once → milestone based workflow
Complex deployment → build locally first, deploy later
10. Common Mistakes and Notes
Mixing ports between local backend and frontend
Using relative fetch URLs that fail due to different servers
Forgetting to protect environment variables or API keys
Overwriting DB rows due to missing unique constraints
11. Status
The project is stable, modular, and ready for the next round of features.