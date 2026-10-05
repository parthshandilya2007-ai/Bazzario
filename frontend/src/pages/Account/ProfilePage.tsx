import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || 'Parth Shandilya');
  const [email, setEmail] = useState(user?.email || 'parth@bazaario.in');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [gender, setGender] = useState('male');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({ ...user, name, email, phone });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-extrabold text-primary">Personal Profile Information</h2>
        <p className="text-xs text-text-muted mt-0.5">Manage your personal identity, contact email, and mobile number</p>
      </div>

      {isSaved && (
        <div className="p-3 bg-success/15 border border-success/30 rounded-input text-xs font-bold text-success flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary">Full Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary">Email Address</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary">Mobile Phone Number</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>

        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-text-primary block">Gender</label>
          <div className="flex gap-4">
            {['male', 'female', 'other'].map((g) => (
              <label key={g} className="flex items-center gap-1.5 text-xs font-medium text-text-primary capitalize cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === g}
                  onChange={() => setGender(g)}
                  className="text-accent focus:ring-accent"
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-3">
          <Button type="submit" variant="accent" size="default" className="font-bold">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
