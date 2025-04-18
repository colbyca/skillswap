import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './config';

const commonSkills = [
  {
    name: 'Web Development',
    tags: ['coding', 'programming', 'frontend', 'backend', 'fullstack', 'javascript', 'html', 'css']
  },
  {
    name: 'Mobile Development',
    tags: ['coding', 'programming', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin']
  },
  {
    name: 'Graphic Design',
    tags: ['design', 'visual', 'photoshop', 'illustrator', 'creative', 'art', 'digital']
  },
  {
    name: 'UI/UX Design',
    tags: ['design', 'user interface', 'user experience', 'wireframing', 'prototyping', 'figma', 'sketch']
  },
  {
    name: 'Digital Marketing',
    tags: ['marketing', 'social media', 'seo', 'content', 'analytics', 'advertising', 'branding']
  },
  {
    name: 'Content Writing',
    tags: ['writing', 'blogging', 'copywriting', 'seo', 'marketing', 'creative', 'communication']
  },
  {
    name: 'Video Editing',
    tags: ['video', 'editing', 'premiere', 'after effects', 'motion graphics', 'creative', 'media']
  },
  {
    name: 'Photography',
    tags: ['photo', 'camera', 'lightroom', 'photoshop', 'creative', 'art', 'visual']
  },
  {
    name: 'Music Production',
    tags: ['music', 'audio', 'ableton', 'logic', 'fl studio', 'creative', 'sound']
  },
  {
    name: 'Language Teaching',
    tags: ['teaching', 'education', 'language', 'communication', 'tutoring', 'linguistics']
  },
  {
    name: 'Cooking',
    tags: ['food', 'culinary', 'baking', 'recipes', 'kitchen', 'gastronomy']
  },
  {
    name: 'Fitness Training',
    tags: ['fitness', 'exercise', 'health', 'wellness', 'training', 'sports']
  },
  {
    name: 'Public Speaking',
    tags: ['communication', 'presentation', 'speaking', 'leadership', 'confidence']
  },
  {
    name: 'Project Management',
    tags: ['management', 'leadership', 'organization', 'planning', 'agile', 'scrum']
  },
  {
    name: 'Data Analysis',
    tags: ['analytics', 'statistics', 'excel', 'python', 'sql', 'research']
  },
  {
    name: 'Machine Learning',
    tags: ['ai', 'artificial intelligence', 'python', 'data science', 'neural networks']
  },
  {
    name: 'Blockchain Development',
    tags: ['cryptocurrency', 'smart contracts', 'solidity', 'web3', 'decentralized']
  },
  {
    name: 'Game Development',
    tags: ['gaming', 'unity', 'unreal', '3d', 'programming', 'design']
  },
  {
    name: '3D Modeling',
    tags: ['3d', 'modeling', 'blender', 'maya', 'zbrush', 'design']
  },
  {
    name: 'Animation',
    tags: ['motion', 'after effects', 'maya', 'blender', 'creative', 'visual']
  },
  {
    name: 'Audio Engineering',
    tags: ['audio', 'music', 'sound', 'recording', 'mixing', 'mastering', 'production']
  }
];

export const initializeSkills = async () => {
  try {
    // Check if skills collection already exists
    const skillsSnapshot = await getDocs(collection(db, 'skills'));
    if (skillsSnapshot.empty) {
      // Add skills to Firestore
      for (const skill of commonSkills) {
        await addDoc(collection(db, 'skills'), {
          name: skill.name,
          tags: skill.tags,
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