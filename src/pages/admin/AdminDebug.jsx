import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function AdminDebug() {
  const { user, profile, isAdmin, loading } = useAuth();
  const [dbProfile, setDbProfile] = useState(null);
  const [dbError, setDbError]     = useState(null);
  const [testQuery, setTestQuery] = useState(null);
  const [testError, setTestError] = useState(null);

  useEffect(() => {
    async function run() {
      if (!user) return;

      // Test 1: fetch own profile directly
      const { data: p, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setDbProfile(p);
      setDbError(pErr?.message);

      // Test 2: try fetching all profiles (admin-only)
      const { data: all, error: allErr } = await supabase
        .from('profiles')
        .select('id, role, email')
        .limit(5);

      setTestQuery(all);
      setTestError(allErr?.message);
    }
    run();
  }, [user]);

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display text-3xl mb-6">Admin Debug</h1>

      <Section title="Auth Context State">
        <Row label="loading"   value={String(loading)} />
        <Row label="user.id"   value={user?.id || 'null'} />
        <Row label="user.email" value={user?.email || 'null'} />
        <Row label="profile"   value={JSON.stringify(profile)} />
        <Row label="isAdmin"   value={String(isAdmin)} />
      </Section>

      <Section title="Direct DB Profile Fetch">
        <Row label="error"  value={dbError || 'none'} ok={!dbError} />
        <Row label="result" value={JSON.stringify(dbProfile)} />
        <Row label="role"   value={dbProfile?.role || 'NOT FOUND'} ok={['admin','superadmin'].includes(dbProfile?.role)} />
      </Section>

      <Section title="Admin Query Test (fetch all profiles)">
        <Row label="error"  value={testError || 'none'} ok={!testError} />
        <Row label="count"  value={testQuery ? `${testQuery.length} rows returned` : '0'} />
        <Row label="data"   value={JSON.stringify(testQuery?.slice(0,2))} />
      </Section>

      <Section title="What to do">
        {!user && <p className="text-red-600 font-body text-sm">❌ Not logged in — go to /auth first</p>}
        {user && dbProfile?.role === 'user' && (
          <p className="text-red-600 font-body text-sm">
            ❌ Role is "user" not "admin". Run in Supabase SQL:<br/>
            <code className="bg-gray-100 px-2 py-1 block mt-2 text-xs">
              UPDATE public.profiles SET role = 'superadmin' WHERE id = '{user.id}';
            </code>
          </p>
        )}
        {user && !dbProfile && (
          <p className="text-red-600 font-body text-sm">
            ❌ No profile row found for this user. Run:<br/>
            <code className="bg-gray-100 px-2 py-1 block mt-2 text-xs">
              INSERT INTO public.profiles (id, email, role) VALUES ('{user.id}', '{user.email}', 'superadmin');
            </code>
          </p>
        )}
        {user && ['admin','superadmin'].includes(dbProfile?.role) && !testError && (
          <p className="text-green-600 font-body text-sm">✅ Everything looks correct!</p>
        )}
        {user && ['admin','superadmin'].includes(dbProfile?.role) && testError && (
          <p className="text-red-600 font-body text-sm">
            ❌ Role is correct but RLS is still blocking. Re-run the SQL policies.
          </p>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6 bg-white border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <h2 className="font-body font-medium text-sm text-gray-700">{title}</h2>
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  );
}

function Row({ label, value, ok }) {
  return (
    <div className="flex items-start gap-4 px-4 py-2.5">
      <span className="font-body text-xs text-gray-500 w-32 shrink-0 pt-0.5">{label}</span>
      <span className={`font-mono text-xs break-all ${
        ok === true  ? 'text-green-600' :
        ok === false ? 'text-red-600'   : 'text-gray-800'
      }`}>
        {value || '—'}
      </span>
    </div>
  );
}