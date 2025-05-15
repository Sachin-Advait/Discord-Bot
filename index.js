import express from "express";
import { Client, GatewayIntentBits } from 'discord.js';
import URL from "./models/urls_model.js";
import { connectMongoDb } from "./connection.js";
import { handleGetURL } from "./routes/url_route.js";
import shortid from "shortid";
import dotenv from 'dotenv';
dotenv.config()

const app = express();
const PORT = 8000;

// Connection
connectMongoDb();

// Middleware - plugin
app.use(express.json());

const router = express.Router();
router.get("/:shortId", handleGetURL);
app.use("/", router);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

client.on("messageCreate", async message => {
    if (message.author.bot) return;

    if (message.content.startsWith('create')) {
        const url = message.content.split('create')[1]?.trim();
        const shortID = shortid();

        await URL.create({
            shortId: shortID,
            redirectUrl: url,
        });

        return message.reply({
            content: `http://localhost:8000/${shortID}`,
        })
    }
    message.reply({
        content: 'Hello from sachin bot'
    })
});

client.on("interactionCreate", interaction => {
    interaction.reply({
        content: 'Pong!!'
    })
});

client.login(process.env.TOKEN)