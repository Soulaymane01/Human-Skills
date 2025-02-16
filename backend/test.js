const mongoose = require('mongoose');
const readline = require('readline');
const Category = require('./models/Technique');

// MongoDB connection
const mongoURI = process.env.MONGO_URI || "mongodb://mongo:gVacWBpaLyHnPYyMPrsUkOVzGVTJCMwY@roundhouse.proxy.rlwy.net:35213";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB!");
    showMainMenu();
  })
  .catch(err => console.error("Failed to connect to MongoDB:", err));



// Category Operations
async function createCategory(categoryData) {
  try {
    const newCategory = new Category({
      category: categoryData.category,
      icon: categoryData.icon,
      techniques: []
    });
    
    const savedCategory = await newCategory.save();
    console.log("Category created successfully!");
    return savedCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

async function getAllCategories() {
  try {
    const categories = await Category.find({});
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

async function getCategoryById(categoryId) {
  try {
    const category = await Category.findById(new mongoose.Types.ObjectId(categoryId));
    if (!category) {
      console.log("Category not found");
      return null;
    }
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

async function updateCategory(categoryId, updateData) {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      new mongoose.Types.ObjectId(categoryId),
      { $set: updateData },
      { new: true }
    );
    
    if (!updatedCategory) {
      console.log("Category not found");
      return null;
    }
    
    console.log("Category updated successfully!");
    return updatedCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

async function deleteCategory(categoryId) {
  try {
    const result = await Category.findByIdAndDelete(new mongoose.Types.ObjectId(categoryId));
    
    if (!result) {
      console.log("Category not found");
      return false;
    }
    
    console.log("Category deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

// Technique Operations
async function addTechnique(categoryId, techniqueData) {
  try {
    const category = await Category.findById(new mongoose.Types.ObjectId(categoryId));
    
    if (!category) {
      console.log("Category not found");
      return null;
    }
    
    category.techniques.push(techniqueData);
    const updatedCategory = await category.save();
    console.log("Technique added successfully!");
    return updatedCategory;
  } catch (error) {
    console.error("Error adding technique:", error);
    throw error;
  }
}

async function deleteTechnique(categoryId, techniqueId) {
  try {
    const category = await Category.findById(new mongoose.Types.ObjectId(categoryId));
    
    if (!category) {
      console.log("Category not found");
      return false;
    }
    
    const techniqueIndex = category.techniques.findIndex(
      tech => tech._id.toString() === new mongoose.Types.ObjectId(techniqueId).toString()
    );
    
    if (techniqueIndex === -1) {
      console.log("Technique not found");
      return false;
    }
    
    category.techniques.splice(techniqueIndex, 1);
    await category.save();
    
    console.log("Technique deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting technique:", error);
    throw error;
  }
}

// User Interface Functions
async function showMainMenu() {
  console.clear();
  console.log("\n=== Learning Techniques Management System ===");
  console.log("1. View All Categories");
  console.log("2. Add New Category");
  console.log("3. View Category Details");
  console.log("4. Add New Technique");
  console.log("5. Delete Technique");
  console.log("6. Exit");
  
  const choice = await question("\nEnter your choice (1-6): ");
  
  switch (choice) {
    case "1":
      await viewAllCategories();
      break;
    case "2":
      await addNewCategory();
      break;
    case "3":
      await viewCategoryDetails();
      break;
    case "4":
      await addNewTechnique();
      break;
    case "5":
      await deleteTechniqueMenu();
      break;
    case "6":
      console.log("Goodbye!");
      rl.close();
      process.exit(0);
    default:
      console.log("Invalid choice. Please try again.");
      await new Promise(resolve => setTimeout(resolve, 1500));
      showMainMenu();
  }
}

async function viewAllCategories() {
  const categories = await getAllCategories();
  console.clear();
  console.log("\n=== All Categories ===");
  
  categories.forEach(category => {
    console.log(`\nID: ${category._id}`);
    console.log(`category: ${category.category}`);
    console.log(`Number of techniques: ${category.techniques.length}`);
    console.log("------------------------");
  });
  
  await question("\nPress Enter to return to main menu...");
  showMainMenu();
}

async function addNewCategory() {
  console.clear();
  console.log("\n=== Add New Category ===");
  
  const category = await question("Enter category title: ");
  const icon = await question("Enter icon name: ");
  
  await createCategory({ category, icon });
  console.log("\nCategory added successfully!");
  
  await question("\nPress Enter to return to main menu...");
  showMainMenu();
}

async function viewCategoryDetails() {
  console.clear();
  console.log("\n=== View Category Details ===");
  
  const categoryId = await question("Enter category ID: ");
  const category = await getCategoryById(categoryId);
  
  if (category) {
    console.log(`\nTitle: ${category.title}`);
    console.log(`Description: ${category.description}`);
    console.log("\nTechniques:");
    
    category.techniques.forEach(technique => {
      console.log(`\nID: ${technique._id}`);
      console.log(`Title: ${technique.title}`);
      console.log(`Difficulty: ${technique.difficulty}`);
      console.log(`Time Needed: ${technique.timeNeeded}`);
      console.log("------------------------");
    });
  }
  
  await question("\nPress Enter to return to main menu...");
  showMainMenu();
}

async function addNewTechnique() {
  console.clear();
  console.log("\n=== Add New Technique ===");
  
  const categoryId = await question("Enter category ID: ");
  const title = await question("Enter technique title: ");
  const description = await question("Enter technique description: ");
  const difficulty = await question("Enter difficulty (Easy/Medium/Hard): ");
  const timeNeeded = await question("Enter time needed (e.g., '30 minutes'): ");
  const slug = await question("Enter the slug: ");
  const content = "# Active Listening: Transform Relationships Through Deep Engagement  \n\n## 🧠 What is Active Listening?  \nA **communication technique** focused on fully understanding the speaker before responding. Proven benefits:  \n- Reduces conflicts by 45% in workplaces ([Harvard Study](https://www.hbs.edu/))  \n- Strengthens empathy & trust in 92% of relationships (Gottman Institute)  \n- Uncovers 3x more nuanced information vs passive listening  \n\n---\n\n## 🌱 6-Step Active Listening Method (With Scripts)  \n### Step 1: Prepare Mentally (1-2 mins)  \n**DO**:  \n- Set intentions: “My goal is to understand, not reply.”  \n- Eliminate distractions: Phone on airplane mode, close tabs.  \n**Example**:  \n*Before a tough conversation: “I will listen first, then problem-solve.”*  \n\n### Step 2: Listen for 3 Layers (3-5 mins)  \n**DO**:  \n1. **Content**: Facts/data (“They missed the deadline”)  \n2. **Emotion**: Tone/body language (“They sound defensive”)  \n3. **Need**: Unspoken desires (“They want reassurance”)  \n**Example**:  \n*“You’re saying the project’s delayed (content). You seem frustrated (emotion). Are you needing more support?” (need)*  \n\n### Step 3: Reflect & Clarify (2-3 mins)  \n**DO**:  \n- Paraphrase: “So what I’m hearing is…”  \n- Probe gently: “When you say ___, do you mean…?”  \n**Script**:  \n*“Let me make sure I understand: You felt overlooked in the meeting because your ideas weren’t acknowledged. Is that right?”*  \n\n### Step 4: Validate Emotions (1-2 mins)  \n**DO**:  \n- Name feelings without judgment: “It makes sense you’d feel hurt.”  \n- Avoid minimizing: Don’t say “At least…” or “But…”  \n**Example**:  \n*“Being passed over for the promotion sounds disappointing. That’s really tough.”*  \n\n### Step 5: Ask Strategic Questions (2-4 mins)  \n**DO**:  \n- Open-ended: “What would your ideal solution look like?”  \n- Future-focused: “How can we prevent this next time?”  \n**Avoid**: “Why did you…?” (triggers defensiveness)  \n\n### Step 6: Summarize & Act (1-3 mins)  \n**DO**:  \n- Recap key points: “So our action steps are 1)… 2)…”  \n- Confirm next steps: “I’ll email the report by Friday. Does that work?”  \n**Example**:  \n*“To confirm: We’ll extend the deadline to Tuesday, and I’ll check in daily. Let’s revisit this next Monday.”*  \n\n---\n\n## 📋 Active Listening Laws (Research-Backed)  \n\n### ✅ **DO**:  \n4. **5-Second Pause**: Wait before replying (reduces interruptions by 70%)  \n5. **Nonverbals**: Nodding (1x/sec), eye contact (60-70% of time), open posture  \n6. **Track Keywords**: Note repeated phrases (“I’m always overwhelmed”)  \n7. **Silence Comfort**: Allow 5-7 seconds of quiet for deeper reflection  \n\n### ❌ **DON’T**:  \n8. **Rehearse Responses**: Focus 100% on the speaker’s words  \n9. **Problem-Solve Prematurely**: “Have you tried…?” before validating  \n10. **Assume Motives**: “You’re just saying that because…”  \n11. **Multitask**: Even glancing at a clock breaks connection  \n\n---\n\n## 🏢 Real-World Use Cases & Templates  \n\n### **Workplace Conflict Script**  \n\n1. Reflect: “You’re upset the client changes weren’t discussed with you.”  \n2. Validate: “That would make anyone feel sidelined.”  \n3. Empower: “How would you like to be involved moving forward?”  \n\n### **Personal Relationship Tracker**\n\n|Date|Conversation Type|Key Insight Gained|Follow-Up Action|\n|---|---|---|---|\n|8/1|Partner’s work stress|Feels micromanaged|Plan weekend unwind|\n|8/3|Friend’s family issue|Needs distraction|Send comedy podcast|\n\n---\n\n## ✏️ Active Listening Journal System\n\n### **Progress Table**\n\n|Interaction|What I Did Well|Growth Area|\n|---|---|---|\n|Team meeting|Paraphrased 3x|Avoided interrupting|\n|Spouse chat|Noticed clenched jaw|Asked 2 open questions|\n\n---\n\n## 📚 Case Study: \"Hospital Reduces Patient Complaints by 60%\"\n\n**Challenge**:  \nFrequent complaints about “not feeling heard” from patients\n\n**Solution**:\n\n1. Trained staff in **HEAR Technique**:\n    - **H**alt tasks\n    - **E**ngage eyes\n    - **A**cknowledge emotions\n    - **R**epeat concerns\n2. Implemented 2-min post-appointment check-ins\n\n**Results**:\n- Patient satisfaction ↑ 35% in 2 months\n- Misdiagnoses ↓ 20% (better symptom reporting)\n\n---\n## ⚡ Advanced Pro Techniques\n### 1. Decode Vocal Patterns\n- **Pitch ↑**: Anxiety/excitement\n- **Pacing ↓**: Uncertainty\n- **Volume ↓**: Shame/hesitation  \n    _Example_: “I notice your voice softened when mentioning the budget. Want to expand?”\n\n### 2. The 3:1 Ratio\nSpeak 1 sentence for every 3 the other person shares.\n\n### 3. Mirroring++\nMatch their:\n- Posture (70% similarity)\n- Speech pace (±10%)\n- Vocabulary (“You mentioned ‘chaos’ – is that recurring?”)\n\n---\n\n## 🕒 Time-Optimized Methods\n\n|Duration|Practice|Example|\n|---|---|---|\n|2 mins|Micro-Reflection|Paraphrase key points after a call|\n|5 mins|Silent Listening|Practice zero interruptions during a coffee chat|\n|15 mins|Depth Drill|Use only open-ended questions in a conversation|\n\n---\n\n## 🚨 Common Pitfalls & Fixes\n\n**Pitfall 1**: “I need to fill silence!”  \n**Fix**: Count 7 breaths before responding.\n\n**Pitfall 2**: Over-parroting (“So you’re saying…”)  \n**Fix**: Vary reflections: “Your main concern seems to be…”\n\n**Pitfall 3**: Emotional hijacking (“That happened to me too!”)  \n**Fix**: Use “You…” statements: “You must have felt…”\n\n---\n\n## 🌐 Essential Tools\n\n**Free Resources**:\n- Otter.ai (Transcribes conversations for review)\n - OBSERVE Framework PDF (Nonverbal tracking guide)\n   \n**Books**:\n- _You’re Not Listening_ (Kate Murphy)\n- _Nonviolent Communication_ (Marshall Rosenberg)\n\n**Courses**:\n- “Listening to Lead” (LinkedIn Learning)\n- “Deep Listening” (Mindful.org)\n\n---\n\n## 🧩 Self-Assessment Quiz\n\n3. The best response to “My boss hates me” is:  \n    a) “No they don’t!”  \n    b) “That sounds painful. What happened?”  \n    c) “Quit that job!”\n    \n4. True active listening requires:  \n    a) Solving the problem  \n    b) Understanding the emotion  \n    c) Agreeing with the speaker\n    \n\n_(Answers: 1b, 2b)_"
  
  const techniqueData = {
    title,
    description,
    difficulty,
    timeNeeded,
    content: content.trim(),
    slug
  };
  
  await addTechnique(categoryId, techniqueData);
  
  await question("\nPress Enter to return to main menu...");
  showMainMenu();
}

async function deleteTechniqueMenu() {
  console.clear();
  console.log("\n=== Delete Technique ===");
  
  const categoryId = await question("Enter category ID: ");
  const techniqueId = await question("Enter technique ID: ");
  
  await deleteTechnique(categoryId, techniqueId);
  
  await question("\nPress Enter to return to main menu...");
  showMainMenu();
}

// Start the application
showMainMenu();