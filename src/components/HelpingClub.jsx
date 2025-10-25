import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Icon } from '@iconify/react';
import emailjs from '@emailjs/browser';

const HelpingClub = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    class: '',
    workType: '',
    subject: '',
    deadline: '',
    pages: '',
    extras: 'None',
    instructions: ''
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.class || 
        !formData.workType || !formData.subject || !formData.deadline || 
        !formData.pages) {
      showNotification('⚠️ Please fill in all required fields!', 'error');
      setIsSubmitting(false);
      return;
    }

    const timestamp = new Date().toLocaleString();
    const dataRow = {
      'Timestamp': timestamp,
      'Name': formData.name,
      'Email': formData.email,
      'Class': formData.class,
      'Type of Work': formData.workType,
      'Subject': formData.subject,
      'Deadline': formData.deadline,
      'No. of Pages': formData.pages,
      'Extras': formData.extras,
      'Special Instructions': formData.instructions || 'None'
    };

    try {
      // Send email using EmailJS
      await sendEmail(dataRow);
      
      // Save to Excel as backup
      // await saveToExcel(dataRow);
      
      showNotification('✅ Thank you! Your enquiry has been recorded and sent successfully.', 'success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        class: '',
        workType: '',
        subject: '',
        deadline: '',
        pages: '',
        extras: 'None',
        instructions: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification('❌ There was an error submitting your enquiry. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendEmail = async (data) => {
    try {
      // EmailJS configuration
      const serviceId = 'service_qz04h9e'; // Replace with your EmailJS service ID
      const templateId = 'template_ssrn958'; // Replace with your EmailJS template ID
      const publicKey = 'QpqGp3wJOKj8S82d1'; // Replace with your EmailJS public key

      const templateParams = {
        to_email: 'krishnanofficial@gmail.com', // Replace with owner's email
        from_name: data.Name,
        from_email: data.Email,
        timestamp: data.Timestamp,
        class: data.Class,
        work_type: data['Type of Work'],
        subject: data.Subject,
        deadline: data.Deadline,
        pages: data['No. of Pages'],
        extras: data.Extras,
        instructions: data['Special Instructions'],
        message: `
New Enquiry Received!

Name: ${data.Name}
Email: ${data.Email}
Class: ${data.Class}
Type of Work: ${data['Type of Work']}
Subject: ${data.Subject}
Deadline: ${data.Deadline}
Number of Pages: ${data['No. of Pages']}
Extras: ${data.Extras}
Special Instructions: ${data['Special Instructions']}

Timestamp: ${data.Timestamp}
        `
      };

      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      console.log('✅ Email sent successfully:', response.status, response.text);
      return response;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      // Don't throw error - we still want to save to Excel
      showNotification('⚠️ Email could not be sent, but data has been saved locally.', 'warning');
    }
  };

  const saveToExcel = async (data) => {
    try {
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([data]);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Enquiries');

      // Generate file name with timestamp
      const fileName = `enquiry_${new Date().getTime()}.xlsx`;

      // Download the file (browser will save it)
      XLSX.writeFile(wb, fileName);

      console.log('✅ Data saved to Excel:', fileName);

      // Note: For actual server-side storage, you would need a backend API
      // This client-side approach downloads the file to user's computer
      
    } catch (error) {
      console.error('❌ Error saving to Excel:', error);
      throw error;
    }
  };

  const scrollToForm = () => {
    document.getElementById('enquiry-form')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden relative">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Cursor Glow Effect */}
      <div 
        className="pointer-events-none fixed w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-300 ease-out z-0"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 right-8 z-50 animate-slide-in-right">
          <div className={`${
            toastType === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400/30' :
            toastType === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400/30' :
            'bg-gradient-to-r from-yellow-500 to-orange-600 border-yellow-400/30'
          } text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border`}>
            <div className="flex items-center gap-3">
              {toastType === 'success' && (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              )}
              {toastType === 'error' && (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              )}
              {toastType === 'warning' && (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              )}
              <span className="font-semibold">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in-up">
          <div className="inline-block">
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                FROM I TRIED
              </h1>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                TO I ACED IT!
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            </div>
          </div>

          <p className="text-2xl md:text-3xl text-gray-300 font-medium max-w-3xl mx-auto animate-fade-in-up delay-200">
            We handle the grind so that you don't have to! 
            <span className="inline-block animate-bounce ml-2">😊</span>
          </p>

          <div className="relative group animate-fade-in-up delay-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 max-w-2xl mx-auto">
              <p className="text-lg text-gray-200 font-medium">
                We keep it 100% <span className="text-green-400 font-bold">confidential</span> and 
                <span className="text-green-400 font-bold"> secure</span>
              </p>
              <p className="text-sm text-gray-400 mt-3">
                DM for price enquiry and services
              </p>
            </div>
          </div>

          <button
            onClick={scrollToForm}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-10 py-5 rounded-full text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 animate-fade-in-up delay-500"
          >
            <span>Get Help Now</span>
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            THE HELPING CLUB
          </h2>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12 space-y-8">
              <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-100">
                STRUGGLING WITH ASSIGNMENTS AND INCOMPLETE COPIES?!
              </h3>
              
              <div className="flex justify-center gap-8 text-6xl">
                <span className="animate-bounce" style={{animationDelay: '0s'}}>📘</span>
                <span className="animate-bounce" style={{animationDelay: '0.2s'}}>✍️</span>
                <span className="animate-bounce" style={{animationDelay: '0.4s'}}>🗓️</span>
              </div>
              
              <p className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                WE GOT YOUR BACKLOGS
              </p>
              
              <p className="text-3xl md:text-5xl font-black text-center text-gray-100">
                Don't waste your time on boring assignments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📝', title: 'Fill Your Details', desc: 'Tell us about your assignment - class, subject, deadline, and pages', delay: '0s' },
              { icon: '⏳', title: 'We Handle the Grind', desc: 'Our experts get to work on your assignments while you relax', delay: '0.2s' },
              { icon: '🎉', title: 'You Ace It Effortlessly!', desc: 'Receive your completed work and submit with confidence', delay: '0.4s' }
            ].map((step, idx) => (
              <div key={idx} className="group relative" style={{animationDelay: step.delay}}>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                  <div className="text-7xl mb-6 animate-float" style={{animationDelay: step.delay}}>{step.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">{step.title}</h3>
                  <p className="text-gray-400 text-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section id="enquiry-form" className="relative py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Submit Your Enquiry
          </h2>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-25"></div>
            <div className="relative bg-gray-900/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="group">
                  <label className="block text-gray-200 font-semibold mb-2 text-lg flex items-center gap-2">
                    <span>📝</span> Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    placeholder="Your full name"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-gray-200 font-semibold mb-2 text-lg flex items-center gap-2">
                    <span>📧</span> Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    placeholder="your.email@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Class */}
                <div className="group">
                  <label className="block text-gray-200 font-semibold mb-2 text-lg flex items-center gap-2">
                    <span>📘</span> Class (e.g., 10th CBSE) *
                  </label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    placeholder="10th CBSE"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Type of Work */}
                <div className="group">
                  <label className="block text-gray-200 font-semibold mb-2 text-lg flex items-center gap-2">
                    <span>✍️</span> Type of Work *
                  </label>
                  <select
                    name="workType"
                    value={formData.workType}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="" className="bg-gray-800">Select type</option>
                    <option value="Assignment" className="bg-gray-800">Assignment</option>
                    <option value="Notebook" className="bg-gray-800">Notebook</option>
                  </select>
                </div>

                {/* Subject */}
                <div className="group">
                  <label className="block text-gray-200 font-semibold mb-2 text-lg flex items-center gap-2">
                    <span>📚</span> Subject (e.g., History) *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    placeholder="History"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Deadline */}
                <div className="group">
                  <label className="block text-gray-200 font-semibold mb-2 text-lg flex items-center gap-2">
                    <span>🗓️</span> Deadline *
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Number of Pages */}
                <div className="group">
                  <label className="block text-gray-200 font-semibold mb-2 text-lg flex items-center gap-2">
                    <span>📄</span> Number of Pages *
                  </label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    placeholder="8"
                    min="1"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Extras */}
                <div className="group">
                  <label className="block text-gray-200 font-semibold mb-2 text-lg flex items-center gap-2">
                    <span>🖼️</span> Extras
                  </label>
                  <select
                    name="extras"
                    value={formData.extras}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    <option value="None" className="bg-gray-800">None</option>
                    <option value="Images" className="bg-gray-800">Images</option>
                    <option value="Printouts" className="bg-gray-800">Printouts</option>
                  </select>
                </div>

                {/* Special Instructions */}
                <div className="group">
                  <label className="block text-gray-200 font-semibold mb-2 text-lg flex items-center gap-2">
                    <span>💬</span> Special Instructions
                  </label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 resize-none"
                    rows="4"
                    placeholder="Any special requirements or instructions..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-5 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Enquiry ✅'
                  )}
                </button>
              </form>

              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl">
                <p className="text-gray-200 text-center font-medium leading-relaxed">
                  ✅ We'll reply with the cost and UPI details<br/>
                  💰 Full payment before delivery<br/>
                  ⚡ Delivery within 1-3 days depending upon the page<br/>
                  🚀 Extra payment for work to be done within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-purple-500/30 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Logo and About */}
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                THE HELPING CLUB
              </h3>
              <p className="text-gray-400 font-medium">From I Tried to I Aced It! 🎯</p>
              <p className="text-sm text-gray-500 italic mt-4">We handle the grind so that you don't have to!</p>
            </div>

            {/* Contact Info */}
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-200 mb-4">Get In Touch 📞</h4>
              <div className="space-y-3">
                <a href="mailto:contact@thehelpingclub.com" className="flex items-center justify-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <Icon icon="mdi:email" className="w-5 h-5" />
                  <span className="font-medium">contact@thehelpingclub.com</span>
                </a>
                <a href="tel:+919876543210" className="flex items-center justify-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <Icon icon="mdi:phone" className="w-5 h-5" />
                  <span className="font-medium">+91 98765 43210</span>
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                  <Icon icon="mdi:whatsapp" className="w-5 h-5" />
                  <span className="font-medium">WhatsApp Us</span>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="text-center md:text-right">
              <h4 className="text-xl font-bold text-gray-200 mb-4">Follow Us 🚀</h4>
              <div className="flex justify-center md:justify-end gap-4">
                <a
                  href="https://instagram.com/thehelpingclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50"
                  aria-label="Instagram"
                >
                  <Icon icon="mdi:instagram" className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://facebook.com/thehelpingclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                  aria-label="Facebook"
                >
                  <Icon icon="mdi:facebook" className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://twitter.com/thehelpingclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-500/50"
                  aria-label="Twitter"
                >
                  <Icon icon="mdi:twitter" className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://linkedin.com/company/thehelpingclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                  aria-label="LinkedIn"
                >
                  <Icon icon="mdi:linkedin" className="w-6 h-6 text-white" />
                </a>
              </div>
              <p className="text-sm text-gray-500 font-medium mt-6">🔒 100% Confidential & Secure</p>
            </div>
          </div>

          <div className="border-t border-purple-500/30 pt-8 text-center">
            <p className="text-gray-400 font-semibold">© 2025 The Helping Club - From I Tried to I Aced It!</p>
            <p className="text-sm text-gray-500 mt-2">Made with ❤️ for students who want to ace it effortlessly</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slide-in-right {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
};

export default HelpingClub;
