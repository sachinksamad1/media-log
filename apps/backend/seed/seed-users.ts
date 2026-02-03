import admin from "firebase-admin";

import { UserSchema } from "../../../src/modules/users/user-schema.js";
import { db } from "../src/config/firebase.js";
import { createMockUser } from "../src/modules/users/user-mock.js";



const seedDummyData = async () => {
  // eslint-disable-next-line no-console
  console.log("🚀 Starting database seeding...");

  const userIds = ["user_alpha", "user_beta", "user_gamma"];
  
  for (const id of userIds) {
    // 1. Create Mock User Data using your Zod Schema
    const dummyUser = createMockUser({
      uid: id,
      username: `${id}_tester`,
      email: `${id}@testmail.com`,
      preferences: {
        theme: Math.random() > 0.5 ? "dark" : "light",
        accentColor: "#FF5733"
      }
    });

    try {
      // 2. Save User Profile to Firestore
      await db.collection("users").doc(dummyUser.uid).set({
        ...dummyUser,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // eslint-disable-next-line no-console
      console.log(`✅ Seeded User Profile: ${dummyUser.username}`);

      // 3. Create dummy Anime for this specific user to check Ownership
      await db.collection("anime").add({
        userId: dummyUser.uid, // Linking to the user
        title: `${dummyUser.username}'s Favorite Show`,
        userStats: { score: 9, status: "Completed" },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`❌ Failed to seed ${id}:`, error);
    }
  }

  // eslint-disable-next-line no-console
  console.log("⭐ Seeding completed successfully!");
};

seedDummyData().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Seeding failed:", error);
  process.exitCode = 1;
});