// import { UserSchema } from "../../../src/modules/users/users-schema.js";

// const testLogging = () => {
//   console.log("--- Starting User Schema Test ---");

//   try {
//     // 1. Create a "Bare Minimum" user to see defaults in action
//     const newUser = UserSchema.parse({ 
//       username: "minimal_user", 
//       email: "min@test.com" 
//     });

//     console.log("✅ Minimal User Created Successfully");
    
//     // Log with formatting for easy visual inspection
//     console.log("User Object Structure:", JSON.stringify(newUser, null, 2));

//     // 2. Test Logging specific preferences
//     console.log(`User Theme: ${newUser.preferences.theme}`); // Should be "system"
//     console.log(`User Privacy: ${newUser.privacy.isPublic ? "Public" : "Private"}`);

//     // 3. Test Validation Error Logging
//     console.log("\n--- Testing Validation Failure ---");
//     UserSchema.parse({ username: "hi", email: "not-an-email" }); // Should fail (min length 3 + invalid email)

//   } catch (error: any) {
//     if (error.name === "ZodError") {
//       console.error("❌ Schema Validation Failed!");
//       console.error(JSON.stringify(error.format(), null, 2));
//     } else {
//       console.error("❌ Unexpected Error:", error);
//     }
//   }
// };

// testLogging();