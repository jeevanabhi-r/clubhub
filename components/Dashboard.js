function Dashboard() {
  const [events, setEvents] = React.useState([]);
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    const user = localStorage.getItem("clubhub_user");
    if (!user) window.location.href = "index.html";

    loadEvents();
  }, []);

  const loadEvents = () => {
    const data = JSON.parse(localStorage.getItem("events") || "[]");
    setEvents(data);
  };

  const addEvent = () => {
    if (!title) return;

    const newEvent = { id: Date.now(), title };
    const updated = [...events, newEvent];

    localStorage.setItem("events", JSON.stringify(updated));
    setTitle("");
    loadEvents();
  };

  const deleteEvent = (id) => {
    const updated = events.filter((e) => e.id !== id);
    localStorage.setItem("events", JSON.stringify(updated));
    loadEvents();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-bold">Dashboard</h1>

      <div className="flex gap-2">
        <input
          className="text-black p-2 rounded"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="bg-orange-500 p-2 rounded" onClick={addEvent}>
          Add
        </button>
      </div>

      <ul className="mt-4">
        {events.map((e) => (
          <li key={e.id} className="flex justify-between mt-2">
            {e.title}
            <button onClick={() => deleteEvent(e.id)}>❌</button>
          </li>
        ))}
      </ul>

      <button
        className="mt-6 bg-red-500 p-2 rounded"
        onClick={() => {
          localStorage.removeItem("clubhub_user");
          window.location.href = "index.html";
        }}
      >
        Logout
      </button>
    </div>
  );
}
