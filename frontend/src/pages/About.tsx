import React from 'react';
import { Users, Target, BookOpen, Heart, ArrowRight, Mail } from 'lucide-react';
import PageHeader from '../components/PageHeader';

function About() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <PageHeader
          title="About Human Skills"
          description="We're dedicated to helping people develop the essential human skills needed to thrive in both personal and professional life."
        />

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            {
              title: "Our Mission",
              content: "To empower individuals with practical knowledge and tools that enhance their personal growth, emotional intelligence, and life skills through accessible, evidence-based resources."
            },
            {
              title: "Our Vision",
              content: "A world where everyone has access to the resources they need to develop essential human skills, leading to more meaningful relationships, successful careers, and fulfilled lives."
            }
          ].map((section, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-16">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Accessibility",
                description: "Making personal development resources available to everyone"
              },
              {
                icon: Target,
                title: "Practicality",
                description: "Focusing on actionable techniques and real-world applications"
              },
              {
                icon: BookOpen,
                title: "Evidence-Based",
                description: "Grounding our content in research and proven methodologies"
              },
              {
                icon: Heart,
                title: "Community",
                description: "Building a supportive environment for growth and learning"
              }
            ].map((value, index) => (
              <div
                key={index}
                className="group text-center relative bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-100 rounded-full transform rotate-6 transition-transform group-hover:rotate-12" />
                    <div className="relative bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <value.icon className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-xl p-12 shadow-sm mb-16">
          <h2 className="text-3xl font-bold text-center mb-16">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "Oualid Elidrissi",
                role: "Founder",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
              },
              {
                name: "Soulaimane Nadi Lahjouji",
                role: "Developer",
                image: "https://i.postimg.cc/2ymvzHSk/A7402479-1-1.jpg"
              }
            ].map((member, index) => (
              <div
                key={index}
                className="group relative bg-gray-50 rounded-xl p-8 text-center transform transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full transform scale-110 opacity-0 group-hover:opacity-10 transition-opacity" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-40 h-40 rounded-full mx-auto object-cover ring-4 ring-white shadow-lg"
                  />
                </div>
                <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                  View Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600 rounded-xl transform rotate-1 opacity-10" />
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Want to Learn More?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Get in touch with us to learn more about our mission and how you can get involved in our journey to empower personal growth.
            </p>
            <button className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg">
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;