**Cloud-Based Programming IDE for Computing Class**  
**Client Organization:** College Computing Department

---

# **1\. Introduction**

## **1.1 Purpose**

The purpose of this document is to outline the requirements for the development of a web-based Integrated Development Environment (IDE) tailored for a computing class. This IDE will provide a user-friendly platform for students and instructors to write, execute, and collaborate on code efficiently. The system will integrate various programming features such as real-time collaboration, GitHub integration, and automated testing.

## **1.2 Scope**

The IDE will include the following functionalities:

* Code editing and execution.  
* User authentication (Login/Signup).  
* Project creation, saving, and execution.  
* Error feedback and debugging messages.  
* Real-time collaboration, including screen sharing and pair programming.  
* GitHub integration for saving, loading, and managing repositories.  
* A programming challenges module with automated testing and submissions.

This project will be developed over a semester by a team of students in collaboration with computing faculty.

## **1.3 Glossary**

* IDE (Integrated Development Environment): A software platform that provides tools for writing and testing code.  
* GitHub: A cloud-based platform for version control and source code management.  
* Authentication: The process of verifying user identity.  
* Containerized Workspaces: Isolated development environments that ensure consistency across setups.  
* OAuth: An open standard for secure user authentication.

## **1.4 References**

* Meeting notes with faculty and student stakeholders.  
* Best practices for cloud-based IDEs.

# **2\. System Overview**

## **2.1 Goals**

The IDE aims to:

* Provide an intuitive platform for students to write and execute code.  
* Enable seamless collaboration among students and instructors.  
* Automate testing and challenge assignments to enhance learning.  
* Ensure version control and project management through GitHub integration.

## **2.2 Constraints**

* The host server must be large enough to meet maximum capacity, or cloud server with scaling.   
* Must support multiple programming languages.  
* Adherence to security and accessibility standards.

# **3\. Functional Requirements**

## **3.1 User Roles**

### **Administrator:**

* Manage user accounts.  
* Oversee project creation and execution.  
* Monitor collaboration and activity logs.

### **Instructor:**

* Assign coding problems and review submissions.  
* Access student progress and provide feedback.  
* Manage GitHub-integrated repositories.

### **Student:**

* Write, execute, and debug code.  
* Participate in programming challenges.  
* Collaborate with peers in real-time.

## **3.2 Features**

### **User Registration and Authentication**

* Clearpass integrated login/signup process.  
* OAuth-based GitHub authentication.

### **Code Editing and Execution**

* Supports multiple programming languages.  
* Syntax highlighting and debugging tools.

### **Collaboration Features**

* Real-time code sharing and pair programming.  
* Live chat and screen sharing.

### **GitHub Integration**

* Save/load projects directly from GitHub.  
* Clone repositories and manage version control.

### **Automated Testing and Challenges**

* Assign coding problems with automatic grading.  
* Run test cases and generate performance reports.

### **Notifications**

* Email notifications for project updates and deadlines.

### **Accessibility**

* Compliance with WCAG 2.1 standards for assistive technologies.

# **4\. Non-Functional Requirements**

## **4.1 Performance**

* Must support up to 200 simultaneous users with minimal latency (\<2 seconds for execution response).

## **4.2 Security**

* Encrypted user authentication.  
* Role-based access control for different users.

## **4.3 Usability**

* User-friendly interface designed for students with varying technical backgrounds.

## **4.4 Scalability**

* Should support future expansions such as AI-assisted debugging and additional programming languages.

# **5\. Data Requirements**

## **5.1 Data Storage**

* User profiles (name, email, authentication tokens).  
* Project files and collaboration logs.  
* Challenge results and automated grading reports.

## **5.2 Data Privacy**

* Compliance with educational data privacy regulations.  
* Secure access control for student and instructor data.

# **6\. Technical Requirements**

## **6.1 Technology Stack**

* **Code Evaluation:** Docker  
* **Backend**: Next.js & Firebase for real-time collaboration.  
* **Frontend**: React.js for UI/UX.  
* **Database**: MongoDB for user and project data.  
* **Version Control**: GitHub integration for project management.  
* **Collaboration Tools**: Slack and GitHub.  
* **AI & Testing**: Python-based auto-testing system.

## **6.2 Integration**

* Must integrate with GitHub for version control.  
* Email notification system using SMTP.

# **7\. Project Timeline**

## **7.1 Milestones**

* **Week 1-2:** Gather detailed requirements and finalize initial design.  
* **Week 3-5:** Set up core IDE environment and implement user authentication.  
* **Week 6-8:** Develop project management features and integrate GitHub functionality.  
* **Week 9-10:** Build and test real-time collaboration components.  
* **Week 11-12:** Integrate AI-powered coding challenges and automated testing modules.  
* **Week 13-14:** Perform comprehensive testing, bug fixing, and security audits.  
* **Week 15:** Finalize documentation and present the system to stakeholders.

|  |
| :---- |
|  |
|  |
|  |
|  |
|  |

# **8\. Appendices**

## **8.1 Meeting Notes**

Detailed notes from team meetings are available in the [link](https://github.com/Bubballoo3/kenCode/blob/main/Meeting%20Notes%20-%20Programming%20IDE.pdf).

## **8.2 GitHub Repository**

Repository link: [GitHub – IDE Project](https://github.com/Bubballoo3/kenCode)

## **8.3 References**

* WCAG 2.1 Accessibility Guidelines

