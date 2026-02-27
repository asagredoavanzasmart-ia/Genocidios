import React, { useRef, useState, useCallback, useEffect } from 'react';
import { toJpeg } from 'html-to-image';
import { Download, RefreshCw, RotateCcw, Box, Circle, ChevronDown } from 'lucide-react';
import { GENOCIDE_DATA } from '../constants';
import { Sphere3D } from './Sphere3D';
import { InfoCard } from './InfoCard';

export const ComparisonTool: React.FC = () => {
    const [leftId, setLeftId] = useState<string>('holocaust');
    const [rightId, setRightId] = useState<string>('rwanda');
    const [isExporting, setIsExporting] = useState(false);
    const [shape, setShape] = useState<'cube' | 'sphere'>('sphere');

    // State for controlling the 3D Scenes
    const [resetTrigger, setResetTrigger] = useState(0);

    // Unified Zoom State. Default increased by 60% (1.6)
    const [zoomLevel, setZoomLevel] = useState(1.6);

    const exportRef = useRef<HTMLDivElement>(null);

    const leftData = GENOCIDE_DATA.find(g => g.id === leftId) || GENOCIDE_DATA[0];
    const rightData = GENOCIDE_DATA.find(g => g.id === rightId) || GENOCIDE_DATA[1];

    // Calculate the shared scale maximum. Both graphs will use this to set their camera distance.
    const maxComparisonDeaths = Math.max(leftData.deaths, rightData.deaths);

    // Auto-reset zoom when selection changes to maintain comparative scale
    useEffect(() => {
        setResetTrigger(prev => prev + 1);
        // Reset to default zoom (1.6) when changing comparison
        setZoomLevel(1.6);
    }, [leftId, rightId]);

    const handleManualReset = () => {
        setResetTrigger(prev => prev + 1);
        setZoomLevel(1.6);
    };

    // Exponential helpers to make the zoom slider linear visually but exponential technically
    const MIN_ZOOM = Math.log(0.5);
    const MAX_ZOOM = Math.log(1000.0);

    const getSliderValue = (zoom: number) => {
        const currentZ = Math.log(Math.max(0.5, Math.min(zoom, 1000.0)));
        return 100 * ((currentZ - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM));
    };

    // Slider change handler
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const x = parseFloat(e.target.value);
        // Convert the 0-100 linear value to an exponential zoom value
        const newZoom = Math.exp(MIN_ZOOM + (x / 100) * (MAX_ZOOM - MIN_ZOOM));
        setZoomLevel(newZoom);
    };

    // Unified Mouse Wheel Handler for both canvases
    const handleWheel = useCallback((e: React.WheelEvent) => {
        // Exponencial zoom sensitivity for wheel scrolling (percentage based change)
        const delta = -e.deltaY * 0.002;
        setZoomLevel(prev => Math.min(Math.max(prev + (delta * prev), 0.5), 1000.0));
    }, []);

    const downloadImage = useCallback(() => {
        if (exportRef.current === null) {
            return;
        }
        setIsExporting(true);

        setTimeout(() => {
            if (!exportRef.current) return;
            toJpeg(exportRef.current, { quality: 0.95, backgroundColor: '#f8fafc' })
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = `comparativa-${leftData.name}-vs-${rightData.name}.jpg`;
                    link.href = dataUrl;
                    link.click();
                    setIsExporting(false);
                })
                .catch((err) => {
                    console.error('Error generating image', err);
                    setIsExporting(false);
                });
        }, 100);
    }, [leftData.name, rightData.name]);

    // Use Spanish formatting (dots for thousands, no decimals for integers)
    const numberFormatter = new Intl.NumberFormat('es-ES');

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8">

            {/* Header - Just Title and Description now */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <span className="bg-gradient-to-r from-red-600 to-orange-600 text-transparent bg-clip-text">
                            Catástrofes Demográficas
                        </span>
                    </h1>
                    <p className="text-slate-600 mt-2 max-w-xl text-sm leading-relaxed">
                        Selecciona los eventos a comparar y utiliza los controles para comparar los gráficos.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div
                ref={exportRef}
                className="bg-white p-4 md:p-10 rounded-2xl border border-slate-200 shadow-xl relative"
            >
                {/* CONTROLS TOOLBAR - Located directly above graphs */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-slate-100/80 p-3 md:p-4 rounded-xl border border-slate-200 backdrop-blur-sm">

                    {/* Left: Shape Toggle */}
                    <div className="flex items-center gap-1 md:gap-2 bg-slate-200/50 rounded-lg p-1 border border-slate-200 w-full md:w-auto justify-center">
                        <button
                            onClick={() => setShape('cube')}
                            className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${shape === 'cube' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Box size={14} /> Cubo
                        </button>
                        <button
                            onClick={() => setShape('sphere')}
                            className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${shape === 'sphere' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Circle size={14} /> Esfera
                        </button>
                    </div>

                    {/* Center/Right: Zoom Slider & Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto md:flex-1 md:justify-end">
                        {/* Slider Control */}
                        <div className="flex w-full items-center gap-3 sm:max-w-xs bg-white/50 px-3 py-2 rounded-lg border border-slate-200/50 shadow-sm">
                            <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">Zoom</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="any"
                                value={getSliderValue(zoomLevel)}
                                onChange={handleSliderChange}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600 hover:accent-red-500"
                            />
                        </div>

                        <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                            <button
                                onClick={handleManualReset}
                                className="p-1.5 md:p-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg transition-colors border border-slate-200 shadow-sm"
                                title="Restaurar vista por defecto"
                            >
                                <RotateCcw size={14} className="md:w-4 md:h-4" />
                            </button>
                            <button
                                onClick={downloadImage}
                                disabled={isExporting}
                                className="p-1.5 md:p-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg transition-colors border border-slate-200 hover:border-red-200 shadow-sm"
                                title="Descargar imagen"
                            >
                                {isExporting ? <RefreshCw className="animate-spin md:w-4 md:h-4" size={14} /> : <Download size={14} className="md:w-4 md:h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Visualization Section */}
                <div className="mb-8 md:mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8">
                        {/* Left Side */}
                        <div className="flex flex-col gap-3 md:gap-4 w-full">
                            {/* Selector */}
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-500">
                                    <ChevronDown size={16} className="md:w-5 md:h-5" />
                                </div>
                                <select
                                    value={leftId}
                                    onChange={(e) => setLeftId(e.target.value)}
                                    className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-900 font-bold text-xs md:text-xl py-2 md:py-3 pl-2 md:pl-4 pr-8 md:pr-10 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors truncate"
                                >
                                    {GENOCIDE_DATA.map((item) => (
                                        <option key={item.id} value={item.id} className="bg-white text-slate-900">
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Canvas */}
                            <div
                                onWheel={handleWheel}
                                className="h-[200px] md:h-[350px] w-full bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl border border-slate-200 overflow-hidden relative shadow-inner-glow group"
                            >
                                <Sphere3D
                                    deaths={leftData.deaths}
                                    color={leftData.color}
                                    maxComparisonDeaths={maxComparisonDeaths}
                                    resetTrigger={resetTrigger}
                                    zoomLevel={zoomLevel}
                                    shape={shape}
                                />
                            </div>

                            {/* Stats */}
                            <div className="text-center group w-full">
                                <div className="text-xl md:text-5xl font-black tracking-tighter drop-shadow-sm transition-transform duration-500" style={{ color: leftData.color }}>
                                    {numberFormatter.format(leftData.deaths)}
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 uppercase font-semibold mt-1">Muertes Estimadas</p>
                                <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent mt-2 md:mt-4"></div>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col gap-3 md:gap-4 w-full">
                            {/* Selector */}
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-500">
                                    <ChevronDown size={16} className="md:w-5 md:h-5" />
                                </div>
                                <select
                                    value={rightId}
                                    onChange={(e) => setRightId(e.target.value)}
                                    className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-900 font-bold text-xs md:text-xl py-2 md:py-3 pl-2 md:pl-4 pr-8 md:pr-10 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors truncate"
                                >
                                    {GENOCIDE_DATA.map((item) => (
                                        <option key={item.id} value={item.id} className="bg-white text-slate-900">
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Canvas */}
                            <div
                                onWheel={handleWheel}
                                className="h-[200px] md:h-[350px] w-full bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl border border-slate-200 overflow-hidden relative shadow-inner-glow group"
                            >
                                <Sphere3D
                                    deaths={rightData.deaths}
                                    color={rightData.color}
                                    maxComparisonDeaths={maxComparisonDeaths}
                                    resetTrigger={resetTrigger}
                                    zoomLevel={zoomLevel}
                                    shape={shape}
                                />
                            </div>

                            {/* Stats */}
                            <div className="text-center group w-full">
                                <div className="text-xl md:text-5xl font-black tracking-tighter drop-shadow-sm transition-transform duration-500" style={{ color: rightData.color }}>
                                    {numberFormatter.format(rightData.deaths)}
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 uppercase font-semibold mt-1">Muertes Estimadas</p>
                                <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent mt-2 md:mt-4"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
                    <InfoCard data={leftData} />
                    <InfoCard data={rightData} />
                </div>
            </div>

            <div className="text-center space-y-2 pb-8">
                <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">
                    Nota de Escala
                </p>
                <p className="text-slate-600 text-sm max-w-2xl mx-auto">
                    Las nubes de puntos 3D se generan proceduralmente. El tamaño de cada nube representa matemáticamente el volumen total de víctimas. Al cambiar la selección, la cámara se recalibra para mantener la proporción visual correcta entre ambas tragedias.
                </p>
            </div>

        </div>
    );
};