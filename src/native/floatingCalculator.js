import { Capacitor, registerPlugin } from '@capacitor/core';

const FloatingCalculator = registerPlugin('FloatingCalculator');
const browserStatus = { native: false, granted: false, running: false };

export function isNativeAndroid() {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

export async function getFloatingCalculatorStatus() {
  if (!isNativeAndroid()) return browserStatus;
  return FloatingCalculator.getStatus();
}

export async function requestFloatingCalculatorPermission() {
  if (!isNativeAndroid()) return browserStatus;
  return FloatingCalculator.requestPermission();
}

export async function showFloatingCalculator(values) {
  if (!isNativeAndroid()) return browserStatus;
  return FloatingCalculator.show(values);
}

export async function updateFloatingCalculator(values) {
  if (!isNativeAndroid()) return browserStatus;
  return FloatingCalculator.updateState(values);
}

export async function hideFloatingCalculator() {
  if (!isNativeAndroid()) return browserStatus;
  return FloatingCalculator.hide();
}
