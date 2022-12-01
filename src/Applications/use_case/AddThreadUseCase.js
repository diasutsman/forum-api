const AddThread = require("../../Domains/threads/entities/AddThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addedThread = await this._threadRepository.addThread(new AddThread(useCasePayload));
    return addedThread;
  }
}

module.exports = AddThreadUseCase;
