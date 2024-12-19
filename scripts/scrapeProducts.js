const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to generate badges
function generateBadges(product) {
  const badges = [];
  if (product.isOrganic) {
    badges.push({ type: 'organic', label: 'Organic', color: '#2ecc71' });
  }
  if (product.isLocal) {
    badges.push({ type: 'local', label: 'Local', color: '#3498db' });
  }
  if (product.isSeasonal) {
    badges.push({ type: 'seasonal', label: 'In Season', color: '#e67e22' });
  }
  if (product.discount > 0) {
    badges.push({ type: 'sale', label: `${product.discount}% Off`, color: '#e74c3c' });
  }
  if (product.isSpecialty) {
    badges.push({ type: 'specialty', label: 'Specialty', color: '#9b59b6' });
  }
  if (product.isFeatured) {
    badges.push({ type: 'featured', label: 'Featured', color: '#f1c40f' });
  }
  return badges;
}

// Function to generate storage instructions
function generateStorage(category) {
  const storage = {
    'Fresh Produce': [
      'Store in the refrigerator crisper drawer',
      'Keep at room temperature until ripe',
      'Store in a cool, dark place'
    ],
    'Dairy & Eggs': [
      'Keep refrigerated at 40°F or below',
      'Store in the original container',
      'Keep away from strong-smelling foods'
    ],
    'Meat & Seafood': [
      'Keep refrigerated at 40°F or below',
      'Use or freeze within 3 days of purchase',
      'Store in the coldest part of your refrigerator'
    ],
    'Bakery': [
      'Store in a cool, dry place',
      'Keep in an airtight container',
      'Freeze for extended shelf life'
    ],
    'Pantry': [
      'Store in a cool, dry place',
      'Keep in an airtight container after opening',
      'Protect from direct sunlight'
    ],
    'Beverages': [
      'Store in a cool, dry place',
      'Refrigerate after opening',
      'Keep away from direct sunlight'
    ],
    'Snacks': [
      'Store in a cool, dry place',
      'Keep sealed in original packaging',
      'Store in an airtight container after opening'
    ],
    'Frozen Foods': [
      'Keep frozen at 0°F or below',
      'Do not refreeze after thawing',
      'Use within recommended timeframe'
    ]
  };
  return storage[category][Math.floor(Math.random() * storage[category].length)];
}

// Function to generate shelf life
function generateShelfLife(category, isFresh = false) {
  const shelfLife = {
    'Fresh Produce': isFresh ? '3-5 days' : '7-10 days',
    'Dairy & Eggs': '2-3 weeks',
    'Meat & Seafood': '3-5 days',
    'Bakery': '5-7 days',
    'Pantry': '12-18 months',
    'Beverages': '12 months',
    'Snacks': '6-8 months',
    'Frozen Foods': '6-8 months'
  };
  return shelfLife[category];
}

// Function to generate preparation suggestions
function generatePreparation(name, category) {
  const prep = {
    'Fresh Produce': [
      'Wash thoroughly before use',
      'Cut into desired size',
      'Can be eaten raw or cooked',
      'Great for salads and smoothies'
    ],
    'Dairy & Eggs': [
      'Bring to room temperature before use',
      'Shake well before use',
      'Perfect for baking and cooking'
    ],
    'Meat & Seafood': [
      'Thaw in refrigerator overnight',
      'Season before cooking',
      'Cook to recommended internal temperature',
      'Let rest before serving'
    ],
    'Bakery': [
      'Warm in oven for best taste',
      'Toast lightly',
      'Serve at room temperature'
    ]
  };
  
  return prep[category] ? 
    prep[category].slice(0, 2 + Math.floor(Math.random() * 2)) : 
    ['Ready to serve', 'Follow package instructions'];
}

// Function to generate certifications
function generateCertifications(isOrganic, isSpecialty) {
  const certs = [];
  if (isOrganic) {
    certs.push('USDA Organic');
  }
  if (Math.random() > 0.7) {
    certs.push('Non-GMO Project Verified');
  }
  if (isSpecialty && Math.random() > 0.5) {
    certs.push('Fair Trade Certified');
  }
  return certs;
}

// Function to generate allergens
function generateAllergens(category, name) {
  const commonAllergens = {
    'Dairy & Eggs': ['milk', 'eggs'],
    'Bakery': ['wheat', 'milk', 'eggs', 'soy'],
    'Snacks': ['nuts', 'soy', 'wheat'],
    'Pantry': ['wheat', 'soy']
  };
  
  return commonAllergens[category] || [];
}

