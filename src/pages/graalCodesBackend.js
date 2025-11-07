// Backend logic and data management
export const categories = {
  html: {
    title: "HTML Basics",
    icon: 'Code',
    gradient: "from-blue-500 to-cyan-500",
    description: "Basic HTML codes for styling your Graal status and profiles",
    codes: [
      { id: 1, name: "Bold Text", code: "<b>Your Text Here</b>", desc: "Makes your text bold" },
      { id: 2, name: "Underline", code: "<u>Your Text Here</u>", desc: "Underlines your text" },
      { id: 3, name: "Blink Text", code: "<blink>Your Text Here</blink>", desc: "Makes text blink (classic!)" },
      { id: 4, name: "Center Text", code: "<center>Your Text Here</center>", desc: "Centers your text" },
      { id: 5, name: "Line Break", code: "Text<br>New Line", desc: "Skips to a new line" },
      { id: 6, name: "Strikethrough", code: "<strike>Your Text Here</strike>", desc: "Strikes through text" },
      { id: 7, name: "Slash Text", code: "<slash>Your Text Here</slash>", desc: "Alternative strikethrough" },
      { id: 8, name: "Italic Text", code: "<i>Your Text Here</i>", desc: "Makes text italic" },
    ]
  },
  colors: {
    title: "Colors",
    icon: 'Palette',
    gradient: "from-pink-500 to-rose-500",
    description: "Change text colors using font tags",
    codes: [
      { id: 9, name: "Red Text", code: "<font color=red>Your Text</font>", desc: "Makes text red" },
      { id: 10, name: "Green Text", code: "<font color=green>Your Text</font>", desc: "Makes text green" },
      { id: 11, name: "Blue Text", code: "<font color=blue>Your Text</font>", desc: "Makes text blue" },
      { id: 12, name: "Gold Text", code: "<font color=gold>Your Text</font>", desc: "Makes text gold" },
      { id: 13, name: "Purple Text", code: "<font color=purple>Your Text</font>", desc: "Makes text purple" },
      { id: 14, name: "Orange Text", code: "<font color=orange>Your Text</font>", desc: "Makes text orange" },
      { id: 15, name: "Yellow Text", code: "<font color=yellow>Your Text</font>", desc: "Makes text yellow" },
      { id: 16, name: "White Text", code: "<font color=white>Your Text</font>", desc: "Makes text white" },
      { id: 17, name: "Black Text", code: "<font color=black>Your Text</font>", desc: "Makes text black" },
      { id: 18, name: "Maroon Text", code: "<font color=maroon>Your Text</font>", desc: "Makes text maroon" },
      { id: 19, name: "Silver Text", code: "<font color=silver>Your Text</font>", desc: "Makes text silver" },
    ]
  },
  backgrounds: {
    title: "Backgrounds",
    icon: 'Image',
    gradient: "from-purple-500 to-indigo-500",
    description: "Customize your profile background colors and images",
    codes: [
      { id: 21, name: "Black BG", code: "<body bgcolor=black>", desc: "Solid black background" },
      { id: 22, name: "Blue BG", code: "<body bgcolor=blue>", desc: "Blue background" },
      { id: 23, name: "Red BG", code: "<body bgcolor=red>", desc: "Red background" },
      { id: 24, name: "Custom Hex BG", code: "<body bgcolor=#FF5733>", desc: "Use hex color codes" },
      { id: 25, name: "Centered Hex BG", code: "<body bgcolor=#000000centered>", desc: "Centered hex background" },
      { id: 26, name: "Heart BG", code: "<body background=heart>", desc: "Heart pattern background" },
      { id: 27, name: "Stars BG", code: "<body background=star>", desc: "Starry background" },
      { id: 28, name: "Shark BG", code: "<body background=era>", desc: "Animated shark background" },
      { id: 29, name: "Shock Circles", code: "<body background=shock>", desc: "Red moving circles" },
    ]
  },
  images: {
    title: "Images & Icons",
    icon: 'Sparkles',
    gradient: "from-yellow-500 to-orange-500",
    description: "Add images and animated GIFs to your status",
    codes: [
      { id: 31, name: "Fire Animation", code: "<img src=fire.gif>", desc: "Animated fire" },
      { id: 32, name: "Heart", code: "<img src=heart.png>", desc: "Classic heart icon" },
      { id: 33, name: "Pink Heart", code: "<img src=pinkheart.png>", desc: "Pink heart icon" },
      { id: 34, name: "Candle", code: "<img src=candle.gif>", desc: "Animated candle flame" },
      { id: 35, name: "Gralats", code: "<img src=gralats.png>", desc: "Graal currency icon" },
      { id: 36, name: "Bomb", code: "<img src=bomb.png>", desc: "Bomb icon" },
      { id: 37, name: "Tree", code: "<img src=tree.png>", desc: "Tree image" },
      { id: 38, name: "Resized Image", code: "<img src=fire.gif width=50 height=50>", desc: "Custom size image" },
    ]
  },
  fonts: {
    title: "Fonts",
    icon: 'Type',
    gradient: "from-green-500 to-emerald-500",
    description: "Change font size and style",
    codes: [
      { id: 51, name: "Small Font", code: "<font size=10>Text</font>", desc: "Smaller text size" },
      { id: 52, name: "Medium Font", code: "<font size=20>Text</font>", desc: "Medium text size" },
      { id: 53, name: "Large Font", code: "<font size=30>Text</font>", desc: "Large text size" },
      { id: 54, name: "Huge Font", code: "<font size=40>Text</font>", desc: "Extra large text" },
      { id: 55, name: "Triforce Font", code: "<font face=triforce>Text</font>", desc: "Zelda-style font" },
      { id: 56, name: "Adventure Font", code: "<font face=adventure>Text</font>", desc: "Adventure style font" },
    ]
  },
  sellables: {
    title: "Sellables",
    icon: 'ShoppingBag',
    gradient: "from-amber-500 to-yellow-500",
    description: "Show off your sellables, ores, and collectibles",
    codes: [
      { id: 63, name: "Diamond", code: "<img src=era_icon-diamond.png>", desc: "Diamond ore" },
      { id: 64, name: "Gold Ore", code: "<img src=era_icon-gold.png>", desc: "Gold ore" },
      { id: 65, name: "Emerald", code: "<img src=era_icon-emerald.png>", desc: "Emerald ore" },
      { id: 66, name: "Copper", code: "<img src=era_icon-copper.png>", desc: "Copper ore" },
      { id: 67, name: "Iron", code: "<img src=era_icon-iron.png>", desc: "Iron ore" },
    ]
  },
  weapons: {
    title: "Weapons",
    icon: 'Sword',
    gradient: "from-red-500 to-pink-500",
    description: "Display your weapon arsenal",
    codes: [
      { id: 85, name: "AK47", code: "<img src=era_gun-icon-newak47.png>", desc: "AK47 rifle icon" },
      { id: 86, name: "Handgun", code: "<img src=era_gun-icon-handgun.png>", desc: "Handgun icon" },
      { id: 88, name: "Knife", code: "<img src=era_melee-icon-knife.png>", desc: "Combat knife" },
      { id: 89, name: "Katana", code: "<img src=era_icon-katana.png>", desc: "Katana sword" },
      { id: 90, name: "Excalibur", code: "<img src=era_icon-queensword.png>", desc: "Legendary sword" },
    ]
  },
  pets: {
    title: "Pets",
    icon: 'Heart',
    gradient: "from-violet-500 to-purple-500",
    description: "Show off your pet collection",
    codes: [
      { id: 109, name: "Red Dragon", code: "<img src=icon_dragonred.png>", desc: "Red dragon pet" },
      { id: 110, name: "Blue Dragon", code: "<img src=icon_dragonblue.png>", desc: "Blue dragon pet" },
      { id: 111, name: "Green Dragon", code: "<img src=icon_dragongreen.png>", desc: "Green dragon pet" },
      { id: 112, name: "Black Dragon", code: "<img src=icon_dragonblack.png>", desc: "Black dragon pet" },
    ]
  },
  advanced: {
    title: "Advanced",
    icon: 'Zap',
    gradient: "from-cyan-500 to-blue-500",
    description: "Special effects, furniture, and unique items",
    codes: [
      { id: 120, name: "Medpack Large", code: "<img src=era_icon-medkitbig.png>", desc: "Large medical kit" },
      { id: 121, name: "Medpack Small", code: "<img src=era_icon-medkit.png>", desc: "Small medical kit" },
      { id: 135, name: "Christmas Tree", code: "<img src=classiciphone_furniture_christmastree.png>", desc: "Christmas tree furniture" },
      { id: 137, name: "TV", code: "<img src=classiciphone_furniture_tv.gif>", desc: "Animated TV" },
      { id: 186, name: "Graal Logo", code: "<img src=graal.png>", desc: "Graal game logo" },
    ]
  },
};

