const EventEmitter = require('events');

console.log('=== Node.js Architecture Concepts Demo ===\n');

// 1. Event Loop Demonstration using setTimeout
console.log('1. Event Loop Demonstration:');
console.log('Start of script');

setTimeout(() => {
    console.log('   Timeout 1 (0ms) - executed in next tick');
}, 0);

setTimeout(() => {
    console.log('   Timeout 2 (100ms) - executed after 100ms');
}, 100);

setImmediate(() => {
    console.log('   Immediate - executed in check phase');
});

process.nextTick(() => {
    console.log('   Next Tick - executed before any timeout');
});

console.log('End of script\n');

// 2. Callback Example
console.log('2. Callback Pattern Demonstration:');

function fetchUserData(userId, callback) {
    setTimeout(() => {
        const userData = {
            id: userId,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user'
        };
        
        if (userId < 1) {
            return callback(new Error('Invalid user ID'), null);
        }
        
        callback(null, userData);
    }, 200);
}

fetchUserData(1, (error, data) => {
    if (error) {
        console.log('   Error:', error.message);
        return;
    }
    console.log('   User data retrieved:', data);
});

function getUserPosts(userId, callback) {
    setTimeout(() => {
        const posts = [
            { id: 1, title: 'First Post', content: 'Hello World' },
            { id: 2, title: 'Second Post', content: 'Node.js is awesome' }
        ];
        callback(null, posts);
    }, 150);
}

fetchUserData(2, (err, user) => {
    if (err) {
        console.log('   Error fetching user:', err.message);
        return;
    }
    
    getUserPosts(user.id, (err, posts) => {
        if (err) {
            console.log('   Error fetching posts:', err.message);
            return;
        }
        console.log('   User posts retrieved:', posts);
    });
});

// 3. Custom EventEmitter Usage
console.log('\n3. Custom EventEmitter Demonstration:');

class AlumniNotifier extends EventEmitter {
    constructor() {
        super();
        this.alumni = [];
    }

    addAlumni(alumniData) {
        this.alumni.push(alumniData);
        this.emit('alumniAdded', alumniData);
    }

    removeAlumni(alumniId) {
        const index = this.alumni.findIndex(a => a.id === alumniId);
        if (index !== -1) {
            const removed = this.alumni.splice(index, 1)[0];
            this.emit('alumniRemoved', removed);
        }
    }

    sendNotification(message) {
        this.emit('notification', message, this.alumni.length);
    }
}

const notifier = new AlumniNotifier();

notifier.on('alumniAdded', (alumni) => {
    console.log(`   New alumni added: ${alumni.name} (${alumni.email})`);
});

notifier.on('alumniRemoved', (alumni) => {
    console.log(`   Alumni removed: ${alumni.name}`);
});

notifier.on('notification', (message, count) => {
    console.log(`   Notification to ${count} alumni: ${message}`);
});

setTimeout(() => {
    notifier.addAlumni({ id: 1, name: 'Alice Johnson', email: 'alice@example.com' });
    notifier.addAlumni({ id: 2, name: 'Bob Smith', email: 'bob@example.com' });
    notifier.sendNotification('Welcome to Namal Nexus!');
    notifier.removeAlumni(1);
}, 300);