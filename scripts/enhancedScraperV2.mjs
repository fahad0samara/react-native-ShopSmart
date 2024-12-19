import axios from 'axios';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enhanced image optimization settings
const IMAGE_SETTINGS = {
  thumbnail: { width: 100, height: 100, quality: 70 },
  small: { width: 200, height: 200, quality: 75 },
  medium: { width: 400, height: 400, quality: 80 },
  large: { width: 800, height: 800, quality: 85 },
  original: { width: null, height: null, quality: 90 }
};

// Additional data sources
const DATA_SOURCES = {
  openFoodFacts: 'https://world.openfoodfacts.org/cgi/search.pl',
  spoonacular: 'https://api.spoonacular.com/food/products/search',
  edamam: 'https://api.edamam.com/api/food-database/v2/parser'
};

// Extended categories with rich metadata
const EXTENDED_CATEGORIES = {
  'Fresh Produce': {
    subcategories: ['Fruits', 'Vegetables', 'Herbs', 'Organic', 'Salads', 'Seasonal', 'Local Farm', 'Exotic'],
    defaultMetadata: {
      storageType: 'refrigerated',
      department: 'produce',
      handlingInstructions: 'Keep refrigerated at 34-40°F'
    }
  },
  'Dairy & Eggs': {
    subcategories: ['Milk', 'Cheese', 'Yogurt', 'Eggs', 'Butter', 'Plant-Based', 'Cream', 'Specialty Cheese'],
    defaultMetadata: {
      storageType: 'refrigerated',
      department: 'dairy',
      handlingInstructions: 'Keep refrigerated at 34-40°F'
    }
  },
  'Meat & Seafood': {
    subcategories: ['Beef', 'Pork', 'Poultry', 'Fish', 'Shellfish', 'Organic Meat', 'Plant-Based', 'Prepared'],
    defaultMetadata: {
      storageType: 'refrigerated',
      department: 'meat',
      handlingInstructions: 'Keep refrigerated at 32-34°F'
    }
  },
  'Bakery': {
    subcategories: ['Bread', 'Pastries', 'Cakes', 'Cookies', 'Gluten-Free', 'Organic', 'Artisanal', 'Seasonal'],
    defaultMetadata: {
      storageType: 'room temperature',
      department: 'bakery',
      handlingInstructions: 'Store in a cool, dry place'
    }
  },
  'Pantry': {
    subcategories: ['Pasta', 'Rice', 'Canned Goods', 'Oils', 'Spices', 'Baking', 'International', 'Organic'],
    defaultMetadata: {
      storageType: 'shelf-stable',
      department: 'grocery',
      handlingInstructions: 'Store in a cool, dry place'
    }
  },
  'Beverages': {
    subcategories: ['Water', 'Soda', 'Coffee', 'Tea', 'Juice', 'Energy Drinks', 'Sports Drinks', 'Alcohol-Free'],
    defaultMetadata: {
      storageType: 'room temperature',
      department: 'beverages',
      handlingInstructions: 'Store in a cool, dry place'
    }
  },
  'Snacks': {
    subcategories: ['Chips', 'Nuts', 'Crackers', 'Candy', 'Chocolate', 'Healthy', 'Organic', 'Seasonal'],
    defaultMetadata: {
      storageType: 'shelf-stable',
      department: 'snacks',
      handlingInstructions: 'Store in a cool, dry place'
    }
  },
  'Frozen Foods': {
    subcategories: ['Meals', 'Vegetables', 'Fruits', 'Ice Cream', 'Pizza', 'Meat', 'Seafood', 'Desserts'],
    defaultMetadata: {
      storageType: 'frozen',
      department: 'frozen',
      handlingInstructions: 'Keep frozen at 0°F or below'
    }
  },
  'International': {
    subcategories: ['Asian', 'Mexican', 'Italian', 'Indian', 'Middle Eastern', 'European', 'Latin', 'African'],
    defaultMetadata: {
      storageType: 'varies',
      department: 'international',
      handlingInstructions: 'See package for storage instructions'
    }
  },
  'Health & Wellness': {
    subcategories: ['Vitamins', 'Supplements', 'Protein', 'Organic', 'Gluten-Free', 'Vegan', 'Sugar-Free', 'Natural'],
    defaultMetadata: {
      storageType: 'shelf-stable',
      department: 'health',
      handlingInstructions: 'Store in a cool, dry place'
    }
  }
};

// Enhanced image processing with watermark and metadata
async function processImage(inputBuffer, settings, productInfo) {
  const image = sharp(inputBuffer);
  
  // Add watermark if it's not a thumbnail
  if (settings.width > 100) {
    const watermark = await sharp({
      text: {
        text: 'Your Grocery Store',
        font: 'Arial',
        fontSize: Math.floor(settings.width / 20),
        rgba: true
      }
    }).toBuffer();
    
    image.composite([
      { input: watermark, gravity: 'southeast', blend: 'over' }
    ]);
  }

  // Resize and optimize
  if (settings.width && settings.height) {
    image.resize(settings.width, settings.height, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    });
  }

  // Add metadata
  image.withMetadata({
    exif: {
      IFD0: {
        Copyright: 'Your Grocery Store',
        ImageDescription: productInfo.name,
        Software: 'Enhanced Grocery Scraper'
      }
    }
  });

  return image.jpeg({ quality: settings.quality }).toBuffer();
}

