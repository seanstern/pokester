import { Document } from 'mongoose';

interface ITimestampedDocument extends Document {
    createdAt: Readonly<Date>;
    updatedAt: Readonly<Date>;
}

export default ITimestampedDocument;