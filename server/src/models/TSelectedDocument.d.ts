import { Document } from 'mongoose';

type TSelectedDocument<M, K extends keyof M> = Pick<M, K> & Document;

export default TSelectedDocument;
