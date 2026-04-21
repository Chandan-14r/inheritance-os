import cron from 'node-cron';
import User from '../models/User.js';
import Beneficiary from '../models/Beneficiary.js';
import { sendDeadManSwitchAlert } from './mailer.js';

// The cron job runs every night at midnight OR manually triggered via API
export const checkDeadManSwitches = async () => {
    console.log('⏰ Running Dead Man\'s Switch Cron Job evaluation...');
    try {
        // Find all users who have the switch enabled
        const users = await User.find({ switchEnabled: true });
        let triggeredCount = 0;

        for (const user of users) {
            if (!user.lastCheckIn || !user.deadManSwitchDays) continue;

            const daysSince = Math.floor((Date.now() - new Date(user.lastCheckIn).getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysSince >= user.deadManSwitchDays) {
                console.log(`⚠️ User ${user.name} (${user.email}) has exceeded their ${user.deadManSwitchDays} day threshold (${daysSince} days).`);
                
                // Switch activated!
                // 1. Get their beneficiaries
                const beneficiaries = await Beneficiary.find({ user: user._id });
                
                // 2. Alert the executor
                if (user.executorEmail) {
                    await sendDeadManSwitchAlert(user.name, user.executorEmail, beneficiaries.length);
                }

                // 3. Disable switch to prevent spamming everyday
                user.switchEnabled = false;
                user.checkInHistory.push({
                    date: new Date(),
                    method: 'system-trigger-alert-sent'
                });
                await user.save();
                triggeredCount++;
            }
        }
        
        console.log(`✅ Cron evaluation complete. ${triggeredCount} switches triggered.`);
    } catch (err) {
        console.error('❌ Error during Dead Man\'s Switch evaluation:', err);
    }
};

// Schedule it to run at 00:00 every day
cron.schedule('0 0 * * *', () => {
    checkDeadManSwitches();
});
