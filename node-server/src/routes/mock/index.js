import express from "express";
import mongoose from "mongoose";
import User from "../../config/db/schemas/userModel.js";
import bcrypt from "bcrypt";
const mockRouter = express.Router();



const SKILLS = [
  "Coding", "Design", "Communication", "Public Speaking", "Traveling", "Reading", "Writing", "Music", "Sports", "Dancing", "Gaming", "Cooking", "Painting", "Photography"
];

const SAMPLE_BIOS = [
  "Passionate developer with a love for coding and solving problems.",
  "Experienced software engineer focused on building scalable applications.",
  "Creative technologist who enjoys combining design with functionality.",
  "Dedicated to continuous learning and adapting to new technologies.",
  "Enthusiastic team player driven by innovation and collaboration.",
  "Highly motivated and organized individual with a passion for software development.",
  "Innovative problem solver with a strong understanding of computer science concepts.",
  "Strong communicator and team collaborator with experience in Agile development.",
  "Analytical thinker with a focus on delivering high-quality software solutions.",
  "Results-oriented software engineer with expertise in multiple programming languages.",
  "Friendly and approachable individual with a strong work ethic and attention to detail.",
];

// Function to get random integer between min and max inclusive
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get random skills from SKILLS array
function getRandomSkills() {
  const count = getRandomInt(0, 4);
  const shuffled = SKILLS.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Get random bio from SAMPLE_BIOS
function getRandomBio() {
  const idx = getRandomInt(0, SAMPLE_BIOS.length - 1);
  return SAMPLE_BIOS[idx];
}


mockRouter.post("/add-users", async (req, res) => {
  const count = req?.body?.count || 2;

  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}&inc=login,name,email,dob,picture,gender`);
    const data = await response.json();

    console.log(data.results);
    const users = await Promise.all(data.results.map(async (user) => {
      let passPrefix = user.email.split("@")[0]?.split(".")[0]?.toLowerCase();
      let password = passPrefix + "@123";

      const userObj = {
        firstName: user.name.first,
        lastName: user.name.last,
        password: await bcrypt.hash(password, 10),
        email: user.email,
        age: user.dob.age,
        skills: getRandomSkills(),
        about: getRandomBio(),
        photoUrl: user.picture.large,
        gender: user.gender,
      }

      return userObj;

    }));

    console.log("to be inserted users", users);

    const insertedUsers = await User.insertMany(users);
    console.log("inserted users", insertedUsers.map((user) => user));
    // const insertedIds = insertedUsers.map((user) => user._id);

    const insertedData = insertedUsers.map(u => {
      const obj = u.toObject();
      delete obj.password;
      return obj;
    });



    // const usersData = await User.find();

    res.json({ message: "usersData saved successfully", data: insertedData });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching random users" });
  }

})



export default mockRouter;