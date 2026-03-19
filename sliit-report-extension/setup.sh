#!/bin/bash
# SLIIT Report Extension - Library Setup Script
# Run this once to download required JavaScript libraries

echo "📦 Setting up SLIIT Report Cover Extension libraries..."
echo ""

LIB_DIR="$(dirname "$0")/lib"
mkdir -p "$LIB_DIR"

# Download jsPDF
echo "⬇️  Downloading jsPDF..."
if command -v curl &> /dev/null; then
  curl -L "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" -o "$LIB_DIR/jspdf.umd.min.js"
elif command -v wget &> /dev/null; then
  wget -q "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" -O "$LIB_DIR/jspdf.umd.min.js"
else
  echo "❌ Neither curl nor wget found. Please manually download jsPDF."
fi

# Download docx.js
echo "⬇️  Downloading docx.js..."
if command -v curl &> /dev/null; then
  curl -L "https://unpkg.com/docx@8.5.0/build/index.umd.js" -o "$LIB_DIR/docx.min.js"
elif command -v wget &> /dev/null; then
  wget -q "https://unpkg.com/docx@8.5.0/build/index.umd.js" -O "$LIB_DIR/docx.min.js"
fi

echo ""
echo "✅ Libraries downloaded! Now load the extension in your browser:"
echo ""
echo "  Chrome:  chrome://extensions  → Enable Developer Mode → Load Unpacked"
echo "  Firefox: about:debugging       → This Firefox → Load Temporary Add-on"
echo ""
echo "📁 Select the folder: $(dirname "$0")"
