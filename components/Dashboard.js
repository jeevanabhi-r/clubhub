function Dashboard() {
  const [user, setUser] = React.useState(null);
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const db = window.db;

  React.useEffect(() => {
    const stored = localStorage.getItem('clubhub_user');

    if (stored) {
      setUser(JSON.parse(stored));
      fetchEvents();
    } else {
      window.location.href = "index.html";
    }
  }, []);

  // 🔥 FETCH EVENTS FROM FIREBASE
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const snapshot = await db.collection("events").get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setEvents(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // 🔥 ADD EVENT
  const addEvent = async () => {
    const title = prompt("Enter title");
    const description = prompt("Enter description");

    if (!title) return;

    await db.collection("events").add({
      title,
      description,
      date: new Date().toISOString()
    });

    fetchEvents();
  };

  // 🔥 DELETE EVENT
  const deleteEvent = async (id) => {
    await db.collection("events").doc(id).delete();
    fetchEvents();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <button onClick={addEvent}>Add Event</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {events.map(ev => (
            <div key={ev.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              <h3>{ev.title}</h3>
              <p>{ev.description}</p>
              <button onClick={() => deleteEvent(ev.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
