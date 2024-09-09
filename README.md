1. Project Overview
The Task Management System is a comprehensive RESTful API built using Node.js. The system includes user authentication, role-based access control (RBAC), and task management features. The API is documented using the OpenAPI Specification (OAS) and integrates with third-party services for notifications.
2. Prerequisites
Before you begin, ensure you have the following installed on your system:

Node.js (v14.x or higher)
npm (v6.x or higher)
Git
Mongodb

bash
Copy code
git clone https://github.com/Sachinthakur147/Task-management.git
cd task-management-system

3. Install Dependencies
4. npm install
5.  Configure Environment Variables
Create a .env file in the root of the project and configure the following environment variables:

plaintext
Copy code
# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=task_management

# JWT Secret
JWT_SECRET=your_jwt_secret

# Third-Party Services (e.g., SendGrid, Twilio)
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

4. Start the Server
   npm start
   
5.  API Overview
5.1 Authentication Endpoints
POST /api/auth/register: Register a new user.
POST /api/auth/login: Authenticate a user and return a JWT.
5.2 User Management Endpoints
GET /api/users: Get a list of all users (Admin only).
GET /api/users/:id: Get a specific user's profile (Admin and Manager).
PUT /api/users/:id: Update a user's profile (Admin and Manager).
DELETE /api/users/:id: Delete a user (Admin only).
5.3 Task Management Endpoints
GET /api/tasks: Get a list of tasks (accessible based on role).
POST /api/tasks: Create a new task (Manager and Admin).
GET /api/tasks/:id: Get details of a specific task (accessible based on role).
PUT /api/tasks/:id: Update a task (Manager and Admin).
DELETE /api/tasks/:id: Delete a task (Admin only).
5.4 Notification Endpoints
POST /api/notifications/preferences: Set notification preferences (User-specific).
GET /api/notifications: Retrieve notification history (User-specific).
5.5 Role-Based Access Control
Roles and permissions are enforced across all endpoints:

Admin: Full access to all endpoints, including user management and task assignment.
Manager: Access to manage tasks and view user profiles within their team.
User: Access to manage their own tasks and view their own profile.
   
