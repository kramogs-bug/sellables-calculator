const imageCache = new Map();
const cleanedFrameCache = new WeakMap();
const BACKGROUND_TOLERANCE = 52;
const MINIMUM_OPAQUE_BORDER_COVERAGE = 0.72;

export const BODY_VIEWS = [
  { id: 'front', label: 'Front', column: 2 },
  { id: 'back', label: 'Back', column: 0 },
  { id: 'left', label: 'Left', column: 1 },
  { id: 'right', label: 'Right', column: 3 },
];

export const TURNTABLE_VIEWS = [
  { id: 'front', label: 'Front', column: 2 },
  { id: 'right', label: 'Right', column: 3 },
  { id: 'back', label: 'Back', column: 0 },
  { id: 'left', label: 'Left', column: 1 },
];

const PREVIEW_SIZE = 640;
const PREVIEW_CELL_SIZE = PREVIEW_SIZE / 2;
const BACKGROUNDS = {
  transparent: null,
  cream: '#F8FBF5',
  sage: '#E6F2DD',
  teal: '#659287',
};

export function loadImage(url) {
  if (!imageCache.has(url)) {
    imageCache.set(url, new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Unable to load image.'));
      image.src = url;
    }));
  }

  return imageCache.get(url);
}

export function releaseImage(url) {
  imageCache.delete(url);
}

export function inspectBodySheet(image) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const frameSize = width / 4;
  const rowCount = Math.max(1, Math.floor(height / frameSize));
  const scale = width / 128;
  const integerScale = Math.round(scale);

  return {
    width,
    height,
    frameSize,
    rowCount,
    isStandardLayout: integerScale >= 1
      && Math.abs(scale - integerScale) < 0.001
      && height === 720 * integerScale,
  };
}

export function inspectHeadSheet(image) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const frameSize = width;
  const frameCount = Math.max(1, Math.floor(height / frameSize));
  const scale = width / 32;
  const integerScale = Math.round(scale);

  return {
    width,
    height,
    frameSize,
    frameCount,
    isStandardLayout: integerScale >= 1
      && Math.abs(scale - integerScale) < 0.001
      && height === 560 * integerScale,
  };
}

export function validateSpriteSheet(image, type) {
  const info = type === 'body' ? inspectBodySheet(image) : inspectHeadSheet(image);
  const expectedSize = type === 'body' ? '128 x 720' : '32 x 560';
  if (!info.isStandardLayout) {
    return {
      valid: false,
      reason: `This does not match a Graal ${type} sheet. Use ${expectedSize}px or an exact whole-number scale of it.`,
    };
  }

  const canvas = document.createElement('canvas');
  canvas.width = type === 'body' ? 128 : 32;
  canvas.height = type === 'body' ? 720 : 560;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  try {
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    const frameSize = 32;
    const columns = type === 'body' ? 4 : 1;
    const rows = type === 'body' ? 22 : 17;
    const samples = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const left = column * frameSize;
        const top = row * frameSize;
        const points = [
          [left + 1, top + 1],
          [left + frameSize - 2, top + 1],
          [left + 1, top + frameSize - 2],
          [left + frameSize - 2, top + frameSize - 2],
        ];
        points.forEach(([x, y]) => {
          const offset = ((y * canvas.width) + x) * 4;
          samples.push([data[offset], data[offset + 1], data[offset + 2], data[offset + 3]]);
        });
      }
    }

    let transparentSamples = 0;
    const solidColors = new Map();
    samples.forEach(([red, green, blue, alpha]) => {
      if (alpha <= 24) {
        transparentSamples += 1;
        return;
      }
      const colorKey = `${red >> 5}:${green >> 5}:${blue >> 5}`;
      solidColors.set(colorKey, (solidColors.get(colorKey) || 0) + 1);
    });

    let dominantSolidSamples = 0;
    let dominantSolidKey = '';
    solidColors.forEach((count, colorKey) => {
      if (count > dominantSolidSamples) {
        dominantSolidSamples = count;
        dominantSolidKey = colorKey;
      }
    });
    const backgroundCoverage = (transparentSamples + dominantSolidSamples) / samples.length;
    if (backgroundCoverage < 0.5) {
      return {
        valid: false,
        reason: `The image has the right size but does not look like a ${type} sprite sheet. Upload the original transparent or solid-background Graal sheet, not a photo or screenshot.`,
      };
    }

    const usesTransparency = transparentSamples >= samples.length * 0.35;
    const occupiedByColumn = Array(columns).fill(0);
    let occupiedFrames = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        let foregroundPixels = 0;
        const left = column * frameSize;
        const top = row * frameSize;
        for (let y = top; y < top + frameSize; y += 2) {
          for (let x = left; x < left + frameSize; x += 2) {
            const offset = ((y * canvas.width) + x) * 4;
            const alpha = data[offset + 3];
            if (alpha <= 24) continue;
            const colorKey = `${data[offset] >> 5}:${data[offset + 1] >> 5}:${data[offset + 2] >> 5}`;
            if (!usesTransparency && colorKey === dominantSolidKey) continue;
            foregroundPixels += 1;
          }
        }
        if (foregroundPixels >= 10) {
          occupiedFrames += 1;
          occupiedByColumn[column] += 1;
        }
      }
    }

    const hasEnoughFrames = type === 'body'
      ? occupiedFrames >= 28 && occupiedByColumn.every((count) => count >= 5)
      : occupiedFrames >= 8;
    if (!hasEnoughFrames) {
      return {
        valid: false,
        reason: `The image size is correct, but it does not contain enough repeated ${type} sprite frames. Upload the complete Graal ${type} sheet.`,
      };
    }
  } catch {
    return { valid: false, reason: 'The browser could not inspect this image safely. Try the original PNG sprite sheet.' };
  }

  return { valid: true, info };
}

