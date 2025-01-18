import cron from 'node-cron';
import Ride from '../models/Ride.js';

cron.schedule('*/5 * * * *', async () => {
    const cutoff = new Date();
    cutoff.setMinutes(cutoff.getMinutes() - 5);

    try {
        const startTime = Date.now();
        const deletedRides = await Ride.deleteMany({
            createdAt: { $lt: cutoff },
            status: { $in: ['rejected', 'started'] }
        });
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        console.log(`${deletedRides.deletedCount} old rides removed in ${timeTaken}ms.`);
    } catch (error) {
        console.error('Error removing old rides:', error);
    }
});
