const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Alumni = require('./models/Alumni');
const Job = require('./models/Job');
const Event = require('./models/Event');

async function seedSampleData() {
    console.log('🌱 Seeding sample data...');
    
    // Clear existing data
    await Alumni.deleteMany({});
    await Job.deleteMany({});
    await Event.deleteMany({});
    
    // Create sample alumni
    const alumni = await Alumni.create([
        {
            name: 'Ahmed Hassan',
            email: 'ahmed.hassan@namal.edu.pk',
            graduationYear: 2020,
            degree: 'Computer Science',
            currentPosition: 'Senior Software Engineer',
            company: 'TechCorp',
            location: 'Islamabad, Pakistan',
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
        },
        {
            name: 'Fatima Khan',
            email: 'fatima.khan@namal.edu.pk',
            graduationYear: 2021,
            degree: 'Business Administration',
            currentPosition: 'Marketing Manager',
            company: 'Global Solutions',
            location: 'Lahore, Pakistan',
            skills: ['Digital Marketing', 'SEO', 'Content Strategy']
        },
        {
            name: 'Ali Raza',
            email: 'ali.raza@namal.edu.pk',
            graduationYear: 2019,
            degree: 'Electrical Engineering',
            currentPosition: 'Project Engineer',
            company: 'PowerTech',
            location: 'Karachi, Pakistan',
            skills: ['Power Systems', 'AutoCAD', 'Project Management']
        },
        {
            name: 'Sara Ahmed',
            email: 'sara.ahmed@namal.edu.pk',
            graduationYear: 2022,
            degree: 'Computer Science',
            currentPosition: 'Data Scientist',
            company: 'DataCorp',
            location: 'Islamabad, Pakistan',
            skills: ['Python', 'Machine Learning', 'Data Analysis']
        },
        {
            name: 'Hassan Ali',
            email: 'hassan.ali@namal.edu.pk',
            graduationYear: 2021,
            degree: 'Economics',
            currentPosition: 'Financial Analyst',
            company: 'Bank Al Habib',
            location: 'Islamabad, Pakistan',
            skills: ['Financial Modeling', 'Excel', 'Risk Analysis']
        },
        {
            name: 'Ayesha Malik',
            email: 'ayesha.malik@namal.edu.pk',
            graduationYear: 2020,
            degree: 'Business Administration',
            currentPosition: 'Product Manager',
            company: 'InnovatePak',
            location: 'Lahore, Pakistan',
            skills: ['Product Strategy', 'Agile', 'User Research']
        }
    ]);
    
    // Create sample jobs
    await Job.create([
        {
            title: 'Full Stack Developer',
            company: 'TechCorp',
            location: 'Islamabad, Pakistan',
            description: 'Looking for experienced full stack developer',
            jobType: 'Full-time',
            experienceLevel: 'Mid Level',
            category: 'Technology',
            postedBy: alumni[0]._id,
            applicationEmail: 'hr@techcorp.com',
            salary: { min: 80000, max: 120000, currency: 'PKR' }
        },
        {
            title: 'Marketing Specialist',
            company: 'Global Solutions',
            location: 'Lahore, Pakistan',
            description: 'Seeking creative marketing specialist',
            jobType: 'Full-time',
            experienceLevel: 'Entry Level',
            category: 'Marketing',
            postedBy: alumni[1]._id,
            applicationEmail: 'careers@globalsolutions.com',
            salary: { min: 60000, max: 90000, currency: 'PKR' }
        },
        {
            title: 'Data Analyst',
            company: 'DataCorp',
            location: 'Remote',
            description: 'Data analyst position for fresh graduates',
            jobType: 'Remote',
            experienceLevel: 'Entry Level',
            category: 'Technology',
            postedBy: alumni[3]._id,
            applicationEmail: 'jobs@datacorp.com',
            salary: { min: 70000, max: 100000, currency: 'PKR' }
        }
    ]);
    
    // Create sample events
    await Event.create([
        {
            title: 'Alumni Networking Night',
            description: 'Annual networking event for all alumni',
            date: new Date('2025-07-15'),
            time: '18:00',
            location: 'Namal University Campus',
            category: 'networking',
            maxAttendees: 100,
            organizer: 'Alumni Association',
            organizerContact: { email: 'alumni@namal.edu.pk' }
        },
        {
            title: 'Career Development Workshop',
            description: 'Professional development workshop',
            date: new Date('2025-08-20'),
            time: '14:00',
            location: 'Virtual Event',
            category: 'career',
            maxAttendees: 50,
            organizer: 'Career Services',
            organizerContact: { email: 'careers@namal.edu.pk' }
        }
    ]);
    
    console.log('✅ Sample data seeded successfully!');
}

