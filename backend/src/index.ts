import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', async (req, res) => {
    try {
        // Just a safe query to test DB connection if users exist
        // Note: BigInt handling in JSON might need serialization fix, but this is a starter.
        const users = await prisma.user.findMany();

        // Simple BigInt serialization for demo
        const serialized = JSON.stringify(users, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        );

        res.setHeader('Content-Type', 'application/json');
        res.send(serialized);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
