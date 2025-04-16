import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './config';

const commonSkills = [
  'Web Development',
  'Mobile Development',
  'Graphic Design',
  'UI/UX Design',
  'Digital Marketing',
  'Content Writing',
  'Video Editing',
  'Photography',
  'Music Production',
  'Language Teaching',
  'Cooking',
  'Fitness Training',
  'Public Speaking',
  'Project Management',
  'Data Analysis',
  'Machine Learning',
  'Blockchain Development',
  'Game Development',
  '3D Modeling',
  'Animation'
];

export const initializeSkills = async () => {
  try {
    // Check if skills collection already exists
    const skillsSnapshot = await getDocs(collection(db, 'skills'));
    if (skillsSnapshot.empty) {
      // Add skills to Firestore
      for (const skill of commonSkills) {
        await addDoc(collection(db, 'skills'), {
          name: skill,
          createdAt: new Date().toISOString()
        });
      }
      console.log('Skills collection initialized successfully');
    } else {
      console.log('Skills collection already exists');
    }
  } catch (error) {
    console.error('Error initializing skills:', error);
  }
}; 