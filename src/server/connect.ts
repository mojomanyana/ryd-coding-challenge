import mongoose from 'mongoose';

const connectToMongo = async (dbUri: string, dbName?: string): Promise<void> => {
    await mongoose.connect(dbUri, { dbName, useNewUrlParser: true, useUnifiedTopology: true });
};

const disconnectFromMongo = async (): Promise<void> => {
    await mongoose.connection.close();
};

export { connectToMongo, disconnectFromMongo };