async function runAggregationDemo() {
    try {
        console.log('🚀 Starting MongoDB Aggregation Demo...\n');
        
        // Connect to database
        await connectDB();
        
        // Seed sample data
        await seedSampleData();
        
        console.log('\n📊 AGGREGATION PIPELINE DEMONSTRATIONS');
        console.log('=====================================\n');
        
        // 1. GROUP BY GRADUATION YEAR
        console.log('1️⃣ Alumni Count by Graduation Year');
        console.log('----------------------------------');
        
        const alumniByYear = await Alumni.aggregate([
            {
                $group: {
                    _id: '$graduationYear',
                    count: { $sum: 1 },
                    alumni: { $push: '$name' }
                }
            },
            {
                $sort: { _id: -1 }
            }
        ]);
        
        alumniByYear.forEach(year => {
            console.log(`📅 ${year._id}: ${year.count} alumni`);
            console.log(`   Names: ${year.alumni.join(', ')}`);
        });
        
        // 2. GROUP BY DEGREE WITH STATISTICS
        console.log('\n2️⃣ Alumni Statistics by Degree');
        console.log('------------------------------');
        
        const alumniByDegree = await Alumni.aggregate([
            {
                $group: {
                    _id: '$degree',
                    count: { $sum: 1 },
                    avgGraduationYear: { $avg: '$graduationYear' },
                    companies: { $addToSet: '$company' },
                    locations: { $addToSet: '$location' }
                }
            },
            {
                $project: {
                    degree: '$_id',
                    count: 1,
                    avgGraduationYear: { $round: ['$avgGraduationYear', 1] },
                    uniqueCompanies: { $size: '$companies' },
                    uniqueLocations: { $size: '$locations' },
                    companies: 1,
                    _id: 0
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        alumniByDegree.forEach(degree => {
            console.log(`🎓 ${degree.degree}:`);
            console.log(`   Alumni Count: ${degree.count}`);
            console.log(`   Avg Graduation Year: ${degree.avgGraduationYear}`);
            console.log(`   Companies: ${degree.companies.join(', ')}`);
            console.log(`   Unique Companies: ${degree.uniqueCompanies}`);
            console.log(`   Unique Locations: ${degree.uniqueLocations}`);
        });
        
        // 3. LOCATION-BASED ANALYSIS
        console.log('\n3️⃣ Alumni Distribution by Location');
        console.log('----------------------------------');
        
        const alumniByLocation = await Alumni.aggregate([
            {
                $group: {
                    _id: '$location',
                    count: { $sum: 1 },
                    degrees: { $addToSet: '$degree' },
                    companies: { $addToSet: '$company' }
                }
            },
            {
                $project: {
                    location: '$_id',
                    count: 1,
                    degreeVariety: { $size: '$degrees' },
                    companyVariety: { $size: '$companies' },
                    degrees: 1,
                    _id: 0
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        alumniByLocation.forEach(location => {
            console.log(`📍 ${location.location}:`);
            console.log(`   Alumni: ${location.count}`);
            console.log(`   Degree Variety: ${location.degreeVariety}`);
            console.log(`   Company Variety: ${location.companyVariety}`);
            console.log(`   Degrees: ${location.degrees.join(', ')}`);
        });
        
        // 4. SKILLS ANALYSIS
        console.log('\n4️⃣ Most Popular Skills Among Alumni');
        console.log('-----------------------------------');
        
        const skillsAnalysis = await Alumni.aggregate([
            {
                $unwind: '$skills'
            },
            {
                $group: {
                    _id: '$skills',
                    count: { $sum: 1 },
                    alumni: { $push: '$name' }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);
        
        skillsAnalysis.forEach((skill, index) => {
            console.log(`${index + 1}. ${skill._id}: ${skill.count} alumni`);
            console.log(`   Alumni: ${skill.alumni.join(', ')}`);
        });
        
        // 5. JOB MARKET ANALYSIS
        console.log('\n5️⃣ Job Market Analysis');
        console.log('----------------------');
        
        const jobAnalysis = await Job.aggregate([
            {
                $group: {
                    _id: {
                        category: '$category',
                        experienceLevel: '$experienceLevel'
                    },
                    count: { $sum: 1 },
                    avgMinSalary: { $avg: '$salary.min' },
                    avgMaxSalary: { $avg: '$salary.max' },
                    companies: { $addToSet: '$company' }
                }
            },
            {
                $project: {
                    category: '$_id.category',
                    experienceLevel: '$_id.experienceLevel',
                    count: 1,
                    avgMinSalary: { $round: ['$avgMinSalary', 0] },
                    avgMaxSalary: { $round: ['$avgMaxSalary', 0] },
                    companies: 1,
                    _id: 0
                }
            },
            {
                $sort: { category: 1, experienceLevel: 1 }
            }
        ]);
        
        jobAnalysis.forEach(job => {
            console.log(`💼 ${job.category} - ${job.experienceLevel}:`);
            console.log(`   Job Count: ${job.count}`);
            console.log(`   Avg Salary Range: PKR ${job.avgMinSalary} - ${job.avgMaxSalary}`);
            console.log(`   Companies: ${job.companies.join(', ')}`);
        });
        
        // 6. COMPLEX AGGREGATION WITH LOOKUP
        console.log('\n6️⃣ Alumni with Their Posted Jobs');
        console.log('--------------------------------');
        
        const alumniWithJobs = await Alumni.aggregate([
            {
                $lookup: {
                    from: 'jobs',
                    localField: '_id',
                    foreignField: 'postedBy',
                    as: 'postedJobs'
                }
            },
            {
                $match: {
                    'postedJobs.0': { $exists: true }
                }
            },
            {
                $project: {
                    name: 1,
                    company: 1,
                    graduationYear: 1,
                    jobCount: { $size: '$postedJobs' },
                    jobTitles: '$postedJobs.title'
                }
            },
            {
                $sort: { jobCount: -1 }
            }
        ]);
        
        alumniWithJobs.forEach(alumni => {
            console.log(`👤 ${alumni.name} (${alumni.company}):`);
            console.log(`   Posted Jobs: ${alumni.jobCount}`);
            console.log(`   Job Titles: ${alumni.jobTitles.join(', ')}`);
        });
        
        // 7. TIME-BASED ANALYSIS
        console.log('\n7️⃣ Career Progression Analysis');
        console.log('------------------------------');
        
        const careerProgression = await Alumni.aggregate([
            {
                $addFields: {
                    yearsInCareer: {
                        $subtract: [new Date().getFullYear(), '$graduationYear']
                    }
                }
            },
            {
                $bucket: {
                    groupBy: '$yearsInCareer',
                    boundaries: [0, 2, 4, 6, 10],
                    default: '10+',
                    output: {
                        count: { $sum: 1 },
                        alumni: { $push: { name: '$name', position: '$currentPosition' } },
                        avgGradYear: { $avg: '$graduationYear' }
                    }
                }
            }
        ]);
        
        careerProgression.forEach(bucket => {
            const range = bucket._id === '10+' ? '10+ years' : `${bucket._id}-${bucket._id + 2} years`;
            console.log(`⏰ ${range} in career:`);
            console.log(`   Alumni Count: ${bucket.count}`);
            console.log(`   Avg Graduation Year: ${Math.round(bucket.avgGradYear)}`);
            bucket.alumni.forEach(alumni => {
                console.log(`   - ${alumni.name}: ${alumni.position}`);
            });
        });
        
        // 8. ADVANCED STATISTICAL ANALYSIS
        console.log('\n8️⃣ Advanced Statistical Analysis');
        console.log('--------------------------------');
        
        const statistics = await Alumni.aggregate([
            {
                $group: {
                    _id: null,
                    totalAlumni: { $sum: 1 },
                    avgGraduationYear: { $avg: '$graduationYear' },
                    minGraduationYear: { $min: '$graduationYear' },
                    maxGraduationYear: { $max: '$graduationYear' },
                    uniqueDegrees: { $addToSet: '$degree' },
                    uniqueCompanies: { $addToSet: '$company' },
                    uniqueLocations: { $addToSet: '$location' }
                }
            },
            {
                $project: {
                    totalAlumni: 1,
                    avgGraduationYear: { $round: ['$avgGraduationYear', 1] },
                    minGraduationYear: 1,
                    maxGraduationYear: 1,
                    degreeCount: { $size: '$uniqueDegrees' },
                    companyCount: { $size: '$uniqueCompanies' },
                    locationCount: { $size: '$uniqueLocations' },
                    degrees: '$uniqueDegrees',
                    _id: 0
                }
            }
        ]);
        
        const stats = statistics[0];
        console.log(`📈 Overall Statistics:`);
        console.log(`   Total Alumni: ${stats.totalAlumni}`);
        console.log(`   Average Graduation Year: ${stats.avgGraduationYear}`);
        console.log(`   Graduation Year Range: ${stats.minGraduationYear} - ${stats.maxGraduationYear}`);
        console.log(`   Unique Degrees: ${stats.degreeCount}`);
        console.log(`   Unique Companies: ${stats.companyCount}`);
        console.log(`   Unique Locations: ${stats.locationCount}`);
        console.log(`   Degrees Offered: ${stats.degrees.join(', ')}`);
        
        console.log('\n✅ Aggregation Demo completed successfully!');
        
    } catch (error) {
        console.error('❌ Error in aggregation demo:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔒 Database connection closed');
    }
}

// Run the demo
if (require.main === module) {
    runAggregationDemo().catch(console.error);
}

module.exports = runAggregationDemo;