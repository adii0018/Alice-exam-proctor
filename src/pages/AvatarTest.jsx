import { useState } from 'react';
import UserAvatar from '../components/common/UserAvatar';
import { AVATAR_STYLES, generateAvatarUrl, getUserInitials } from '../utils/avatarGenerator';

const AvatarTest = () => {
  const [testUser] = useState({
    username: 'john.doe',
    name: 'John Doe',
    email: 'john@example.com'
  });

  const testUrl = generateAvatarUrl('test-user', AVATAR_STYLES.ADVENTURER);
  const initials = getUserInitials(testUser);

  return (
    <div style={{ padding: 40, backgroundColor: '#0d1117', minHeight: '100vh', color: 'white' }}>
      <h1>Avatar Debug Test</h1>
      
      <div style={{ marginTop: 20, padding: 20, backgroundColor: '#161b22', borderRadius: 8 }}>
        <h2>Test Info:</h2>
        <p>Username: {testUser.username}</p>
        <p>Initials: {initials}</p>
        <p>Generated URL: <a href={testUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#58a6ff' }}>{testUrl}</a></p>
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>Direct Image Test:</h2>
        <img 
          src={testUrl} 
          alt="Test Avatar" 
          style={{ width: 100, height: 100, border: '2px solid #30363d', borderRadius: '50%' }}
          onLoad={() => console.log('✅ Direct img loaded')}
          onError={(e) => console.error('❌ Direct img failed', e)}
        />
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>UserAvatar Component Test:</h2>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <p>Size 40 (ADVENTURER - Default)</p>
            <UserAvatar user={testUser} size={40} />
          </div>
          
          <div>
            <p>Size 64 (ADVENTURER - Default)</p>
            <UserAvatar user={testUser} size={64} />
          </div>
          
          <div>
            <p>Size 100 (ADVENTURER - Default)</p>
            <UserAvatar user={testUser} size={100} />
          </div>

          <div>
            <p>Size 64 (LORELEI)</p>
            <UserAvatar user={testUser} size={64} style={AVATAR_STYLES.LORELEI} />
          </div>

          <div>
            <p>Size 64 (AVATAAARS)</p>
            <UserAvatar user={testUser} size={64} style={AVATAR_STYLES.AVATAAARS} />
          </div>

          <div>
            <p>Size 64 (BOTTTS)</p>
            <UserAvatar user={testUser} size={64} style={AVATAR_STYLES.BOTTTS} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 30, padding: 20, backgroundColor: '#161b22', borderRadius: 8 }}>
        <h2>Console Instructions:</h2>
        <p>1. Open browser DevTools (F12)</p>
        <p>2. Check Console tab for debug logs</p>
        <p>3. Check Network tab for failed requests</p>
        <p>4. Look for "UserAvatar Debug" logs</p>
      </div>
    </div>
  );
};

export default AvatarTest;
