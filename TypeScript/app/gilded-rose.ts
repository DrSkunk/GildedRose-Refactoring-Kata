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

  private static minimumQuality = 0;
  private static maximumQuality = 50;

  private static limitQuality(newQuality): number {
    // The Quality of an item is never negative
    // The Quality of an item is never more than 50
    return Math.max(
      GildedRose.minimumQuality,
      Math.min(newQuality, GildedRose.maximumQuality)
    );
  }

  static handleSulfuras(item: Item): Item {
    // Sulfuras quality is always 80
    item.quality = 80;
    return item;
  }

  static handleAgedBrie(item: Item): Item {
    item.quality = Math.max(
      GildedRose.minimumQuality,
      Math.min(item.quality + 1, GildedRose.maximumQuality)
    );
    return item;
  }

  // Backstage passes increase in quality over time
  // Unless the concert is over
  static handleBackstagePasses(item: Item): Item {
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

  static handleNormalItem(item: Item): Item {
    // Once the sell by date has passed, Quality degrades twice as fast
    const degradeFactor = item.sellIn < 0 ? 2 : 1;

    // "Conjured" items degrade in Quality twice as fast as normal items
    if (item.name.toLowerCase().indexOf("conjured") !== -1) {
      item.quality = GildedRose.limitQuality(item.quality - degradeFactor * 2);
      return item;
    }
    // Normal item
    item.quality = GildedRose.limitQuality(item.quality - degradeFactor * 1);
    return item;
  }

  updateQuality(): Item[] {
    this.items = this.items.map((item) => {
      // Lower sellIn date, with Sulfuras being the only exception as it never alters
      if (item.name === "Sulfuras, Hand of Ragnaros") {
        return GildedRose.handleSulfuras(item);
      }
      // First the sellIn date is reduced before calculating the new quality
      item.sellIn--;

      // Two items improve in quality over time
      if (item.name === "Aged Brie") {
        return GildedRose.handleAgedBrie(item);
      }
      // if "lib": ["es2017"] is added to tsconfig.json, includes() can be used instead
      if (item.name.toLowerCase().indexOf("backstage passes") !== -1) {
        return GildedRose.handleBackstagePasses(item);
      }
      // All special items are handled
      return GildedRose.handleNormalItem(item);
    });
    return this.items;
  }
}
