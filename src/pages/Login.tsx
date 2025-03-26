
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('desk_auditor');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    if (!password.trim()) {
      toast.error('Please enter a password');
      return;
    }
    
    login(email, password, selectedRole);
  };

  const roleOptions: { value: UserRole; label: string }[] = [
    { value: 'ro_admin', label: 'RO Admin' },
    { value: 'ho_admin', label: 'HO Admin' },
    { value: 'desk_auditor', label: 'Desk Auditor' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-navy">Desk Audit System</h1>
          <p className="text-gray-600 mt-2">Login to access your dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              autoComplete="email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              autoComplete="current-password"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Login as</Label>
            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map((role) => (
                <Button
                  key={role.value}
                  type="button"
                  variant={selectedRole === role.value ? 'default' : 'outline'}
                  onClick={() => setSelectedRole(role.value)}
                  className={`transition-all ${
                    selectedRole === role.value ? 'bg-navy text-white' : 'text-gray-700'
                  }`}
                >
                  {role.label}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-navy hover:bg-navy-dark transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
