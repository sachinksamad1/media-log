import { db } from "./firebase.js";

export async function checkFirestoreConnection() {
  try {
    // Light operation → lists available collections
    await db.listCollections();

    console.log("Firestore Status: CONNECTED");
    return true;
  } catch (error) {
    console.error("Firestore Status: FAILED TO CONNECT");
    console.error(error);
    return false;
  }
}
