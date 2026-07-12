import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, ClipboardPaste, Download, Eye, EyeOff, Grid2X2, ImagePlus, Pause, Play, RotateCcw, RotateCw, ShieldCheck, Upload, X } from 'lucide-react';
import defaultFront from '../assets/body front.png';
import defaultBack from '../assets/body back.png';
import defaultLeft from '../assets/body left side.png';
import defaultRight from '../assets/body right side.png';
import {
  BODY_VIEWS,
  TURNTABLE_VIEWS,
  downloadCanvas,
  downloadSource,
  inspectBodySheet,
  inspectHeadSheet,
  loadImage,
  releaseImage,
  renderBodyPreview,
  validateSpriteSheet,
} from './bodyGeneratorBackend.js';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPE = /^image\/(png|jpeg|webp)$/;
const PREVIEW_SETTINGS_KEY = 'graalBodyPreviewSettings:v1';
const DEFAULT_PREVIEW_SETTINGS = {
  zoom: 5,
  background: 'cream',
  showHead: true,
  cleanBackground: true,
  previewMode: 'turntable',
  headScale: 1,
  headOffsetX: 0,
  headOffsetY: 0,
};
const BACKGROUND_OPTIONS = [
  { value: 'cream', label: 'Cream' },
  { value: 'sage', label: 'Sage' },
  { value: 'teal', label: 'Teal' },
  { value: 'transparent', label: 'Transparent' },
];

const DEFAULT_CHARACTER_VIEWS = [
  { id: 'front', label: 'Front', url: defaultFront },
  { id: 'back', label: 'Back', url: defaultBack },
  { id: 'left', label: 'Left', url: defaultLeft },
  { id: 'right', label: 'Right', url: defaultRight },
];

const DEFAULT_CHARACTER_BY_ID = new Map(DEFAULT_CHARACTER_VIEWS.map((view) => [view.id, view]));

function loadPreviewSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(PREVIEW_SETTINGS_KEY) || 'null');
    if (!stored) return DEFAULT_PREVIEW_SETTINGS;
    return {
      zoom: [2, 3, 4, 5].includes(Number(stored.zoom)) ? Number(stored.zoom) : 5,
      background: BACKGROUND_OPTIONS.some((option) => option.value === stored.background) ? stored.background : 'cream',
      showHead: stored.showHead !== false,
      cleanBackground: stored.cleanBackground !== false,
      previewMode: stored.previewMode === 'grid' ? 'grid' : 'turntable',
      headScale: Math.min(1.25, Math.max(0.75, Number(stored.headScale) || 1)),
      headOffsetX: Math.min(8, Math.max(-8, Number(stored.headOffsetX) || 0)),
      headOffsetY: Math.min(8, Math.max(-8, Number(stored.headOffsetY) || 0)),
    };
  } catch {
    return DEFAULT_PREVIEW_SETTINGS;
  }
}

function savePreviewSettings(settings) {
  try { localStorage.setItem(PREVIEW_SETTINGS_KEY, JSON.stringify(settings)); } catch { /* Storage may be unavailable. */ }
}

function detectSpriteType(image) {
  if (inspectBodySheet(image).isStandardLayout) return 'body';
  if (inspectHeadSheet(image).isStandardLayout) return 'head';
  return null;
}

function clipboardFilename(type, mimeType) {
  const extension = mimeType === 'image/jpeg' ? 'jpg' : mimeType.split('/')[1] || 'png';
  return `pasted-${type}-${Date.now()}.${extension}`;
}

function wrapDirection(index) {
  return ((index % TURNTABLE_VIEWS.length) + TURNTABLE_VIEWS.length) % TURNTABLE_VIEWS.length;
}

