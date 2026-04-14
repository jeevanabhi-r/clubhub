const fetchEvents = () => {
  const data = JSON.parse(localStorage.getItem('events') || '[]');
  setEvents(data);
};

const handleSaveEvent = (e) => {
  e.preventDefault();

  const events = JSON.parse(localStorage.getItem('events') || '[]');

  if (formData.id) {
    const updated = events.map(ev =>
      ev.id === formData.id ? formData : ev
    );
    localStorage.setItem('events', JSON.stringify(updated));
  } else {
    const newEvent = { ...formData, id: Date.now() };
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
  }

  setShowEventForm(false);
  fetchEvents();
};

const handleDeleteEvent = (id) => {
  const events = JSON.parse(localStorage.getItem('events') || '[]');
  const updated = events.filter(ev => ev.id !== id);
  localStorage.setItem('events', JSON.stringify(updated));
  fetchEvents();
};
