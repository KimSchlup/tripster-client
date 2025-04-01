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

## Contributions Week 1 - [26.06.2026] to [02.04.2025]

| **Student**        | **Date**   | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **@AdrianHauser** | 30.03.2025 | [Commit 1](https://github.com/KimSchlup/tripster-server/commit/a3d290d1b45c9b92a2ed34eacb727a9c0764f580) [Commit 2](https://github.com/KimSchlup/tripster-server/commit/d5def2c057f5d50cfed09e38f2b7d0b7715c4a7c) [Commit 3](https://github.com/KimSchlup/tripster-server/commit/8bed0c8ba2e15d037979c955103240342fb0fadf) [Commit 4](https://github.com/KimSchlup/tripster-server/commit/eba8d53dac9a0da4cec8dd6f6015576a7452d186) [Commit 5](https://github.com/KimSchlup/tripster-server/commit/dc36ecdee0d3c73e17e8b0d2b8b8a0cf68a3a5c4) [Commit 6](https://github.com/KimSchlup/tripster-server/commit/f1399b9d1731cc21cdd678c99e3725f85b7c7bad) [Commit 7](https://github.com/KimSchlup/tripster-server/commit/49f612a9730dd10e4b498e982a38f90acdf49a73) [Commit 8](https://github.com/KimSchlup/tripster-server/commit/5c5a1de38afd9d9b3123ab1e5c0addc2e38beffb) [Commit 9](https://github.com/KimSchlup/tripster-server/commit/9f233dd0565bddccd04897e33f139ec2ca21c97a) [Commit 10](https://github.com/KimSchlup/tripster-server/commit/a7c00f11e2efedf8dc033811a380b149730add89) [Commit 11](https://github.com/KimSchlup/tripster-server/commit/1cedd9d522f74b40a7b639420b2d77a1b04e0b62) [Commit 12](https://github.com/KimSchlup/tripster-server/commit/bc146c44d40bba31e6ce80e1ad684e7c8642f0dd) [Commit 13](https://github.com/KimSchlup/tripster-server/commit/f77a2025f4e2c3d93e5d6bcdfbaba3ab0c9a82ba) [Commit 14](https://github.com/KimSchlup/tripster-server/commit/5c0441efa6148a649acf9272a27709fad314c661) [Commit 15](https://github.com/KimSchlup/tripster-server/commit/d1eb8de7b33dc7e2f9e4c87b5510f7aad83e2e1) [Commit 16](https://github.com/KimSchlup/tripster-server/commit/6d51007e447f7ee1b2c4cf348e6a52edb2948e81) | [Issue 38](https://github.com/users/KimSchlup/projects/1/views/6?pane=issue&itemId=103079031&issue=KimSchlup%7Ctripster-server%7C38) </br> Set up containerized PostGIS DB in Cloud Compute VM. Added docker-compose for local development, added containerized PostGIS DB to GitHub Actions. application.yml handles every database setup through environment variables. | A database is an essential part for persistence of our application. Local development and testing against a containerized replica of the deployment database will ensure a setting as close as possible to the deployment environment. |
|                    | 01.04.2025   | [Commit 1](https://github.com/KimSchlup/tripster-server/pull/103/commits/ab7105dda286540d6838fe5a494bfaa48b003776) [Commit 2](https://github.com/KimSchlup/tripster-server/pull/103/commits/ad5b98ca79abf2f055a1099aada92c04824d77de) [Commit 3](https://github.com/KimSchlup/tripster-server/pull/103/commits/eaae03e7bcefd41fdf32c58994d51ad1333d2240) [Commit 4](https://github.com/KimSchlup/tripster-server/pull/106/commits/8a714c3de85cdf069ebdd9ed101b320822f822bb) [Commit 5](https://github.com/KimSchlup/tripster-server/pull/109/commits/7786e20a5c5fc924767ff5638fd3bdc2d0b113a0) [Commit 6](https://github.com/KimSchlup/tripster-server/pull/109/commits/e7891aaa1c4dcafad9a57b4d08e6292af91ab779) | [Issue 39](https://github.com/users/KimSchlup/projects/1/views/6?pane=issue&itemId=103079033&issue=KimSchlup%7Ctripster-server%7C39) [Issue 40](https://github.com/users/KimSchlup/projects/1/views/6?pane=issue&itemId=103079036&issue=KimSchlup%7Ctripster-server%7C40) [Issue 41](https://github.com/users/KimSchlup/projects/1/views/6?pane=issue&itemId=103079037&issue=KimSchlup%7Ctripster-server%7C41) </br> Implemented core Roadtrip endpoints POST, GET, DELTE with some tests. GET endpoint will be modified later when we have the invitation setup implemented. Added test profile to docker-compose for more efficient testing. | Roadtrips are the core element our application revolves around so creating, deleting and getting these objects is elemental. |
| **[@P4P5T123]**    | [1.4.25]   | [Link to Commit 1](https://github.com/KimSchlup/tripster-client/pull/50/commits/2503b10138a1e5d09aff99067dcb313e085970c1) | Set up LandingPage for website | Solves Issue 02: LandingPage with proper navigation to Login & Register Screen |
|                    | [1.4.25]   | [Link to Commit 2](https://github.com/KimSchlup/tripster-client/pull/50/commits/2503b10138a1e5d09aff99067dcb313e085970c1) | [Implemented Login and Register Pages] | [Is necessary for several user stories in User management that we defined. Also solves Issue 03. ] |
| **@KimSchlup** | [1.4.25]   | [Commit 1](https://github.com/KimSchlup/tripster-server/pull/105/commits/97ed130731bd1c3fa2171449ea4d0081bbeb6bec) [Commit 2](https://github.com/KimSchlup/tripster-server/commit/1448f0fe2d425d293e3021c232cc9fc0b6a21564) [Commit 3](https://github.com/KimSchlup/tripster-server/commit/37a0b571876d18a1dbffccacceae39a73ee7813d) [Commit 4](https://github.com/KimSchlup/tripster-server/commit/031f89f1cda01854f81e9833527695b72419d1b4) [Commit 5](https://github.com/KimSchlup/tripster-server/commit/5d54c5adde96f0415f73027575a521e72492fd6b) [Commit 6](https://github.com/KimSchlup/tripster-server/commit/f948f4528953ce48e79a83d1524d05f762a62e28) [Commit 7](https://github.com/KimSchlup/tripster-server/commit/5d54c5adde96f0415f73027575a521e72492fd6b) [Commit 8](https://github.com/KimSchlup/tripster-server/commit/f948f4528953ce48e79a83d1524d05f762a62e28) [Commit 9]() [Commit 10]()| Worked on Issue 32, 33, 26 and 27. Created Endpoints to create a userprofile and login to existing profile and added authentication to prevent access to forbidden resources. Created a prehandle to prevent users that are not logged in from accessing any functionality. | Users need to be able to create and login to their user profie and unauthorized access to data needs to be prevented.|
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 2 - [Begin Date] to [End Date]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@githubUser1]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser2]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser3]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

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
