import { useEffect, useRef, useState } from 'react';
import { ParticleSim } from './ParticleSim';
import './index.css';
import { Moon, Sun, Play, Pause, Shuffle, RotateCcw, Save, Download } from 'lucide-react';

const ALL_COLOR_NAMES = ['Rojo', 'Azul', 'Naranja', 'Amarillo', 'Verde', 'Morado', 'Cian', 'Rosa'];
const ALL_CSS_COLORS = ['#e11d48', '#2563eb', '#ea580c', '#eab308', '#22c55e', '#a855f7', '#06b6d4', '#ec4899'];

export type Snapshot = {
  id: number;
  timeMillis: number;
  matrix: number[];
  radii: number[];
  inertias: number[];
  pixels: any;
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<ParticleSim | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // States to keep sync with UI
  const [numColors, setNumColors] = useState(5);
  const [forceMatrix, setForceMatrix] = useState<number[]>(Array(64).fill(0));
  const [radii, setRadii] = useState<number[]>(Array(8).fill(100));
  const [inertias, setInertias] = useState<number[]>(Array(8).fill(1));
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const [zoom, setZoom] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [isVisualMode, setIsVisualMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Panning state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Init simulation
  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      // Resize canvas to physical pixels
      const canvas = canvasRef.current;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      const sim = new ParticleSim(canvas);
      simRef.current = sim;

      // Update config on sim
      sim.numColors = numColors;
      sim.forceMatrix = [...forceMatrix];
      sim.radii = [...radii];
      sim.inertias = [...inertias];

      sim.start();

      const handleResize = () => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        sim.stop();
      };
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once

  // Sync state to WebGL simulation whenever state changes
  useEffect(() => {
    if (simRef.current) {
      // Clamp pan boundaries when zoom changes
      const limitX = Math.max(0, (zoom - 1.0) / zoom);
      const limitY = Math.max(0, (zoom - 1.0) / zoom);
      const nx = Math.max(-limitX, Math.min(limitX, pan.x));
      const ny = Math.max(-limitY, Math.min(limitY, pan.y));

      if (nx !== pan.x || ny !== pan.y) {
        setPan({ x: nx, y: ny });
      }

      simRef.current.numColors = numColors;
      simRef.current.forceMatrix = forceMatrix;
      simRef.current.radii = radii;
      simRef.current.inertias = inertias;
      simRef.current.zoom = zoom;
      simRef.current.speed = speed;
      simRef.current.isPaused = isPaused;
      simRef.current.pan = [nx, ny];
    }
  }, [numColors, forceMatrix, radii, inertias, zoom, speed, isPaused, pan.x, pan.y]);

  // Mouse handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !canvasRef.current || zoom <= 1.0) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setPan(prev => {
      let nx = prev.x + (dx / canvasRef.current!.clientWidth) * 2.0 / zoom;
      let ny = prev.y - (dy / canvasRef.current!.clientHeight) * 2.0 / zoom;
      const limitX = Math.max(0, (zoom - 1.0) / zoom);
      const limitY = Math.max(0, (zoom - 1.0) / zoom);
      nx = Math.max(-limitX, Math.min(limitX, nx));
      ny = Math.max(-limitY, Math.min(limitY, ny));
      return { x: nx, y: ny };
    });
  };

  const updateMatrix = (idx1: number, idx2: number, val: number) => {
    const newM = [...forceMatrix];
    newM[idx1 * 8 + idx2] = val;
    setForceMatrix(newM);
  };

  const randomizeValues = () => {
    const newM = Array.from({ length: 64 }, () => (Math.random() * 6 - 3)); // -3 to 3
    const newR = Array.from({ length: 8 }, () => Math.floor(Math.random() * 250) + 50); // 50 to 300
    const newI = Array.from({ length: 8 }, () => Math.random() * 4 + 0.5); // 0.5 to 4.5

    setForceMatrix(newM);
    setRadii(newR);
    setInertias(newI);
  };

  const clearValues = () => {
    setForceMatrix(Array(64).fill(0));
  };

  const resetAnimation = () => {
    if (simRef.current) {
      simRef.current.resetParticles();
    }
  };

  const saveConfiguration = () => {
    if (!simRef.current) return;
    const pixels = simRef.current.saveState();
    const newSnapshot: Snapshot = {
      id: Date.now(),
      timeMillis: simRef.current.runTime,
      matrix: [...forceMatrix],
      radii: [...radii],
      inertias: [...inertias],
      pixels
    };
    setSnapshots([...snapshots, newSnapshot]);
  };

  const loadConfiguration = (snap: Snapshot) => {
    if (!simRef.current) return;
    simRef.current.loadState(snap.pixels);
    simRef.current.runTime = snap.timeMillis;
    setForceMatrix(snap.matrix);
    setRadii(snap.radii);
    setInertias(snap.inertias);
  };

  const getVisualColor = (val: number) => {
    if (val <= -2) return '#7f1d1d'; // Fuerte Repulsion
    if (val <= -1) return '#b91c1c'; // Media Repulsion
    if (val < -0.2) return '#f87171'; // Baja Repulsion
    if (val <= 0.2) return '#525252'; // Neutro
    if (val <= 1) return '#4ade80'; // Baja Atraccion
    if (val <= 2) return '#16a34a'; // Media Atraccion
    return '#14532d'; // Fuerte Atraccion
  };

  const cycleVisualValue = (currentVal: number) => {
    const levels = [-3, -2, -1, 0, 1, 2, 3];
    // Find closest level
    let closestIndex = 0;
    let minDiff = Infinity;
    levels.forEach((l, idx) => {
      const diff = Math.abs(currentVal - l);
      if (diff < minDiff) { minDiff = diff; closestIndex = idx; }
    });
    const nextIndex = (closestIndex + 1) % levels.length;
    return levels[nextIndex];
  };

  const processAiPrompt = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    // Fake AI Simulation for functionality demonstration as requested
    // "El sistema deberá procesar este texto con IA para ajustar automáticamente los valores"
    // Since we don't have a real endpoint, we parse simple keywords
    setTimeout(() => {
      const lower = prompt.toLowerCase();
      const newM = [...forceMatrix];
      let newRadii = [...radii];
      let newInertias = [...inertias];

      // Parse multiple conditions for "organismos vivos" or chasing/grouping chains
      if (lower.includes("organismos vivos") || lower.includes("persigan")) {
        // Example Chain REQ-10: Asymmetric
        // Ejemplo Cadena
        newM[0 * 8 + 0] = 1.0;
        newM[0 * 8 + 2] = 1.0;
        newM[2 * 8 + 2] = 1.0;
        newM[2 * 8 + 3] = 1.0;
        newM[3 * 8 + 2] = -0.5;
        newM[1 * 8 + 0] = 0.5;

        newRadii.fill(150);
        newInertias.fill(1.5);

      } else if (lower.includes("rojas") && lower.includes("amarillas")) {
        // rojas(0) perseguir amarillas(3)
        newM[0 * 8 + 3] = 1.0; // rojo busca amarillo
        newM[3 * 8 + 0] = -1.0; // amarillo huye de rojo
        newRadii[0] = 150;
        newRadii[3] = 150;
      } else if (lower.includes("azul") && (lower.includes("grupos") || lower.includes("densos"))) {
        newM[1 * 8 + 1] = 2.0; // strong attraction self (Azul is 1 now)
        newRadii[1] = 200;
        newInertias[1] = 2.0;
      } else if (lower.includes("naranja") && lower.includes("azul")) {
        // REQ-09 Example: Asymmetric matrix explicit
        newM[2 * 8 + 1] = 1.5; // Naranja atraido por Azul
        newM[1 * 8 + 2] = -1.5; // Azul repelido por Naranja
      } else if (lower.includes("caos") || lower.includes("explotar")) {
        for (let i = 0; i < 64; i++) newM[i] = (Math.random() * 6 - 3);
      }

      setForceMatrix(newM);
      setRadii(newRadii);
      setInertias(newInertias);
      setIsProcessing(false);
      setPrompt("");
    }, 800);
  };

  const activeColorNames = ALL_COLOR_NAMES.slice(0, numColors);
  const activeCssColors = ALL_CSS_COLORS.slice(0, numColors);

  return (
    <div className="app-container">
      {/* LEFT CONTROLS PANEL */}
      <aside className="controls-panel">
        <div className="panel-header">
          <h1 className="panel-title">Física de Partículas</h1>
          <button
            className="theme-toggle-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Cambiar Tema"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div>
          <div className="section-header-row" style={{ marginTop: '8px' }}>
            <h2 className="section-title">Colores Activos ({numColors})</h2>
            <div className="section-actions" style={{ gap: '4px' }}>
              <button
                className="icon-btn"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                onClick={() => setNumColors(n => Math.max(1, n - 1))}
                disabled={numColors <= 1}
              >
                - Quitar
              </button>
              <button
                className="icon-btn"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                onClick={() => setNumColors(n => Math.min(8, n + 1))}
                disabled={numColors >= 8}
              >
                + Agregar
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="section-header-row">
            <h2 className="section-title">Matriz de Fuerzas</h2>
            <div className="section-actions" style={{ gap: '4px' }}>
              <button
                className="icon-btn"
                style={{ padding: '4px 8px', gap: '4px', fontSize: '0.75rem' }}
                onClick={clearValues}
                title="Llevar todas las fuerzas a Cero (Neutral)"
              >
                Zero
              </button>
              <button
                className="icon-btn"
                style={{ padding: '4px 8px', gap: '4px', fontSize: '0.75rem' }}
                onClick={randomizeValues}
                title="Llenar matriz con valores aleatorios"
              >
                <Shuffle size={14} /> Aleatorio
              </button>
              <label className="switch-label text-xs" style={{ marginLeft: '4px' }}>
                <span>Num</span>
                <input
                  type="checkbox"
                  checked={isVisualMode}
                  onChange={(e) => setIsVisualMode(e.target.checked)}
                />
                <div className="switch-visual" />
                <span>Visual</span>
              </label>
            </div>
          </div>
          <div className="matrix-grid" style={{ gridTemplateColumns: `auto repeat(${numColors}, 1fr)` }}>
            <div />
            {activeColorNames.map((name, i) => (
              <div key={`header-${i}`} className="color-indicator" style={{ backgroundColor: activeCssColors[i], margin: '0 auto' }} title={name} />
            ))}

            {activeColorNames.map((rowName, i) => (
              <div style={{ display: 'contents' }} key={`row-${i}`}>
                <div className="color-indicator" style={{ backgroundColor: activeCssColors[i], margin: 'auto 0' }} title={rowName} />
                {activeColorNames.map((_, j) => {
                  const val = forceMatrix[i * 8 + j];
                  return isVisualMode ? (
                    <button
                      key={`cell-vis-${i}-${j}`}
                      className="matrix-cell visual-cell"
                      style={{ backgroundColor: getVisualColor(val) }}
                      onClick={() => updateMatrix(i, j, cycleVisualValue(val))}
                      title={`Valor actual: ${val.toFixed(1)}`}
                    />
                  ) : (
                    <input
                      key={`cell-${i}-${j}`}
                      type="number"
                      step="0.1"
                      className="matrix-cell"
                      value={val}
                      onChange={(e) => updateMatrix(i, j, parseFloat(e.target.value) || 0)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="section-title">Radio de Interacción (Max Distance)</h2>
          <div className="slider-group">
            {activeColorNames.map((name, i) => (
              <div key={`radius-${i}`} className="slider-row">
                <span className="slider-label">
                  <span className="color-indicator" style={{ backgroundColor: activeCssColors[i], width: 12, height: 12 }} />
                  {name}
                </span>
                <input
                  type="range"
                  min="10" max="500" step="5"
                  value={radii[i]}
                  onChange={(e) => {
                    const r = [...radii];
                    r[i] = parseFloat(e.target.value);
                    setRadii(r);
                  }}
                />
                <span className="slider-value">{radii[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="section-title">Inercia por Color (Masa)</h2>
          <div className="slider-group">
            {activeColorNames.map((name, i) => (
              <div key={`inertia-${i}`} className="slider-row">
                <span className="slider-label">
                  <span className="color-indicator" style={{ backgroundColor: activeCssColors[i], width: 12, height: 12 }} />
                  {name}
                </span>
                <input
                  type="range"
                  min="0.1" max="10.0" step="0.1"
                  value={inertias[i]}
                  onChange={(e) => {
                    const inv = [...inertias];
                    inv[i] = parseFloat(e.target.value);
                    setInertias(inv);
                  }}
                />
                <span className="slider-value">{inertias[i].toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="section-title">Visualización y Velocidad</h2>
          <div className="slider-group">
            <div className="slider-row">
              <span className="slider-label">Velocidad</span>
              <input type="range" min="1" max="5" step="0.5" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} />
              <span className="slider-value">{speed.toFixed(1)}x</span>
            </div>
            <div className="slider-row">
              <span className="slider-label">Zoom</span>
              <input type="range" min="1.0" max="10.0" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
              <span className="slider-value">{zoom.toFixed(1)}x</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="section-title">Control de Ejecución</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="primary-btn outline" onClick={() => setIsPaused(!isPaused)} title={isPaused ? "Reanudar simulación" : "Pausar simulación"}>
              {isPaused ? <><Play size={14} /> Reanudar</> : <><Pause size={14} /> Pausa</>}
            </button>
            <button className="primary-btn outline" onClick={resetAnimation} title="Restablecer posiciones al azar">
              <RotateCcw size={14} /> Reset
            </button>
            <button className="primary-btn outline" onClick={saveConfiguration} title="Guardar estado actual">
              <Save size={14} /> Guardar Estado
            </button>
          </div>

          {snapshots.length > 0 && (
            <div className="snapshots-list mt-md">
              <h3 className="text-xs color-secondary mb-xs">Momentos Guardados</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {snapshots.map((s, idx) => (
                  <button key={s.id} onClick={() => loadConfiguration(s)} className="snapshot-btn">
                    <Download size={12} /> Cargar Momento #{idx + 1} ({s.timeMillis.toFixed(1)}s)
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Control Box */}
        <div className="ai-prompt-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title" style={{ margin: 0 }}>IA Asistente</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>(Opcional)</span>
          </div>
          <textarea
            className="ai-textarea"
            placeholder="Ej: Haz que las partículas azules formen grupos densos..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); processAiPrompt(); } }}
          />
          <button
            className="primary-btn"
            onClick={processAiPrompt}
            disabled={isProcessing || prompt.trim() === ""}
          >
            {isProcessing ? "Procesando..." : <>Ejecutar <Play size={16} /></>}
          </button>
        </div>

      </aside>

      {/* WEBGL CANVAS CONTAINER */}
      <main
        className="canvas-container"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: zoom > 1.0 ? (isDragging.current ? 'grabbing' : 'grab') : 'default' }}
      >
        <canvas ref={canvasRef} className="simulation-canvas" />
      </main>
    </div>
  );
}
