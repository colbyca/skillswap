Skill Swap Project Proposal
1. General Overview
Skill Swap will be a platform designed to connect people who want to exchange knowledge and skills. Users can create profiles listing skills they're willing to teach and skills they're interested in learning. The platform facilitates connections between complementary users - for example, someone who knows graphic design but wants to learn coding might connect with someone who knows coding but wants to improve their design skills. It would be useful to help others learn new skills in focused, one-on-one interactions with others without any monetary commitment.
2. Technical Challenges
Anticipated Challenges & Solutions
Matchmaking Algorithm Implementation
I will need to create an efficient algorithm to match users with complementary skills. This will require me to learn how to use Firebase queries, and then come up with a system to connect users whose “skills to teach” match another user’s “skills to learn” and vice versa
User Profile Management
I will need to create an elegant and easy to use interface for profile creation. The profiles need to be flexible enough to capture every user’s differences, but also modular enough so that I can use the skill matchmaking algorithm on users. This will require me to learn about tagging systems and simple search algorithms so users can search skills and select the predefined “skill”.
Visibility and Privacy Controls
I need to make sure that users can add communication methods to their profiles for when they match with other users, but I need to make sure these can be hidden and only shared when a user wants it to be. Since I will be using Firebase, this will require learning about Firebase’s authentication system and utilizing it effectively to handle visibility permissions between users.
Mainly, I need to do a lot of research on Firebase and learn how to use it effectively as a backend.
3. Requirements
Authentication

I will be using Firebase, which has a built-in authentication service that I will use for identifying users.
Database
I will use Firestore for storing user profiles, connection requests, and connection history.
New Technology
For the new technology requirement, I will be using Firebase as my backend. I have never used any backend SaaS before, and since Firebase is one of the most popular, I think it would be a good place to start with it.
I will use React on the front-end because I have used it a lot, and I would rather spend more time learning about Firebase than learning a new front-end technology.
4. Time Estimation
I will probably spend about 3-4 hours initially setting up Firebase for my project, including adding the schemas. After that it will probably take me about 2-3 hours setting up the authentication and login flow. Then, I will spend the bulk of my time on the core functionality, including the user profile management, skill matchmaking algorithm, etc. This will probably take ~10ish hours. After that, I will dedicate a bit of time to the UI/UX design, which I estimate wil take me around 4-5 hours. Then I will spend a couple hours testing. Overall I estimate this project will take me between 20 to 30 hours in total.
