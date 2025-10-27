// QuoteType - Interactive Typography Poster Generator
// ===================================================

// DOM Elements
const quoteText = document.getElementById('quoteText');
const authorText = document.getElementById('authorText');
const metaText = document.getElementById('metaText');
const quoteDisplay = document.getElementById('quoteDisplay');
const authorDisplay = document.getElementById('authorDisplay');
const metaDisplay = document.getElementById('metaDisplay');
const canvas = document.getElementById('canvas');

// Typography Controls
const fontFamily = document.getElementById('fontFamily');
const fontWeight = document.getElementById('fontWeight');
const fontSize = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const lineHeight = document.getElementById('lineHeight');
const lineHeightValue = document.getElementById('lineHeightValue');
const textAlign = document.getElementById('textAlign');
const padding = document.getElementById('padding');
const paddingValue = document.getElementById('paddingValue');

// Visual Controls
const gradientButtons = document.querySelectorAll('.gradient-btn');
const enableShadow = document.getElementById('enableShadow');
const enableFrame = document.getElementById('enableFrame');
const imageSize = document.getElementById('imageSize');

// Action Buttons
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

// ===================================================
// TEXT CONTENT HANDLERS
// ===================================================

function updateQuoteText() {
    const text = quoteText.value.trim();
    quoteDisplay.textContent = text || 'Your quote here...';
    quoteDisplay.style.opacity = text ? '1' : '0.5';
}

function updateAuthorText() {
    const text = authorText.value.trim();
    authorDisplay.textContent = text ? `— ${text}` : '';
    authorDisplay.style.display = text ? 'block' : 'none';
}

function updateMetaText() {
    const text = metaText.value.trim();
    metaDisplay.textContent = text;
    metaDisplay.style.display = text ? 'block' : 'none';
}

quoteText.addEventListener('input', updateQuoteText);
authorText.addEventListener('input', updateAuthorText);
metaText.addEventListener('input', updateMetaText);

// ===================================================
// TYPOGRAPHY HANDLERS
// ===================================================

function updateFontFamily() {
    quoteDisplay.style.fontFamily = `'${fontFamily.value}', serif`;
}

function updateFontWeight() {
    quoteDisplay.style.fontWeight = fontWeight.value;
}

function updateFontSize() {
    const size = fontSize.value;
    fontSizeValue.textContent = size;
    quoteDisplay.style.fontSize = `${size}px`;
}

function updateLineHeight() {
    const height = lineHeight.value;
    lineHeightValue.textContent = height;
    quoteDisplay.style.lineHeight = height;
}

function updateTextAlign() {
    const align = textAlign.value;
    quoteDisplay.style.textAlign = align;
    authorDisplay.style.textAlign = align;
    metaDisplay.style.textAlign = align;

    // Also align the container
    const content = document.querySelector('.canvas-content');
    if (align === 'left') {
        content.style.alignItems = 'flex-start';
    } else if (align === 'right') {
        content.style.alignItems = 'flex-end';
    } else {
        content.style.alignItems = 'center';
    }
}

function updatePadding() {
    const pad = padding.value;
    paddingValue.textContent = pad;
    document.querySelector('.canvas-content').style.padding = `${pad}px`;
}

fontFamily.addEventListener('change', updateFontFamily);
fontWeight.addEventListener('change', updateFontWeight);
fontSize.addEventListener('input', updateFontSize);
lineHeight.addEventListener('input', updateLineHeight);
textAlign.addEventListener('change', updateTextAlign);
padding.addEventListener('input', updatePadding);

// ===================================================
// VISUAL STYLE HANDLERS
// ===================================================

function updateGradient(gradient) {
    canvas.setAttribute('data-gradient', gradient);

    // Update active button state
    gradientButtons.forEach(btn => {
        if (btn.getAttribute('data-gradient') === gradient) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

gradientButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const gradient = btn.getAttribute('data-gradient');
        updateGradient(gradient);
    });
});

function updateShadow() {
    if (enableShadow.checked) {
        canvas.classList.add('shadow-enabled');
    } else {
        canvas.classList.remove('shadow-enabled');
    }
}

function updateFrame() {
    if (enableFrame.checked) {
        canvas.classList.add('frame-enabled');
    } else {
        canvas.classList.remove('frame-enabled');
    }
}

