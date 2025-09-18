// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import MapCanvas from "../../Components/Dashboard/MapCanvas";
import {
  fetchStations,
  fetchSections,
  fetchTracksForSection,
  fetchSignalsForTrack,
} from "../../Services/Api";
import { logoutUser } from "../../Services/AuthService"; // your existing service
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stations, setStations] = useState([]);
  const [sections, setSections] = useState([]);
  const [tracksBySection, setTracksBySection] = useState({});
  const [signalsByTrack, setSignalsByTrack] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // load stations + sections then load tracks and signals
    let mounted = true;
    async function loadAll() {
      try {
        const s = await fetchStations();
        const sec = await fetchSections();
        if (!mounted) return;
        setStations(s.stations || s); // adapt if backend wraps response
        setSections(sec.sections || sec);

        // fetch tracks for each section
        const tracksMap = {};
        await Promise.all((sec.sections || sec).map(async (section) => {
          const tracks = await fetchTracksForSection(section._id);
          tracksMap[section._id] = tracks.tracks || tracks;
        }));
        setTracksBySection(tracksMap);

        // fetch signals for each track
        const signalsMap = {};
        for (const secId of Object.keys(tracksMap)) {
          for (const t of tracksMap[secId]) {
            const sigs = await fetchSignalsForTrack(t._id);
            signalsMap[t._id] = sigs.signals || sigs;
          }
        }
        setSignalsByTrack(signalsMap);
      } catch (err) {
        console.error("Error loading map data", err);
      }
    }
    loadAll();
    return () => { mounted = false; };
  }, []);

  const onSelect = (item) => {
    // open a side panel or navigate to a detail view based on item.type
    console.log("Selected item", item);
    alert(`${item.type} selected: ${item.data?.name || item.data?.sectionId || item.data?.trackId}`);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded">Logout</button>
        </div>
      </header>

      <main className="grid grid-cols-4 gap-6">
        <aside className="col-span-1 space-y-4">
          <div className="p-4 bg-white/6 rounded">System Overview</div>
          <div className="p-4 bg-white/6 rounded">Operators</div>
          <div className="p-4 bg-white/6 rounded">Section Controllers</div>
        </aside>

        <section className="col-span-3 bg-slate-800 rounded p-4">
          <MapCanvas
            width={1100}
            height={620}
            stations={stations}
            sections={sections}
            tracksBySection={tracksBySection}
            signalsByTrack={signalsByTrack}
            onSelect={onSelect}
          />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
