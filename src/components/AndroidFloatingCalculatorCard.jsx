import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calculator, LoaderCircle, PictureInPicture2, ShieldCheck } from 'lucide-react';
import {
  getFloatingCalculatorStatus,
  hideFloatingCalculator,
  isNativeAndroid,
  requestFloatingCalculatorPermission,
  showFloatingCalculator,
  updateFloatingCalculator,
} from '../native/floatingCalculator.js';

const initialStatus = { native: true, granted: false, running: false };

export default function AndroidFloatingCalculatorCard({ total, tro, ratio }) {
  const nativeAndroid = useMemo(isNativeAndroid, []);
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(nativeAndroid);
  const [message, setMessage] = useState('');
  const values = useMemo(() => ({ total, tro, ratio }), [ratio, total, tro]);

  const refreshStatus = useCallback(async () => {
    if (!nativeAndroid) return;
    try {
      const nextStatus = await getFloatingCalculatorStatus();
      setStatus(nextStatus);
    } catch {
      setMessage('Unable to check the Android overlay status. Reopen the app and try again.');
    } finally {
      setLoading(false);
    }
  }, [nativeAndroid]);

  useEffect(() => {
    if (!nativeAndroid) return undefined;
    refreshStatus();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') refreshStatus();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [nativeAndroid, refreshStatus]);

  useEffect(() => {
    if (!nativeAndroid || !status.running) return undefined;
    const timeout = window.setTimeout(() => {
      updateFloatingCalculator(values).catch(() => {
        setMessage('The floating calculator could not sync the latest total.');
      });
    }, 120);
    return () => window.clearTimeout(timeout);
  }, [nativeAndroid, status.running, values]);

  if (!nativeAndroid) return null;

  const requestPermission = async () => {
    setLoading(true);
    setMessage('');
    try {
      const nextStatus = await requestFloatingCalculatorPermission();
      setStatus(nextStatus);
      setMessage(nextStatus.granted
        ? 'Permission enabled. You can now start the floating calculator.'
        : 'Permission was not enabled. Allow “Display over other apps” to continue.');
    } catch {
      setMessage('Unable to open the overlay permission screen.');
    } finally {
      setLoading(false);
    }
  };

  const startOverlay = async () => {
    setLoading(true);
    setMessage('');
    try {
      await showFloatingCalculator(values);
      setStatus((current) => ({ ...current, running: true }));
      setMessage('Floating calculator started. Open another app to use it.');
    } catch {
      setMessage('Unable to start the overlay. Check the Android permission and try again.');
      await refreshStatus();
    } finally {
      setLoading(false);
    }
  };

  const stopOverlay = async () => {
    setLoading(true);
    setMessage('');
    try {
      await hideFloatingCalculator();
      setStatus((current) => ({ ...current, running: false }));
      setMessage('Floating calculator stopped.');
    } catch {
      setMessage('Unable to stop the overlay from this screen. Use Close on the floating calculator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-5 rounded-xl border border-[#88BDA4] bg-white p-4 shadow-sm sm:mt-6 sm:p-5" aria-labelledby="android-overlay-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#E6F2DD] text-[#527A70]">
            <PictureInPicture2 size={21} aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="android-overlay-title" className="font-bold text-[#29453E]">Floating calculator</h2>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${status.running ? 'bg-[#D7E9D7] text-[#29453E]' : 'bg-[#F2F8ED] text-[#659287]'}`}>
                {status.running ? 'ACTIVE' : 'ANDROID APK'}
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#527A70]">
              Keep a draggable calculator above Graal or another app. It uses its own keypad, so the mobile keyboard stays closed.
            </p>
          </div>
        </div>

        {!status.granted ? (
          <button type="button" onClick={requestPermission} disabled={loading} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#659287] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#527A70] disabled:cursor-wait disabled:opacity-70">
            {loading ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : <ShieldCheck size={17} aria-hidden="true" />}
            Enable overlay
          </button>
        ) : status.running ? (
          <button type="button" onClick={stopOverlay} disabled={loading} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#88BDA4] bg-white px-4 py-2.5 text-sm font-semibold text-[#527A70] hover:bg-[#E6F2DD] disabled:cursor-wait disabled:opacity-70">
            {loading ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : <Calculator size={17} aria-hidden="true" />}
            Stop overlay
          </button>
        ) : (
          <button type="button" onClick={startOverlay} disabled={loading} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#659287] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#527A70] disabled:cursor-wait disabled:opacity-70">
            {loading ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : <Calculator size={17} aria-hidden="true" />}
            Start overlay
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#E6F2DD] pt-3 text-xs text-[#659287]">
        <span>Current total: <strong className="text-[#29453E]">{total} G</strong></span>
        <span>Tro value: <strong className="text-[#29453E]">{tro} Tro</strong></span>
        <span>Drag from its header · tap − to minimize · tap × to close</span>
      </div>
      {!status.granted ? (
        <p className="mt-3 rounded-lg bg-[#E6F2DD] p-3 text-xs leading-5 text-[#46675F]">
          <strong className="text-[#29453E]">Before you allow it:</strong> Android will let this app show a user-controlled calculator over other apps. The overlay cannot read, record, or capture the content underneath it. It displays only calculator controls and values stored on this device, and you can stop it at any time.
        </p>
      ) : null}
      {message ? <p className="mt-3 text-sm font-medium text-[#527A70]" role="status">{message}</p> : null}
    </section>
  );
}