enableShadow.addEventListener('change', updateShadow);
enableFrame.addEventListener('change', updateFrame);

// ===================================================
// IMAGE SIZE HANDLER
// ===================================================

function updateImageSize() {
    const size = imageSize.value;
    canvas.setAttribute('data-size', size);
}

imageSize.addEventListener('change', updateImageSize);

// ===================================================
// EXPORT FUNCTIONALITY
// ===================================================

async function downloadPNG() {
    try {
        downloadBtn.disabled = true;
        downloadBtn.textContent = '⏳ Generating...';

        // Get dimensions based on selected size
        const [width, height] = imageSize.value.split('x').map(Number);

        // Generate canvas at 2x resolution for high quality
        const canvasElement = await html2canvas(canvas, {
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
            scale: 2,
            backgroundColor: null,
            logging: false,
            useCORS: true
        });

        // Create download link
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `quotetype-${timestamp}.png`;
        link.href = canvasElement.toDataURL('image/png');
        link.click();

        downloadBtn.textContent = '✅ Downloaded!';
        setTimeout(() => {
            downloadBtn.textContent = '📥 Download PNG';
            downloadBtn.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('Download failed:', error);
        downloadBtn.textContent = '❌ Failed';
        setTimeout(() => {
            downloadBtn.textContent = '📥 Download PNG';
            downloadBtn.disabled = false;
        }, 2000);
    }
}

async function copyToClipboard() {
    try {
        copyBtn.disabled = true;
        copyBtn.textContent = '⏳ Copying...';

        // Generate canvas
        const canvasElement = await html2canvas(canvas, {
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
            scale: 2,
            backgroundColor: null,
            logging: false,
            useCORS: true
        });

        // Convert to blob
        canvasElement.toBlob(async (blob) => {
            try {
                // Try using Clipboard API
                if (navigator.clipboard && window.ClipboardItem) {
                    const item = new ClipboardItem({ 'image/png': blob });
                    await navigator.clipboard.write([item]);
                    copyBtn.textContent = '✅ Copied!';
                } else {
                    // Fallback: download instead
                    throw new Error('Clipboard API not supported');
                }
            } catch (err) {
                console.error('Copy failed:', err);
                copyBtn.textContent = '❌ Not supported';
            }

            setTimeout(() => {
                copyBtn.textContent = '📋 Copy Image';
                copyBtn.disabled = false;
            }, 2000);
        });

    } catch (error) {
        console.error('Copy failed:', error);
        copyBtn.textContent = '❌ Failed';
        setTimeout(() => {
            copyBtn.textContent = '📋 Copy Image';
            copyBtn.disabled = false;
        }, 2000);
    }
}

function clearAll() {
    if (confirm('Clear all text? This cannot be undone.')) {
        quoteText.value = '';
        authorText.value = '';
        metaText.value = '';
        updateQuoteText();
        updateAuthorText();
        updateMetaText();
    }
}

downloadBtn.addEventListener('click', downloadPNG);
copyBtn.addEventListener('click', copyToClipboard);
clearBtn.addEventListener('click', clearAll);

// ===================================================
// INITIALIZATION
// ===================================================

function initialize() {
    // Set initial values
    updateQuoteText();
    updateAuthorText();
    updateMetaText();
    updateFontFamily();
    updateFontWeight();
    updateFontSize();
    updateLineHeight();
    updateTextAlign();
    updatePadding();
    updateShadow();
    updateFrame();
    updateImageSize();

    console.log('🪶 QuoteType initialized successfully!');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// ===================================================
// KEYBOARD SHORTCUTS
// ===================================================

document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + S to download
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        downloadPNG();
    }

    // Cmd/Ctrl + K to copy
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        copyToClipboard();
    }
});

// ===================================================
// PERFORMANCE OPTIMIZATION
// ===================================================

// Debounce text input updates for better performance
let textUpdateTimeout;
function debounceTextUpdate(callback) {
    clearTimeout(textUpdateTimeout);
    textUpdateTimeout = setTimeout(callback, 50);
}

// Re-attach with debounce
quoteText.addEventListener('input', () => debounceTextUpdate(updateQuoteText));
