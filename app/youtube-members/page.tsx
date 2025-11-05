"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaYoutube, FaDiscord, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

export default function YouTubeMembersPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    youtubeUsername: '',
    discordUsername: '',
    email: '',
    membershipTier: '',
    screenshot: null as string | null
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/youtube-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setStatus('success');
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or email support@jesseonfire.com');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center p-4">
        <motion.div 
          className="max-w-2xl w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">
              🔥 <span className="text-fire-orange">Success!</span>
            </h1>
            <p className="text-2xl text-gray-300 mb-2">
              Check your email right now!
            </p>
            <p className="text-lg text-gray-400">
              We sent instructions to: <span className="text-fire-orange font-bold">{formData.email}</span>
            </p>
          </div>

          <div className="bg-gradient-to-r from-fire-orange to-red-600 rounded-xl p-8 mb-8 text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-3xl font-bold mb-4">Check Your Email NOW!</h2>
            <p className="text-xl mb-4">
              Your Discord invite and instructions are waiting in your inbox
            </p>
            <p className="text-lg opacity-90">
              {formData.discordUsername ? 
                `We'll be looking for "${formData.discordUsername}" when you join!` :
                `Your verification code is in the email - save it!`}
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">📨 What's in your email:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Discord server invite link</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{formData.discordUsername ? 
                  'Automatic role assignment instructions' : 
                  'Your verification code to use after joining'}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Step-by-step instructions</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400 mb-4">
              Didn't receive the email? Check your spam folder!
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setFormData({ 
                  youtubeUsername: '', 
                  discordUsername: '', 
                  email: '',
                  membershipTier: '',
                  screenshot: null 
                });
              }}
              className="text-fire-orange hover:text-white transition-colors underline"
            >
              Verify another account
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-obsidian to-charcoal py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center gap-4 mb-6">
            <FaYoutube className="text-5xl text-red-600" />
            <span className="text-5xl">→</span>
            <FaDiscord className="text-5xl text-[#5865F2]" />
          </div>
          <h1 className="font-display text-5xl lg:text-7xl text-fire-orange mb-4 uppercase tracking-wider">
            YouTube Members
          </h1>
          <p className="text-2xl text-white mb-2">
            Get Discord Access FREE
          </p>
          <p className="text-lg text-ash-grey">
            Already supporting on YouTube? Don't pay twice!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* How It Works */}
          <motion.div 
            className="card-cinematic p-8 h-fit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-heading text-fire-orange mb-8 uppercase flex items-center gap-3">
              <span className="text-4xl">⚡</span> Instant Access
            </h2>
            
            <div className="space-y-6">
              <motion.div 
                className="flex gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-3xl flex-shrink-0">1️⃣</div>
                <div>
                  <p className="font-bold text-white text-lg">Submit Form</p>
                  <p className="text-ash-grey">
                    Enter your YouTube & Discord usernames
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-3xl flex-shrink-0">2️⃣</div>
                <div>
                  <p className="font-bold text-white text-lg">Get Email</p>
                  <p className="text-ash-grey">
                    Instant email with Discord invite
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-3xl flex-shrink-0">3️⃣</div>
                <div>
                  <p className="font-bold text-white text-lg">Connect & Done</p>
                  <p className="text-ash-grey">
                    Link YouTube in Discord for auto role
                  </p>
                </div>
              </motion.div>
            </div>
            
            <div className="mt-8 p-4 bg-fire-orange/10 rounded-lg border border-fire-orange/30">
              <p className="text-sm text-fire-orange font-bold mb-1">🔥 Auto-Management</p>
              <p className="text-xs text-ash-grey">
                If you cancel YouTube membership, Discord removes your role automatically
              </p>
            </div>
            
            {/* Tier Information */}
            <div className="mt-6 space-y-3">
              <p className="text-sm font-bold text-white">YouTube Tier = Discord Access:</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-ash-grey">
                  <span>Inner Circle ($4.99)</span>
                  <span className="text-fire-orange">→ Basic</span>
                </div>
                <div className="flex justify-between text-ash-grey">
                  <span>Best Friends ($9.99)</span>
                  <span className="text-purple-500">→ Premium</span>
                </div>
                <div className="flex justify-between text-ash-grey">
                  <span>You Love Me ($24.99)</span>
                  <span className="text-yellow-500">→ VIP</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Verification Form */}
          <motion.div 
            className="card-cinematic p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-heading text-fire-orange mb-8 uppercase">
              Get Your Access
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">
                  YouTube Username
                </label>
                <div className="relative">
                  <FaYoutube className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600" />
                  <input
                    type="text"
                    required
                    placeholder="@yourname"
                    value={formData.youtubeUsername}
                    onChange={(e) => setFormData({...formData, youtubeUsername: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border-2 border-fire-orange/30 rounded-lg text-white placeholder-ash-grey/50 focus:border-fire-orange focus:outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">
                  Membership Tier
                </label>
                <div className="relative">
                  <FaYoutube className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600" />
                  <select
                    required
                    value={formData.membershipTier}
                    onChange={(e) => setFormData({...formData, membershipTier: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border-2 border-fire-orange/30 rounded-lg text-white focus:border-fire-orange focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-black">Select your tier...</option>
                    <option value="inner-circle" className="bg-black">Jesse's Inner Circle ($4.99/month)</option>
                    <option value="best-friends" className="bg-black">Jesse's Best Friends - BFF ($9.99/month)</option>
                    <option value="elite" className="bg-black">Love Me Long Time ($24.99/month)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discord Username (Optional)
                </label>
                <div className="relative">
                  <FaDiscord className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5865F2]" />
                  <input
                    type="text"
                    id="discord"
                    name="discord"
                    value={formData.discordUsername}
                    onChange={(e) => setFormData({...formData, discordUsername: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border-2 border-fire-orange/30 rounded-lg text-white placeholder-ash-grey/50 focus:border-fire-orange focus:outline-none transition-colors"
                    placeholder="realjesseonfire (no @ symbol)"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter just your username (e.g., "realjesseonfire"). Don't have Discord? Leave blank!
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-fire-orange" />
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border-2 border-fire-orange/30 rounded-lg text-white placeholder-ash-grey/50 focus:border-fire-orange focus:outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">
                  Membership Screenshot (Optional but Recommended)
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    isDragging ? 'border-fire-orange bg-fire-orange/10' : 'border-fire-orange/30 bg-black/50'
                  } ${formData.screenshot ? 'border-green-500' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith('image/')) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({...formData, screenshot: event.target?.result as string});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  onPaste={(e) => {
                    const items = e.clipboardData?.items;
                    if (items) {
                      for (let i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                          const blob = items[i].getAsFile();
                          if (blob) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setFormData({...formData, screenshot: event.target?.result as string});
                            };
                            reader.readAsDataURL(blob);
                          }
                        }
                      }
                    }
                  }}
                  tabIndex={0}
                >
                  {formData.screenshot ? (
                    <div>
                      <img src={formData.screenshot} alt="Screenshot" className="max-h-40 mx-auto mb-4 rounded" />
                      <p className="text-green-500 font-bold">✓ Screenshot uploaded!</p>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, screenshot: null})}
                        className="text-sm text-fire-orange hover:text-white mt-2"
                      >
                        Remove screenshot
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white mb-2">📸 Paste (Ctrl+V) or drag your screenshot here</p>
                      <p className="text-gray-500 text-sm">Shows your YouTube membership status</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="screenshot-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setFormData({...formData, screenshot: event.target?.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="screenshot-upload"
                        className="inline-block mt-4 px-4 py-2 bg-fire-orange/20 hover:bg-fire-orange/30 rounded cursor-pointer transition-colors"
                      >
                        Or click to browse
                      </label>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This helps us verify your membership faster. Your screenshot will be reviewed by admins.
                </p>
              </div>
              
              {status === 'error' && (
                <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg">
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-fire w-full text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {status === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Get Instant Access
                    <span className="text-2xl">→</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div 
          className="card-cinematic p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-3xl font-heading text-fire-orange mb-8 uppercase text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <p className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">❓</span> Do I need to pay for Patreon?
                </p>
                <p className="text-ash-grey pl-7">
                  No! Your YouTube membership gives you full Discord access. No double payment.
                </p>
              </div>
              
              <div>
                <p className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">⏱️</span> How fast do I get access?
                </p>
                <p className="text-ash-grey pl-7">
                  Email arrives instantly. Discord role appears 2-3 minutes after connecting YouTube.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">🚫</span> What if I cancel my membership?
                </p>
                <p className="text-ash-grey pl-7">
                  Discord automatically removes your role within 4 hours of YouTube membership ending.
                </p>
              </div>
              
              <div>
                <p className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">🆘</span> Need help?
                </p>
                <p className="text-ash-grey pl-7">
                  Reply to the verification email or message @mods in Discord for instant help.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
