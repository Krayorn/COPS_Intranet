#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schema definitions for each collection
const SCHEMAS = {
    civilians: {
        name: null,           // string - required
        status: "alive",     // string - required  
        affiliations: [],     // array of strings
        professions: [],      // array of strings
        birth_date: null,     // string or null
        pseudonyms: []        // array of strings
    },
    cases: {
        case_number: null,    // string - required
        name: null,           // string - required
        opened_on: null,      // string - required
        closed_on: null,      // string - required
        status: null,         // string - required
        priority_detective: null, // string - required
        persons_of_interest: [], // array of strings
        assigned_personnel: []    // array of strings
    },
    personal: {
        name: null,           // string - required
        rank: null,           // string - required
        joined_on: null,      // string - required
        status: null,         // string - required
        department: null,     // string - required
        matriculation_number: null, // string - required
        title: "detective",  // string - required, default 'detective'
        pseudonyms: []        // array of strings
    },
    groups: {
        name: null,           // string - required
        parent: null,         // string or null
        description: "",      // string, optional
        leader: null,         // string, optional (personnel id)
        members: []           // array of strings (personnel ids)
    }
};

function updateFile(filePath, collectionType) {
    try {
        // Read the current file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        
        let updated = false;
        const updatedData = { ...data };
        const schema = SCHEMAS[collectionType];
        
        // Check each expected field
        for (const [field, defaultValue] of Object.entries(schema)) {
            if (!(field in updatedData)) {
                console.log(`  Adding missing field: ${field} = ${JSON.stringify(defaultValue)}`);
                updatedData[field] = defaultValue;
                updated = true;
            }
        }
        
        // Ensure arrays are properly formatted for civilians
        if (collectionType === 'civilians') {
            if (!Array.isArray(updatedData.affiliations)) {
                console.log(`  Fixing affiliations: converting to array`);
                updatedData.affiliations = [];
                updated = true;
            }
            
            if (!Array.isArray(updatedData.professions)) {
                console.log(`  Fixing professions: converting to array`);
                updatedData.professions = [];
                updated = true;
            }
            
            if (!Array.isArray(updatedData.pseudonyms)) {
                console.log(`  Fixing pseudonyms: converting to array`);
                updatedData.pseudonyms = [];
                updated = true;
            }
        }
        
        // Ensure arrays are properly formatted for cases
        if (collectionType === 'cases') {
            if (!Array.isArray(updatedData.persons_of_interest)) {
                console.log(`  Fixing persons_of_interest: converting to array`);
                updatedData.persons_of_interest = [];
                updated = true;
            }
            
            if (!Array.isArray(updatedData.assigned_personnel)) {
                console.log(`  Fixing assigned_personnel: converting to array`);
                updatedData.assigned_personnel = [];
                updated = true;
            }
        }
        
        // Ensure arrays are properly formatted for personal
        if (collectionType === 'personal') {
            if (!Array.isArray(updatedData.pseudonyms)) {
                console.log(`  Fixing pseudonyms: converting to array`);
                updatedData.pseudonyms = [];
                updated = true;
            }
        }
        
        if (updated) {
            // Write back the updated file with proper formatting
            const updatedContent = JSON.stringify(updatedData, null, 4);
            fs.writeFileSync(filePath, updatedContent + '\n');
            console.log(`  ✓ Updated ${path.basename(filePath)}`);
        } else {
            console.log(`  ✓ ${path.basename(filePath)} already has all required fields`);
        }
        
        return updated;
    } catch (error) {
        console.error(`  ✗ Error processing ${path.basename(filePath)}:`, error.message);
        return false;
    }
}

function processCollection(collectionName) {
    const collectionDir = path.join(__dirname, '..', 'src', 'content', collectionName);
    
    console.log(`\nProcessing ${collectionName} files...`);
    
    try {
        // Check if directory exists
        if (!fs.existsSync(collectionDir)) {
            console.error(`Directory not found: ${collectionDir}`);
            return { processed: 0, updated: 0 };
        }
        
        // Get all JSON files in the collection directory
        const files = fs.readdirSync(collectionDir)
            .filter(file => file.endsWith('.json'))
            .map(file => path.join(collectionDir, file));
        
        if (files.length === 0) {
            console.log(`No ${collectionName} files found.`);
            return { processed: 0, updated: 0 };
        }
        
        console.log(`Found ${files.length} ${collectionName} file(s):\n`);
        
        let updatedCount = 0;
        
        // Process each file
        for (const file of files) {
            console.log(`Processing: ${path.basename(file)}`);
            const wasUpdated = updateFile(file, collectionName);
            if (wasUpdated) {
                updatedCount++;
            }
            console.log(''); // Empty line for readability
        }
        
        return { processed: files.length, updated: updatedCount };
        
    } catch (error) {
        console.error(`Error processing ${collectionName}:`, error.message);
        return { processed: 0, updated: 0 };
    }
}

function main() {
    console.log('Updating content files to match schema requirements...\n');
    
    const collections = ['civilians', 'cases', 'personal', 'groups'];
    const results = {};
    
    // Process each collection
    for (const collection of collections) {
        results[collection] = processCollection(collection);
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('SUMMARY');
    console.log('='.repeat(50));
    
    let totalProcessed = 0;
    let totalUpdated = 0;
    
    for (const [collection, result] of Object.entries(results)) {
        console.log(`${collection}: ${result.updated} updated out of ${result.processed} files`);
        totalProcessed += result.processed;
        totalUpdated += result.updated;
    }
    
    console.log('\n' + '-'.repeat(50));
    console.log(`TOTAL: ${totalUpdated} updated out of ${totalProcessed} files`);
}

// Run the script
main(); 