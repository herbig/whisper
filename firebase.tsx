import { initializeApp } from "firebase/app";
 import { getFirestore, doc, setDoc, getDocFromServer} from "firebase/firestore";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
 const firebaseConfig = {
  apiKey: "AIzaSyBREeXyH_BNw2vT9zcvqiSdZ9zaI1E0G1c",
  authDomain: "private-posts-562ce.firebaseapp.com",
  projectId: "private-posts-562ce",
  storageBucket: "private-posts-562ce.appspot.com",
  messagingSenderId: "440512886652",
  appId: "1:440512886652:web:a0fe4ac43af5264b7a16f9",
  measurementId: "G-2G5GTS30WD"
};
  
const firebaseDb = getFirestore(initializeApp(firebaseConfig));

export async function addIdentityCommitment(tokenAddress: string, commitment: bigint) {
    try {
      const docRef = doc(firebaseDb, "commitments", tokenAddress);
      const querySnapshot = await getDocFromServer(docRef);
      const commitments: string[] = querySnapshot.get('commitments') || [];
      commitments.push(commitment.toString());
      await setDoc(docRef, { commitments: commitments, });
    } catch (e) {
      // TODO error handling
      console.error("Error adding commitment: ", e);
    }
}

export async function getIdentityCommitments(tokenAddress: string) {
  try {
    const querySnapshot = await getDocFromServer(doc(firebaseDb, "commitments", tokenAddress));
    const commitments: string[] = querySnapshot.get('commitments') || [];
    console.log("commitments: " + commitments);
    return commitments;
  } catch (e) {
    // TODO
    return [];
  }
}