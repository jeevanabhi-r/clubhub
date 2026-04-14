function Dashboard() {
  const [activeTab, setActiveTab] = React.useState('events');
  const [user, setUser] = React.useState(null);
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isDark, setIsDark] = React.useState(false);

  // Form states
  const [showEventForm, setShowEventForm] = React.useState(false);
  const [formData, setFormData] = React.useState({ title: '', description: '', date: '', imageOrLink: '', driveLink: '', id: null });
  const [profileMsg, setProfileMsg] = React.useState({ type: '', text: '' });
  const [passwords, setPasswords] = React.useState({ old: '', new: '', show: false });
  const [avatarPreview, setAvatarPreview] = React.useState('');

  React.useEffect(() => {
    const stored = localStorage.getItem('clubhub_user');
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      setAvatarPreview(parsedUser.avatar || '');
      fetchEvents();
    } else {
      window.location.href = 'index.html';
    }
    
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 256;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to reduce base64 size drastically
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setAvatarPreview(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await trickleListObjects('event', 100, true);
      setEvents(res.items);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
    setLoading(false);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await trickleUpdateObject('event', formData.id, {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          imageOrLink: formData.imageOrLink,
          driveLink: formData.driveLink
        });
      } else {
        await trickleCreateObject('event', {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          imageOrLink: formData.imageOrLink,
          driveLink: formData.driveLink
        });
      }
      setShowEventForm(false);
      setFormData({ title: '', description: '', date: '', imageOrLink: '', driveLink: '', id: null });
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Failed to save event.");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await trickleDeleteObject('event', id);
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const editEvent = (ev) => {
    setFormData({
      id: ev.objectId,
      title: ev.objectData.title,
      description: ev.objectData.description,
      date: new Date(ev.objectData.date).toISOString().slice(0, 16),
      imageOrLink: ev.objectData.imageOrLink || '',
      driveLink: ev.objectData.driveLink || ''
    });
    setShowEventForm(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await trickleUpdateObject('user', user.id, {
        ...user,
        name: e.target.name.value,
        avatar: avatarPreview
      });
      const updatedUser = { ...res.objectData, id: res.objectId };
      setUser(updatedUser);
      localStorage.setItem('clubhub_user', JSON.stringify(updatedUser));
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setProfileMsg({type:'',text:''}), 3000);
    } catch (err) {
      console.error(err);
      setProfileMsg({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.old !== user.password) {
      setProfileMsg({ type: 'error', text: 'Incorrect old password.' });
      return;
    }
    try {
      const res = await trickleUpdateObject('user', user.id, {
        ...user,
        password: passwords.new
      });
      setUser({ ...res.objectData, id: res.objectId });
      localStorage.setItem('clubhub_user', JSON.stringify({ ...res.objectData, id: res.objectId }));
      setProfileMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ old: '', new: '', show: false });
      setTimeout(() => setProfileMsg({type:'',text:''}), 3000);
    } catch (err) {
      console.error(err);
      setProfileMsg({ type: 'error', text: 'Failed to change password.' });
    }
  };

  if (!user) return <div className="flex h-screen items-center justify-center dark:bg-black dark:text-white">Loading...</div>;

  const now = new Date();
  const upcomingEvents = events.filter(ev => new Date(ev.objectData.date) >= now).sort((a,b) => new Date(a.objectData.date) - new Date(b.objectData.date));
  const pastEvents = events.filter(ev => new Date(ev.objectData.date) < now).sort((a,b) => new Date(b.objectData.date) - new Date(a.objectData.date));

  const EventCard = ({ ev, isAdmin }) => {
    return (
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-between h-full transition-colors">
        <div>
          {ev.objectData.imageOrLink && (
            <img src={ev.objectData.imageOrLink} alt={ev.objectData.title} className="w-full h-40 object-cover rounded-lg mb-4" />
          )}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{ev.objectData.title}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2 mt-1 mb-3">
            <span className="icon-calendar"></span> {new Date(ev.objectData.date).toLocaleString()}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{ev.objectData.description}</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4">
          {ev.objectData.driveLink && (
            <button type="button" onClick={() => window.open(ev.objectData.driveLink, "_blank")} className="text-sm px-4 py-2 text-primary bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg font-medium flex items-center gap-2 transition-colors flex-1 justify-center">
              <div className="icon-external-link"></div> View Photo
            </button>
          )}
          {isAdmin && (
            <div className="flex gap-2 ml-auto">
              <button onClick={() => editEvent(ev)} className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="icon-pencil"></div>
              </button>
              <button onClick={() => handleDeleteEvent(ev.objectId)} className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="icon-trash"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
      <div className="flex h-screen overflow-hidden dark:bg-black transition-colors" data-name="dashboard" data-file="components/Dashboard.js">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-colors">
        <div className="p-6 bg-primary flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://app.trickle.so/storage/public/images/usr_1df27d2b58000001/152dbf39-1d22-4364-af7d-3aa283498e1e.Untitled" alt="ClubHub Logo" className="h-8 w-auto object-contain rounded-md bg-white p-1" />
            <span className="text-xl font-bold text-white">ClubHub</span>
          </div>
          <button onClick={toggleTheme} className="text-white hover:text-orange-200 transition-colors">
            <div className={isDark ? "icon-sun" : "icon-moon"}></div>
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-3">
           <img 
             src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
             alt="Avatar" 
             className="w-10 h-10 rounded-full object-cover border-2 border-orange-100 dark:border-zinc-700"
           />
           <div>
             <div className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{user.name}</div>
             <div className="text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full inline-block mt-1">
               {user.role} Role
             </div>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {user.role === 'admin' ? (
            <button onClick={() => setActiveTab('events')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab==='events' ? 'bg-orange-100 dark:bg-orange-900/30 text-primary dark:text-orange-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}>
              <div className="icon-calendar-days"></div> Manage Events
            </button>
          ) : (
            <button onClick={() => setActiveTab('events')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab==='events' ? 'bg-orange-100 dark:bg-orange-900/30 text-primary dark:text-orange-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}>
              <div className="icon-calendar"></div> All Events
            </button>
          )}
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab==='profile' ? 'bg-orange-100 dark:bg-orange-900/30 text-primary dark:text-orange-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}>
            <div className="icon-user"></div> My Profile
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <button onClick={() => {
            localStorage.removeItem('clubhub_user');
            window.location.href='index.html';
          }} className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            <div className="icon-log-out"></div> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-black p-8 transition-colors">
        {activeTab === 'events' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {user.role === 'admin' ? 'Event Management' : 'Club Events'}
              </h2>
              {user.role === 'admin' && (
                <button 
                  onClick={() => {
                    setFormData({ title: '', description: '', date: '', imageOrLink: '', driveLink: '', id: null });
                    setShowEventForm(true);
                  }}
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                  <div className="icon-plus"></div> Add Event
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading events...</div>
            ) : showEventForm ? (
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 max-w-2xl">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">{formData.id ? 'Edit Event' : 'Create New Event'}</h3>
                <form onSubmit={handleSaveEvent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
                    <input type="text" required className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea required rows="4" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date & Time</label>
                    <input type="datetime-local" required className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Image URL (Optional)</label>
                    <input type="url" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary" placeholder="https://example.com/image.jpg" value={formData.imageOrLink} onChange={e=>setFormData({...formData, imageOrLink: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Google Drive Link (Optional)</label>
                    <input type="url" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary" placeholder="https://drive.google.com/..." value={formData.driveLink} onChange={e=>setFormData({...formData, driveLink: e.target.value})} />
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button type="button" onClick={() => setShowEventForm(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-lg transition-colors shadow-sm">Save Event</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-10">
                <section>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <div className="icon-calendar-days text-primary"></div> Upcoming Events
                  </h3>
                  {upcomingEvents.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600">No upcoming events right now.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingEvents.map(ev => <EventCard key={ev.objectId} ev={ev} isAdmin={user.role==='admin'} />)}
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <div className="icon-clock text-gray-400"></div> Past Events
                  </h3>
                  {pastEvents.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400 italic">No past events found.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                      {pastEvents.map(ev => <EventCard key={ev.objectId} ev={ev} isAdmin={user.role==='admin'} />)}
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Profile Settings</h2>
            
            {profileMsg.text && (
              <div className={`p-4 rounded-lg text-sm ${profileMsg.type === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                {profileMsg.text}
              </div>
            )}

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Personal Information</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <img 
                    src={avatarPreview || `https://ui-avatars.com/api/?name=${user.name}&background=random&size=128`} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-50 dark:border-gray-700"
                  />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Photo</label>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover cursor-pointer" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upload a new profile picture from your device.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary" defaultValue={user.name} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (Read Only)</label>
                    <input type="email" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed outline-none" defaultValue={user.email} readOnly />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors">
                    Update Profile
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <div className="icon-lock"></div> Security
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <div className="relative">
                    <input type={passwords.show ? "text" : "password"} required className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary pr-10" value={passwords.old} onChange={e=>setPasswords({...passwords, old: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <div className="relative">
                    <input type={passwords.show ? "text" : "password"} required className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary pr-10" value={passwords.new} onChange={e=>setPasswords({...passwords, new: e.target.value})} />
                    <button type="button" onClick={() => setPasswords({...passwords, show: !passwords.show})} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <div className={passwords.show ? 'icon-eye-off' : 'icon-eye'}></div>
                    </button>
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" className="px-6 py-2 border border-primary text-primary hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg font-medium transition-colors">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}