// Function to generate a realistic description
function generateDescription(name, category, isOrganic = false, isLocal = false) {
  const qualityTerms = ['Premium quality', 'Hand-selected', 'Fresh', 'High-quality'];
  const organicTerms = isOrganic ? ['organic', 'pesticide-free', 'naturally grown'] : [];
  const localTerms = isLocal ? ['locally sourced', 'from local farmers'] : [];
  const term = qualityTerms[Math.floor(Math.random() * qualityTerms.length)];
  
  let description = `${term} ${name.toLowerCase()}`;
  if (isOrganic) {
    description += `, ${organicTerms[Math.floor(Math.random() * organicTerms.length)]}`;
  }
  if (isLocal) {
    description += `, ${localTerms[Math.floor(Math.random() * localTerms.length)]}`;
  }

  switch(category) {
    case 'Fresh Produce':
      description += '. Carefully selected for optimal ripeness and flavor.';
      break;
    case 'Dairy & Eggs':
      description += '. Sourced from trusted farms with high standards of quality.';
      break;
    case 'Meat & Seafood':
      description += '. Expertly cut and prepared for the best cooking experience.';
      break;
    case 'Bakery':
      description += '. Freshly baked daily using traditional recipes.';
      break;
    case 'Pantry':
      description += '. Essential ingredients for your kitchen.';
      break;
    case 'Beverages':
      description += '. Perfect for refreshment and enjoyment.';
      break;
    case 'Snacks':
      description += '. Great for snacking and sharing.';
      break;
    case 'Frozen Foods':
      description += '. Flash-frozen to preserve freshness and nutrients.';
      break;
    default:
      description += '. Carefully selected for our customers.';
  }
  return description;
}

// Function to generate unit and package size
function generateUnit(name, category) {
  const units = {
    'Fresh Produce': ['lb', 'oz', 'piece', 'bunch', 'pack'],
    'Dairy & Eggs': ['gal', 'qt', 'oz', 'dozen', 'pack'],
    'Meat & Seafood': ['lb', 'oz', 'piece', 'pack'],
    'Bakery': ['piece', 'pack', 'loaf', 'dozen'],
    'Pantry': ['oz', 'lb', 'pack', 'jar', 'can'],
    'Beverages': ['fl oz', 'pack', 'bottle', 'can'],
    'Snacks': ['oz', 'pack', 'bar', 'bag'],
    'Frozen Foods': ['oz', 'pack', 'box', 'bag'],
    'Organic': ['lb', 'oz', 'piece', 'bunch', 'pack'],
    'Local': ['lb', 'oz', 'piece', 'bunch', 'pack'],
  };

  const unit = units[category][Math.floor(Math.random() * units[category].length)];
  const size = Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 1 : (Math.floor(Math.random() * 160) + 4) / 10;
  
  return { unit, size };
}

// Function to generate nutritional info
function generateNutritionalInfo() {
  return {
    servingSize: `${Math.floor(Math.random() * 200 + 50)}g`,
    calories: Math.floor(Math.random() * 400 + 50),
    protein: Math.floor(Math.random() * 30),
    carbs: Math.floor(Math.random() * 50),
    fat: Math.floor(Math.random() * 20),
    fiber: Math.floor(Math.random() * 10),
    sugar: Math.floor(Math.random() * 15)
  };
}

