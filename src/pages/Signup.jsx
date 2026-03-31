import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, Mail, Building, Key, Loader2, AtSign } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: 'customer'
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = form, 2 = otp verification
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, verifyOTP, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.fullName || !formData.email || !formData.username || !formData.password) {
      setError('Please fill in all details');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      setStep(2); // Move to OTP
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      const data = await googleLogin(credentialResponse.credential, formData.role);
      
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'owner') navigate('/owner');
      else navigate('/customer');
    } catch (err) {
      setError('Google Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await verifyOTP(formData.email, otp);
      
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'owner') navigate('/owner');
      else navigate('/customer');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            {step === 1 ? 'Create an account' : 'Verify your email'}
          </h2>
          {step === 2 && (
            <p className="mt-2 text-center text-sm text-slate-500">
              We've sent an OTP to {formData.email}
            </p>
          )}
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text" required
                    className="pl-10 w-full rounded-lg border-slate-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email" required
                    className="pl-10 w-full rounded-lg border-slate-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700">Username</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text" required
                    className="pl-10 w-full rounded-lg border-slate-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="johndoe99"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password" required
                    className="pl-10 w-full rounded-lg border-slate-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">I am a</label>
                <div className="mt-1 relative rounded-md shadow-sm flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input 
                      type="radio" name="role" value="customer" className="sr-only peer"
                      checked={formData.role === 'customer'}
                      onChange={() => setFormData({...formData, role: 'customer'})}
                    />
                    <div className="flex flex-col items-center justify-center p-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 peer-checked:border-indigo-500 peer-checked:bg-indigo-50">
                      <User className={`h-6 w-6 mb-1 ${formData.role === 'customer' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="text-sm font-medium text-slate-700">Customer</span>
                    </div>
                  </label>
                  
                  <label className="flex-1 cursor-pointer">
                    <input 
                      type="radio" name="role" value="owner" className="sr-only peer"
                      checked={formData.role === 'owner'}
                      onChange={() => setFormData({...formData, role: 'owner'})}
                    />
                    <div className="flex flex-col items-center justify-center p-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 peer-checked:border-indigo-500 peer-checked:bg-indigo-50">
                      <Building className={`h-6 w-6 mb-1 ${formData.role === 'owner' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="text-sm font-medium text-slate-700">Service Center</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit" disabled={loading}
                className="group relative w-full flex justify-center py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Get started'}
              </button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or sign up with</span>
              </div>
            </div>

            <div className="flex justify-center">
               <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Authentication Failed')}
                  theme="outline"
                  shape="rectangular"
                  width="100%"
                />
            </div>
            
            <div className="text-center text-sm text-slate-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Log in
              </Link>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerify}>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block text-center">Enter 6-digit OTP</label>
              <div className="mt-1 relative flex justify-center">
                <input
                  type="text" required maxLength="6"
                  className="w-1/2 text-center text-2xl tracking-widest rounded-lg border-slate-300 border-2 py-3 px-4 focus:outline-none focus:ring-0 focus:border-indigo-500 uppercase font-mono"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div>
              <button
                type="submit" disabled={loading || otp.length !== 6}
                className="group relative w-full flex justify-center py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify Account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
