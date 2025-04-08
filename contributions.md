# Contributions

Every member has to complete at least 2 meaningful tasks per week, where a
single development task should have a granularity of 0.5-1 day. The completed
tasks have to be shown in the weekly TA meetings. You have one "Joker" to miss
one weekly TA meeting and another "Joker" to once skip continuous progress over
the remaining weeks of the course. Please note that you cannot make up for
"missed" continuous progress, but you can "work ahead" by completing twice the
amount of work in one week to skip progress on a subsequent week without using
your "Joker". Please communicate your planning **ahead of time**.

Note: If a team member fails to show continuous progress after using their
Joker, they will individually fail the overall course (unless there is a valid
reason).

**You MUST**:

- Have two meaningful contributions per week.

**You CAN**:

- Have more than one commit per contribution.
- Have more than two contributions per week.
- Link issues to contributions descriptions for better traceability.

**You CANNOT**:

- Link the same commit more than once.
- Use a commit authored by another GitHub user.

---

## Contributions Week 1 - 26.06.2026 to 02.04.2025

| **Student**        | **Date**   | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **@AdrianHauser** | 30.03.2025 | [Commit 1](https://github.com/KimSchlup/tripster-server/commit/a3d290d1b45c9b92a2ed34eacb727a9c0764f580) [Commit 2](https://github.com/KimSchlup/tripster-server/commit/d5def2c057f5d50cfed09e38f2b7d0b7715c4a7c) [Commit 3](https://github.com/KimSchlup/tripster-server/commit/8bed0c8ba2e15d037979c955103240342fb0fadf) [Commit 4](https://github.com/KimSchlup/tripster-server/commit/eba8d53dac9a0da4cec8dd6f6015576a7452d186) [Commit 5](https://github.com/KimSchlup/tripster-server/commit/dc36ecdee0d3c73e17e8b0d2b8b8a0cf68a3a5c4) [Commit 6](https://github.com/KimSchlup/tripster-server/commit/f1399b9d1731cc21cdd678c99e3725f85b7c7bad) [Commit 7](https://github.com/KimSchlup/tripster-server/commit/49f612a9730dd10e4b498e982a38f90acdf49a73) [Commit 8](https://github.com/KimSchlup/tripster-server/commit/5c5a1de38afd9d9b3123ab1e5c0addc2e38beffb) [Commit 9](https://github.com/KimSchlup/tripster-server/commit/9f233dd0565bddccd04897e33f139ec2ca21c97a) [Commit 10](https://github.com/KimSchlup/tripster-server/commit/a7c00f11e2efedf8dc033811a380b149730add89) [Commit 11](https://github.com/KimSchlup/tripster-server/commit/1cedd9d522f74b40a7b639420b2d77a1b04e0b62) [Commit 12](https://github.com/KimSchlup/tripster-server/commit/bc146c44d40bba31e6ce80e1ad684e7c8642f0dd) [Commit 13](https://github.com/KimSchlup/tripster-server/commit/f77a2025f4e2c3d93e5d6bcdfbaba3ab0c9a82ba) [Commit 14](https://github.com/KimSchlup/tripster-server/commit/5c0441efa6148a649acf9272a27709fad314c661) [Commit 15](https://github.com/KimSchlup/tripster-server/commit/d1eb8de7b33dc7e2f9e4c87b5510f7aad83e2e1) [Commit 16](https://github.com/KimSchlup/tripster-server/commit/6d51007e447f7ee1b2c4cf348e6a52edb2948e81) | [Issue 38](https://github.com/users/KimSchlup/projects/1/views/6?pane=issue&itemId=103079031&issue=KimSchlup%7Ctripster-server%7C38) </br> Set up containerized PostGIS DB in Cloud Compute VM. Added docker-compose for local development, added containerized PostGIS DB to GitHub Actions for PR testing and testing before Dockerizing. application.yml handles every database setup through environment variables. | A database is an essential part for persistence of our application. Local development and testing against a containerized replica of the deployment database will ensure a setting as close as possible to the deployment environment. |
|                    | 01.04.2025   | [Commit 1](https://github.com/KimSchlup/tripster-server/pull/103/commits/ab7105dda286540d6838fe5a494bfaa48b003776) [Commit 2](https://github.com/KimSchlup/tripster-server/pull/103/commits/ad5b98ca79abf2f055a1099aada92c04824d77de) [Commit 3](https://github.com/KimSchlup/tripster-server/pull/103/commits/eaae03e7bcefd41fdf32c58994d51ad1333d2240) [Commit 4](https://github.com/KimSchlup/tripster-server/pull/106/commits/8a714c3de85cdf069ebdd9ed101b320822f822bb) [Commit 5](https://github.com/KimSchlup/tripster-server/pull/109/commits/7786e20a5c5fc924767ff5638fd3bdc2d0b113a0) [Commit 6](https://github.com/KimSchlup/tripster-server/pull/109/commits/e7891aaa1c4dcafad9a57b4d08e6292af91ab779) | [Issue 39](https://github.com/users/KimSchlup/projects/1/views/6?pane=issue&itemId=103079033&issue=KimSchlup%7Ctripster-server%7C39) [Issue 40](https://github.com/users/KimSchlup/projects/1/views/6?pane=issue&itemId=103079036&issue=KimSchlup%7Ctripster-server%7C40) [Issue 41](https://github.com/users/KimSchlup/projects/1/views/6?pane=issue&itemId=103079037&issue=KimSchlup%7Ctripster-server%7C41) </br> Implemented core Roadtrip endpoints POST, GET, DELETE with some tests. GET endpoint will be modified later when we have the invitation setup implemented. Added test profile to docker-compose for more efficient testing. | Roadtrips are the core element our application revolves around so creating, deleting and getting these objects is elemental. |
| **@P4P5T123**    | 01.04.2025   | [Commit 1](https://github.com/KimSchlup/tripster-client/pull/50/commits/2503b10138a1e5d09aff99067dcb313e085970c1) | Set up LandingPage for website | Solves Issue 02: LandingPage with proper navigation to Login & Register Screen |
|                    | 01.04.2025   | [Commit 2](https://github.com/KimSchlup/tripster-client/pull/50/commits/2503b10138a1e5d09aff99067dcb313e085970c1) | Implemented Login and Register Pages | Is necessary for several user stories in User management that we defined. Also solves Issue 03. |
| **@KimSchlup** | 01.04.2025   | [Commit 1](https://github.com/KimSchlup/tripster-server/pull/105/commits/97ed130731bd1c3fa2171449ea4d0081bbeb6bec) [Commit 2](https://github.com/KimSchlup/tripster-server/commit/1448f0fe2d425d293e3021c232cc9fc0b6a21564) [Commit 3](https://github.com/KimSchlup/tripster-server/commit/37a0b571876d18a1dbffccacceae39a73ee7813d) [Commit 4](https://github.com/KimSchlup/tripster-server/commit/031f89f1cda01854f81e9833527695b72419d1b4) [Commit 5](https://github.com/KimSchlup/tripster-server/commit/5d54c5adde96f0415f73027575a521e72492fd6b) [Commit 6](https://github.com/KimSchlup/tripster-server/commit/f948f4528953ce48e79a83d1524d05f762a62e28) [Commit 7](https://github.com/KimSchlup/tripster-server/commit/5d54c5adde96f0415f73027575a521e72492fd6b) [Commit 8](https://github.com/KimSchlup/tripster-server/commit/f948f4528953ce48e79a83d1524d05f762a62e28) [Commit 9]() [Commit 10]()| Worked on Issue 32, 33, 26 and 27. Created Endpoints to create a userprofile and login to existing profile and added authentication to prevent access to forbidden resources. Created a prehandle to prevent users that are not logged in from accessing any functionality. | Users need to be able to create and login to their user profie and unauthorized access to data needs to be prevented.|
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
|           **@segmue**         | 30.03.2025   | [Commit 1](https://github.com/KimSchlup/tripster-client/pull/48/commits/1bcfe122e6acac391c7d21ce6a65f14205b48554) [Commit 2](https://github.com/KimSchlup/tripster-client/pull/49/commits/18eb8f00297a1a960ae46abff443f0273eca9c5e) | ISSUE 6 & ISSUE 5: Add User Profile Page and possibility to edit it] | Multiple settings in the profile page are important for later development of user stories. Besides that, I added general design adaptations within CSS to adhere to the prefered design style. |
|              | 31.03.2025   | [Commit 1](https://github.com/KimSchlup/tripster-client/commit/1237022de915caa6438f08a3d0514553bd7bdc95) [Commit 2](https://github.com/KimSchlup/tripster-client/commit/a6544f30222927382862fd65d3b68265746d1854) [Commit 3](https://github.com/KimSchlup/tripster-client/commit/a59fed0600aabc72120d7dff7eb4d3015864ccda) [Commit 4](https://github.com/KimSchlup/tripster-client/commit/7745f37e35f4f40cdfd3cc1b38a3f1b11d3de1ce) [Commit 5](https://github.com/KimSchlup/tripster-client/commit/fac2ddd1b8a59e628fa63b2a3c179f8564347b2d) [Commit 6](https://github.com/KimSchlup/tripster-client/commit/216b9fbd37d34e2a3fb4b5793c274f7b2ad87982) [Commit 7](https://github.com/KimSchlup/tripster-client/commit/440d79b6534e9cc4c7b1775d37bdd5816da963a3) [Commit 8](https://github.com/KimSchlup/tripster-client/commit/4e6c4cecc9db48ad428f55197f20204ace089bc2)|  Worked extensively on ISSUE-15, because of some limitations in contribution this week due to military service. I basically added the interactive map, the sidebar with each correct button and the first poc ov a movable window as overlay for the GIS interface | Well, without the map, the project wouldn't be very interesting and this interface is the main interface for later userstories. |
| **@RicoCamenzind** | 30.03.2025 | [Commit1](https://github.com/KimSchlup/tripster-server/commit/fea18015bcdf4b43ed718faf26f1d8e24a4b462d) | Created file for all necessary excluding POI classes and depending entities including their attributes and gettter/ setter methods | Provides possibility for other methods to work with the used entities. |
|                    | 30.03.2025 | [Commit 2](https://github.com/KimSchlup/tripster-server/commit/b89f9c5b006ee6efb6e2afc8d6ff3a9f8a10a3bc) | Added POI classes and all on it depending ones | Provides the entity to use POI's for all further methods |
|                    | 30.03.2025 | [Commit 3](https://github.com/KimSchlup/tripster-server/commit/0bc48c2d17ea8594533622ab77f7f95e111cd0a8) | Started working on DTOMappers and necessary methods. | Connects front to back end and makes communication between the two possible |
|                    | 01.04.2025 | [Commit 4](https://github.com/KimSchlup/tripster-server/commit/e4a43d56bb94dbb380746c2ddee2839dffb0a1fb) | Implemented the DTO methods for subclasses | Those are necessary for other Mappers to properly transform input to readable entities for the backend |

---

## Contributions Week 2 - 02.04.2025 to 09.04.2025

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@KimSchlup]** | [02.04.2025]   | [Commit 1] (https://github.com/KimSchlup/tripster-server/commit/423f693a057e0f116a15b1162287ec6e3b10781c) [Commit 2] (https://github.com/KimSchlup/tripster-server/commit/4d32414687fe1ea48d2eae328ced90bc54b36e2a) [Commit 3] (https://github.com/KimSchlup/tripster-server/commit/6e59c6e510d5dd3d0e5a0a62b5007543a89df292) | [Added endpoints for login and logout] | [Users need to be able to login and logout of their accounts] |
|                    | [03.04.2025]   | [Commit 1] (https://github.com/KimSchlup/tripster-server/commit/a7deae264de04572770f06e9d8ea6127f2189a08) [Commit 2] (https://github.com/KimSchlup/tripster-server/commit/e7fba95d1ade2d89503419301f31435bdfe2f7e6)  | [Added endpoints to update user information and delete user profile] | [Users need to be able to update their user profile and delete their account if they wish to do so] |
| **[@githubUser2]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser3]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@RicoCamenzind]** | [08.04.2025]   | [Commit 1](https://github.com/KimSchlup/tripster-server/commit/a35fb739195a9e723f39bfdbc333f4e6e5afa989) | Implementation of POI's, atleast the first iteration of them. Test cases are still missing and some more methods are also required for future features, more to come next week. | Poi's are essential for our application to make it possible to generate routes and for the front end to be able to render different locations on our map. |
|                    | [04.04.2025]   | [Commit 4](https://github.com/KimSchlup/tripster-server/commit/e8707a8661217a8a8bdb6a9bad4f6fdf6536cd80) [Commit 3](https://github.com/KimSchlup/tripster-server/commit/199e8c47381d3bf9bc04423c8932ed4ef54bed18) [Commit 2](https://github.com/KimSchlup/tripster-server/commit/8c84e87b81f53ade4dcc4939bc2fca357c1a2c7e) [Commit 1](https://github.com/KimSchlup/tripster-server/commit/0321f0e3005511ce42afcbd43143ac7a93514389) | fixed User creation and DTOMapper for such by mainly removing unnecessary attributes and correcting code. | Since the entire project relies on being able to create user's, eing able to actually create them in the backend is pretty userful. |

---

## Contributions Week 3 - [Begin Date] to [End Date]

_Continue with the same table format as above._

---

## Contributions Week 4 - [Begin Date] to [End Date]

_Continue with the same table format as above._

---

## Contributions Week 5 - [Begin Date] to [End Date]

_Continue with the same table format as above._

---

## Contributions Week 6 - [Begin Date] to [End Date]

_Continue with the same table format as above._
