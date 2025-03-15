import fs from 'fs';
import path from 'path';

interface AspectValue {
  localizedValue: string;
  valueConstraints?: Array<{
    applicableForLocalizedAspectName: string;
    applicableForLocalizedAspectValues: string[];
  }>;
}

interface Aspect {
  localizedAspectName: string;
  aspectConstraint: {
    aspectDataType: string;
    itemToAspectCardinality: string;
    aspectMode: string;
    aspectRequired: boolean;
    aspectUsage: string;
    aspectEnabledForVariations: boolean;
  };
  aspectValues: AspectValue[];
}

function isPokemonRelated(aspect: Aspect): boolean {
  if (!aspect.aspectValues) return false;
  
  // Check if any values have Pokemon-specific constraints
  return aspect.aspectValues.some(value => {
    if (!value.valueConstraints) return false;
    
    return value.valueConstraints.some(constraint =>
      constraint.applicableForLocalizedAspectName === "Card Type" &&
      constraint.applicableForLocalizedAspectValues?.includes("Pokémon")
    );
  });
}

async function extractPokemonAspects() {
  try {
    // Read the original file
    const filePath = path.join(__dirname, '../sample-responses/aspects-for-category.json');
    const rawData = await fs.promises.readFile(filePath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log('Reading aspects file...');
    
    if (!data.aspects) {
      throw new Error('No aspects found in file');
    }

    // Filter for Pokemon-related aspects
    console.log(`Processing ${data.aspects.length} aspects...`);
    const pokemonAspects = data.aspects.filter(isPokemonRelated);
    
    console.log(`Found ${pokemonAspects.length} Pokemon-related aspects`);

    // Create a more focused structure
    const extractedData = {
      category: "Pokemon Card Singles",
      categoryId: "183454",
      aspects: pokemonAspects.map(aspect => ({
        name: aspect.localizedAspectName,
        type: aspect.aspectConstraint.aspectDataType,
        required: aspect.aspectConstraint.aspectRequired,
        cardinality: aspect.aspectConstraint.itemToAspectCardinality,
        values: aspect.aspectValues
          .filter(value => {
            if (!value.valueConstraints) return false;
            return value.valueConstraints.some(c => 
              c.applicableForLocalizedAspectValues?.includes("Pokémon")
            );
          })
          .map(value => value.localizedValue)
      }))
    };

    // Write to new file
    const outputPath = path.join(__dirname, '../sample-responses/pokemon-aspects.json');
    await fs.promises.writeFile(
      outputPath, 
      JSON.stringify(extractedData, null, 2)
    );

    console.log('Successfully extracted Pokemon aspects to pokemon-aspects.json');
  } catch (error) {
    console.error('Failed to extract Pokemon aspects:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', error.stack);
    }
  }
}

// Run the extraction
extractPokemonAspects(); 