import mongoose from "mongoose";

const db = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://bookmead:nGbJmzaaGg1Jf9U0@cluster0.st4wk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useUnifiedTopology: true,
        });

        console.log(`database connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export { db };