// Filter functions
export const filterCodes = (activeCategories, searchTerm) => {
  return Object.entries(categories).reduce((acc, [key, category]) => {
    if (activeCategories.length === 0 || activeCategories.includes(key)) {
      const categoryCodes = category.codes.filter(code =>
        code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (categoryCodes.length > 0) {
        acc.push({
          category: key,
          ...category,
          codes: categoryCodes
        });
      }
    }
    return acc;
  }, []);
};

export const getTotalResults = (filteredCodes) => {
  return filteredCodes.reduce((sum, cat) => sum + cat.codes.length, 0);
};

// Preview rendering functions
export const renderPreview = (code) => {
  const previewHtml = code
    .replace(/<b>(.*?)<\/b>/g, '<strong style="font-weight: bold;">$1</strong>')
    .replace(/<i>(.*?)<\/i>/g, '<em style="font-style: italic;">$1</em>')
    .replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline;">$1</span>')
    .replace(/<blink>(.*?)<\/blink>/g, '<span style="animation: blink 1s infinite;">$1</span>')
    .replace(/<center>(.*?)<\/center>/g, '<div style="text-align: center;">$1</div>')
    .replace(/<strike>(.*?)<\/strike>/g, '<span style="text-decoration: line-through;">$1</span>')
    .replace(/<slash>(.*?)<\/slash>/g, '<span style="text-decoration: line-through;">$1</span>')
    .replace(/<font color=red>(.*?)<\/font>/g, '<span style="color: #ff4444;">$1</span>')
    .replace(/<font color=green>(.*?)<\/font>/g, '<span style="color: #44ff44;">$1</span>')
    .replace(/<font color=blue>(.*?)<\/font>/g, '<span style="color: #4444ff;">$1</span>')
    .replace(/<font color=gold>(.*?)<\/font>/g, '<span style="color: #ffaa00;">$1</span>')
    .replace(/<font color=purple>(.*?)<\/font>/g, '<span style="color: #aa44ff;">$1</span>')
    .replace(/<font color=orange>(.*?)<\/font>/g, '<span style="color: #ff8844;">$1</span>')
    .replace(/<font color=yellow>(.*?)<\/font>/g, '<span style="color: #ffff44;">$1</span>')
    .replace(/<font color=white>(.*?)<\/font>/g, '<span style="color: #ffffff;">$1</span>')
    .replace(/<font color=black>(.*?)<\/font>/g, '<span style="color: #000000; background: white; padding: 2px 4px; border-radius: 2px;">$1</span>')
    .replace(/<font color=maroon>(.*?)<\/font>/g, '<span style="color: #882222;">$1</span>')
    .replace(/<font color=silver>(.*?)<\/font>/g, '<span style="color: #cccccc;">$1</span>')
    .replace(/<br>/g, '<br/>')
    .replace(/Your Text Here/g, 'Sample Text')
    .replace(/Your Text/g, 'Text')
    .replace(/Text Here/g, 'Sample');

  return previewHtml;
};

export const renderImagePreview = (code) => {
  if (code.includes('img src=')) {
    return (
      `<div class="text-xs text-gray-400 bg-slate-900/50 p-2 rounded border border-slate-700">
        [Image: ${code.match(/src=([^\s>]+)/)?.[1] || 'icon'}]
      </div>`
    );
  }
  return null;
};

export const renderBackgroundPreview = (code) => {
  if (code.includes('bgcolor=black')) return '<div class="w-full h-12 bg-black rounded border border-gray-600 flex items-center justify-center text-white text-xs">Black Background</div>';
  if (code.includes('bgcolor=blue')) return '<div class="w-full h-12 bg-blue-600 rounded flex items-center justify-center text-white text-xs">Blue Background</div>';
  if (code.includes('bgcolor=red')) return '<div class="w-full h-12 bg-red-600 rounded flex items-center justify-center text-white text-xs">Red Background</div>';
  if (code.includes('bgcolor=#')) return '<div class="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center text-white text-xs">Custom Color BG</div>';
  if (code.includes('background=heart')) return '<div class="w-full h-12 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs border border-red-200">❤️ Pattern BG</div>';
  if (code.includes('background=star')) return '<div class="w-full h-12 bg-yellow-100 rounded flex items-center justify-center text-yellow-600 text-xs border border-yellow-200">⭐ Pattern BG</div>';
  if (code.includes('background=shock')) return '<div class="w-full h-12 bg-red-500 rounded animate-pulse flex items-center justify-center text-white text-xs">Shock Animation BG</div>';
  return '<div class="w-full h-12 bg-gray-600 rounded flex items-center justify-center text-white text-xs">Background</div>';
};

export const getPreview = (item) => {
  if (item.code.includes('img src=')) {
    return renderImagePreview(item.code);
  } else if (item.code.includes('bgcolor=') || item.code.includes('background=')) {
    return renderBackgroundPreview(item.code);
  } else {
    return `
      <div class="text-sm bg-slate-900/70 p-3 rounded border border-slate-700 min-h-[60px] flex items-center justify-center">
        ${renderPreview(item.code)}
      </div>
    `;
  }
};

// Category management
export const toggleCategory = (categoryKey, activeCategories, setActiveCategories) => {
  setActiveCategories(prev => {
    if (prev.includes(categoryKey)) {
      return prev.filter(cat => cat !== categoryKey);
    } else {
      return [...prev, categoryKey];
    }
  });
};

export const selectAllCategories = (setActiveCategories) => {
  setActiveCategories(Object.keys(categories));
};

export const clearAllCategories = (setActiveCategories) => {
  setActiveCategories([]);
};

// Copy to clipboard
export const copyToClipboard = (code, id, setCopiedCode) => {
  navigator.clipboard.writeText(code);
  setCopiedCode(id);
  setTimeout(() => setCopiedCode(''), 2000);
};