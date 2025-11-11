class DependencyInjector {
  private _server: Server;

  constructor() {
    this._server = this.inject();
  }

  inject() {
    return new Server();
  }
}
