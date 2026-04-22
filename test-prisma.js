const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin(email, password) {
    try {
        console.log("Step 1: finding user...");
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log("User not found");
            return;
        }
        console.log("User found, Step 2: validating password...", user.email);

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            console.log("Password invalid");
            return;
        }
        console.log("Password valid");

        // Check audit log
        console.log("Step 3: test audit log...");
        try {
            await prisma.auditLog.create({
                data: {
                    userId: user.id || null,
                    action: 'TEST_LOGIN',
                    details: 'User test from script',
                },
            });
            console.log("Audit log success");
        } catch (e) {
            console.error("Audit log failed!", e);
        }
    } catch (error) {
        console.error("Login Simulation Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testLogin('admin@amf.lk', 'Admin@123');