// Function to sanitize filename
function sanitizeFilename(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Function to download and save image locally
async function downloadImage(url, productName, category) {
  const assetsDir = path.join(__dirname, '..', 'assets', 'products', category.toLowerCase());
  
  // Create category directory if it doesn't exist
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Generate unique filename
  const filename = `${sanitizeFilename(productName)}.jpg`;
  const filepath = path.join(assetsDir, filename);

  // Skip if file already exists
  if (fs.existsSync(filepath)) {
    console.log(`Image already exists for ${productName}`);
    return `assets/products/${category.toLowerCase()}/${filename}`;
  }

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => {
            console.log(`Downloaded image for ${productName}`);
            resolve(`assets/products/${category.toLowerCase()}/${filename}`);
          });
      } else {
        response.resume();
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

// Function to download all product images
async function downloadAllImages(products) {
  console.log('Downloading product images...');
  
  for (const product of products) {
    try {
      const localPath = await downloadImage(product.image, product.name, product.category);
      product.image = localPath; // Update image path to local reference
    } catch (error) {
      console.error(`Failed to download image for ${product.name}:`, error.message);
      product.image = 'assets/products/placeholder.jpg'; // Use placeholder for failed downloads
    }
  }
}

// Function to generate realistic product data
function generateProducts() {
  const categories = {
    'Fresh Produce': {
      subcategories: ['Fruits', 'Vegetables', 'Herbs', 'Organic', 'Salads', 'Seasonal', 'Local Farm', 'Exotic'],
      items: [
        { 
          name: 'Organic Bananas',
          price: 2.99,
          image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80',
          isOrganic: true,
          isSeasonal: true,
          season: 'all',
          origin: 'Ecuador'
        },
        { name: 'Fresh Strawberries', price: 4.99, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&q=80', isLocal: true },
        { name: 'Avocados', price: 1.99, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&q=80' },
        { name: 'Baby Spinach', price: 3.49, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80', isOrganic: true },
        { name: 'Red Bell Peppers', price: 1.49, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80', isLocal: true },
        { name: 'Fresh Basil', price: 2.99, image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=500&q=80', isOrganic: true },
        { name: 'Organic Carrots', price: 1.99, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80', isOrganic: true },
        { name: 'Honeycrisp Apples', price: 3.99, image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?w=500&q=80', isLocal: true },
        { name: 'Cherry Tomatoes', price: 2.99, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&q=80', isOrganic: true }
      ]
    },
    'Dairy & Eggs': {
      subcategories: ['Milk', 'Cheese', 'Yogurt', 'Eggs', 'Butter', 'Plant-Based', 'Organic'],
      items: [
        { name: 'Organic Whole Milk', price: 4.99, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80', isOrganic: true },
        { name: 'Large Brown Eggs', price: 5.99, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&q=80' },
        { name: 'Greek Yogurt', price: 1.99, image: 'https://images.unsplash.com/photo-1584278860047-22db9ff82bed?w=500&q=80' },
        { name: 'Cheddar Cheese', price: 3.99, image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=500&q=80' },
        { name: 'Almond Milk', price: 3.99, image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=500&q=80' },
        { name: 'Butter Sticks', price: 4.49, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80' }
      ]
    },
    'Meat & Seafood': {
      subcategories: ['Beef', 'Chicken', 'Pork', 'Fish', 'Organic Meat', 'Premium Cuts', 'Grass-Fed'],
      items: [
        { name: 'Ground Beef 93% Lean', price: 6.99, image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500&q=80' },
        { name: 'Chicken Breast', price: 5.99, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=80' },
        { name: 'Atlantic Salmon', price: 12.99, image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=500&q=80' },
        { name: 'Pork Chops', price: 7.99, image: 'https://images.unsplash.com/photo-1432139509613-7c4255815697?w=500&q=80' },
        { name: 'Ribeye Steak', price: 15.99, image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=500&q=80' },
        { name: 'Organic Chicken Wings', price: 8.99, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80', isOrganic: true }
      ]
    },
    'Bakery': {
      subcategories: ['Bread', 'Pastries', 'Cakes', 'Rolls', 'Gluten-Free', 'Artisan', 'Organic'],
      items: [
        { name: 'Whole Grain Bread', price: 3.99, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80' },
        { name: 'Croissants', price: 4.99, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80' },
        { name: 'Bagels', price: 3.49, image: 'https://images.unsplash.com/photo-1585445490387-f47934b73b54?w=500&q=80' },
        { name: 'Chocolate Muffins', price: 4.49, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&q=80' },
        { name: 'Sourdough Bread', price: 5.99, image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=500&q=80' }
      ]
    },
    'Pantry': {
      subcategories: ['Pasta', 'Canned Goods', 'Rice', 'Condiments', 'Baking', 'Oils', 'Organic'],
      items: [
        { name: 'Spaghetti Pasta', price: 1.99, image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500&q=80' },
        { name: 'Tomato Sauce', price: 2.49, image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&q=80' },
        { name: 'Black Beans', price: 0.99, image: 'https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=500&q=80' },
        { name: 'Jasmine Rice', price: 4.99, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80' },
        { name: 'Extra Virgin Olive Oil', price: 8.99, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80' },
        { name: 'Organic Honey', price: 6.99, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80', isOrganic: true }
      ]
    },
    'Beverages': {
      subcategories: ['Water', 'Juice', 'Soda', 'Coffee', 'Tea', 'Energy Drinks', 'Organic'],
      items: [
        { name: 'Spring Water 24pk', price: 4.99, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&q=80' },
        { name: 'Orange Juice', price: 3.99, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80' },
        { name: 'Cola 12pk', price: 5.99, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80' },
        { name: 'Ground Coffee', price: 7.99, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80' },
        { name: 'Green Tea', price: 4.49, image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=500&q=80' }
      ]
    },
    'Snacks': {
      subcategories: ['Chips', 'Nuts', 'Crackers', 'Candy', 'Popcorn', 'Health Snacks', 'Organic'],
      items: [
        { name: 'Potato Chips', price: 3.49, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&q=80' },
        { name: 'Mixed Nuts', price: 6.99, image: 'https://images.unsplash.com/photo-1536591375315-1b8c0fb3726e?w=500&q=80' },
        { name: 'Dark Chocolate Bar', price: 2.99, image: 'https://images.unsplash.com/photo-1548907040-4b7bb135bc9d?w=500&q=80' },
        { name: 'Trail Mix', price: 4.99, image: 'https://images.unsplash.com/photo-1556040220-4096d522378d?w=500&q=80' },
        { name: 'Protein Bars', price: 5.99, image: 'https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=500&q=80' }
      ]
    },
    'Frozen Foods': {
      subcategories: ['Ice Cream', 'Frozen Meals', 'Pizza', 'Vegetables', 'Desserts', 'Organic'],
      items: [
        { name: 'Vanilla Ice Cream', price: 4.99, image: 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=500&q=80' },
        { name: 'Frozen Pizza', price: 5.99, image: 'https://images.unsplash.com/photo-1513104890138-7c4255815697?w=500&q=80' },
        { name: 'Mixed Vegetables', price: 2.99, image: 'https://images.unsplash.com/photo-1571051549906-a659132bb363?w=500&q=80' },
        { name: 'Ice Cream Bars', price: 5.49, image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=500&q=80' },
        { name: 'Frozen Berries', price: 4.49, image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&q=80' }
      ]
    }
  };

  let products = [];
  let id = 1;

  for (const [category, data] of Object.entries(categories)) {
    for (const item of data.items) {
      const originalPrice = item.price;
      const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 20 + 5) : 0;
      const price = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
      const { unit, size } = generateUnit(item.name, category);
      const isSpecialty = Math.random() > 0.8;

      const product = {
        id: id.toString(),
        name: item.name,
        category,
        subcategory: data.subcategories[Math.floor(Math.random() * data.subcategories.length)],
        price: parseFloat(price.toFixed(2)),
        originalPrice: originalPrice,
        description: generateDescription(item.name, category, item.isOrganic, item.isLocal),
        image: item.image,
        unit,
        size,
        inStock: Math.random() > 0.1,
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        reviews: Math.floor(Math.random() * 200 + 50),
        discount,
        nutritionalInfo: {
          ...generateNutritionalInfo(),
          allergens: generateAllergens(category, item.name)
        },
        isOrganic: !!item.isOrganic,
        isLocal: !!item.isLocal,
        isFeatured: Math.random() > 0.8,
        isSeasonal: !!item.isSeasonal,
        isSpecialty,
        season: item.season || undefined,
        tags: [
          ...(item.isOrganic ? ['organic'] : []),
          ...(item.isLocal ? ['local'] : []),
          ...(item.isSeasonal ? ['seasonal'] : []),
          ...(isSpecialty ? ['specialty'] : []),
          category.toLowerCase(),
          'popular'
        ],
        origin: item.origin,
        preparation: generatePreparation(item.name, category),
        storage: generateStorage(category),
        shelfLife: generateShelfLife(category, item.isSeasonal),
        certifications: generateCertifications(item.isOrganic, isSpecialty),
        relatedProducts: [] // Will be populated after all products are generated
      };

      product.badges = generateBadges(product);
      products.push(product);
      id++;
    }
  }

  // Add related products
  products.forEach(product => {
    const sameCategoryProducts = products.filter(p => 
      p.category === product.category && p.id !== product.id
    );
    product.relatedProducts = sameCategoryProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map(p => p.id);
  });

  return { products, categories };
}

// Main function to generate and save product data
async function main() {
  console.log('Generating product data...');
  
  // Create placeholder image if it doesn't exist
  const placeholderPath = path.join(__dirname, '..', 'assets', 'products', 'placeholder.jpg');
  if (!fs.existsSync(placeholderPath)) {
    const placeholderDir = path.dirname(placeholderPath);
    if (!fs.existsSync(placeholderDir)) {
      fs.mkdirSync(placeholderDir, { recursive: true });
    }
    // Copy a default placeholder image or create a simple one
    fs.copyFileSync(path.join(__dirname, 'placeholder.jpg'), placeholderPath);
  }

  // Generate products
  const { products, categories } = generateProducts();
  
  // Download all images
  await downloadAllImages(products);

  // Generate categorized products
  const categorizedProducts = {};
  for (const [category, data] of Object.entries(categories)) {
    categorizedProducts[category] = {
      subcategories: data.subcategories,
      items: products.filter(p => p.category === category)
    };
  }

  // Save the data
  const outputPath = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const outputFile = path.join(outputPath, 'products.ts');
  const fileContent = `// Generated on ${new Date().toISOString()}
export const products = ${JSON.stringify(products, null, 2)};
export const categorizedProducts = ${JSON.stringify(categorizedProducts, null, 2)};
`;

  fs.writeFileSync(outputFile, fileContent);
  console.log(`Data processing complete!\nTotal products: ${products.length}\nTotal categories: ${Object.keys(categories).length}`);
}

// Run the script
main().catch(console.error);
