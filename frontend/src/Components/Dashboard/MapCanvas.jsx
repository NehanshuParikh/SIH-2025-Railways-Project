// src/components/MapCanvas.jsx
import React, { useEffect, useRef, useState } from "react";

const StationRect = ({ ctx, x, y, w, h, station, isHover }) => {
  ctx.save();
  ctx.fillStyle = isHover ? "#0ea5e9" : "#0284c7";
  ctx.strokeStyle = "#083344";
  ctx.lineWidth = isHover ? 3 : 2;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = "#fff";
  ctx.font = "12px Inter, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(station.name, x + 8, y + h / 2 - 6);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "11px Inter, sans-serif";
  ctx.fillText(station.code || station.stationId || "", x + 8, y + h / 2 + 10);
  ctx.restore();
};

const MapCanvas = ({
  width = 1000,
  height = 600,
  stations = [],
  sections = [],
  tracksBySection = {},
  signalsByTrack = {},
  onSelect,
}) => {
  const canvasRef = useRef(null);
  const [ctxState, setCtxState] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [layout, setLayout] = useState({});
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // compute station layout
  useEffect(() => {
    const hasGeo = stations.some((s) => s.location?.lat && s.location?.lng);
    let mapping = {};
    if (hasGeo) {
      const lats = stations.map((s) => s.location?.lat ?? 0);
      const lngs = stations.map((s) => s.location?.lng ?? 0);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const pad = 40;
      const innerW = width - pad * 2;
      const innerH = height - pad * 2;

      stations.forEach((s, idx) => {
        const lat = s.location?.lat ?? (minLat + (maxLat - minLat) * (idx / (stations.length || 1)));
        const lng = s.location?.lng ?? (minLng + (maxLng - minLng) * (idx / (stations.length || 1)));
        const nx = (lng - minLng) / Math.max(maxLng - minLng, 1e-6);
        const ny = 1 - (lat - minLat) / Math.max(maxLat - minLat, 1e-6);
        mapping[s._id] = { x: Math.round(pad + nx * innerW), y: Math.round(pad + ny * innerH), w: 140, h: 48 };
      });
    } else {
      const gap = Math.max(30, Math.floor((width - 200) / Math.max(stations.length, 1) - 140));
      let x = 60;
      const y = Math.round(height / 2 - 30);
      stations.forEach((s) => {
        mapping[s._id] = { x, y, w: 140, h: 48 };
        x += 140 + gap;
      });
    }
    setLayout(mapping);
  }, [stations, width, height]);

  // draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    setCtxState(ctx);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(scale, scale);

// inside your draw() function, where you draw sections and tracks
sections.forEach((sec) => {
  const sPos = layout[sec.startStation?._id];
  const ePos = layout[sec.endStation?._id];
  if (!sPos || !ePos) return;

  const tracks = tracksBySection[sec._id] || [];
  const dx = ePos.x + ePos.w / 2 - (sPos.x + sPos.w / 2);
  const dy = ePos.y + ePos.h / 2 - (sPos.y + sPos.h / 2);
  const angle = Math.atan2(dy, dx);

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  tracks.forEach((track, i) => {
    const offset = (i - (tracks.length - 1) / 2) * 12; // spacing between parallel tracks
    const ox = -Math.sin(angle) * offset;
    const oy = Math.cos(angle) * offset;

    const startX = sPos.x + sPos.w / 2 + ox;
    const startY = sPos.y + sPos.h / 2 + oy;
    const endX = ePos.x + ePos.w / 2 + ox;
    const endY = ePos.y + ePos.h / 2 + oy;

    // update bounds for section rectangle
    minX = Math.min(minX, startX, endX);
    minY = Math.min(minY, startY, endY);
    maxX = Math.max(maxX, startX, endX);
    maxY = Math.max(maxY, startY, endY);

    // draw track line
    ctx.save();
    ctx.strokeStyle = track.status === "OCCUPIED" ? "#f97316" : "#86efac";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();

    // draw signals
    const signals = signalsByTrack[track._id] || [];
    const secLength = sec.lengthKm || Math.hypot(endX - startX, endY - startY); // fallback length
    signals.forEach((sig) => {
      const t = Math.min((sig.locationKm || 0) / secLength, 1); // normalized along track
      const sx = startX + (endX - startX) * t;
      const sy = startY + (endY - startY) * t;

      ctx.save();
      let color = "#10b981"; // green
      if (sig.aspect === "YELLOW") color = "#f59e0b";
      if (sig.aspect === "RED") color = "#ef4444";
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(sx, sy, 8, 0, Math.PI * 2); // larger radius to make it visible
      ctx.fill();
      ctx.restore();
    });
  });

  // section rectangle around tracks (optional, behind signals)
  ctx.save();
  ctx.strokeStyle = "#ffffff44";
  ctx.lineWidth = 1;
  ctx.strokeRect(minX - 6, minY - 6, maxX - minX + 12, maxY - minY + 12);
  ctx.restore();
});


      // draw stations on top
      stations.forEach((st) => {
        const pos = layout[st._id];
        if (!pos) return;
        const isHover = hoverInfo && hoverInfo.type === "station" && hoverInfo.id === st._id;
        StationRect({ ctx, x: pos.x, y: pos.y, w: pos.w, h: pos.h, station: st, isHover });
      });

      ctx.restore();
    };

    draw();
  }, [stations, sections, layout, tracksBySection, signalsByTrack, hoverInfo, width, height, pan, scale]);

  // interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ctxState) return;

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left - pan.x) / scale;
      const my = (e.clientY - rect.top - pan.y) / scale;
      let found = null;

      // station hover
      for (const st of stations) {
        const pos = layout[st._id];
        if (!pos) continue;
        if (mx >= pos.x && mx <= pos.x + pos.w && my >= pos.y && my <= pos.y + pos.h) {
          found = { type: "station", id: st._id, x: e.clientX - rect.left, y: e.clientY - rect.top, data: st };
          console.log(found)
          break;
        }
      }

      // track hover
      if (!found) {
        for (const sec of sections) {
          const tracks = tracksBySection[sec._id] || [];
          const sPos = layout[sec.startStation?._id];
          const ePos = layout[sec.endStation?._id];
          if (!sPos || !ePos) continue;
          const dx = ePos.x + ePos.w / 2 - (sPos.x + sPos.w / 2);
          const dy = ePos.y + ePos.h / 2 - (sPos.y + sPos.h / 2);
          const angle = Math.atan2(dy, dx);

          tracks.forEach((track, i) => {
            const offset = (i - (tracks.length - 1) / 2) * 12;
            const ox = -Math.sin(angle) * offset;
            const oy = Math.cos(angle) * offset;

            const dist = pointLineDistance(
              { x: mx, y: my },
              { x: sPos.x + sPos.w / 2 + ox, y: sPos.y + sPos.h / 2 + oy },
              { x: ePos.x + ePos.w / 2 + ox, y: ePos.y + ePos.h / 2 + oy }
            );

            if (dist < 6) {
              found = {
                type: "track",
                id: track._id,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                data: {
                  _id: track._id,          // <-- keep this
                  trackId: track.trackId,
                  trackType: track.trackType,
                  status: track.status
                }
              };
              // alert(JSON.stringify(found.data))

              console.log(found)
            }

          });
        }
      }

      setHoverInfo(found || null);
    };

    const handleClick = () => {
      if (!hoverInfo) return;
      if (onSelect) onSelect(hoverInfo);
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("click", handleClick);
    return () => {
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [ctxState, layout, stations, sections, hoverInfo, onSelect, pan, scale]);

  const pointLineDistance = (p, a, b) => {
    const A = p.x - a.x, B = p.y - a.y;
    const C = b.x - a.x, D = b.y - a.y;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = lenSq !== 0 ? dot / lenSq : -1;
    let xx, yy;
    if (param < 0) { xx = a.x; yy = a.y; }
    else if (param > 1) { xx = b.x; yy = b.y; }
    else { xx = a.x + param * C; yy = a.y + param * D; }
    const dx = p.x - xx, dy = p.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // pan & zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1.1 : 0.9;
      setScale((prev) => Math.max(0.1, Math.min(5, prev * delta)));
    };

    const handleMouseDown = (e) => { setDragging(true); dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }; };
    const handleMouseMove = (e) => { if (dragging) setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }); };
    const handleMouseUp = () => setDragging(false);

    canvas.addEventListener("wheel", handleWheel);
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [pan, dragging]);



  return (

    <div className="relative">
      <canvas ref={canvasRef} style={{ borderRadius: 12, cursor: dragging ? "grabbing" : "grab" }} />
      {hoverInfo && (
        <div
          className="absolute bg-white/95 p-2 rounded-md shadow-md text-sm pointer-events-none"
          style={{ left: hoverInfo.x + 12, top: hoverInfo.y + 12 }}
        >
          {hoverInfo.type === "station" ? (
            <div>
              <div className="font-bold text-gray-600">{hoverInfo.data.name}</div>
              <div className="text-xs text-gray-600">{hoverInfo.data.code || hoverInfo.data.stationId}</div>
            </div>
          ) : (
            <div>
              <div className="font-bold text-gray-600">Track: {hoverInfo.data.trackId}</div>
            </div>
          )}
          {hoverInfo && hoverInfo.type === "track" && hoverInfo.data ? (
            <div>
              <div className="text-xs text-gray-600">Type: {hoverInfo.data.trackType || "N/A"}</div>
              <div className="text-xs text-gray-600">Status: {hoverInfo.data.status || "N/A"}</div>
            </div>
          ) : null}



        </div>
      )}
    </div>
  );
};

export default MapCanvas;
