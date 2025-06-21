const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection URI
const uri = process.env.MONGODB_URI || process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'namal-nexus';

async function mongoClientDemo() {
    const client = new MongoClient(uri);
    
    try {
        console.log('🚀 Starting MongoDB Native Client Demo...\n');
        
        // Connect to MongoDB
        await client.connect();
        console.log('✅ Connected to MongoDB successfully!');
        
        const db = client.db(dbName);
        const collection = db.collection('alumni-demo');
        
        console.log(`📊 Working with database: ${dbName}`);
        console.log(`📁 Working with collection: alumni-demo\n`);
        
        // 1. INSERT OPERATIONS
        console.log('1️⃣ INSERT OPERATIONS');
        console.log('===================');
        
        // Insert one document
        const singleAlumni = {
            name: 'Mariyam Noor UL ain',
            email: 'mariyam@namal.edu.pk',
            graduationYear: 2022,
            degree: 'Computer Science',
            currentPosition: 'Sir mmar ki student',
            company: 'Namal University',
            location: 'Namal in 50 degree heat',
            createdAt: new Date()
        };
        
        const insertResult = await collection.insertOne(singleAlumni);
        console.log(`✅ Inserted single document with ID: ${insertResult.insertedId}`);
        
        // Insert multiple documents
        const multipleAlumni = [
            {
                name: 'Eshna Eman',
                email: 'eshna_eman@namal.edu.pk',
                graduationYear: 2021,
                degree: 'Business Administration',
                currentPosition: 'Marketing Manager',
                company: 'Global Solutions',
                location: 'Lahore, Pakistan',
                createdAt: new Date()
            },
            {
                name: 'Shazia Nazir',
                email: 'shazia_nazir@namal.edu.pk',
                graduationYear: 2023,
                degree: 'Electrical Engineering',
                currentPosition: 'Project Engineer',
                company: 'PowerTech Industries',
                location: 'Karachi, Pakistan',
                createdAt: new Date()
            },
            {
                name: 'Zunaira Akbar',
                email: 'zaini_cutie@namal.edu.pk',
                graduationYear: 2020,
                degree: 'Economics',
                currentPosition: 'Financial Analyst',
                company: 'Bank Al Habib',
                location: 'Islamabad, Pakistan',
                createdAt: new Date()
            }
        ];
        
        const insertManyResult = await collection.insertMany(multipleAlumni);
        console.log(`✅ Inserted ${insertManyResult.insertedCount} documents`);
        console.log(`   IDs: ${Object.values(insertManyResult.insertedIds).join(', ')}\n`);
        
        // 2. READ OPERATIONS
        console.log('2️⃣ READ OPERATIONS');
        console.log('==================');
        
        // Find all documents
        const allAlumni = await collection.find({}).toArray();
        console.log(`📋 Total alumni in collection: ${allAlumni.length}`);
        
        // Find with filter
        const csAlumni = await collection.find({ degree: 'Computer Science' }).toArray();
        console.log(`💻 Computer Science alumni: ${csAlumni.length}`);
        
        // Find one document
        const oneAlumni = await collection.findOne({ graduationYear: 2022 });
        console.log(`👤 Found alumni from 2022: ${oneAlumni ? oneAlumni.name : 'None'}`);
        
        // Find with projection (select specific fields)
        const namesOnly = await collection.find({}, { 
            projection: { name: 1, graduationYear: 1, _id: 0 } 
        }).toArray();
        console.log('📝 Names and graduation years:');
        namesOnly.forEach(alumni => {
            console.log(`   ${alumni.name} (${alumni.graduationYear})`);
        });
        
        // Find with sorting
        const sortedByYear = await collection.find({})
            .sort({ graduationYear: -1 })
            .limit(3)
            .toArray();
        console.log('\n📅 Latest 3 graduates:');
        sortedByYear.forEach(alumni => {
            console.log(`   ${alumni.name} - ${alumni.graduationYear}`);
        });
        console.log();
        
        // 3. UPDATE OPERATIONS
        console.log('3️⃣ UPDATE OPERATIONS');
        console.log('====================');
        
        // Update one document
        const updateResult = await collection.updateOne(
            { email: 'ahmed.hassan@namal.edu.pk' },
            { 
                $set: { 
                    currentPosition: 'Senior Software Engineer',
                    company: 'Microsoft Pakistan',
                    updatedAt: new Date()
                }
            }
        );
        console.log(`✅ Updated ${updateResult.modifiedCount} document(s)`);
        
        // Update multiple documents
        const updateManyResult = await collection.updateMany(
            { graduationYear: { $gte: 2022 } },
            { 
                $set: { 
                    category: 'Recent Graduate',
                    updatedAt: new Date()
                }
            }
        );
        console.log(`✅ Updated ${updateManyResult.modifiedCount} recent graduates`);
        
        // Upsert operation (update or insert)
        const upsertResult = await collection.updateOne(
            { email: 'new.alumni@namal.edu.pk' },
            { 
                $set: {
                    name: 'New Alumni',
                    email: 'new.alumni@namal.edu.pk',
                    graduationYear: 2024,
                    degree: 'Mathematics',
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );
        console.log(`✅ Upsert operation - Inserted: ${upsertResult.upsertedCount}, Modified: ${upsertResult.modifiedCount}\n`);
        
        // 4. ADVANCED QUERIES
        console.log('4️⃣ ADVANCED QUERIES');
        console.log('===================');
        
        // Range query
        const recentGrads = await collection.find({
            graduationYear: { $gte: 2021, $lte: 2023 }
        }).toArray();
        console.log(`🎓 Alumni graduated between 2021-2023: ${recentGrads.length}`);
        
        // Text search (requires text index)
        try {
            await collection.createIndex({ name: 'text', company: 'text' });
            const searchResults = await collection.find({
                $text: { $search: 'Engineer' }
            }).toArray();
            console.log(`🔍 Text search for 'Engineer': ${searchResults.length} results`);
        } catch (error) {
            console.log('ℹ️  Text search skipped (index may already exist)');
        }
        
        // Aggregation-like query using find
        const groupedByDegree = {};
        allAlumni.forEach(alumni => {
            if (!groupedByDegree[alumni.degree]) {
                groupedByDegree[alumni.degree] = 0;
            }
            groupedByDegree[alumni.degree]++;
        });
        
        console.log('📊 Alumni count by degree:');
        Object.entries(groupedByDegree).forEach(([degree, count]) => {
            console.log(`   ${degree}: ${count}`);
        });
        console.log();
        
        // 5. DELETE OPERATIONS
        console.log('5️⃣ DELETE OPERATIONS');
        console.log('====================');
        
        // Delete one document
        const deleteResult = await collection.deleteOne({
            email: 'new.alumni@namal.edu.pk'
        });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} document`);
        
        // Delete multiple documents (let's delete test data)
        const deleteManyResult = await collection.deleteMany({
            email: { $regex: '@namal.edu.pk$' }
        });
        console.log(`🗑️  Deleted ${deleteManyResult.deletedCount} test documents`);
        
        // Final count
        const finalCount = await collection.countDocuments();
        console.log(`📊 Final document count: ${finalCount}\n`);
        
        console.log('✅ MongoDB Native Client Demo completed successfully!');
        
    } catch (error) {
        console.error('❌ Error in MongoDB operations:', error);
    } finally {
        // Close the connection
        await client.close();
        console.log('🔒 MongoDB connection closed');
    }
}

// Run the demo
if (require.main === module) {
    mongoClientDemo().catch(console.error);
}

module.exports = mongoClientDemo;