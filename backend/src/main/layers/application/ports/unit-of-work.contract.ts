export type Transaction = unknown;

export interface UnitOfWork {
  execute<T>(work: (transaction: Transaction) => Promise<T>): Promise<T>;
}