// Enhanced product data scraping
async function scrapeProductData(category) {
  const products = [];
  
  // Open Food Facts API
  try {
    const response = await axios.get(DATA_SOURCES.openFoodFacts, {
      params: {
        search_terms: category,
        search_simple: 1,
        action: 'process',
        json: 1,
        page_size: 20
      }
    });

    if (response.data?.products) {
      for (const product of response.data.products) {
        if (product.product_name && product.image_url) {
          const nutritionalInfo = {
            servingSize: product.serving_size || '100g',
            calories: parseFloat(product.nutriments['energy-kcal_100g']) || 0,
            protein: parseFloat(product.nutriments.proteins_100g) || 0,
            carbs: parseFloat(product.nutriments.carbohydrates_100g) || 0,
            fat: parseFloat(product.nutriments.fat_100g) || 0,
            fiber: parseFloat(product.nutriments.fiber_100g) || 0,
            sugar: parseFloat(product.nutriments.sugars_100g) || 0,
            sodium: parseFloat(product.nutriments.sodium_100g) || 0,
            cholesterol: parseFloat(product.nutriments.cholesterol_100g) || 0
          };

          products.push({
            name: product.product_name,
            brand: product.brands,
            category,
            image: product.image_url,
            nutritionalInfo,
            ingredients: product.ingredients_text,
            allergens: product.allergens_tags?.map(a => a.replace('en:', '')),
            certifications: product.labels_tags?.map(l => l.replace('en:', '')),
            isOrganic: product.labels_tags?.includes('en:organic'),
            origin: product.origins,
            packaging: product.packaging,
            weight: product.quantity,
            preparationTime: '5-10 minutes',
            storageInstructions: EXTENDED_CATEGORIES[category]?.defaultMetadata?.handlingInstructions
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scraping data for ${category}:`, error.message);
  }

  return products;
}

// Main processing function
async function processProducts() {
  console.log('Starting enhanced product processing...');

  // Create directories
  const baseDir = path.join(__dirname, '..', 'assets', 'products');
  Object.keys(IMAGE_SETTINGS).forEach(size => {
    const sizeDir = path.join(baseDir, size);
    if (!fs.existsSync(sizeDir)) {
      fs.mkdirSync(sizeDir, { recursive: true });
    }
  });

  // Process each category
  const allProducts = [];
  for (const [category, metadata] of Object.entries(EXTENDED_CATEGORIES)) {
    console.log(`Processing ${category}...`);
    
    // Scrape products
    const categoryProducts = await scrapeProductData(category);
    
    // Process images
    for (const product of categoryProducts) {
      try {
        if (product.image && product.image.startsWith('http')) {
          const imageResponse = await axios.get(product.image, { responseType: 'arraybuffer' });
          const imageBuffer = Buffer.from(imageResponse.data);
          const filename = `${product.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
          
          // Process images in different sizes
          product.images = {};
          for (const [size, settings] of Object.entries(IMAGE_SETTINGS)) {
            const processedImage = await processImage(imageBuffer, settings, product);
            const outputPath = path.join(baseDir, size, filename);
            await fs.promises.writeFile(outputPath, processedImage);
            product.images[size] = `assets/products/${size}/${filename}`;
          }
          
          product.image = product.images.medium; // Default image
        }
      } catch (error) {
        console.error(`Failed to process image for ${product.name}:`, error.message);
        product.image = 'assets/products/placeholder.jpg';
        product.images = Object.keys(IMAGE_SETTINGS).reduce((acc, size) => {
          acc[size] = 'assets/products/placeholder.jpg';
          return acc;
        }, {});
      }
    }

    allProducts.push(...categoryProducts);
  }

  // Generate final data structure
  const categorizedProducts = {};
  for (const [category, metadata] of Object.entries(EXTENDED_CATEGORIES)) {
    categorizedProducts[category] = {
      ...metadata,
      items: allProducts.filter(p => p.category === category)
    };
  }

  // Save data
  const outputPath = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const outputFile = path.join(outputPath, 'products.ts');
  const fileContent = `// Generated on ${new Date().toISOString()}
export const products = ${JSON.stringify(allProducts, null, 2)};
export const categorizedProducts = ${JSON.stringify(categorizedProducts, null, 2)};
export const categories = ${JSON.stringify(EXTENDED_CATEGORIES, null, 2)};
`;

  await fs.promises.writeFile(outputFile, fileContent);
  console.log(`
Enhanced data processing complete!
Total products: ${allProducts.length}
Total categories: ${Object.keys(EXTENDED_CATEGORIES).length}
Images processed in sizes: ${Object.keys(IMAGE_SETTINGS).join(', ')}
`);
}

// Run the script
processProducts().catch(console.error);
