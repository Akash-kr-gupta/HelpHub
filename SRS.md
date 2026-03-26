📄 Software Requirements Specification (SRS)

🚑 HelpHub — Social Emergency Network
1. Introduction
1.1 Purpose

The purpose of this document is to describe the software requirements for HelpHub, a real-time social emergency assistance platform.
The system connects people in need with volunteers, NGOs, and donors who can provide immediate help.

The platform enables:

Posting emergency requests
Viewing nearby requests
Accepting and completing help tasks
Community-driven assistance

This SRS defines the functional requirements, non-functional requirements, system architecture, and constraints of the HelpHub system.

2. Overall Description
2.1 Product Perspective

HelpHub is a web-based emergency response system that allows individuals to request help and enables community members to respond.

The platform operates as a two-way assistance network, where:

Anyone can request help
Anyone can offer help

The system stores requests in a database and displays them on a dashboard and map interface.

2.2 Product Features
🚨 Emergency Request Posting

Users can submit emergency requests including:

Help type
Description
Contact information
Photo proof
Location
🗺 Live Location Detection

The system can capture or accept location coordinates to allow responders to identify nearby emergencies.

📊 Dashboard Monitoring

The dashboard displays:

All emergency requests
Status of requests
Request priority
Help completion status
🤝 Volunteer / Community Support

Volunteers and community members can:

View emergency requests
Accept requests
Mark them as completed
🏢 NGO Support Panel

NGOs can view emergency cases and officially accept or respond to them.

🎁 Donation Support

Users can contribute resources such as:

Food
Medical supplies
Financial donations
📈 Impact Analytics

The system tracks social impact metrics including:

Total emergencies handled
Number of volunteers
Animals rescued
Lives supported
3. System Architecture

The HelpHub system follows a three-layer architecture.

Frontend

Responsible for user interface and user interaction.

Technologies:

HTML
CSS
Bootstrap
JavaScript
Backend

Handles application logic and API endpoints.

Technology:

Python
Flask Framework
Database

Stores all emergency requests and system data.

Technology:

MongoDB
4. Functional Requirements
FR1: User Request Submission

The system shall allow users to submit emergency requests.

FR2: Photo Upload

The system shall allow users to upload photos as proof of emergency.

FR3: Request Storage

All requests shall be stored in the database.

FR4: Dashboard Viewing

The system shall display all emergency requests on a dashboard.

FR5: Request Status Tracking

Each request shall have a status:

Pending
Completed
FR6: Accept Help Request

Volunteers shall be able to accept requests.

FR7: Map Visualization

The system shall display emergency locations on a map.

FR8: Notification System

The system shall notify users when new requests are created.

5. Non-Functional Requirements
Performance

The system should respond to requests within 2 seconds.

Security

User contact information and data must be protected from unauthorized access.

Scalability

The system should support increasing numbers of users and requests.

Usability

The platform should provide a simple and intuitive interface.

Reliability

The system should maintain high availability and minimal downtime.

6. User Roles
👤 Requester

A user who needs help.

Capabilities:

Submit emergency requests
Upload images
Track status
🤝 Volunteer

A community member who offers help.

Capabilities:

View requests
Accept requests
Mark help completed
🏢 NGO

Organizations that assist with emergencies.

Capabilities:

View emergency cases
Respond to requests
Provide official assistance
7. External Interface Requirements
User Interface

The platform includes:

Homepage
Request form
Dashboard
Map view
NGO panel
Hardware Requirements

Minimum system requirements:

Internet connection
Web browser
Smartphone or computer
8. Constraints
Requires internet connectivity
Requires database connection
Depends on location availability for map features
9. Future Enhancements

Future versions of HelpHub may include:

Mobile application
AI emergency prioritization
Real-time chat between requester and volunteer
Automatic location detection
SMS emergency alerts
10. Conclusion

HelpHub provides a community-powered digital emergency response network that enables faster and more accessible help during emergencies.

The platform strengthens social collaboration and humanitarian response by connecting people in need with those who can help.