function colorsMatch(data, offset, background) {
  return data[offset + 3] > 0
    && Math.abs(data[offset] - background[0]) <= BACKGROUND_TOLERANCE
    && Math.abs(data[offset + 1] - background[1]) <= BACKGROUND_TOLERANCE
    && Math.abs(data[offset + 2] - background[2]) <= BACKGROUND_TOLERANCE;
}

function dominantBorderColor(data, width, height) {
  const borderOffsets = [];
  for (let x = 0; x < width; x += 1) {
    borderOffsets.push(x * 4);
    if (height > 1) borderOffsets.push((((height - 1) * width) + x) * 4);
  }
  for (let y = 1; y < height - 1; y += 1) {
    borderOffsets.push((y * width) * 4);
    if (width > 1) borderOffsets.push(((y * width) + width - 1) * 4);
  }

  const opaqueOffsets = borderOffsets.filter((offset) => data[offset + 3] > 8);
  if (opaqueOffsets.length < borderOffsets.length * MINIMUM_OPAQUE_BORDER_COVERAGE) return null;

  const colorGroups = new Map();
  opaqueOffsets.forEach((offset) => {
    const key = `${data[offset] >> 5}:${data[offset + 1] >> 5}:${data[offset + 2] >> 5}`;
    const group = colorGroups.get(key) || { count: 0, red: 0, green: 0, blue: 0 };
    group.count += 1;
    group.red += data[offset];
    group.green += data[offset + 1];
    group.blue += data[offset + 2];
    colorGroups.set(key, group);
  });

  let dominant = null;
  colorGroups.forEach((group) => {
    if (!dominant || group.count > dominant.count) dominant = group;
  });
  if (!dominant || dominant.count < opaqueOffsets.length * 0.25) return null;

  return [
    Math.round(dominant.red / dominant.count),
    Math.round(dominant.green / dominant.count),
    Math.round(dominant.blue / dominant.count),
  ];
}

function removeConnectedBackground(context, width, height) {
  const pixels = context.getImageData(0, 0, width, height);
  const { data } = pixels;
  const background = dominantBorderColor(data, width, height);
  if (!background) return;

  const visited = new Uint8Array(width * height);
  const stack = [];

  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixelIndex = (y * width) + x;
    if (visited[pixelIndex]) return;
    visited[pixelIndex] = 1;
    if (colorsMatch(data, pixelIndex * 4, background)) stack.push(pixelIndex);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  while (stack.length) {
    const pixelIndex = stack.pop();
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    data[(pixelIndex * 4) + 3] = 0;

    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }

  context.putImageData(pixels, 0, 0);
}

function getCleanedFrame(image, sourceX, sourceY, sourceSize) {
  let imageFrames = cleanedFrameCache.get(image);
  if (!imageFrames) {
    imageFrames = new Map();
    cleanedFrameCache.set(image, imageFrames);
  }

  const cacheKey = `${sourceX}:${sourceY}:${sourceSize}`;
  if (imageFrames.has(cacheKey)) return imageFrames.get(cacheKey);

  const frameSize = Math.max(1, Math.round(sourceSize));
  const canvas = document.createElement('canvas');
  canvas.width = frameSize;
  canvas.height = frameSize;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.imageSmoothingEnabled = false;
  context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, frameSize, frameSize);

  try {
    removeConnectedBackground(context, frameSize, frameSize);
  } catch {
    // If pixel access is unavailable, keep the original frame instead of failing the preview.
  }

  imageFrames.set(cacheKey, canvas);
  return canvas;
}

function drawSpriteFrame(context, image, sourceX, sourceY, sourceSize, targetX, targetY, targetSize, cleanBackground) {
  if (cleanBackground) {
    const frame = getCleanedFrame(image, sourceX, sourceY, sourceSize);
    context.drawImage(frame, targetX, targetY, targetSize, targetSize);
    return;
  }

  context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, targetX, targetY, targetSize, targetSize);
}

