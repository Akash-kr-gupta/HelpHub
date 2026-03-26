Software Requirement Specification (SRS)
Project: HelpHub – Community Emergency Assistance Platform
1. Introduction
1.1 Purpose

The purpose of this document is to describe the functional and non-functional requirements of HelpHub, a web-based platform designed to connect people in need with volunteers, NGOs, and community helpers.

The system allows users to report emergencies, request assistance, and enables volunteers or organizations to respond quickly.

This document is intended for:

Developers
Project reviewers
Stakeholders
Future contributors
1.2 Scope

HelpHub is a community-driven emergency support platform that enables:

Users to post help requests
Volunteers to respond to emergencies
NGOs to manage and accept official help cases
Real-time tracking of help activities
Social impact tracking through analytics

The system focuses on quick response, community participation, and transparency.

1.3 Definitions and Acronyms
Term	Meaning
NGO	Non-Governmental Organization
User	Person requesting help
Volunteer	Person providing help
Admin	System administrator
Dashboard	Page showing help requests
API	Application Programming Interface
2. Overall Description
2.1 Product Perspective

HelpHub is a web-based application built using:

Frontend:

HTML
CSS
JavaScript

Backend:

Python
Flask framework

Database:

MongoDB

It acts as a bridge between people in need and helpers.

2.2 Product Functions

The system provides the following features:

Submit emergency help request
Upload photo evidence
Track help request status
Dashboard to view requests
Accept/complete requests
NGO participation panel
Donation module
Map-based help visualization
Notification system
Social impact analytics
2.3 User Classes
1. General User
Can submit help requests
Upload images
Provide contact details
2. Volunteer
View help requests
Accept and complete requests
3. NGO Partner
Login to NGO panel
View nearby emergencies
Accept official requests
4. Admin
Monitor platform activity
Manage requests
Analyze system impact
2.4 Operating Environment

The system runs on:

Operating System:

Windows
Linux
MacOS

Browsers:

Chrome
Firefox
Edge
Safari

Server:

Flask Web Server

Database:

MongoDB
3. System Features
3.1 Help Request Module
Description

Allows users to submit emergency help requests.

Inputs
Help type
Description
Location
Contact
Priority
Photo
Output
Request stored in database
Visible on dashboard
3.2 Dashboard Module

Displays all help requests in real-time.

Features:

View requests
Filter by priority
Accept help request
Mark request as completed
3.3 Image Upload System

Users can upload photos to describe emergency situations.

Features:

Secure image storage
Unique file naming
Image preview
3.4 Map View System

Displays help requests on a map.

Features:

Location-based markers
Priority color indicators
Real-time updates
3.5 NGO Partner Panel

NGOs can officially participate in helping.

Features:

NGO login
Emergency listing
Accept requests
Track NGO activity
3.6 Donation Module

Allows users to contribute resources.

Donation Types:

Food
Money
Medicine
3.7 Notification System

Provides alerts for new requests.

Features:

Real-time updates
Notification bell
Request counter
3.8 Impact Analytics Dashboard

Shows platform impact statistics:

Metrics:

Total help requests
Lives helped
Volunteers active
NGOs participating
Animals rescued
4. Non-Functional Requirements
4.1 Performance
System should handle multiple help requests simultaneously
API response time should be under 2 seconds
4.2 Security
Input validation
Secure file uploads
Protection against malicious files
4.3 Usability
Mobile-friendly interface
Simple request submission
Clear navigation
4.4 Reliability
System uptime above 95%
Database backup support
4.5 Scalability

The platform should support:

Increasing number of users
Multiple NGOs
Larger data storage
5. System Architecture

Architecture follows a 3-tier structure:

Presentation Layer
Frontend interface (HTML, CSS, JS)

Application Layer
Flask backend logic

Data Layer
MongoDB database

Flow:

User → Flask Server → MongoDB → Response → UI

6. External Interface Requirements
6.1 User Interface

Key pages:

Home Page
Help Request Page
Dashboard
NGO Panel
Donation Page
Map View
6.2 Hardware Interface

Works on:

Laptop
Desktop
Mobile devices
6.3 Software Interface

Technologies used:

Flask
MongoDB
JavaScript
HTML/CSS
7. Future Enhancements

Future versions of HelpHub may include:

AI-based emergency detection
SMS alert system
Mobile application
GPS-based location detection
Volunteer ranking system
Live chat assistance
Disaster prediction integration
8. Conclusion

HelpHub provides a community-driven solution for emergency assistance, enabling people, volunteers, and organizations to collaborate efficiently.

The system focuses on social impact, accessibility, and rapid response, making it suitable for real-world humanitarian applications.
