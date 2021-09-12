export class Listeners {
  name: string = null;
  once: boolean;


  constructor(name: string, settings: {once: boolean}) {
    this.name = name;
    this.once = settings.once;

  }

}
