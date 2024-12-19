const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

// Image optimization settings
const IMAGE_SETTINGS = {
  small: { width: 200, height: 200 },
  medium: { width: 400, height: 400 },
  large: { width: 800, height: 800 }
};

// Function to optimize and save image in multiple sizes
async function optimizeAndSaveImage(inputBuffer, basePath, filename) {
  const results = {};
  
  for (const [size, dimensions] of Object.entries(IMAGE_SETTINGS)) {
    const outputDir = path.join(basePath, size);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, filename);
    await sharp(inputBuffer)
      .resize(dimensions.width, dimensions.height, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    results[size] = `assets/products/${size}/${filename}`;
  }

  return results;
}

// Function to download image and get buffer
async function downloadImageBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download: ${response.status}`);
  return await response.buffer();
}

// Function to scrape additional product data
async function scrapeAdditionalData() {
  const additionalProducts = [];

  try {
    // Scrape from Open Food Facts API
    const categories = ['fruits', 'vegetables', 'dairy', 'meat', 'snacks'];
    for (const category of categories) {
      const response = await axios.get(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${category}&search_simple=1&action=process&json=1&page_size=10`
      );

      if (response.data && response.data.products) {
        for (const product of response.data.products) {
          if (product.product_name && product.image_url) {
            additionalProducts.push({
              name: product.product_name,
              category: mapCategory(category),
              image: product.image_url,
              nutritionalInfo: {
                servingSize: product.serving_size || '100g',
                calories: parseFloat(product.nutriments['energy-kcal_100g']) || 0,
                protein: parseFloat(product.nutriments.proteins_100g) || 0,
                carbs: parseFloat(product.nutriments.carbohydrates_100g) || 0,
                fat: parseFloat(product.nutriments.fat_100g) || 0,
                fiber: parseFloat(product.nutriments.fiber_100g) || 0,
                sugar: parseFloat(product.nutriments.sugars_100g) || 0
              },
              ingredients: product.ingredients_text,
              allergens: product.allergens_tags?.map(a => a.replace('en:', '')),
              isOrganic: product.labels_tags?.includes('en:organic'),
              origin: product.origins
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error scraping additional data:', error.message);
  }

  return additionalProducts;
}

// Function to map external categories to our categories
function mapCategory(externalCategory) {
  const categoryMap = {
    'fruits': 'Fresh Produce',
    'vegetables': 'Fresh Produce',
    'dairy': 'Dairy & Eggs',
    'meat': 'Meat & Seafood',
    'snacks': 'Snacks'
  };
  return categoryMap[externalCategory] || 'Other';
}

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

// Previous helper functions remain the same...
// ... (storage, shelf life, preparation, certifications, allergens)

// Main function to process products
async function processProducts() {
  console.log('Starting enhanced product processing...');

  // Create necessary directories
  const baseDir = path.join(__dirname, '..', 'assets', 'products');
  Object.keys(IMAGE_SETTINGS).forEach(size => {
    const sizeDir = path.join(baseDir, size);
    if (!fs.existsSync(sizeDir)) {
      fs.mkdirSync(sizeDir, { recursive: true });
    }
  });

  // Generate base products
  const { products: baseProducts, categories } = generateProducts();

  // Scrape additional products
  console.log('Scraping additional product data...');
  const additionalProducts = await scrapeAdditionalData();

  // Merge products
  const allProducts = [...baseProducts, ...additionalProducts];

  // Process images for all products
  console.log('Processing product images...');
  for (const product of allProducts) {
    try {
      if (product.image && product.image.startsWith('http')) {
        const imageBuffer = await downloadImageBuffer(product.image);
        const filename = `${sanitizeFilename(product.name)}.jpg`;
        
        // Optimize and save in multiple sizes
        const imagePaths = await optimizeAndSaveImage(imageBuffer, baseDir, filename);
        product.images = imagePaths;
        product.image = imagePaths.medium; // Set medium as default image
      }
    } catch (error) {
      console.error(`Failed to process image for ${product.name}:`, error.message);
      product.image = 'assets/products/placeholder.jpg';
      product.images = {
        small: 'assets/products/placeholder.jpg',
        medium: 'assets/products/placeholder.jpg',
        large: 'assets/products/placeholder.jpg'
      };
    }
  }

  // Generate final data structure
  const categorizedProducts = {};
  for (const [category, data] of Object.entries(categories)) {
    categorizedProducts[category] = {
      subcategories: data.subcategories,
      items: allProducts.filter(p => p.category === category)
    };
  }

  // Save the data
  const outputPath = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const outputFile = path.join(outputPath, 'products.ts');
  const fileContent = `// Generated on ${new Date().toISOString()}
export const products = ${JSON.stringify(allProducts, null, 2)};
export const categorizedProducts = ${JSON.stringify(categorizedProducts, null, 2)};
`;

  fs.writeFileSync(outputFile, fileContent);
  console.log(`
Enhanced data processing complete!
Total products: ${allProducts.length}
Total categories: ${Object.keys(categories).length}
Images processed in sizes: ${Object.keys(IMAGE_SETTINGS).join(', ')}
`);
}

// Run the script
processProducts().catch(console.error);
