import type {
  Transaction,
  UnitOfWork,
} from "@application/ports/unit-of-work.contract";

export class UnitOfWorkStub implements UnitOfWork {
  async execute<T>(work: (transaction: Transaction) => Promise<T>): Promise<T> {
    return await work({});
  }
}
