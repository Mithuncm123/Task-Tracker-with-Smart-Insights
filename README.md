**Task Tracker with Insights**

The **Task Tracker with Insights** Web project is mainly designed to help track daily tasks easily and efficiently.  
This project allows you to **add, edit, delete, and complete tasks**, and it automatically updates the task insights such as total, pending, completed, and priority distribution.

The web app uses **HTML, CSS, and JavaScript** for the frontend, and **Python Flask with SQLite** for the backend database.

---

** Features **
1. Add a new task with **Title, Description, Priority, and Due Date**
2. Edit, Delete, and Mark tasks as **Completed**
3. Automatically updates **Insights Section** with task summary
4. Filter and sort tasks by **Status** and **Priority**
5. Uses **SQLite Database** to store and retrieve all task details
6. Displays motivational messages based on task progress


**Tech Stack**

Part -->Technology Used 
**Frontend** ==> HTML, CSS, JavaScript 
**Backend** ==> Python Flask 
**Database**==> SQLite 
**Server** ==> Flask Development Server 


**API Endpoints**

 Method - Endpoint - Description 
 **GET** -`/tasks` - Get all tasks (with optional filter for status and priority) 
 **POST** - `/tasks` - Add a new task 
 **PATCH** - `/tasks/<id>` - Update task details or mark as completed 
 **DELETE** - `/tasks/<id>` - Delete a task 
 **GET** - `/insights` - Get insights summary (total, pending, completed, priorities, and message) 



**Project Flow**
1. The user adds a task with title, description, due date, and priority.  
2. Each task is saved in the **SQLite database**.  
3. Tasks can be filtered by status or priority.  
4. Insights section automatically updates after every change.  
