export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  private static minQuality = 0;
  private static maxQuality = 50;

  private static limitQuality(newQuality): number {
    // The Quality of an item is never negative
    // The Quality of an item is never more than 50
    return Math.max(
      GildedRose.minQuality,
      Math.min(newQuality, GildedRose.maxQuality)
    );
  }

  updateQuality(): Item[] {
    this.items = this.items.map((item) => {
      // Lower sell by date, with Sulfuras being the only exception as it never alters
      if (item.name === "Sulfuras, Hand of Ragnaros") {
        // Sulfuras quality is always 80
        item.quality = 80;
        return item;
      }
      item.sellIn--;

      // Items that have better quality over time
      if (item.name === "Aged Brie") {
        item.quality = Math.max(
          GildedRose.minQuality,
          Math.min(item.quality + 1, GildedRose.maxQuality)
        );
        return item;
      }
      // Backstage passes increase in quality over time
      // Unless the concert is over
      // if "lib": ["es2017"] is added to tsconfig.json includes() can be used instead
      if (item.name.toLowerCase().indexOf("backstage passes") !== -1) {
        let increase;
        if (item.sellIn > 10) {
          increase = 1;
        } else if (item.sellIn > 5) {
          increase = 2;
        } else if (item.sellIn >= 0) {
          increase = 3;
        } else {
          item.quality = 0;
          return item;
        }
        item.quality = GildedRose.limitQuality(item.quality + increase);
        return item;
      }
      // Once the sell by date has passed, Quality degrades twice as fast
      let degradeFactor = 1;
      if (item.sellIn < 0) {
        degradeFactor = 2;
      }

      // "Conjured" items degrade in Quality twice as fast as normal items
      if (item.name.toLowerCase().indexOf("conjured") !== -1) {
        item.quality = GildedRose.limitQuality(
          item.quality - degradeFactor * 2
        );
        return item;
      }
      // Normal item
      item.quality = GildedRose.limitQuality(item.quality - degradeFactor * 1);
      return item;
    });

    return this.items;
  }
}
