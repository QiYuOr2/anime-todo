const filePath = `${(uni as any).env.USER_DATA_PATH}/anime.json`;

export class Local {
  #fs?: UniApp.FileSystemManager;
  static #instance: Local;

  constructor(fs?: () => UniApp.FileSystemManager) {
    console.log('create Local');
    if (fs) {
      this.#fs = fs();
    }
  }

  static create(fs?: () => UniApp.FileSystemManager) {
    if (!this.#instance) {
      this.#instance = new Local(fs);
    }
    return this.#instance;
  }

  write(data: string) {
    try {
      this.#fs?.writeFileSync(filePath, data, 'utf-8');
      return [, true];
    } catch (error) {
      return [error, false];
    }
  }

  read(): [any, string] {
    try {
      return [, this.#fs?.readFileSync(filePath, 'utf-8') as string];
    } catch (error) {
      console.log(error);
      return ['文件读取失败', ''];
    }
  }
}
