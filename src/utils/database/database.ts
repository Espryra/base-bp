import {
  world,
  type Entity,
  type ItemStack,
  type World,
} from "@minecraft/server";

export default class Database<T> {
  private cache: Record<string, T> = {};

  public constructor(
    private name: string,
    private useCache = false,
    private host: Entity | World | ItemStack = world,
  ) {}

  public Set(key: string, value?: Partial<T>): Database<T> {
    this.host.setDynamicProperty(
      this.FormatKey(key),
      !value ? undefined : JSON.stringify(value),
    );

    if (this.useCache) {
      this.cache[key] = value as T;
    }

    return this;
  }
  public Get(key: string): T | undefined {
    if (this.useCache) {
      const data = this.cache[key];

      if (data) {
        return data;
      }
    }

    const data = this.host.getDynamicProperty(this.FormatKey(key));
    const parsed = data ? (JSON.parse(data as string) as T) : undefined;

    if (this.useCache && parsed) {
      this.cache[key] = parsed;
    }

    return parsed;
  }
  public Has(key: string): boolean {
    return this.Get(key) !== undefined;
  }
  public Keys(): string[] {
    return this.host
      .getDynamicPropertyIds()
      .filter((id) => id.startsWith(this.name))
      .map((id) => id.replace(`${this.name}:`, ""));
  }
  public Values(): T[] {
    return this.Keys().map((key) => this.Get(key)!);
  }
  public Entries(): [string, T][] {
    const record: Record<string, T> = {};

    this.Keys().forEach((key) => {
      record[key] = this.Get(key)!;
    });

    return Object.entries(record);
  }
  public Clear(): Database<T> {
    this.cache = {};

    this.Keys().forEach((key) => {
      this.Set(key);
    });

    return this;
  }

  private FormatKey(key: string): string {
    return `${this.name}:${key}`;
  }
}
