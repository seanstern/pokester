import { Document } from 'mongoose';

type ISelectedDocument<M, K extends keyof M> = Pick<M, K> & Document;

export default ISelectedDocument;
