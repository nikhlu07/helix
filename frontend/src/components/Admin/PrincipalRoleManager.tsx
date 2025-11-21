import React, { useState } from 'react';
import { Shield, UserPlus, Search, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '../common/Toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useContract } from '../../hooks/useContracts';

export function PrincipalRoleManager() {
  const [principalId, setPrincipalId] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const { addStateHead, addDeputy, addVendor } = useContract();

  const handleAssignRole = async () => {
    if (!principalId || !selectedRole || !name) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      let result = false;

      switch (selectedRole) {
        case 'state_head':
          result = await addStateHead(principalId, name);
          break;
        case 'deputy':
          result = await addDeputy(principalId, name);
          break;
        case 'vendor':
          result = await addVendor(principalId, name);
          break;
        default:
          showToast('Invalid role selected', 'error');
          setIsLoading(false);
          return;
      }

      if (result) {
        showToast(`Successfully assigned ${selectedRole} role to ${name}`, 'success');
        setPrincipalId('');
        setName('');
        setSelectedRole('');
      } else {
        showToast('Failed to assign role', 'error');
      }
    } catch (error) {
      console.error('Role assignment error:', error);
      showToast('Failed to assign role. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <CardTitle>Role Management</CardTitle>
        </div>
        <CardDescription>
          Assign roles and permissions to principals in the Hedera network.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Principal ID (Hedera Account ID)</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="0.0.123456"
                value={principalId}
                onChange={(e) => setPrincipalId(e.target.value)}
                className="pl-9 font-mono"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">User Name</label>
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="state_head">State Head</SelectItem>
                <SelectItem value="deputy">Deputy</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button
              className="w-full bg-black hover:bg-gray-800 text-white"
              onClick={handleAssignRole}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning Role...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign Role
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Role Permissions</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li><strong>State Head:</strong> Can allocate budgets and appoint deputies.</li>
                <li><strong>Deputy:</strong> Can manage district projects and approve claims.</li>
                <li><strong>Vendor:</strong> Can submit claims and view payments.</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}