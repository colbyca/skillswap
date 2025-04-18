import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

console.log('Script started...');

// Load environment variables
dotenv.config();
console.log('Environment variables loaded');

// Initialize Firebase Admin
console.log('Initializing Firebase Admin...');
const app = initializeApp({
  credential: cert({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  databaseURL: `https://${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = getFirestore(app);

const users = [
  {
    name: 'Alex Chen',
    bio: 'Full-stack developer passionate about teaching and learning new technologies.',
    skillsIHave: ['Web Development', 'Mobile Development', 'UI/UX Design'],
    skillsIWant: ['Graphic Design', 'Digital Marketing', 'Public Speaking'],
    contactMethods: {
      email: 'alex.chen@example.com',
      discord: 'alexchen#1234',
      twitter: '@alexchen'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Sarah Johnson',
    bio: 'Graphic designer with a love for creative expression and teaching design principles.',
    skillsIHave: ['Graphic Design', 'UI/UX Design', 'Animation'],
    skillsIWant: ['Web Development', 'Digital Marketing', 'Content Writing'],
    contactMethods: {
      email: 'sarah.j@example.com',
      instagram: '@sarahjdesigns',
      discord: 'sarahj#5678'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Michael Rodriguez',
    bio: 'Digital marketing specialist who enjoys helping others grow their online presence.',
    skillsIHave: ['Digital Marketing', 'Content Writing', 'Public Speaking'],
    skillsIWant: ['Web Development', 'Data Analysis', 'Project Management'],
    contactMethods: {
      email: 'mike.rod@example.com',
      phone: '+1 (555) 123-4567',
      twitter: '@mikerod'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Emma Wilson',
    bio: 'Language teacher with a passion for cultural exchange and communication.',
    skillsIHave: ['Language Teaching', 'Public Speaking', 'Content Writing'],
    skillsIWant: ['Web Development', 'Digital Marketing', 'Graphic Design'],
    contactMethods: {
      email: 'emma.w@example.com',
      instagram: '@emmawilson',
      discord: 'emmaw#9012'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'David Kim',
    bio: 'Data scientist interested in teaching data analysis and machine learning.',
    skillsIHave: ['Data Analysis', 'Machine Learning', 'Project Management'],
    skillsIWant: ['UI/UX Design', 'Public Speaking', 'Content Writing'],
    contactMethods: {
      email: 'david.kim@example.com',
      twitter: '@davidkim',
      discord: 'davidk#3456'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Lisa Martinez',
    bio: 'Professional photographer and video editor with a creative eye.',
    skillsIHave: ['Photography', 'Video Editing', 'Graphic Design'],
    skillsIWant: ['Web Development', 'Digital Marketing', 'Content Writing'],
    contactMethods: {
      email: 'lisa.m@example.com',
      instagram: '@lisamartinezphoto',
      discord: 'lisam#7890'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'James Wilson',
    bio: 'Fitness trainer and nutrition expert passionate about health and wellness.',
    skillsIHave: ['Fitness Training', 'Public Speaking', 'Project Management'],
    skillsIWant: ['Digital Marketing', 'Content Writing', 'Graphic Design'],
    contactMethods: {
      email: 'james.w@example.com',
      phone: '+1 (555) 234-5678',
      instagram: '@jameswilsonfitness'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Sophia Lee',
    bio: 'Professional chef and cooking instructor with a love for culinary arts.',
    skillsIHave: ['Cooking', 'Public Speaking', 'Content Writing'],
    skillsIWant: ['Photography', 'Graphic Design', 'Digital Marketing'],
    contactMethods: {
      email: 'sophia.l@example.com',
      instagram: '@sophialeecooks',
      discord: 'sophial#1234'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Ryan Thompson',
    bio: 'Blockchain developer interested in teaching decentralized technologies.',
    skillsIHave: ['Blockchain Development', 'Web Development', 'Project Management'],
    skillsIWant: ['UI/UX Design', 'Digital Marketing', 'Public Speaking'],
    contactMethods: {
      email: 'ryan.t@example.com',
      discord: 'ryanth#5678',
      twitter: '@ryanthompson'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Olivia Brown',
    bio: 'Game developer with a passion for interactive storytelling.',
    skillsIHave: ['Game Development', '3D Modeling', 'Animation'],
    skillsIWant: ['Digital Marketing', 'Content Writing', 'Public Speaking'],
    contactMethods: {
      email: 'olivia.b@example.com',
      discord: 'oliviab#9012',
      twitter: '@oliviabrown'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Daniel Park',
    bio: 'Music producer and audio engineer with a creative approach to sound.',
    skillsIHave: ['Music Production', 'Audio Engineering', 'Project Management'],
    skillsIWant: ['Web Development', 'Digital Marketing', 'Graphic Design'],
    contactMethods: {
      email: 'daniel.p@example.com',
      discord: 'danielp#3456',
      instagram: '@danielparkmusic'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Ava Garcia',
    bio: 'UI/UX designer focused on creating intuitive and beautiful interfaces.',
    skillsIHave: ['UI/UX Design', 'Graphic Design', 'Content Writing'],
    skillsIWant: ['Web Development', 'Digital Marketing', 'Public Speaking'],
    contactMethods: {
      email: 'ava.g@example.com',
      discord: 'avag#7890',
      twitter: '@avagarcia'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Ethan Wright',
    bio: 'Project manager with expertise in agile methodologies and team leadership.',
    skillsIHave: ['Project Management', 'Public Speaking', 'Content Writing'],
    skillsIWant: ['Web Development', 'Data Analysis', 'Digital Marketing'],
    contactMethods: {
      email: 'ethan.w@example.com',
      phone: '+1 (555) 345-6789',
      discord: 'ethanw#1234'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Mia Anderson',
    bio: 'Content writer and digital marketer with a flair for storytelling.',
    skillsIHave: ['Content Writing', 'Digital Marketing', 'Public Speaking'],
    skillsIWant: ['Web Development', 'Graphic Design', 'UI/UX Design'],
    contactMethods: {
      email: 'mia.a@example.com',
      twitter: '@miaanderson',
      discord: 'miaa#5678'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Noah Taylor',
    bio: 'Mobile app developer passionate about creating innovative solutions.',
    skillsIHave: ['Mobile Development', 'Web Development', 'UI/UX Design'],
    skillsIWant: ['Digital Marketing', 'Content Writing', 'Public Speaking'],
    contactMethods: {
      email: 'noah.t@example.com',
      discord: 'noaht#9012',
      twitter: '@noahtaylor'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Isabella Clark',
    bio: '3D artist and animator with a creative approach to visual storytelling.',
    skillsIHave: ['3D Modeling', 'Animation', 'Graphic Design'],
    skillsIWant: ['Web Development', 'Digital Marketing', 'Content Writing'],
    contactMethods: {
      email: 'isabella.c@example.com',
      discord: 'isabellac#3456',
      instagram: '@isabellaclarkart'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Lucas White',
    bio: 'Data analyst with expertise in business intelligence and visualization.',
    skillsIHave: ['Data Analysis', 'Project Management', 'Content Writing'],
    skillsIWant: ['Web Development', 'Digital Marketing', 'Public Speaking'],
    contactMethods: {
      email: 'lucas.w@example.com',
      discord: 'lucasw#7890',
      twitter: '@lucaswhite'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Chloe Adams',
    bio: 'Digital marketing strategist with a focus on social media and branding.',
    skillsIHave: ['Digital Marketing', 'Content Writing', 'Public Speaking'],
    skillsIWant: ['Web Development', 'Graphic Design', 'UI/UX Design'],
    contactMethods: {
      email: 'chloe.a@example.com',
      instagram: '@chloeadams',
      discord: 'chloea#1234'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Benjamin Scott',
    bio: 'Web developer with a passion for creating accessible and responsive websites.',
    skillsIHave: ['Web Development', 'UI/UX Design', 'Project Management'],
    skillsIWant: ['Digital Marketing', 'Content Writing', 'Public Speaking'],
    contactMethods: {
      email: 'benjamin.s@example.com',
      discord: 'benjamins#5678',
      twitter: '@benjaminscott'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Zoe Turner',
    bio: 'Public speaking coach and communication specialist.',
    skillsIHave: ['Public Speaking', 'Content Writing', 'Project Management'],
    skillsIWant: ['Web Development', 'Digital Marketing', 'Graphic Design'],
    contactMethods: {
      email: 'zoe.t@example.com',
      phone: '+1 (555) 456-7890',
      discord: 'zoet#9012'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const seedUsers = async () => {
  try {
    console.log('Starting user seeding process...');

    // Get all skills first
    console.log('Fetching skills...');
    const skillsSnapshot = await db.collection('skills').get();
    const skillsMap = new Map();
    const availableSkills = new Set();
    skillsSnapshot.forEach(doc => {
      skillsMap.set(doc.data().name, doc.id);
      availableSkills.add(doc.data().name);
    });

    // Log all available skills
    console.log('Available skills:', Array.from(availableSkills));

    // Get all existing users
    console.log('Fetching existing users...');
    const usersSnapshot = await db.collection('users').get();
    const existingUsers = new Map();
    usersSnapshot.forEach(doc => {
      existingUsers.set(doc.data().name, { id: doc.id, ...doc.data() });
    });

    console.log(`Found ${existingUsers.size} existing users`);

    // Prepare batch operations
    const batch = db.batch();
    let updatedCount = 0;
    let addedCount = 0;

    // Process each seeded user
    for (const user of users) {
      const existingUser = existingUsers.get(user.name);

      // Convert skill names to skill IDs and filter out missing skills
      const skillsIHaveIds = user.skillsIHave
        .map(skillName => {
          const skillId = skillsMap.get(skillName);
          if (!skillId) {
            console.warn(`Warning: Skill "${skillName}" not found in skills collection for user "${user.name}" (skillsIHave)`);
          }
          return skillId;
        })
        .filter(Boolean);

      const skillsIWantIds = user.skillsIWant
        .map(skillName => {
          const skillId = skillsMap.get(skillName);
          if (!skillId) {
            console.warn(`Warning: Skill "${skillName}" not found in skills collection for user "${user.name}" (skillsIWant)`);
          }
          return skillId;
        })
        .filter(Boolean);

      const userData = {
        name: user.name,
        bio: user.bio,
        skillsIHave: skillsIHaveIds,
        skillsIWant: skillsIWantIds,
        contactMethods: user.contactMethods || {}, // Ensure contactMethods is always an object
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      if (existingUser) {
        // Update existing user
        const docRef = db.collection('users').doc(existingUser.id);
        batch.update(docRef, userData);
        updatedCount++;
      } else {
        // Add new user
        const docRef = db.collection('users').doc();
        batch.set(docRef, userData);
        addedCount++;
      }
    }

    // Commit the batch
    if (updatedCount > 0 || addedCount > 0) {
      console.log(`Updating ${updatedCount} existing users and adding ${addedCount} new users...`);
      await batch.commit();
      console.log('Successfully updated users collection');
    } else {
      console.log('No changes needed - all seeded users are up to date');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.message) {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Run the seed function
console.log('Starting seeding process...');
seedUsers()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding users:', error);
    process.exit(1);
  }); 