function SpriteUpload({ type, upload, info, error, onSelect, onClear }) {
  const isBody = type === 'body';
  const title = isBody ? '1. Upload body sheet' : '2. Add head sheet';
  const description = isBody ? 'Required - standard 128 x 720' : 'Optional - standard 32 x 560';
  const prompt = isBody ? 'Choose body sheet' : 'Choose head sheet';

  return (
    <div className="rounded-xl border border-[#D7E9D7] bg-[#F8FBF5] p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-0.5 text-xs text-[#659287]">{description}</p>
        </div>
        {!isBody ? <span className="rounded-full bg-[#E6F2DD] px-2 py-1 text-[10px] font-semibold text-[#527A70]">Preview fit</span> : null}
      </div>

      {!upload ? (
        <label className="mt-3 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#88BDA4] bg-white p-4 text-center transition-colors hover:bg-[#E6F2DD]">
          <ImagePlus size={24} className="text-[#659287]" aria-hidden="true" />
          <span className="mt-2 text-xs font-semibold">{prompt}</span>
          <span className="mt-1 text-[11px] text-[#659287]">PNG recommended - max 10 MB</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => {
              onSelect(event.target.files[0], type);
              event.target.value = '';
            }}
          />
        </label>
      ) : (
        <div className="mt-3 rounded-lg border border-[#D7E9D7] bg-white p-2.5">
          <div className="flex items-start gap-2.5">
            <img
              src={upload.url}
              alt={`Uploaded ${type} sprite sheet`}
              decoding="async"
              className={`min-w-0 flex-1 rounded-md bg-[#F8FBF5] object-contain [image-rendering:pixelated] ${isBody ? 'h-40' : 'h-32'}`}
            />
            <button type="button" onClick={() => onClear(type)} className="rounded-lg p-2 text-red-700 hover:bg-red-50" aria-label={`Remove ${type} sprite sheet`}><X size={17} /></button>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-[#527A70]">
            <span className="max-w-44 truncate font-semibold sm:max-w-64">{upload.name}</span>
            <span className="shrink-0">{info.width} x {info.height}</span>
          </div>
          <p className={`mt-2 flex items-start gap-1.5 text-[11px] leading-4 ${info.isStandardLayout ? 'text-[#527A70]' : 'text-amber-700'}`}>
            {info.isStandardLayout ? <Check size={13} className="mt-0.5 shrink-0" aria-hidden="true" /> : null}
            {info.isStandardLayout
              ? `Standard ${type} layout detected.`
              : `Custom dimensions detected. The standard ${type} frame mapping will be used.`}
          </p>
        </div>
      )}

      {error ? <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700" role="alert">{error}</p> : null}
    </div>
  );
}

export default function BodyUploadGenerator() {
  const [initialSettings] = useState(loadPreviewSettings);
  const canvasRef = useRef(null);
  const objectUrlsRef = useRef({ body: '', head: '' });
  const selectionVersionsRef = useRef({ body: 0, head: 0 });
  const pasteVersionRef = useRef(0);
  const renderVersionRef = useRef(0);
  const dragRef = useRef(null);
  const [bodyUpload, setBodyUpload] = useState(null);
  const [headUpload, setHeadUpload] = useState(null);
  const [bodyInfo, setBodyInfo] = useState(null);
  const [headInfo, setHeadInfo] = useState(null);
  const [errors, setErrors] = useState({ body: '', head: '', preview: '' });
  const [zoom, setZoom] = useState(initialSettings.zoom);
  const [background, setBackground] = useState(initialSettings.background);
  const [showHead, setShowHead] = useState(initialSettings.showHead);
  const [cleanBackground, setCleanBackground] = useState(initialSettings.cleanBackground);
  const [previewMode, setPreviewMode] = useState(initialSettings.previewMode);
  const [headScale, setHeadScale] = useState(initialSettings.headScale);
  const [headOffsetX, setHeadOffsetX] = useState(initialSettings.headOffsetX);
  const [headOffsetY, setHeadOffsetY] = useState(initialSettings.headOffsetY);
  const [directionIndex, setDirectionIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [status, setStatus] = useState('idle');
  const [pasteFeedback, setPasteFeedback] = useState({ tone: 'neutral', message: '' });

  useEffect(() => {
    if (!bodyUpload?.url || !canvasRef.current) return undefined;

    const renderVersion = ++renderVersionRef.current;
    setStatus('processing');
    setErrors((current) => ({ ...current, preview: '' }));
    renderBodyPreview(canvasRef.current, bodyUpload.url, headUpload?.url, {
      row: 0,
      zoom,
      background,
      showHead,
      cleanBackground,
      layout: previewMode,
      directionIndex,
      headScale,
      headOffsetX,
      headOffsetY,
    })
      .then(() => {
        if (renderVersion === renderVersionRef.current) setStatus('ready');
      })
      .catch(() => {
        if (renderVersion === renderVersionRef.current) {
          setErrors((current) => ({ ...current, preview: 'The local character preview could not be rendered. Try another image.' }));
          setStatus('error');
        }
      });

    return () => {
      renderVersionRef.current += 1;
    };
  }, [background, bodyUpload?.url, cleanBackground, directionIndex, headOffsetX, headOffsetY, headScale, headUpload?.url, previewMode, showHead, zoom]);

  useEffect(() => {
    savePreviewSettings({ zoom, background, showHead, cleanBackground, previewMode, headScale, headOffsetX, headOffsetY });
  }, [background, cleanBackground, headOffsetX, headOffsetY, headScale, previewMode, showHead, zoom]);

  useEffect(() => {
    if (!autoRotate || previewMode !== 'turntable') return undefined;
    const intervalId = window.setInterval(() => {
      setDirectionIndex((current) => wrapDirection(current + 1));
    }, 900);
    return () => window.clearInterval(intervalId);
  }, [autoRotate, previewMode]);

  useEffect(() => () => {
    Object.values(objectUrlsRef.current).forEach((url) => {
      if (url) {
        releaseImage(url);
        URL.revokeObjectURL(url);
      }
    });
  }, []);

  const selectFile = useCallback(async (file, requestedType) => {
    const isAutomatic = requestedType === 'auto';
    const automaticVersion = isAutomatic ? ++pasteVersionRef.current : 0;
    const explicitVersion = isAutomatic ? 0 : ++selectionVersionsRef.current[requestedType];

    if (!isAutomatic) setErrors((current) => ({ ...current, [requestedType]: '' }));
    setPasteFeedback({ tone: 'neutral', message: '' });

    if (!file || !ACCEPTED_IMAGE_TYPE.test(file.type)) {
      if (isAutomatic) {
        setPasteFeedback({ tone: 'error', message: 'The clipboard does not contain a supported PNG, JPG, or WebP image.' });
      } else {
        setErrors((current) => ({ ...current, [requestedType]: `Upload a PNG, JPG, or WebP ${requestedType} sprite sheet.` }));
      }
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      if (isAutomatic) {
        setPasteFeedback({ tone: 'error', message: 'The copied image must be 10 MB or smaller.' });
      } else {
        setErrors((current) => ({ ...current, [requestedType]: 'The sprite sheet must be 10 MB or smaller.' }));
      }
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    let resolvedType = requestedType;
    let version = explicitVersion;
    try {
      const image = await loadImage(nextUrl);
      if (isAutomatic) {
        if (automaticVersion !== pasteVersionRef.current) {
          releaseImage(nextUrl);
          URL.revokeObjectURL(nextUrl);
          return;
        }
        resolvedType = detectSpriteType(image);
        if (!resolvedType) {
          throw new Error('The copied image is not a standard Graal body or head sheet. Body must be 128 x 720 and head must be 32 x 560.');
        }
        version = ++selectionVersionsRef.current[resolvedType];
      }

      const validation = validateSpriteSheet(image, resolvedType);
      if (!validation.valid) throw new Error(validation.reason);
      const { info } = validation;

      if (version !== selectionVersionsRef.current[resolvedType]) {
        releaseImage(nextUrl);
        URL.revokeObjectURL(nextUrl);
        return;
      }

      const previousUrl = objectUrlsRef.current[resolvedType];
      if (previousUrl) {
        releaseImage(previousUrl);
        URL.revokeObjectURL(previousUrl);
      }
      objectUrlsRef.current[resolvedType] = nextUrl;
      const name = isAutomatic ? clipboardFilename(resolvedType, file.type) : file.name;

      if (resolvedType === 'body') {
        setBodyUpload({ url: nextUrl, name });
        setBodyInfo(info);
      } else {
        setHeadUpload({ url: nextUrl, name });
        setHeadInfo(info);
        setShowHead(true);
      }
      setStatus('processing');
      if (isAutomatic) {
        setPasteFeedback({ tone: 'success', message: `Copied image detected and added as the ${resolvedType} sheet.` });
      }
    } catch (fileError) {
      releaseImage(nextUrl);
      URL.revokeObjectURL(nextUrl);
      if (isAutomatic) {
        if (automaticVersion === pasteVersionRef.current) {
          setPasteFeedback({ tone: 'error', message: fileError instanceof Error ? fileError.message : 'The copied image could not be read.' });
        }
      } else if (version === selectionVersionsRef.current[resolvedType]) {
        setErrors((current) => ({
          ...current,
          [resolvedType]: fileError instanceof Error ? fileError.message : `The uploaded ${resolvedType} image could not be read.`,
        }));
      }
    }
  }, []);

  useEffect(() => {
    const handlePaste = (event) => {
      const imageItem = Array.from(event.clipboardData?.items || []).find((item) => item.type.startsWith('image/'));
      const imageFile = imageItem?.getAsFile();
      if (!imageFile) return;

      event.preventDefault();
      selectFile(imageFile, 'auto');
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [selectFile]);

  const pasteFromClipboard = async () => {
    if (!navigator.clipboard?.read) {
      setPasteFeedback({ tone: 'error', message: 'Clipboard button access is unavailable here. Copy the image, then press Ctrl+V on this page.' });
      return;
    }

    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((type) => ACCEPTED_IMAGE_TYPE.test(type));
        if (!imageType) continue;
        const blob = await item.getType(imageType);
        await selectFile(new File([blob], 'clipboard-image', { type: imageType }), 'auto');
        return;
      }
      setPasteFeedback({ tone: 'error', message: 'No supported image was found in the clipboard.' });
    } catch {
      setPasteFeedback({ tone: 'error', message: 'Clipboard permission was blocked. Copy the image again, then press Ctrl+V on this page.' });
    }
  };

  const clearUpload = (type) => {
    selectionVersionsRef.current[type] += 1;
    const url = objectUrlsRef.current[type];
    if (url) {
      releaseImage(url);
      URL.revokeObjectURL(url);
    }
    objectUrlsRef.current[type] = '';
    renderVersionRef.current += 1;
    setErrors((current) => ({ ...current, [type]: '', preview: '' }));

    if (type === 'body') {
      setBodyUpload(null);
      setBodyInfo(null);
      setStatus('idle');
      setAutoRotate(false);
    } else {
      setHeadUpload(null);
      setHeadInfo(null);
      setShowHead(true);
      setHeadScale(1);
      setHeadOffsetX(0);
      setHeadOffsetY(0);
    }
  };

  const resetPreview = () => {
    setZoom(5);
    setBackground('cream');
    setShowHead(true);
    setCleanBackground(true);
    setPreviewMode('turntable');
    setHeadScale(1);
    setHeadOffsetX(0);
    setHeadOffsetY(0);
    setDirectionIndex(0);
    setAutoRotate(false);
  };

  const rotateDirection = (step) => {
    setAutoRotate(false);
    setDirectionIndex((current) => wrapDirection(current + step));
  };

  const handlePointerDown = (event) => {
    if (previewMode !== 'turntable') return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startX: event.clientX, startDirection: directionIndex };
    setAutoRotate(false);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current || previewMode !== 'turntable') return;
    const distance = dragRef.current.startX - event.clientX;
    const steps = Math.trunc(distance / 44);
    setDirectionIndex(wrapDirection(dragRef.current.startDirection + steps));
  };

  const stopDragging = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
  };

  const handlePreviewKeyDown = (event) => {
    if (previewMode !== 'turntable') return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      rotateDirection(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      rotateDirection(1);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E6F2DD] text-[#29453E]">
      <section className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="border-b border-[#B1D3B9] pb-6 sm:pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#659287]">Local character preview</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#527A70]"><ShieldCheck size={13} aria-hidden="true" /> Free and private</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-4xl">Body and Head Preview</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#527A70] sm:mt-3 sm:text-base">
            Upload a body and an optional head sheet to check how they look together in all four directions. Everything runs instantly inside your browser.
          </p>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <section className="order-1 rounded-xl border border-[#B1D3B9] bg-white p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#E6F2DD] text-[#659287]"><Upload size={19} aria-hidden="true" /></span>
              <div><h2 className="font-semibold">Build your preview</h2><p className="text-xs text-[#659287]">Use transparent PNG sprite sheets for the cleanest result</p></div>
            </div>
            <button type="button" onClick={pasteFromClipboard} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#88BDA4] bg-[#F8FBF5] px-4 py-2.5 text-sm font-semibold text-[#527A70] hover:bg-[#E6F2DD]">
              <ClipboardPaste size={17} aria-hidden="true" /> Paste copied image
              <kbd className="hidden rounded border border-[#B1D3B9] bg-white px-1.5 py-0.5 text-[10px] font-semibold sm:inline">Ctrl+V</kbd>
            </button>
            <p className="mt-2 text-center text-[11px] leading-4 text-[#659287]">Body or head is detected automatically from the image dimensions.</p>
            {pasteFeedback.message ? (
              <p className={`mt-2 rounded-lg px-3 py-2 text-xs font-medium ${pasteFeedback.tone === 'success' ? 'bg-[#E6F2DD] text-[#527A70]' : 'bg-red-50 text-red-700'}`} role="status">{pasteFeedback.message}</p>
            ) : null}
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <SpriteUpload type="body" upload={bodyUpload} info={bodyInfo} error={errors.body} onSelect={selectFile} onClear={clearUpload} />
              <SpriteUpload type="head" upload={headUpload} info={headInfo} error={errors.head} onSelect={selectFile} onClear={clearUpload} />
            </div>
          </section>

          <section className="order-2 h-fit rounded-xl border border-[#B1D3B9] bg-white p-4 sm:p-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-24">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="font-semibold">{previewMode === 'turntable' ? 'Interactive 360 preview' : 'Four-view comparison'}</h2><p className="mt-1 text-sm text-[#527A70]">{previewMode === 'turntable' ? 'Drag or swipe the character to rotate' : 'Front - Back - Left - Right'}</p></div>
              {bodyUpload ? (
                <button type="button" disabled={status !== 'ready'} onClick={() => downloadCanvas(canvasRef.current, previewMode === 'turntable' ? `graal-character-${TURNTABLE_VIEWS[directionIndex].id}.png` : 'graal-character-four-views.png')} className="inline-flex items-center gap-2 rounded-lg border border-[#88BDA4] px-3 py-2 text-xs font-semibold text-[#527A70] hover:bg-[#E6F2DD] disabled:cursor-wait disabled:opacity-50"><Download size={15} aria-hidden="true" /> Download preview</button>
              ) : null}
            </div>

            <div className="mt-4 grid grid-cols-2 rounded-lg bg-[#E6F2DD] p-1 text-xs font-semibold">
              <button type="button" onClick={() => setPreviewMode('turntable')} className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 ${previewMode === 'turntable' ? 'bg-white text-[#29453E] shadow-sm' : 'text-[#659287] hover:text-[#29453E]'}`}><RotateCw size={15} aria-hidden="true" /> 360 turntable</button>
              <button type="button" onClick={() => { setPreviewMode('grid'); setAutoRotate(false); }} className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 ${previewMode === 'grid' ? 'bg-white text-[#29453E] shadow-sm' : 'text-[#659287] hover:text-[#29453E]'}`}><Grid2X2 size={15} aria-hidden="true" /> Four views</button>
            </div>

            <div
              className={`relative mt-3 aspect-square overflow-hidden rounded-xl border border-[#D7E9D7] bg-[#F8FBF5] ${previewMode === 'turntable' ? 'cursor-grab touch-none select-none active:cursor-grabbing' : ''}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
              onKeyDown={handlePreviewKeyDown}
              tabIndex={previewMode === 'turntable' ? 0 : -1}
              aria-label={previewMode === 'turntable' ? 'Interactive character turntable. Drag, swipe, or use arrow keys to rotate.' : 'Four-direction character preview.'}
            >
              {bodyUpload ? <canvas ref={canvasRef} className="pointer-events-none size-full [image-rendering:pixelated]" aria-hidden="true" /> : previewMode === 'turntable' ? (
                <div className="size-full bg-[radial-gradient(circle_at_center,_white_0%,_#F8FBF5_68%)] p-10 sm:p-14">
                  <img src={DEFAULT_CHARACTER_BY_ID.get(TURNTABLE_VIEWS[directionIndex].id).url} alt="" decoding="async" className="size-full object-contain [image-rendering:pixelated]" />
                </div>
              ) : (
                <div className="grid size-full grid-cols-2 gap-px bg-[#D7E9D7]">
                  {DEFAULT_CHARACTER_VIEWS.map((view) => <div key={view.id} className="overflow-hidden bg-[#F8FBF5] p-3 sm:p-5"><img src={view.url} alt="" loading="lazy" decoding="async" className="size-full object-contain [image-rendering:pixelated]" /></div>)}
                </div>
              )}

              {!bodyUpload ? <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#527A70] shadow-sm">Sample character</span> : null}

              {previewMode === 'grid' ? (
                <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2">
                  {BODY_VIEWS.map((view) => <div key={view.id} className="relative border-[0.5px] border-[#B1D3B9]/60"><span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#527A70] shadow-sm">{view.label}</span></div>)}
                </div>
              ) : (
                <>
                  <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); rotateDirection(-1); }} className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#B1D3B9] bg-white/90 text-[#527A70] shadow-sm hover:bg-white" aria-label="Rotate left"><ChevronLeft size={20} /></button>
                  <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); rotateDirection(1); }} className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#B1D3B9] bg-white/90 text-[#527A70] shadow-sm hover:bg-white" aria-label="Rotate right"><ChevronRight size={20} /></button>
                  <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-2">
                    <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#527A70] shadow-sm">{TURNTABLE_VIEWS[directionIndex].label}</span>
                    <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); setAutoRotate((playing) => !playing); }} className="flex size-8 items-center justify-center rounded-full border border-[#B1D3B9] bg-white/90 text-[#527A70] shadow-sm hover:bg-white" aria-label={autoRotate ? 'Pause automatic rotation' : 'Start automatic rotation'}>{autoRotate ? <Pause size={14} /> : <Play size={14} />}</button>
                  </div>
                </>
              )}

              {bodyUpload && status === 'processing' ? <div className="absolute inset-0 flex items-center justify-center bg-white/65 text-sm font-semibold text-[#527A70]" role="status">Updating preview...</div> : null}
            </div>

            {errors.preview ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">{errors.preview}</p> : null}
            <div className="mt-4 rounded-lg bg-[#E6F2DD] p-3 text-xs leading-5 text-[#527A70]"><strong className="text-[#29453E]">360 sprite turntable:</strong> this rotates through the four real in-game directions without inventing details between frames. Solid sheet backgrounds are cleaned locally before assembly.</div>
          </section>

          <section className="order-3 rounded-xl border border-[#B1D3B9] bg-white p-4 sm:p-5 lg:col-start-1">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="font-semibold">Preview controls</h2><p className="mt-1 text-sm text-[#527A70]">Changes update instantly.</p></div>
              <button type="button" onClick={resetPreview} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#527A70] hover:bg-[#E6F2DD]"><RotateCcw size={14} aria-hidden="true" /> Reset</button>
            </div>

            <fieldset disabled={!bodyUpload} className="mt-4 space-y-4 disabled:opacity-50">
              {headUpload ? (
                <div className="space-y-4 rounded-lg border border-[#B1D3B9] p-3">
                  <button type="button" onClick={() => setShowHead((visible) => !visible)} className="flex w-full items-center justify-between rounded-md text-sm font-semibold">
                    <span>{showHead ? 'Head is visible' : 'Head is hidden'}</span>
                    {showHead ? <Eye size={17} aria-hidden="true" /> : <EyeOff size={17} aria-hidden="true" />}
                  </button>
                  <div className={showHead ? 'space-y-4' : 'pointer-events-none opacity-45'} aria-disabled={!showHead}>
                    <label className="block">
                      <span className="flex items-center justify-between text-xs font-semibold"><span>Head size</span><span className="text-[#659287]">{Math.round(headScale * 100)}%</span></span>
                      <input type="range" min="0.75" max="1.25" step="0.05" value={headScale} onChange={(event) => setHeadScale(Number(event.target.value))} className="mt-2 w-full accent-[#659287]" />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="flex items-center justify-between text-xs font-semibold"><span>Left / right</span><span className="text-[#659287]">{headOffsetX > 0 ? '+' : ''}{headOffsetX}px</span></span>
                        <input type="range" min="-8" max="8" step="1" value={headOffsetX} onChange={(event) => setHeadOffsetX(Number(event.target.value))} className="mt-2 w-full accent-[#659287]" />
                      </label>
                      <label className="block">
                        <span className="flex items-center justify-between text-xs font-semibold"><span>Up / down</span><span className="text-[#659287]">{headOffsetY > 0 ? '+' : ''}{headOffsetY}px</span></span>
                        <input type="range" min="-8" max="8" step="1" value={headOffsetY} onChange={(event) => setHeadOffsetY(Number(event.target.value))} className="mt-2 w-full accent-[#659287]" />
                      </label>
                    </div>
                    <button type="button" onClick={() => { setHeadScale(1); setHeadOffsetX(0); setHeadOffsetY(0); }} className="w-full rounded-md bg-[#E6F2DD] px-3 py-2 text-xs font-semibold text-[#527A70] hover:bg-[#D7E9D7]">Reset head fit</button>
                  </div>
                </div>
              ) : null}

              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-[#B1D3B9] px-3 py-2.5 text-sm font-semibold hover:bg-[#E6F2DD]">
                <span><span className="block">Clean solid backgrounds</span><span className="mt-0.5 block text-[11px] font-normal text-[#659287]">Removes connected white or colored sheet backgrounds</span></span>
                <input type="checkbox" checked={cleanBackground} onChange={(event) => setCleanBackground(event.target.checked)} className="size-4 shrink-0 accent-[#659287]" />
              </label>

              <label className="block">
                <span className="flex items-center justify-between text-xs font-semibold"><span>Sprite zoom</span><span className="text-[#659287]">{zoom}x</span></span>
                <input type="range" min="2" max="5" step="1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mt-2 w-full accent-[#659287]" />
              </label>

              <label className="block text-xs font-semibold">Preview background
                <select value={background} onChange={(event) => setBackground(event.target.value)} className="mt-2 w-full rounded-lg border border-[#B1D3B9] bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-[#659287]">
                  {BACKGROUND_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
            </fieldset>

            {bodyUpload ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <button type="button" onClick={() => downloadSource(bodyUpload.url, bodyUpload.name)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#659287] px-4 py-3 text-sm font-semibold text-white hover:bg-[#527A70]"><Download size={17} aria-hidden="true" /> Body sheet</button>
                {headUpload ? <button type="button" onClick={() => downloadSource(headUpload.url, headUpload.name)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#88BDA4] px-4 py-3 text-sm font-semibold text-[#527A70] hover:bg-[#E6F2DD]"><Download size={17} aria-hidden="true" /> Head sheet</button> : null}
              </div>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  );
}