export async function renderBodyPreview(canvas, bodyImageUrl, headImageUrl, options = {}) {
  if (!canvas || (!bodyImageUrl && !headImageUrl)) return;

  const [bodyImage, headImage] = await Promise.all([
    bodyImageUrl ? loadImage(bodyImageUrl) : Promise.resolve(null),
    headImageUrl ? loadImage(headImageUrl) : Promise.resolve(null),
  ]);
  const bodySheet = bodyImage ? inspectBodySheet(bodyImage) : null;
  const headSheet = headImage ? inspectHeadSheet(headImage) : null;
  const requestedRow = Math.floor(Number(options.row) || 0);
  const row = bodySheet ? Math.min(bodySheet.rowCount - 1, Math.max(0, requestedRow)) : 0;
  const zoom = Math.min(5, Math.max(2, Number(options.zoom) || 5));
  const hasRequestedBackground = Object.prototype.hasOwnProperty.call(BACKGROUNDS, options.background);
  const background = hasRequestedBackground ? BACKGROUNDS[options.background] : BACKGROUNDS.cream;
  const cleanBackground = options.cleanBackground !== false;
  const headScale = Math.min(1.25, Math.max(0.75, Number(options.headScale) || 1));
  const headOffsetX = Math.min(8, Math.max(-8, Number(options.headOffsetX) || 0));
  const headOffsetY = Math.min(8, Math.max(-8, Number(options.headOffsetY) || 0));
  const context = canvas.getContext('2d');

  canvas.width = PREVIEW_SIZE;
  canvas.height = PREVIEW_SIZE;
  context.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
  context.imageSmoothingEnabled = false;

  const isTurntable = options.layout === 'turntable';
  const directionIndex = Math.min(3, Math.max(0, Math.floor(Number(options.directionIndex) || 0)));
  const visibleViews = isTurntable ? [TURNTABLE_VIEWS[directionIndex]] : BODY_VIEWS;
  const cellSize = isTurntable ? PREVIEW_SIZE : PREVIEW_CELL_SIZE;

  visibleViews.forEach((view, index) => {
    const cellX = isTurntable ? 0 : (index % 2) * PREVIEW_CELL_SIZE;
    const cellY = isTurntable ? 0 : Math.floor(index / 2) * PREVIEW_CELL_SIZE;

    if (background) {
      context.fillStyle = background;
      context.fillRect(cellX, cellY, cellSize, cellSize);

      if (isTurntable) {
        const light = context.createRadialGradient(cellSize / 2, cellSize * 0.38, 20, cellSize / 2, cellSize * 0.45, cellSize * 0.48);
        light.addColorStop(0, 'rgba(255,255,255,0.72)');
        light.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = light;
        context.fillRect(0, 0, cellSize, cellSize);
      }
    }

    const hasVisibleBody = Boolean(bodyImage && bodySheet);
    const hasVisibleHead = Boolean(headImage && headSheet && options.showHead !== false);
    const characterHeightInFrames = hasVisibleBody && hasVisibleHead ? 1.5 : 1;
    const sourceFrameSize = bodySheet?.frameSize || headSheet?.frameSize || 32;
    const padding = isTurntable ? 144 : 48;
    const maximumScale = Math.max(1, Math.floor((cellSize - padding) / (sourceFrameSize * characterHeightInFrames)));
    const desiredScale = isTurntable ? zoom * 2 : zoom;
    const pixelScale = Math.min(desiredScale, maximumScale);
    const targetSize = Math.round(sourceFrameSize * pixelScale);
    const characterHeight = Math.round(targetSize * characterHeightInFrames);
    const targetX = Math.round(cellX + (cellSize - targetSize) / 2);
    const characterTop = Math.round(cellY + (cellSize - characterHeight) / 2 - (isTurntable ? 12 : 0));
    const bodyTop = hasVisibleBody && hasVisibleHead ? characterTop + Math.round(targetSize / 2) : characterTop;

    if (isTurntable && background && hasVisibleBody) {
      context.save();
      context.fillStyle = 'rgba(41, 69, 62, 0.14)';
      context.beginPath();
      context.ellipse(
        cellSize / 2,
        characterTop + characterHeight + 14,
        targetSize * 0.48,
        Math.max(8, targetSize * 0.09),
        0,
        0,
        Math.PI * 2,
      );
      context.fill();
      context.restore();
    }

    if (hasVisibleBody) {
      drawSpriteFrame(
        context,
        bodyImage,
        view.column * bodySheet.frameSize,
        row * bodySheet.frameSize,
        bodySheet.frameSize,
        targetX,
        bodyTop,
        targetSize,
        cleanBackground,
      );
    }

    if (hasVisibleHead) {
      const headTargetSize = Math.round(targetSize * headScale);
      const headTargetX = Math.round(targetX + ((targetSize - headTargetSize) / 2) + (headOffsetX * pixelScale));
      const headTargetY = hasVisibleBody
        ? Math.round(bodyTop - (headTargetSize / 2) + (headOffsetY * pixelScale))
        : Math.round(cellY + ((cellSize - headTargetSize) / 2) + (headOffsetY * pixelScale) - (isTurntable ? 12 : 0));
      drawSpriteFrame(
        context,
        headImage,
        0,
        view.column * headSheet.frameSize,
        headSheet.frameSize,
        headTargetX,
        headTargetY,
        headTargetSize,
        cleanBackground,
      );
    }
  });
}

export function downloadCanvas(canvas, filename = 'graal-character-four-views.png') {
  if (!canvas) return;

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }, 'image/png');
}

export function downloadSource(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'graal-body.png';
  link.click();
}
