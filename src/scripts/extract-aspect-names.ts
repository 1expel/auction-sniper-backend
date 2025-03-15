import fs from 'fs';
import path from 'path';

async function extractAspectNames() {
  try {
    // Read the original file
    const filePath = path.join(__dirname, '../sample-responses/aspects-for-category.json');
    const rawData = await fs.promises.readFile(filePath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log('Reading aspects file...');
    
    if (!data.aspects) {
      throw new Error('No aspects found in file');
    }

    // Extract all unique aspect names
    const aspectNames = data.aspects.map(aspect => aspect.localizedAspectName);
    
    // Sort alphabetically
    aspectNames.sort();

    console.log('\nFound aspect names:');
    console.log('------------------');
    aspectNames.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });
    console.log(`\nTotal: ${aspectNames.length} aspects`);

    // Write to new file
    const outputPath = path.join(__dirname, '../sample-responses/aspect-names.json');
    await fs.promises.writeFile(
      outputPath, 
      JSON.stringify({ aspectNames }, null, 2)
    );

    console.log('\nSuccessfully saved to aspect-names.json');
  } catch (error) {
    console.error('Failed to extract aspect names:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.stack);
    }
  }
}

// Run the extraction
extractAspectNames();