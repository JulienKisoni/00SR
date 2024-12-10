export class GenericError extends Error {
  message: string;
  publicMessage: string;
  constructor(message: string, publicMessage?: string) {
    super(message);
    this.message = message;
    this.publicMessage = publicMessage || message;
  }
}

// For file refs: images/userId/image-name-{shortId}
