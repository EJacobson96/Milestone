# Milestone

## Overview

Milestone is a prototype web application created in conjunction with the [City of Seattle's Innovation & Performance Team][1] to empower youth and young adults (participants) affected by unstable housing to work with their case managers (service providers) at organizations like the YMCA to communicate and co-create goal plans that will lead to stability. The application contains the following two primary features:
* **Network**: A simple to use networking and messaging service to facilitate communication between service providers and participants.
	* This feature can be found under the "Network" umbrella within Milestone, and includes the ability to search for and add connections (points of contact, e.g. service providers for participants and vice versa), as well as a traditional messaginging client for initiating and participating in conversations with established connections.
	* Conversations between users are initiated on a one-to-one or one-to-many basis, with the "one" always being a participant. A service provider may initiate a conversation with a single participant, while a participant may initiate a conversation with a single service provider, or a group conversation with multiple providers. Via Milestone, service providers can not communicate directly to other service providers and participants can not communicate directly with other participants. These rules are enforced in order to protect the security and honor the integrity of participants and the gravity of the subject matter which may be handled via Milestone.
* **Progress**: A suite of goal planning and creation tools to be used in collaboration by both service providers and participants.
	* This feature can be found under the "Progress" umbrella within Milestone. Goal Planning involves several features, including the creation of Goals, large scale objectives that a participant hopes to achieve. Goals are created by selecting the "+" button in the top right of the "Goal Planning" section of "Progress". Goals have a title, as well as an attached list of service providers a participant wishes to collaborate with, and can be created by either a participant, or by a service provider on behalf of a participant. If a Goal is created by a participant, the participant manually chooses which providers they are interested in working with from a list of their current connections; If a goal is created by a service provider on behalf of a participant, the currently operating service provider is automatically established as the new Goal's collaborator. If a goal was created by a participant, it is marked with a "PENDING" flag until it is marked as approved by an attached service provider. Goals can be marked as complete by either the attached participant or service provider, as well as edited post-creation in order to potentially correct any mistakes that may have happened during creation.
	* Once a goal has been created, users can then add Tasks to the goal. Tasks are necessary steps the participant must accomplish before achieving the overall Goal. A Task includes a title, a description, and an optional due date. Similar to Goals, Tasks may be created by service providers on behalf of participants, or by participants themselves. If a Task was created by a participant, it is marked with a "PENDING" flag until it is marked as approved by service provider attached to the Task's larger Goal. Once crated, a Task can be marked as complete by either the participant or the attached service provider, as well as edited by either party in order to rectify any mistakes or to adjust and/or add a due date to the Task.
	* Once a Task has been created, any party who can view or edit the Task can then also comment on that specific Task in a threaded conversation (viewable by selecting the "COMMENTS" link at the bottom of any Task), or attach a resource (a URL to anything along with an accompanying title) to the Task (viewable by selecting the "RESOURCES" link at the bottom of any Task).
	* If the current user is a participant, they are greeted by a list of their current in-progress Goals as soon as they navigate to the "Progress" section of Milestone. If the user is a service provider, they are instead met with an overview of all of their currently connected participants. From here, they can select a participant to view that participant's Goals that they are currently collaborating with the participant on, or add another Goal themselves. Additionally, service providers have access to a "RESOURCES" tab from this overview page, a utility with which they can organize and manage any resources (again, URLs with a user given title) they may wish to utilize later on.

Milestone is a responsive web application, meaning it can run on mobile or desktop devices. Milestone's user experience is run locally on the user's device while communicating with a remote server for data storage and retrieval. Milestone is an online-only application, and does not currently support any offline functionality.

The current build of Milestone can be found [here][2]. For more information, see [here][3].

## Core Technologies
* **HTTPS Support**: We encrypted all communication between our web client and server by using Transport Layer Security (TLS), specifically using certificates from [Let's Encrypt][17]. 
* **Front end**: Milestone's user interface was built using React.js, specifically React 16.2 via [Create React App][4] and [NPM][5] (Node Package Manager). React was chosen as an ideal solution due to its ability to create a responsive web application with large amounts of functionality without being reliant on any single platform, only a relatively modern web browser. As our users are young adults with mobile devices and case managers with access to desktop machines, a React-based web app should be accessible to our entire user base. [Create React App][4] was chosen as a boilerplate for Milestone due to to its ability to package and maintain a large web application with very little fuss and maintenance. This allows for someone to quickly set up a development environment for Milestone, allowing us to pass our codebase to the City of Seattle with little overhead. Milestone's front end also takes advantage of the following supplemental Node.js packages:
	* [React Bootstrap][6]: In order to facilitate the rapid creation of many UI components, an existing UI framework was chosen in the form of [Bootstrap][7]. [React Bootstrap] is a React-friendly implementation of [Bootstrap][7]. While many of Milestone's components still had to be built from scratch, [React Bootstrap][6] saved us time by enabling us to focus on building new components and not having to build basic forms, inputs and dropdowns.
	* [React Router][11]: React Router is an immensely powerful framework for managing URLs and paths within large web applications built in React. Milestone uses React Router extensively across all features.
	* [Font Awesome][8]: To save us time when designing and rapidly prototyping, Font Awesome was chosen as an established and useful library of icons to use in Milestone's front end.
	* [Axios][9]: Axios is a powerful and straightforward promise-based HTTP client which helped us manage the large amount of HTTP requests necessary for Milestone's operation.
	* [Moment.js][10]: Moment is a powerful JavaScript plug-in for manipulating and displaying dates and times in different clean and user-readable formats. Milestone takes advantage of Moment.js when working with dates and times in both messaging and goal planning.
	* [React Datepicker][18]: React Datepicker is a simple yet powerful component for selecting a date from a calendar to be used by another component. Importantly, React Datepicker can be customized to suit an application's needs, something Milestone takes advantage of.
* **Back end**: Milestone's api server and database was built using Go and MongoDB. The api server was being hosted using [DigitalOcean][15] during the span of this project due to it being the cheaper alternative to Amazon Web Services (AWS).
	* [Go][13]: Go(golang) combines the performance of fully-compiled languages like with the ease and safety of garbage-collected languages like Java, while offering a sparse and simple syntax like Python. The accompanying tools and IDE plug-ins provide a fluid and consistent coding experience, while also encouraging best practices like automated testing.
	* [MongoDB][14]: Distributed document-oriented DBMSs have become a popular alternative to relational DBMSs, as they allow you to change your schema easily over time, and distribute your data amongst multiple machines in a cluster. Instead of storing data in tables with rows and columns, these DBMSs store flexible "documents" that contain whatever data you want. 
	* [Docker][12]: At its core, Docker is a technology for running application software in isolated, secure, and reusable containers. A container is like a VM but with much less overhead, as it can share the underlying operating system (OS).

## Front End Testing & Development.
Milestone’s front-end is built with react.js, specifically [Create React App][4]. If you would like to test Milestone locally or work on development, follow these instructions:
1. Ensure you have the most recent version of [Node Package Manager][5] installed.
2. Ensure you have this repository cloned.
3. Using a terminal client on a Unix-based machine, or Command Prompt (or your chosen terminal emulator) on a Windows machine, navigate to the root directory of your cloned Milestone repository.
4. Run the command `npm install` in order to install and update all necessary dependencies for Milestone.

You're ready to go! To learn more about [Create React App][4], follow the link or see the README at `/MilestoneFrontend/README.md`. Otherwise, the basic commands for testing are as follows (run via terminal in `/MilestoneFrontend/`):
* `npm start` : Starts the development server.
* `npm run build` : Bundles thed app into static files for production deployment.
* `npm test` : Starts the test runner on the local machine's localhost.
* `npm run eject` : Removes this tool an copies build dependencies, configuration files and scripts into the app directory. If you do this, you can’t go back! BE EXTREMELY CAREFUL! This is _not_ recommended!

## Back End Testing & Development.
* Milestone’s back end is built using Go(golang). You can access the api server endpoints using [Postman][16] for testing. Also, included in the backend code are bash scripts used for SSH-ing into any VM in the cloud and deploying the api server to whichever cloud service being used for hosting.

## Contributors & Contact
* Iean Drew
	* Email: ieand@uw.edu
	* LinkedIn: https://www.linkedin.com/in/ieangarethdrew/
* Eric Jacobson
	* Email: eric.jj96@gmail.com
	* LinkedIn: https://www.linkedin.com/in/eric-j-jacobson/
* Nancy Tran
	* Email: nhvt@uw.edu
	* LinkedIn: https://www.linkedin.com/in/nancy-tran-99bb61132/
* Yuliya Labaz
	* Email: yuliya94@uw.edu
	* LinkedIn: https://www.linkedin.com/in/yuliyakrav/


[1]: https://www.seattle.gov/innovation-performance 	"Innovation & Performance Team"
[2]: https://milestoneapp.org							"Milestone"
[3]: https://ieand.github.io/milestone/					"About Milestone"
[4]: https://github.com/facebook/create-react-app		"Create React App"
[5]: https://www.npmjs.com/								"Node Package Manager"
[6]: https://react-bootstrap.github.io/					"React Bootstrap"
[7]: https://getbootstrap.com/							"Bootstrap"
[8]: https://fontawesome.com/							"Font Awesome icons"
[9]: https://github.com/axios/axios						"Axios"
[10]: https://momentjs.com/								"Moment.js"
[11]: https://github.com/ReactTraining/react-router		"React Router"
[12]: https://www.docker.com/							"Docker"
[13]: https://golang.org/ 								"Go"
[14]: https://www.mongodb.com/							"MongoDB"
[15]: https://www.digitalocean.com/						"Digital Ocean"
[16]: https://www.getpostman.com/						"Postman"
[17]: https://letsencrypt.org/							"Let's Encrypt"
[18]: https://github.com/Hacker0x01/react-datepicker	"React Datepicker"