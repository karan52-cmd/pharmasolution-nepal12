
import React, { useState } from 'react';
import { UserRole, Program, User } from '../types';
import { AuthService, DataService } from '../services/mockBackend';
import { EmailService } from '../services/emailService';
import { Loader2, ShieldAlert, Mail, X, AlertCircle, Key, CheckCircle } from 'lucide-react';
import Logo from '../components/Logo';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup State
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [program, setProgram] = useState<Program>(Program.BACHELOR);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let user;
      if (isLogin) {
        user = await AuthService.login(email, password);
        onLogin(user);
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match!");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters long.");
          setLoading(false);
          return;
        }

        user = await AuthService.signup(name, email, password, role, role === UserRole.STUDENT ? program : undefined);
        if (role === UserRole.INSTRUCTOR) {
          alert("Account Created! Your account is pending Admin approval. You will be notified once verified.");
          setIsLogin(true); // Redirect to login
        } else {
          onLogin(user);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication Failed.');
    } finally {
      setLoading(false);
    }
  };

  const ForgotPasswordModal = () => {
    const [resetEmail, setResetEmail] = useState('');
    const [step, setStep] = useState<'email' | 'verify_otp' | 'new_password'>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [serverOtp, setServerOtp] = useState(''); // In real app, store this more securely or validate on backend
    const [userOtp, setUserOtp] = useState('');
    
    const [newPass, setNewPass] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');

    const handleSendOTP = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      
      try {
        // 1. Check if user exists locally
        const users = await DataService.getAllUsers();
        const user = users.find(u => u.email === resetEmail);
        
        if (!user) {
          alert("No account found with this email address.");
          setIsLoading(false);
          return;
        }

        // 2. Generate OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setServerOtp(generatedOtp);

        // 3. Send Email via EmailJS
        await EmailService.sendOTP(resetEmail, generatedOtp, user.name);
        
        setStep('verify_otp');
      } catch (err) {
        console.error(err);
        alert("Failed to send email. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    const handleVerifyOTP = (e: React.FormEvent) => {
      e.preventDefault();
      if (userOtp === serverOtp) {
        setStep('new_password');
      } else {
        alert("Invalid Code. Please try again.");
      }
    };

    const handleReset = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPass !== confirmNewPass) {
        alert("Passwords do not match");
        return;
      }
      if (newPass.length < 6) {
        alert("Password too short");
        return;
      }

      setIsLoading(true);
      try {
        await AuthService.resetPassword(resetEmail, newPass);
        alert("Password changed successfully! Please login.");
        setShowForgot(false);
      } catch (err) {
        alert("Failed to reset password.");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
        <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl p-6 border border-transparent dark:border-slate-700">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white">Reset Password</h3>
             <button onClick={() => setShowForgot(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
               <X size={20} />
             </button>
           </div>
           
           {/* Step 1: Enter Email */}
           {step === 'email' && (
             <form onSubmit={handleSendOTP} className="space-y-4">
               <p className="text-sm text-slate-500 dark:text-slate-400">
                 Enter your email address. We will send a verification code to your inbox.
               </p>
               <div>
                 <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 uppercase">Email Address</label>
                 <input 
                   required
                   type="email" 
                   className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                   value={resetEmail}
                   onChange={e => setResetEmail(e.target.value)}
                 />
               </div>
               <button disabled={isLoading} type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50">
                 {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
                 {isLoading ? 'Sending...' : 'Send Verification Code'}
               </button>
             </form>
           )}

           {/* Step 2: Enter OTP */}
           {step === 'verify_otp' && (
             <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-900/50 rounded-lg p-4 text-center">
                   <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600 dark:text-green-300">
                     <CheckCircle size={24} />
                   </div>
                   <h4 className="font-bold text-green-800 dark:text-green-300">Email Sent!</h4>
                   <p className="text-xs text-green-700 dark:text-green-400 mt-1">Check <b>{resetEmail}</b> for the code.</p>
                </div>

                <div>
                   <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 uppercase">Enter 6-Digit Code</label>
                   <input 
                     required
                     type="text" 
                     maxLength={6}
                     className="w-full px-4 py-3 text-center text-2xl tracking-widest font-mono border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                     value={userOtp}
                     onChange={e => setUserOtp(e.target.value)}
                     placeholder="000000"
                   />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                  Verify Code
                </button>
             </form>
           )}

           {/* Step 3: New Password Form */}
           {step === 'new_password' && (
             <form onSubmit={handleReset} className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">Resetting password for: <b>{resetEmail}</b></p>
                </div>
                <div>
                 <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 uppercase">New Password</label>
                 <input 
                   required
                   type="password" 
                   className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                   value={newPass}
                   onChange={e => setNewPass(e.target.value)}
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 uppercase">Confirm Password</label>
                 <input 
                   required
                   type="password" 
                   className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                   value={confirmNewPass}
                   onChange={e => setConfirmNewPass(e.target.value)}
                 />
               </div>
               <button disabled={isLoading} type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50">
                 {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Key size={16} />}
                 Change Password
               </button>
             </form>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-4">
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col border border-transparent dark:border-slate-700">
          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-950 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-900/20 opacity-50"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white p-2 rounded-full shadow-lg mb-4">
                <Logo className="w-20 h-20" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Pharma Solution Nepal</h1>
              <p className="text-slate-400 text-sm mt-2">
                {isLogin ? 'Welcome back, please login.' : 'Create an account to get started.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  required
                  type="password"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              {!isLogin && (
                 <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                    <input
                      required
                      type="password"
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">I am a...</label>
                    <select 
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                    >
                      <option value={UserRole.STUDENT}>Student</option>
                      <option value={UserRole.INSTRUCTOR}>Instructor</option>
                    </select>
                  </div>

                  {role === UserRole.INSTRUCTOR && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800">
                      <p className="text-xs text-amber-700 dark:text-amber-400 flex gap-2">
                        <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                        Instructor accounts require manual verification by an administrator before access is granted.
                      </p>
                    </div>
                  )}

                  {role === UserRole.STUDENT && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Program</label>
                      <select 
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        value={program}
                        onChange={(e) => setProgram(e.target.value as Program)}
                      >
                        <option value={Program.BACHELOR}>{Program.BACHELOR}</option>
                        <option value={Program.DIPLOMA}>{Program.DIPLOMA}</option>
                        <option value={Program.DHA}>{Program.DHA}</option>
                      </select>
                    </div>
                  )}
                 </>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                {loading && <Loader2 className="animate-spin" size={20} />}
                {isLogin ? 'Sign In' : (role === UserRole.INSTRUCTOR ? 'Submit for Approval' : 'Create Account')}
              </button>
            </form>

            {isLogin && (
              <div className="mt-3 text-right">
                <button onClick={() => setShowForgot(true)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Forgot Password?</button>
              </div>
            )}

            {/* Toggle */}
            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showForgot && <ForgotPasswordModal />}
    </div>
  );
};

export default Auth;