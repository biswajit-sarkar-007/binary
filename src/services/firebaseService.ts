import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, DocumentData, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface StressData {
  stressLevel: number;
  sleepHours: number;
  screenTime: number;
  timestamp: Date;
  id?: string;
}

export const subscribeToStressData = (callback: (data: StressData[]) => void) => {
  const q = query(collection(db, 'stressData'), orderBy('timestamp', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const data: StressData[] = [];
    snapshot.forEach((doc) => {
      const docData = doc.data();
      data.push({
        id: doc.id,
        stressLevel: docData.stressLevel,
        sleepHours: docData.sleepHours,
        screenTime: docData.screenTime,
        timestamp: docData.timestamp.toDate(),
      });
    });
    callback(data);
  }, (error) => {
    console.error('Error fetching data:', error);
  });
};

export const addStressData = async (data: Omit<StressData, 'id'>) => {
  try {
    // Validate data before saving
    if (!data.stressLevel || !data.sleepHours || !data.screenTime || !data.timestamp) {
      throw new Error('Missing required fields');
    }

    // Convert Date to Firestore Timestamp
    const timestamp = Timestamp.fromDate(data.timestamp);

    // Add document to collection
    const docRef = await addDoc(collection(db, 'stressData'), {
      ...data,
      timestamp,
    });

    console.log('Data saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding stress data:', error);
    throw error;
  }
};

export const getStressData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'stressData'));
    const data: StressData[] = [];
    
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      data.push({
        id: doc.id,
        stressLevel: docData.stressLevel,
        sleepHours: docData.sleepHours,
        screenTime: docData.screenTime,
        timestamp: docData.timestamp.toDate(),
      });
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching stress data:', error);
    throw error;
  }
}; 