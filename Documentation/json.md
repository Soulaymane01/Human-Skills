for each api here is an example of how the data should look like : 

# Post 

## Articale
```json
{
    "title": "The Science of Habit Formation: A Comprehensive Guide",
    "excerpt": "Discover the neurological basis of habit formation and practical strategies for building lasting positive habits.",
    "content": "the articale it self",
    "category": "Personal Growth",
    "readTime": "12 min read",
    "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    "author": {
      "name": "Dr. Sarah Johnson",
      "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
    }
  }
```
## Resources 
```json
{
"downloadables": [
    {
      "title": "Goal Setting Worksheet",
      "description": "A comprehensive worksheet to help you set and track SMART goals",
      "type": "PDF",
      "size": "245 KB"
    },
    {
      "title": "Habit Tracker Template",
      "description": "Daily and monthly habit tracking templates for personal development",
      "type": "Excel",
      "size": "180 KB"
    },
    {
      "title": "Decision Matrix Template",
      "description": "Template for evaluating and making complex decisions",
      "type": "PDF",
      "size": "156 KB"
    }
  ],
  "books": [
    {
      "title": "Atomic Habits",
      "author": "James Clear",
      "description": "An easy and proven way to build good habits and break bad ones",
      "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
    },
    {
      "title": "Emotional Intelligence 2.0",
      "author": "Travis Bradberry",
      "description": "Strategies for increasing your emotional intelligence",
      "image": "https://images.unsplash.com/photo-1544716279-e6d875007edb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
    }
  ],
  "external": [
    {
      "title": "Harvard Business Review",
      "description": "Articles on leadership and management skills",
      "url": "#",
      "category": "Leadership"
    },
    {
      "title": "Psychology Today",
      "description": "Latest research on human behavior and mental processes",
      "url": "#",
      "category": "Psychology"
    },
    {
      "title": "MIT OpenCourseWare",
      "description": "Free access to MIT course materials",
      "url": "#",
      "category": "Education"
    }
  ]
};
```

## Techniques : 
```json
[
  {
    "category": "Cognitive Skills",
    "icon": "Brain",
    "techniques": [
      {
        "title": "Active Recall",
        "description": "Learn how to strengthen memory and understanding through active information retrieval",
        "difficulty": "Medium",
        "timeNeeded": "20-30 minutes"
      },
      {
        "title": "Mind Mapping",
        "description": "Visual technique for organizing information and seeing connections",
        "difficulty": "Easy",
        "timeNeeded": "15-20 minutes"
      },
      {
        "title": "Pomodoro Technique",
        "description": "Time management method to maintain focus and productivity",
        "difficulty": "Easy",
        "timeNeeded": "25 minutes"
      }
    ]
  },
  {
    "category": "Emotional Intelligence",
    "icon": "Heart",
    "techniques": [
      {
        "title": "Emotional Labeling",
        "description": "Practice identifying and naming emotions for better emotional awareness",
        "difficulty": "Medium",
        "timeNeeded": "10-15 minutes"
      },
      {
        "title": "Active Listening",
        "description": "Enhance relationships through better listening skills",
        "difficulty": "Hard",
        "timeNeeded": "Ongoing"
      }
    ]
  },
  {
    "category": "Life Navigation",
    "icon": "Compass",
    "techniques": [
      {
        "title": "Values Clarification",
        "description": "Identify and align your actions with your core values",
        "difficulty": "Medium",
        "timeNeeded": "45-60 minutes"
      },
      {
        "title": "Goal Setting Framework",
        "description": "SMART goals methodology for achieving your objectives",
        "difficulty": "Medium",
        "timeNeeded": "30-45 minutes"
      }
    ]
  },
  {
    "category": "Problem Solving",
    "icon": "Lightbulb",
    "techniques": [
      {
        "title": "Root Cause Analysis",
        "description": "Systematic approach to identifying the source of problems",
        "difficulty": "Hard",
        "timeNeeded": "30-60 minutes"
      },
      {
        "title": "Decision Matrix",
        "description": "Framework for making complex decisions with multiple factors",
        "difficulty": "Medium",
        "timeNeeded": "20-30 minutes"
      }
    ]
  }
];
```

## Tools : 
```json
[
  {
    "icon": "Calendar",
    "title": "Habit Tracker",
    "description": "Track and build positive habits with our interactive tool",
    "category": "Productivity"
  },
  {
    "icon": "Clock",
    "title": "Time Blocking Planner",
    "description": "Optimize your daily schedule with effective time management",
    "category": "Productivity",
    "slug": "time-blocking",
    "component": "TimeBlocking"
},
  {
    "icon": "Brain",
    "title": "Mind Mapping Tool",
    "description": "Organize your thoughts and ideas visually",
    "category": "Creativity",
    "slug": "mind-mappong",
    "component": "MindMapping"
  },
  {
    "icon": "Target",
    "title": "Goal Setting Framework",
    "description": "Set and achieve your personal development goals",
    "category": "Planning",
    "slug": "goal-setting",
    "component": "MindMapping"
  },
  {
    "icon": "Sparkles",
    "title": "Creativity Booster",
    "description": "Exercises and prompts to enhance creative thinking",
    "category": "Creativity",
    "slug": "creative-booster",
    "component": "CreativeBooster"
  },
  {
    "icon": "Users",
    "title": "Team Collaboration Guide",
    "description": "Templates and strategies for effective teamwork",
    "category": "Communication",
    "slug": "team-collaboration",
    "component": "TeamCollaboration"
  },
  {
    "icon": "LineChart",
    "title": "Progress Tracker",
    "description": "Monitor and visualize your personal growth journey",
    "category": "Planning",
    "slug": "progress-traxker",
    "component": "ProgressTracker"
  },
  {
    "icon": "Workflow",
    "title": "Decision Making Matrix",
    "description": "Framework for making better life and career decisions",
    "category": "Planning",
    "slug": "decision-matrix",
    "component": "DecisionMatrix"
  }
];

```